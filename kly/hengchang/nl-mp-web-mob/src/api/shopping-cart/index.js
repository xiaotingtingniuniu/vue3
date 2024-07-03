import client from '@/utils/request'

// 购物车商品数量
export async function cartTotal (params) {
    const { data } = await client.post('/api/order/cart/totalQuantity', params)
    return data
}

// 用户购物车
export async function cartList (params) {
    const { data } = await client.post('/api/order/cart/list', params)
    return data
}
// 添加购物车
export async function cartAdd (params) {
    const { code } = await client.post('/api/order/cart/add', params)
    return code
}
// 购物车结算
export async function cartSettleCart (params) {
    const res = await client.post('/api/order/cart/settleCart', params)
    return res
}
// 清除购物车
export async function cartRemove (params) {
    const { code } = await client.post('/api/order/cart/remove', params)
    return code
}

// 检查货柜是否在线
export async function checkCounterOnline (params) {
    const { data } = await client.get('/api/product/pms/counterInfo/checkOnline', { params })
    return data
}
// 立即购买
export async function cartBy (params) {
    const data = await client.post('/api/order/cart/buy', params)
    return data
}
