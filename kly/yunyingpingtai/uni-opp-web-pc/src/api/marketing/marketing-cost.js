import client from '@/utils/request'

// 账户列表 ———— 账户列表查询
export async function getAccountList (params) {
    const res = await client.get('/api/api/marketing/v1/budget/list', { params })
    return res
}

// 账户列表 ———— 新增账户
export async function postAddAccount (params) {
    const res = await client.post('/api/api/marketing/v1/acct', params)
    return res
}

// 账户列表 ———— 账户状态开启/关闭  账户状态 1：启用中 2：停用
export async function putAccountStatus (params) {
    const res = await client.put('/api/api/marketing/v1/acct/status', params)
    return res
}

// 账户列表 ———— 调整预算金额 ———— 获取全部账户名称
export async function getAllAccList (params) {
    const res = await client.get('/api/api/marketing/v1/acct/list', { params })
    return res
}

// 账户列表 ———— 调整预算金额 ———— 获取账户详情
export async function getAccDetail (params) {
    const res = await client.get('/api/api/marketing/v1/acct', { params })
    return res
}

// 账户列表 ———— 调整预算金额 ———— 上传文件到腾讯云的cos中并返回url
export async function postUpload (params) {
    const res = await client.post('/api/api/common/file', params)
    return res
}

// 账户列表 ———— 调整预算金额 ———— 提交调整后预算金额
export async function postAccDetail (params) {
    const res = await client.post('/api/api/marketing/v1/budget', params)
    return res
}

// 充值记录查询 ———— 充值记录列表查询
export async function getChargeList (params) {
    const res = await client.get('/api/api/marketing/v1/budget/charge/list', { params })
    return res
}

// 充值记录查询 ———— 审批预算 审核状态1 待审核 2 审核通过 3 审核不通过
export async function putBudgetAudit (params) {
    const { code } = await client.put('/api/api/marketing/v1/budget/audit', params)
    return code
}

// 流水查询 ———— 账户流水列表查询
export async function getDetailList (params) {
    const res = await client.get('/api/api/marketing/v1/acct/detail/list', { params })
    return res
}
