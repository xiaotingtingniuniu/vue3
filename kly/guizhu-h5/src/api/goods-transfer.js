import client from '@/api/axios'

// 根据商户id查询商户状态
export async function merchantSource (params) {
    const res = await client.post('/hzgApi/goods/outsku/merchantSource', params, { noLoading: -1 })
    return res
}

// 按商户ID迁移数据
export async function outskuMovement (params) {
    const res = await client.post('/hzgApi/goods/outsku/movement', params)
    return res
}

// 查询失效的商品
export async function outskuInvalidList (params) {
    const res = await client.post('/hzgApi/goods/outsku/invalid/list', params)
    return res
}

// 清除失效的商品
export async function outskuClear (params) {
    const res = await client.post('/hzgApi/goods/outsku/clear', params)
    return res
}

// 统计sku迁移标品化数量
export async function outskuStatistic (params) {
    const res = await client.post('/hzgApi/goods/outsku/statistic', params)
    return res
}
