<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="订单编号" prop="orderNoSub">
                    <el-input v-model.trim="searchData.orderNoSub" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="投诉时间" prop="complaintTime" class="form-item-time">
                    <el-date-picker v-model="querinfo.complaintTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                </el-form-item>
                <el-form-item label="投诉单状态" prop="complaintState">
                    <el-select v-model="searchData.complaintState" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <!-- <el-option label="待处理" value="0" /> -->
                        <el-option label="处理中" value="1" />
                        <el-option label="已完成" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="客户端类型" prop="platform">
                    <el-select v-model="searchData.platform" clearable placeholder="请选择" >
                        <el-option
                            v-for="item in platformList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
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
                <template #problemType="scope">
                    <span v-if="scope.row.problemType === 0">申请退款</span>
                    <span v-if="scope.row.problemType === 1">服务权益未生效</span>
                    <span v-if="scope.row.problemType === 2">其他类型</span>
                </template>
                <template #complaintState="scope">
                    <!-- <span v-if="scope.row.complaintState === 0">待处理</span> -->
                    <span v-if="scope.row.complaintState === 1">处理中</span>
                    <span v-if="scope.row.complaintState === 2">已完成</span>
                </template>
                <template #platform="scope">
                    {{platformzList[scope.row.platform]}}
                </template>
                <!-- <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row.orderNoSub)" text>
                        处理
                    </el-button>
                </template> -->
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import workOrderDetail from './work-order-detail.vue'
import { refundList, wechart, wechartList } from '@/api/refund/index'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'orderNoSub', label: '订单编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'platform', label: '客户端类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payNo', label: '支付单号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'complaintId', label: '投诉单号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'complaintTime', label: '投诉时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'beginTime', label: '开始日期', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '结束日期', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'complaintDetail', label: '投诉详情', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'complaintedMchid', label: '被诉商户号', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: 'complaintState', label: '投诉单状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'payerPhone', label: '投诉人联系方式', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'payerOpenid', label: '投诉人openid', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'complaintsServiceResVO.state', label: '投诉单关联服务单信息', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'complaintFullRefunded', label: '投诉单是否已全额退款', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'problemType', label: '问题类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'applyRefundAmount', label: '申请退款金额', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审批动作', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'expectRefundTime', label: '预计发起退款时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'rejectRefundReason', label: '拒绝退款原因', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'complaintState', label: '投诉单状态', minWidth: 100, slot: true }
    // { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 130, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        orderNoSub: '',
        complaintState: '',
        platform: ''// 客户端类型
    },
    dateTime: {
        complaintTimeBegin: '',
        complaintTimeEnd: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
const { searchData, pageinfo } = toRefs(dataState)
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
const querinfo = ref({
    complaintTime: []
})
onMounted(async () => {
    await getRefundList()
})

const daterangeTime = (val) => {
    if (val) {
        querinfo.value.complaintTime = val
        dataState.dateTime.complaintTimeBegin = val[0]
        dataState.dateTime.complaintTimeEnd = val[1]
    } else {
        querinfo.value.complaintTime = ''
        dataState.dateTime.complaintTimeBegin = ''
        dataState.dateTime.complaintTimeEnd = ''
    }
}

const orderNo = ref('')
const toDetail = (orderNo) => {
    router.push({ name: 'order-detail', params: { orderNo } })
}

// 列表数据
const getRefundList = async () => {
    // const data = await wechart()
    wechartlist()
}
const wechartlist = async () => {
    const params = {
        ...dataState.dateTime,
        orderNoSub: dataState.searchData.orderNoSub,
        complaintState: dataState.searchData.complaintState,
        platform: dataState.searchData.platform,
        appKey: 'A1001000',
        currentPage: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const { data } = await wechartList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.totalCount
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    querinfo.value.complaintTime = []
    dataState.dateTime.complaintTimeBegin = ''
    dataState.dateTime.complaintTimeEnd = ''
    getRefundList()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    wechartlist()
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
</style>
