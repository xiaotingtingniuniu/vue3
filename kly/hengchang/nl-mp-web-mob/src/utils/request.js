import axios from 'axios'
import router from '../router'
import store from '../store'
import codeHandler from './codeHandler'

const client = axios.create({
    baseURL: '/',
    timeout: 10000
})

// 请求拦截器
client.interceptors.request.use((config) => {
    if (!config.noLoading) {
        store.commit('loading', 1)
    }
    const { token, userInfo } = store.state
    if (token) {
        config.headers.Authorization = token
        if (userInfo) (config.headers.UserId = userInfo.id)
    }
    return config
}, error => {
    store.commit('loading', 1)
    return Promise.reject(error)
})

// 响应拦截器
client.interceptors.response.use((response) => {
    if (!response.config.noLoading) {
        store.commit('loading', -1)
    }
    if (response.data && response.data.code) {
        const nextCode = codeHandler(response.data)
        if (nextCode.next === 'return') return response.data
        if (nextCode.next === 'redirect') return router.push({ name: nextCode.name })
        if (nextCode.next === 'reload') return location.reload()
    } else {
        return response.data
    }
}, (error) => {
    store.commit('loading', -1)
    const nextCode = codeHandler(error.data)
    if (nextCode.next === 'return') return Promise.reject(error.data)
    if (nextCode.next === 'redirect') return router.push({ name: nextCode.name })
    if (nextCode.next === 'reload') return location.reload()
})

export default client
