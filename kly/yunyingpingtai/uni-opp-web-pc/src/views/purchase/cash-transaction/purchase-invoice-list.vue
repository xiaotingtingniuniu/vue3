<template>
    <div>
        <el-form ref="resetFormData" :model="formData" label-width="120px" :inline="true">
            <el-form-item label="单据日期" prop="taxDate" class="form-item-time">
                <el-date-picker size="default" v-model="formData.taxDate" type="datetimerange" format="YYYY-MM-DD" value-format="YYYY-MM-DD" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
            </el-form-item>
            <el-form-item label="单据编号" prop="taxNo">
                <el-input v-model="formData.taxNo" placeholder="请输入单据编号" clearable/>
            </el-form-item>
            <el-form-item label="单据状态" prop="taxStatus">
                <el-select v-model="formData.taxStatus" clearable placeholder="请选择" >
                    <el-option label="待审核" value="0" />
                    <el-option label="审核中" value="1" />
                    <el-option label="已审核" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <div>
                    <el-button type="primary" @click="search">查询</el-button>
                    <el-button type="primary" @click="exportTable">导出</el-button>
                </div>
            </el-form-item>
        </el-form>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #applyTotalAmount="scope">
                    {{(scope.row.applyTotalAmount/100).toFixed(2)}}元
                </template>
                <template #disctAmount="scope">
                    {{(scope.row.disctAmount/100).toFixed(2)}}元
                </template>
                <template #writeOffTotalAmount="scope">
                    {{(scope.row.writeOffTotalAmount/100).toFixed(2)}}元
                </template>
                <template #discount="scope">
                    {{(scope.row.discount/100).toFixed(2)}}元
                </template>
                <template #taxTotalAmount="scope">
                    {{(scope.row.taxTotalAmount/100).toFixed(2)}}元
                </template>
                <template #taxStatus="scope">
                    {{taxStatusvalue[scope.row.taxStatus]}}
                </template>
                <template #taxType="scope">
                    {{taxTypevalue[scope.row.taxType]}}
                </template>
                <template #taxNo="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" @click="toDetail(row.row)">{{row.row.taxNo}}</span>
                </template>
                <template #billNo="scope">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" @click="toDetail(scope.row)">{{scope.row.billNo}}</span>
                </template>
            </system-list>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false"  :handleType="handleType" :id="kuid"  @fevent="fevent"></add-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import addDialog from '../storehouse-owner/comments/index.vue'
import { getMerchantListCode, checkExport } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
// 表单数据
const formData = ref({
    taxNo: '',
    taxStatus: '',
    taxDate: [],
    makerId: ''

})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
const dialogVisible = ref(false)
const handleType = ref('')
const kuid = ref('')
// 表格数据
const tableData = ref([])
// 0：待审核；1：审核中；2：已审核通过
const taxStatusvalue = {
    0: '待审核', 1: '审核中', 2: '已审核通过'
}
// 1是普通发票 2是专用发票
const taxTypevalue = {
    1: '普通发票', 2: '专用发票'
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'taxNo', label: '单据编号', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'taxBillDate', label: '单据日期', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'taxType', label: '发票类型', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '供应商名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'makerId', label: '制单人', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'reviewer', label: '审核人', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'taxTotalAmount', label: '含税总金额', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'taxStatus', label: '单据状态', minWidth: 200, slot: true }
]
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
}

// 搜索按钮
const search = () => {
    pageinfo.page = 1
    getOrderList()
}

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            ...formData.value,
            page: pageinfo.page,
            pageSize: pageinfo.pageSize,
            billDateStart: formData.value?.taxDate?.length ? formData.value?.taxDate[0] : '', // 开始时间
            billDateEnd: formData.value?.taxDate?.length ? formData.value?.taxDate[1] : '' // 结束时间

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64751809604218880',
        name: '发票列表',
        source: '采销财务系统'
    }
    delete params.body.taxDate
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageinfo.total = res.data.total
    }
}
const exportTable = async () => {
    const param = {
        body: {
            page: pageinfo.page,
            pageSize: pageinfo.pageSize,
            ...formData.value,
            billDateStart: formData.value?.taxDate?.length ? formData.value?.taxDate[0] : '', // 开始时间
            billDateEnd: formData.value?.taxDate?.length ? formData.value?.taxDate[1] : '' // 结束时间
        },
        exportType: 7,
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC64752115385757696',
        name: '发票列表导出',
        source: '采销财务系统'

    }
    delete param.body.taxDate
    const res = await checkExport(param)
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
const add = (type) => {
    dialogVisible.value = true
    handleType.value = type
}
const toEdit = (id, type) => {
    dialogVisible.value = true
    handleType.value = type
    kuid.value = id
}
const toDetail = (val) => {
    router.push({ name: 'purchase-invoice-detail', params: { taxNo: val.taxNo, num: '1' } })
}
// 状态
const stopBtn = async (row) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            id: row.id,
            status: row.status

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61838201262292992',
        name: '库房主数据更改状态',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage.success(res.message)
        await getOrderList()
    }
}
onMounted(async () => {
    await getOrderList()
})

// 当前页数改变
const currentChange = (val) => {
    pageinfo.page = val
    getOrderList()
}
const sizeChange = (val) => {
    pageinfo.page = 1
    pageinfo.pageSize = val
    getOrderList()
}

</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
