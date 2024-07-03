<template>
    <div>
        <div class="order-information">
            <span class="information">基本信息</span>
            <span class="is-delivery">{{ statusValue[detail.orderStatus] }}</span>
        </div>
        <div class="orderinfo">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">开门记录ID：{{ detail.applyCode }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">订单编号：{{ detail.orderNoSub }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">经营属性：{{ businessPropertyValue[detail.businessProperty] }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">商户ID：{{ detail.merchantCode }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">商家名称：{{ detail.merchantName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">代运营商：{{ detail.merchantSubName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">订单类型：{{ detail.orderTypeDesc }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">用户ID：{{ detail.userId }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">用户手机号：{{ detail.userMobile }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">客户端：{{ detail.platformName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">支付单号：{{ detail.payNo }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">支付方式：{{ detail.payTypeName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">
                        订单应付总额：<span class="amoColor">{{ (detail.totalAmount / 100).toFixed(2) }}</span>
                    </div>
                </el-col>
                <el-col :span="8">
                    订单实付总额：<span class="amoColor">{{ (detail.payAmount / 100).toFixed(2) }}</span>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">申请开门时间：{{ detail.applyOpenTime }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">货柜开门时间：{{ detail.openTime }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">订单下单时间：{{ detail.gmtCreate }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">用户付款时间：{{ detail.payTime }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">购物结束时间：{{ detail.endTime }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">业务来源：{{ detail.sourceTypeName }}</div>
                </el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h3>商品信息</h3>
            <total-table :tHead="tHeadOrder" :tableData="detail.goodsList ? detail.goodsList : []" title="ORDER">
                <template #oriPrice="scope">
                    <span>{{ (scope.row.oriPrice / 100).toFixed(2) }}</span>
                </template>
                <template #realPrice="scope">
                    <span>{{ (scope.row.realPrice / 100).toFixed(2) }}</span>
                </template>
                <template #freight="scope">
                    <span>{{ (scope.row.freight / 100).toFixed(2) }}</span>
                </template>
                <template #payAmount="scope">
                    <span>{{ (scope.row.payAmount / 100).toFixed(2) }}</span>
                </template>
                <template #skuAmount="scope">
                    <span>{{ (scope.row.skuAmount / 100).toFixed(2) }}</span>
                </template>
                <template #totalDisctAmount="scope">
                    <span>{{ (scope.row.totalDisctAmount / 100).toFixed(2) }}</span>
                </template>
                <template #skuRefundStatus="scope">
                    {{ skuRefundState[scope.row.skuRefundStatus] }}
                </template>
                <template #skuRefundAmount="scope">
                    <span>{{ scope.row.skuRefundAmount ? (scope.row.skuRefundAmount / 100).toFixed(2) : '' }}</span>
                </template>
            </total-table>
        </div>
        <div class="orderinfo">
            <h3>优惠券</h3>
            <system-list :tHead="tHead" :tableData="detail.couponList">
                <template #price="scope">
                    <span>{{ (scope.row.price / 100).toFixed(2) }}</span>
                </template>
                <template #sumAmount="scope">
                    <span>{{ (scope.row.sumAmount / 100).toFixed(2) }}</span>
                </template>
                <template #couponAmount="scope">
                    <span>{{ (scope.row.couponAmount / 100).toFixed(2) }}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{ (scope.row.discountAmount / 100).toFixed(2) }}</span>
                </template>
                <template #couponStatus="scope">
                    <span>{{ couponState[scope.row.couponStatus] }}</span>
                </template>
                <template #usedAmount="scope">
                    <span>{{ (scope.row.usedAmount / 100).toFixed(2) }}</span>
                </template>
                <template #voucherType="scope">
                    <span>{{ voucherType[scope.row.voucherType] }}</span>
                </template>
            </system-list>
        </div>
        <div class="orderinfo">
            <h3>履约信息</h3>
            <el-row :gutter="20">
                <!-- <el-col :span="8"><div class="height-p">开门记录：{{detail.applyCode?detail.applyCode:''}}</div></el-col> -->
                <el-col :span="8">
                    <div class="height-p">点位组ID：{{ detail.poiId ? detail.poiId : '' }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">点位组名称：{{ detail.equipment ? detail.equipment.aisleCode : '' }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">场景类型：{{ detail.deviceDto?.secondScenesName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">点位ID：{{ detail.deviceDto?.poiId }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">货道编码：{{ detail.deviceDto?.aisleCode }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">设备ID：{{ detail.deviceDto?.deviceNo }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备厂商：{{ detail.deviceDto?.deviceBrand }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备型号：{{ detail.deviceDto?.deviceModelName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">设备名称：{{ detail.deviceDto?.deviceName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">合同编码：{{ detail.deviceDto?.contractCode }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p" @click="goOpenDoorRecode(detail.globalNumber)">
                        开门记录ID：<span style="color: #409eff">{{ detail.deviceDto?.applyCode }}</span>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">业务单号：{{ detail.businessOrderNo }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备类型：{{ detail.deviceDto?.deviceKindName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">定位地址：{{ detail.deviceDto?.poiAddress }}</div>
                </el-col>
            </el-row>
            <el-row v-if="detail.deviceDto">
                <el-col :span="12" v-for="item in detail.deviceDto.videoList" :key="item">
                    <div class="videoTip">
                        <video controls :src="item" width="400"></video>
                        <div class="video-text-left" v-if="detail.deviceDto?.doorType">{{ detail.deviceDto?.doorTypeName }}</div>
                        <div class="video-text-right">{{ detail.deviceDto?.applyCode }}</div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h3>售后信息</h3>
            <system-list :tHead="tHeadAftermarket" :tableData="detail.saleAfterList">
                <template #saleType="scope">
                    <span v-if="scope.row.saleType === 1">退款</span>
                    <span v-if="scope.row.saleType === 2">补货</span>
                </template>
                <template #actRefundAmount="scope">
                    <span>{{ (scope.row.actRefundAmount / 100).toFixed(2) }}</span>
                </template>
                <template #auditStatus="scope">
                    <span v-if="scope.row.auditStatus === 1">申请退单</span>
                    <span v-if="scope.row.auditStatus === 2">审核通过</span>
                    <span v-if="scope.row.auditStatus === 3">退单被驳回</span>
                </template>
            </system-list>
        </div>
        <div class="orderinfo">
            <h3>补扣信息</h3>
            <system-list :tHead="tHeadFillbuckle" :tableData="saleAfterList">
                <template #orderNoSub="scope">
                    <div style="color: #409eff" @click="goOpenOrder(scope.row.orderNoSub)">{{ scope.row.orderNoSub }}</div>
                </template>
                <template #orderStatus="scope">
                    {{ statusValue[scope.row.orderStatus] }}
                </template>
                <template #payAmount="scope">
                    <span>{{ scope.row?.payAmount ? (scope.row?.payAmount / 100).toFixed(2) : '' }}</span>
                </template>
                <template #totalAmount="scope">
                    <span>{{ scope.row.totalAmount && scope.row.deductDetail?.handleType === 1 ? (scope.row.totalAmount / 100).toFixed(2) : '' }}</span>
                </template>
                <template #workStatus="scope">
                    <span v-if="scope.row.workStatus === 0">待处理</span>
                    <span v-if="scope.row.workStatus === 1">已完成</span>
                    <span v-if="scope.row.workStatus === 2">已取消</span>
                </template>
            </system-list>
        </div>
        <div class="btn">
            <el-button type="primary" @click="back">返回列表</el-button>
            <el-button v-if="detail.identificationErrorBtn" type="primary" @click="gotoAbnormal(detail.globalNumber)">商品识别错误</el-button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SystemList from '@/composables/TablePagination/table.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'
import TotalTable from './totalTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOpenDoorRecode, createExceptionOrderWork } from '@/api/opendoor/index'
import { tr } from 'element-plus/es/locale'
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 商品列表页传过来的参数
const props = defineProps(['orderID'])
const workOrder = ref(null)
const applyCode = ref(null)
const btnHide = ref(true)
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
    8: '收付通免密支付',
    9: '微信支付',
    10: '微信免密支付',
    11: '直连服务商H5支付'
}
const voucherType = {
    1: '优惠券',
    2: '运费券'
}
const skuRefundState = {
    1: '未退款',
    2: '处理中',
    3: '部分退款',
    4: '全部退款'
}
const couponState = {
    1: '已使用',
    2: '已退回'
}
const deliveryMethods = {
    1: '厂商直发',
    2: '仓库发货'
}
const waybillState = {
    1: '未发货',
    3: '在途',
    4: '妥投',
    5: '签收',
    6: '拒签',
    8: '揽收',
    9: '派件',
    10: '疑难',
    11: '退回',
    12: '退签',
    13: '转投',
    14: '清关物流那边的状态'
}
const businessPropertyValue = {
    1: '自营',
    2: '加盟'
}
const platformValue = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    // 4: '恒生活支付宝小程序（未开通）',
    10: '恒掌柜Android',
    11: '恒掌柜iOS',
    20: '商家管理后台',
    21: '统一运营平台'
}
const dialogVisibleDetail = ref(false)
// 商品表格信息
const tHeadOrder = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'storageStyleName', label: '储藏方式', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'oriPrice', label: '商品原价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'realPrice', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuAmount', label: '商品金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'promoCode', label: '促销ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'totalDisctAmount', label: '补贴金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '小计金额(¥)', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'freight', label: '运费金额(¥)', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'totalDisctAmount', label: '优惠金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuRefundStatus', label: '售后状态', minWidth: 100, slot: true } // ,
    // { align: 'center', tooltip: true, prop: 'skuRefundAmount', label: '退款金额(¥)', minWidth: 100, slot: true }
]
// 优惠券
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'couponCode', label: '券ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'voucherType', label: '券类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'couponName', label: '券名称', minWidth: 100 },
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
    { align: 'center', tooltip: true, prop: 'workNo', label: '工单ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核结果', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'refApplyTime', label: '发起时间', minWidth: 100 },
    { tooltip: true, prop: 'refundNo', label: '退款订单编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'saleType', label: '售后类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'actRefundAmount', label: '金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 100 }
    // { tooltip: true, prop: 'refundNo', label: '退款订单', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'shipTime', label: '结束时间', minWidth: 100 }
]
const tHeadFillbuckle = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '工单ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '工单状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'dealName', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workStartTime', label: '工单发起时间', minWidth: 100 },
    { tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, slot: true },
    { align: true, prop: 'orderStatus', label: '订单状态', minWidth: 200, slot: true },
    // { align: 'center', tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '订单应付金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '订单创建时间', minWidth: 100 }
]

const saleAfterList = ref([])
// 请求接口数据
const detail = ref({
    videoList: []
})
// 跳转异常订单详情
const gotoAbnormal = (orderNo) => {
    console.log(detail.value.globalNumber, detail.value.processStatus)
    router.push({
        name: 'abnormalOrderDetail',
        query: {
            globalNumber: detail.value.globalNumber,
            processStatus: detail.value.processStatus
        }
    })
}
// 跳转开门详情
const goOpenDoorRecode = (no) => {
    router.push({ name: 'opendoorRecordDetail', params: { recordID: no } })
}
const goOpenOrder = (no) => {
    // router.replace({ name: 'salesOrderDetail', params: { orderID: no } })
    getOrderDetails(no)
}
const getFillBuckleDetails = async (applyCode) => {
    if (!applyCode) {
        return
    }
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UCJH36840313302573056',
        name: '根据开门记录查询补扣单及补扣订单',
        source: '运营后台',
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            applyCode: applyCode
        }
    }
    const res = await getOpenDoorRecode(params)
    const goodsList = res.orderDetail?.goodsList
    if (res.workOfExceptionOrder) {
        workOrder.value = true
        btnHide.value = false
    }
    Object.assign(saleAfterList.value, res.workOfExceptionOrder, res.orderDetail)
    console.log(saleAfterList.value, '123123123123123')
    saleAfterList.value = [saleAfterList.value]
    const skuCode = []
    const skuName = []
    let quantity = 0
    goodsList &&
        goodsList.map((item) => {
            item.skuCode && skuCode.push(item.skuCode)
            item.skuName && skuName.push(item.skuName)
            item.quantity && (quantity += item.quantity)
        })
    saleAfterList.value.skuCode = skuCode.join(',')
    saleAfterList.value.skuName = skuName.join(',')
    saleAfterList.value.quantity = quantity
}
const getOrderDetails = async (no) => {
    const params = {
        body: {
            businessCode: 'A1001002',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            // globalNumber: no,
            orderNoSub: props.orderID
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC64315533182128128',
        name: '通过全局编号查询订单详细信息',
        source: '订单中台'
    }
    const res = await getMerchantList(params)
    Object.assign(detail.value, res)
    console.log(detail.value.goodsList, detail.value.saleAfterList, '{{detail.saleAfterList}}{{detail.saleAfterList}}{{detail.saleAfterList}}')
    if (res.equipment) {
        detail.value.videoList = res.equipment.videoUrl.split(',')
    }
    applyCode.value = res.applyCode
    getFillBuckleDetails(applyCode.value)
}
getOrderDetails()
const back = () => {
    // router.go(-1)
    router.push({ name: 'salesOrder' })
}
</script>

<style lang="scss" scoped>
:deep(.el-message-box__btns) {
    button:nth-child(2) {
        &:focus,
        &:hover {
            // background-color: #fe2c55 !important;
            background-color: black !important;
        }
    }
}
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
.orderinfo {
    margin-bottom: 10px;
    .height-p {
        line-height: 40px;
        // color: #909399;
    }
    .amoColor {
        font-weight: 600;
        color: red;
    }
    .videoTip {
        position: relative;
        width: 400px;
        .video-text-left {
            position: absolute;
            top: 0px;
            left: 10px;
            color: #fff;
        }
        .video-text-right {
            position: absolute;
            top: 0px;
            right: 10px;
            color: #fff;
        }
    }
}
</style>
