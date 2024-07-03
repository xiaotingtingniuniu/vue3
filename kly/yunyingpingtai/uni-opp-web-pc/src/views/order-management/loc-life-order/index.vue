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
            <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="form.orderType" placeholder="请选择订单类型">
                    <el-option label="全部" :value="0" />
                    <el-option label="本地生活自营" :value="4601" />
                    <el-option label="本地生活自我游" :value="4602" />
                </el-select>
            </el-form-item>
            <el-form-item label="经营属性" prop="businessProperty">
                <el-select v-model="form.businessProperty" placeholder="请选择经营属性">
                    <el-option label="全部" value="" />
                    <el-option label="自营" value="1" />
                    <el-option label="加盟" value="2" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="开门记录ID" prop="applyCode">
                <el-input v-model="form.applyCode" placeholder="请输入开门记录ID" />
            </el-form-item> -->
            <el-form-item label="用户手机号" prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="请输入用户手机号" />
            </el-form-item>
            <el-form-item label="店铺名称" prop="shopName">
                <el-input v-model="form.shopName" placeholder="请输入店铺名称" />
            </el-form-item>
            <el-form-item label="地区" prop="applyCode">
                <el-cascader ref="authorityRef" :props="selCitysProp" @change="selCitysChange" v-model="form.secCountyList" width="100%" :collapse-tags="true" clearable filterable />
            </el-form-item>
            <!-- <el-form-item label="用户手机号" prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="请输入用户手机号" />
            </el-form-item> -->
            <!-- <el-form-item label="代运营商" prop="operatorName">
                <el-input v-model="form.operatorName" placeholder="请输入代运营商" />
            </el-form-item> -->
            <!-- <el-form-item label="配送方式" prop="deliveryMethod">
                <el-select v-model="form.deliveryMethod" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="即时" value="10" />
                    <el-option label="自提" value="11" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="状态" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                    <el-option label="全部" value="" />
                    <el-option label="待付款" value="100" />
                    <el-option label="待使用" value="301" />
                    <el-option label="已完成" value="600" />
                    <el-option label="已退款" value="700" />
                    <el-option label="已取消\已关闭" value="800" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="点位ID" prop="pointId">
                <el-input v-model="form.pointId" placeholder="请输入点位ID" />
            </el-form-item> -->
            <!-- <el-form-item label="业务状态" prop="processStatus">
                <el-select v-model="form.processStatus" placeholder="请选择业务状态">
                    <el-option label="全部" value="" />
                    <el-option label="开门中" value="0" />
                    <el-option label="已开门" value="10" />
                    <el-option label="识别中" value="30" />
                    <el-option label="已识别" value="40" />
                    <el-option label="异常" value="45" />
                    <el-option label="无购物" value="70" />
                    <el-option label="待付款" value="100" />
                    <el-option label="已完成" value="600" />
                    <el-option label="已取消" value="800" />
                    <el-option label="已退款" value="700" />
                    <el-option label="退款处理中" value="701" />
                    <el-option label="退款失败" value="702" />
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="异常标签" prop="errorCode">
                <el-select v-model="form.errorCode" placeholder="请选择异常标签">
                    <el-option label="无" value="" />
                    <el-option label="开门超时" value="0" />
                    <el-option label="开门失败" value="1" />
                    <el-option label="关门超时" value="2" />
                    <el-option label="关门失败" value="3" />
                    <el-option label="上传超时" value="4" />
                    <el-option label="上传失败" value="5" />
                    <el-option label="识别错误" value="6" />
                    <el-option label="识别失败" value="7" />
                    <el-option label="未拿商品" value="8" />
                    <el-option label="⽆法识别" value="9" />
                    <el-option label="故意遮挡" value="10" />
                    <el-option label="柜中无此SKU" value="11" />
                    <el-option label="其他告警" value="12" />
                    <el-option label="异物拿放" value="13" />
                    <el-option label="疑似设备故障" value="14" />
                    <el-option label="生单失败" value="15" />
                    <el-option label="识别超时" value="16" />
                    <el-option label="识别异常(货柜未维护商品)" value="17" />
                    <el-option label="解析商品异常" value="18" />
                    <el-option label="识别异常(商品金额或数量为0)" value="19" />
                </el-select>
            </el-form-item> -->
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
            <!-- <el-form-item label="设备ID" prop="deviceId">
                <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
            </el-form-item> -->
            <!-- <el-form-item label="设备厂商" prop="deviceBrand">
                <el-input v-model="form.deviceBrand" placeholder="请输入设备ID" />
            </el-form-item> -->
            <!-- <el-form-item label="设备品牌" prop="deviceBrand">
                <el-select v-model="form.deviceBrand" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="仓库发货" value="1" />
                    <el-option label="厂商直送" value="2" />
                </el-select>
            </el-form-item> -->
            <!-- <el-form-item label="设备型号" prop="deviceModel">
                <el-cascader
                    ref="applyClassifyRef"
                    :props="equipmentList"
                    @change="deviceChange"
                    clearable
                />
            </el-form-item> -->
            <!-- <el-form-item label="场景类型" prop="secondScenesCode">
                <el-cascader
                    ref="scenesNameRef"
                    :props="sceneList"
                    @change="secnceChange"
                    clearable
                />
            </el-form-item> -->
            <!-- <el-form-item label="地址信息" prop="poiAddress">
                <el-input v-model="form.poiAddress" placeholder="请输入配送地址" />
            </el-form-item> -->
            <el-form-item label="订单下单时间" prop="startTime">
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
            <!-- <el-form-item label="货柜开门时间" prop="openTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.openTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeUTime"/>
                </el-col>
            </el-form-item> -->
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
            <el-form-item label="订单结束时间" prop="endTime">
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
                <template #orderStatus="scope">
                    {{ orderStatus[scope.row.orderStatus] }}
                </template>
                <template #payAmount="scope">
                    <span>{{ (scope.row.payAmount / 100).toFixed(2) }}</span>
                </template>
                <template #deliveryMethod="scope">
                    {{ deliveryMethods[scope.row.deliveryMethod] }}
                </template>
                <template #orderType="scope">
                    {{ orderType[scope.row.orderType] }}
                </template>
                <template #operation="{ row }">
                    <el-button text type="primary" @click="quotationDetailed(row)">查看</el-button>
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
import { cityQueryCategory } from '@/utils'
const router = useRouter()

// 支付时间
const querinfo = ref({
    startTime: [],
    payTime: [],
    openTime: [],
    endTime: []
})
// 表单数据
const form = ref({
    errorCode: '', // 异常标签
    processStatus: '', // 业务状态
    businessProperty: '', // 经营属性
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userId: '', // 用户id
    merchantCode: '', // 商户ID
    applyCode: '', // 开门记录ID
    userMobile: '', // 用户手机号
    operatorName: '', // 代运营商
    deliveryMethod: '', // 配送方式
    pointId: '', // 位置ID
    pointGroupId: '', // 点位组ID
    platform: '', // 客户端
    deviceId: '', // 设备ID
    deviceBrand: '', // 设备品牌
    deviceModel: '', // 设备型号
    secondScenesCode: '', // 场景类型
    orderStatus: '', // 订单状态
    poiAddress: '', // 地址信息
    gmtCreateBegin: '', // 申请开门时间
    gmtCreateEnd: '',
    openTimeFrom: '', // 货柜开门时间
    openTimeTo: '',
    payTimeBegin: '', // 用户付款时间
    payTimeEnd: '',
    endTimeBegin: '', // 购物结束时间
    endTimeEnd: '',
    limitedCitys: [],
    shopName: '',
    shopCountyCodeList: [],
    orderType: 0,
    sourceType: 12,
    shopId: '',
    secCountyList: []
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// 表格数据
const tHead = [
    // { align: 'center', tooltip: true, prop: 'applyCode', label: '开门记录ID', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'platform', label: '客户端', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'orderStatus', label: '状态', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'userId', label: '用户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'shopCountyName', label: '地区', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'shopName', label: '店铺名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '订单应付总额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payNo', label: '支付单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '订单下单时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payTime', label: '用户付款时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '订单结束时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'businessProperty', label: '经营属性', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'orderType', label: '订单类型', minWidth: 130, slot: true },
    // { align: 'center', tooltip: true, prop: 'processName', label: '业务状态', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'errorName', label: '异常标签', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'orderStatus', label: '订单状态', minWidth: 200, slot: true },
    // { align: 'center', tooltip: true, prop: 'operatorName', label: '代运营商', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'deviceId', label: '设备ID', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'deliveryMethod', label: '配送方式', minWidth: 130, slot: true },
    // { align: 'center', tooltip: true, prop: 'pointId', label: '点位ID', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'deviceId', label: '点位组ID', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'deviceBrand', label: '设备厂商', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'deviceModel', label: '设备型号', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'secondScenesCode', label: '场景类型', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'openTime', label: '货柜开门时间', minWidth: 100 },
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
const orderStatus = {
    100: '待付款',
    301: '待使用',
    600: '已完成',
    700: '已退款',
    800: '已取消/已关闭'
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
const orderType = {
    4601: '本地生活自营',
    4602: '本地生活自我游'
}
const quotationDetailed = (row) => {
    // if (row.orderNoSub) {
    // router.push({ name: 'salesOrderDetail', params: { orderID: row.orderNoSub } })
    const routeData = router.resolve({ name: 'loc-life-order-detail', params: { orderNoSub: row.orderNoSub } })
    window.open(routeData.href, '_blank')
    // } else {
    //     // router.push({ name: 'opendoorRecordDetail', params: { recordID: row.applyCode } })
    //     const routeData = router.resolve({ name: 'opendoorRecordDetail', params: { recordID: row.applyCode } })
    //     window.open(routeData.href, '_blank')
    // }
}

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.startTime = val
        form.value.gmtCreateBegin = val[0]
        form.value.gmtCreateEnd = val[1]
    } else {
        form.value.gmtCreateBegin = ''
        form.value.gmtCreateEnd = ''
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
        form.value.openTimeFrom = val[0]
        form.value.openTimeTo = val[1]
    } else {
        form.value.openTimeFrom = ''
        form.value.openTimeTo = ''
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
// 选择城市联动
const selCitysProp = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || 0)
        const nodes = res?.map((item) => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
const authorityRef = ref(null)
// 选择城市change
const selCitysChange = (value) => {
    const areaCheckedNodes = authorityRef.value.getCheckedNodes(true)
    form.value.limitedRegionList = []
    form.value.shopCountyCodeList = []
    areaCheckedNodes.forEach((item) => {
        form.value.secCountyList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]
        })
        form.value.shopCountyCodeList.push(item.pathValues[0])
        form.value.shopCountyCodeList.push(item.pathValues[1])
        form.value.shopCountyCodeList.push(item.pathValues[2])
    })
}
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    querinfo.value.startTime = []
    querinfo.value.payTime = []
    querinfo.value.openTime = []
    querinfo.value.endTime = []
    resetFormData.value.resetFields()
    form.value.shopCountyCodeList = []
    form.value.secCountyList = []
    form.value.orderNoSub = '' // 订单编号
    form.value.payNo = '' // 支付单号
    form.value.userId = '' // 用户id
    form.value.merchantCode = '' // 商户ID
    form.value.businessProperty = '' // 经营属性
    form.value.applyCode = '' // 开门记录ID
    form.value.userMobile = '' // 用户手机号
    form.value.operatorName = '' // 代运营商
    form.value.deliveryMethod = '' // 配送方式
    form.value.pointId = '' // 位置ID
    form.value.pointGroupId = '' // 点位组ID
    form.value.platform = '' // 客户端
    form.value.deviceId = '' // 设备ID
    form.value.deviceBrand = '' // 设备品牌
    form.value.deviceModel = '' // 设备型号
    form.value.secondScenesCode = '' // 场景类型
    form.value.orderStatus = '' // 订单状态
    form.value.poiAddress = '' // 地址信息
    form.value.gmtCreateBegin = '' // 订单创建时间
    form.value.gmtCreateEnd = ''
    form.value.payTimeBegin = '' // 订单支付时间
    form.value.payTimeEnd = ''
    form.value.endTimeBegin = '' // 订单结束
    form.value.endTimeEnd = ''
    applyClassifyRef.value = []
    scenesNameRef.value = []
}

// 搜索按钮
const searchCoupon = () => {
    pageinfo.page = 1
    getOrderList()
}

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize
        },
        appKey: 'A100100',
        busiCode: 'A1001000',
        configCode: 'UC59214060007170048',
        name: '本地生活-分页查询订单列表',
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
})

const exportExcel = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            ...form.value,
            pageNo: pageinfo.page,
            pageSize: pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        exportName: '统一运营平台-本地生活订单-' + generateDate(),
        configCode: 'UCJH59227493763096576',
        name: '本地生活导出查询订单列表-聚合sku',
        source: '运营后台',
        exportType: 7
    }
    const res = await exportDetails(params)
    console.log(res, 'res')
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
