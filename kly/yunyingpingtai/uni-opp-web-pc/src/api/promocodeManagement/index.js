import client from '@/utils/request'

export function merchantIntentionExport (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 推广产品管理列表
export const productlist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53138287410188288',
        name: '分页查询推广产品列表',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询业务线
export const allbusiness = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53772472084463616',
        name: '查询所有业务线',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 推广产品启用禁用
export const productenable = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53138485351976960',
        name: '推广产品启用/禁用',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 编辑产品
export const editproduct = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53138063262388224',
        name: '编辑推广产品',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 新增产品
export const newproduct = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53137833318060032',
        name: '新建推广产品',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 组织列表
export const organizationlist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53134544803368960',
        name: '分页查询组织列表',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 组织编辑
export const editorganization = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53122505364115456',
        name: '编辑组织',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}// 组织新增
export const neworganization = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53122085010968576',
        name: '新建组织',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 组织详情
export const organizationDeatil = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53122642572382208',
        name: '组织详情',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 商户id
export const merchantid = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53421995048472576',
        name: '查询已审核通过的商户列表-不分页',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 组织详情
export const organizationdetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53122642572382208',
        name: '组织详情',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 组织启用禁用
export const eableorganization = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53137035175563264',
        name: '组织启用/禁用',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 推广规则列表
export const rulelist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53139565137793024',
        name: '分页查询推广规则列表',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 新增推广规则
export const newrule = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53138940136165376',
        name: '新建推广规则',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 编辑推广规则
export const editrule = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53139076618817536',
        name: '编辑推广规则',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 推广规则启用禁用
export const eablerule = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53140452086288384',
        name: '推广规则启用/禁用',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 团队审核列表
export const processlist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53140842580185088',
        name: '团队审核-待审核列表',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 推广规则列表
export const processsubmit = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53141106682925056',
        name: '团队审核-审核提交',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 团队列表
export const teamlist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53141413924081664',
        name: '团队列表-列表查询',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 团队列表启用禁用
export const teameable = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53141619457560576',
        name: '团队列表-状态-禁用启用',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 业务线获取启用的组织产品联动数据
export const busiorgproduct = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54276773982146560',
        name: '按照业务线获取启用的组织产品联动数据',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 人员明细
export const peopledetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53141761879347200',
        name: '团队列表-团队人员明细',
        source: '推广系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 团队列表导出
export const teamlistexport = (data) => {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
