import { web3 } from '@project-serum/anchor'
import Video from '../models/video'

export const authorFilter = authorPublicKeyBase58 => {
  let filter = null

  if (authorPublicKeyBase58) {
    filter = {
      memcmp: {
        offset: 8, // Discriminator
        bytes: authorPublicKeyBase58,
      }
    }
  }

  return filter
}

export const getVideos = async ({ program }, filters=[]) => {
  const videos = await program.value.account.video.all(filters.filter(f => f))

  return videos.map(v => new Video(v.publicKey, v.account))
}

export const createVideo = async ({ program, wallet }, ipfsCid, priceInCents) => {
  const video = web3.Keypair.generate()

  await program.value.rpc.createVideo(ipfsCid, priceInCents, {
    accounts: {
      video: video.publicKey,
      author: wallet.value.publicKey,
      systemProgram: web3.SystemProgram.programId,
    },
    signers: [video],
  })

  const videoAccount = await program.value.account.video.fetch(video.publicKey)

  return new Video(video.publicKey, videoAccount)
}
