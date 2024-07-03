<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" label-position="right" :model="searchData" :inline="true" label-width="120px">
                <div>
                    <el-form-item label="业务线商户号" prop="entityUserId">
                        <el-input v-model="searchData.entityUserId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="业务订单号" prop="mainOrderNo">
                        <el-input v-model="searchData.mainOrderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="子订单号" prop="subOuterOrderNo">
                        <el-input v-model="searchData.subOuterOrderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item
                        label="结算时间"
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
                </div>
                <div class="search-input">
                    <el-form-item />
                    <el-form-item>
                        <el-button type="primary" @click="searchList">
                            查询
                        </el-button>
                        <el-button type="primary" @click="exportTable">
                            导出
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="merchantThead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #status="row">
                    {{statusKeyValue[row.row.status]}}
                </template>
                <template #subLedgerId="{row}">
                    {{row.subLedgerId === null ? '-' : row.subLedgerId}}
                </template>
                <template #type="row">
                    {{typeKeyValue[row.row.type]}}
                </template>
                <template #incomeAmount="scope">
                    {{(scope.row.incomeAmount/100).toFixed(2)}}元
                </template>
                <template #orderAmount="scope">
                    {{(scope.row.orderAmount/100).toFixed(2)}}元
                </template>
                <template #disctAmount="scope">
                    {{(scope.row.disctAmount/100).toFixed(2)}}元
                </template>
                <template #realPayAmount="scope">
                    {{(scope.row.realPayAmount/100).toFixed(2)}}元
                </template>
                <template #merchantDisctAmount="scope">
                    {{(scope.row.merchantDisctAmount/100).toFixed(2)}}元
                </template>
                <template #goodsRefundAmount="scope">
                    {{(scope.row.goodsRefundAmount/100).toFixed(2)}}元
                </template>
                <template #channelRefundfeeAmount="scope">
                    {{(scope.row.channelRefundfeeAmount/100).toFixed(2)}}元
                </template>
                <template #channelScAmount="scope">
                    {{(scope.row.channelScAmount/100).toFixed(2)}}元
                </template>
                <template #platformScAmount="scope">
                    {{(scope.row.platformScAmount/100).toFixed(2)}}元
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { merchantThead } from '../tHead'
import { localmerchantList, exportDetails } from '@/api/settlementManagement/index'

const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const channelKeyValue = ref({ 1: '微信直连' })
const statusKeyValue = ref({ 0: '未生效', 1: '生效中', 2: '已失效' })
const dataState = reactive({
    searchData: {
        entityUserId: '',
        mainOrderNo: '',
        subOuterOrderNo: '',
        thirdOrderNo: '',
        applyTime: ''
    },
    tableData: []
})
const { searchData, tableData } = toRefs(dataState)
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const searchList = () => {
    pageInfo.value.currentPage = 1
    getList()
}
const getList = async () => {
    const param = { ...searchData.value, page: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    const res = await localmerchantList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()

// 导出列表
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC65809624997687296',
        exportType: 7,
        body: {
            ...searchData.value
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
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
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
    justify-content:space-between;
    .el-input{
        width:220px;
    }
    .el-select{
        width:220px;
    }
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
