import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
//使用vite-plugin-vue-setup-extend
import VueSetupExtend from 'vite-plugin-vue-setup-extend'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),VueSetupExtend()],
  //src文件夹配置别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  //配置代理跨域 可以查看vite官网中-配置-服务器选项-server.proxy
  server: {
    proxy: {
      '/api': {
        target: 'http://syt.atguigu.cn',
        changeOrigin: true
      }
    }
  }
})
