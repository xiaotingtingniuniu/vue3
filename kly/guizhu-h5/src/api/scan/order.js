import client from '@/api/axios'

// 补货单列表
export function replenishmentList (data) {
    return client({
        url: '/hzgApi/scan/replenishmentList',
        // url: '/LD/scan/replenishmentList',
        method: 'POST',
        data
    })
}

// 补货单详情
export async function replenishmentDetail (params) {
    const res = await client.get('/hzgApi/scan/replenishmentDetail', { params })
    return res
}
// 消息详情
export function newsDetail (data) {
    return client({
        url: '/hzgApi/message/detail',
        method: 'POST',
        data
    })
}
