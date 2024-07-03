import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import './styles/font.css'
import './styles/index.scss'
import './styles/common.scss'

createApp(App).use(store).use(router).mount('#app')
