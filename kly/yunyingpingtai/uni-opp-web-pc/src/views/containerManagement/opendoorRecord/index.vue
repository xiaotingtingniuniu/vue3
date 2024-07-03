<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="开门记录ID" prop="applyCode">
                <el-input v-model="form.applyCode" placeholder="请输入开门记录ID" />
            </el-form-item>
            <el-form-item label="业务状态" prop="processStatus">
                <el-select v-model="form.processStatus" placeholder="请选择业务状态">
                    <el-option label="全部" value="" />
                    <el-option label="开门中" value="0" />
                    <el-option label="已开门" value="10" />
                    <el-option label="已关门" value="20" />
                    <el-option label="视频已上传" value="30" />
                    <el-option label="处理中" value="45" />
                    <el-option label="已识别" value="40" />
                    <el-option label="待生单" value="50" />
                    <el-option label="已生单" value="60" />
                    <el-option label="无购物" value="70" />
                    <!-- <el-option label="开门失败" value="11" />
                    <el-option label="无购物" value="11" />
                    <el-option label="识别异常" value="11" />
                    <el-option label="异常交易" value="11" /> -->
                </el-select>
            </el-form-item>
            <el-form-item label="异常标签" prop="errorCode">
                <el-select v-model="form.errorCode" placeholder="请选择异常标签">
                    <el-option label="全部" value="" />
                    <el-option label="开门超时" value="0" />
                    <el-option label="开门失败" value="1" />
                    <el-option label="关门超时" value="2" />
                    <el-option label="关门失败" value="3" />
                    <el-option label="上传超时" value="4" />
                    <el-option label="上传失败" value="5" />
                    <el-option label="识别错误" value="6" />
                    <el-option label="识别失败" value="7" />
                    <el-option label="成功：未拿商品" value="8" />
                    <el-option label="失败：⽆法识别" value="9" />
                    <el-option label="告警：故意遮挡" value="10" />
                    <el-option label="失败：柜中无此SKU" value="11" />
                    <el-option label="告警：其他告警" value="12" />
                    <el-option label="告警：异物拿放" value="13" />
                    <el-option label="告警：疑似设备故障" value="14" />
                    <el-option label="生单失败" value="15" />
                    <el-option label="识别超时" value="16" />
                    <el-option label="识别异常(货柜未维护商品)" value="17" />
                    <el-option label="解析商品异常" value="18" />
                </el-select>
            </el-form-item>
            <el-form-item label="经营属性" prop="businessProperty">
                <el-select v-model="form.businessProperty" placeholder="请选择经营属性">
                    <el-option label="全部" value="" />
                    <el-option label="自营" value="1" />
                    <el-option label="加盟" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="用户手机号" prop="userMobile">
                <el-input v-model="form.userMobile" placeholder="请输入用户手机号" />
            </el-form-item>
            <el-form-item label="代运营商" prop="operatorName">
                <el-input v-model="form.operatorName" placeholder="请输入代运营商" />
            </el-form-item>
            <el-form-item label="商户ID" prop="merchantCode">
                <el-input v-model="form.merchantCode" placeholder="请输入商户ID" />
            </el-form-item>
            <el-form-item label="设备ID" prop="deviceId">
                <el-input v-model="form.deviceId" placeholder="请输入设备ID" />
            </el-form-item>
            <el-form-item label="设备厂商" prop="manufacturerName">
                <el-input v-model="form.manufacturerName" placeholder="请输入设备厂商" />
                <!-- <el-select v-model="form.manufacturerName" placeholder="请选择">
                    <el-option label="全部" value="" />
                    <el-option label="仓库发货" value="1" />
                    <el-option label="厂商直送" value="2" />
                </el-select> -->
            </el-form-item>
            <el-form-item label="设备型号" prop="deviceModelName">
                <!-- <el-input v-model="form.deviceModel" placeholder="请输入设备型号" /> -->
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
            <el-form-item label="点位ID" prop="pointId">
                <el-input v-model="form.pointId" placeholder="请输入点位ID" />
            </el-form-item>
            <el-form-item label="创建时间" prop="startTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.startTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="daterangeTime"/>
                </el-col>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.endTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeUTime"/>
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
                    <!-- <el-button type="primary"  @click="exportExcel">导出</el-button> -->
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
import { getOpenDoorRecode } from '@/api/opendoor/index'

const router = useRouter()

// 支付时间
const querinfo = ref({
    startTime: [],
    endTime: []
})
// 表单数据
const form = ref({
    applyCode: '',
    processStatus: '',
    errorCode: '',
    userMobile: '',
    merchantCode: '',
    businessProperty: '',
    operatorId: '',
    deviceId: '',
    manufacturerId: '',
    deviceModelName: '',
    firstScenesCode: '',
    secondScenesCode: '',
    pointId: '',
    pointGroupId: '',
    startTimeFrom: '',
    startTimeTo: '',
    endTimeFrom: '',
    endTimeTo: '',
    orderNoSub: '',
    secondScenesName: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
// 表格数据
const tHead = [
    { align: 'center', tooltip: true, prop: 'applyCode', label: '开门记录ID', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'processName', label: '业务状态', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'errorName', label: '异常标签', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'userMobile', label: '用户手机号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商户ID', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'deliveryMethod', label: '配送方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'businessPropertyName', label: '经营属性', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'operatorName', label: '代运营商', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'deviceId', label: '设备ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'manufacturerName', label: '设备厂商', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'deviceModelName', label: '设备型号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'secondScenesName', label: '场景类型', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'pointId', label: '点位ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '创建时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '结束时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

const tableData = ref([])
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

const quotationDetailed = (row) => {
    router.push({ name: 'opendoorRecordDetail', params: { recordID: row.applyCode } })
}

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.gmtCreate = val
        form.value.startTimeFrom = val[0]
        form.value.startTimeTo = val[1]
    } else {
        form.value.startTimeFrom = ''
        form.value.startTimeTo = ''
    }
}
const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.payTime = val
        form.value.endTimeFrom = val[0]
        form.value.endTimeTo = val[1]
    } else {
        form.value.endTimeFrom = ''
        form.value.endTimeTo = ''
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
    querinfo.value.endTime = []
    resetFormData.value.resetFields()
    form.value.applyCode = ''
    form.value.processStatus = ''
    form.value.errorCode = ''
    form.value.userMobile = ''
    form.value.merchantCode = ''
    form.value.businessProperty = ''
    form.value.operatorId = ''
    form.value.deviceId = ''
    form.value.manufacturerId = ''
    form.value.deviceModelName = ''
    form.value.firstScenesCode = ''
    form.value.secondScenesCode = ''
    form.value.pointId = ''
    form.value.pointGroupId = ''
    form.value.startTimeFrom = ''
    form.value.startTimeTo = ''
    form.value.endTimeFrom = ''
    form.value.endTimeTo = ''
    form.value.orderNoSub = ''
    form.value.secondScenesName = ''
    applyClassifyRef.value && (applyClassifyRef.value.panel.checkedNodes = [])
    scenesNameRef.value && (scenesNameRef.value.panel.checkedNodes = [])
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
            pageNo: pageinfo.page,
            pageSize: pageinfo.pageSize

        },
        appKey: 'A100100',
        busiCode: 'A1001002',
        configCode: 'UC36101574535942144',
        name: '运营_订单_开门记录查询',
        source: '订单中台'
    }
    const res = await getMerchantListCode(params)
    if (res) {
        tableData.value = res.data
        pageinfo.total = res.count
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
    courierCompanyList.value = data.data ? data.data.expressList : []
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
                leaf: level >= 1,
                value: item.value
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
        form.value.secondScenesCode = item.value
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
