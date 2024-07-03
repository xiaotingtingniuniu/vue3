import client from '@/utils/request'
import store from '@/store'

// 订单列表
export async function orderList (params) {
    const { data } = await client.post('/api/order/oms/order/list', params)
    return data
}

// 订单详情
export async function orderDetail (params) {
    const { data } = await client.get('/api/order/oms/order/detail', { params })
    return data
}

// 提交订单 -- 这一步生成订单
export async function orderInfoAdd (params) {
    const res = await client.post('/api/order/oms/orderInfo/add', params)
    store.dispatch('updateCartNum')
    return res
}

// 支付 h5
export async function createH5Order (params) {
    const res = await client.post('/api/order/oms/orderPay/createH5Order', params)
    return res
}
// 支付 wx
export async function createJsOrder (params) {
    const res = await client.post('/api/order/oms/orderPay/createJsOrder', params)
    return res
}

// 订单状态
export async function orderStatus (params) {
    const { data } = await client.get('/api/order/oms/order/status', {
        params,
        noLoading: true
    })
    return data
}

export async function orderCount () {
    const res = await client.get('/api/order/oms/order/count', {
        noLoading: true
    })
    return res
}

export async function openDoor (params) {
    const res = await client.post('/api/product/pms/counter/openDoorUrl', params)
    return res
}

export async function cancelOrder (params) {
    const { code } = await client.get('/api/order/oms/order/cancel', { params })
    return code
}
// 删除订单
export async function orderDelete (params) {
    const { code } = await client.get('/api/order/oms/order/delete', { params })
    return code
}
// 展示收银台数据
export async function cashWindowsData (params) {
    const res = await client.get('/api/order/oms/order/getCashWindowsData', { params })
    return res
}
// 收银台去支付
export async function doPay (params) {
    const res = await client.post('/api/order/oms/orderPay/doPay', params)
    return res
}
// 查询是否支付成功
export async function isSuccessPay (params) {
    const res = await client.post('/api/order/oms/orderPay/isSuccessPay', params)
    return res
}
