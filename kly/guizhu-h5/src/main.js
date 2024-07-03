import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import 'normalize.css'
import vant from './plugins/vant'
import './styles/font.css'

// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp({
    render: () => h(App)
})

// 按需注入vant组件
Object.values(vant).forEach((key) => app.use(key))
app.use(store).use(router)
app.mount('#app')
