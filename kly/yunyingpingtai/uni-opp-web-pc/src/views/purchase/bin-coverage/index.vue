<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="仓编号" prop="warehouseCode">
                <el-input v-model="form.warehouseCode" placeholder="请输入仓编号" />
            </el-form-item>
            <el-form-item label="仓名称" prop="warehouseName">
                <el-input v-model="form.warehouseName" placeholder="请输入仓名称" />
            </el-form-item>
            <el-form-item label="城市编号" prop="cityCode">
                <el-input v-model="form.cityCode" placeholder="请输入城市编号" />
            </el-form-item>
            <el-form-item label="城市名称" prop="cityName">
                <el-input v-model="form.cityName" placeholder="请输入城市名称" />
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="primary" @click="add('add')">新增</el-button>
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

                <template #status="scope">
                    <span>{{statusList[scope.row.status]}}</span>
                </template>
                <template #operationBtn="scope">
                    <el-button text @click="effect(scope.row)" type="primary" v-if="scope.row.status===0">生效</el-button>
                    <el-button text @click="edit(scope.row.warehouseCode,'edit')" type="primary" v-if="scope.row.status===0 || scope.row.status===2">编辑</el-button>
                </template>
                <template #operation="scope">
                    <el-button text @click="edit(scope.row.warehouseCode,'see')" type="primary">
                        查看详情
                    </el-button>
                </template>
            </system-list>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false"  :handleType="handleType" :warehouseCode = "warehouseCode"  @fevent="getOrderList()"></add-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import addDialog from './comments/index.vue'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
const statusList = {
    0: '待生效', 1: '生效中', 2: '失效'
}
// 表单数据
const form = ref({
    warehouseCode: '',
    warehouseName: '',
    cityCode: '',
    cityName: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
const dialogVisible = ref(false)
const handleType = ref('')
const warehouseCode = ref('')
// 表格数据
const tableData = ref([])

const tHead = [
    { align: 'center', tooltip: true, prop: 'warehouseCode', label: '仓编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'warehouseName', label: '仓名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'cityCode', label: '城市编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '城市名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'operationBtn', label: '操作', minWidth: 230, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '查看详情', minWidth: 230, slot: true }

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

const add = (type) => {
    dialogVisible.value = true
    handleType.value = type
}
const edit = (row, type) => {
    dialogVisible.value = true
    handleType.value = type
    warehouseCode.value = row
}

// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            pageNum: pageinfo.page,
            pageSize: pageinfo.pageSize

        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC61839184172269568',
        name: '仓覆盖范围列表',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data
        pageinfo.total = res.count
    }
}

onMounted(async () => {
    await getOrderList()
})

// 状态更改
const effect = async (row) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            warehouseCode: row.warehouseCode,
            status: 1

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61841502368284672',
        name: '仓覆盖范围更改状态',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        await getOrderList()
    }
}
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
