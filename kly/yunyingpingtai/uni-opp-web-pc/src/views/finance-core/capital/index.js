export const detail = [
    { align: 'center', tooltip: true, prop: 'transNo', label: '动账流水号' },
    { align: 'center', tooltip: true, prop: 'transSubOrderNo', label: '关联订单号' },
    // { align: 'center', tooltip: true, prop: 'transOrderNo', label: '关联订单号' },
    // { align: 'center', tooltip: true, prop: 'transSubOrderNo', label: '关联子订单号' },
    { align: 'center', tooltip: true, prop: 'paymentDesc', label: '支付方式' },
    { align: 'center', tooltip: true, prop: 'transTime', label: '动账时间' },
    { align: 'center', tooltip: true, prop: 'recordDirectionDesc', label: '账户方向' },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '动账金额(元)', slot: true },
    { align: 'center', tooltip: true, prop: 'frozenAmount', label: '冻结金额(元)', slot: true },
    { align: 'center', tooltip: true, prop: 'digest', label: '记账摘要' },
    // { align: 'center', tooltip: true, prop: 'transAmount', label: '动账详情(元)', slot: true },
    { align: 'center', prop: 'resultAmount', label: '账户余额(元)', slot: true }
]
export const record = [
    { align: 'center', tooltip: true, prop: 'withNo', label: '提现单号' },
    { align: 'center', tooltip: true, prop: 'bankCard', label: '银行账号' },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '创建时间' },
    { align: 'center', tooltip: true, prop: 'gtmModify', label: '完成时间' },
    { align: 'center', tooltip: true, prop: 'withdrawalTypeDesc', label: '提现方式' },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '提现金额（元）', slot: true },
    { align: 'center', tooltip: true, prop: 'actualAmount', label: '实际到账金额（元）', slot: true },
    { align: 'center', prop: 'statusDesc', label: '状态' },
    { align: 'center', prop: 'reason', label: '提现失败原因' }
]
