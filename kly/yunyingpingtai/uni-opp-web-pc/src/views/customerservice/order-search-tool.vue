<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="工单编号" prop="workNumber">
                    <el-input v-model.trim="searchData.workNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="工单状态" prop="workStatus">
                    <el-select v-model="searchData.workStatus" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="待处理" :value="0" />
                        <el-option label="已完成" :value="1" />
                        <el-option label="已取消" :value="2" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="工单类型" prop="workType">
                    <el-select v-model="searchData.workType" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="异常" :value="1" />
                        <el-option label="补扣" :value="2" />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="订单编号" prop="orderNo">
                    <el-input v-model.trim="searchData.orderNo" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="处理人" prop="dealId">
                    <el-input v-model.trim="searchData.dealId" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="OA订单号" prop="applyCode">
                    <el-input v-model.trim="searchData.applyCode" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="用户手机号" prop="userMobile">
                    <el-input v-model.trim="searchData.userMobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model.trim="searchData.userId" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="商户编号" prop="merchantCode">
                    <el-input v-model.trim="searchData.merchantCode" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model.trim="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="设备编号" prop="deviceNo">
                    <el-input v-model.trim="searchData.deviceNo" placeholder="请输入～" clearable />
                </el-form-item>
                <!-- <el-form-item label="异常标签" prop="exceptionLabel">
                    <el-select v-model="searchData.exceptionLabel" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in options1"
                            :key="item.type"
                            :label="item.desc"
                            :value="item.type"
                        />
                    </el-select>
                </el-form-item> -->
                <!-- <el-form-item label="订单标签" prop="orderLevel">
                    <el-select v-model="searchData.workType" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in options2"
                            :key="item.type"
                            :label="item.desc"
                            :value="item.type"
                        />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="客户端" prop="platform">
                    <el-select v-model="searchData.platform" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in platformList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="补扣订单创建时间" prop="createStartTime" class="form-item-time" label-width="150px">
                    <el-date-picker v-model="querinfo.createStartTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="exportList">
                        导出
                    </el-button>
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currentPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #workType="scope">
                    <span v-if="scope.row.workType === 0">退款</span>
                    <span v-if="scope.row.workType === 1">异常</span>
                    <span v-if="scope.row.workType === 2">补扣</span>
                </template>
                <template #operateModel="scope">
                    <span v-if="scope.row.operateModel === 1">直营</span>
                    <span v-if="scope.row.operateModel === 2">代运营</span>
                    <span v-if="scope.row.operateModel === 3">柜主</span>
                </template>
                <template #workStatus="scope">
                    <span class="text" v-if="scope.row.workStatus === 0">待处理</span>
                    <span v-if="scope.row.workStatus === 1">已完成</span>
                    <span v-if="scope.row.workStatus === 2">已取消</span>
                </template>
                <template #dealName="scope">
                    {{scope.row.dealName || ''}}
                </template>
                <!-- <template #dealResult="scope">
                    <span v-if="scope.row.dealResult === 2">有退款</span>
                    <span v-if="scope.row.dealResult === 3">用户取消退款</span>
                    <span v-if="scope.row.dealResult === 0">待处理</span>
                    <span v-if="scope.row.dealResult === 1">拒绝退款</span>
                </template> -->
                <template #platform="scope">
                    {{platformzList[scope.row.platform]}}
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row.workNumber, 0)" text>
                        查看
                    </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { abnormalSelect, abnormalList } from '@/api/refund/index'
import { publicRequest, publicExport } from '@/api/common/index'
import { useRoute, useRouter } from 'vue-router'
import { getTimer } from '@/utils'

const route = useRoute()
const router = useRouter()

const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'applyCode', label: 'OA订单号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '工单编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '订单编号', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'applyCode', label: 'OA账号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'platform', label: '客户端', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'userId', label: '用户ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'userMobile', label: '用户手机号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商家编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'producer', label: '厂商', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'deviceNo', label: '设备ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '订单应付总金额', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payAmount', label: '订单实付金额', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'applyOpenTime', label: '申请设备开门时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'deviceOpenTime', label: '设备开门时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operateModel', label: '运营模式', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'custAppealType', label: '支付方式', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '工单状态', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'workTypeName', label: '工单类型', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'workStatusName', label: '处理结果', minWidth: 120 },
    // { align: 'center', tooltip: true, prop: 'dealId', label: '处理人', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'dealName', label: '处理人', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'deviceName', label: '设备名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'workStartTime', label: '工单发起时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'workEndTime', label: '工单完结时间', minWidth: 120 },
    // { align: 'center', tooltip: true, prop: 'dealResult', label: '补退处理人', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 130, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        applyCode: '',
        orderNo: '',
        workNumber: '',
        userId: '',
        userMobile: '',
        deviceNo: '',
        deviceNoList: [],
        workType: '',
        merchantCode: '',
        merchantName: '',
        dealId: '',
        // exceptionLabel: '',
        // orderLevel: '',
        workStatus: '',
        platform: ''// 客户端类型
    },
    dateTime: {
        workEndTimeSt: '',
        workEndTimeEn: '',
        createStartTimeSt: '',
        createStartTimeEn: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
const { searchData, dateTime, pageinfo } = toRefs(dataState)
const platformList = ref(
    [{
        value: '',
        label: '全部'
    }, {
        value: 0,
        label: '恒生活APP'
    }, {
        value: 1,
        label: '恒生活Android'
    }, {
        value: 2,
        label: '恒生活iOS'
    }, {
        value: 3,
        label: '恒生活微信小程序'
    }, {
        value: 4,
        label: '恒生活支付宝小程序（未开通）'
    }, {
        value: 10,
        label: '恒掌柜Android'
    }, {
        value: 11,
        label: '恒掌柜IOS'
    }, {
        value: 20,
        label: '商家管理后台'
    }, {
        value: 21,
        label: '统一运营平台'
    }]
)
const platformzList = {
    0: '恒生活APP',
    1: '恒生活Android',
    2: '恒生活iOS',
    3: '恒生活微信小程序',
    4: '恒生活支付宝小程序（未开通）',
    10: '恒掌柜Android',
    11: '恒掌柜IOS',
    20: '商家管理后台',
    21: '统一运营平台'
}
const options1 = ref([])
const options2 = ref([])
const querinfo = ref({
    createStartTime: [],
    createEndTime: []
})
onMounted(async () => {
    await abnorLabel()
    await getRefundList()
    await abnormalTitle()
})
const abnorLabel = async () => {
    const { data } = await abnormalSelect({ searchType: 1 })
    options1.value = data
}
const abnormalTitle = async () => {
    const { data } = await abnormalSelect({ searchType: 2 })
    options2.value = data
}
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.createStartTime = val
        dataState.dateTime.createStartTimeSt = val[0]
        dataState.dateTime.createStartTimeEn = val[1]
    } else {
        querinfo.value.createStartTime = ''
        dataState.dateTime.createStartTimeSt = ''
        dataState.dateTime.createStartTimeEn = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        querinfo.value.workOrderEnd = val
        dataState.dateTime.workEndTimeSt = val[0]
        dataState.dateTime.workEndTimeEn = val[1]
    } else {
        querinfo.value.workOrderEnd = ''
        dataState.dateTime.workEndTimeSt = ''
        dataState.dateTime.workEndTimeEn = ''
    }
}
const orderNo = ref('')
const toDetail = (orderNo, iscon) => {
    // router.push({ name: 'makeup-order-detail', params: { orderNo, iscon } })
    const routeData = router.resolve({ name: 'makeup-order-detail', params: { orderNo, iscon } })
    window.open(routeData.href, '_blank')
}

// 列表数据
const getRefundList = async () => {
    const params = {
        ...searchData.value,
        applyCode: dataState.searchData.applyCode,
        orderNo: dataState.searchData.orderNo,
        workNumber: dataState.searchData.workNumber,
        userId: dataState.searchData.userId,
        deviceNo: dataState.searchData.deviceNo,
        deviceNoList: dataState.searchData.deviceNoList,
        merchantCode: dataState.searchData.merchantCode,
        platform: dataState.searchData.platform,
        // exceptionLabel: dataState.searchData.exceptionLabel,
        // orderLevel: dataState.searchData.orderLevel,
        workStatus: dataState.searchData.workStatus,
        userMobile: dataState.searchData.userMobile,
        workType: 2,
        pageNum: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }
    if (querinfo.value.createStartTime.length !== 0) {
        const reparams = {
            createStartTime: querinfo.value.createStartTime[0],
            createEndTime: querinfo.value.createStartTime[1]
        }
        Object.assign(params, reparams)
    }
    const { data } = await abnormalList(params)
    for (let i = 0; i < data.records.length; i++) {
        data.records[i].payAmount = (data.records[i].payAmount / 100).toFixed(2)
        data.records[i].totalAmount = (data.records[i].totalAmount / 100).toFixed(2)
    }
    tableData.value = data.records
    console.log(tableData.value + 'tableData.value')
    dataState.pageinfo.total = data.total
}
const exportList = async () => {
    const params = {
        ...searchData.value,
        applyCode: dataState.searchData.applyCode,
        orderNo: dataState.searchData.orderNo,
        workNumber: dataState.searchData.workNumber,
        userId: dataState.searchData.userId,
        deviceNo: dataState.searchData.deviceNo,
        deviceNoList: dataState.searchData.deviceNoList,
        merchantCode: dataState.searchData.merchantCode,
        platform: dataState.searchData.platform,
        // exceptionLabel: dataState.searchData.exceptionLabel,
        // orderLevel: dataState.searchData.orderLevel,
        workStatus: dataState.searchData.workStatus,
        userMobile: dataState.searchData.userMobile,
        workType: 2
        // pageNum: pageinfo.value.currentPage,
        // pageSize: pageinfo.value.pageSize
    }
    if (querinfo.value.createStartTime.length !== 0) {
        const reparams = {
            createStartTime: querinfo.value.createStartTime[0],
            createEndTime: querinfo.value.createStartTime[1]
        }
        Object.assign(params, reparams)
    }
    publicExport({ key: 'CONTAINER_ABNORMAL_WOEK_LIST', body: params, exportName: '统一运营平台-货柜商品补退工单-' + getTimer() })
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    querinfo.value.createStartTime = []
    querinfo.value.workOrderEnd = []
    dataState.dateTime.createStartTimeSt = ''
    dataState.dateTime.createStartEndSt = ''
    dataState.dateTime.workEndTimeSt = ''
    dataState.dateTime.workEndTimeEn = ''
    getRefundList()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getRefundList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
 .text{
    color: red;
 }
 :deep(.el-form-item__label){
    width: 150px;
 }
</style>
