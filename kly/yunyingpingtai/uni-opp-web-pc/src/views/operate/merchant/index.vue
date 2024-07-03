
<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户名称" prop="orderNumber">
                    <el-input v-model="searchData.orderNumber" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="用户手机号" prop="mobile">
                    <el-input v-model="searchData.mobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" prop="businessCode">
                    <el-select v-model="searchData.businessCode" clearable placeholder="请选择">
                        <el-option label="恒生活" value="A1001" />
                        <el-option label="小恒数科" value="A1002" />
                        <el-option label="汇财" value="A1003" />
                        <el-option label="保险" value="A1004" />
                    </el-select>
                </el-form-item>
                <el-form-item label="子系统" prop="subCode">
                    <el-select v-model="searchData.subCode" clearable placeholder="请选择">
                        <el-option label="恒生活App" value="A1001001" />
                        <el-option label="智能货柜" value="A1001002" />
                        <el-option label="恒生活众包" value="A1001003" />
                        <el-option label="恒掌柜" value="A1001004" />
                        <el-option label="供应链" value="A1001005" />
                        <el-option label="交付" value="A1001006" />
                    </el-select>
                </el-form-item>

                <el-form-item class="button-box">
                    <el-button type="primary" @click="addMerchant('add')">
                        新增
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

                </template>
                <template #dealResult="scope">
                    <span v-if="scope.row.dealResult === 2">有退款</span>
                    <span v-if="scope.row.dealResult === 3">用户取消退款</span>
                    <span v-if="scope.row.dealResult === 0">待处理</span>
                    <span v-if="scope.row.dealResult === 1">拒绝退款</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row.id)">
                        查看详情
                    </el-button>
                    <el-button type="primary" @click="toDetail(scope.row.id)">
                        查看合同
                    </el-button>
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
    { align: 'center', tooltip: true, prop: 'orderNumber', label: '商户名称', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'workNumber', label: '业务线及角色', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '商户类型', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gtmCreator', label: '入驻来源', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workEndTime', label: '联系方式', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'workStatus', label: '邮箱', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'workType', label: '审核状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'custAppealType', label: '签约状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'dealName', label: '创建人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'dealResult', label: '创建时间', minWidth: 120, slot: true },
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
// 新增
const addMerchant = (handleType) => {
    router.push({ name: 'settle-in-means', params: { handleType } })
}
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
