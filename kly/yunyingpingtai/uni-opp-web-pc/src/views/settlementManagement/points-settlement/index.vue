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
                    <el-form-item label="结算时间" prop="settlementTime">
                        <el-date-picker
                            v-model="searchData.settlementTime"
                            type="monthrange"
                            value-format="YYYY-MM"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item label="支付状态"  prop="payStatus">
                        <el-select v-model="searchData.payStatus" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="待支付" value="0" />
                            <el-option label="已支付" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList">查询</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="pointsThead"
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
                <template #refundNode="row">
                    {{refundNodeKeyValue[row.row.refundNode]}}
                </template>
                <template #operbtn="scope">
                    <el-button type="primary"  @click="exportOrder(scope.row.entityUserId, scope.row.billMonth)" >账单导出</el-button>
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
import { pointsThead } from '../tHead'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { exportDetails } from '../../../api/settlementManagement/index'

const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const dataState = reactive({
    searchData: {
        payStatus: '',
        settlementTime: []
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
const searchList = () => {
    pageInfo.value.currentPage = 1
    getList()
}
const getList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            ...dataState.searchData,
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize

        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC74166245353742336',
        name: '积分结算账单查询接口',
        source: '结算中台'
    }
    if (param.body.settlementTime) {
        param.body.startTime = param.body.settlementTime[0] || ''
        param.body.endTime = param.body.settlementTime[1] || ''
    } else {
        param.body.startTime = param.body.startTime ? param.body.startTime : ''
        param.body.endTime = param.body.endTime ? param.body.endTime : ''
    }
    delete param.body.settlementTime
    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.total
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
const exportOrder = async (entityUserId, billMonth) => {
    const params = {
        configCode: 'UC74166090122551296',
        appKey: 'A1001000',
        busiCode: 'A1001002',
        name: '积分结算账单导出接口',
        source: '结算中台',
        exportType: 7,
        body: {
            billMonth,
            entityUserId
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
const dialogTableVisible = ref(false)

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
