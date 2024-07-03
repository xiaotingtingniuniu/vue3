<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-card>
                <el-form ref="formRef" :rules="rules" :model="searchData" :inline="true" label-width="100px" label-position="right">
                    <el-form-item label="业务订单id" prop="tradeNo">
                        <el-input v-model="searchData.tradeNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="支付流水号" prop="thirdOrderNo">
                        <el-input v-model="searchData.thirdOrderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="状态" prop="payStatus">
                        <el-select v-model="searchData.payStatus" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in payStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务线" prop="businessCode">
                        <el-select v-model="searchData.businessCode" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in businessCodeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付场景" prop="subProductCode">
                        <el-select v-model="searchData.subProductCode" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in subProductCodeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付渠道" prop="channelId">
                        <el-select v-model="searchData.channelId" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in channelIdKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付方式" prop="payTypeCode">
                        <el-select v-model="searchData.payTypeCode" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in payTypeCodeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="支付完成时间" prop="payTime" class="form-item-time">
                        <el-date-picker
                            size="default"
                            v-model="searchData.payTime"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-left:80px" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button style="margin-left:20px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <div class="tableList-area">
            <el-card>
                <system-list
                    :tHead="paymentThead"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #productCode="row">
                        {{productCodeKeyValue[row.row.productCode]}}
                    </template>
                    <template #totalAmount="scope">
                        {{(scope.row.totalAmount*0.01).toFixed(2)}}元
                    </template>
                    <template #orderAmount="scope">
                        {{(scope.row.orderAmount*0.01).toFixed(2)}}元
                    </template>
                    <template #payAmount="scope">
                        {{(scope.row.payAmount*0.01).toFixed(2)}}元
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
import { paymentRecordList, paymentRecordStatistics, exportDetails } from '../../../api/paymentManagement/index'
import { paymentThead } from '../tHead'
const payStatusKeyValue = ref({ 0: '待支付', 1: '支付中', 2: '支付成功' })
const productCodeKeyValue = ref({ A1001: '恒生活', A1002: '恒掌柜' })
const businessCodeKeyValue = ref({ A1001001: '到店付', A1001002: '智能货柜', A1001003: '话费充值', A1002001: '货柜租赁', A1002002: '货柜分期' })
const subProductCodeKeyValue = ref({ A1001001001: '预制菜', A1001002001: '美智货柜', A1001002002: '微米货柜', A1001002003: '易触货柜', A1002001001: '租赁首金', A1002002001: '分期首金' })
const channelIdKeyValue = ref({ 1: '微信', 2: '支付宝' })
const payTypeCodeKeyValue = ref({ 1: 'H5支付', 9: '小程序支付', 111: '老H5支付' })
const dataState = reactive({
    searchData: {
        tradeNo: '',
        thirdOrderNo: '',
        payStatus: '',
        businessCode: '',
        subProductCode: '',
        payTypeCode: '',
        channelId: '',
        payTime: ''
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
const rules = reactive({
    channelId: [
        { required: true, message: '请选择支付渠道~', trigger: 'change' }
    ],
    payTypeCode: [
        { required: true, message: '请选择支付方式~', trigger: 'change' }
    ],
    businessCode: [
        { required: true, message: '请选择业务线~', trigger: 'change' }
    ],
    subProductCode: [
        { required: true, message: '请选择支付场景~', trigger: 'change' }
    ]
})
const getList = async (reset, formEl) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = { ...searchData.value, currentPage: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    if (param.payTime) {
        param.beginTime = param.payTime[0] || ''
        param.endTime = param.payTime[1] || ''
    } else {
        param.beginTime = param.beginTime ? param.beginTime : ''
        param.endTime = param.endTime ? param.endTime : ''
    }
    delete param.payTime
    const res = await paymentRecordList(param)
    const { data } = await paymentRecordStatistics(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        statistics.value = data
        pageInfo.value.total = res.data.totalCount
    }
}
// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
    console.log('重置')
    if (!formEl) return
    formEl.resetFields()
    // getList(true)
    tableData.value = []
    statistics.value = {}
}
const exportTable = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC32103406516215808',
        name: '支付记录查询接口',
        source: '支付中台',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
    if (params.body.payTime) {
        params.body.beginTime = params.body.payTime[0] || ''
        params.body.endTime = params.body.payTime[1] || ''
    } else {
        params.body.beginTime = params.body.beginTime ? params.body.beginTime : ''
        params.body.endTime = params.body.endTime ? params.body.endTime : ''
    }
    delete params.body.payTime
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
    width: 180px;
  }
  .el-select {
    width: 180px;
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
