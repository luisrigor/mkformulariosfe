
import { createApp } from 'vue'

import App from './App.vue'
import RouterIndex from './router/index'
import Store from './shared/store/Store'

const app = createApp(App)

app.use(RouterIndex)

app.use(Store)

app.mount('#app')
