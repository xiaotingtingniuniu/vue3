<!-- 账单 -->
<template>
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick">
        <!-- 账单 -->
        <el-form v-if="dataState.tabType.name !== '0'" ref="resetFormData" :model="ruleForm" label-width="120px" :inline="true">
            <el-form-item label="账单日期" prop="ndata">
                <el-date-picker
                    v-model="ruleForm.ndata"
                    range-separator="~"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    :type="dataState.tabType.name === '1' ? 'daterange' : 'monthrange'"
                    :value-format="dataState.tabType.name === '1' ? 'YYYY-MM-DD' : 'YYYY-MM'"
                />
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
            </el-form-item>
        </el-form>
        <!-- 明细 -->
        <el-form v-else ref="resetFormDataM" :model="ruleFormM" label-width="120px" :inline="true">
            <el-form-item label="分账时间" prop="settleTime">
                <el-date-picker
                    v-model="ruleFormM.settleTime"
                    range-separator="~"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    :type="'daterange'"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="业务订单号" prop="orderNo">
                <el-input
                    v-model="ruleFormM.orderNo"
                    clearable
                    placeholder="请输入～"
                />
            </el-form-item>
            <el-form-item label="子订单号" prop="subOrderNo">
                <el-input
                    v-model="ruleFormM.subOrderNo"
                    clearable
                    placeholder="请输入～"
                />
            </el-form-item>
            <el-form-item label="创建时间" prop="createTime">
                <el-date-picker
                    v-model="ruleFormM.createTime"
                    range-separator="~"
                    start-placeholder="开始"
                    end-placeholder="结束"
                    :type="'daterange'"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="算法分账状态" prop="settleStatus">
                <el-select v-model="ruleFormM.settleStatus" clearable placeholder="请选择">
                    <el-option label="全部" value="" />
                    <el-option label="已收取" :value="1" />
                    <el-option label="未收取" :value="2" />
                </el-select>
            </el-form-item>
            <el-form-item >
                <el-button type="primary" @click="searchCouponM">
                    查询
                </el-button>
                <el-button type="primary" @click="formRef">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <el-tab-pane :label="item.name" :name="item.value" v-for="(item,index) in platformTab" :key='index'>
            <system-list
                :tHead="dataState.tabType.name === '0'? tHeadM: tHead"
                :tableData="dataState.tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <!-- 账单 -->
                <template #algorithmFeeAmount="{row}">
                    ¥{{row.algorithmFeeAmount / 100}}
                </template>
                <template #platServiceFee="{row}">
                    ¥{{row.platServiceFee / 100}}
                </template>
                <template #operation="{row}">
                    <el-button text type="primary" @click="addcatalogue(row)">账单导出</el-button>
                </template>
                <!-- 明细 -->
                <template #orderAmount="{row}">
                    {{row.orderAmount / 100}}
                </template>
                <template #discAmount="{row}">
                    {{row.discAmount / 100}}
                </template>
                <template #realAmount="{row}">
                    {{row.realAmount / 100}}
                </template>
                <template #platServiceFeeN="{row}">
                    {{row.platServiceFee / 100}}
                </template>
                <template #algorithmFeeAmountN="{row}">
                    {{row.algorithmFeeAmount / 100}}
                </template>
            </system-list>
        </el-tab-pane>
    </el-tabs>
</template>
<script setup>
import { ref, onMounted, reactive, toRefs, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory, yingyongQueryCategory } from '@/utils'
import { ElMessageBox, ElMessage } from 'element-plus'
import { exportDetails } from '@/api/settlementManagement/index'

import { useStore } from 'vuex'
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisibleDetail = ref(false)
const handleId = ref('')
const handleType = ref('')
onMounted(async () => {
    await getCateNameList()
})
// 筛选条件
const ruleForm = reactive({
    ndata: ''
})
const ruleFormM = reactive({
    settleTime: '',
    createTime: '',
    settleStatus: '',
    orderNo: '',
    subOrderNo: ''
})

const activeName = ref('1')
const platformTab = [
    { name: '算法服务费明细', value: '0' },
    { name: '日账单', value: '1' },
    { name: '月账单', value: '2' }
]

// 切换TAB
const handleClick = (tab, event) => {
    ruleForm.ndata = ''
    dataState.tabType = tab.props
    dataState.pageinfo.page = 1
    if (dataState.tabType.name === '0') {
        getAlgorithmDetails()
    } else {
        getCateNameList()
    }
}

const dataState = reactive({
    formData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        isEnabled: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    tableData: [],
    tabType: { name: '1', label: '日账单' }
})
const { formData, pageinfo, tableData } = toRefs(dataState)

// 账单
const getCateNameList = async () => {
    const param = {
        body: {
            billType: Number(dataState.tabType.name),
            startTime: ruleForm.ndata ? ruleForm.ndata[0] || '' : dataState.tabType.name === '1' ? noneTime.currentdate : noneTime.currentmonth,
            endTime: ruleForm.ndata ? ruleForm.ndata[1] || '' : dataState.tabType.name === '1' ? noneTime.currentdate : noneTime.currentmonth,
            ...dataState.pageinfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC32468990764425216',
        name: '算法费账单查询接口',
        source: '结算中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.total
}
// 明细
const getAlgorithmDetails = async () => {
    const param = {
        body: {
            settleStartTime: ruleFormM.settleTime ? ruleFormM.settleTime[0] || '' : '',
            settleEndTime: ruleFormM.settleTime ? ruleFormM.settleTime[1] || '' : '',
            createStartTime: ruleFormM.createTime ? ruleFormM.createTime[0] || '' : '',
            createEndTime: ruleFormM.createTime ? ruleFormM.createTime[1] || '' : '',
            subOrderNo: ruleFormM.subOrderNo,
            orderNo: ruleFormM.orderNo,
            settleStatus: ruleFormM.settleStatus,
            ...dataState.pageinfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC32469128073355264',
        name: '查询算法服务费明细接口',
        source: '结算中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.total
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'time', label: '日期', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'orderNumbers', label: '订单数', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'algorithmFeeAmount', label: '算法使用费收入', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'platServiceFee', label: '平台服务费收入', minWidth: 140, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 280, slot: true }
]

const tHeadM = [
    { align: 'center', tooltip: true, prop: 'orderNo', label: '订单号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'subOrderNo', label: '子订单号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'payTypeDesc', label: '支付方式', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'payTime', label: '支付成功时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'orderAmount', label: '订单金额', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'discAmount', label: '补贴金额', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'realAmount', label: '用户实付金额', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'isCollectDesc', label: '算法服务费是否收取', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'settleStatusDesc', label: '算法分账状态', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'platServiceFeeN', label: '平台服务费', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'algorithmFeeAmountN', label: '算法使用费', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'settleTime', label: '分账时间', minWidth: 140 }
]

// 重置
const resetFormDataM = ref(null)
const formRef = async () => {
    if (!resetFormDataM.value) return
    resetFormDataM.value.resetFields()
    await getAlgorithmDetails()
}

// 查询
const searchCoupon = async () => {
    dataState.pageinfo.page = 1
    await getCateNameList()
}
// 明细查询
const searchCouponM = async () => {
    dataState.pageinfo.page = 1
    await getAlgorithmDetails()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    if (dataState.tabType.name === '0') {
        getAlgorithmDetails()
    } else {
        getCateNameList()
    }
}

const currentChange = (val) => {
    dataState.pageinfo.page = val
    if (dataState.tabType.name === '0') {
        getAlgorithmDetails()
    } else {
        getCateNameList()
    }
}

const tabClick = (tab) => {
    pageinfo.value.page = 1
    console.log(tab.paneName)
}

// 导出
const addcatalogue = (val) => {
    exportTable(val)
}

// 导出
const exportTable = async (val) => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC32469058955419648',
        url: '/settlement/strategybill/export',
        name: '算法服务费账单导出',
        source: '结算中台',
        exportType: 7,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            billType: Number(dataState.tabType.name),
            time: val.time
        }
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

/**
 * 获取当前时间
 * 格式YYYY-MM-DD/YYYY-MM
 */
const noneTime = reactive({
    currentmonth: '',
    currentdate: ''
})
const dataTame = () => {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    noneTime.currentmonth = year + seperator1 + month
    noneTime.currentdate = year + seperator1 + month + seperator1 + strDate
}
dataTame()
</script>
<style lang="scss" scoped>
.box-card {
    border: initial;
}

.button-box {
    padding-left: 80%;
}
.upload-demo {
    display: flex;
    justify-content: center;
    .el-button {
        margin: 0 20px 0 0;
    }
}
</style>
