import client from '@/api/axios'

// 资产入账列表
export async function incomeList (params) {
    const res = await client.post('/hzgApi/account/assets/accountWaterBills', params)
    return res
}

// 资产冻结列表
export async function frozenList (params) {
    const res = await client.post('/hzgApi/account/assets/frozenList', params)
    return res
}

// 收款账户的收款方式列表
export async function getSubLedgerPaymentMethodList (params) {
    const res = await client.post('/hzgApi/settlement/subledger/getSubLedgerPaymentMethodList', params)
    return res
}

// 资产页
export async function assetsInfo (params) {
    const res = await client.post('/hzgApi/account/assets/info', params)
    return res
}

// 钱包-提现
export async function handleWithdrawal (params) {
    const res = await client.post('/hzgApi/account/assets/withdraw', params)
    return res
}
// 钱包-获取已绑定银行卡列表
export async function queryBankCardList (params) {
    const res = await client.post('/hzgApi/account/bankCardList', params)
    return res
}
// 查询账户明细
export async function queryWaterBills (params) {
    const res = await client.post('/hzgApi/account/assets/accountWaterBills', params)
    return res
}
// 提现记录
export async function queryWithdrawaList (params) {
    const res = await client.post('/hzgApi/account/assets/withdrawalList', params)
    return res
}

// 商户->钱包开通情况
export async function queryOpenStatus (params) {
    const res = await client.post('/hzgApi/account/assets/queryOpenStatus', params)
    return res
}

// 收款账户的收款方式切换
export async function switchSubLedgerPaymentMethod (params) {
    const res = await client.post('/hzgApi/settlement/subledger/switchSubLedgerPaymentMethod', params)
    return res
}

export async function subledgerList (params) {
    const res = await client.post('/hzgApi/settlement/subledger/detail/list', params)
    return res
}
// 收支
export async function querySettlementBill (params) {
    const res = await client.post('/hzgApi/settlement/subledger/querySettlementBill', params)
    return res
}
