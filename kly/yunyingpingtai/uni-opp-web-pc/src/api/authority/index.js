import client from '@/utils/request'

const proxyUrl = '/api'
const urlParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001000' // 业务线编号
}

// 组织列表查询
export const organizationList = async (params) => {
    const { data } = await client.get('/api/permission/organization/list', { params })
    return data
}

// 组织列表查询
export const organizationListNew = async (params) => {
    return client.get(`${proxyUrl}/permission/organization/v2/list`, { params })
}

// 组织创建
export const organizationCreate = (param) => {
    const params = Object.assign({
        ...urlParam,
        name: '', // 组织名称
        type: 1, // 默认内部 1
        state: '', // 是否启用，默认1启用
        parentId: -1, // 新增 没有为-1
        sort: 1, // 排序
        terminalFlag: 2 // 是否终端组织 新增 1 是 2 否，默认1
    }, param)
    return client.post(`${proxyUrl}/permission/organization/create`, params)
}

// 组织详情
export const organizationDetail = (param) => {
    const params = Object.assign({
        ...urlParam,
        id: '' // 组织编码
    }, param)
    return client.get(`${proxyUrl}/permission/organization/detail`, { params })
}

// 组织修改
export const organizationModify = (param) => {
    const params = Object.assign({
        ...urlParam,
        name: '', // 组织名称
        id: '', // 组织编码
        state: '', // 是否启用，默认1启用
        parentId: -1, // 新增 没有为-1
        sort: 1, // 排序
        terminalFlag: 2 // 是否终端组织 新增 1 是 2 否，默认1
    }, param)
    return client.post(`${proxyUrl}/permission/organization/modify`, params)
}

// 组织删除
export const organizationDel = (param) => {
    const params = Object.assign({
        ...urlParam,
        id: '' // 组织编码
    }, param)
    return client.post(`${proxyUrl}/permission/organization/v2/delete`, params)
}

// 组织删除
export const organizationTree = () => {
    return client.get(`${proxyUrl}/permission/organization/v2/selectTree`, { urlParam })
}

// 角色列表查询
export const roleList = async (param) => {
    const params = Object.assign({
        ...urlParam,
        name: '', // 角色名称
        organizationIds: '', // 组织ID列表 逗号分隔
        state: '', // 状态 是否启用，默认1启用
        curPage: 1, // 当前页
        pageSize: 10 // 页数
    }, param)
    return client.get(`${proxyUrl}/permission/role/list`, { params })
}

// 角色创建
export const roleCreate = async (params) => {
    const res = await client.post('/api/permission/role/create', params)
    return res
}

// 角色创建
export const roleCreateApi = async (params) => {
    const res = await client.post(`${proxyUrl}/permission/role/create`, params)
    return res
}

// 功能权限
export const resourceDetail = async (params) => {
    const res = await client.get('/api/permission/resource/detail', { params })
    return res
}

// 角色详情
export const roleDetail = async (params) => {
    const res = await client.get('/api/permission/role/detail', { params })
    return res
}

// 角色修改
export const roleModify = async (params) => {
    const res = await client.post(`${proxyUrl}/permission/role/modify`, params)
    return res
}

// 用户列表
export const managerList = async (params) => {
    const { data } = await client.get('/api/permission/manager/list', { params })
    return data
}

// ehr用户筛选
export const ehrManagerList = async (params) => {
    const { data } = await client.get('/api/permission/manager/ehr', { params })
    return data
}

// 创建用户
export const managerCreate = (param) => {
    const params = Object.assign({
        ...urlParam,
        sceneCode: '', // 场景编号
        functionCode: '', // 功能编号
        clientType: '', // 客户端类型
        scope: 1, // 是否为内部用户 1 内部 2外部
        account: '', // 账号
        name: '', // 角色名称
        mobile: '', // 手机号
        roles: '', // 角色列表
        type: 1,
        organizationIds: '', // 组织ID列表 逗号分隔
        state: '' // 状态 1启用 0 停用
    }, param)
    return client.post('/api/permission/manager/create', params)
}

// 重置密码
export const resetPassWord = (param) => {
    const params = Object.assign({
        ...urlParam,
        sceneCode: '', // 场景编号
        functionCode: '', // 功能编号
        clientType: '', // 客户端类型
        id: ''
    }, param)
    return client.post('/api/permission/manager/v2/reset/pwd', params)
}
// 用户详情
export const managerDetail = async (params) => {
    const { data } = await client.get('/api/permission/manager/detail', { params })
    return data
}

// 修改用户
export const managerModify = async (params) => {
    const data = await client.post('/api/permission/manager/modify', params)
    return data
}

// 角色模版列表
export const roleTemplateList = async (params) => {
    const { data } = await client.get('/api/permission/roleTemplate/v1/list', { params })
    return data
}

// 角色模版详情
export const roleTemplateDetail = async (params) => {
    const data = await client.get('/api/permission/roleTemplate/v1/detail', { params })
    return data
}

// 角色模版创建
export const roleTemplateCreate = async (params) => {
    const res = await client.post('/api/permission/roleTemplate/v1/create', params)
    return res
}

// 角色模版修改
export const roleTemplateModify = async (params) => {
    const data = await client.post('/api/permission/roleTemplate/v1/modify', params)
    return data
}
// 用户新增组织列表
export const userAddOrganization = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC33196025388376064',
        name: '组织列表支持分页(无层级)',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 角色新增组织列表
export const roleAddOrganization = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC33196148411506688',
        name: '组织查询列表接口',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
