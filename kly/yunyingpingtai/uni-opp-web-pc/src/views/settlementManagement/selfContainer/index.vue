<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form
                ref="formRef"
                :model="searchData"
                :inline="true"
                label-width="120px"
                label-position="right"
            >
                <el-form-item label="设备编号" prop="deviceNo">
                    <el-input
                        v-model="searchData.deviceNo"
                        clearable
                        placeholder="请输入～"
                    />
                </el-form-item>
                <el-form-item label="业务订单号" prop="orderNo">
                    <el-input
                        v-model="searchData.orderNo"
                        clearable
                        placeholder="请输入～"
                    />
                </el-form-item>
                <el-form-item label="结算时间" prop="settlementTime">
                    <el-date-picker
                        v-model="searchData.settlementTime"
                        type="datetimerange"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        range-separator="~"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                    />
                </el-form-item>
                <el-form-item label="商户号" prop="merchantNo">
                    <el-input
                        v-model="searchData.merchantNo"
                        clearable
                        placeholder="请输入～"
                    />
                </el-form-item>
                <el-form-item label="子订单号" prop="subOrderNo">
                    <el-input
                        v-model="searchData.subOrderNo"
                        clearable
                        placeholder="请输入～"
                    />
                </el-form-item>
                <el-form-item label="运营模式" prop="operationMode">
                    <el-select v-model="searchData.operationMode" clearable placeholder="请选择" >
                        <el-option v-for="(item, key) in operationModeValue" :key="item" :label="item" :value="key + 1"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="getList(true)">查询</el-button>
                    <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                    <el-button v-if="dataState.tableData.length==0" @click="open" type="primary" style="margin: 20px">导出</el-button>
                    <el-button type="primary" v-else @click="exportOrder">导出</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="settlementOrderThead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #settlementAmount="scope">
                    {{(scope.row.settlementAmount/100).toFixed(2)}}元
                </template>
                <template #orderAmount="scope">
                    {{(scope.row.orderAmount/100).toFixed(2)}}元
                </template>
                <template #algorithmFeeAmount="scope">
                    {{(scope.row.algorithmFeeAmount/100).toFixed(2)}}元
                </template>
                <template #platSubsidy="scope">
                    {{(scope.row.platSubsidy/100).toFixed(2)}}元
                </template>
                <template #realPay="scope">
                    {{(scope.row.realPay/100).toFixed(2)}}元
                </template>
                <template #merchantDisctAmount="scope">
                    {{(scope.row.merchantDisctAmount/100).toFixed(2)}}元
                </template>
                <template #refundAmount="scope">
                    {{(scope.row.refundAmount/100).toFixed(2)}}元
                </template>
                <template #disctRefundAmount="scope">
                    {{(scope.row.disctRefundAmount/100).toFixed(2)}}元
                </template>
                <template #wechatServiceFee="scope">
                    {{(scope.row.wechatServiceFee/100).toFixed(2)}}元
                </template>
                <template #subLedgerDisctAmount="scope">
                    {{(scope.row.subLedgerDisctAmount/100).toFixed(2)}}元
                </template>
                <template #platServiceFee="scope">
                    {{(scope.row.platServiceFee/100).toFixed(2)}}元
                </template>
                <template #operationMode="scope">
                    {{scope.row.operationMode === 1 ? '柜主自营' : '代运营' }}
                </template>
                <template #businessType="row">
                    {{businessTypeKeyValue[row.row.businessType]}}
                </template>
                <template #refundNode="row">
                    {{refundNodeKeyValue[row.row.refundNode]}}
                </template>
                <template #subLedgerAmount="scope">
                    <el-button v-if="scope.row.refundNode === 2" type="primary" link>{{(scope.row.subLedgerAmount/100).toFixed(2)}}元</el-button>
                    <el-button v-else @click="adopt(scope.row.orderNo)" type="primary" link>{{(scope.row.subLedgerAmount/100).toFixed(2)}}元</el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogTableVisible" title="分账详情">
            <system-list
                :tHead="gridDataThead"
                :tableData="gridData"
                :isPage='false'
            >
                <template #type="row">
                    {{typeKeyValue[row.row.type]}}
                </template>
                <template #amount="row">
                    {{((row.row.amount/100).toFixed(2))}}
                </template>
                <template #rate="scope">
                    {{scope.row.rate === null ? '' : scope.row.rate + '%'}}
                </template>
            </system-list>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import { settlementOrderThead, gridDataThead } from '../tHead'
import { getOrderList, getDetail, exportDetails } from '../../../api/settlementManagement/index'
const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const operationModeValue = ['柜主自营', '代运营']
const dataState = reactive({
    searchData: {
        deviceNo: '',
        merchantNo: '',
        operationMode: '',
        settlementAccount: '',
        settlementTime: '',
        orderNo: '',
        subOrderNo: '',
        sourceType: 11,
        merchantModel: 1
    },
    tableData: [],
    gridData: null
})
const { searchData, tableData, gridData } = toRefs(dataState)
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const open = () => {
    ElMessage({
        showClose: true,
        message: '导出列表不能为空',
        type: 'warning'
    })
}
const getList = async () => {
    const param = {
        ...searchData.value,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    if (param.settlementTime) {
        param.startTime = param.settlementTime[0] || ''
        param.endTime = param.settlementTime[1] || ''
    } else {
        param.startTime = param.startTime ? param.startTime : ''
        param.endTime = param.endTime ? param.endTime : ''
    }
    delete param.settlementTime
    const res = await getOrderList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
getList()
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
// 导出
const exportOrder = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC14729272394489856',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
    if (params.body.settlementTime) {
        params.body.startTime = params.body.settlementTime[0] || ''
        params.body.endTime = params.body.settlementTime[1] || ''
    } else {
        params.body.startTime = params.body.startTime ? params.body.startTime : ''
        params.body.endTime = params.body.endTime ? params.body.endTime : ''
    }
    delete params.body.settlementTime
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
const dialogTableVisible = ref(false)
const adopt = async (val) => {
    dialogTableVisible.value = true
    const param = {
        orderNo: val
    }
    const res = await getDetail(param)
    if (res.code === '200') {
        gridData.value = res.data
    }
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
.search-input {
  display: flex;
  .el-input {
    width: 240px;
  }
  .el-select {
    width: 240px;
  }
}
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
