
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import RouterIndex from './router/index'
import Store from './shared/store/Store'

const pinia = createPinia()
const app = createApp(App)

app.use(RouterIndex)

app.use(Store)

app.use(pinia)
app.mount('#app')
