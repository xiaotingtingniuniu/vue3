import { openDoor } from '@/api/order'
import router from '@/router'
import Dialog from '@/components/Dialog'

export const isWx = !!navigator.userAgent.toLowerCase().includes('micromessenger')
export const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
export const isSafari = !!navigator.userAgent.match('Safari')
export const isApp = !!navigator.userAgent.includes('com.hshenghuo.shop')

// 扫码结果处理
export const scanResult = async (payload) => {
    const counterUrl = payload.replace('/#', '')
    const { code, data } = await openDoor({ counterUrl })
    if (code !== 200) return false
    if (data.sceneCode === '1') { /* 货柜扫码 */ console.log('货柜扫码') }
    if (data.sceneCode === '3') { /* 到店扫码 */ console.log('到店扫码') }
    if (data.sceneCode === '2') { /* 领券扫码 */
        if (data.convertResult) {
            Dialog({
                title: '兑换优惠券成功',
                right: '查看优惠券',
                showLeftButton: false
            }).then(() => {
                router.push({ name: 'mine-coupon' })
            })
        } else {
            Dialog({
                title: '兑换优惠券失败',
                message: data.reason,
                showLeftButton: false
            })
        }
    }
}

// tabbar
export const appTab = [{
    lable: '首页',
    name: 'home'
}, {
    lable: '菜单',
    name: 'menu'
}, {
    lable: '扫码',
    name: 'scan-code'
}, {
    lable: '购物车',
    name: 'shopping-cart'
}, {
    lable: '我的',
    name: 'mine'
}]

// 距离单位换算 1000 -> 1k
export const formatDistance = (val, precision = 2) => {
    let value = val
    if (typeof value === 'string') return value
    let negative = false
    if (value < 0) {
        negative = true
        value = Math.abs(value)
    }
    let result = 0
    if (value * 1000 > 999999 && value < 1000000) {
        result = `${Math.floor((value / 1000) * (10 ** precision)) / (10 ** precision)}k`
    } else {
        result = Math.floor(value * (10 ** precision)) / (10 ** precision)
    }
    return negative ? `-${result}` : result
}

// 正常单位换算 10000 -> 1万
export const formatNum = (val, precision = 2) => {
    let value = val
    if (typeof value === 'string') return value
    let negative = false
    if (value < 0) {
        negative = true
        value = Math.abs(value)
    }
    let result = 0
    if (value * 10000 > 99999999 && value < 100000000) {
        result = `${Math.floor((value / 10000) * (10 ** precision)) / (10 ** precision)}万`
    } else if (value * 10000 > 999999999999) {
        result = `${Math.floor((value / 100000000) * (10 ** precision)) / (10 ** precision)}亿`
    } else {
        result = Math.floor(value * (10 ** precision)) / (10 ** precision)
    }
    return negative ? `-${result}` : result
}

export const countDown = leftTime => {
    var m, s
    if (leftTime >= 0) {
        m = Math.floor(leftTime / 1000 / 60 % 60)
        s = Math.floor(leftTime / 1000 % 60)
        if (s < 10) {
            s = '0' + s
        }
        if (m < 10) {
            m = '0' + m
        }
    } else {
        console.log('已截止')
    }
    return `${m}:${s}`
}

// 判断是否手机号
export const isMobile = phone => {
    if (!phone) return
    const regExp = new RegExp('^1[3456789]\\d{9}$')
    return regExp.test(phone)
}
