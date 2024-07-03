<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-card>
                <el-form ref="formRef" :rules="rules" :model="searchData" :inline="true" label-width="130px" label-position="right">
                    <el-form-item label="业务订单id" prop="tradeNo">
                        <el-input v-model="searchData.tradeNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="支付流水号" prop="outPayNo">
                        <el-input v-model="searchData.outPayNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="微信分单号" prop="thirdPayNo">
                        <el-input v-model="searchData.thirdPayNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="微信分状态" prop="wxPayStatus">
                        <el-select v-model="searchData.wxPayStatus" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in wxPayStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="平台商户号" prop="merchantId">
                        <el-input v-model="searchData.merchantId" clearable placeholder="请输入～" />
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
                    <el-form-item label="用户手机号" prop="phone">
                        <el-input v-model="searchData.phone" clearable placeholder="请输入～" />
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
                    <div class="search-button">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button style="margin-left: 30px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </div>

                </el-form>
            </el-card>
        </div>
        <div class="main">
            <div class="remind">
                <span>待创建({{statistics.waitCreatedNum?statistics.waitCreatedNum:''}})</span>
                <span>已创建({{statistics.createdNum?statistics.createdNum:''}})</span>
                <span>进行中({{statistics.doingNum?statistics.doingNum:''}})</span>
                <span>已取消({{statistics.cancleNum?statistics.cancleNum:''}})</span>
                <span>待扣款({{statistics.doneNum?statistics.doneNum:''}})</span>
                <span>已完结({{statistics.finishNum?statistics.finishNum:''}})</span>
            </div>
            <el-button type="primary" class="download" @click="exportTable">下载</el-button>
        </div>
        <div class="tableList-area">
            <el-card>
                <system-list
                    :tHead="wechatThead"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #wxPayStatus="row">
                        {{wxPayStatusKeyValue[row.row.wxPayStatus]}}
                    </template>
                    <template #payActAmount="scope">
                        {{(scope.row.payActAmount*0.01).toFixed(2)}}元
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
import { wechatRecordList, wechatRecordStatistics, exportDetails } from '../../../api/paymentManagement/index'
import { wechatThead } from '../tHead'

const businessCodeKeyValue = ref({ A1001001: '到店付', A1001002: '智能货柜', A1001003: '话费充值', A1002001: '货柜租赁', A1002002: '货柜分期' })
const subProductCodeKeyValue = ref({ A1001001001: '预制菜', A1001002001: '美智货柜', A1001002002: '微米货柜', A1002002002: '易融货柜', A1002001001: '租赁首金', A1002002001: '分期首金' })
const payTypeCodeKeyValue = ref({ 6: '免密支付', 8: '收付通免密支付', 10: '小程序免密支付' })
const payStatusKeyValue = ref({ 0: '待创建', 1: '已创建', 2: '进行中', 3: '已取消', 4: '已完结' })
const wxPayStatusKeyValue = ref({ TODO: '待创建', CREATED: '商户已创建服务订单', DOING: '服务订单进行中', USER_PAID: '服务订单完成', DONE: '待扣款', REVOKED: '商户取消服务订单' })
const channelIdKeyValue = ref({ 1: '微信', 2: '支付宝' })
const dataState = reactive({
    searchData: {
        tradeNo: '', // 业务订单号
        thirdPayNo: '', // 微信分单号
        outPayNo: '', // 支付流水号
        wxPayStatus: '', // 微信分状态
        merchantId: '', // 平台商户号
        payTypeCode: '', // 支付方式
        channelId: '', // 支付渠道
        businessCode: '', // 业务线
        subProductCode: '', // 场景编码
        phone: ''// 手机号
    },
    tableData: []
})
const { searchData, tableData } = toRefs(dataState)
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const rules = reactive({
    merchantId: [
        { required: true, message: '请填写商户号~', trigger: 'change' }
    ],
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
const statistics = ref({})
const getList = async (reset) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = { ...searchData.value, currentPage: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    const res = await wechatRecordList(param)
    const { data } = await wechatRecordStatistics(param)
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
        configCode: 'UC32104691638378496',
        name: '微信分记录查询接口',
        source: '支付中台',
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
    width: 230px;
}
.el-select {
    width: 230px;
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
