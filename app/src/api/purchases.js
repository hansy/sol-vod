import { web3 } from '@project-serum/anchor'
import Purchase from '../models/purchase'

export const userFilter = userPublicKeyBase58 => ({
  memcmp: {
      offset: 8 // Discriminator
        + 32,   // Video key
      bytes: userPublicKeyBase58,
  }
})

export const createPurchase = async ({ wallet, program }, video, referrerKey) => {
  const purchase = web3.Keypair.generate()
  const priceFeedAccount = "FmAmfoyPXiA8Vhhe6MZTr3U6rZfEZ1ctEHay1ysqCqcf"
  const oracleAccount = new web3.PublicKey(priceFeedAccount)

  let refKey = video.author.publicKey

  if (referrerKey) {
    refKey = new web3.PublicKey(referrerKey)
  }

  await program.value.rpc.createPurchase({
    accounts: {
      purchase: purchase.publicKey,
      user: wallet.value.publicKey,
      author: video.author.publicKey,
      publisher: video.author.publicKey,
      referrer: refKey || video.author.publicKey,
      video: video.publicKey,
      oracle: oracleAccount,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [purchase]
  })

  const purchaseAccount = await program.value.account.purchase.fetch(purchase.publicKey)

  return new Purchase(purchase.publicKey, purchaseAccount)
}

export const getPurchases = async ({ program }, filters = []) => {
  const purchaseAccounts = await program.value.account.purchase.all(filters)

  return purchaseAccounts.map((p) => new Purchase(p.publicKey, p.account))
}
