<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="仓编号" prop="warehouseCode">
                <el-input v-model="form.warehouseCode" placeholder="请输入仓编号" />
            </el-form-item>
            <el-form-item label="仓名称" prop="warehouseName">
                <el-input v-model="form.warehouseName" placeholder="请输入仓名称" />
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

                <template #bigCategory="scope">
                    <span v-if="scope.row.bigCategory ===1">中心仓</span>
                    <span v-if="scope.row.bigCategory ===2">城市仓</span>
                </template>
                <template #basicType="scope">
                    <span v-if="scope.row.basicType ===1">商品综合仓</span>
                    <span v-if="scope.row.basicType ===2">设备仓</span>
                </template>
                <template #ownership="scope">
                    <span v-if="scope.row.ownership ===1">自营仓</span>
                    <span v-if="scope.row.ownership ===2">三方仓</span>
                </template>
                <template #status="scope">
                    <!-- 0-待启用 1-启用 2-停用 -->
                    <span v-if="scope.row.status ===0">待启用</span>
                    <span v-if="scope.row.status ===1">启用</span>
                    <span v-if="scope.row.status ===2">停用</span>
                </template>
                <template #operationBtn="scope">
                    <el-button text @click="stopBtn(scope.row,1)" type="primary" v-if="scope.row.status ===0 || scope.row.status ===2">启用</el-button>
                    <el-button text @click="stopBtn(scope.row,2)" type="primary" v-if="scope.row.status ===1 ">停用</el-button>
                    <el-button text @click="toEdit(scope.row.id,'edit')" type="primary" v-if="scope.row.status ===0 || scope.row.status ===2">编辑</el-button>
                </template>
                <template #operation="scope">
                    <el-button text @click="toEdit(scope.row.id,'detail')" type="primary">
                        查看详情
                    </el-button>
                </template>
            </system-list>
        </div>
        <add-dialog  v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false"  :handleType="handleType" :id="kuid"  @fevent="getOrderList()"></add-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import addDialog from './comments/index.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const router = useRouter()

// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
// 表单数据
const form = ref({
    warehouseCode: '',
    warehouseName: ''

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

const tHead = [
    { align: 'center', tooltip: true, prop: 'warehouseCode', label: '仓编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'warehouseName', label: '仓名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'bigCategory', label: '大类', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'basicType', label: '基本类型', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'provinceName', label: '省', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '市', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'countyName', label: '县', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'detAddress', label: '详细地址', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'ownership', label: '拓展属性', minWidth: 200, slot: true },
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
        busiCode: 'A1001006',
        configCode: 'UC61835295184240640',
        name: '库房主数据列表',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data
        pageinfo.total = res.count
    }
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
// 状态
const stopBtn = async (row, num) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            id: row.id,
            status: num

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
