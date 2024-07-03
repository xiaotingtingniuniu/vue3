import client from '@/utils/request'

export async function goodsDetail (params) {
    const { data } = await client.get('/api/product/sku/detail', { params })
    return data
}

// 店铺详情
export async function shopDetail (params) {
    const { data } = await client.get('/api/product/store/detail', { params })
    return data
}

// 查询店铺 通过货柜
export async function shopsList (params) {
    const { data } = await client.post('/api/product/store/list', params)
    return data
}
