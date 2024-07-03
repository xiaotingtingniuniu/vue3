import client from '@/api/axios'

export function getDetail (data) {
    return client({
        url: '/hzgApi/v2/merchant/merchantInfoDetail',
        method: 'post',
        data
    })
}
export function sendMsg (data) {
    return client({
        url: '/hzgApi/api/apply/v2/sendSmsH5',
        method: 'post',
        data
    })
}
export function verCode (data) {
    return client({
        url: '/hzgApi/api/apply/v2/verifyCodeH5',
        method: 'post',
        data
    })
}
export function contractTemplate (data) {
    return client({
        url: '/hzgApi/api/apply/contractTemplate',
        method: 'post',
        data
    })
}
export function accountFlow (data) {
    return client({
        url: '/hzgApi/api/apply/accountFlow',
        method: 'post',
        data
    })
}
export function sendSms (data) {
    return client({
        url: '/hzgApi/api/apply/sendSms',
        method: 'post',
        data
    })
}
export function bindBank (data) {
    return client({
        url: '/hzgApi/api/apply/bindBank',
        method: 'post',
        data
    })
}
export function applyDatumSave (data) {
    return client({
        url: '/hzgApi/api/apply/applyDatumSave',
        method: 'post',
        data
    })
}
export function applyAuditCommit (data) {
    return client({
        url: '/hzgApi/api/apply/applyAuditCommit',
        method: 'post',
        data
    })
}
export function queryPlatFee (data) {
    return client({
        url: '/hzgApi/api/apply/queryPlatFee',
        method: 'post',
        data
    })
}
