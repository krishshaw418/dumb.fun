use anchor_lang::prelude::*;

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
    InvalidBasePrice
}

#[event]
pub struct TokenCreated {
    pub mint: Pubkey,
    pub creator: Pubkey,
    pub k: u64,
    pub base_price: u64,
    pub timestamp: i64
}