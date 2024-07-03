
import client from '@/utils/request'

const urlParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}
// 获取分佣明细列表
export const brokerageList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126497533952',
        name: '分佣明细查询',
        source: '分销系统',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 导出
export function exportDetails (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 结算订单列表
export const getOrderList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UCJH46232628863688704',
        name: '结算账单查询聚合',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 分账金额详情
export const getDetail = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC17260452254785536',
        name: '查询账单分账金额详情',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询分账人列表
export const getSubLedgerList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC14729272469987328',
        name: '查询分账人',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 分账比例列表
export const ledgerProportionList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC14729272432238592',
        name: '分账比例查询',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 分账详情列表（六期）
export const ledgerDetailList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC42927639913345024',
        name: '查询分账明细接口',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 导出
export function ledgerDetailExport (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
export const localmerchantList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC60459585811435520',
        name: '查询本地生活账单',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
export const handleWechatLimit = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC77062477935853568',
        name: '打开分账人微信可见',
        source: '结算中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
