import client from '@/api/axios'

export const getList = param => {
    const params = Object.assign({
        platform: 'h5',
        pageNum: 1,
        pageSize: 10
    }, param)
    return client({
        url: '/hzgApi/crowdsourcing/crowdsourcedProductList',
        method: 'POST',
        data: params
    })
}

export const getDetail = param => {
    const params = Object.assign({
        platform: 'h5',
        productNum: ''
    }, param)
    return client({
        url: '/hzgApi/crowdsourcing/crowdsourcedProductInfo',
        method: 'POST',
        data: params
    })
}

export const checkinventory = param => {
    const params = Object.assign({
        platform: 'h5',
        productNum: ''
    }, param)
    return client({
        url: '/hzgApi/crowdsourcing/checkinventory',
        method: 'POST',
        data: params
    })
}

// 获取我的货柜列表
export const getMyContainerList = param => {
    const params = Object.assign({
        currentPage: 1,
        pageSize: 10
    }, param)
    return client({
        url: '/hzgApi/app/cabinet/queryCabinetByPhone',
        method: 'POST',
        data: params
    })
}

// 货柜租赁详情页接口
export function containerDetail (params) {
    return client({
        url: '/hzgApi/leaseOrder/leaseOrderDetais',
        method: 'post',
        data: params
    })
}

export function stageOrderDetails (data) {
    return client({
        url: '/hzgApi/stageOrder/stageOrderDetails?' + 'orderNo' + '=' + data.orderNo,
        method: 'post',
        data
    })
}

// 货柜分期明细详情页接口(分期2.0)
export function stageBillDetails (data) {
    return client({
        url: '/hzgApi/stageOrder/repayOrderDetail?' + 'orderNo' + '=' + data.orderNo,
        method: 'post',
        data
    })
}

// 付尾款/支付尾款/去还款接口
export function goPayment (data) {
    return client({
        url: '/hzgApi/stageOrder/balancePay',
        method: 'post',
        data
    })
}

// 确认收货接口
export function confirmReveive (data) {
    return client({
        url: '/hzgApi/stageOrder/confirmReceive',
        method: 'post',
        data
    })
}

// 审核详情接口
export function auditInfo (data) {
    return client({
        url: '/hzgApi/stageOrder/auditInfo',
        method: 'post',
        data
    })
}

// 首金 去支付按钮请求
export function stageOrderPay ({ orderNo, totalAmount }) {
    return client({
        url: '/hzgApi/stageOrder/stageOrderPay',
        method: 'post',
        data: {
            orderNo,
            totalAmount
        }
    })
}

// 支付首金 结果查询
export function stageOrderPayResult (data) {
    return client({
        url: '/hzgApi/stageOrder/stageOrderPayResult',
        method: 'post',
        data
    })
}

// 设备GID上报大数据与风控接口
export function reportGid (data) {
    console.log('0000000')
    return client({
        url: '/hzgApi/stageOrder/reportGid',
        method: 'post',
        data
    })
}

// 货柜租赁详情页分期接口
export function leaseOrderStages (params) {
    return client({
        url: '/hzgApi/leaseOrder/leaseOrderStages?' + 'pointId' + '=' + params.pointId,
        method: 'get'
    })
}
// 货柜租赁详情页确认收货接口
export function confimReceive (data) {
    return client({
        url: '/hzgApi/leaseOrder/confimReceive',
        method: 'post',
        data
    })
}
// 货柜租赁详情页支付接口
export function leaseOrderPay (data) {
    return client({
        url: '/hzgApi/leaseOrder/leaseOrderPay',
        method: 'post',
        data
    })
}
// 货柜租赁详情页支付状态接口
export function leaseOrderPayResult (params) {
    return client({
        url: '/hzgApi/leaseOrder/leaseOrderPayResult?' + 'prePayNo' + '=' + params.prePayNo,
        method: 'get'
    })
}

// 货柜收入
// 柜主名下货柜
export const containerList = (param) => {
    const params = Object.assign({
        pageNum: 1,
        pageSize: 1000
    }, param)
    return client({
        url: '/hzgApi/deviceGoods/deviceList',
        data: params,
        method: 'post'
    })
}
// 货柜收入
// 柜主名下货柜-过滤版
export const containerList2 = (param) => {
    const params = Object.assign({
        subLedgerId: '',
        pageNum: 1,
        pageSize: 100
    }, param)
    return client({
        url: '/hzgApi/deviceGoods/getLedgerRateDevice',
        data: params,
        method: 'post'
    })
}
// 货柜收入列表
export const incomeList = (param) => {
    const params = Object.assign({
        page: 1,
        pageSize: 10,
        month: '', // 2022-08
        year: '', // 2022,
        isInitial: 1, // 是否初始：0 否，1：是，传1的时候会返回统计信息
        deviceNos: [] // 货柜
    }, param)
    return client({
        url: '/hzgApi/account/incomeList',
        data: params,
        method: 'post'
    })
}

// 货柜收入详情
export const incomeDetail = (param) => {
    const params = Object.assign({
        billNo: '' // 账单编号
    }, param)
    return client({
        url: '/hzgApi/account/incomeDetail',
        params: params,
        method: 'get'
    })
}

export const storelist = (param) => {
    return client({
        url: '/hzgApi/v1/merchant/sub/v1/storelist',
        params: param,
        method: 'get'
    })
}

// 商家收入列表
export const storeIncomeList = (param) => {
    const params = Object.assign({
        page: 1,
        pageSize: 10,
        month: '', // 2022-08
        year: '', // 2022,
        isInitial: 1, // 是否初始：0 否，1：是，传1的时候会返回统计信息
        deviceNos: [] // 货柜
    }, param)
    return client({
        url: '/hzgApi/account/storeIncomeList',
        data: params,
        method: 'post'
    })
}

// 钱包2.6期分期预支付单号
export function getWalletPrePay ({ orderNo, payAmount, period }) {
    return client({
        url: '/hzgApi/stageOrder/walletPrePay',
        method: 'post',
        data: {
            orderNo,
            payAmount,
            period
        }
    })
}
// 货柜收入筛选项
export async function queryStatisticsOptions (params) {
    const res = await client.post('/hzgApi/v1/merchant/equipment/queryStatisticsOptions', params)
    return res
}

// 货柜收入筛选项
export async function incomeQueryCriteria (params) {
    const res = await client.post('/hzgApi/account/incomeQueryCriteria', params)
    return res
}
