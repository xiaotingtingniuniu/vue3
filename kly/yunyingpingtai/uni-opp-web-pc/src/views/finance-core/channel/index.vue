<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="通道结算日期" prop="settlementDate">
                        <el-date-picker size="default" v-model="searchData.settlementDate" type="datetimerange" format="YYYY-MM-DD"  value-format="YYYY-MM-DD" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="收款账号" prop="companyAccount">
                        <el-select v-model="searchData.companyAccount" clearable placeholder="请选择">
                            <el-option label="恒丰" value="3048" />
                            <el-option label="钱包" value="0001" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <!-- <el-button v-if="!dataState.searchData.userId && !dataState.searchData.applyTime" type="primary" @click="open">导出</el-button> -->
                        <!-- <el-button type="primary" @click="exportTable">导出</el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list ref="tableRef" :tHead="channeltHead" :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange" @selection-change="tabelChange">
                    <template #transactionAmount="scope">
                        {{ ((scope.row.transactionAmount) / 100).toFixed(2)}}
                    </template>
                    <template #channelScAmount="scope">
                        {{ ((scope.row.channelScAmount) / 100).toFixed(2)}}
                    </template>
                    <template #actualAmount="scope">
                        {{ ((scope.row.actualAmount) / 100).toFixed(2)}}
                    </template>
                    <template #refundAmount="scope">
                        {{ ((scope.row.refundAmount) / 100).toFixed(2)}}
                    </template>
                    <template #channelRefundfeeAmount="scope">
                        {{ ((scope.row.channelRefundfeeAmount) / 100).toFixed(2)}}
                    </template>
                    <template #settledAmount="scope">
                        {{ ((scope.row.settledAmount) / 100).toFixed(2)}}
                    </template>
                    <template #operation="scope">
                        <el-button  class="edit-btn" @click="exportTable(scope.row)" type="primary">下载明细</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, ref, toRefs, computed } from 'vue'
import { exportDetails, passagewayexList } from '@/api/accountManagement/index.js'
import { channeltHead } from '../wholesaler-examine/index.js'
// import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
console.log(store)
const userInfo = computed(() => store.state.userInfo)
const searchData = ref({
    settlementDate: [],
    companyAccount: ''

})
const tableData = ref([])
const selectionData = ref([])
const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})

const tableRef = ref()

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async () => {
    selectionData.value = []
    const params = {
        ...searchData.value,
        ...pageInfo.value,
        startTime: searchData.value.settlementDate.length ? searchData.value.settlementDate[0] : '', // 申请时间
        endTime: searchData.value.settlementDate.length ? searchData.value.settlementDate[1] : '' // 申请时间
    }
    delete params.settlementDate
    delete params.total
    const res = await passagewayexList(params)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
    console.log(tableRef.value, 'tableRef')
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

const tabelChange = (val) => {
    console.log(val, 'tabelChange')
    selectionData.value = val
}
const exportTable = async (row) => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC60323382451740672',
        exportType: 7,
        body: {
            companyAccount: searchData.value.companyAccount,
            settlementDate: row.settlementDate
        }
    }
    const res = await exportDetails(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}
</script>
<style lang="scss" scoped>

</style>
