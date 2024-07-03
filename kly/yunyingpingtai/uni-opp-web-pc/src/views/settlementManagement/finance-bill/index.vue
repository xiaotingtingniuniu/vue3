<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="业务订单号" prop="orderNo">
                        <el-input v-model="searchData.orderNo" placeholder="请输入业务订单号" clearable />
                    </el-form-item>
                    <el-form-item label="子订单号" prop="subOrderNo">
                        <el-input v-model="searchData.subOrderNo" placeholder="请输入子订单号" clearable />
                    </el-form-item>
                    <el-form-item label="结算时间" prop="time">
                        <el-date-picker size="default" v-model="searchData.time" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="商户号" prop="merchantNo">
                        <el-input v-model="searchData.merchantNo" placeholder="请输入商户号" clearable />
                    </el-form-item>
                    <!-- <el-form-item label="运营模式" prop="operationMode">
                        <el-select v-model="searchData.operationMode" clearable placeholder="请选择">
                            <el-option label="柜主自营" :value="1" />
                            <el-option label="代运营" :value="2" />
                        </el-select>
                    </el-form-item> -->
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="onExport">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #settlementAmount="scope">
                        {{((scope.row.settlementAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #orderAmount="scope">
                        {{((scope.row.orderAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #platSubsidy="scope">
                        {{((scope.row.platSubsidy || 0) / 100).toFixed(2)}}
                    </template>
                    <template #realPay="scope">
                        {{((scope.row.realPay || 0) / 100).toFixed(2)}}
                    </template>
                    <template #merchantDisctAmount="scope">
                        {{((scope.row.merchantDisctAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #refundAmount="scope">
                        {{((scope.row.refundAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #wechatServiceFee="scope">
                        {{((scope.row.wechatServiceFee || 0) / 100).toFixed(2)}}
                    </template>
                    <template #disctRefundAmount="scope">
                        {{((scope.row.disctRefundAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #platServiceFee="scope">
                        {{((scope.row.platServiceFee || 0) / 100).toFixed(2)}}
                    </template>
                    <template #algorithmFeeAmount="scope">
                        {{((scope.row.algorithmFeeAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #subLedgerAmount="scope">
                        {{((scope.row.subLedgerAmount || 0) / 100).toFixed(2)}}
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs, watch, computed } from 'vue'
import { publicRequest, publicExport } from '@/api/common/index.js'
import { tHead } from './index'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
console.log(store)
const userInfo = computed(() => store.state.userInfo)
const result = reactive({
    dialogVisible: false
})
const formRef1 = ref()
const searchData = ref({
    orderNo: '', // 业务订单编号
    subOrderNo: '', // 子订单号
    merchantNo: '', // 商户号
    // operationMode: '', // 运营模式
    time: [] // 时间

})
const auditForm = ref({
    reason: ''
})
const tableData = ref([])
const selectionData = ref([])
const auditList = ref([])

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async () => {
    selectionData.value = []
    const params = {
        ...searchData.value,
        ...pageInfo.value,
        sourceType: 2,
        startTime: searchData.value.time.length ? searchData.value.time[0] : '', // 申请时间
        endTime: searchData.value.time.length ? searchData.value.time[1] : '' // 申请时间
    }
    delete params.time
    delete params.total
    const res = await publicRequest({ key: 'SETTLEMENT_MANAGEMENT_FINANCE_BILL_LIST', body: params })
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
    console.log(res.data.list, 'list')
}

// // 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}

const onExport = async () => {
    const params = {
        ...searchData.value,
        ...pageInfo.value,
        sourceType: 2,
        startTime: searchData.value.time.length ? searchData.value.time[0] : '', // 申请时间
        endTime: searchData.value.time.length ? searchData.value.time[1] : '' // 申请时间
    }
    delete params.time
    delete params.total
    publicExport({ key: 'SETTLEMENT_MANAGEMENT_FINANCE_BILL_LIST', body: params })
}

</script>
<style lang="scss" scoped>

</style>
