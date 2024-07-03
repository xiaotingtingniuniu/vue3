import client from '@/utils/request'

// 获取经营资质列表（1215三合一项目）
export const getBusiQualist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC53147271881986048',
        name: '经营资质配置-列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-新增（1215三合一项目）
export const addBusiQua = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53147425875857408',
        name: '经营资质配置-新增',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 标签管理页面-详情（1215三合一项目）
export const getBusiQuaDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53147740436074496',
        name: '经营资质配置-详情',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-更新（1215三合一项目）
export const updateBusiQua = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53147580435959808',
        name: '经营资质配置-更新',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-删除（1215三合一项目）
export const delBusiQua = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53147904819236864',
        name: '经营资质配置-删除',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 获取商户类型（1215三合一项目）
export const getMchtTypeList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54632674881867776',
        name: '获取商户类型列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
