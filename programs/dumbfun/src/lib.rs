use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};

declare_id!("2DpuFtJtaodDo44Ae9VxV1JBjxu3SqRaoJa1ktLTZ7kb");

#[program]
pub mod dumbfun {
    use super::*;

    pub fn initialize(ctx: Context<DeriveBondingCurve>, k: u64, base_price: u64) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        require!(k > 0, CustomError::InvalidK);
        require!(base_price > 0, CustomError::InvalidBasePrice);

        bonding_curve.mint = ctx.accounts.mint.key();
        bonding_curve.creator = ctx.accounts.user.key();

        bonding_curve.supply = 0;
        bonding_curve.reserve = 0;

        bonding_curve.base_price = base_price;
        bonding_curve.k = k;

        bonding_curve.is_migrated = false;

        bonding_curve.bump = ctx.bumps.bonding_curve;

        emit!(TokenCreated {
            mint: bonding_curve.mint,
            creator: bonding_curve.creator,
            k,
            base_price,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }

    pub fn buy(ctx: Context<Buy>, sol_amount: u64, min_tokens_out: u64,) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;

        // 1. Validation
        require!(!bonding_curve.is_migrated, CustomError::CurveMigrated);
        require!(sol_amount > 0, CustomError::InvalidAmount);

        // 2. Transfer SOL to bonding curve (reserve)
        let cpi_ctx = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: bonding_curve.to_account_info()
            }
        );

        system_program::transfer(cpi_ctx, sol_amount)?;

        // 3. Compute price
        let supply = bonding_curve.supply as u128;
        let k = bonding_curve.k as u128;
        let base = bonding_curve.base_price as u128;

        let current_price = k * supply + base; // Linear bonding curve
        require!(current_price > 0, CustomError::MathOverflow);
        
        // 4. token_out
        let tokens_out = (sol_amount as u128)
        .checked_div(current_price)
        .ok_or(CustomError::MathOverflow)? as u64;

        require!(tokens_out > 0, CustomError::InsufficientOutput);
        require!(tokens_out >= min_tokens_out, CustomError::SlippageExceeded);

        // 5. Update state
        bonding_curve.supply = bonding_curve
            .supply
            .checked_add(tokens_out)
            .ok_or(CustomError::MathOverflow)?;

        bonding_curve.reserve = bonding_curve
        .reserve
        .checked_add(sol_amount)
        .ok_or(CustomError::MathOverflow)?;

        // 6. Mint tokens to user
        let mint_key = ctx.accounts.mint.key();
        let bump = bonding_curve.bump;
        let seeds = &[
            b"bonding_curve",
            mint_key.as_ref(),
            &[bump]
        ];

        let signer_seeds: &[&[&[u8]]] = &[seeds];

        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
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
}

 
#[derive(Accounts)]
pub struct DeriveBondingCurve<'info> {
    #[account(
        init,
        seeds = [b"bonding_curve", mint.key().as_ref()],
        bump,
        payer = user,
        space = 8 + BondingCurve::INIT_SPACE
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: only used for PDA seed
    pub mint: AccountInfo<'info>,

    pub system_program: Program<'info, System>
}

#[derive(Accounts)]
pub struct Buy<'info> {
    #[account(
        mut,
        seeds = [b"bonding_curve", mint.key().as_ref()],
        bump = bonding_curve.bump
    )]
    pub bonding_curve: Account<'info, BondingCurve>,

    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: used for PDA seed
    pub mint: AccountInfo<'info>,

    #[account(
        mut,
        constraint = user_token_account.mint == mint_account.key(),
        constraint = user_token_account.owner == user.key()
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = mint_account.mint_authority.unwrap() == bonding_curve.key()
    )]
    pub mint_account: Account<'info, Mint>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>
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

    #[msg("Slippage Exceeded")]
    SlippageExceeded
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