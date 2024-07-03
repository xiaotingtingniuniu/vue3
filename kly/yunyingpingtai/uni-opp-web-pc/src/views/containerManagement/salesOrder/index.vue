<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="订单编号" prop="orderNoSub">
                <el-input v-model="form.orderNoSub" placeholder="请输入订单编号" />
            </el-form-item>
            <el-form-item label="支付单号" prop="payNo">
                <el-input v-model="form.payNo" placeholder="请输入支付单号" />
            </el-form-item>
            <el-form-item label="用户ID" prop="userId">
                <el-input v-model="form.userId" placeholder="请输入用户ID" />
            </el-form-item>
            <el-form-item label="商户ID" prop="merchantCode">
                <el-input v-model="form.merchantCode" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="经营属性" prop="businessProperty">
                <el-select v-model="form.businessProperty" placeholder="请选择经营属性">
                    <el-option label="全部" value="" />
                    <el-option label="自营" value="1" />
                    <el-option label="加盟" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="开门记录ID" prop="applyCode">
                <el-input v-model="form.applyCode" placeholder="请输入开门记录ID" />
            </el-form-item>
            <el-form-item label="用户手机号" prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="请输入用户手机号" />
            </el-form-item>
            <el-form-item label="代运营商" prop="merchantSubName">
                <el-input v-model="form.merchantSubName" placeholder="请输入代运营商" />
            </el-form-item>
            <!-- <el-form-item label="配送方式" prop="deliveryMethod">
                <el-select v-model="form.deliveryMethod" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="即时" value="10" />
                    <el-option label="自提" value="11" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="form.orderType" placeholder="请选择订单类型">
                    <el-option label="全部" value="" />
                    <el-option label="货柜订单" value="2303" />
                    <el-option label="货柜订单-KA" value="2305" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="点位ID" prop="pointId">
                <el-input v-model="form.pointId" placeholder="请输入点位ID" />
            </el-form-item> -->
            <el-form-item label="业务状态" prop="processStatus">
                <el-select v-model="form.processStatus" placeholder="请选择业务状态">
                    <el-option label="全部" value="" />
                    <el-option label="开门中" value="0" />
                    <el-option label="已开门" value="10" />
                    <el-option label="识别中（已关门）" value="20" />
                    <el-option label="识别中（已上传）" value="30" />
                    <el-option label="异常" value="45" />
                    <el-option label="已生单" value="60" />
                    <el-option label="无购物" value="70" />
                    <el-option label="待付款" value="100" />
                    <el-option label="已完成" value="600" />
                    <el-option label="已退款" value="700" />
                    <el-option label="退款处理中" value="701" />
                    <el-option label="退款失败" value="702" />
                    <el-option label="已取消" value="800" />
                    <el-option label="异常订单" value="900" />
                </el-select>
            </el-form-item>
            <el-form-item label="业务来源" prop="sourceType">
                <el-select v-model="form.sourceType" placeholder="请选择业务来源">
                    <el-option label="全部" value="0" />
                    <el-option label="619" value="3" />
                    <el-option label="易触" value="5" />
                    <el-option label="微米" value="6" />
                    <el-option label="美智" value="7" />
                    <el-option label="恒生活" value="11" />
                </el-select>
            </el-form-item>
            <el-form-item label="异常标签" prop="errorCode">
                <el-select v-model="form.errorCode" placeholder="请选择异常标签">
                    <el-option label="全部" value="" />
                    <el-option v-for="(item, index) in expTagsList" :key="index" :label="item.desc" :value="item.type" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="点位组ID" prop="pointGroupId">
                <el-input v-model="form.pointGroupId" placeholder="请输入点位ID" />
            </el-form-item> -->
            <el-form-item label="客户端" prop="platform">
                <el-select v-model="form.platform" placeholder="请选择客户端">
                    <el-option label="全部" value="" />
                    <el-option label="恒生活Android" value="1" />
                    <el-option label="恒生活iOS" value="2" />
                    <el-option label="恒生活微信小程序" value="3" />
                    <el-option label="恒生活PAD" value="5" />
                    <!-- <el-option label="恒生活支付宝小程序（未开通）" value="4" /> -->
                    <el-option label="恒掌柜Android" value="10" />
                    <el-option label="恒掌柜iOS" value="11" />
                    <el-option label="商家管理后台" value="20" />
                    <el-option label="统一运营平台" value="21" />
                </el-select>
            </el-form-item>
            <el-form-item label="设备ID" prop="deviceNo">
                <el-input v-model="form.deviceNo" placeholder="请输入设备ID" />
            </el-form-item>

            <el-form-item label="设备类型" prop="deviceKindType">
                <el-select v-model="form.deviceKindType" placeholder="请选择设备类型">
                    <el-option label="全部" value="" />
                    <el-option v-for="(item, index) in deviceTypeList" :key="index" :label="item.detailName" :value="item.detailCode" />
                </el-select>
            </el-form-item>
            <el-form-item label="业务单号" prop="businessOrderNo">
                <el-input v-model="form.businessOrderNo" placeholder="请输入业务员单号" />
            </el-form-item>

            <el-form-item label="申请开门时间" prop="startTime">
                <el-col :span="11">
                    <el-date-picker
                        v-model="querinfo.startTime"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="daterangeTime"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="货柜开门时间" prop="openTime">
                <el-col :span="11">
                    <el-date-picker
                        v-model="querinfo.openTime"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="daterangeUTime"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="用户付款时间" prop="payTime">
                <el-col :span="11">
                    <el-date-picker
                        v-model="querinfo.payTime"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="daterangepayTime"
                    />
                </el-col>
            </el-form-item>
            <el-form-item label="购物结束时间" prop="endTime">
                <el-col :span="11">
                    <el-date-picker
                        v-model="querinfo.endTime"
                        type="datetimerange"
                        range-separator="-"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        @change="daterangeendTime"
                    />
                </el-col>
            </el-form-item>
            <!-- <el-form-item label="订单结束时间" prop="endTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.payTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeendTime"/>
                </el-col>
            </el-form-item> -->
            <el-form-item class="button-box">
                <div>
                    <!-- <el-button type="primary">导出列表</el-button> -->
                </div>
                <div>
                    <el-button type="primary" @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="searchCoupon">搜索</el-button>
                    <el-button type="primary" @click="exportExcel">导出</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #platform="scope">
                    {{ platformValue[scope.row.platform] }}
                </template>
                <template #businessProperty="scope">
                    {{ businessPropertyValue[scope.row.businessProperty] }}
                </template>
                <!-- <template #orderStatus="scope">
                    {{statusValue[scope.row.orderStatus]}}
                </template> -->
                <template #payAmount="scope">
                    <span>{{ (scope.row.payAmount / 100).toFixed(2) }}</span>
                </template>
                <template #deliveryMethod="scope">
                    {{ deliveryMethods[scope.row.deliveryMethod] }}
                </template>
                <template #operation="{ row }">
                    <el-button text type="primary" @click="quotationDetailed(row)">查看</el-button>
                </template>
                <template #sourceType="scope">
                    {{ sourceType[scope.row.sourceType] }}
                </template>
                <template #processStatus="scope">
                    {{ processStatus[scope.row.processStatus] }}
                </template>
            </system-list>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { orderList } from '@/api/order/index.js'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { exportDetails } from '@/api/moneyManagement'
import { ElMessage } from 'element-plus'
const router = useRouter()

const deviceTypeList = ref([])
const expTagsList = ref([])
// 支付时间
const querinfo = ref({
    startTime: [],
    payTime: [],
    openTime: [],
    endTime: []
})
// 表单数据
const form = ref({
    querySourceType: 1,
    sourceType: '0', // 业务来源
    errorCode: '', // 异常标签
    processStatus: '', // 业务状态
    businessProperty: '', // 经营属性
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userId: '', // 用户id
    merchantCode: '', // 商户ID
    applyCode: '', // 开门记录ID
    userMobile: '', // 用户手机号
    merchantSubName: '', // 代运营商
    deliveryMethod: '', // 配送方式
    pointId: '', // 位置ID
    pointGroupId: '', // 点位组ID
    platform: '', // 客户端
    deviceNo: '', // 设备ID
    deviceBrand: '', // 设备品牌
    deviceModel: '', // 设备型号
    secondScenesCode: '', // 场景类型
    orderStatus: '', // 订单状态
    poiAddress: '', // 地址信息
    applyOpenTimeBegin: '', // 申请开门时间
    applyOpenTimeEnd: '',
    openTimeBegin: '', // 货柜开门时间
    openTimeEnd: '',
    payTimeBegin: '', // 用户付款时间
    payTimeEnd: '',
    endTimeBegin: '', // 购物结束时间
    endTimeEnd: '',
    orderType: '',
    orderTypeList: [],
    deviceKindType: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// 表格数据
const tHead = [
    { align: 'center', tooltip: true, prop: 'applyCode', label: '开门记录ID', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'orderTypeDesc', label: '订单类型', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'businessProperty', label: '经营属性', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'platform', label: '客户端', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'processStatusName', label: '业务状态', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'sourceType', label: '业务来源', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'errorCodeName', label: '异常标签', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'orderStatus', label: '订单状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'userId', label: '用户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantSubName', label: '代运营商', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'deviceKindName', label: '设备类型', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'businessOrderNo', label: '业务单号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '订单应付金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payNo', label: '支付单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'applyOpenTime', label: '申请开门时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'openTime', label: '货柜开门时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payTime', label: '用户付款时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '购物结束时间', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'endTimeEnd', label: '订单结束时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 80, slot: true, fixed: 'right' }
]

const tableData = ref([])
const platformValue = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    4: '恒生活支付宝小程序（未开通）',
    10: '恒掌柜Android',
    11: '恒掌柜iOS',
    20: '商家管理后台',
    21: '统一运营平台',
    5: '恒生活PAD'
}
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
const deliveryMethods = {
    10: '即时',
    11: '自提'
}
const businessPropertyValue = {
    1: '自营',
    2: '加盟'
}
const sourceType = {
    0: '全部',
    3: '619',
    5: '易触',
    6: '微米',
    7: '美智',
    11: '恒生活'
}
const processStatus = {
    0: '开门中',
    10: '已开门',
    20: '识别中（已关门）',
    30: '识别中 （已上传）',
    45: '异常',
    70: '无购物',
    100: '待付款',
    600: '已完成',
    700: '退款成功',
    701: '退款处理中',
    702: '退款失败',
    800: '已取消',
    900: '异常订单'
}
const errorCode = {
    0: '开门超时',
    1: '开门失败',
    2: '关门超时',
    3: '关门失败',
    4: '上传超时',
    5: '上传失败',
    6: '识别错误',
    7: '识别失败',
    8: '成功：未拿商品',
    9: '失败：无法识别',
    10: '告警：故意遮挡',
    11: '失败：柜中无此SKU',
    12: '告警：其他告警',
    13: '告警：异物拿放',
    14: '告警：疑似设备故障',
    15: '生单失败',
    16: '识别超时',
    17: '识别异常(货柜未维护商品)',
    18: '解析商品异常',
    19: '识别异常(商品金额或数量为0)'
}
const quotationDetailed = (row) => {
    if (row.orderNoSub) {
        // router.push({ name: 'salesOrderDetail', params: { orderID: row.orderNoSub } })
        const routeData = router.resolve({ name: 'salesOrderDetail', params: { orderID: row.orderNoSub } })
        window.open(routeData.href, '_blank')
    } else {
        // router.push({ name: 'opendoorRecordDetail', params: { recordID: row.applyCode } })
        const routeData = router.resolve({ name: 'opendoorRecordDetail', params: { recordID: row.globalNumber } })
        window.open(routeData.href, '_blank')
    }
}
// 初始化开门时间
const initStartTime = () => {
    const re = []
    const date = new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    const nextMonth = month + 1 > 12 ? '01' : month + 1
    month = month > 9 ? month : '0' + month
    re[0] = formatDate(new Date().getTime() - 30 * 86400000) + ' 00:00:00'
    re[1] = formatDate(new Date().getTime()) + ' 23:59:59'
    daterangeTime(re)
}
// 格式化时间
const formatDate = (ms) => {
    const date = new Date(ms)
    const res = []
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month > 9 ? month : '0' + month
    day = day > 9 ? day : '0' + day
    res.push(date.getFullYear())
    res.push(month)
    res.push(day)
    return res.join('-')
}
// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.startTime = val
        form.value.applyOpenTimeBegin = val[0]
        form.value.applyOpenTimeEnd = val[1]
    } else {
        form.value.applyOpenTimeBegin = ''
        form.value.applyOpenTimeEnd = ''
    }
}
const daterangepayTime = (val) => {
    if (val) {
        querinfo.value.payTime = val
        form.value.payTimeBegin = val[0]
        form.value.payTimeEnd = val[1]
    } else {
        form.value.payTimeBegin = ''
        form.value.payTimeEnd = ''
    }
}
const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.openTime = val
        form.value.openTimeBegin = val[0]
        form.value.openTimeEnd = val[1]
    } else {
        form.value.openTimeBegin = ''
        form.value.openTimeEnd = ''
    }
}
const daterangeendTime = (val) => {
    if (val) {
        querinfo.value.endTime = val
        form.value.endTimeBegin = val[0]
        form.value.endTimeEnd = val[1]
    } else {
        form.value.endTimeBegin = ''
        form.value.endTimeEnd = ''
    }
}
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    querinfo.value.startTime = []
    querinfo.value.payTime = []
    querinfo.value.openTime = []
    querinfo.value.endTime = []
    resetFormData.value.resetFields()
    form.value.orderNoSub = '' // 订单编号
    form.value.payNo = '' // 支付单号
    form.value.userId = '' // 用户id
    form.value.merchantCode = '' // 商户ID
    form.value.businessProperty = '' // 经营属性
    form.value.applyCode = '' // 开门记录ID
    form.value.userMobile = '' // 用户手机号
    form.value.merchantSubName = '' // 代运营商
    form.value.deliveryMethod = '' // 配送方式
    form.value.pointId = '' // 位置ID
    form.value.pointGroupId = '' // 点位组ID
    form.value.platform = '' // 客户端
    form.value.deviceNo = '' // 设备ID
    form.value.deviceBrand = '' // 设备品牌
    form.value.deviceModel = '' // 设备型号
    form.value.secondScenesCode = '' // 场景类型
    form.value.orderStatus = '' // 订单状态
    form.value.poiAddress = '' // 地址信息
    form.value.applyOpenTimeBegin = '' // 订单创建时间
    form.value.applyOpenTimeEnd = ''
    form.value.payTimeBegin = '' // 订单支付时间
    form.value.payTimeEnd = ''
    form.value.endTimeBegin = '' // 订单结束
    form.value.endTimeEnd = ''
    applyClassifyRef.value.panel.checkedNodes = []
    scenesNameRef.value.panel.checkedNodes = []
}

// 搜索按钮
const searchCoupon = () => {
    pageinfo.page = 1
    getOrderList()
}

// 设备类型
const getDeviceTypeList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC53078243183775744',
        name: '枚举值查询',
        source: '运营后台',
        body: {
            dictType: 'deviceKind'
        }
    }
    const res = await getMerchantListCode(params)
    if (res) {
        deviceTypeList.value = res.data
    }
}
getDeviceTypeList()

// 获取异常标签
const getExpTags = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC21288969064587264',
        name: '获取异常标签接口',
        source: '工单中台',
        body: {
            searchType: 1
        }
    }
    const res = await getMerchantListCode(params)
    if (res) {
        console.log('123123', res.data)
        // deviceTypeList.value = res.data
        expTagsList.value = res.data
    }
}

getExpTags()

// 接口请求数据
const getOrderList = async () => {
    form.value.orderTypeList = form.value.orderType ? [form.value.orderType] : []
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize
        },
        appKey: 'A100100',
        busiCode: 'A1001002',
        configCode: 'UC64314860633870336',
        name: '货柜订单列表',
        source: '订单中台'
    }
    const res = await getMerchantListCode(params)
    if (res) {
        tableData.value = res.data.list
        pageinfo.total = res.data.totalCount
    } else {
        tableData.value = []
        pageinfo.total = 0
    }
}

const courierCompanyList = ref([])
const getcourierCompanyList = async () => {
    const param = {
        body: {
            busiCode: 'A1001001',
            appKey: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC1659076890688IjTN2',
        name: '查询快递公司列表',
        source: '运单中台'
    }
    const data = await getMerchantList(param)
    courierCompanyList.value = data.expressList
    courierCompanyList.value.unshift({ expressName: '全部', expressCode: '' })
    console.log(data)
}
// const getEquipmentList = async () => {
//     const res = await getMerchantList({
//         appKey: 'A1001001',
//         busiCode: 'A1001001',
//         configCode: 'UC19001411414650880',
//         name: '获取所有的设备型号编号及名称',
//         source: '设备中台'
//     })
//     equipmentList.value = res
//     equipmentList.value.unshift({ modelName: '全部', modelCode: '' })
// }

const getEquipmentList = async (level) => {
    const parm = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            dictType: 'device.model.name',
            parentId: level
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC19859938486165504',
        name: '字典数据列表',
        url: '/device/dict/list/v2',
        source: '设备中台'
    }
    const res = await getMerchantListCode(parm)
    if (res.code === '200') {
        return res.data
    }
}
const getSceneList = async (pid) => {
    const parm = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            dictType: 'device.install.location',
            parentId: pid
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC19859938486165504',
        name: '字典数据列表',
        url: '/device/dict/list/v2',
        source: '设备中台'
    }
    const res = await getMerchantListCode(parm)
    if (res.code === '200') {
        return res.data
    }
}

// 设备型号
const applyClassifyRef = ref(null)
const equipmentList = {
    lazy: true,
    lazyLoad(node, resolve) {
        const { level, data } = node
        setTimeout(async () => {
            const res = await getEquipmentList(data.pid || 0)
            const nodes = res.map((item) => {
                return {
                    label: item.label,
                    value: item.value,
                    pid: item.id,
                    leaf: level >= 2
                }
            })
            resolve(nodes)
        }, 1000)
    }
}

const eviceCheckedNodes = ref([])
const deviceChange = (value) => {
    eviceCheckedNodes.value = applyClassifyRef.value.getCheckedNodes(true)
    eviceCheckedNodes.value.forEach((item) => {
        form.value.deviceModel = item.pathLabels[2]
    })
}

// 场景类型
const scenesNameRef = ref(null)
const sceneList = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await getSceneList(data.pid || 0)
        const nodes = res.map((item) => {
            return {
                label: item.label,
                pid: item.id,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
// 生成年月日时间 导出文件名使用
const generateDate = () => {
    const date = new Date()
    const res = []
    res.push(date.getFullYear())
    res.push(date.getMonth() + 1)
    res.push(date.getDate())
    return res.join('-')
}
const sceneCheckedNodes = ref([])
const secnceChange = (value) => {
    sceneCheckedNodes.value = scenesNameRef.value.getCheckedNodes(true)
    sceneCheckedNodes.value.forEach((item) => {
        form.value.secondScenesCode = item.pathLabels[1]
    })
}
onMounted(async () => {
    // await getOrderList()
    await getcourierCompanyList()
    await getEquipmentList()
    await getSceneList()
    initStartTime()
})

const exportExcel = async () => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNo: pageinfo.page,
            pageSize: pageinfo.pageSize,
            querySourceType: 1
        },
        exportType: 7,
        exportName: '统一运营平台-销售订单-' + generateDate(),
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH64356626728767488',
        name: '货柜订单导出-聚合spu',
        source: '运营后台'
    }
    const res = await exportDetails(params)
    if (res.data.type === 'application/json') {
        const reader = new FileReader() // 创建一个FileReader实例
        reader.readAsText(res.data, 'utf-8') // 读取文件,结果用字符串形式表示
        reader.onload = function () {
            // 读取完成后,**获取reader.result**
            const { message } = JSON.parse(reader.result)
            console.log('reader--', reader, 'msg==', message)
            ElMessage.error(message) // 弹出错误提示
        }
    } else {
        const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' }) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
        let fileName = decodeURI(res.headers['content-disposition']) // 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
        // console.log(fileName)
        if (fileName) {
            // 根据后端返回的数据处理文件名称
            fileName = fileName.substring(fileName.indexOf('=') + 1)
        }
        const link = document.createElement('a') // 创建一个a标签
        link.download = fileName // 设置a标签的下载属性
        link.style.display = 'none' // 将a标签设置为隐藏
        link.href = URL.createObjectURL(blob) // 把之前处理好的地址赋给a标签的href
        document.body.appendChild(link) // 将a标签添加到body中
        link.click() // 执行a标签的点击方法
        URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
        document.body.removeChild(link) // 移除a标签
    }
}
// 当前页数改变
const currentChange = (val) => {
    pageinfo.page = val
    getOrderList()
}
const sizeChange = (val) => {
    pageinfo.page = 1
    pageinfo.pageSize = val
    getOrderList()
}
</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
