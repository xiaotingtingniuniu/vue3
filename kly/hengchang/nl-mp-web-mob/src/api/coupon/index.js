import client from '@/utils/request'
// v2.4优惠券接口更改
// 可领取优惠券列表
export async function unclaimedCoupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/list/index', { params })
    return data
}
// 商品页-用户已领取券-列表
export async function goodsreceivedCoupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/user/sku/received/list', { params })
    return data
}
// 订单提交页-用户已领取券-列表
export const orderreceivedCoupon = (data) => {
    return client({
        url: '/api/marketing/mms/coupon/user/order/received/list',
        method: 'post',
        data
    })
}
// 用户已领取券-列表
export async function receivedCoupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/user/received/list', { params })
    return data
}
// 用户已使用券-列表
export async function usedCoupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/user/order/list', { params })
    return data
}
// 用户已失效券-列表
export async function invalidCoupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/user/invalid/list', { params })
    return data
}
// 领取优惠券
export async function drawCoupon (params) {
    const { data } = await client.post('/api/marketing/mms//coupon/draw', { params })
    return data
}
// 领取优惠券（一键领取）
export async function allreceiveCoupon (params) {
    const { data } = await client.post('/api/marketing/mms/coupon/user/batch/draw', params)
    return data
}
// 领取优惠券（单个或者兑换）
export const drawoneCoupon = (data) => {
    return client({
        url: '/api/marketing/mms/coupon/user/draw',
        method: 'post',
        data
    })
}
// // 待领取列表
export async function Coupon (params) {
    const { data } = await client.get('/api/marketing/mms/coupon/list', { params })
    return data
}
