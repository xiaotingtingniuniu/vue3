import client from '@/utils/request'

// 通过订单编号查询订单列表
export async function orderList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 通过订单编号查询订单详情
export async function orderDetails (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 创建异常工单
export async function orderWork (params) {
    const res = await client.post('/api/api/workorder/v1/createExceptionOrderWork', params)
    return res
}
