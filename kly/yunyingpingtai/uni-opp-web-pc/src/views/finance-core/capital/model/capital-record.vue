<template>
    <div class="work-order-container">
        <el-card shadow="always">
            <h1 class="title">手续费账户提现记录</h1>
        </el-card>
        <el-card shadow="always" style="margin-top: 20px">
            <system-list
                :tHead="record"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #withdrawalType="row">
                    {{withdrawalTypeKeyValue[row.row.withdrawalType]}}
                </template>
                <template #transAmount="scope">
                    {{(scope.row.transAmount / 100).toFixed(2)}}元
                </template>
                <template #actualAmount="scope">
                    {{(scope.row.actualAmount / 100).toFixed(2)}}
                </template>
                <template #status="row">
                    {{statusKeyValue[row.row.status]}}
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { record } from '../index'
// import { getRecord } from '../../../api/capital'
import { publicRequest } from '@/api/common/index.js'
import { useRoute } from 'vue-router'
const route = useRoute()
const statusKeyValue = ref({ 0: '处理中', 1: '提现成功', 2: '提现失败', 3: '处理中', 4: '处理中', 5: '待处理', 6: '待审核', 7: '审核失败', 8: '审核通过' })
const withdrawalTypeKeyValue = ref({ 1: '手动提现', 2: '线下打款' })
const tableData = ref([])
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const getList = async () => {
    const param = { subAcctId: route.params.id, page: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    const res = await publicRequest({ key: 'FINANCE_CORE_CAPITAL_RECORD_LIST', body: param })
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
    console.log(res.data.list, 'list')
}
getList()
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
