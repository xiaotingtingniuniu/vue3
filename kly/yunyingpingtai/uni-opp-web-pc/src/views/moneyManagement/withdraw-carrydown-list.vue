<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="120px">
                    <el-form-item label="用户手机号" prop="mobile">
                        <el-input v-model.trim="searchData.mobile" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="用户名称" prop="userName">
                        <el-input v-model.trim="searchData.userName" placeholder="请输入" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option label="未提现" value="0" />
                            <el-option label="提现中" value="1" />
                            <el-option label="提现成功" value="2" />
                            <el-option label="提现失败" value="3" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('money-withdraw-query')" @click="getList(true)">
                            查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-if="checkRole('money-withdraw-export')" @click="exportTable">
                            导出
                        </el-button>
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-upload
                            class="multiple"
                            accept=".xls,.xlsx"
                            :show-file-list=false
                            :auto-upload = "false"
                            :multiple="false"
                            :before-upload="beforeUpload"
                            :on-change="fileRequest">
                            <el-button class="upload-btn" v-if="checkRole('money-withdraw-import')" type="primary">导入</el-button>
                        </el-upload>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #status="scope">
                        <span v-show="scope.row.status === 0" style="color:#ccc">未提现</span>
                        <span v-show="scope.row.status === 1" style="color:deepskyblue">提现中</span>
                        <span v-show="scope.row.status === 2" style="color:yellowgreen">提现成功</span>
                        <span v-show="scope.row.status === 3" style="color:crimson">提现失败</span>
                    </template>
                    <template #amount="scope">
                        {{scope.row.amount ? conversion(scope.row.amount) + '元' : ' - '}}
                    </template>
                    <template #operation="scope">
                        <el-button @click="onEdit(scope.row)" type="primary" link>编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { exportDetails, brokerageList, getupdate } from '@/api/moneyManagement'
import { checkRole } from '@/utils'
const tHead = [
    { align: 'center', tooltip: true, prop: 'userName', label: '用户名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '用户手机号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'amount', label: '结转资金', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'time', label: '结转时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'status', label: '结转状态', minWidth: 80, slot: true }
]

const dataState = reactive({
    tableData: [],
    resourceCode: null,
    visible: false,
    dialogType: null,
    currentVal: null,
    searchData: {
        mobile: null,
        userName: null,
        amount: null,
        time: null,
        status: null
    }
})

const beforeUpload = (file) => {
    const isType = file.type === 'application/vnd.ms-excel'
    const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const fileType = isType || isTypeComputer
    if (!fileType) {
        ElMessageBox({
            type: 'error',
            message: '上传文件只能是xls/xlsx格式！!'
        })
    }
    return fileType
}

const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.raw)
    formData.append('appKey', 'A1001000')
    formData.append('busiCode', 'A1001000')
    formData.append('configCode', 'UC10459724838014976')
    formData.append('name', '提现结转导入')
    formData.append('source', '分销系统')
    formData.append('importType', 1)
    const res = await getupdate(formData)
    if (res.code === '200') {
        ElMessage({
            message: '上传成功',
            type: 'success'
        })
        dataState.tableData = res.data
        getList()
    } else {
        dataState.tableData = []
    }
}

const pageInfo = ref({
    total: 0,
    pageNum: 1,
    pageSize: 10
})
const { tableData, searchData, visible, dialogType, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.pageNum = 1)
    const params = {
        ...searchData.value,
        pageSize: pageInfo.value.pageSize,
        page: pageInfo.value.pageNum

    }
    const res = await brokerageList(params)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}

// 导出提现明细列表
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10454737565282304',
        name: '提现结转导出',
        source: '分销系统',
        exportType: 5,
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

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.pageNum = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.pageNum = val
    getList()
}
// 弹出新增页

const onAdd = () => {
    dataState.visible = true
    dataState.dialogType = 'add'
}
// 弹出编辑页
const onEdit = (row) => {
    dataState.resourceCode = row.resourceCode
    dataState.currentVal = row
    dataState.visible = true
    dataState.dialogType = 'edit'
}

const conversion = (num) => {
    const str = (num / 100).toFixed(2) + ''
    const intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
    const dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
    const ret = intSum + dot
    return ret
}

</script>
<style lang="scss" scoped>
.role-page{
    .el-select{
        :deep(.el-select__tags-text){
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    // .upload-btn{
    //     margin-top: 10px;
    // }
}
</style>
