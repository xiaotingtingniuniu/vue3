import client from '@/utils/request'

// 客服-列表
export async function refundList (params) {
    const { data } = await client.get('/yzc-api/admin/hshrefundorderinfo/queryList', { params })
    return data
}

// 客服-详情
export async function refundDetail (params) {
    const { data } = await client.post('/yzc-api/admin/hshrefundorderinfo/queryInfo', params)
    return data
}

// 客服-审批
export async function approvalRefund (params) {
    const { code } = await client.post('/yzc-api/admin/hshrefundcommodityinfo/approvalRefund', params)
    return code
}

// 客服-关闭微信支付分-列表数据查询
export async function getWechartOffList (params) {
    const res = await client.get('/api/api/uniter/v1/wxpay/score/record/list', { params })
    return res
}

// 客服-关闭微信支付分-提交
export async function postWechartOff (params) {
    const res = await client.post('/api/api/uniter/v1/wxpay/score', params)
    return res
}

// 指定手机号发券
export async function repairRecord (params) {
    const { code } = await client.post('/api/api/uniter/v1/coupon/repair/record', params)
    return code
}

// 手机号发券记录

export async function recordList (params) {
    const res = await client.get('/api/api/uniter/v1/coupon/repair/record/list', { params })
    return res
}
// 异常标签分类
// export async function abnormalSelect (params) {
//     const res = await client.get('/yzc-api/admin/hshexceptionorder/v1/queryLabelList', { params })
//     return res
// }
export const abnormalSelect = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288969064587264',
        name: '获取异常标签接口',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 异常单列表
// export async function abnormalList (params) {
//     const res = await client.get('/yzc-api/admin/hshexceptionorder/v1/queryWorkOfExceptionOrderList', { params })
//     return res
// }
export const abnormalList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288870351642624',
        name: '根据条件模糊搜索异常工单',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 异常单详情
// export async function abnormalDetail (params) {
//     const res = await client.get('/yzc-api/admin/hshexceptionorder/v1/queryExceptionOrderDetailByWorkNumber', { params })
//     return res
// }
export const abnormalDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288797014237184',
        name: '异常工单查看详情接口',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 视频分类
// export async function videoList (params) {
//     const res = await client.get('/yzc-api/admin/hshexceptionorder/v1/searchVideoType', { params })
//     return res
// }
export const videoList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21289066598932480',
        name: '查询视频分类通用接口',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 异常标签分类
export async function abnormalLabel (params) {
    const res = await client.post('/yzc-api/admin/hshexceptionorder/v1/queryLabelList', params)
    return res
}
// export const abnormalLabel = (param) => {
//     const params = Object.assign({
//         appKey: 'A1001000', // 系统编号
//         busiCode: 'A1001000', // 业务线编号
//         configCode: 'UC21288969064587264',
//         name: '获取异常标签接口',
//         source: '工单中台',
//         body: param
//     })
//     return client.post('/api/api/uniter/v1/url/request', params)
// }
// 创建补扣单
// export async function makeupList (params) {
//     const res = await client.post('/yzc-api/admin/hshexceptionorder/v1/finishWorkOfExceptionOrder', params)
//     return res
// }
export const makeupList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288684099379200',
        name: '创建补扣单及完成工单接口',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 异常/正常单创建工单
export async function exceptionOrder (params) {
    const res = await client.post('/yzc-api/admin/hshexceptionorder/v1/createExceptionOrderWork', params)
    return res
}
// export const exceptionOrder = (param) => {
//     const params = Object.assign({
//         appKey: 'A1001000', // 系统编号
//         busiCode: 'A1001000', // 业务线编号
//         configCode: 'UC21288527916081152',
//         name: '获取投诉列表',
//         source: '工单中台',
//         body: param
//     })
//     return client.post('/api/api/uniter/v1/url/request', params)
// }
// 微信平台
// export async function wechart (params) {
//     const res = await client.get('/yzc-api/admin/complaintsorder/v2/order/queryCompalinOrder', { params })
//     return res
// }
export const wechart = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288527916081152',
        name: '获取投诉列表',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 微信投诉列表展示
// export async function wechartList (params) {
//     const res = await client.get('/yzc-api/admin/complaintsorder/v1/order/complaintsPage', { params })
//     return res
// }
export const wechartList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21288303495651328',
        name: '投诉列表--条件搜索',
        source: '工单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 优惠券查询接口
export const couponList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC23438944179494912',
        name: 'B端-用户券列表(通用)',
        source: '营销中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 优惠券核销
export const usedCoupon = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC21287496757043200',
        name: '用户券核销',
        source: '营销中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
