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
                    <el-form-item label="柜主ID" prop="entityUserId">
                        <el-input v-model="searchData.entityUserId" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="柜主手机号" prop="entityUserMobile">
                        <el-input v-model="searchData.entityUserMobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账接收方类型" prop="type">
                        <el-select v-model="searchData.type" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in statusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="设备编码" prop="deviceNo">
                        <el-input v-model="searchData.deviceNo" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方手机号" prop="mobile">
                        <el-input v-model="searchData.mobile" clearable placeholder="请输入～" />
                    </el-form-item>
                    <el-form-item label="分账方/企业名称" prop="name">
                        <el-input v-model="searchData.name" clearable placeholder="请输入～" />
                    </el-form-item>
                </div>
                <div class="search-input">
                    <el-form-item label="设备锁定状态" prop="deviceStatus">
                        <el-select v-model="searchData.deviceStatus" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in deviceStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchList"> 查询 </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <!-- <el-button type="primary" @click="searchList"> 导出 </el-button> -->
                        <!-- <el-button v-if="dataState.tableData.length==0" @click="open" type="primary" style="margin: 20px">导出</el-button> -->
                        <el-button type="primary" @click="exportOrder">导出</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="ledgerOwnerThead"
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
                <template #subsidyFlag="row">
                    {{subsidyFlagValue[row.row.subsidyFlag]}}
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ledgerOwnerThead } from '../tHead'
import { ledgerProportionList, ledgerDetailExport } from '../../../api/settlementManagement/index'
const typeKeyValue = ref({ 0: '个人', 1: '企业' })
const businessTypeKeyValue = ref({ 1: '货柜' })
const channelKeyValue = ref({ 0: '微信', 1: '支付宝' })
const statusKeyValue = ref({ 0: '个人', 1: '企业' })
const deviceStatusKeyValue = ref({ 1: '绑定', 2: '解绑' })
const subsidyFlagValue = ref({ 1: '是', 2: '否' })
const dataState = reactive({
    searchData: {
        deviceNo: '',
        entityUserId: '',
        entityUserMobile: '',
        mobile: '',
        name: '',
        deviceStatus: '',
        type: ''
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
        configCode: 'UC43651516600983552',
        exportType: 7,
        body: {
            ...searchData.value
        }
    }
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
