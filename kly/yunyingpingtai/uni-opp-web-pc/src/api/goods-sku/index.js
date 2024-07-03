import client from '@/utils/request'

// 商品sku列表
export async function goodsSkuList (params) {
    const res = await client.post('/ben-api/sku/list', params)
    return res
}
// 商品详情
export async function getGoodsSkuDetail (params) {
    const { data } = await client.post('/ben-api/sku/detail', params)
    return data
}
// 添加/修改
export async function handleGoodsSku (params) {
    const res = await client.post('/ben-api/sku/addOrUpdate', params)
    return res
}
// 商品品牌
export async function goodsBrand (params) {
    const res = await client.post('/ben-api/sku/brandList', params)
    return res
}
// 商品分类
export async function goodsClassify (params) {
    const { data } = await client.post('/ben-api/sku/classify', params)
    return data
}
// 商品渠道
export async function skuChannel (params) {
    const { data } = await client.post('/ben-api/sku/skuChannel', params)
    return data
}
// 城市
export async function skuAreaList (params) {
    const { data } = await client.post('/ben-api/sku/areaList', params)
    return data
}
// 应用类目
export async function skuApplyClassifyList (params) {
    const { data } = await client.post('/ben-api/sku/applyClassify', params)
    return data
}
// 变更状态，上架 下架 审核
export async function setStatus (params) {
    const res = await client.post('/ben-api/sku/operate', params)
    return res
}
// 货柜商品审核提交
export async function updateGoodsStatus (params) {
    const res = await client.post('/api/api/goods/approval/goods/state/v2', params)
    return res
}
