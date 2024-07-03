<template>
    <div>
        <div class="order-information">
            <span class="information">基本信息</span>
            <span class="is-delivery">{{ detail.processStatusName }}</span>
            <span class="is-delivery">{{ detail.errorCodeName }}</span>
        </div>
        <div class="orderinfo">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">开门记录ID：{{ detail.applyCode }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">用户ID：{{ detail.userId }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">经营属性：{{ businessPropertyValue[detail.businessProperty] }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">业务来源：{{ detail.sourceTypeName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">商户ID：{{ detail.merchantCode }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">商户名称：{{ detail.merchantName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">代运营商：{{ detail.merchantSubName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">订单编号：{{ detail.orderNoSub }}</div>
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
                    <div class="height-p">申请开门时间：{{ detail.applyOpenTime }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">货柜开门时间：{{ detail.openTime }}</div>
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
            <!-- <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">设备名称：{{detail.openDoorInfo?.deviceName}}</div></el-col>
                <el-col :span="8"><div class="height-p">设备编号：{{detail.openDoorInfo?.deviceId}}</div></el-col>
                <el-col :span="8"><div class="height-p">设备型号：{{detail.openDoorInfo?.deviceModel}}</div></el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8"><div class="height-p">创建时间：{{detail.openDoorInfo?.startTime}}</div></el-col>
                <el-col :span="8"><div class="height-p">结束时间：{{detail.openDoorInfo?.endTime}}</div></el-col>
            </el-row> -->
        </div>
        <div class="order-information">
            <span class="information">设备信息</span>
        </div>
        <div class="orderinfo">
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">设备编号：{{ detail.deviceDto?.deviceNo }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备名称：{{ detail.deviceDto?.deviceName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">
                        地区：{{
                            detail.deviceDto?.provinceName
                                ? detail.deviceDto.provinceName + '-' + detail.deviceDto.cityName + (detail.deviceDto.countyName ? '-' + detail.deviceDto.countyName : '')
                                : ''
                        }}
                    </div>
                </el-col>
                <!-- <el-col :span="8"><div class="height-p">货道编码：{{detail.deviceDto?.deviceModel}}</div></el-col> -->
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">点位ID：{{ detail.deviceDto?.poiId }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">点位组ID：{{ detail.deviceDto?.pointGroupId }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">点位组名称：{{ detail.deviceDto?.pointGroupName }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">设备厂商：{{ detail.deviceDto?.deviceBrand }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备型号：{{ detail.deviceDto?.deviceModelName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">合同编码：{{ detail.deviceDto?.contractCode }}</div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="8">
                    <div class="height-p">场景类型：{{ detail.deviceDto?.secondScenesName }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备地址：{{ detail.deviceDto?.poiAddress }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">业务单号：{{ detail.businessOrderNo }}</div>
                </el-col>
                <el-col :span="8">
                    <div class="height-p">设备类型：{{ detail.deviceDto?.deviceKindName }}</div>
                </el-col>
            </el-row>
        </div>
        <div class="orderinfo">
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
            <h3>商品信息</h3>
            <total-table :tHead="tHeadOrder" :tableData="detail.goodsList" title="OPENDOOR">
                <template #skuCode="scope">
                    <span>{{ scope.row.skuCode }}</span>
                </template>
                <!-- <template #skuCod="scope">
                    <span>{{scope.row.skuCode}}</span>
                </template> -->
                <template #skuName="scope">
                    <span>{{ scope.row.skuName }}</span>
                </template>
                <template #quantity="scope">
                    <span>{{ scope.row.quantity }}</span>
                </template>
                <template #skuUrl="scope">
                    <div><img :src="scope.row.skuUrl" style="height: 100px; width: 100px" /></div>
                </template>
            </total-table>
        </div>
        <div class="orderinfo">
            <h3>补扣信息</h3>
            <system-list :tHead="tHeadFillbuckle" :tableData="saleAfterList">
                <template #orderNoSub="scope">
                    <div style="color: #409eff" @click="toOrderDetail(scope.row.orderNoSub)">{{ scope.row.orderNoSub }}</div>
                </template>
                <template #orderStatus="scope">
                    {{ statusValue[scope.row.orderStatus] }}
                </template>
                <template #skuCode="scope">
                    <span>{{ scope.row.goodsList ? scope.row.goodsList[0].skuCode : '' }}</span>
                </template>
                <template #skuName="scope">
                    <span>{{ scope.row.goodsList ? scope.row.goodsList[0].skuName : '' }}</span>
                </template>
                <template #quantity="scope">
                    <span>{{ scope.row.goodsList ? scope.row.goodsList[0].quantity : '' }}</span>
                </template>
                <template #payAmount="scope">
                    <span>{{ (scope.row?.payAmount / 100).toFixed(2) }}</span>
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
            <!--无购物-->
            <el-button type="primary" @click="noShop" v-if="detail.noShoppingBtn">无购物</el-button>
            <!--手动下单-->
            <el-button type="primary" @click="handOrder" v-if="detail.manualOrderBtn">手动下单</el-button>
            <!--商品识别错误-->
            <el-button type="primary" @click="handOrder" v-if="detail.identificationErrorBtn">商品识别错误</el-button>
            <!-- <el-button type="primary" @click="toOrderDetail(detail.openDoorInfo?.orderNoSub)">查看销售订单</el-button> -->
            <!-- <el-button v-if="detail.orderStatus === 45" type="primary" @click="emptyOrder(detail.orderNoSub)">无购物</el-button>
            <el-button v-if="detail.orderStatus === 45" type="primary" @click="gotoAbnormal(detail.globalNumber)">手动下单</el-button> -->
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import SystemList from '@/composables/TablePagination/table.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'
// import { orderWork } from '@/api/order/index'
import TotalTable from '../../../composables/TablePagination/totalTable.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getOpenDoorRecode, createExceptionOrderWork } from '@/api/opendoor/index'

const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 商品列表页传过来的参数
const props = defineProps(['recordID'])
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
    8: '收付通免密支付'
}
const couponTypes = {
    1: '优惠券',
    2: '运费券'
}
const skuRefundState = {
    1: '未开始',
    2: '退款处理中',
    3: '部分退款',
    4: '已退款'
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
const dialogVisibleDetail = ref(false)
// 商品表格信息
const tHeadOrder = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { tooltip: true, prop: 'skuCode', label: '商品编码', minWidth: 200, slot: true },
    // { align: 'center', tooltip: true, prop: 'skuCode', label: '商品SKU', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '商品数量', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuUrl', label: '商品图片', minWidth: 100, slot: true }
]
const tHeadFillbuckle = [
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '工单ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '审核结果', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'dealName', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'workStartTime', label: '工单发起时间', minWidth: 100 },
    { tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, slot: true },
    { align: true, prop: 'orderStatus', label: '订单状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '订单应付金额(¥)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '订单创建时间', minWidth: 100 }
]
// 请求接口数据
const detail = ref({
    videoList: []
})
const saleAfterList = ref([])
const toOrderDetail = (orderNoSub) => {
    router.push({ name: 'salesOrderDetail', params: { orderID: orderNoSub } })
}
const goOpenOrder = (orderNo) => {
    router.push({ name: 'makeup-order-detail', params: { orderNo, iscon: 0 } })
}
const getFillBuckleDetails = async (applyCode) => {
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
    console.log(saleAfterList.value, 'detail.value.saleAfterList.valuedetail.value.saleAfterList.valuedetail.value.saleAfterList.valuedetail.value.saleAfterList.value')
}
const getOrderDetails = async () => {
    const params = {
        body: {
            businessCode: 'A1001002',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            globalNumber: props.recordID
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC64315533182128128',
        name: '通过全局编号查询订单详细信息',
        source: '订单中台'
    }
    const res = await getOpenDoorRecode(params)
    Object.assign(detail.value, res)
    applyCode.value = res.applyCode
    getFillBuckleDetails(applyCode.value)
    // if (res.videoUrl) {
    //     detail.value.videoList = res.videoUrl.split(',')
    // }
}
getOrderDetails()
// getFillBuckleDetails()
// 跳转异常订单详情
const gotoAbnormal = (orderNo) => {
    router.push({ name: 'abnormalOrderDetail', params: { orderNo } })
}
const emptyOrder = (orderNoSub) => {
    ElMessageBox.confirm({
        title: '完成异常处理',
        message: '是否确认处理结果？'
    }).then(async () => {
        const params = {
            body: {
                businessCode: 'A1001002',
                appKey: 'A1001001',
                busiCode: 'A1001001',
                globalNumber: props.recordID
            },
            appKey: 'A1001001',
            busiCode: 'A1001001',
            configCode: 'UC65439006187061248',
            name: '异常工单免审接口',
            source: '工单中台'
        }
        const res = await createExceptionOrderWork(params)
        // if (res.code === '200') {
        ElMessage.success('成功')
        // getFillBuckleDetails(applyCode.value)
        location.reload()
        // }
    })
}
const wordeOrder = (orderNoSub) => {
    ElMessageBox.confirm('是否发起审核?').then(async () => {
        const params = {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            workType: 2,
            businessType: 3,
            source: '工单中台',
            configCode: 'UC20593716296851456',
            name: '异常/正常订单创建工单接口',
            body: {
                appKey: 'A1001001',
                // busiCode: 'A1001002',
                applyCode: detail.value.openDoorInfo?.applyCode,
                userId: detail.value.openDoorInfo?.userId,
                userMobile: detail.value.openDoorInfo?.userMobile,
                sourceType: 11,
                businessType: 3,
                originType: 1,
                workType: 2,
                operateModel: detail.value.openDoorInfo?.businessProperty,
                exceptionLabel: detail.value.openDoorInfo?.errorCode,
                deviceNo: detail.value.openDoorInfo?.deviceId,
                videoUrl: detail.value.videoUrl,
                goodsList: detail.value.goodsList,
                creatorId: 'dev',
                applyOpenTime: detail.value.openDoorInfo?.startTime,
                deviceOpenTime: detail.value.openDoorInfo?.openTime,
                platform: 21 // detail.value.openDoorInfo?.platform,
                // platformVersion: detail.value.openDoorInfo?.platformVersion
            }
        }
        const res = await getOpenDoorRecode(params)
        // if (res.code === '200') {
        ElMessage.success('成功')
        location.reload()
        // getFillBuckleDetails(applyCode.value)
        // }
    })
}
const looktrack = async (row) => {}
const back = () => {
    // router.go(-1)
    router.push({ name: 'salesOrder' })
}

const noShop = async () => {
    ElMessageBox.confirm('是否确认处理结果？', '完成异常处理', {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
    }).then(async () => {
        const params = {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            source: '工单中台',
            configCode: 'UC21288684099379200',
            name: '创建补扣单及完成工单接口',
            body: {
                appKey: 'A1001001',
                busiCode: 'A1001002',
                createDeductFlag: 0,
                videoVisibleFlag: 1,
                dealId: userInfo.value.id,
                dealName: userInfo.value.name,
                workNumber: detail.value.workNumber
            }
        }
        const res = await getOpenDoorRecode(params)
        ElMessage.success('成功')
    })
}

const handOrder = () => {
    router.push({
        name: 'abnormalOrderDetail',
        query: {
            globalNumber: detail.value.globalNumber,
            processStatus: detail.value.processStatus
        }
    })
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
.orderinfo {
    margin-bottom: 10px;
    .height-p {
        line-height: 40px;
        // color: #909399;
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
