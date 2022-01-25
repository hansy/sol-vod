import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolVod } from '../target/types/sol_vod';
import * as assert from "assert";
import { publicKey } from '@project-serum/anchor/dist/cjs/utils';

const VIDEO_PRICE_IN_CENTS = 10000;

const createVideo = async (program, video, author) => {
  return await program.rpc.createVideo('IPFS_CID', VIDEO_PRICE_IN_CENTS, {
    accounts: {
      video: video.publicKey,
      author: author.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [video]
  })
}

const getBalance = async (program, userPublicKey) => {
  return await program.provider.connection.getBalance(userPublicKey)
}

const airdrop = async (program, user, numSol = 1) => {
  const sig = await program.provider.connection.requestAirdrop(user.publicKey, anchor.web3.LAMPORTS_PER_SOL * numSol);
  await program.provider.connection.confirmTransaction(sig);
}

describe('sol-vod', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolVod as Program<SolVod>;
  const video = anchor.web3.Keypair.generate();
  const author = program.provider.wallet;

  it('can create a video', async () => {
    await createVideo(program, video, author)
  });

  it('can create a purchase', async () => {
    const user = anchor.web3.Keypair.generate()
    const publisher = anchor.web3.Keypair.generate()
    const referrer = anchor.web3.Keypair.generate()
    const purchase = anchor.web3.Keypair.generate()

    await airdrop(program, user)

    const videoAccount = await program.account.video.fetch(video.publicKey)
    const authorBalanceBefore = await getBalance(program, author.publicKey)
    const priceFeedAccount = "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
    const oracleAccount = new anchor.web3.PublicKey(priceFeedAccount)

    await program.rpc.createPurchase({
      accounts: {
        purchase: purchase.publicKey,
        user: user.publicKey,
        video: video.publicKey,
        author: videoAccount.author,
        publisher: publisher.publicKey,
        referrer: referrer.publicKey,
        oracle: oracleAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [purchase, user]
    })

    // const purchaseAccounts = await program.account.purchase.all()
    const authorBalanceAfter = await getBalance(program, author.publicKey)
    console.log('Author balance change', authorBalanceAfter - authorBalanceBefore)

    const publisherBalanceAfter = await getBalance(program, publisher.publicKey)
    console.log('Publisher balance change', publisherBalanceAfter)

    const referrerBalanceAfter = await getBalance(program, referrer.publicKey)
    console.log('Referrer balance change', referrerBalanceAfter)

    assert.ok(authorBalanceAfter > authorBalanceBefore, 'Author balance after not greater')
    assert.ok(publisherBalanceAfter > 0, 'Publisher balance after not greater')
    assert.ok(referrerBalanceAfter > 0, 'Referrer balance after not greater')
  })
});
