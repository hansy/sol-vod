<template>
  <div>
    <media-grid @onPurchase="purchaseVideo" :items="videos" />
  </div>
</template>

<script>
export default {
  name: 'PageHome'
}
</script>

<script setup>
import { onMounted, ref } from 'vue'
import { useWorkspace } from '@/composables'
import MediaGrid from '@/components/MediaGrid'

// const { connected } = useWallet()
import { authorFilter, getVideos, createPurchase, getPurchases, userFilter } from '@/api'
import { equal } from '@/util/keys'

const videos = ref([])
const loading = ref(true)
const purchases = ref([])

const workspace = useWorkspace()
const { wallet } = workspace

onMounted(async () => {
  try {
    const POPEYE_PUB_KEY = '99rhKQbFU68uN2udxSaCtBjnUKcqXTGRMeGMWw9nZhxU'
    const vids = await getVideos(workspace, [authorFilter(POPEYE_PUB_KEY)])

    if (wallet.value) {
      const userPubKeyBase58 = wallet.value.publicKey.toBase58()

      purchases.value = await getPurchases(workspace, [userFilter(userPubKeyBase58)])

      vids.forEach((v) => {
        // check if video belongs to user (i.e. the author)
        if (equal(v.author.publicKey, wallet.value.publicKey)) {
          v.hasPurchased(true)
          return
        }

        // check if user has already purchased video
        purchases.value.forEach((p) => {
          if (equal(v.publicKey, p.video.publicKey)) {
            v.hasPurchased(true)
          }
        })
      })
    }

    videos.value = vids
  } finally {
    loading.value = false
  }
})

const purchaseVideo = async (videoPublicKey) => {
  const refKey = window.localStorage.getItem('refKey')
  const video = videos.value.find((v) => equal(v.publicKey, videoPublicKey))
  const purchase = await createPurchase(workspace, video, refKey)

  video.hasPurchased(true)
  purchases.value.push(purchase)
}
</script>
