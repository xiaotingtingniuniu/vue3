// sku管理接口
import client from '@/utils/request'

// 审核
export const pagingList = async (params) => {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}
