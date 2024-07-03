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
                    <el-form-item label="设备号" prop="deviceNo">
                        <el-input v-model="searchData.deviceNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="商户号" prop="entityUserId">
                        <el-input v-model="searchData.entityUserId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in statusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="分账方手机号" prop="mobile">
                        <el-input v-model="searchData.mobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方/企业名称" prop="name">
                        <el-input v-model="searchData.name" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="渠道" prop="channel">
                        <el-select v-model="searchData.channel" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in channelKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="合作状态" prop="deviceStatus">
                        <el-select v-model="searchData.deviceStatus" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in deviceStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务线" prop="businessType">
                        <el-select v-model="searchData.businessType" clearable placeholder="请选择">
                            <!-- <el-option v-for="(item, key) in businessTypeKeyValue" :key="item" :label="item" :value="key" /> -->
                            <el-option label="货柜" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分账方类型" prop="type">
                        <el-select v-model="searchData.type" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in typeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="创建时间" prop="createTime">
                        <el-date-picker
                            v-model="searchData.createTime"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList"> 查询 </el-button>
                        <el-button style="margin-left: 50px" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="cabinetOwnerThead"
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
                <template #rate="scope">
                    {{scope.row.rate}}%
                </template>
                <template #period="scope">
                    D+{{scope.row.period}}
                </template>
                <template #status="row">
                    {{statusKeyValue[row.row.status]}}
                </template>
                <template #deviceStatus="row">
                    {{deviceStatusKeyValue[row.row.deviceStatus]}}
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
// import { ElMessage, ElMessageBox } from 'element-plus'
import { cabinetOwnerThead } from '../tHead'
import { ledgerProportionList } from '../../../api/settlementManagement/index'
const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const businessTypeKeyValue = ref({ 1: '货柜' })
const channelKeyValue = ref({ 0: '微信', 1: '支付宝' })
const statusKeyValue = ref({ 0: '未生效', 1: '生效中', 2: '已失效' })
const deviceStatusKeyValue = ref({ 0: '终止', 1: '正常' })
const dataState = reactive({
    searchData: {
        deviceNo: '',
        entityUserId: '',
        status: '',
        mobile: '',
        name: '',
        channel: '',
        deviceStatus: '',
        businessType: '',
        type: '',
        createTime: ''
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
    if (param.createTime) {
        param.startTime = param.createTime[0] || ''
        param.endTime = param.createTime[1] || ''
    } else {
        param.startTime = param.startTime ? param.startTime : ''
        param.endTime = param.endTime ? param.endTime : ''
    }
    delete param.createTime
    const res = await ledgerProportionList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.total
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
