import client from '@/utils/request'

// 通用接口
export const commonQuery = async (param, val) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001003',
        ...val,
        body: param
    }
    return await client.post('/api/api/uniter/v1/url/request', params)
}
// 获取团购活动管理列表
export function queryActiveList (params) {
    const res = client.post('/ben-api/voucher/skuList', params)
    return res
}
