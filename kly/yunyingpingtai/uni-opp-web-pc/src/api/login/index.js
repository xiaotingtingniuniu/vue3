import client from '@/utils/request'

const urlParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001000' // 业务线编号
}

// 登录
export async function loginApi (params) {
    const { data } = await client.post('/api/permission/login', params)
    return data
}

// 获取验证码
export const getVerifyCode = (param) => {
    const params = Object.assign({
        ...urlParam,
        mobile: '' // 手机号
    }, param)
    return client.post('/api/permission/manager/v2/getVerifyCode', params)
}

export const login = (param) => {
    const params = Object.assign({
        ...urlParam,
        loginType: 1, // 新增 1 账号密码/手机号密码 2 手机验证码
        account: '', // 账号
        pwd: '', // 密码
        mobile: '', // 手机号
        verifyCode: '' // 验证码
    }, param)
    return client.post('/api/permission/login/v2/login', params)
}

// 登出
export async function logoutApi (params) {
    const { data } = await client.post('/api/permission/login/logout', params)
    return data
}

// 用户权限
export async function userResource (params) {
    const { data } = await client.get('/api/permission/resource/fetch', { params })
    return data
}

// 用户权限
export const userResourceApi = (param) => {
    const params = Object.assign({
        ...urlParam,
        sceneCode: '', // 场景编号
        functionCode: '', // 功能编号
        clientType: '', // 客户端类型
        organizationId: '', // 组织
        roleIds: '' // 角色
    }, param)
    return client.get('/api/permission/resource/v2/fetch', { params })
}
