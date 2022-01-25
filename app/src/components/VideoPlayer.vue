<template>
  <video :id="ipfsHash" class="video-js vjs-theme-fantasy"></video>
</template>

<script setup>
import videojs from 'video.js'
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  ipfsHash: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  }
})

const player = ref(null)

watch(() => props.poster, (val) => {
  if (val) {
    player.value.poster(val)
  }
})

onMounted(() => {
  const options = {
    autoplay: false,
    controls: true,
    fluid: true,
    preload: 'none',
    sources: [
      {
        src:
          `https://gateway.pinata.cloud/ipfs/${props.ipfsHash}/master.m3u8`,
        type: "application/x-mpegurl"
      }
    ],
    poster: props.poster,
  }

  player.value = videojs(`#${props.ipfsHash}`, options)
})

onUnmounted(() => {
  if (player.value) {
    player.value.dispose()
  }
})
</script>
