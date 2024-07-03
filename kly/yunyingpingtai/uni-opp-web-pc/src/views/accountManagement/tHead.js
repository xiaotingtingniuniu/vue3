export const tHeads = [
    // { align: 'center', tooltip: true, prop: 'indexNum', label: '序号', fixed: true },
    { align: 'center', tooltip: true, prop: 'userId', label: '业务线商家ID', minWidth: '150px' },
    { align: 'center', tooltip: true, prop: 'transNo', label: '业务线', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'transOrderNo', label: 'subaccountID', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'channelType', label: '渠道', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subAcctState', label: '账户状态', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subAcctAmount', label: '账户余额(元)', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subFrozenAmount', label: '冻结金额(元)', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 150, slot: true }
]
export const busTHead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '业务线商家ID', minWidth: 150, fixed: true },
    { align: 'center', tooltip: true, prop: 'transNo', label: '业务线', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'transOrderNo', label: 'subaccountID', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'channelType', label: '渠道', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subAcctState', label: '账户状态', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subAcctAmount', label: '账户余额(元)', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'subFrozenAmount', label: '冻结金额(元)', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 150, slot: true }
]
export const waterTHead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '柜主ID', fixed: true },
    { align: 'center', tooltip: true, prop: 'transNo', label: '动账流水号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transOrderNo', label: '关联订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'paymentDesc', label: '支付方式', fixed: true },
    { align: 'center', tooltip: true, prop: 'transSubOrderNo', label: '关联子订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transTime', label: '动账时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'recordDirection', label: '账户方向', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '动账金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'digest', label: '记账摘要', fixed: true },
    { align: 'center', tooltip: true, prop: 'resultAmount', label: '账户余额(元)', fixed: true, slot: true }
]
export const businessTHead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '柜主ID', fixed: true },
    { align: 'center', tooltip: true, prop: 'transNo', label: '动账流水号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transOrderNo', label: '关联订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'paymentDesc', label: '支付方式', fixed: true },
    { align: 'center', tooltip: true, prop: 'transSubOrderNo', label: '关联子订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transTime', label: '动账时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'recordDirection', label: '账户方向', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '动账金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'digest', label: '记账摘要', fixed: true },
    { align: 'center', tooltip: true, prop: 'resultAmount', label: '账户余额(元)', fixed: true, slot: true }
]
// export const busTHead = [
//     { align: 'center', tooltip: true, prop: 'userId', label: '业务线商家ID', minWidth: 150, fixed: true },
//     { align: 'center', tooltip: true, prop: 'transNo', label: '业务线', minWidth: 120, slot: true },
//     { align: 'center', tooltip: true, prop: 'transOrderNo', label: 'subaccountID', minWidth: 120, slot: true },
//     { align: 'center', tooltip: true, prop: 'channelType', label: '渠道', minWidth: 120, slot: true },
//     { align: 'center', tooltip: true, prop: 'subAcctState', label: '账户状态', minWidth: 120, slot: true },
//     { align: 'center', tooltip: true, prop: 'subAcctAmount', label: '账户余额(元)', minWidth: 120 },
//     { align: 'center', tooltip: true, prop: 'subFrozenAmount', label: '冻结金额(元)', minWidth: 120 },
//     { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 150, slot: true }
// ]
export const platTHead = [
    { align: 'center', tooltip: true, prop: 'mainUserId', label: '平台商家ID', fixed: true },
    { align: 'center', tooltip: true, prop: 'acctId', label: 'accountID', fixed: true },
    { align: 'center', tooltip: true, prop: 'walletAcctTypeDesc', label: '账户类型', fixed: true },
    { align: 'center', tooltip: true, prop: 'acctStateDesc', label: '账户状态', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'availableAmount', label: '账户金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', fixed: true, slot: true }
]
export const platformTHead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '平台商户ID', fixed: true },
    { align: 'center', tooltip: true, prop: 'transNo', label: '动账流水号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transOrderNo', label: '关联订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'paymentDesc', label: '支付方式', fixed: true },
    { align: 'center', tooltip: true, prop: 'transSubOrderNo', label: '关联子订单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transTime', label: '动账时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'recordDirection', label: '账户方向', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '动账金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'digest', label: '记账摘要', fixed: true },
    { align: 'center', tooltip: true, prop: 'resultAmount', label: '账户余额(元)', fixed: true, slot: true }
]
export const channelTHead = [
    { align: 'center', tooltip: true, prop: 'businessId', label: '第三方渠道账号', fixed: true },
    { align: 'center', tooltip: true, prop: 'walletAcctTypeDesc', label: '账户类型', fixed: true },
    { align: 'center', tooltip: true, prop: 'openStateDesc', label: '开户状态', fixed: true },
    { align: 'center', tooltip: true, prop: 'channelTypeDesc', label: '开通渠道', fixed: true },
    { align: 'center', tooltip: true, prop: 'walletAcctStateDesc', label: '账户状态', fixed: true },
    { align: 'center', tooltip: true, prop: 'cashAmount', label: '现金余额', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'settlementAmount', label: '待结算余额（元）', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', fixed: true, slot: true }
]
