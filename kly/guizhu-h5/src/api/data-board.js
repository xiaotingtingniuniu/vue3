import client from '@/api/axios'

// 数据统计 - 交易概览
export async function businessDetail (params) {
    const data = await client.post('/hzgApi/statistics/businessDetail', params)
    return data
}

// 数据统计 - 设备排行
export async function deviceRanking (params) {
    const data = await client.post('/hzgApi/statistics/deviceRanking', params)
    return data
}

// 数据统计 - 商品排行
export async function spuRanking (params) {
    const data = await client.post('/hzgApi/statistics/spuRank', params)
    return data
}

// 数据统计 - 设备销售详情
export async function deviceSaleDetail (params) {
    const data = await client.post('/hzgApi/statistics/deviceSaleDetails', params)
    return data
}
