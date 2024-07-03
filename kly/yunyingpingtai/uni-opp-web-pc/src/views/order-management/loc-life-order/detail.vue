<template>
    <div>
        <div class="order-information">
            <span class="information">基本信息</span>
            <span class="is-delivery">{{statusValue[detail.orderStatus]}}</span>
        </div>
        <div class="orderinfo">
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">订单类型：{{orderType[detail.orderType]}}</div></el-col>
                <el-col :span="8"><div class="height-p">订单编号：{{detail.orderNoSub}}</div></el-col>
                <el-col :span="8"><div class="height-p" >订单应付总额： <span style="color:red">{{(detail.payAmount * 0.01).toFixed(2)}}</span></div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">经营属性：{{businessProperty[detail.businessProperty]}}</div></el-col>
                <el-col :span="8"><div class="height-p">商户ID：{{detail.merchantCode}}</div></el-col>
                <el-col :span="8"><div class="height-p">商家名称：{{detail.merchantName}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">用户ID：{{detail.userId}}</div></el-col>
                <el-col :span="8"><div class="height-p">用户手机号：{{detail.userMobile}}</div></el-col>
                <!-- <el-col :span="8"><div class="height-p">代运营商：{{detail.operatorName}}</div></el-col> -->
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">支付单号：{{detail.payNo}}</div></el-col>
                <el-col :span="8"><div class="height-p">支付方式：{{detail.payTypeName}}</div></el-col>
                <el-col :span="8"><div class="height-p">客户端：{{platforms[detail.platform]}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <!-- <el-col :span="8"><div class="height-p">申请开门时间：{{detail.startTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">货柜开门时间：{{detail.openTime}}</div></el-col> -->
                <el-col :span="8"><div class="height-p">订单下单时间：{{detail?.gmtCreate}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">用户付款时间：{{detail.payTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">订单结束时间：{{detail.endTime}}</div></el-col>
            </el-row>
        </div>
        <div class="orderinfo">
            <h3>商品信息</h3>
            <total-table :tHead="tHeadOrder"
                         :tableData="detail.goodsList" title='ORDER1'>
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
                <template #skuAmount="scope">
                    <span>{{(scope.row.skuAmount/100).toFixed(2)}}</span>
                </template>
                <template #totalDisctAmount="scope">
                    <span>{{(scope.row.totalDisctAmount/100).toFixed(2)}}</span>
                </template>
                <template #skuRefundStatus="scope">
                    {{skuRefundState[scope.row.skuRefundStatus]}}
                </template>
                <template #skuRefundAmount="scope">
                    <span>{{(scope.row.skuRefundAmount/100).toFixed(2)}}</span>
                </template>
                <template #skuUrl="scope">
                    <div><img style='width:100px;height:100px' :src="scope.row.skuUrl" /></div>
                </template>
            </total-table>
        </div>
        <div class="orderinfo">
            <h3>业务信息</h3>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">店铺编号:{{detail.shopId}}</div></el-col>
                <el-col :span="8"><div class="height-p">店铺名称:{{detail.shopInfo?.shopName}}</div></el-col>
                <el-col :span="8"><div class="height-p">地区:{{[detail.shopInfo?.shopProvinceName,detail.shopInfo?.shopCityName,detail.shopInfo?.shopCountyName].join('-')}}</div></el-col>
                <el-col :span="8"><div class="height-p">地址详情:{{detail.shopInfo?.shopAddress}}</div></el-col>
            </el-row>
            <system-list  :tHead="tHead"
                          :tableData="detail.voucherList" total="0">
                <template #price="scope">
                    <span>{{(scope.row.price/100).toFixed(2)}}</span>
                </template>
                <template #sumAmount="scope">
                    <span>{{(scope.row.sumAmount/100).toFixed(2)}}</span>
                </template>
                <template #orderdiscountAmount="scope">
                    <span>{{(scope.row.discountAmount/100).toFixed(2)}}</span>
                </template>
                <template #voucherStatus="scope">
                    <span>{{couponState[scope.row.voucherStatus]}}</span>
                </template>
                <template #usedAmount="scope">
                    <span>{{(scope.row.usedAmount/100).toFixed(2)}}</span>
                </template>
                <template #gmtCreate="">
                    <span>{{detail.voucherList.gmtCreate}}</span>
                </template>
                <template #voucherType="scope">
                    <span>{{couponTypes[scope.row.voucherType]}}</span>
                </template>
                <template #orderNoSub="">
                    <span>{{scope.row.voucherList[0].orderNoSub}}</span>
                </template>
            </system-list>
        </div>
        <div class="orderinfo">
            <h3>售后信息</h3>
            <system-list :tHead="tHeadAftermarket"
                         :tableData="detail.saleAfterList" total="0">
                <template #saleType="scope">
                    <span v-if="scope.row.saleType===1">退款</span>
                    <span v-if="scope.row.saleType===2">补货</span>
                </template>
                <template #actRefundAmount="scope">
                    <span>{{(scope.row.actRefundAmount/100).toFixed(2)}}</span>
                </template>
                <template #amount="scope">
                    <span>{{(scope.row.amount/100).toFixed(2)}}</span>
                </template>
                <template #auditStatus="scope">
                    <span v-if="scope.row.auditStatus===1">申请退单</span>
                    <span v-if="scope.row.auditStatus===2">审核通过</span>
                    <span v-if="scope.row.auditStatus===3">退单被驳回</span>
                </template>
                <template #refundStatus="scope">
                    <span>{{refundStatus[scope.row.refundStatus]}}</span>
                </template>
            </system-list>
        </div>
        <div class="btn">
            <el-button type="primary" @click="back">返回列表</el-button>
            <!-- <el-button type="primary" @click="wordeOrder(detail.orderNoSub)">商品识别错误</el-button> -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import TotalTable from '@/composables/TablePagination/totalTable.vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'
// import { getMerchantListCode, getOrderDetail } from '@/api/order.js'
import { getOpenDoorRecode, createExceptionOrderWork } from '@/api/opendoor/index'
// import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 商品列表页传过来的参数
const props = defineProps(['orderNoSub'])
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
const orderType = {
    4601: '本地生活自营',
    4602: '本地生活自我游'
}
// 支付方式
// const payTypes = {
//     1: '微信h5支付',
//     2: '微信APP支付',
//     3: '微信NATIVE支付',
//     4: '微信刷脸支付',
//     5: '微信公众号支付',
//     6: '微信支付分免密支付',
//     7: '收付通H5支付',
//     8: '收付通免密支付'
// }
const businessProperty = {
    1: '自营',
    2: '加盟'
}
// 客户端
const platforms = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    4: '恒生活支付宝小程序（未开通）',
    10: '横掌柜Android ',
    11: '掌柜iOS',
    20: '商家管理后台',
    21: '统一运营平台'
}
const couponTypes = {
    1: '优惠券', 2: '运费券'
}
const skuRefundState = {
    1: '未开始', 2: '退款处理中', 3: '部分退款', 4: '已退款'
}
const couponState = {
    1: '待使用(待核销)', 2: '已使用(已核销)', 3: '已作废(已取消/已退款)'
}
const refundStatus = {
    1: '未开始', 2: '退款进行中', 3: '退款成功', 4: '退款失败', 5: '退款取消'
}
// 商品表格信息
const tHeadOrder = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'skuCode', label: '商品ID', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuUrl', label: '商品图片', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'oriPrice', label: '商品原价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'realPrice', label: '商品单价(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuAmount', label: '商品金额(¥)', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'totalDisctAmount', label: '补贴金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '小计金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuRefundStatus', label: '售后状态', minWidth: 100, slot: true } // ,
    // { align: 'center', tooltip: true, prop: 'skuRefundAmount', label: '退款金额', minWidth: 100, slot: true }
]
// 优惠券
const tHead = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'voucherCode', label: '虚拟凭证ID', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'couponName', label: '凭证名称', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'voucherType', label: '凭证类型', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'usedAmount', label: '抵扣金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'voucherStatus', label: '券状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '发放时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'finishTime', label: '使用时间', minWidth: 100 } // ,
    // { align: 'center', tooltip: true, prop: 'orderNoSub', label: '关联订单', minWidth: 100 }
]
// 售后
const tHeadAftermarket = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'refundNo', label: '服务单编号', maxHeight: 100 },
    { align: 'center', tooltip: true, prop: 'refundStatus', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'actRefundAmount', label: '金额', maxHeight: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuCode', label: '商品ID', maxHeight: 200 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', maxHeight: 200 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', maxHeight: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核结果', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审核人', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'actRefundAmount', label: '金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'refApplyTime', label: '发起时间', maxHeight: 200 }
    // { align: 'center', tooltip: true, prop: 'shipTime', label: '结束时间', maxHeight: 200 }
]
// 请求接口数据
const detail = ref({})
const applyCodes = ref('')
// 详情
const getOrderDetails = async (val) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            orderNoSub: val
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC15806398913310720',
        name: '订单详情',
        source: '订单中台'
    }
    const res = await getMerchantList(params)
    console.log(res, 'res')
    if (res) {
        applyCodes.value = res.deviceDto?.applyCode
        Object.assign(detail.value, res)
        allowanceList.value = []
        // getAllowanceList(res.deviceDto.applyCode)
    }
}
getOrderDetails(props.orderNoSub)
const skuCode = ref([])
const skuName = ref([])
const skuAmount = ref([])
const allowanceList = ref([])
const allowanceLists = ref({})
const goodsList = ref(null)
const orderNoSub = ref(null)
const getAllowanceList = async (val) => {
    const params = {
        configCode: 'MS36877843715870720',
        appKey: 'A1001000',
        busiCode: 'A1001000',
        name: '根据开门记录查询补扣单及补扣订单',
        source: '运营后台',
        body: {
            body: {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                applyCode: val,
                merchantCode: userInfo.value.bisMerchantId,
                merchantId: userInfo.value.bisMerchantId
            },
            configCode: 'UC15806398913310720',
            name: '订单详情',
            source: '订单中台'
        }
    }
    const res = await getOpenDoorRecode(params)
    if (res.code === '200') {
        goodsList.value = res.data.orderDetail?.goodsList
        orderNoSub.value = res.data.orderDetail?.orderNoSub
        if (res.data.orderDetail) { // 遍历数据赋值操作
            goodsList.value.forEach((item, index) => {
                skuCode.value.push(item.skuCode)
            })
            goodsList.value.forEach((item, index) => {
                skuName.value.push(item.skuName)
            })
            goodsList.value.forEach((item, index) => {
                skuAmount.value.push(item.skuAmount)
            })
        }
        Object.assign(allowanceLists.value, res.data.orderDetail, res.data.workOfExceptionOrder)
        allowanceLists.value.skuCode = skuCode.value
        allowanceLists.value.skuName = skuName.value
        allowanceLists.value.skuAmount = skuAmount.value
        allowanceLists.value.orderNoSub = res.data.orderDetail?.orderNoSub
        allowanceLists.value.orderStatus = res.data.orderDetail?.orderStatus
        allowanceLists.value.quantity = res.data.orderDetail?.quantity
        allowanceLists.value.totalAmount = res.data.orderDetail?.totalAmount
        allowanceLists.value.gmtCreate = res.data.orderDetail?.gmtCreate
        allowanceLists.value.workNumber = res.data.workOfExceptionOrder?.workNumber
        allowanceLists.value.workStatus = res.data.workOfExceptionOrder?.workStatus
        allowanceLists.value.dealName = res.data.workOfExceptionOrder?.dealName
        allowanceLists.value.workStartTime = res.data.workOfExceptionOrder?.workStartTime
        allowanceList.value.push(allowanceLists.value)
    }
}
// 发起补扣申请
// const wordeOrder = (orderNoSub) => {
//     ElMessageBox.confirm('确定要发补扣申请吗?')
//         .then(async () => {
//             const param = {
//                 appKey: 'A1001001',
//                 busiCode: 'A1001002',
//                 orderNoSub: orderNoSub,
//                 workType: 2,
//                 businessType: 3,
//                 creatorId: userInfo.value.account,
//                 platform: 20
//             }
//             const res = await setorkerOrder(param)
//             if (res.code === '200') {
//                 ElMessage.success('成功')
//                 allowanceList.value = []
//                 // getAllowanceList(applyCodes.value)
//                 location.reload()
//             }
//         })
// }

// const goOpen = () => {
//     router.push({ name: 'open-record-list-detail', params: { applyCode: detail.value.deviceDto.applyCode } })
// }
const back = () => {
    router.push({ name: 'loc-life-order' })
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
    margin-bottom: 10px;
        .height-p{
            line-height:40px;
            // color: #909399;
        }
    }
</style>
