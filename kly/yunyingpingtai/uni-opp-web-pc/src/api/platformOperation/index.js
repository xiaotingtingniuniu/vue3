import client from '@/utils/request'

// 运营人员分页数据列表
export const getAllList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC28893895504601088',
        name: '运营人员分页数据列表',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 创建货柜运营人员
export const operationAdd = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC28893806929289216',
        name: '创建货柜运营人员',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// EHR用户查询接口
export const getEhrList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC28893676532572160',
        name: 'EHR用户查询接口',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 编辑货柜运营人员
export const operationEdit = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC33506222668861440',
        name: '编辑货柜运营人员',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 删除货柜运营人员
export const operationDetele = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC28893958528212992',
        name: '删除货柜运营人员',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询人员详情
export const operationQueryById = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC33650668379742208',
        name: '查询人员详情',
        source: '权限中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
