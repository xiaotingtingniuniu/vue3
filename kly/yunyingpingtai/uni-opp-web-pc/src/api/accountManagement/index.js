import request from '@/utils/request'
const urlParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}
export const getAccountlList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC16202113716056064',
        name: '查询账户信息列表',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const getWarterList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC17327976992415744',
        name: '查询动账明细详情接口',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}

export const frozenAccountl = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32051641431113728',
        name: '账户冻结 ',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}

export const unfrozenAccountl = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32053673898557440',
        name: '账户解冻 ',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export function exportDetails (data) {
    return request({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 1229
export const platWarterList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC58208032889065472',
        name: '查询平台动账流水',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const plataccountList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC58206707887460352',
        name: '查询平台账户列表',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const passagewayexList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC60322921300598784',
        name: '通道结算查询',
        source: '结算中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const passagewayexport = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC60323382451740672',
        name: '通道结算下载明细',
        source: '结算中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const rateList = (param) => {
    const params = Object.assign({
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC56749335831015424',
        name: '查询商家平台费用',
        source: '结算中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const ratesList = (param) => {
    const params = Object.assign({
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC61045309265633280',
        name: '平台类目费率列表查询接口',
        source: '结算中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
export const editrates = (param) => {
    const params = Object.assign({
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC61045671796105216',
        name: '平台类目费率修改接口',
        source: '结算中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
