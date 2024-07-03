import client from '@/api/axios'

// 订单列表
export async function orderList (params) {
    const res = await client.get('/hzgApi/sale/order/saleOrderList', { params })
    return res
}

// 6.0 销售订单
export const getSaleList = params => {
    return client.post('/hzgApi/sale/order/getSaleOrderList', params)
}

// 10.0 销售订单列表
export const getSaleListV10 = params => {
    return client.post('/hzgApi/sale/order/querySaleOrderList', params)
}

// 6.0 订单详情
export const getSaleOrderDetail = params => {
    return client.post('/hzgApi/sale/order/getSaleOrderDetail', params)
}
// 10.0 订单详情
export const getSaleOrderDetailV10 = params => {
    return client.post('/hzgApi/sale/order/querySaleOrderDetail', params)
}

// 6.0 创建审核工单
export const createOrderWork = params => {
    return client.post('/hzgApi/sale/order/createExceptionOrderWork', params)
}

// 订单列表条数
export async function saleOrderCount (params) {
    const res = await client.get('/hzgApi/sale/order/saleOrderCount', { params })
    return res
}
// 开门记录
export async function openDoorList (params) {
    const res = await client.get('/hzgApi/device/getOpenDoorList', { params })
    return res
}

// 订单详情
export async function openOrdeDetail (params) {
    const res = await client.get('/hzgApi/sale/order/getOrderDetail', { params })
    return res
}

// 开门记录详情
export async function openDoorDetail (params) {
    const res = await client.get('/hzgApi/device/getOpenDoorDetail', { params })
    return res
}
// 开门记录工单详情
// export async function openDoorDetail (params) {
//     const res = await client.get('/hzgApi/device/getOpenDoorDetail', { params })
//     return res
// }

// 售后退款详情
export async function refundDetailInfo (params) {
    const res = await client.get('/hzgApi/sale/order/getRefundDetailInfo', { params })
    return res
}

// 售后退款处理操作
export async function auditRefund (params) {
    const res = await client.post('/hzgApi/workOrder/auditRefundReq', params)
    return res
}

// 工单列表
export async function abnormalList (params) {
    const res = await client.get('/hzgApi/workOrder/getWorkOrderList', { params })
    return res
}

// 消息列表进入工单详情，通过msgId获取工单详情id
export async function msgIdGetDetailId (params) {
    const res = await client.post('/hzgApi/message/detail', params)
    return res
}

// 工单详情
export async function workOrderDetail (params) {
    const res = await client.get('/hzgApi/workOrder/getWorkOrderDetail', { params })
    return res
}

// 商品信息列表
export async function goodsList (params) {
    const res = await client.get('/hzgApi/workOrder/getDummySkuInfo', { params })
    return res
}

// 创建补扣单
export async function createWorker (params) {
    const res = await client.post('/hzgApi/workOrder/createMakeUpOrder', params)
    return res
}
// 获取工单列表条数
export async function workOrderCount (params) {
    const res = await client.get('/hzgApi/workOrder/workOrderCount', { params })
    return res
}

// 工单详情
export const workOrderDetailV2 = (params) => {
    return client.get('/hzgApi/workOrder/v2/getWorkOrderDetail', { params })
}

// 无购物
export const noShopping = (params) => {
    return client.post('/hzgApi/workOrder/noShopping', params)
}
// 试算
export const calculationWorkOrder = (params) => {
    return client.post('/hzgApi/workOrder/calculationWorkOrder', params)
}

// 处理工单
export const finishWorkOrder = (params) => {
    return client.post('/hzgApi/workOrder/finishWorkOrderV2', params)
}

// 获取商品
export const getGoodsList = params => {
    return client.post('/hzgApi/device/getOpenDoorTimeSkuList', params)
}

// 获取商品
export const getGoodsListV2 = params => {
    return client.post('/hzgApi/device/queryOpenDoorTimeSkuList', params)
}

// 处理异常单
export const finishOrder = (params) => {
    return client.post('/hzgApi/workOrder/createAndFinishWorkOrderReq', params)
}
