import axios from 'axios'
import store from '../store'
import codeHandler from './codeHandler'

const client = axios.create({
    baseURL: '/',
    timeout: 40000
})

// 请求拦截器
client.interceptors.request.use((config) => {
    const { token } = store.state
    if (token) config.headers.Authorization = token
    return config
}, error => {
    return Promise.reject(error)
})

// 响应拦截器
client.interceptors.response.use((response) => {
    if (response.config.url === '/api/api/marketing/v1/coupon/details/export' || response.config.url === '/api/api/uniter/v1/common/export') {
        return response
    }

    if (response.data.code) {
        const nextCode = codeHandler(response.data)
        if (nextCode.next === 'return') return response.data
        if (response.data.code === '036005' || response.data.code === '500') return response.data
        // if (response.data.code === '095406') return response.data
        if (nextCode.next === 'raise') throw new Error(nextCode.reason)
    } else {
        return response.data
    }
}, (error) => {
    return Promise.reject(error.data)
})

export default client
