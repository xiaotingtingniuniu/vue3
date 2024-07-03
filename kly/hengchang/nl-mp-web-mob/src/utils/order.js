import store from '@/store'
import { chooseWXPay } from '@/utils/wx'
import { isSafari, isWx, isIos, isApp } from '@/utils'
import { createH5Order, createJsOrder, doPay } from '@/api/order'
import { Toast } from 'vant'
import { appBridge } from '@/utils/bridge'

export const orderState = [{
    label: '全部',
    name: null,
    header: true
}, {
    label: '待付款',
    name: 100,
    header: true
}, {
    label: '备餐中',
    name: 200,
    header: true
}, {
    label: '备餐中',
    name: 300,
    header: false
}, {
    label: '备餐中',
    name: 400,
    header: false
}, {
    label: '待取货',
    name: 500,
    header: true
}, {
    label: '已完成',
    name: 600,
    header: true
}, {
    label: '已退款',
    name: 700,
    header: true
}, {
    label: '已取消',
    name: 800,
    header: true
}]

export const mineOrderObj = [{
    label: '待付款',
    orderStatus: 100,
    key: 'waitPayCount',
    url: require('@/assets/mine/waitPayCount.png'),
    badgeCount: 0
}, {
    label: '备餐中',
    orderStatus: 200,
    key: 'preparingCount',
    url: require('@/assets/mine/preparingCount.png'),
    badgeCount: 0
}, {
    label: '待取货',
    orderStatus: 500,
    key: 'waitPickupCount',
    url: require('@/assets/mine/waitPickupCount.png'),
    badgeCount: 0
}, {
    label: '已完成',
    orderStatus: 600,
    key: 'finishCount',
    url: require('@/assets/mine/finishCount.png'),
    badgeCount: 0
}, {
    label: '已取消',
    orderStatus: 800,
    key: 'cancelCount',
    url: require('@/assets/mine/cancelCount.png'),
    badgeCount: 0
}]

export const payFn = async (orderNumber) => {
    if (isWx) {
    // 微信支付 调用jssdk
        const openId = store.state.openId
        const { data, code } = await createJsOrder({ orderNumber, openId })
        if (code === 200) return chooseWXPay(data, orderNumber)
    } else {
    // h5支付
        const { data, code } = await createH5Order({ orderNumber })
        if (code === 200) {
            const redirectUrl = `${window.location.origin}/pay-result/${orderNumber}`
            const replaceUrl = `${data}&redirect_url=${encodeURIComponent(redirectUrl)}`
            if (isApp) {
            // app内
                // store.dispatch('updateCartNum') // 触发支付说明已经生成订单了, 要刷新购物车数量
                if (!isIos && window.location.pathname !== '/redirect') {
                // 安卓 不是重定向页面 (解决在结果页面, 反复点击去支付, 会出现回退多层, 还在支付结果页面, 当前窗口历史记录问题)
                    if (window.location.pathname.indexOf('pay-result') !== -1) {
                    // 在支付结果页面 触发支付就跳转支付(保证了回退逻辑合理)
                        window.location.href = replaceUrl
                    } else {
                    // 不在支付结果页面 触发支付 就新开个webview再去支付(保证了回退逻辑合理)
                        appBridge('newPage', { url: `${window.location.origin}/redirect?orderNumber=${orderNumber}` })
                    }
                } else {
                // ios 直接支付(原生拦截了支付地址, 处理后续历史记录逻辑)
                    window.location.href = replaceUrl
                }
            } else if (isIos && isSafari) {
            // ios的safari浏览器兼容
                window.location.href = replaceUrl
            } else {
            // 非app内的其他地方
                if (navigator.userAgent.toLowerCase().match('heytapbrowser')) {
                // 兼容oppo手机的自带浏览器回退的问题
                    window.location.href = replaceUrl
                } else {
                // 大部分都支持的用iframe处理 页面打开去支付(因为h5支付是去访问url 这个url不能保留历史记录在当前页面的栈内)
                    const iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.setAttribute('src', replaceUrl)
                    iframe.setAttribute('id', 'iframeID')
                    iframe.setAttribute('sandbox', 'allow-top-navigation allow-scripts')
                    document.body.appendChild(iframe)
                    iframe.onload = function () {
                        Toast.loading({
                            message: '加载中...',
                            forbidClick: true,
                            duration: 0
                        })
                        window.onbeforeunload = function () {
                            Toast.clear()
                        }
                    }
                }
            }
        }
    }
}

export const cashierDoPay = async (orderNumber, payAmount) => {
    if (isWx) {
    // 微信支付 调用jssdk
        const openId = store.state.openId
        const { data, code } = await doPay({ orderNumber, payAmount, openId })
        if (code === 200) return chooseWXPay(data.wxCreateJsOrderResultDto, orderNumber)
    } else {
    // h5支付
        const { data, code } = await doPay({ orderNumber, payAmount })
        if (code === 200) {
            const redirectUrl = `${window.location.origin}/cashier/${orderNumber}/1`
            const replaceUrl = `${data.url}&redirect_url=${encodeURIComponent(redirectUrl)}`
            if (isApp) {
            // app内
                // store.dispatch('updateCartNum') // 触发支付说明已经生成订单了, 要刷新购物车数量 这一步要提到生成订单的接口内 验证没问题后可删除此行
                if (!isIos && window.location.pathname !== '/redirect') {
                // 安卓 不是重定向页面 (解决在结果页面, 反复点击去支付, 会出现回退多层, 还在支付结果页面, 当前窗口历史记录问题)
                    // if (window.location.pathname.indexOf('pay-result-new') !== -1) {
                    // // 在支付结果页面 触发支付就跳转支付(保证了回退逻辑合理)
                    //     window.location.href = replaceUrl
                    // } else {
                    // 不在支付结果页面 触发支付 就新开个webview再去支付(保证了回退逻辑合理)
                    appBridge('newPage', { url: `${window.location.origin}/redirect?orderNumber=${orderNumber}&payAmount=${payAmount}` })
                    // }
                } else {
                // ios 直接支付(原生拦截了支付地址, 处理后续历史记录逻辑)
                    window.location.href = replaceUrl
                }
            } else if (isIos && isSafari) {
            // ios的safari浏览器兼容
                window.location.href = replaceUrl
            } else {
            // 非app内的其他地方
                if (navigator.userAgent.toLowerCase().match('heytapbrowser')) {
                // 兼容oppo手机的自带浏览器回退的问题
                    window.location.href = replaceUrl
                } else {
                // 大部分都支持的用iframe处理 页面打开去支付(因为h5支付是去访问url 这个url不能保留历史记录在当前页面的栈内)
                    const iframe = document.createElement('iframe')
                    iframe.style.display = 'none'
                    iframe.setAttribute('src', replaceUrl)
                    iframe.setAttribute('id', 'iframeID')
                    iframe.setAttribute('sandbox', 'allow-top-navigation allow-scripts')
                    document.body.appendChild(iframe)
                    iframe.onload = function () {
                        Toast.loading({
                            message: '加载中...',
                            forbidClick: true,
                            duration: 3000
                        })
                        window.onbeforeunload = function () {
                            Toast.clear()
                        }
                    }
                }
            }
        }
    }
}

// 现场支付收银台 (恒生活app内专用)
export const scenePayCashierDoPay = async (orderNumber, payAmount) => {
    if (isApp) {
        const { data, code } = await doPay({ orderNumber, payAmount })
        if (code === 200) {
            const redirectUrl = `${window.location.origin}/scene-pay-cashier/${orderNumber}/1`
            const replaceUrl = `${data.url}&redirect_url=${encodeURIComponent(redirectUrl)}`
            if (!isIos && window.location.pathname !== '/redirect') {
                appBridge('newPage', { url: `${window.location.origin}/redirect?payFn=scenePay&orderNumber=${orderNumber}&payAmount=${payAmount}` })
            } else {
                window.location.href = replaceUrl
            }
        }
    }
}

// 货柜付 (恒生活app内专用)
export const containerPayCashierDoPay = async (orderNumber, payAmount, appKey, busiCode) => {
    if (isApp) {
        const { data, code } = await doPay({ orderNumber, payAmount, sourceType: 3 })
        const redirectUrl = `${window.location.origin}/container-pay-cashier/${appKey}/${busiCode}/${orderNumber}/${payAmount}/1`
        if (code === 200 && data && data.url) {
            const replaceUrl = `${data.url}&redirect_url=${encodeURIComponent(redirectUrl)}`
            if (!isIos && window.location.pathname !== '/redirect') {
                appBridge('newPage', { url: `${window.location.origin}/redirect?payFn=containerPay&orderNumber=${orderNumber}&payAmount=${payAmount}&appKey=${appKey}&busiCode=${busiCode}` })
            } else {
                window.location.href = replaceUrl
            }
        } else {
            console.log(data)
            window.location.href = redirectUrl
        }
    }
}
