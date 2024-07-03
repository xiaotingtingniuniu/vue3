<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="订单编号" prop="orderNumber">
                    <el-input v-model="searchData.orderNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="下单时间" prop="workOrderStart" class="form-item-time">
                    <el-date-picker v-model="querinfo.workOrderStart" type="date" placeholder="" :size="size" @change="daterangeTime" />
                </el-form-item>
                <el-form-item label="支付时间" prop="workOrderEnd" class="form-item-time">
                    <el-date-picker v-model="querinfo.workOrderEnd" type="date" placeholder="" :size="size" @change="daterangeUTime" />
                </el-form-item>
                <el-form-item label="组织" prop="workStatus">
                    <el-select v-model="searchData.workStatus" clearable placeholder="请选择">
                        <el-option label="全部" value="" />
                        <el-option label="待处理" value="0" />
                        <el-option label="已完成" value="1" />
                        <el-option label="已取消" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="子系统" prop="workType">
                    <el-select v-model="searchData.workType" clearable placeholder="请选择">
                        <el-option label="全部" value="" />
                        <el-option label="退款" value="0" />
                        <el-option label="补款" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态" prop="custAppealType">
                    <el-select v-model="searchData.custAppealType" clearable placeholder="请选择">
                        <el-option label="全部" value="" />
                        <el-option label="商品/包装破损" value="1" />
                        <el-option label="商品变质/有异味" value="2" />
                        <el-option label="订单金额有误" value="3" />
                        <el-option label="手动补扣" value="4" />
                        <el-option label="其他" value="5" />
                    </el-select>
                </el-form-item>
                <el-form-item label="用户手机号" prop="mobile">
                    <el-input v-model="searchData.mobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()"> 查询 </el-button>
                    <el-button type="primary" @click="resetForm(formRef)"> 重置 </el-button>
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
                <template #workStatus="props">
                    <div m="4">
                        <p m="t-0 b-2">订单编号: {{ props.row.orderNumber }}</p>
                        <p m="t-0 b-2">
                            支付方式:
                            <span v-if="props.row.way === 222">微信刷脸支付</span>
                            <span v-if="props.row.way === 0">微信支付</span>
                        </p>
                        <p m="t-0 b-2">支付单号: {{ props.row.order }}</p>
                        <p m="t-0 b-2">
                            订单状态:
                            <span v-if="props.row.state === 111">部分退款</span>
                            <span v-if="props.row.state === 222">全额退款</span>
                            <span v-if="props.row.state === 333">已支付</span>
                        </p>
                    </div>
                </template>
                <template #workType="props">
                    <div m="4">
                        <p m="t-0 b-2">下单时间: {{ props.row.orderTime }}</p>
                        <p m="t-0 b-2">支付时间: {{ props.row.paytime }}</p>
                    </div>
                </template>
                <template #custAppealType="props">
                    <div m="5">
                        <p m="t-0 b-2">订单总原价: {{ props.row.serial }}</p>
                        <p m="t-0 b-2">优惠总金额: {{ props.row.way }}</p>
                        <p m="t-0 b-2">退款总金额: {{ props.row.order }}</p>
                        <p m="t-0 b-2">补款总金额: {{ props.row.state }}</p>
                        <p m="t-0 b-2">运费: {{ props.row.state }}</p>
                        <p m="t-0 b-2">订单总支付价: {{ props.row.state }}</p>
                    </div>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row.id)"> 查看 </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { refundList } from '@/api/refund/index'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'workStatus', label: '订单信息', minWidth: 100, slot: true }, //
    { align: 'center', tooltip: true, prop: 'workType', label: '订单时间', minWidth: 100, slot: true }, //
    { align: 'center', tooltip: true, prop: 'custAppealType', label: '订单价格', minWidth: 100, slot: true }, //
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 130, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        orderNumber: '', //
        workStatus: '', //
        workType: '', //
        mobile: '', //
        custAppealType: '' //
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
const toDetail = (orderNo) => {
    router.push({ name: 'order-detail', params: { orderNo } })
    // router.push({ name: 'index', params: { orderNo } })
}

// 列表数据
const getRefundList = async () => {
    const params = {
        ...dataState.dateTime,
        orderNumber: dataState.searchData.orderNumber || null,
        workStatus: dataState.searchData.workStatus || null,
        workType: dataState.searchData.workType || null,
        mobile: dataState.searchData.mobile || null,
        custAppealType: dataState.searchData.custAppealType || null,
        current: dataState.pageinfo.currentPage,
        size: dataState.pageinfo.pageSize,
        sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d'
    }
    const data = await refundList(params)
    tableData.value = data.records
    dataState.pageinfo.total = data.total
}

const init = () => {
    dataState.searchData.orderNumber = ''
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
const resetForm = (formEl) => {
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
.coupon-submit-box {
    .dialog-title {
        font-size: 20px;
        color: red;
        font-weight: 700;
    }
    .header-title {
        font-size: 20px;
        color: red;
        height: 50px;
        font-weight: 700;
        align-items: center;
    }
}
</style>
