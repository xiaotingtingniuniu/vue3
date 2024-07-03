<template>
    <div class="work-order-container">
        <div class="gongdaninfo">
            <h2>设备信息</h2>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">订单编号：{{detail.orderNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">OA订单号：{{detail.applyCode}}</div></el-col>
                <el-col :span="8"><div class="height-p">用户手机号：{{detail.userMobile}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">发起时间：{{detail.workStartTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">完结时间：{{detail.workEndTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">工单状态：{{detail.workStatus === 0?'待处理':detail.workStatus === 1?'已完成':'已取消'}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">异常标签：{{detail.exceptionLabelDesc}}</div></el-col>

                <!-- <el-col :span="8"><div class="height-p">订单标签：{{detail.orderLevel}}</div></el-col> -->
                <el-col :span="8"><div class="height-p">处理人：{{detail.dealName}}</div></el-col>
                <el-col :span="8"><div class="height-p">客户端类型：{{platformzList[detail.platform]}}</div></el-col>
            </el-row>

        </div>
        <div class="orderinfo">
            <h2>订单详情</h2>

            <total-table :tHead="tHeadOrder"
                         :tableData="tableDataOrder" :accountData="accountData">
                <template #goodsInformation="scope">
                    <p class='p_class'>商品编号：{{scope.row.commodityNumber}}</p>
                    <p class='p_class'>商品名称：{{scope.row.commodityName}}</p>
                </template>
                <template #realPrice="scope">
                    <span>{{(scope.row.realPrice/100).toFixed(2)}}</span>
                </template>
                <template #num="scope">
                    <span>{{scope.row.num}}</span>
                </template>
                <template #skuAmount="scope">
                    <span>{{(scope.row.skuAmount/100).toFixed(2)}}</span>
                </template>
                <template #disctAmount="scope">
                    <span>{{(scope.row.totalDisctAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderpayAmount="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
            </total-table>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import { approvalRefund, abnormalDetail, videoList, makeupList } from '@/api/refund/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
const userInfo = JSON.parse(localStorage.getItem('userInfo'))
const route = useRoute()
const router = useRouter()
const tHeadOrder = [
    { tooltip: true, prop: 'goodsInformation', label: '商品信息', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'realPrice', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'num', label: '商品数量', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuAmount', label: '合计(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'disctAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orderpayAmount', label: '支付金额(¥)', minWidth: 100, slot: true }
]

const tableDataOrder = ref([])
const tableDataAudit = ref([])
const imglist = ref([])
const dialogCancel = ref(false)
const reasonDis = ref(false)

const props = defineProps({
    visible: {
        type: Boolean
    },
    orderNo: {
        type: String
    },
    iscon: {
        type: String
    }
})

const detail = ref({})
const accountData = ref({})

const resultdata = ref({
    videoinfo: '',
    videoinfodesc: '',
    discernInfo: '',
    price: '',
    radio: 0
})
const platformzList = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    4: '恒生活支付宝小程序（未开通）',
    10: '恒掌柜Android',
    11: '恒掌柜IOS',
    20: '商家管理后台',
    21: '统一运营平台'
}
onMounted(async () => {
    await getOrderDetail()
})
watch(() => tableDataAudit.value,
    (val) => {
        tableDataAudit.value.map(item => {
            if (item.dealResult === null || item.auditPayAmount === null || (item.approvalNumedit === '' && item.dealResult === null) || (Number(item.approvalNumedit) > item.num)) {
                reasonDis.value = true
            } else {
                reasonDis.value = false
            }
            if (Number(item.approvalNumedit) === 0 || item.approvalNumedit === '') {
                item.agree = false
            } else {
                item.agree = true
            }
            if (item.isReturnFreight === 1) {
                item.auditPayAmount = ((item.approvalNumedit * (item.price - (item.discountAmount / item.num)) / 100) + (item.freight / 100)).toFixed(2)
            } else {
                item.auditPayAmount = (item.approvalNumedit * (item.price - (item.discountAmount / item.num)) / 100).toFixed(2)
                console.log(item.auditPayAmount, 'isReturnFreight+12')
            }
        })
    },
    {
        deep: true
    })

// 详情
const unrealData = ref([])
const getOrderDetail = async () => {
    const abnormaloptions = ref([])
    const params = {
        workNumber: props.orderNo
        // sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d'
    }
    const { data } = await abnormalDetail(params)
    // await abnorLabel()
    // console.log('计算及')
    // console.log(abnormaloptions.value)
    // for (let i = 0; i < abnormaloptions.value.length; i++) {
    //     if (abnormaloptions.value[i].type === data.exceptionLabel) {
    //         data.exceptionLabel = abnormaloptions.value[i].desc
    //         // debugger
    //     }
    // }
    detail.value = data
    accountData.value = data
    unrealData.value = data.deductDetail ? data.deductDetail.goodsDetails : []
    // unrealData.value = data.deductDetail.discernInfo
    imglist.value = data.refundVoucher ? data.refundVoucher.split(',') : []
    tableDataOrder.value = data.orderGoodsVO
    resultdata.value.videoinfo = detail.value.videoFirstType
    resultdata.value.videoinfodesc = detail.value.videoSecondType
    resultdata.value.discernInfo = detail.value.discernInfo ? detail.value.discernInfo : ''
}
// 提交
const refundList = ref([])
// 拒绝list
const dealResultList = ref([])
const reasonlist = ref([])
// 判断拿到的list是否有拒绝
const getList = async () => {
    refundList.value = tableDataAudit.value.flat(Infinity).map((item, index) => {
        dealResultList.value.push(item.dealResult)
        if ((item.auditPayAmount === 0 && item.dealResult === 2) || (item.auditPayAmount === '' && item.dealResult === 2) || (item.approvalNumedit > item.num) || (Number(item.approvalNumedit) === 0 && item.dealResult === 2)) {
            return false
        } else {
            return {
                commodityNumber: item.commodityNumber,
                commodityName: item.commodityName,
                price: item.price,
                num: item.num,
                approvalNum: item.approvalNumedit,
                discountAmount: item.surplus * 100,
                payAmount: item.auditPayAmount * 100,
                dealResult: item.dealResult,
                freight: item.freight,
                isReturnFreight: item.isReturnFreight,
                skuOrderNo: item.skuOrderNo

            }
        }
    })
}
// 请求方法
// const setList = async (refundList) => {
//     const params = {
//         orderNumber: detail.value.orderNumber,
//         workNumber: detail.value.workNumber,
//         remark: cancelReason.value || null,
//         sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d',
//         commodityList: refundList
//     }
//     await approvalRefund(params)
//     ElMessage.success('成功')
// }
const submit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            dialogCancel.value = true
            // setList(refundList.value)
            // emit('handleClose', props.visible)
            // emit('fevent')
            // router.go(-1)
        }
    })
    // if (detail.value.workStatus === 2) {
    //     return ElMessageBox.alert('该订单已被用户取消退款，无需继续操作！', {
    //         confirmButtonText: '确认',
    //         callback: (action) => { }
    //     })
    // } else {
    //     await getList()
    //     if (!dealResultList.value.includes(2) && !refundList.value.includes(false)) {
    //         dialogCancel.value = true
    //         reasonlist.value = refundList.value
    //     } else if (refundList.value.includes(false)) {
    //         return ElMessageBox.alert('若审核确认无需退款，处理结果请选择‘拒绝’！', {
    //             confirmButtonText: '确认',
    //             callback: (action) => { }
    //         })
    //     } else {
    //         setList(refundList.value)
    //         // emit('handleClose', props.visible)
    //         // emit('fevent')
    //         router.go(-1)
    //     }
    // }
}
const submitC = async () => {
    // await setList(reasonlist.value)
    // emit('handleClose', props.visible)
    // emit('fevent')
    dialogCancel.value = true
    // router.go(-1)
}
const ruleFormRef = ref(null)
const submitReason = async () => {
    dialogCancel.value = false
    const goodobj = ref({
        skuName: '',
        skuCode: '',
        skuBrand: '',
        skuThirdCid: '',
        skuUrl: '',
        skuPrice: '',
        quantity: ''
    })
    if (resultdata.value.radio) {
        goodobj.value.skuName = '补扣款专用'
        goodobj.value.skuCode = '220000000000'
        goodobj.value.skuBrand = ''
        goodobj.value.skuThirdCid = ''
        goodobj.value.skuUrl = 'https://hsh-goods-prod-1309143854.cos.ap-beijing.myqcloud.com/78444488-236d-4e66-ad68-8f1c1b14ff3a_120*120.jpg'
        goodobj.value.skuPrice = resultdata.value.price * 100
        goodobj.value.quantity = 1
    }
    const params = {
        workNumber: props.orderNo,
        createDeductFlag: resultdata.value.radio,
        totalAmount: detail.value.totalAmount,
        deductAmount: Number(resultdata.value.price) * 100,
        dealId: userInfo.id,
        dealName: userInfo.name,
        videoFirstType: resultdata.value.videoinfo,
        videoSecondType: resultdata.value.videoinfodesc,
        discernInfo: resultdata.value.discernInfo,
        creatorId: detail.value.dealId,
        goodsInfo: resultdata.value.radio ? goodobj.value : null
    }
    await makeupList(params)
    ElMessage.success('补扣单创建成功')
    if (props.iscon === '1') {
        router.push({ name: 'abnormal-order-list' })
    } else {
        router.push({ name: 'order-search-tool' })
    }
}

// 校验输入最大值

const checknum = (row) => {
    // reasonDis.value = true
    row.dealResult = null
    if (Number(row.approvalNumedit) > row.num) {
        ElMessage.error('不得超过申请商品退款数量')
        row.edit = false
    } else {
        row.edit = true
        console.log(row.isReturnFreight, 'isReturnFreight，lkluys')
        if (row.isReturnFreight === 1) {
            row.auditPayAmount = ((row.approvalNumedit * (row.price - (row.discountAmount / row.num)) / 100) + (row.freight / 100)).toFixed(2)
        } else {
            row.auditPayAmount = (row.approvalNumedit * ((row.price - (row.discountAmount / row.num))) / 100).toFixed(2)
        }

        row.surplus = ((row.discountAmount / row.num) * row.approvalNumedit / 100).toFixed(2)
    }
}

const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        // column 是每一列，index 表示列的索引，第一列的时候不计算合计，显示自定义的文字内容
        if (index === 0) {
            sums[index] = '总计'
            return
        }
        if (index === 3) {
            const values = data.map(item => Number(item[column.property]))
            if (!values.every(value => isNaN(value))) {
                sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr)
                    if (!isNaN(value)) {
                        return prev + curr
                    } else {
                        return prev
                    }
                }, 0)
            }
            return
        }
        switch (column.property) {
        // 申请退款商品数量
        case 'auditNum':
            sums[index] = detail.value.refundComNum
            break

            // 不需要计算合计的列就展示‘--’
        default:
            sums[index] = '--'
            break
        }
        const editT = data.map(item => item.edit)
        if (editT.includes(true)) {
            if (index === 4 || index === 2) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else {
                sums[index] = '--'
            }
        } else {
            switch (column.property) {
            // 申请退款商品数量
            case 'auditNum':
                sums[index] = detail.value.refundComNum
                break
            // 实际退款商品数量总计
            case 'approvalNumedit':
                sums[index] = detail.value.realComNum
                break
            // 实际退款优惠金额总计
            case 'surplus':
                sums[index] = (detail.value.realRefundDisAmount / 100).toFixed(2)
                break
            // 实际退款支付金额总计
            case 'auditPayAmount':
                sums[index] = (detail.value.realRefundAmount / 100).toFixed(2)
                break

            // 不需要计算合计的列就展示‘--’
            default:
                sums[index] = '--'
                break
            }
        }
    })
    return sums
}
const changeCellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return {
            color: 'red'
        }
    } else {
        return ''
    }
}

const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
.work-order-container{
    .height-p{
        line-height:40px;
    }
    h2{
        line-height:50px;
    }
    .orderinfo{
        margin-top:40px;
        .videoinfo{
            display: flex;
            .leftinfo{
                :deep(.el-select){
                    width: 450px;
                }
                width: 40%;
                .select{
                    width: 450px;
                    height: 100px;
                }
            }
            .rightinfo{
                width: 60%;
                .el-row{
                    margin-bottom: 20px;
                }
                .select{
                    width: 450px;
                }
            }
        }
    }
    .makeup{
        font-size: 18px;
        font-weight: bold;
        display: flex;
        margin-bottom: 50px;
        .text{
            color: red;
        }
    }
    :deep(.el-textarea__inner){
        height: 100px;
    }
    :deep(.el-input .el-input__inner) {
        color:red;
        text-align: center
    }
    :deep(.el-table .el-table__footer-wrapper .cell){
        font-weight: 600;
        color: red;
    }
    :deep(.el-select .select-trigger){
        width: 450px;
    }
    .p_class{
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }

    .img-box{
        img{
            display:block;
            width:150px;
        }
    }
}
</style>
