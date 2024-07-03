import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
import store from '@/store'
import router from '@/router'

// 打开新web-view
export const newPage = (path, query) => {
    if (isApp) return appBridge('openNewPage', { url: `${window.location.origin}${path}` })
    router.push({ path, query })
}

export const newPageRedirect = (url) => {
    if (isApp) return appBridge('openNewPage', { url })
    window.location.href = url
}

export const pageRedirect = (url) => {
    window.location.href = url
}

// 关闭当前web-view
export const closePage = () => {
    if (isApp) return appBridge('closePage')
    router.back()
}

export const goLogin = () => {
    appBridge('goLogin')
}
export const goLoginFailed = (params) => {
    try {
        appBridge('forceLogout', params)
    } catch (error) {}
}
export const getLatitudeLongitude = () => {
    return new Promise((resolve) => {
        if (isApp) {
            appBridge('getLatitudeLongitude', {}, (payload) => {
                resolve(payload)
            })
        }
    })
}
export const openLocation = () => {
    return new Promise((resolve) => {
        if (isApp) {
            appBridge('openLocation', {}, (payload) => {
                resolve(payload)
            })
        }
    })
}
// 获取控制vconsole是否打开
export const isDevelopVConsole = () => {
    // if (isApp && process.env.NODE_ENV === 'production') {
    //     try {
    //         appBridge('isDevelopVConsole', {}, (payload) => {
    //             if (payload) {
    //                 // eslint-disable-next-line no-unused-vars
    //                 const vConsole = new window.VConsole()
    //             }
    //         })
    //     } catch (error) {}
    // }
}

export const getToken = async () => {
    if (!isApp) {
        const token = sessionStorage.getItem('token')
        const userInfo = sessionStorage.getItem('userInfo')
        if (token && userInfo) {
            store.commit('setToken', token)
            store.commit('setUserInfo', JSON.parse(userInfo))
            await store.dispatch('initPublicData')
        } else {
            const loginUrl = 'https://test-authority.hengshenghuo.com/register/login'
            const systemSign = 'HZG'
            const subSystemSign = 'HZG'
            const pageTitle = '恒掌柜'
            const agreement = [
                {
                    title: '《用户注册及服务协议》',
                    url: 'http://hsh-guizhu-h5.k8stest.hengchang6.com/setting/agreement1'
                },
                {
                    title: '《用户隐私协议》',
                    url: 'http://hsh-guizhu-h5.k8stest.hengchang6.com/setting/agreement2'
                }
            ]
            const agreementStr = JSON.stringify(agreement)
            const title = encodeURIComponent('登录/注册')
            const returnUrl = encodeURIComponent(window.location.href)
            return (window.location.href = `${loginUrl}?systemSign=${systemSign}&subSystemSign=${subSystemSign}&pageTitle=${pageTitle}&agreement=${agreementStr}&title=${title}&returnUrl=${returnUrl}&env=H5`)
        }
    } else {
        return new Promise((resolve) => {
            appBridge('getToken', {}, async (token) => {
                store.commit('setToken', token)
                await store.dispatch('initPublicData')
                resolve(token)
            })
        })
    }
}

export const getUserInfo = () => {
    return new Promise((resolve) => {
        if (isApp) {
            appBridge('getUserInfo', {}, (userInfo) => {
                resolve(userInfo)
            })
        } else {
            const userInfo = sessionStorage.getItem('userInfo')
            resolve(userInfo)
        }
    })
}

export const getPhone = () => {
    appBridge('getPhone', {}, (response) => {
        store.commit('setphone', response)
    })
}

// 设置当前web-view的title
export const setTitle = (param) => {
    setTimeout(() => {
        try {
            appBridge('public_Title', param)
        } catch (error) {}
    })
}
