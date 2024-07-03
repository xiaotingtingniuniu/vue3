import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
let app = createApp(App);
// 添加全局属性
app.config.globalProperties.$appName = "我是app的名字";
app.use(store).use(router).mount('#app')
console.log(app.config.globalProperties.$appName);
