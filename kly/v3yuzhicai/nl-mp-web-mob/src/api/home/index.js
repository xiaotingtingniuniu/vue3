import client from '@/utils/request'

// 三级品类
export async function categoryList (params) {
    const { data } = await client.get('/api/product/category/list', params)
    return data
}

// 商品搜索
export async function skuSearch (params) {
    const { data } = await client.post('/api/product/sku/search', params)
    return data
}

// 首页 -> 热销 && 新品 (列表)
export async function shopIndexSku (params) {
    const { data } = await client.post('/api/product/index/shopIndexSku', params)
    return data
}

// 坐标获取位置
export async function currentLocation (params) {
    const { result } = await client.get('/ws/geocoder/v1', { params })
    return result
}

// 坐标转换
export async function locationTranslate (params) {
    const { locations } = await client.get('/ws/coord/v1/translate', { params })
    return locations
}

// 根据位置 获取推荐货柜
export async function counterInfoIndexList (params) {
    const { data } = await client.post('/api/product/pms/counterInfo/indexList', params)
    return data
}

// 根据位置 获取货柜列表
export async function counterInfoList (params) {
    const { data } = await client.post('/api/product/pms/counterInfo/list', params)
    return data
}

// 根据位置 获取推荐店铺
export async function indexShop (params) {
    const { data } = await client.post('/api/product/index/shop', params)
    return data
}

// 签名
export async function wxJsSignature (params) {
    const { data } = await client.post('/api/order/oms/wechat/wxJsSignature', params)
    return data
}

// openid
export async function webAccessToken (params) {
    const { data } = await client.post('/api/order/oms/wechat/webAccessToken', params)
    return data
}
