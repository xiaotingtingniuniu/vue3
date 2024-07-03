<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-card>
                <el-form
                    ref="formRef"
                    :model="searchData"
                    :rules="rules"
                    label-width="100px"
                    :inline="true"
                >
                    <div class="search-input">
                        <el-form-item label="平台商户ID" prop="userId">
                            <el-input
                                v-model="searchData.userId"
                                clearable
                                placeholder="请输入～"
                            />
                        </el-form-item>
                        <el-form-item label="账户类型" prop="acctType">
                            <el-select
                                v-model="searchData.acctType"
                                clearable
                                placeholder="请选择"
                            >
                                <el-option label="现金" value="01" />
                                <el-option label="充值" value="02" />
                                <!-- <el-option label="积分" value="03" />
                                <el-option label="三方支付消费账户" value="04" /> -->
                                <!-- <el-option label="分销" value="05" /> -->
                                <el-option label="待结算" value="06" />
                                <!-- <el-option label="补贴" value="07" /> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item
                            label="动账日期"
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
                            <el-button type="primary" @click="submitForm(formRef)">查询</el-button>
                            <el-button v-if="!dataState.searchData.userId && !dataState.searchData.applyTime" type="primary" @click="open">导出</el-button>
                            <el-button type="primary" v-else @click="exportTable">导出</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-card>
        </div>
        <el-card class="cardBox">
            <system-list
                :tHead="platformTHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #recordDirection="row">
                    {{recordDirectionKeyValue[row.row.recordDirection]}}
                </template>
                <template #transAmount="scope">
                    {{scope.row.transAmount === 0 ? '0.00' : ((scope.row.transAmount*0.01).toFixed(2))}}
                </template>
                <template #frozenAmount="scope">
                    {{scope.row.frozenAmount === 0 ? '0.00' : ((scope.row.frozenAmount*0.01).toFixed(2))}}
                </template>
                <template #resultAmount="scope">
                    {{scope.row.resultAmount === 0 ? '0.00' : ((scope.row.resultAmount*0.01).toFixed(2))}}
                </template>
            </system-list>
        </el-card>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import { platformTHead } from '../tHead'
import { exportDetails, platWarterList } from '@/api/accountManagement/index'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
const formRef = ref()
const recordDirectionKeyValue = ref({ 1: '入账', 2: '出账' })
// 账户类型:01-现金,02-储值,03-积分,04-三方支付消费账户,05-分销,06-待结算,07-补贴
const accountKeyValue = ref({ 1: '现金', 2: '储值', 3: '积分', 4: '三方支付消费账户', 5: '分销', 6: '待结算', 7: '补贴' })
const dataState = reactive({
    searchData: {
        applyTime: '',
        mainUserId: '',
        acctType: '',
        acctLevel: '1'
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
        message: '请选择查询条件',
        type: 'warning'
    })
}
// onMounted(async () => {
//     await getList()
// })
const getList = async () => {
    const param = {
        ...searchData.value,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    if (param.applyTime) {
        param.startDate = param.applyTime[0] || ''
        param.endDate = param.applyTime[1] || ''
    } else {
        param.startDate = param.startDate ? param.startDate : ''
        param.endDate = param.endDate ? param.endDate : ''
    }
    delete param.applyTime
    const res = await platWarterList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
const submitForm = async (formEl) => {
    pageInfo.value.currentPage = 1
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('11111', formEl)
            getList()
        }
    })
}

// 表单校验
const rules = reactive({
    applyTime: [
        { required: true, message: '请输入动账日期', trigger: 'change' }
    ]
})
const exportTable = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC17327976992415744',
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
.tableList-area{
    margin-top:20px;
}
.cardBox{
    margin-top:20px;
}
.search-input {
//   display: flex;
//   justify-content: space-between;
//   .el-input {
//     width: 260px;
//   }
//   .el-select {
//     width: 260px;
//   }
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
