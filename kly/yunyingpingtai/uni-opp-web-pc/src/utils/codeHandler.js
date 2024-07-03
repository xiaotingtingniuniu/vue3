import { ElMessage } from 'element-plus'
import store from '@/store'

/**
 * @param { Object } headler
 * @returns { String } raise 直接抛出异常，终止代码执行
 * @returns { String } return 返回错误对象
 */

function statusCodeHandler (headlerData) {
    const { code, message, msg } = headlerData
    switch (code) {
    case '200':
        return { next: 'return' }
    case 200:
        return { next: 'return' }
    case '1001':
        return { next: 'return' }
    case '036004':
        ElMessage({
            showClose: true,
            message: message,
            type: 'warning'
        })
        return { next: 'return' }
    case 1:
        ElMessage({
            showClose: true,
            message: msg !== '' ? msg : '查询退款详细信息失败,请联系管理员！',
            type: 'warning'
        })
        return { next: 'return' }
    case '110001':
        ElMessage({
            showClose: true,
            message: message,
            type: 'warning'
        })
        return store.dispatch('logoutFn', false)
    case '110052':
        ElMessage({
            showClose: true,
            message: message,
            type: 'warning'
        })
        return store.dispatch('logoutFn', false)
    default:
        ElMessage({
            showClose: true,
            message: message,
            type: 'warning'
        })
        return { next: 'raise', reason: message }
    }
}
export default statusCodeHandler
