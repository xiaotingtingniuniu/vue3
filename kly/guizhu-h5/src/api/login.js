import client from '@/api/axios'

export function cancellationUser (params) {
    return client({
        url: '/hzgApi/app/user/cancellationUser',
        method: 'post',
        params
    })
}

// 一账通获取验证码
export function smsyztCode (data) {
    return client({
        url: '/v1/unify/sendSmsCode',
        method: 'post',
        data
    })
}
export function smsCode (data) {
    return client({
        url: '/hzgApi/app/user/buildSendSmsCode',
        method: 'post',
        data
    })
}
export function checkSmsCode (data) {
    return client({
        url: '/hzgApi/app/user/checkSmsCode',
        method: 'post',
        data
    })
}

export function fetchUserPermission (params) {
    return client({
        url: '/hzgApi/app/user/permission',
        method: 'get',
        params,
        noLoading: -1
    })
}

export async function loginByCode (params) {
    return await client.post('/hzgApi/app/user/loginByAuth', params)
}

export function getManagerInfo (params) {
    return client.post('/hzgApi/v1/merchant/equipment/v1/getLoginInfo', params, { noLoading: -1 })
}
