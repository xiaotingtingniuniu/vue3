<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="订单编号" prop="orderNumber">
                    <el-input v-model.trim="searchData.orderNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="工单编号" prop="workNumber">
                    <el-input v-model.trim="searchData.workNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="用户手机号" prop="mobile">
                    <el-input v-model.trim="searchData.mobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="工单状态" prop="workStatus">
                    <el-select v-model="searchData.workStatus" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="待处理" value="0" />
                        <el-option label="已完成" value="1" />
                        <el-option label="已取消" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工单类型" prop="workType">
                    <el-select v-model="searchData.workType" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="退款" value="0" />
                        <el-option label="补款" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="客诉类型" prop="custAppealType">
                    <el-select v-model="searchData.custAppealType" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="商品/包装破损" value="1" />
                        <el-option label="商品变质/有异味" value="2" />
                        <el-option label="订单金额有误" value="3" />
                        <el-option label="手动补扣" value="4" />
                        <el-option label="其他" value="5" />
                        <el-option label="通知第三方出货消息推送失败" value="6" />
                        <el-option label="第三方出货失败" value="7" />
                        <el-option label="退运费" value="8" />
                        <el-option label="商品质量问题" value="9" />
                        <el-option label="少件（含缺少配件）" value="10" />
                        <el-option label="发错货了" value="11" />
                        <el-option label="发票问题" value="12" />
                        <el-option label="不喜欢/不想要了" value="13" />
                        <el-option label="价格问题" value="14" />
                        <el-option label="未按预定时间发货" value="15" />
                        <el-option label="快递一直没到" value="16" />
                        <el-option label="快递没有跟踪记录" value="17" />
                        <el-option label="货物破损已拒签" value="18" />
                        <el-option label="商家服务态度太差" value="19" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工单发起时间" prop="workOrderStart" class="form-item-time">
                    <el-date-picker v-model="querinfo.workOrderStart" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                </el-form-item>
                <el-form-item label="工单完结时间" prop="workOrderEnd" class="form-item-time">
                    <el-date-picker v-model="querinfo.workOrderEnd" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeUTime"/>
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
                <template #workStatus="scope">
                    <span v-if="scope.row.workStatus === 0">待处理</span>
                    <span v-if="scope.row.workStatus === 1">已完成</span>
                    <span v-if="scope.row.workStatus === 2">已取消</span>
                </template>
                <template #workType="scope">
                    <span v-if="scope.row.workType === 0">退款</span>
                    <span v-if="scope.row.workType === 1">补款</span>
                </template>
                <template #custAppealType="scope">
                    <span v-if="scope.row.custAppealType === 1">商品/包装破损</span>
                    <span v-if="scope.row.custAppealType === 2">商品变质/有异味</span>
                    <span v-if="scope.row.custAppealType === 3">订单金额有误</span>
                    <span v-if="scope.row.custAppealType === 4">手动补扣</span>
                    <span v-if="scope.row.custAppealType === 5">其他</span>
                    <span v-if="scope.row.custAppealType === 6">通知第三方出货消息推送失败</span>
                    <span v-if="scope.row.custAppealType === 7">第三方出货失败</span>
                    <span v-if="scope.row.custAppealType === 8">退运费</span>
                    <span v-if="scope.row.custAppealType === 9">商品质量问题</span>
                    <span v-if="scope.row.custAppealType === 10">少件（含缺少配件）</span>
                    <span v-if="scope.row.custAppealType === 11">发错货了</span>
                    <span v-if="scope.row.custAppealType === 12">发票问题</span>
                    <span v-if="scope.row.custAppealType === 13">不喜欢/不想要了</span>
                    <span v-if="scope.row.custAppealType === 14">价格问题</span>
                    <span v-if="scope.row.custAppealType === 15">未按预定时间发货</span>
                    <span v-if="scope.row.custAppealType === 16">快递一直没到</span>
                    <span v-if="scope.row.custAppealType === 17">快递没有跟踪记录</span>
                    <span v-if="scope.row.custAppealType === 18">货物破损已拒签</span>
                    <span v-if="scope.row.custAppealType === 19">商家服务态度太差</span>

                </template>
                <template #dealResult="scope">
                    <span v-if="scope.row.dealResult === 2">有退款</span>
                    <span v-if="scope.row.dealResult === 3">用户取消退款</span>
                    <span v-if="scope.row.dealResult === 0">待处理</span>
                    <span v-if="scope.row.dealResult === 1">拒绝退款</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row.id, 0)" text>
                        查看
                    </el-button>
                </template>
            </system-list>
        </div>
        <!-- <work-order-detail v-if="dialogDetail" :visible ='dialogDetail' @fevent="init" @handleClose="dialogDetail = false" :orderNo = "orderNo"  ></work-order-detail> -->
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import workOrderDetail from './work-order-detail.vue'
import { refundList } from '@/api/refund/index'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'orderNumber', label: '订单编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '工单编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '用户手机号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '工单发起时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workEndTime', label: '工单完结时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '工单状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'workType', label: '工单类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'custAppealType', label: '客诉类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'dealName', label: '处理人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'dealResult', label: '处理结果', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'remark', label: '拒绝退款原因', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 130, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        orderNumber: '',
        workNumber: '',
        workStatus: '',
        workType: '',
        mobile: '',
        custAppealType: ''
    },
    dateTime: {
        workEndTimeSt: '',
        workEndTimeEn: '',
        workStartTimeSt: '',
        workStartTimeEn: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
const { searchData, pageinfo } = toRefs(dataState)

const querinfo = ref({
    workOrderStart: [],
    workOrderEnd: []
})
onMounted(async () => {
    await getRefundList()
})

const daterangeTime = (val) => {
    if (val) {
        querinfo.value.workOrderStart = val
        dataState.dateTime.workStartTimeSt = val[0]
        dataState.dateTime.workStartTimeEn = val[1]
    } else {
        querinfo.value.workOrderStart = ''
        dataState.dateTime.workStartTimeSt = ''
        dataState.dateTime.workStartTimeEn = ''
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
    // router.push({ name: 'online-order-detail', params: { orderNo, iscon } })
    const routeData = router.resolve({ name: 'online-order-detail', params: { orderNo, iscon } })
    window.open(routeData.href, '_blank')
}

// 列表数据
const getRefundList = async () => {
    const params = {
        ...dataState.dateTime,
        orderNumber: dataState.searchData.orderNumber || null,
        workNumber: dataState.searchData.workNumber || null,
        workStatus: dataState.searchData.workStatus || null,
        workType: dataState.searchData.workType || null,
        mobile: dataState.searchData.mobile || null,
        custAppealType: dataState.searchData.custAppealType || null,
        current: dataState.pageinfo.currentPage,
        size: dataState.pageinfo.pageSize,
        sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d',
        businessCode: 'A1001004'
    }
    const data = await refundList(params)
    tableData.value = data.records
    dataState.pageinfo.total = data.total
}

const init = () => {
    dataState.searchData.orderNumber = ''
    dataState.searchData.workNumber = ''
    dataState.searchData.workStatus = ''
    dataState.searchData.workType = ''
    dataState.searchData.mobile = ''
    dataState.searchData.custAppealType = ''
    dataState.dateTime.receivedBeginDate = ''
    dataState.dateTime.receivedEndDate = ''
    dataState.dateTime.useBeginDate = ''
    dataState.dateTime.useEndDate = ''
    dataState.pageinfo.currentPag = 1
    dataState.pageinfo.pageSize = 10
    getRefundList()
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    querinfo.value.workOrderStart = []
    querinfo.value.workOrderEnd = []
    dataState.dateTime.workStartTimeSt = ''
    dataState.dateTime.workStartTimeEn = ''
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
</style>
