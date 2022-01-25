<template>
  <form @submit.prevent="addVideo">
    <input type="text" name="ipfs_cid" v-model="ipfsCid" />
    <input type="number" name="price" v-model="price" />
    <button type="submit">Add video</button>
  </form>
</template>

<script>
export default {
  name: 'PageUpload'
}
</script>

<script setup>
import { ref } from  'vue'
import { createVideo } from '@/api'
import { useWorkspace } from '@/composables'

const ipfsCid = ref(null)
const price = ref(null)
const workspace = useWorkspace()

const addVideo = async () => {
  try {
    const video = await createVideo(workspace, ipfsCid.value, price.value)

    console.log(video)
  } catch (e) {
    console.log('Error adding video', e)
  }
}
</script>
