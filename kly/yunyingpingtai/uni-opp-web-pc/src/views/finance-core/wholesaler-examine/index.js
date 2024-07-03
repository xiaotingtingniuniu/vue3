const selectableFn = (row, index) => {
    return row.auditStatus === 0
}

export const tHead = [
    { align: 'center', type: 'selection', selectable: selectableFn, label: '排序', width: 80 },
    { align: 'center', tooltip: true, prop: 'withNo', label: '提现单号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'userId', label: '批发商ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'bankAcctName', label: '收款账户名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'openBank', label: '银行名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'bankCard', label: '银行卡号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'bindTypeDesc', label: '银行卡账户类型', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'initAmount', label: '提现前余额（元）', minWidth: 150, slot: true },
    { align: 'center', prop: 'transAmount', label: '提现金额（元）', minWidth: 150, slot: true },
    { align: 'center', prop: 'actualAmount', label: '到账金额（元）', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '申请时间', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'auditStatusDesc', label: '审核状态', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审核时间', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'statusDesc', label: '提现状态', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'gtmModify', label: '完成时间', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'reason', label: '提现失败原因', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'userName', label: '操作人', minWidth: 100 }
]
export const channeltHead = [
    { align: 'center', tooltip: true, prop: 'settlementDate', label: '通道结算日期', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'transactionAmount', label: '本期交易金额（元）', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'channelScAmount', label: '本期内扣手续费（元）', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'refundAmount', label: '本期退款金额（元）', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'channelRefundfeeAmount', label: '本期返还手续费（元）', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'settledAmount', label: '本期应结算金额（元）', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 100, slot: true }
]
