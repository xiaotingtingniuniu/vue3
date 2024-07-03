<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-card>
                <el-form ref="formRef" :model="searchData" :inline="true" label-width="150px" label-position="right">
                    <el-form-item label="业务订单id" prop="tradeNo">
                        <el-input v-model="searchData.tradeNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="支付流水号" prop="thirdOrderNo">
                        <el-input v-model="searchData.thirdOrderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="业务退款单号" prop="tradeRefundNo">
                        <el-input v-model="searchData.tradeRefundNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="商户号" prop="merchantId">
                        <el-input v-model="searchData.merchantId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="退款状态" prop="refundStatus">
                        <el-select v-model="searchData.refundStatus" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in refundStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="退款完成时间" prop="refundTime" class="form-item-time">
                        <el-date-picker
                            v-model="searchData.refundTime"
                            size="default"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button style="margin-left: 30px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="main">
            <div class="remind">
                <span>总笔数({{statistics.totalNum?statistics.totalNum:''}})</span>
                <strong>待退款({{statistics.waitRefundNum?statistics.waitRefundNum:''}})</strong>
                <span>已退款({{statistics.refundSuccessNum?statistics.refundSuccessNum:''}})</span>
                <span>退款中({{statistics.refundingNum?statistics.refundingNum:''}})</span>
                <span>退款失败({{statistics.refundfailNum?statistics.refundfailNum:''}})</span>
            </div>
            <el-button type="primary" class="download" @click="exportTable">下载</el-button>
        </div>
        <div class="tableList-area">
            <el-card>
                <system-list
                    :tHead="refundThead"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #refundAmount="scope">
                        {{(scope.row.refundAmount*0.01).toFixed(2)}}元
                    </template>
                </system-list>
            </el-card>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import { refundRecordList, refundRecordStatistics, exportDetails } from '../../../api/paymentManagement/index'
import { refundThead } from '../tHead'
const payChannelCodeKeyValue = ref({ 1: '微信', 2: '支付宝' })
const refundStatusKeyValue = ref({ 5: '待退款', 6: '退款中', 7: '已退款', 8: '退款失败' })
const businessCodeKeyValue = ref({ A1001001: '到店付', A1001002: '智能货柜', A1001003: '话费充值', A1001004: '门店', A1002001: '货柜租赁', A1002002: '货柜分期' })
const dataState = reactive({
    searchData: {
        tradeRefundNo: '',
        thirdOrderNo: '',
        refundStatus: '',
        merchantId: '',
        refundNo: '',
        refundTime: ''
    },
    tableData: []
})
const { searchData, tableData } = toRefs(dataState)
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const statistics = ref({})
const getList = async (reset) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = { ...searchData.value, currentPage: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    if (param.refundTime) {
        param.beginTime = param.refundTime[0] || ''
        param.endTime = param.refundTime[1] || ''
    } else {
        param.beginTime = param.beginTime ? param.beginTime : ''
        param.endTime = param.endTime ? param.endTime : ''
    }
    delete param.refundTime
    const res = await refundRecordList(param)
    const { data } = await refundRecordStatistics(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        statistics.value = data
        pageInfo.value.total = res.data.totalCount
    }
}
getList()
// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    getList(true)
}
const exportTable = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC32104120000880640',
        name: '退款记录查询接口',
        source: '支付中台',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
    if (params.body.refundTime) {
        params.body.beginTime = params.body.refundTime[0] || ''
        params.body.endTime = params.body.refundTime[1] || ''
    } else {
        params.body.beginTime = params.body.beginTime ? params.body.beginTime : ''
        params.body.endTime = params.body.endTime ? params.body.endTime : ''
    }
    delete params.body.refundTime
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
.el-input {
    width: 220px;
}
.el-select {
    width: 220px;
}
.search-button{
    display: flex;
    justify-content:flex-end;
}
.main{
    width:100%;
    height:8vh;
    display: flex;
    align-items:center;
    .remind{
        font-size:18px;
        font-weight:500;
        margin-left:15px;
        span{
            margin-left:10px;
        }
        strong{
            margin-left:10px;
        }
    }
    .download{
        margin-left:auto;
        margin-right:20px;
    }
}
.el-button--primary {
    --el-button-bg-color: #fe2c55;
    --el-button-hover-bg-color: #fe2c55;
}
.el-button--primary:hover {
    --el-button-hover-bg-color: #ee6b85;
}
</style>
