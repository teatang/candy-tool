import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { i18n } from './i18n'
import './assets/main.css'

/**
 * 糖果工具 (Candy Tool) 应用入口
 * 注册 Pinia 全局状态管理、Vue Router 路由与 vue-i18n 国际化插件
 */
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.mount('#app')
