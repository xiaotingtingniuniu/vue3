import client from '@/utils/request'

// 列表查询
export async function getCouponList (params) {
    const res = await client.get('/api/api/marketing/v1/coupon/batch/list', { params })
    return res
}

// 新增批次券申请
export async function addCouponBatch (params) {
    const res = await client.post('/api/api/marketing/v1/coupon/batch', params)
    return res
}

// 券审批-新建
export async function getCouponAudit (params) {
    const { code } = await client.put('/api/api/marketing/v1/coupon/batch/status', params)
    return code
}

// 券审批-获取审批人列表
export async function getCouponApprovalList (params) {
    const res = await client.put('/api/api/marketing/v1/auditors', params)
    return res
}

// 删除
export async function deleteCouponbatch (params) {
    const { code } = await client.delete('/api/api/marketing/v1/coupon/batch', { data: params })
    return code
}

// 批次券申请查询单条
export async function getCouponDataSingle (params) {
    const res = await client.get('/api/api/marketing/v1/coupon/batch', { params })
    return res
}

// 批次券申请修改
export async function updateCouponBatch (params) {
    const res = await client.put('/api/api/marketing/v1/coupon/batch', params)
    return res
}

// 批次券申请审批
export async function approvalCouponBatch (params) {
    const res = await client.put('/api/api/marketing/v1/coupon/audit/status', params)
    return res
}

// 券详情
export async function couponDetails (params) {
    const res = await client.get('/api/api/marketing/v1/coupon/details/list', { params })
    return res
}

// 券详情-导出
export function exportDetails (data) {
    return client({
        url: '/api/api/marketing/v1/coupon/details/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 券详情-导出券包码
export function exportCouponBagCode (data) {
    return client({
        url: '/api/api/marketing/v1/coupon/bath/cdk',
        method: 'get',
        data,
        responseType: 'blob'
    })
}

// 获取城市信息
export async function getCityList () {
    const res = await client.get('/api/api/marketing/v1/address/city/tree')
    return res
}

// 申请券批次 ————  获取账户列表
export async function getAccList (params) {
    const res = await client.get('/api/api/marketing/v1/budget/list', { params })
    return res
}

// 优惠券申请 ————  获取门店列表
export async function getShopList (params) {
    const res = await client.get('/yzc-api/admin/store/marketing/queryList', { params })
    return res
}
