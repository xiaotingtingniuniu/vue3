import client from '@/utils/request'

// 订单详情
export async function containerOrderDetail (params) {
    const { data } = await client.post('/api/order/api/vendingmachine/v1/order/detail', params)
    return data
}
// 优惠券
export async function coupon (params) {
    const { data } = await client.post('/api/order/orderInfo/v1/coupon', params)
    return data
}
// 订单确认
export async function orderConfirm (params) {
    const { data } = await client.post('/api/order/orderInfo/v1/coupon', params)
    return data
}

// 柜子详情
export async function containerBehaviorDetail (params) {
    const { data } = await client.post('/api/order/oms/counter/v1/result', params)
    return data
}
// 退款进度
export async function orderProgress (params) {
    const { data } = await client.post('/api/order/order/refund/progress', params)
    return data
}
// 取消退款
export async function cancalRefund (params) {
    const { code } = await client.post('/api/order/order/refund/cancel', params)
    return code
}
