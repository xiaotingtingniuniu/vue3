import axios from 'axios'
import store from '@/store'
import statusCodeHandler from '@/api/statusCodeHandler'
import { apiUa } from '@/utils/tracker'

const client = axios.create({ timeout: 80000 })

client.interceptors.request.use(async (config) => {
    if (!config.noLoading) {
        store.commit('loading', 1)
    }
    const token = store.state.token
    if (token) (config.headers.Authorization = token)
    config.headers.Ua = apiUa()
    return config
}, error => {
    store.commit('loading', 1)
    return Promise.reject(error)
})

client.interceptors.response.use((response) => {
    if (!response.config.noLoading) {
        store.commit('loading', -1)
    }
    // store.commit('loadSub')
    const nextCode = statusCodeHandler(response.data)
    if (nextCode.next === 'return') return response.data
}, (error) => {
    store.commit('loading', -1)
    // store.commit('loadSub')
    const nextCode = statusCodeHandler(error.data)
    if (nextCode.next === 'return') return error.data
})

export default client
