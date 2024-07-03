import client from '@/api/axios'

// 扫码补货
export function scanning (data) {
    return client({
        url: '/hzgApi/scan/replenishment',
        method: 'POST',
        data
    })
}

// 扫码盘货
export function inventory (data) {
    return client({
        url: '/hzgApi/scan/inventory',
        method: 'POST',
        data
    })
}

// 扫码开门
export function opening (params) {
    return client({
        url: '/hzgApi/scan/openDoor',
        method: 'GET',
        params
    })
}

// 扫码获取商品详情
export function skuDetail (params) {
    return client({
        url: '/hzgApi/scan/skuDetail',
        method: 'GET',
        params
    })
}

// 设备商品列表
export function equipmentGoodsList (params) {
    return client({
        url: '/hzgApi/scan/equipmentGoodsList',
        method: 'GET',
        params
    })
}

// 设备列表
export const deviceListList = (param) => {
    return client({
        url: '/hzgApi/deviceGoods/deviceList',
        method: 'POST',
        data: param
    })
}

// 设备加解锁
export const deviceLock = (param) => {
    return client({
        url: '/hzgApi/deviceGoods/deviceLock',
        method: 'POST',
        data: param
    })
}

// 我的商品库列表
export async function myGoodsList (params) {
    const data = await client.post('/hzgApi/goodsHouse/myGoodsList', params)
    return data
}

// 设备商品列表
export function getScanCodeInfo (params) {
    return client({
        url: '/hzgApi/scan/getScanCodeInfo',
        method: 'GET',
        params
    })
}

// 我的商品库和公共商品库聚合接口
export function queryGoodsList (data) {
    return client({
        url: '/hzgApi/goodsHouse/queryGoodsList',
        method: 'post',
        data
    })
}

// 修改价格提交
export async function changePrice (params) {
    const res = await client.post('/hzgApi/price/changePrice', params)
    return res
}

// 改价记录列表
export async function priceRecordList (params) {
    const res = await client.post('/hzgApi/price/record/list', params)
    return res
}

// 改价记录详情
export async function priceRecordDetail (params) {
    const res = await client.post('/hzgApi/price/record/detail', params)
    return res
}

// 补货记录列表
export async function replenishmentList (params) {
    const res = await client.post('/hzgApi/operatelog/replenishment/list', params)
    return res
}

// 补货记录详情
export async function replenishmentDetail (params) {
    const res = await client.post('/hzgApi/operatelog/replenishment/detail', params)
    return res
}

// 盘货记录列表
export async function tallybillList (params) {
    const res = await client.post('/hzgApi/operatelog/tallybill/list', params)
    return res
}

// 盘货记录详情
export async function tallybillDetail (params) {
    const res = await client.post('/hzgApi/operatelog/tallybill/detail', params)
    return res
}

// 相似商品
export async function similarGoodsList (params) {
    const res = await client.get('/hzgApi/goodsHouse/similarGoodsList', { params })
    return res
}

// 查询是否提示冷冻弹窗
export async function getFreezTips (params) {
    const res = await client.post('/hzgApi/goodsHouse/getFreezTips', params)
    return res
}
// 15天内不提示冷冻弹窗
export async function checkFreezTips (params) {
    const res = await client.post('/hzgApi/goodsHouse/checkFreezTips', params)
    return res
}
