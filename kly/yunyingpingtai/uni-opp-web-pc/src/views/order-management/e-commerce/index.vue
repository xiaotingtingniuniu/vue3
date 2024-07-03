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
            <el-form-item label="配送方式" prop="deliveryMethod">
                <el-select v-model="form.deliveryMethod" placeholder="请选择配送方式">
                    <el-option label="全部" value="" />
                    <el-option label="仓库发货" value="2" />
                    <el-option label="厂商直送" value="1" />
                    <el-option label="店铺发货" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择订单状态">
                    <el-option label="全部" value="" />
                    <el-option label="待付款" value="100" />
                    <!-- <el-option label="待出库" value="200" /> -->
                    <el-option label="待配送" value="300" />
                    <!-- <el-option label="待入柜" value="400"/> -->
                    <el-option label="待取货" value="500"/>
                    <el-option label="已完成" value="600" />
                    <el-option label="已取消" value="800" />
                </el-select>
            </el-form-item>
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
            <el-form-item label="订单结束时间" prop="endTime">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.endTime" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" @change="daterangeendTime"/>
                </el-col>
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <!-- <el-button type="primary">导出列表</el-button> -->
                </div>
                <div>
                    <el-button  type="primary" @click="resetForm">重置</el-button>
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
import { getMerchantList } from '@/api/operate/index'
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
    merchantCode: '', // 商户id
    userId: '', // 户ID
    userMobile: '', // 用户手机号
    courierNumber: '', // 运单号
    payAmount: '', // 订单金额
    deliveryMethod: '',
    orderStatus: '', // 订单状态
    sourceType: 9, // 订单来源
    gmtCreateBegin: '', // 订单创建时间
    gmtCreateEnd: '',
    payTimeBegin: '', // 支付时间
    payTimeEnd: '',
    endTimeBegin: '', // 订单时间
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
    { align: 'center', tooltip: true, prop: 'deliveryMethod', label: '配送方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '订单金额', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '订单下单时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payTime', label: '订单支付时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '订单结束时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

const tableData = ref([])
const statusValue = {
    100: '待付款',
    200: '备餐中',
    300: '待配送/待发货',
    400: '待入柜',
    500: '待取货/待收货 ',
    600: '已完成',
    700: '退款成功',
    701: '退款处理中',
    702: '退款失败',
    800: '已取消/已关闭',
    900: '异常订单'
}
const deliveryMethods = {
    1: '厂商直发',
    2: '仓库发货',
    3: '店铺发货'
}
const quotationDetailed = (row) => {
    // router.push({ name: 'online-retailers-detail', params: { orderNoSub: row.orderNoSub } })
    const routeData = router.resolve({ name: 'online-retailers-detail', params: { orderNoSub: row.orderNoSub } })
    window.open(routeData.href, '_blank')
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
    form.value.gmtCreateBegin = ''
    form.value.gmtCreateEnd = ''
    form.value.payTimeBegin = ''
    form.value.payTimeEnd = ''
    form.value.endTimeBegin = ''
    form.value.endTimeEnd = ''
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
            busiCode: 'A1001004',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize

        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC15806025335042048',
        name: '电商到家分页查询订单列表',
        source: '订单中台'
    }
    const res = await orderList(params)
    if (res.data) {
        tableData.value = res.data.list
        pageinfo.total = res.data.totalCount
    } else {
        tableData.value = []
        pageinfo.total = 0
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
const exportExcel = async () => {
    const params = {
        body: {
            busiCode: 'A1001004',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize
        },
        exportType: 7,
        appKey: 'A1001001',
        busiCode: 'A1001004',
        exportName: '统一运营平台-电商订单-' + generateDate(),
        // configCode: 'UC16465127379824640',
        // name: '到家导出查询订单列表',
        // source: '订单中台'
        configCode: 'UCJH46541382001463296',
        name: '到家订单导出聚合',
        source: '运营后台'

    }
    const res = await exportDetails(params)
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

onMounted(async () => {
    // await getOrderList()
    // await getcourierCompanyList()
})

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
