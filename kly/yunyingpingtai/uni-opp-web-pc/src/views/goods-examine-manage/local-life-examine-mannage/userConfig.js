
import { reactive, ref } from 'vue'
export const tHead = [
    { align: 'center', tooltip: true, minWidth: 100, type: 'selection' },
    { align: 'center', tooltip: true, prop: 'approvalCode', label: '申请编号', minWidth: 230, slot: true },
    { align: 'center', tooltip: true, prop: 'approveStatus', label: '审核状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编码', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 130 },
    { align: 'center', tooltip: false, prop: 'categoryList', label: '商品分类', minWidth: 300, slot: true },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '适用店铺', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户ID', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 130 },
    { align: 'center', tooltip: false, prop: 'image', label: '商品列表图', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '提交时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'approveTime', label: '审核时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'approveAdvise', label: '审核结果', minWidth: 130, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 180, slot: true }
]

export const dataState = reactive({
    pageInfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    // searchData: {
    //     approvalCode: '', // 申请编号
    //     merchantId: '', // 商户ID
    //     merchantName: '', // 商户名称
    //     approveStatus: '', // 审核状态 2 审批中、3 审批通过、4审批拒绝
    //     skuId: '', // 商品编码
    //     skuName: '', // 商品名称
    //     gmtApplyStart: '', // 提交开始时间
    //     gmtApplyEnd: '', //	提交结束时间
    //     date: []
    // },
    tableData: [],
    detailDate: {},
    busiCates: ''

})

export const detailInfo = ref({
    approvalCode: '', // 审批编号
    approveStatus: '', // 审核状态
    approveTime: '', // 申请时间
    applyTime: '', // 审批时间
    approver: '', // 审批人
    zhutuList: [],
    lunbolist: [],
    mediasList: [],

    StandardList: [] // 标品通用图  11

})

export const ruleForm = reactive({
    state: null, // 审批状态 3、审核通过 4、驳回
    approveAdvise: null, // 审批意见
    creatProduct: null, // 是否创建新标品
    saleChannel: [] // 销售渠道

})
// 表单项规则
export const rules = reactive({
    approveAdvise: [{ required: true, message: '请选择审批意见', trigger: 'change' }],
    approveStatus: [{ required: true, message: '请选择审批意见', trigger: 'change' }]

})
