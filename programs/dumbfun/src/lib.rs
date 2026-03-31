use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Burn};

declare_id!("2DpuFtJtaodDo44Ae9VxV1JBjxu3SqRaoJa1ktLTZ7kb");

#[program]
pub mod dumbfun {
    use super::*;

    // Instruction to initialize a bonding curve
    pub fn initialize(ctx: Context<DeriveBondingCurve>, k: u64, base_price: u64) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        // Input validation
        require!(k > 0, CustomError::InvalidK);
        require!(base_price > 0, CustomError::InvalidBasePrice); // so, that the first buy for this token, has a price.

        // Initializing the pda
        bonding_curve.mint = ctx.accounts.mint.key();
        bonding_curve.creator = ctx.accounts.user.key();

        bonding_curve.supply = 0;
        bonding_curve.reserve = 0;

        bonding_curve.base_price = base_price;
        bonding_curve.k = k;

        bonding_curve.is_migrated = false;

        bonding_curve.bump = ctx.bumps.bonding_curve;

        // Broadcasting the event
        emit!(TokenCreated {
            mint: bonding_curve.mint,
            creator: bonding_curve.creator,
            k,
            base_price,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Instruction to buy token
    pub fn buy(ctx: Context<Buy>, sol_amount: u64, min_tokens_out: u64,) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        // 1. Validation
        require!(!bonding_curve.is_migrated, CustomError::CurveMigrated);
        require!(sol_amount > 0, CustomError::InvalidAmount);

        // 2. Transfer SOL to bonding curve reserve via CPI call to system_program
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(), // System program's on-chain program id
            Transfer {
                from: ctx.accounts.user.to_account_info(), // user's account
                to: bonding_curve.to_account_info() // pda's reserve
            }
        );

        system_program::transfer(cpi_ctx, sol_amount)?;

        // 3. Compute price
        let supply = bonding_curve.supply as u128;
        let k = bonding_curve.k as u128; // slope of the linear curve
        let base = bonding_curve.base_price as u128; // base price

        let current_price = k * supply + base; // as per linear bonding curve
        require!(current_price > 0, CustomError::MathOverflow);
        
        // 4. token_out
        let tokens_out = (sol_amount as u128)
        .checked_div(current_price)
        .ok_or(CustomError::MathOverflow)? as u64; // calculating the amount of token to be minted as per unit divison, lets say current_price = 5 USD and sol_amount = 50 SOL, the token_out = 50 / 5 = 10 tokens

        require!(tokens_out > 0, CustomError::InsufficientOutput);
        require!(tokens_out >= min_tokens_out, CustomError::SlippageExceeded);

        // 5. Update state
        bonding_curve.supply = bonding_curve
            .supply
            .checked_add(tokens_out)
            .ok_or(CustomError::MathOverflow)?; // incrementing the supply by tokens_out

        bonding_curve.reserve = bonding_curve
            .reserve
            .checked_add(sol_amount)
            .ok_or(CustomError::MathOverflow)?; // incrementing the pda reserve by sol_amount

        // 6. Mint tokens to user
        let mint_key = ctx.accounts.mint_account.key(); // the mint of the new token
        let bump = bonding_curve.bump;
        let seeds = &[
            b"bonding_curve",
            mint_key.as_ref(),
            &[bump]
        ];

        let signer_seeds: &[&[&[u8]]] = &[seeds]; // This tells runtime: "Re-derive this PDA using these seeds and treat it as a signer"

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(), // on-chain program id of the spl token program
            MintTo {
                mint: ctx.accounts.mint_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: bonding_curve.to_account_info()
            },
            signer_seeds
        );

        token::mint_to(cpi_ctx, tokens_out)?;

        // 7. compute new price (post-state)
        let new_price = base + k * (bonding_curve.supply as u128);

        // 8. emit event
        emit!(BuyEvent {
            mint: bonding_curve.mint,
            user: ctx.accounts.user.key(),
            sol_amount,
            token_amount: tokens_out,
            new_supply: bonding_curve.supply,
            new_reserve: bonding_curve.reserve,
            price: new_price as u64,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    // Instruction to sell token
    pub fn sell(ctx: Context<Sell>, token_amount: u64) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        // 1. Validation
        require!(!bonding_curve.is_migrated, CustomError::CurveMigrated);
        require!(token_amount > 0, CustomError::InvalidAmount);

        // 2. Compute current price
        let supply = bonding_curve.supply as u128;
        let k = bonding_curve.k as u128;
        let base = bonding_curve.base_price as u128;

        let current_price = base + k * supply;

        // 3. Compute the SOL out
        let sol_out = (token_amount as u128)
        .checked_mul(current_price)
        .ok_or(CustomError::MathOverflow)? as u64;

        require!(sol_out > 0, CustomError::InsufficientOutput);

        // 4. Reserve safety check
        require!(bonding_curve.reserve > sol_out, CustomError::InsufficientReserve);

        // 5. Burn tokens from user
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint_account.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info()
            }
        );

        token::burn(cpi_ctx, token_amount)?;

        // 6. Transfer SOL to user
        **bonding_curve.to_account_info().try_borrow_mut_lamports()? -= sol_out; // Direct lamport manipulation as it's fastest way
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += sol_out; // Direct lamport manipulation as it's fastest way

        // 7. State update 
        bonding_curve.supply = bonding_curve
            .supply
            .checked_sub(token_amount)
            .ok_or(CustomError::MathOverflow)?;

        bonding_curve.reserve = bonding_curve
        .reserve
        .checked_sub(sol_out)
        .ok_or(CustomError::MathOverflow)?;

        // 8. Compute price
        let new_price = base + k * (bonding_curve.supply as u128);

        // 9. Emit evnt
        emit!(SellEvent {
            mint: bonding_curve.mint,
            user: ctx.accounts.user.key(),
            token_amount,
            sol_amount: sol_out,
            new_supply: bonding_curve.supply,
            new_reserve: bonding_curve.reserve,
            price: new_price as u64,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

 
#[derive(Accounts)]
pub struct DeriveBondingCurve<'info> {
    #[account(
        init,
        seeds = [b"bonding_curve", mint.key().as_ref()], // a static label ("bonding_curve") & the mint
        bump,
        payer = user,
        space = 8 + BondingCurve::INIT_SPACE // Space calculation for the account's gas fee
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(mut)]
    pub user: Signer<'info>, // To pay for the bonding_curve PDA account

    /// CHECK: only used for PDA seed
    pub mint: AccountInfo<'info>, // The mint of the token used as seed

    pub system_program: Program<'info, System> // To validate transaction for creating a new account and creating the account
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(
        mut, // mutable becoz, the state of the bonding_curve will change due to buy action
        seeds = [b"bonding_curve", mint.key().as_ref()], // this re-derives the PDA to prevent someone from passing a fake bonding curve
        bump = bonding_curve.bump // ensures the correct bump is used for PDA signing later when minting
    )]
    pub bonding_curve: Account<'info, BondingCurve>, // This is the state of the bonding_curve pda

    #[account(mut)] // it's mutable becoz the SOL balance of this account changes
    pub user: Signer<'info>, // The buyer who buys the new token

    /// CHECK: used for PDA seed
    pub mint: AccountInfo<'info>, // Used as seed for PDA derivation

    #[account(
        mut, // as the token balance increases after buy
        constraint = user_token_account.mint == mint_account.key(), // ensures that the user is minting the right token
        constraint = user_token_account.owner == user.key() // ensures user actually owns this token account
    )]
    pub user_token_account: Account<'info, TokenAccount>, // The ata that holds the user's newly bought token

    #[account(
        mut, // Mutable becoz supply of this mint account increases after buy
        constraint = mint_account.key() == mint.key(), // ensuring the mint_authority matches the linked mint as seed to the bonding_curve
        constraint = mint_account.mint_authority.unwrap() == bonding_curve.key() // ensures bonding_curve PDA controls minting
    )]
    pub mint_account: Account<'info, Mint>, // This is the mint of the new token

    pub token_program: Program<'info, Token>, // used for mint_to instruction
    pub system_program: Program<'info, System> // used for transfering SOL from user to the pda reserve (transfer instruction)
}

#[derive(Accounts)]
pub struct Sell<'info> {
    #[account(
        mut,
        seeds = [b"bonding_curve", mint.key().as_ref()],
        bump = bonding_curve.bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    pub user: Signer<'info>,

    // CHECK: used for pda seed
    pub mint: AccountInfo<'info>,

    #[account(
        mut, // as the token balance increases after buy
        constraint = user_token_account.mint == mint_account.key(), // ensures that the user is minting the right token
        constraint = user_token_account.owner == user.key() // ensures user actually owns this token account
    )]
    pub user_token_account: Account<'info, TokenAccount>, // The ata that holds the user's newly bought token

    #[account(
        constraint = mint_account.key() == mint.key(),
        constraint = mint_account.mint_authority.unwrap() == bonding_curve.key()
    )]
    pub mint_account: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
}

#[account]
#[derive(InitSpace)]
pub struct BondingCurve {
    pub mint: Pubkey,
    pub creator: Pubkey,

    // current State
    pub supply: u64, // tokens minted
    pub reserve: u64, // SOL in lamports

    // curve parameter
    pub k: u64, // slope of the linear curve
    pub base_price: u64, // starting price 

    // lifecycle
    pub is_migrated: bool,

    pub bump: u8
}

#[error_code]
pub enum CustomError {
    #[msg("Invalid k value")]
    InvalidK,

    #[msg("Invalid base price")]
    InvalidBasePrice,

    #[msg("Curve already migrated")]
    CurveMigrated,

    #[msg("Invalid amount")]
    InvalidAmount,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Output too small")]
    InsufficientOutput,

    #[msg("Slippage exceeded")]
    SlippageExceeded,

    #[msg("Insufficient reserve")]
    InsufficientReserve
}

#[event]
pub struct TokenCreated {
    pub mint: Pubkey,
    pub creator: Pubkey,
    pub k: u64,
    pub base_price: u64,
    pub timestamp: i64
}

#[event]
pub struct BuyEvent {
    pub mint: Pubkey,
    pub user: Pubkey,
    pub sol_amount: u64,
    pub token_amount: u64,
    pub new_supply: u64,
    pub new_reserve: u64,
    pub price: u64,
    pub timestamp: i64
}

#[event]
pub struct SellEvent {
    pub mint: Pubkey,
    pub user: Pubkey,
    pub token_amount: u64,
    pub sol_amount: u64,
    pub new_supply: u64,
    pub new_reserve: u64,
    pub price: u64,
    pub timestamp: i64
}