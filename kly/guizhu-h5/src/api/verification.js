import client from '@/api/axios'

// 核销列表
export async function queryList (params) {
    const data = await client.post('hzgApi/voucher/queryList', params)
    return data
}

// 核销列表统计
export async function verificationcount (params) {
    const data = await client.post('/hzgApi/voucher/count', params)
    return data
}

// 优惠券验证
export async function check (params) {
    const data = await client.post('/hzgApi/voucher/check', params)
    return data
}

// 数据统计 - 设备销售详情
export async function userdverification (params) {
    const data = await client.post('/hzgApi/voucher/used', params)
    return data
}
