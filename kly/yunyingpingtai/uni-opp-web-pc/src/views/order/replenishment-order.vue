<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="订单编号" prop="orderNumber">
                    <el-input v-model="searchData.orderNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="补款订单编号" prop="workNumber">
                    <el-input v-model="searchData.workNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="补款订单状态" prop="workStatus">
                    <el-select v-model="searchData.workStatus" clearable placeholder="请选择">
                        <el-option label="全部" value="" />
                        <el-option label="待处理" value="0" />
                        <el-option label="已完成" value="1" />
                        <el-option label="已取消" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="工单编号" prop="mobile">
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
                @current-change="currentChange"
            >
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
    { align: 'center', tooltip: true, prop: 'orderNumber', label: '订单单号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '商户订单编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '补款订单单号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '工单单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workEndTime', label: '补款订单状态', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '补款金额', minWidth: 100, slot: true }
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
const toDetail = (orderNo) => {
    router.push({ name: 'work-order-detail', params: { orderNo } })
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
        sign: '1eea6fa8-8236-4d06-bf33-7414bb02172d'
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

const tableData1 = [
    {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    },
    {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
    }
]
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
