import request from '../../utils/request'
const urlParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}
// 提现记录列表
export const getWithdrawalList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC15111841338335232',
        name: '查询提现详情记录',
        source: '账户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 进件管理列表
export const getIncomingList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC15148389089697792',
        name: '进件分页查询',
        source: '商户中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 导出
export function exportDetails (data) {
    return request({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 支付记录列表
export const paymentRecordList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32103406516215808',
        name: '支付记录查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 支付记录统计
export const paymentRecordStatistics = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32103693448552448',
        name: '支付记录统计查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 退款记录列表
export const refundRecordList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32104120000880640',
        name: '退款记录查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 退款记录统计
export const refundRecordStatistics = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32104320861904896',
        name: '退款记录统计查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 微信分记录列表
export const wechatRecordList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32104691638378496',
        name: '微信分记录查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 微信分记录统计
export const wechatRecordStatistics = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC32104815580061696',
        name: '微信分记录统计查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
// 刷脸付列表
export const facelist = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC43336607600488448',
        name: '刷脸支付记录查询接口',
        source: '支付中台',
        body: param
    })
    return request.post('/api/api/uniter/v1/url/request', params)
}
