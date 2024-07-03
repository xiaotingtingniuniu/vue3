<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" label-position="right" :model="searchData" :inline="true" label-width="140px">
                <div class="search-input">
                    <el-form-item label="进件申请编号" prop="requestNo">
                        <el-input v-model="searchData.requestNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="searchData.mobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="商家简称" prop="merchantShortName">
                        <el-input v-model="searchData.merchantShortName" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="进件类型">
                        <el-select v-model="typeKeyValue" disabled clearable placeholder="请选择" >
                            <el-option label="收付通" value="0" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="状态" prop="contractStatus">
                        <el-select v-model="searchData.contractStatus" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in contractStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="primary" @click="searchList">
                            查询
                        </el-button>
                        <el-button style="margin-left:20px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="pieceThead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #corporateType="row">
                    {{corporateTypeKeyValue[row.row.corporateType]}}
                </template>
                <template #settlementWay="row">
                    {{settlementWayKeyValue[row.row.settlementWay]}}
                </template>
                <template #payChannelCode="row">
                    {{payChannelCodeKeyValue[row.row.payChannelCode]}}
                </template>
                <template #contractStatus="row">
                    {{contractStatusKeyValue[row.row.contractStatus]}}
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { pieceThead } from '../tHead'
import { getIncomingList } from '../../../api/paymentManagement/index'
const corporateTypeKeyValue = ref({ 1: '企业', 2: '自然人', 3: '个人工商户', 4: '事业单位' })
const contractStatusKeyValue = ref({ 1: '初始化', 2: '审核中', 3: '签约成功', 4: '签约失败', 5: '待签约' })
const typeKeyValue = ref({ 0: '收付通' })
const settlementWayKeyValue = ref({ 0: '对私银行卡', 1: '对公银行卡' })
const payChannelCodeKeyValue = ref({ 1: '微信', 2: '支付宝' })
const dataState = reactive({
    searchData: {
        requestNo: '',
        mobile: '',
        merchantShortName: '',
        contractStatus: '',
        storeName: ''
    },
    tableData: []
})

const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const { searchData, tableData } = toRefs(dataState)

const searchList = () => {
    pageInfo.value.currentPage = 1
    getList()
}

const getList = async () => {
    const param = {
        ...searchData.value,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await getIncomingList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
// 每页几条数据改变触发
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getList()
}
// 下一页上一页触发
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getList()
}
</script>
<style lang="scss" scoped>
.search-input{
    display:flex;
    justify-content: space-between;
    .el-input{
        width:250px;
    }
    .el-select{
        width:250px;
    }
}
.tableList-area{
    margin-top:20px;
}
.button-box{
    display:flex;
    flex-direction:row-reverse;
}
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
