import client from '@/utils/request'

// 列表查询
export async function getUrlConfigList (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/list', params)
    return res
}
// 详情-单个
export async function getOneConfig (params) {
    const res = await client.get('/hsh-guizhu-merchant-api/api/uniter/v1/url/get/' + params)
    return res
}
// 在线调试
export async function debugConfig (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/request', params)
    return res
}

// 新增
export async function addConfig (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/config', params)
    return res
}

// 编辑
export async function updateConfig (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/update', params)
    return res
}

// 同步
export async function syncConfig (params) {
    const { code } = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/sync', params)
    return code
}
// 删除
export async function deleteConfig (params) {
    const { code } = await client.delete('/hsh-guizhu-merchant-api/api/uniter/v1/url/config/delete', { data: params })
    return code
}

export async function commonRequest (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/api/uniter/v1/url/ignoreSecurity/request', params)
    return res
}

export async function addDict (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/add', params)
    return res
}
export async function addDictDetail (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/addDictDetail', params)
    return res
}
export async function updateDictDetail (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/updateDictDetail', params)
    return res
}
export async function releaseDict (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/release', params)
    return res
}
export async function deleteDict (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/deleteDict', params)
    return res
}
export async function deleteDictDetail (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/deleteDictDetail', params)
    return res
}
export async function getDictList (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/all', params)
    return res
}
export async function getDictDetail (dictType, params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/detail/' + dictType, params)
    return res
}

export async function loadDictDetailCache (params) {
    const res = await client.post('/hsh-guizhu-merchant-api/dict/cache/', params)
    return res
}

export async function saveTokenRedis () {
    await client.post('/hsh-guizhu-merchant-api/v1/permission/getInfo')
}

export async function getSuggestions (params) {
    const res = await client.get('/hsh-guizhu-merchant-api/api/uniter/v1/url/ignoreSecurity/getSuggestions', { params })
    return res
}
