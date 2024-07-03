<template>
    <div>
        <div class="order-information">
            <span class="information">订单信息</span>
            <span class="is-delivery">{{statusValue[detail.orderStatus]}}</span>
        </div>
        <div class="orderinfo">
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">订单编号：{{detail.orderNoSub}}</div></el-col>
                <el-col :span="8"><div class="height-p">商家ID：{{detail.merchantCode}}</div></el-col>
                <el-col :span="8"><div class="height-p">商家名称：{{detail.merchantName}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">用户ID：{{detail.userId}}</div></el-col>
                <el-col :span="8"><div class="height-p">用户手机号：{{detail.userMobile}}</div></el-col>
                <el-col :span="8"><div class="height-p">支付单号：{{detail.payNo}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">支付方式：{{payTypes[detail.payType]}}</div></el-col>
                <el-col :span="8"><div class="height-p">订单下单时间：{{detail.gmtCreate}}</div></el-col>
                <el-col :span="8"><div class="height-p">订单支付时间：{{detail.payTime}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">订单结束时间{{detail.endTime}}</div></el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h3>商品信息</h3>
            <total-table :tHead="tHeadOrder"
                         :tableData="detail.goodsList" title='DS'>
                <!-- -->
                <template #oriPrice="scope">
                    <span>{{(scope.row.oriPrice/100).toFixed(2)}}</span>
                </template>
                <template #realPrice="scope">
                    <span>{{(scope.row.realPrice/100).toFixed(2)}}</span>
                </template>
                <template #freight="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
                <template #payAmount="scope">
                    <span>{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
                <template #totalDisctAmount="scope">
                    <span>{{(scope.row.totalDisctAmount/100).toFixed(2)}}</span>
                </template>
                <template #skuAmount="scope">
                    <span>{{(scope.row.skuAmount/100).toFixed(2)}}</span>
                </template>
                <template #skuRefundStatus="scope">
                    {{skuRefundState[scope.row.skuRefundStatus]}}
                </template>

            </total-table>
        </div>
        <div class="orderinfo">
            <h3>优惠券</h3>
            <system-list  :tHead="tHead"
                          :tableData="detail.couponList">

                <template #price="scope">
                    <span>{{(scope.row.price/100).toFixed(2)}}</span>
                </template>
                <template #sumAmount="scope">
                    <span>{{(scope.row.sumAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{(scope.row.discountAmount/100).toFixed(2)}}</span>
                </template>
                <template #couponStatus="scope">
                    <span>{{couponState[scope.row.couponStatus]}}</span>
                </template>
                <template #usedAmount="scope">
                    <span>{{(scope.row.usedAmount/100).toFixed(2)}}</span>
                </template>
                <template #couponAmount="scope">
                    <span>{{(scope.row.couponAmount/100).toFixed(2)}}</span>
                </template>
                <template #voucherType="scope">
                    <span>{{couponTypes[scope.row.voucherType]}}</span>
                </template>
            </system-list>
        </div>
        <div class="orderinfo">
            <h3>履约信息</h3>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">配送方式：{{detail.contractDto?deliveryMethods[detail.contractDto.deliveryMethod]:''}}</div></el-col>
                <el-col :span="8"><div class="height-p">库房ID：{{detail.contractDto?detail.contractDto.warehouseId:''}}</div></el-col>
                <el-col :span="8"><div class="height-p">配送中心ID：{{detail.contractDto?detail.contractDto.distributionCenterId:''}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">店铺地址：{{detail.contractDto?detail.contractDto.distributionCenterName:''}}</div></el-col>
                <el-col :span="8"><div class="height-p">收货人：{{detail.contractDto?detail.contractDto.recipientName:''}}</div></el-col>
                <el-col :span="8"><div class="height-p">收货人手机号：{{detail.contractDto?detail.contractDto.recipientMobile:''}}</div></el-col>
            </el-row>
            <system-list :tHead="tHeadPerformancer"
                         :tableData="lvyueList" >

                <template #freight="scope">
                    <span>{{(scope.row.freight/100).toFixed(2)}}</span>
                </template>
                <template #transportType="scope">
                    <span v-if="scope.row.transportType===1">常温</span>
                    <span v-if="scope.row.transportType===2">冰鲜</span>
                    <span v-if="scope.row.transportType===3">冷冻</span>
                </template>
                <template #waybillStatus="scope">
                    <span>{{waybillState[scope.row.waybillStatus]}}</span>
                </template>
                <template #operation>
                    <el-button text type="primary" @click="quotationDetailed()">运单轨迹</el-button>
                </template>
            </system-list>
        </div>
        <div class="orderinfo">
            <h3>售后信息</h3>
            <system-list :tHead="tHeadAftermarket"
                         :tableData="detail.saleAfterList" >
                <template #saleType="scope">
                    <span v-if="scope.row.saleType===1">退款</span>
                    <span v-if="scope.row.saleType===2">补货</span>
                </template>
                <template #actRefundAmount="scope">
                    <span>{{(scope.row.actRefundAmount/100).toFixed(2)}}</span>
                </template>
                <template #auditStatus="scope">
                    <span v-if="scope.row.auditStatus===1">申请退单</span>
                    <span v-if="scope.row.auditStatus===2">审核通过</span>
                    <span v-if="scope.row.auditStatus===3">退单被驳回</span>
                </template>
            </system-list>
        </div>
        <div class="btn">
            <el-button type="primary" @click="goback">返回列表</el-button>
            <!-- <el-button type="primary" @click="wordeOrder(detail.orderNoSub)">发起异常工单</el-button> -->
        </div>
        <container-dialog   v-if="dialogVisibleDetail" :visible ='dialogVisibleDetail' @handleClose="dialogVisibleDetail = false" :subOrderNo = "detail.orderNoSub" :channelType="1"  @fevent="fevent">
        </container-dialog>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import SystemList from '@/composables/TablePagination/table.vue'
import containerDialog from '../container/dialog/index'
import { useRouter } from 'vue-router'
import { getMerchantList } from '@/api/operate/index'
import { orderWork } from '@/api/order/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
// 商品列表页传过来的参数
const props = defineProps(['orderNoSub'])

const form = ref({
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userMobile: '', // 用户手机号
    courierNumber: '', // 运单号
    courierCompany: '', // 物流公司
    gmtCreate: '', // 订单创建时间
    payTime: '', // 订单支付时间
    couponCode: '', // 优惠券
    userId: '', // 用户ID
    clientAddr: '' // 配送地址
})
// 订单状态
const statusValue = {
    100: '待付款',
    200: '备餐中',
    300: '待配送',
    400: '待入柜',
    500: '待取货',
    600: '已完成',
    700: '退款成功',
    701: '退款处理中',
    702: '退款失败',
    800: '已取消',
    900: '异常订单'
}
// 支付方式
const payTypes = {
    1: '微信h5支付',
    2: '微信APP支付',
    3: '微信NATIVE支付',
    4: '微信刷脸支付',
    5: '微信公众号支付',
    6: '微信支付分免密支付',
    7: '收付通H5支付',
    8: '收付通免密支付'
}
const couponTypes = {
    1: '优惠券', 2: '运费券'
}
const skuRefundState = {
    1: '未开始', 2: '退款处理中', 3: '部分退款', 4: '已退款'
}
const couponState = {
    1: '已使用', 2: '已退回'
}
const deliveryMethods = {
    1: '厂商直发',
    2: '仓库发货',
    3: '店铺发货'
}
const waybillState = {
    1: '未发货', 3: '在途', 4: '妥投', 5: '签收', 6: '拒签', 8: '揽收', 9: '派件', 10: '疑难', 11: '退回', 12: '退签', 13: '转投', 14: '清关物流那边的状态'
}
// 商品表格信息
const tHeadOrder = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuThirdCid', label: '类目ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'supplierId', label: '供应商ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '促销ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'realPrice', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuAmount', label: '商品金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'oriPrice', label: '商品原价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'freight', label: '运费金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'totalDisctAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '小计金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuRefundStatus', label: '商品状态', minWidth: 100, slot: true }
]
// 履约
const tHeadPerformancer = [
    { align: 'center', type: 'index', label: '包裹', minWidth: 100 },
    { tooltip: true, prop: 'courierNumber', label: '运单号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'waybillStatus', label: '运单状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'courierCompany', label: '承运人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'transportType', label: '运输类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'goodIds', label: '商品ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'goodNames', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'freight', label: '运费金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'userAddress', label: '收货地址', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]
// 优惠券
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'couponCode', label: '券ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'couponName', label: '券名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'voucherType', label: '券类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'couponBatchNumber', label: '券批次号', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'orderdiscountAmount', label: '券批次名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'couponAmount', label: '券面额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'usedAmount', label: '券使用金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'couponStatus', label: '券状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'usedTime', label: '使用时间', minWidth: 100 }
]
// 售后
const tHeadAftermarket = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'refundNo', label: '售后服务单', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'saleType', label: '售后类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'actRefundAmount', label: '金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'workNo', label: '工单ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核结果', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'refApplyTime', label: '发起时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'shipTime', label: '结束时间', minWidth: 100 }
]
const dialogVisibleDetail = ref(false)

// 请求接口数据
const detail = ref({})
const lvyueList = ref([])
const getOrderDetails = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            orderNoSub: props.orderNoSub
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC15806398913310720',
        name: '通过订单编号查询订单详细信息',
        source: '订单中台'
    }
    const res = await getMerchantList(params)
    Object.assign(detail.value, res)
    console.log(detail.value, 'res')
    form.value = res.data
    lvyueList.value = res.contractDto.courierList
}
getOrderDetails()

const quotationDetailed = () => {
    dialogVisibleDetail.value = true
}

const wordeOrder = (orderNoSub) => {
    ElMessageBox.confirm('确定要发起异常工单吗?')
        .then(async () => {
            const param = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                orderNoSub: orderNoSub,
                workType: 1,
                businessType: 3
            }
            const res = await orderWork(param)
            console.log(res, 'res')
        })
}
const goback = () => {
    router.push({ name: 'wholesale-order-list' })
    // router.go(-1)
}
</script>

<style lang="scss" scoped>
.order-information {
    margin-bottom: 30px;
    .information {
        font-weight: 800;
        font-size: 20px;
        margin-bottom: 20px;
    }
    .state {
        margin-left: 30px;
    }
    .is-delivery {
        margin-left: 30px;
        font-weight: 700;
        font-size: 20px;
        color: red;
    }
}
.btn {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
.orderinfo{
    margin-bottom: 20px;
        .height-p{
            line-height:40px;
            // color: #909399;
        }
    }
</style>
