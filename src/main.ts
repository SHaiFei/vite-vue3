import { createApp } from 'vue'
import App from './App.vue'
import { initRouter } from './router'
import { initStore } from './store'
import '../src/assets/style/global.less'

const app = createApp(App)
initRouter(app)
initStore(app)
app.mount('#app')
