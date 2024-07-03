import client from '@/api/axios'

// 获取公共商品库列表
export async function queryPublicGoodsList(params) {
    const data = await client.post('/hzgApi/goodsHouse/goodsList', params)
    return data
}
// 添加到我的商品库
export async function addToGoods(params) {
    const data = await client.post('/hzgApi/goodsHouse/addToGoods', params)
    return data
}
// 获取我的商品库列表
export async function queryGoodsList(params) {
    const data = await client.post('/hzgApi/goodsHouse/myGoodsList', params)
    return data
}
// 柜主名下的设备列表
export async function queryDeviceList(params) {
    const data = await client.post('/hzgApi/deviceGoods/deviceList', params)
    return data
}
// 柜主名下的算法列表
export async function queryDeviceTypeList(params) {
    const data = await client.get('/hzgApi/goodsHouse/deviceTypeList', { params })
    return data
}
// 获取商品信息
export async function queryGoodsDetail(params) {
    const data = await client.get('/hzgApi/goodsHouse/myGoodsDetail', { params })
    return data
}
// 更新商品信息
export async function updateGoods(params) {
    const data = await client.post('/hzgApi/goodsHouse/goodsUpdate', params)
    return data
}
// 上下架商品
export async function operateGoods(params) {
    const data = await client.post('/hzgApi/goodsHouse/goodsOperate', params)
    return data
}
// 删除商品
export async function delGoods(params) {
    const data = await client.get('/hzgApi/goodsHouse/goodsDel', { params })
    return data
}
// 添加商品到货柜
export async function addGoods(params) {
    const data = await client.post('/hzgApi/goodsHouse/addGoods', params)
    return data
}
// 添加商品到货柜v3
export async function addGoodsV3(params) {
    const data = await client.post('/hzgApi/goodsHouse/addGoodsV3', params)
    return data
}
// 新品申请 -> 申请单列表
export async function spuApprovalList(params) {
    const data = await client.post('/hzgApi/goodsHouse/spuApprovalList', params)
    return data
}
