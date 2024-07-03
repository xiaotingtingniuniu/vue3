import router from '@/router'
import { Toast } from 'vant'
import { isWx, isApp, scanResult } from '@/utils'
import { scanQRCode, openLocation } from '@/utils/wx'
import { appBridge, registerhandler } from '@/utils/bridge'

// 扫码
export const scanQRCodeFn = () => {
    if (!isWx && !isApp) return Toast('请在微信中打开')
    if (isWx) return scanQRCode()
    if (isApp) appBridge('scanQrcode')
}

// 兑换码扫码
export const couponCdkeyeFn = () => {
    if (!isWx && !isApp) return Toast('请在微信中打开')
    if (isWx) return scanQRCode()
    if (isApp) {
        appBridge('scanQrcode_cb')
        registerhandler('scanQrcodeResult', data => {
            scanResult(data)
        })
    }
}
// 导航
export const routePlan = async (to, tocoord, address) => {
    const res = tocoord.split(',')
    if (isWx) {
        openLocation(res[0], res[1], to, address)
    } else if (isApp) {
        appBridge('positionNavigation', {
            address: address,
            latitude: res[0],
            longitude: res[1]
        })
    } else {
        const mapKey = process.env.VUE_APP_MAPKEY
        const url = `https://apis.map.qq.com/uri/v1/routeplan?type=walk&policy=0&to=${to}&tocoord=${tocoord}&referer=${mapKey}`
        window.location.href = url
    }
}

// 跳转
export const pageGo = (path, query) => {
    if (!isApp) return router.push({ path, query })
    appBridge('newPage', { url: `${window.location.origin}${path}` })
}

// 回退
export const pageBack = () => {
    if (!isApp) return router.back()
    appBridge('closePage')
}

// 会刷新app
export const goHomePage = () => {
    if (!isApp) return router.push({ name: 'home' })
    appBridge('goHome')
}

// 回到首页
export const goHomePage2 = () => {
    if (!isApp) return router.push({ name: 'home' })
    appBridge('useCoupon')
}

export const goMinePage = () => {
    if (!isApp) {
        return router.push({ name: 'mine' })
    }
    appBridge('goMine') // 回到我的
}
