<script setup>
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { web3 } from '@project-serum/anchor'
import MainNavigation from './components/MainNavigation'
import { getPhantomWallet, getSolflareWallet } from '@solana/wallet-adapter-wallets'
import { WalletProvider } from '@solana/wallet-adapter-vue'
import ProviderWorkspace from '@/components/Provider/Workspace'

const wallets = [
  getPhantomWallet(),
  getSolflareWallet(),
]

const route = useRoute()

const ref = computed(() => {
  return route.query.ref
})

watchEffect(() => {
  try {
    const key = new web3.PublicKey(ref.value)
    window.localStorage.setItem('refKey', key.toBase58())
  } catch {
    // do nothing
  }
})

</script>

<template>
  <wallet-provider :wallets="wallets" auto-connect>
    <provider-workspace>
      <main-navigation />
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <router-view></router-view>
      </div>
    </provider-workspace>
  </wallet-provider>
</template>
