import client from '@/utils/request'
// 登录
export const login = (data) => {
    return client({
        url: '/api/user/ums/user/login',
        method: 'post',
        data
    })
}
// 发送短信验证码
export const sendSms = (data) => {
    return client({
        url: '/api/user/ums/user/sendSms',
        method: 'post',
        data
    })
}
// 修改用户头像及昵称
export const update = (data) => {
    return client({
        url: '/api/user/ums/user/update',
        method: 'post',
        data
    })
}
// 退出登录
export const loginout = (data) => {
    return client({
        url: '/api/user/ums/user/logout',
        method: 'post',
        data
    })
}
// 修改手机号
export const updateMobile = (data) => {
    return client({
        url: '/api/user/ums/user/updateMobile',
        method: 'post',
        data
    })
}
// 用户个人信息
export const personalInformation = () => {
    return client({
        url: '/api/user/ums/user/me',
        method: 'get',
        noloading: true
    })
}

// 用户注销申请
export const userCancel = () => {
    return client({
        url: '/api/user/ums/user/cancel',
        method: 'get'
    })
}
// 用户注销提交
export const cancelSubmit = (data) => {
    return client({
        url: '/api/user/ums/user/cancelSubmit',
        method: 'post',
        data
    })
}
