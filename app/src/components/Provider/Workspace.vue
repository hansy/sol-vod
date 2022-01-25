<template>
  <div><slot></slot></div>
</template>

<script>
export default {
  name: 'ProviderWorkspace'
}
</script>

<script setup>
import { initWorkspace } from '@/composables'
initWorkspace()
</script>
