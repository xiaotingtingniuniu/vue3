import store from '@/store'
import { Toast } from 'vant'
import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
/**
 * @param { Object } headler
 * @returns { String } raise 直接抛出异常，终止代码执行
 * @returns { String } return 返回错误对象
 */

function statusCodeHandler (headlerData) {
    const { code, data, msg } = headlerData
    if (data && data.refresh) store.dispatch('updateCartNum') // 购物车数量有变动
    switch (code) {
    case 200:
        return { next: 'return' }
    case '200':
        return { next: 'return' }
    case 401:
        // 登录失效
        store.commit('removeInfo')
        if (isApp) return appBridge('tokenFailure')
        return { next: 'redirect', name: 'login' }
    case 512:
        // 后端返回文案不正确 前端改 应提示(订单已失效)
        return { next: 'return' }
    case 511:
        // Toast('订单已失效')
        return { next: 'return' }
    case 513:
        // 订单接口 失效
        Toast('订单已失效')
        return { next: 'return' }
        // return { next: 'reload' }
    case 514:
        Toast('订单已失效')
        return { next: 'reload' }
    case 800:
        // 收银台 订单失效
        return { next: 'return' }
    case 518:
        // 存在未完成订单 不给toast
        return { next: 'return' }
    case '500':
        return { next: 'return' }
    case 9001:
        return { next: 'return' }
    case 9002:
        return { next: 'return' }
    case 9003:
        return { next: 'return' }
    case 9004:
        return { next: 'return' }
    case 9005:
        return { next: 'return' }
    case 9006:
        return { next: 'return' }
    case 9007:
        return { next: 'return' }
    case 9017:
        return { next: 'return' }
    case 9018:
        return { next: 'return' }
    case 9019:
        return { next: 'return' }
    case 90020:
        return { next: 'return' }
    case 90021:
        return { next: 'return' }
    case 90022:
        return { next: 'return' }
    default:
        Toast(msg)
        return { next: 'return' }
    }
}
export default statusCodeHandler
