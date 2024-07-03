import client from '@/utils/request'

// 列表查询
export async function getUrlConfigList (params) {
    const res = await client.post('/api/api/uniter/v1/url/list', params)
    return res
}
// 详情-单个
export async function getOneConfig (params) {
    const res = await client.get('/api/api/uniter/v1/url/get/' + params)
    return res
}
export async function dict (params) {
    const res = await client.post('/api/api/dictDetail/' + params)
    return res
}
// 在线调试
export async function debugConfig (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 新增
export async function addConfig (params) {
    const res = await client.post('/api/api/uniter/v1/url/config', params)
    return res
}

// 编辑
export async function updateConfig (params) {
    const res = await client.post('/api/api/uniter/v1/url/update', params)
    return res
}

// 同步
export async function syncConfig (params) {
    const { code } = await client.post('/api/api/uniter/v1/url/sync', params)
    return code
}
// 删除
export async function deleteConfig (params) {
    const { code } = await client.delete('/api/api/uniter/v1/url/config/delete', { data: params })
    return code
}

export async function commonRequest (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}
