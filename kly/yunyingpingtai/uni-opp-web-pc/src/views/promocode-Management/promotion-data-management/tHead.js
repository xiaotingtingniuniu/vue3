
// 本地商家推广数据
export const tHead = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productName', label: '推广产品', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userName', label: '推广人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userPromoCode', label: '推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headPromoCode', label: '团长推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'busiMerchantId', label: '商家id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'regTime', label: '商家注册时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核状态', minWidth: 150, slot: true }, // 后端盘完需要秀嘎
    { align: 'center', tooltip: true, prop: 'finishTime', label: '审核完成时间', minWidth: 150 } // 字段

]

// 恒生活app推广数据

export const hzgTheads = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productName', label: '推广产品', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userName', label: '推广人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userPromoCode', label: '推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headPromoCode', label: '团长推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'appUserId', label: '用户id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'appPhoneMobile', label: '注册手机号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'regTime', label: '用户注册时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '订单编号', minWidth: 150 }, // 需要确认
    { align: 'center', tooltip: true, prop: 'isFirst', label: '是否首单', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'orderAmount', label: '订单金额', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'orderStatusDesc', label: '订单状态', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'finishTime', label: '交易完成时间', minWidth: 150 }, // 需要核对
    { align: 'center', tooltip: true, prop: 'isRefundEndTimeDesc', label: '是否已过退款时效', minWidth: 200 } // 缺字段

]
// 货柜分期推广数据
export const zbfqTheads = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productName', label: '推广产品', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userName', label: '推广人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userPromoCode', label: '推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headPromoCode', label: '团长推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderCode', label: '分期订单号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderSubmitTime', label: '订单提交时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'counterCode', label: '货柜型号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'counterNum', label: '货柜台数', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderAmount', label: '订单金额', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'orderAuditStatusDesc', label: '订单审核状态', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'instAuditStatusDesc', label: '分期审核状态', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'downPayStatusDesc', label: '首金支付状态', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'downPayTime', label: '首金支付时间', minWidth: 150 }

]

// 货柜全款推广数据
export const zbAllinTheads = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productName', label: '推广产品', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userName', label: '推广人姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'userPromoCode', label: '推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'headPromoCode', label: '团长推广码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderCode', label: '订单编号', minWidth: 150 }, //  对字段开始
    { align: 'center', tooltip: true, prop: 'orderSubmitTime', label: '订单提交时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'counterCode', label: '货柜型号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'counterNum', label: '货柜台数', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderAmount', label: '订单金额', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'orderStatusDesc', label: '订单状态', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orderPayTime', label: '支付完成时间', minWidth: 150 }

]
