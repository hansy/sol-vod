use anchor_lang::prelude::*;
use anchor_lang::solana_program::instruction::Instruction;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_program;
use anchor_lang::solana_program::system_instruction::transfer;
use anchor_lang::solana_program::system_instruction::transfer_many;
use chainlink;

declare_id!("Fk9dwDJoa1U4FcEiMLzEQCCuhGM9JcARD4JnyiUpLr3n");

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4;
const TIMESTAMP_LENGTH: usize = 8;
const LAMPORTS: u64 = 1000000000;
const PUBLISHER_PERCENT: f64 = 0.1;
const REFERRER_PERCENT: f64 = 0.5;

fn send_sol<'info>(from: &Signer<'info>, to: &AccountInfo<'info>, amount: u64) -> ProgramResult {
  let ix = transfer(&from.key, &to.key(), amount);

  return invoke(&ix, &[from.to_account_info(), to.to_account_info()]);
}

fn pub_keys_equal(key1: Pubkey, key2: Pubkey) -> bool {
  return key1.to_string() == key2.to_string();
}

#[program]
pub mod sol_vod {
  use super::*;

  pub fn create_video(ctx: Context<CreateVideo>, ipfs_cid: String, price: u32) -> ProgramResult {
      let video: &mut Account<Video> = &mut ctx.accounts.video;
      let author: &Signer = &ctx.accounts.author;

      video.author = *author.key;

      // should check ipfs_cid isn't missing
      // if so, return Err(ErrorCode::IpfsCidMissing.into())
      video.ipfs_cid = ipfs_cid;
      // should check price isn't missing
      // if so, return Err(ErrorCode::PriceMissing.into())
      video.price = price;

      Ok(())
  }

  pub fn create_purchase(ctx: Context<CreatePurchase>) -> ProgramResult {
    let purchase: &mut Account<Purchase> = &mut ctx.accounts.purchase;
    let video: &Account<Video> = &ctx.accounts.video;
    let author: &AccountInfo = &ctx.accounts.author;
    let oracle: &AccountInfo = &ctx.accounts.oracle;
    let user: &Signer = &ctx.accounts.user;
    let publisher: &AccountInfo = &ctx.accounts.publisher;
    let referrer: &AccountInfo = &ctx.accounts.referrer;
    let clock: Clock = Clock::get().unwrap();
    let video_price: f64 = f64::from(video.price);
    let f_lamports: f64 = LAMPORTS as f64;

    // lamports_sol_in_usd is usd amount for 10^9 SOL
    let lamports_sol_in_usd = chainlink::get_price(&chainlink::id(), oracle)?;

    if let Some(lamports_sol_in_usd) = lamports_sol_in_usd {
      msg!("10^9 SOL is equal to ${}", lamports_sol_in_usd);

      // lampors_sol_in_usd is u128 and math below is in f64, so overflow
      // is possible
      let video_price_lamports: f64 = video_price / 100.0 
        * f_lamports * f_lamports
        / (lamports_sol_in_usd as f64);

      let mut publisher_cut: f64 = 0.0;
      let mut referrer_cut: f64 = 0.0;

      if !pub_keys_equal(author.key(), publisher.key()) {
        msg!("Author and publisher different");

        publisher_cut = video_price_lamports * PUBLISHER_PERCENT;
      }

      if !pub_keys_equal(author.key(), referrer.key()) {
        msg!("Author and referrer different");

        if publisher_cut == 0.0 {
          referrer_cut = video_price_lamports * PUBLISHER_PERCENT;
        } else {
          referrer_cut = publisher_cut * REFERRER_PERCENT;
          publisher_cut = publisher_cut - referrer_cut;
        }        
      }

      let author_cut: u64 = (video_price_lamports - (publisher_cut + referrer_cut)) as u64;
      let mut distributions: Vec<(Pubkey, u64)> = Vec::new();

      distributions.push((author.key(), author_cut));

      if publisher_cut != 0.0 {
        distributions.push((publisher.key(), publisher_cut as u64));
      }

      if referrer_cut != 0.0 {
        distributions.push((referrer.key(), referrer_cut as u64));
      }

      msg!("Distributions: {:?}", distributions);

      let instructions: Vec<Instruction> = transfer_many(
        &user.key,
        &distributions
      );

      for instruction in &instructions {
        let ix: &Instruction = instruction;

        let result = invoke(ix, &[user.to_account_info(), author.to_account_info(), publisher.to_account_info(), referrer.to_account_info()]);

        match result {
          Ok(()) => {},
          Err(e) => {
            msg!("Error in funds transfer: {}", e);
            return Err(ErrorCode::PurchaseFailed.into());
          }
        }
      }

      // create purchase account
      purchase.video = video.key();
      purchase.user = *user.key;
      purchase.created_at = clock.unix_timestamp;

      return Ok(())
    }

    return Err(ErrorCode::OraclePriceMissing.into())
  }
}

#[derive(Accounts)]
pub struct CreateVideo<'info> {
  #[account(init, payer = author, space = Video::LEN)]
  pub video: Account<'info, Video>,
  #[account(mut)]
  pub author: Signer<'info>,
  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct CreatePurchase<'info> {
  #[account(init, payer = user, space = Purchase::LEN)]
  pub purchase: Account<'info, Purchase>,
  #[account(mut)]
  pub user: Signer<'info>,
  pub video: Account<'info, Video>,
  #[account(mut)]
  pub author: AccountInfo<'info>,
  #[account(mut)]
  pub publisher: AccountInfo<'info>,
  #[account(mut)]
  pub referrer: AccountInfo<'info>,
  #[account(address = system_program::ID)]
  pub system_program: AccountInfo<'info>,
  pub oracle: AccountInfo<'info>,
}

const MAX_IPFS_CID_LENGTH: usize = 50 * 4;
const PRICE_LENGTH: usize = 4;

#[account]
pub struct Video {
  pub author: Pubkey,
  pub ipfs_cid: String,
  pub price: u32,
}

impl Video {
  const LEN: usize = DISCRIMINATOR_LENGTH
    + PUBLIC_KEY_LENGTH // Author.
    + STRING_LENGTH_PREFIX + MAX_IPFS_CID_LENGTH //  IPFS CID length
    + PRICE_LENGTH; // price
}

#[account]
pub struct Purchase {
  pub video: Pubkey,
  pub user: Pubkey,
  pub created_at: i64,
  pub publisher: Pubkey,
  pub referrer: Pubkey,
}

impl Purchase {
  const LEN: usize = DISCRIMINATOR_LENGTH
    + PUBLIC_KEY_LENGTH // video
    + PUBLIC_KEY_LENGTH // user
    + TIMESTAMP_LENGTH // timestamp
    + PUBLIC_KEY_LENGTH // publisher
    + PUBLIC_KEY_LENGTH; // referrer
}

#[error]
pub enum ErrorCode {
  #[msg("IPFS CID missing")]
  IpfsCidMissing,
  #[msg("Price missing")]
  PriceMissing,
  #[msg("Unable to get SOL price")]
  OraclePriceMissing,
  #[msg("Purchase failed")]
  PurchaseFailed,
}
