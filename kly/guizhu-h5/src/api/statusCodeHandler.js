import { Toast } from 'vant'
import { goLogin, goLoginFailed } from '@/utils/composables'
const tip = (msg) => {
    Toast({
        message: msg,
        duration: 2000
    })
}
/**
 * @param { Object } headler
 * @returns { String } raise 直接抛出异常，终止代码执行
 * @returns { String } return 返回错误对象
 */

function statusCodeHandler (headlerData) {
    let params = {}
    const { code, msg, message, data } = headlerData || {}
    params = {
        kickOffTime: data?.kickOffTime || '0',
        model: data?.model || '0'
    }
    // token接口无code校验
    if (!code) return { next: 'return' }
    switch (code) {
    case '200':
        return { next: 'return' }
    case 200:
        return { next: 'return' }
    case 'A0230':
        goLogin()
        return { next: 'return' }
        // code="A0801"为踢下线code
    case 'A0801':
        goLoginFailed(params)
        return { next: 'return' }
    case '240':
        tip('暂无权限，请重新选择')
        return { next: 'return' }
    case 'S0004':
        tip(msg)
        return { next: 'return' }
    case 'S0002':
        tip(msg)
        return { next: 'return' }
    case 'A0400':
        tip(msg)
        return { next: 'return' }
    case 'ST0001':
        return { next: 'return' }
    case 'A0421':
        return { next: 'return' }
    case '091000':
        return { next: 'return' }
    default:
        if ((msg || message) && msg !== '核销中台返回：未查询到卡券信息') tip(msg || message, 'warning')
        return { next: 'return' }
    }
}
export default statusCodeHandler
