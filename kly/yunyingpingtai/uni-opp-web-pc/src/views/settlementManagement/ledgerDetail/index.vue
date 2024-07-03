<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form
                ref="formRef"
                :model="searchData"
                :inline="true"
                label-width="150px"
                label-position="right"
            >
                <div class="search-input">
                    <el-form-item label="柜主ID" prop="merchantNo">
                        <el-input v-model="searchData.merchantNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="收款方平台商户号" prop="collectionMerchantNo">
                        <el-input v-model="searchData.collectionMerchantNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="订单号" prop="orderNo">
                        <el-input v-model="searchData.orderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <!-- <el-form-item label="分账接收方类型" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in statusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item> -->
                </div>
                <div class="search-input">
                    <el-form-item label="结算时间" prop="ledgerTime">
                        <el-date-picker
                            v-model="searchData.ledgerTime"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item label="设备编码" prop="deviceNo">
                        <el-input v-model="searchData.deviceNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方名称" prop="subName">
                        <el-input v-model="searchData.subName" clearable placeholder="请输入～" />
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="子订单号" prop="subOrderNo">
                        <el-input v-model="searchData.subOrderNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账状态" prop="settleStatus">
                        <el-select v-model="searchData.settleStatus" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in deviceStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList"> 查询 </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button v-if="dataState.tableData.length==0" @click="open" type="primary" style="margin: 20px">导出</el-button>
                        <el-button type="primary" v-else @click="exportOrder">导出</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="ledgerDetailThead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #businessType="row">
                    {{businessTypeKeyValue[row.row.businessType]}}
                </template>
                <template #type="row">
                    {{typeKeyValue[row.row.type]}}
                </template>
                <template #channel="row">
                    {{channelKeyValue[row.row.channel]}}
                </template>
                <template #settlementRate="scope">
                    {{scope.row.settlementRate === null ? '' : scope.row.settlementRate + '%'}}
                </template>
                <template #period="scope">
                    D+{{scope.row.period}}
                </template>
                <template #orderAmount="scope">
                    {{(scope.row.orderAmount/100).toFixed(2)}}元
                </template>
                <template #settlementAmount="scope">
                    {{(scope.row.settlementAmount/100).toFixed(2)}}元
                </template>
                <template #disctAmount="scope">
                    {{(scope.row.disctAmount/100).toFixed(2)}}元
                </template>
                <template #status="row">
                    {{statusKeyValue[row.row.status]}}
                </template>
                <template #settlementStatus="row">
                    {{deviceStatusKeyValue[row.row.settlementStatus]}}
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import { ledgerDetailThead } from '../tHead'
import { ledgerDetailList, ledgerProportionList, ledgerDetailExport, exportDetails } from '../../../api/settlementManagement/index'
const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const businessTypeKeyValue = ref({ 1: '货柜' })
const channelKeyValue = ref({ 0: '微信', 1: '支付宝' })
const statusKeyValue = ref({ 0: '全部', 1: '分账成功', 2: '分账失败' })
// 分账状态：0：待分账，1：分账中，2：分账成功，，3分账取消，4：分账失败，5：挂起
const deviceStatusKeyValue = ref({ 0: '待分账', 1: '分账中', 2: '分账成功', 3: '分账取消', 4: '分账失败', 5: '挂起' })
const dataState = reactive({
    searchData: {
        merchantNo: '',
        orderNo: '',
        mobile: '',
        deviceNo: '',
        subName: '',
        subOrderNo: '',
        ledgerTime: '',
        settleStatus: '',
        collectionMerchantNo: ''

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
    if (param.ledgerTime) {
        param.settleTimeStart = param.ledgerTime[0] || ''
        param.settleTimeEnd = param.ledgerTime[1] || ''
    } else {
        param.settleTimeStart = param.settleTimeStart ? param.settleTimeStart : ''
        param.settleTimeEnd = param.settleTimeEnd ? param.settleTimeEnd : ''
    }
    delete param.ledgerTime
    const res = await ledgerDetailList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
getList()
// const msg = ref('暂停分账')
// const updateStatus = (val) => {
//     ElMessageBox.confirm(
//         'Warning',
//         {
//             confirmButtonText: '确定',
//             cancelButtonText: '取消',
//             message: msg.value,
//             title: '修改',
//             type: 'warning'
//         }
//     )
//         .then(() => {
//             ElMessage({
//                 type: 'success',
//                 message: '成功'
//             })
//         })
//         .catch(() => {
//             ElMessage({
//                 type: 'info',
//                 message: '取消'
//             })
//         })
// }
// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
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
const open = () => {
    ElMessage({
        showClose: true,
        message: '导出列表不能为空',
        type: 'warning'
    })
}
// 导出
const exportOrder = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC42927639913345024',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
    if (params.body.ledgerTime) {
        params.body.settleTimeStart = params.body.ledgerTime[0] || ''
        params.body.settleTimeEnd = params.body.ledgerTime[1] || ''
    } else {
        params.body.settleTimeStart = params.body.settleTimeStart ? params.body.settleTimeStart : ''
        params.body.settleTimeEnd = params.body.settleTimeEnd ? params.body.settleTimeEnd : ''
    }
    delete params.body.ledgerTime
    const res = await ledgerDetailExport(params)
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
