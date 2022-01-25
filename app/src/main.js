import './main.css'
import '@solana/wallet-adapter-vue-ui/styles.css'

import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
const router = createRouter({
    history: createWebHistory(),
    routes,
})

import { createApp } from 'vue'
import App from './App.vue'

createApp(App).use(router).mount('#app')
