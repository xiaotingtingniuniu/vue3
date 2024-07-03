<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form
                ref="formRef"
                :model="searchData"
                :inline="true"
                label-width="100px"
                label-position="right"
            >
                <div class="search-input">
                    <el-form-item label="柜主手机号" prop="mobile">
                        <el-input
                            v-model="searchData.mobile"
                            clearable
                            placeholder="请输入～"
                        />
                    </el-form-item>
                    <el-form-item label="提现流水号" prop="payNo">
                        <el-input
                            v-model="searchData.payNo"
                            clearable
                            placeholder="请输入～"
                        />
                    </el-form-item>
                    <el-form-item label="提现状态" prop="status">
                        <el-select
                            v-model="searchData.status"
                            clearable
                            placeholder="请选择"
                        >
                            <el-option v-for="(item, key) in statusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item
                        label="提现申请时间"
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
                    <el-form-item>
                        <el-button type="primary" @click="searchList">
                            查询
                        </el-button>
                        <el-button style="margin-left: 50px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <el-button v-if="dataState.tableData.length==0" type="primary" @click="open" style="margin: 20px">导出明细</el-button>
        <el-button type="primary" v-else style="margin: 20px" @click="exportTable">导出明细</el-button>
        <div class="tableList-area">
            <system-list
                :tHead="THead"
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
                <template #transAmount="scope">
                    {{(scope.row.transAmount*0.01).toFixed(2)}}元
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import { getWithdrawalList, exportDetails } from '../../../api/paymentManagement/index'
import { THead } from '../tHead'
const statusKeyValue = ref({ 0: '处理中', 1: '提现成功', 2: '提现失败' })
const dataState = reactive({
    searchData: {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        mobile: '',
        status: '',
        payNo: '',
        applyTime: '',
        busiType: 2,
        subAcctType: '07'
    },
    tableData: []
})
const { searchData, tableData } = toRefs(dataState)
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
    const param = { ...searchData.value, page: pageInfo.value.currentPage, pageSize: pageInfo.value.pageSize }
    if (param.applyTime) {
        param.startDate = param.applyTime[0] || ''
        param.endDate = param.applyTime[1] || ''
    } else {
        param.startDate = param.startDate ? param.startDate : ''
        param.endDate = param.endDate ? param.endDate : ''
    }
    delete param.applyTime
    const res = await getWithdrawalList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
getList()
const exportTable = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC15111841338335232',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
    if (params.body.applyTime) {
        params.body.startDate = params.body.applyTime[0] || ''
        params.body.endDate = params.body.applyTime[1] || ''
    } else {
        params.body.startDate = params.body.startDate ? params.body.startDate : ''
        params.body.endDate = params.body.endDate ? params.body.endDate : ''
    }
    delete params.body.applyTime
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
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
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
