import client from '@/api/axios'

// 账户信息
export async function accountInfo (params) {
    const res = await client.get('/hzgApi/account/getAccountInfo', { params })
    return res
}
// 提现记录
export async function withdrawalList (params) {
    const res = await client.get('/hzgApi/account/getWithdrawalList', { params })
    return res
}
// 补贴记录
export async function subsidyList (params) {
    const res = await client.get('/hzgApi/account/getCouponSubsidyList', { params })
    return res
}

// 申请提现
export async function saveWithdrawal (params) {
    const res = await client.post('/hzgApi/account/saveWithdrawal', params)
    return res
}

// 保存绑定
export async function saveBind (params) {
    const res = await client.post('/hzgApi/account/saveBindThirdInfo', params)
    return res
}
