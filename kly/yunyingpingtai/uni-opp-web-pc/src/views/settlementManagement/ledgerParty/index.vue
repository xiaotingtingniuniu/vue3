<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" label-position="right" :model="searchData" :inline="true" label-width="120px">
                <div>
                    <el-form-item label="柜主ID" prop="entityUserId">
                        <el-input v-model="searchData.entityUserId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="柜主手机号" prop="entityUserMobile">
                        <el-input v-model="searchData.entityUserMobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账接收方类型" prop="type">
                        <el-select v-model="searchData.type" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in typeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="渠道" prop="channel">
                        <el-select v-model="searchData.channel" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in channelKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分账方手机号" prop="mobile">
                        <el-input v-model="searchData.mobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方商户号" prop="accountId">
                        <el-input v-model="searchData.accountId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方/企业名称" prop="name">
                        <el-input v-model="searchData.name" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in statusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
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
                :tHead="ledgerPartyThead"
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
                <template #operate="row">
                    <el-switch v-model="row.row.wechatLimit" @change="changeWechatLimit($event, row.row.subLedgerId)" v-if="row.row.channelDesc === '微信直连'"/>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ledgerPartyThead } from '../tHead'
import { getSubLedgerList, exportDetails, handleWechatLimit } from '../../../api/settlementManagement/index'
import { ElMessage } from 'element-plus'

const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const channelKeyValue = ref({ 1: '微信直连' })
const statusKeyValue = ref({ 0: '未生效', 1: '生效中', 2: '已失效' })
const dataState = reactive({
    searchData: {
        entityUserId: '',
        entityUserMobile: '',
        type: '',
        channel: '',
        mobile: '',
        accountId: '',
        name: '',
        status: ''
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
    const res = await getSubLedgerList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        tableData.value.map(item => {
            if (item.showStatus === 1) {
                item.wechatLimit = true
            } else {
                item.wechatLimit = false
            }
        })
        pageInfo.value.total = res.data.total
    }
}
getList()

// 导出列表
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC31785309821222912',
        name: '分账人导出',
        source: '结算中台',
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
// 操作微信收款功能
const changeWechatLimit = async (value, subLedgerId) => {
    console.log(value)
    const param = {
        channelz: 1,
        operationType: 1,
        subLedgerId
    }
    const res = await handleWechatLimit(param)
    console.log(res)
    if (res.code === '200') {
        ElMessage.success(res.message)
    } else {
        getList()
    }
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
