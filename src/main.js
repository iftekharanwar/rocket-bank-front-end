import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/router.js'
import App from './App.vue'

const app = createApp(App)

const store = createPinia()

app.use(router).use(store).mount('#app')
