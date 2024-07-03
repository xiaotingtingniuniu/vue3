export const THead = [
    { align: 'center', tooltip: true, prop: 'requestNo', label: '提现申请单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'mobile', label: '柜主手机号', fixed: true },
    { align: 'center', tooltip: true, prop: 'userName', label: '柜主名称', fixed: true },
    { align: 'center', tooltip: true, prop: 'bankCard', label: '收款账号', fixed: true },
    { align: 'center', tooltip: true, prop: 'transAmount', label: '提现金额', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'currency', label: '币种', fixed: true },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'payNo', label: '提现流水号', fixed: true },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '提现申请时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'gtmModify', label: '提现完成时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'reason', label: '失败原因', fixed: true }
]

export const pieceThead = [
    { align: 'center', tooltip: true, prop: 'userId', label: '用户id', width: 90 },
    { align: 'center', tooltip: true, prop: 'userName', label: '真实姓名', width: 90 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '手机号', width: 90 },
    { align: 'center', tooltip: true, prop: 'requestNo', label: '进件申请编号', width: 110 },
    { align: 'center', tooltip: true, prop: 'payChannelCode', label: '支付渠道', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'settlementWay', label: '支付方式', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'corporateType', label: '商家类型', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantShortName', label: '商家简称', width: 90 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '公司主体', width: 90 },
    { align: 'center', tooltip: true, prop: 'contractStatus', label: '进件状态', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'subMchid', label: '二级商户号', width: 110 },
    { align: 'center', tooltip: true, prop: 'applymentId', label: '微信支付申请编号', width: 140 },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '申请进件时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'doneTime', label: '进件完成时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'verifyDoneTime', label: '验证完成时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'signDoneTime', label: '签约完成时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'rejectReason', label: '驳回原因', width: 90 }
]
export const paymentThead = [
    { align: 'center', tooltip: true, prop: 'productCode', label: '业务线', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'businessCodeName', label: '子业务线', width: 90 },
    { align: 'center', tooltip: true, prop: 'subProductCodeName', label: '支付场景名称', width: 110 },
    { align: 'center', tooltip: true, prop: 'tradeNo', label: '业务订单id', width: 110 },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '总订单金额', width: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'currency', label: '币种', width: 90 },
    { align: 'center', tooltip: true, prop: 'payTypeName', label: '支付产品', width: 90 },
    { align: 'center', tooltip: true, prop: 'channelName', label: '支付渠道', width: 90 },
    { align: 'center', tooltip: true, prop: 'subTradeNo', label: '子订单id', width: 90 },
    { align: 'center', tooltip: true, prop: 'orderAmount', label: '订单金额', width: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '申请支付时间', width: 140 },
    { align: 'center', tooltip: true, prop: 'finishTime', label: '支付完成时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '收款账号', width: 110 },
    { align: 'center', tooltip: true, prop: 'thirdOrderNo', label: '支付流水号', width: 110 },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '支付金额', width: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'goodName', label: '商品名称', width: 90 },
    { align: 'center', tooltip: true, prop: 'payStatusName', label: '支付状态', width: 90 },
    { align: 'center', tooltip: true, prop: 'settlementFlagName', label: '是否需要分账', width: 110 }
]
export const refundThead = [
    { align: 'center', tooltip: true, prop: 'refundNo', label: '退款申请id', fixed: true },
    { align: 'center', tooltip: true, prop: 'businessCodeName', label: '业务线名称', fixed: true },
    { align: 'center', tooltip: true, prop: 'refundAmount', label: '退款金额', fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'currency', label: '币种', fixed: true },
    { align: 'center', tooltip: true, prop: 'tradeRefundNo', label: '业务退款单号', fixed: true },
    { align: 'center', tooltip: true, prop: 'tradeNo', label: '业务订单id', fixed: true },
    { align: 'center', tooltip: true, prop: 'outPayNo', label: '支付流水号', fixed: true },
    { align: 'center', tooltip: true, prop: 'payChannelName', label: '支付渠道', fixed: true },
    { align: 'center', tooltip: true, prop: 'payTypeName', label: '支付方式', fixed: true },
    { align: 'center', tooltip: true, prop: 'refundStatusName', label: '退款状态', fixed: true },
    { align: 'center', tooltip: true, prop: 'refundReason', label: '失败原因', fixed: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '申请退款时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'gmtRefundSuccess', label: '实际退款时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户号', fixed: true }
]
export const wechatThead = [
    { align: 'center', tooltip: true, prop: 'payNo', label: '服务订单号', width: 100 },
    { align: 'center', tooltip: true, prop: 'subProductCodeName', label: '支付场景', width: 90 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '平台商户号', width: 100 },
    { align: 'center', tooltip: true, prop: 'subMerchantId', label: '二级子商户号', width: 110 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '用户手机号', width: 100 },
    { align: 'center', tooltip: true, prop: 'channelName', label: '支付渠道', width: 90 },
    { align: 'center', tooltip: true, prop: 'payTypeName', label: '支付方式', width: 90 },
    { align: 'center', tooltip: true, prop: 'tradeNo', label: '业务订单id', width: 100 },
    { align: 'center', tooltip: true, prop: 'thirdPayNo', label: '微信分单号', width: 100 },
    { align: 'center', tooltip: true, prop: 'wxPayStatus', label: '服务状态', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'payActAmount', label: '金额', width: 90, slot: true },
    { align: 'center', tooltip: true, prop: 'currency', label: '币种', width: 90 },
    { align: 'center', tooltip: true, prop: 'payStatusName', label: '支付状态', width: 90 },
    { align: 'center', tooltip: true, prop: 'outPayNo', label: '支付流水号', width: 100 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '申请创建时间', width: 110 },
    { align: 'center', tooltip: true, prop: 'successTime', label: '确认成功时间', width: 110 }
]
export const facescanThead = [
    { align: 'center', tooltip: true, prop: 'businessCode', label: '业务线名称', fixed: true },
    { align: 'center', tooltip: true, prop: 'businessCodeName', label: '支付场景名称' },
    { align: 'center', tooltip: true, prop: 'wxPayStatusName', label: '状态' },
    { align: 'center', tooltip: true, prop: 'tradeNo', label: '业务订单号' },
    { align: 'center', tooltip: true, prop: 'thirdPayNo', label: '支付分单号' },
    // { align: 'center', tooltip: true, prop: 'tradeNo', label: '申请凭证时间', fixed: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建支付分时间' },
    { align: 'center', tooltip: true, prop: 'successTime', label: '完结时间' }
]
