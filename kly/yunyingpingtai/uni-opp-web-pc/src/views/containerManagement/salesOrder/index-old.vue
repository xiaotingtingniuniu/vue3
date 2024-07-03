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
            <el-form-item label="配送方式" prop="deliveryMethod">
                <el-select v-model="form.deliveryMethod" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="即时" value="10" />
                    <el-option label="自提" value="11" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                    <el-option label="全部" value="" />
                    <el-option label="待付款" value="100" />
                    <el-option label="已完成" value="600" />
                    <el-option label="退款成功" value="700" />
                    <el-option label="退款处理中" value="701" />
                    <el-option label="退款失败" value="702" />
                    <el-option label="已取消" value="800" />
                    <el-option label="异常订单" value="900" />
                </el-select>
            </el-form-item>
            <el-form-item label="位置ID" prop="poiId">
                <el-input v-model="form.poiId" placeholder="请输入点位ID" />
            </el-form-item>
            <!-- <el-form-item label="点位组ID" prop="pointGroup">
                <el-input v-model="form.pointGroup" placeholder="请输入点位ID" />
            </el-form-item> -->
            <el-form-item label="客户端" prop="platform">
                <el-select v-model="form.platform" placeholder="请选择客户端">
                    <el-option label="全部" value="" />
                    <el-option label="恒生活Android" value="1" />
                    <el-option label="恒生活iOS" value="2" />
                    <el-option label="恒生活微信小程序" value="3" />
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
            <el-form-item label="设备厂商" prop="deviceBrand">
                <el-input v-model="form.deviceBrand" placeholder="请输入设备ID" />
            </el-form-item>
            <!-- <el-form-item label="设备品牌" prop="deviceBrand">
                <el-select v-model="form.deviceBrand" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="仓库发货" value="1" />
                    <el-option label="厂商直送" value="2" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="设备型号" prop="deviceModelName">
                <el-cascader
                    ref="applyClassifyRef"
                    :props="equipmentList"
                    @change="deviceChange"
                    clearable
                />
            </el-form-item>
            <el-form-item label="场景类型" prop="secondScenesName">
                <el-cascader
                    ref="scenesNameRef"
                    :props="sceneList"
                    @change="secnceChange"
                    clearable
                />
            </el-form-item>
            <!-- <el-form-item label="地址信息" prop="poiAddress">
                <el-input v-model="form.poiAddress" placeholder="请输入配送地址" />
            </el-form-item> -->
            <el-form-item label="订单下单时间" prop="gmtCreate">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.gmtCreate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="daterangeTime"/>
                </el-col>
            </el-form-item>
            <el-form-item label="订单支付时间" prop="payTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.payTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeUTime"/>
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
                    <el-button type="primary"  @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="searchCoupon">搜索</el-button>
                    <el-button type="primary"  @click="exportExcel">导出</el-button>
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
                    {{platformValue[scope.row.platform]}}
                </template>
                <template #businessProperty="scope">
                    {{businessPropertyValue[scope.row.businessProperty]}}
                </template>
                <template #orderStatus="scope">
                    {{statusValue[scope.row.orderStatus]}}
                </template>
                <template #payAmount="scope">
                    <span >{{(scope.row.payAmount/100).toFixed(2)}}</span>
                </template>
                <template #deliveryMethod="scope">
                    {{deliveryMethods[scope.row.deliveryMethod]}}
                </template>
                <template #operation="{row}">
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

const router = useRouter()

// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: [],
    endTime: []
})
// 表单数据
const form = ref({
    orderNoSub: '', // 订单编号
    payNo: '', // 支付单号
    userId: '', // 用户id
    merchantCode: '', // 商户ID
    manageProperty: '', // 经营属性
    recodeID: '', // 开门记录ID
    userPhone: '', // 用户手机号
    operators: '', // 代运营商
    deliveryMethod: '', // 配送方式
    poiId: '', // 位置ID
    pointGroup: '', // 点位组ID
    client: '', // 客户端
    deviceNo: '', // 设备ID
    deviceBrand: '', // 设备品牌
    deviceModelName: '', // 设备型号
    secondScenesName: '', // 场景类型
    orderStatus: '', // 订单状态
    poiAddress: '', // 地址信息
    gmtCreateBegin: '', // 订单创建时间
    gmtCreateEnd: '',
    payTimeBegin: '', // 订单支付时间
    payTimeEnd: '',
    endTimeBegin: '', // 订单结束
    endTimeEnd: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// 表格数据
const tHead = [
    { align: 'center', tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'orderStatus', label: '订单状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'userId', label: '用户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'payNo', label: '支付单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'businessProperty', label: '经营属性', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantSubName', label: '代运营商', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'deliveryMethod', label: '配送方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'poiId', label: '位置ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备ID', minWidth: 180 },
    // { align: 'center', tooltip: true, prop: 'deviceNo', label: '点位组ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'platform', label: '客户端', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'deviceBrand', label: '设备厂商', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'deviceModelName', label: '设备型号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'secondScenesName', label: '场景类型', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '订单应付金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '订单下单时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payTime', label: '订单支付时间', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'endTimeEnd', label: '订单结束时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
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
    21: '统一运营平台'
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
const quotationDetailed = (row) => {
    router.push({ name: 'salesOrderDetail', params: { orderID: row.orderNoSub } })
}

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.gmtCreate = val
        form.value.gmtCreateBegin = val[0]
        form.value.gmtCreateEnd = val[1]
    } else {
        form.value.gmtCreateBegin = ''
        form.value.gmtCreateEnd = ''
    }
}
const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.payTime = val
        form.value.payTimeBegin = val[0]
        form.value.payTimeEnd = val[1]
    } else {
        form.value.payTimeBegin = ''
        form.value.payTimeEnd = ''
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
    querinfo.value.gmtCreate = []
    querinfo.value.payTime = []
    querinfo.value.endTime = []
    resetFormData.value.resetFields()
    form.value.orderNoSub = '' // 订单编号
    form.value.payNo = '' // 支付单号
    form.value.userId = '' // 用户id
    form.value.merchantCode = '' // 商户ID
    form.value.manageProperty = '' // 经营属性
    form.value.recodeID = '' // 开门记录ID
    form.value.userPhone = '' // 用户手机号
    form.value.operators = '' // 代运营商
    form.value.deliveryMethod = '' // 配送方式
    form.value.poiId = '' // 位置ID
    form.value.pointGroup = '' // 点位组ID
    form.value.client = '' // 客户端
    form.value.deviceNo = '' // 设备ID
    form.value.deviceBrand = '' // 设备品牌
    form.value.deviceModelName = '' // 设备型号
    form.value.secondScenesName = '' // 场景类型
    form.value.orderStatus = '' // 订单状态
    form.value.poiAddress = '' // 地址信息
    form.value.gmtCreateBegin = '' // 订单创建时间
    form.value.gmtCreateEnd = ''
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

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize

        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15806241522053120',
        name: '货柜分页查询订单列表',
        source: '订单中台'
    }
    const res = await getMerchantListCode(params)
    if (res.data.list) {
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
    lazyLoad (node, resolve) {
        const { level, data } = node
        setTimeout(async () => {
            const res = await getEquipmentList(data.pid || 0)
            const nodes = res.map(item => {
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
        form.value.deviceModelName = item.pathLabels[2]
    })
}

// 场景类型
const scenesNameRef = ref(null)
const sceneList = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await getSceneList(data.pid || 0)
        const nodes = res.map(item => {
            return {
                label: item.label,
                pid: item.id,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
const sceneCheckedNodes = ref([])
const secnceChange = (value) => {
    sceneCheckedNodes.value = scenesNameRef.value.getCheckedNodes(true)
    sceneCheckedNodes.value.forEach((item) => {
        form.value.secondScenesName = item.pathLabels[1]
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
            busiCode: 'A1001002',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize
        },
        exportType: 7,
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC16465222695383040',
        name: '货柜导出查询订单列表',
        source: '订单中台'

    }
    const res = await exportDetails(params)
    console.log(res, 'res')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    // console.log(fileName)
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
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
