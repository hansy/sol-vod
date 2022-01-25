<template>
  <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 my-4">
    <li v-for="item in items" :key="item.publicKey" class="relative">
      <media-item :video="item" @onPurchase="emitPurchase" />
    </li>
  </ul>
</template>

<script setup>
import MediaItem from '@/components/MediaItem'

const emit = defineEmits(['onPurchase'])

defineProps({
  items: {
    type: Array,
    default: () => [],
  }
})

const emitPurchase = (video) => {
  emit('onPurchase', video)
}
</script>
