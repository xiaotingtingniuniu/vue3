import client from '@/utils/request'
const urlParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}
// 团长列表
export const getHeadList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10086547138461696',
        name: '分页查询团长审批表',
        source: '用户中台',
        body: param
    })
    return client.post('/api/api/user/v1/regiments/list', params)
}
export const userUpdate = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC9666926731317248',
        name: '修改用户申请信息接口',
        source: '账户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 团长申请列表
export const headApplyList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC10374939101282304',
        name: '查询审核用户列表接口',
        source: '账户中台',
        body: param
    })
    return client.post('/api/api/user/v1/apply/list', params)
}
// 审核
export const shenhe = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC9666481141043200',
        name: '用户审核接口',
        source: '账户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
