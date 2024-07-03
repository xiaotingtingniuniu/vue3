<template>
    <div class="work-order-container">
        <el-card shadow="always">
            <h1 class="title">账户动账明细</h1>
            <div class="search-area">
                <el-form
                    ref="formRef"
                    :model="searchData"
                    :inline="true"
                    label-position="right"
                    label-width="100px"
                >
                    <div class="search-input">
                        <el-form-item
                            label="动账时间"
                            prop="applyTime"
                            class="form-item-time"
                        >
                            <el-date-picker
                                size="default"
                                v-model="searchData.applyTime"
                                type="datetimerange"
                                value-format="YYYY-MM-DD HH:mm:ss"
                                range-separator="~"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                            />
                        </el-form-item>
                        <el-form-item label="关联订单号" prop="transSubOrderNo">
                            <el-input
                                v-model="searchData.transSubOrderNo"
                                clearable
                                placeholder="请输入～"
                            />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="getList()">
                                查询
                            </el-button>
                            <el-button style="margin-left: 50px" @click="resetForm(formRef)">
                                重置
                            </el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
        </el-card>
        <el-button type="primary" style="margin-top: 20px" @click="exportList()">
            导出明细
        </el-button>
        <el-card shadow="always" style="margin-top: 20px">
            <system-list
                :tHead="detail"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #transAmount="scope">
                    {{scope.row.recordDirectionDesc}}：{{(scope.row.transAmount*0.01).toFixed(2)}}
                </template>
                <template #frozenAmount="scope">
                    {{(scope.row.frozenAmount / 100).toFixed(2)}}
                </template>
                <template #resultAmount="scope">
                    {{(scope.row.resultAmount*0.01).toFixed(2)}}
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { detail } from '../index'
import { publicRequest, publicExport } from '@/api/common/index.js'
// import { getDetailInfo, exportDetails } from '../../../api/capital'
import { useRoute } from 'vue-router'
const route = useRoute()
const dataState = reactive({
    searchData: {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        subAcctId: route.params.id,
        transSubOrderNo: '',
        applyTime: ''
    },
    tableData: []
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const { searchData, tableData } = toRefs(dataState)
const getList = async () => {
    const params = { ...searchData.value, page: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    if (params.applyTime) {
        params.startDate = params.applyTime[0] || ''
        params.endDate = params.applyTime[1] || ''
    } else {
        params.startDate = params.startDate ? params.startDate : ''
        params.endDate = params.endDate ? params.endDate : ''
    }
    delete params.applyTime
    // const res = await getDetailInfo(param)
    // if (res.code === '200') {
    //     dataState.tableData = res.data.list
    //     pageInfo.value.total = res.data.totalCount
    // }
    // 获取列表
    const res = await publicRequest({ key: 'FINANCE_CORE_CAPITAL_DETAIL_LIST', body: params })
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
    console.log(res.data.list, 'list')
}
getList()
const exportList = async () => {
    const params = { ...searchData.value, page: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    if (params.applyTime) {
        params.startDate = params.applyTime[0] || ''
        params.endDate = params.applyTime[1] || ''
    } else {
        params.startDate = params.startDate ? params.startDate : ''
        params.endDate = params.endDate ? params.endDate : ''
    }
    delete params.applyTime
    publicExport({ key: 'FINANCE_CORE_CAPITAL_DETAIL_LIST', body: params })
}
// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
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
.title{
    margin:30px 0;
}
.search-input {
  display: flex;
  justify-content: space-between;
  .el-input {
    width: 260px;
  }
  .el-select {
    width: 260px;
  }
}
</style>
