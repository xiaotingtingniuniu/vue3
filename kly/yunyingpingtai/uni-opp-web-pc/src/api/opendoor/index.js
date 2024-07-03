import client from '@/utils/request'

// 统一接口
export async function getOpenDoorRecode (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 补扣
export async function createExceptionOrderWork (params) {
    const { data } = await client.post('/api/api/workorder/v1/createExceptionOrderWork', params)
    return data
}
