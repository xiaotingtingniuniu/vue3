import client from '@/utils/request'

// 列表查询
export async function getDictList (params) {
    const res = await client.get('/api/api/marketing/v1/data/dict/list', { params })
    return res
}
// 审批人列表查询
export async function getAuthorList (params) {
    const res = await client.get('/api/api/marketing/v1/auditor/list', { params })
    return res
}

// 详情-单个
export async function geteDict (params) {
    const res = await client.get('/api/api/marketing/v1/data/dict', { params })
    return res
}

// 新增
export async function addDict (params) {
    const res = await client.post('/api/api/marketing/v1/data/dict', params)
    return res
}

// 编辑
export async function updateDict (params) {
    const res = await client.put('/api/api/marketing/v1/data/dict', params)
    return res
}

// 发布
export async function releaseDict (params) {
    const { code } = await client.put('/api/api/marketing/v1/data/dict/release', params)
    return code
}
// 删除
export async function deleteDict (params) {
    const { code } = await client.delete('/api/api/marketing/v1/data/dict', { data: params })
    return code
}
