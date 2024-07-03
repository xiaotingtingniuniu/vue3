import client from '@/utils/request'
const urlParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001000' // 业务线编号
}

// 列表查询
export async function getUserList (params) {
    const res = await client.get('/api/user/reg/user/list', { params })
    return res
}

// 列表查询
export const exportUser = (params) => {
    return client({
        url: '/api/user/reg/user/excel',
        method: 'POST',
        responseType: 'blob',
        data: params
    })
}
// 分销记录接口
export const getDistribution = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10086917973655552',
        name: '角色身份明细列表',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 拉黑接口
export const userBlock = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10292722282971136',
        name: '场景用户拉黑',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 解除拉黑接口
export const userUnBlock = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10397929880862720',
        name: '解除场景拉黑',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 获取用户拉黑场景
export const getUserBlock = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10458848975065088',
        name: '获取用户拉黑场景',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 收货地址接口
export const getAdress = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10324838077087744',
        name: '查询用户地址列表',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
