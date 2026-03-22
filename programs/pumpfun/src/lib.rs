use anchor_lang::prelude::*;

declare_id!("2DpuFtJtaodDo44Ae9VxV1JBjxu3SqRaoJa1ktLTZ7kb");

#[program]
pub mod pumpfun {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
