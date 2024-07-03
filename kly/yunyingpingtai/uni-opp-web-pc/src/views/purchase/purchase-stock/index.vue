<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="采购单号" prop="purchaseNo">
                <el-input v-model="form.purchaseNo" placeholder="请输入采购单号" />
            </el-form-item>
            <el-form-item label="采购入库单号" prop="warehousingNo">
                <el-input v-model="form.warehousingNo" placeholder="请输入采购入库单号" />
            </el-form-item>
            <el-form-item label="发货方编号" prop="deliveryCode">
                <el-input v-model="form.deliveryCode" placeholder="请输入发货方编号" />
            </el-form-item>
            <el-form-item label="发货方名称" prop="deliveryName">
                <el-input v-model="form.deliveryName" placeholder="请输入发货方名称" />
            </el-form-item>
            <el-form-item label="收货方编号" prop="receiverNo">
                <el-input v-model="form.receiverNo" placeholder="请输入收货方编号" />
            </el-form-item>
            <el-form-item label="收货方名称" prop="receiverName">
                <el-input v-model="form.receiverName" placeholder="请输入收货方名称" />
            </el-form-item>
            <el-form-item label="商品编号" prop="skuCode">
                <el-input v-model="form.skuCode" placeholder="请输入商品编号" />
            </el-form-item>
            <el-form-item label="建单日期" prop="gmtCreate">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.gmtCreate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="daterangeTime"/>
                </el-col>
            </el-form-item>
            <el-form-item label="入库日期" prop="useDate">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.useDate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="changeDatetime"/>
                </el-col>
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="primary" @click="add">新增</el-button>
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
                <template #documentType="scope">
                    <span v-if="scope.row.documentType==='0'">采购入库单(仓)</span>
                    <span v-if="scope.row.documentType==='1'">采购入库单(店)</span>
                </template>
                <template #status="scope">
                    <span v-if="scope.row.status===0">待生效</span>
                    <!-- <el-button  text type="primary" v-if="scope.row.status===2" @click="applyInfo(scope.row.approvalList)">待审核</el-button>
                    <el-button  text type="primary" v-if="scope.row.status===3" @click="applyInfo(scope.row.approvalList)">审核中</el-button>
                    <el-button  text type="primary" v-if="scope.row.status===4" @click="applyInfo(scope.row.approvalList)">审核拒绝</el-button> -->
                    <span v-if="scope.row.status===1">已生效</span>
                    <span v-if="scope.row.status===2">已入库</span>
                    <span v-if="scope.row.status===3">取消</span>
                </template>
                <template #operation="scope">
                    <el-button text @click="toEdit('edit',scope.row)" type="primary" v-if="scope.row.status===0 ||scope.row.status===3  ">
                        编辑
                    </el-button>
                    <el-button text @click="toEdit('detail',scope.row)" type="primary" >
                        查看
                    </el-button>
                    <el-button text @click="apply(scope.row,'1')" type="primary" v-if="scope.row.status===0">
                        生效
                    </el-button>
                    <el-button text @click="apply(scope.row,'3')" type="primary" v-if="scope.row.status===0">
                        取消
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogVisible" title="审核详情">
            <el-steps direction="vertical" :active="1">
                <el-step :title="stepList" />
            </el-steps>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">
                        关闭
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { orderList } from '@/api/order/index.js'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 支付时间
const querinfo = ref({
    gmtCreate: [],
    useDate: []
})
// 表单数据
const form = ref({
    warehousingNo: '',
    purchaseNo: '',
    deliveryCode: '',
    deliveryName: '',
    skuCode: '',
    receiverNo: '',
    receiverName: '',
    documentTimeStart: '',
    documentTimeEnd: '',
    warehousingTimeStart: '',
    warehousingTimeEnd: ''
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
const dialogVisible = ref(false)
// 表格数据
const tableData = ref([])

const tHead = [
    { align: 'center', prop: 'warehousingNo', label: '采购入库单号', minWidth: 250, fixed: true },
    { align: 'center', tooltip: true, prop: 'purchaseNo', label: '采购单号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'deliveryCode', label: '发货方编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'deliveryName', label: '发货方名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'receiverNo', label: '收货方编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'receiverName', label: '收货方名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'documentType', label: '单据类型', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'weight', label: '重量(KG)', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'volume', label: '体积(立方米)', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'createTime', label: '创建时间', minWidth: 230 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 330, slot: true }

]

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.gmtCreate = val
        form.value.documentTimeStart = val[0]
        form.value.documentTimeEnd = val[1]
    } else {
        form.value.documentTimeStart = ''
        form.value.documentTimeEnd = ''
    }
}

const changeDatetime = (val) => {
    if (val) {
        querinfo.value.useDate = val
        form.value.warehousingTimeStart = val[0]
        form.value.warehousingTimeEnd = val[1]
    } else {
        form.value.warehousingTimeStart = ''
        form.value.warehousingTimeEnd = ''
    }
}
// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    querinfo.value.gmtCreate = []
    querinfo.value.useDate = []
    resetFormData.value.resetFields()
    form.value.documentTimeStart = ''
    form.value.documentTimeEnd = ''
    form.value.warehousingTimeStart = ''
    form.value.warehousingTimeEnd = ''
}

const add = () => {
    router.push({
        name: 'add-purchase-stock',
        params: {
            type: 'add'
        }
    })
}
const toEdit = (type, row) => {
    router.push({
        name: 'add-purchase-stock',
        params: {
            type: type,
            warehousingNo: row.warehousingNo
        }
    })
}
// 搜索按钮
const search = () => {
    pageinfo.page = 1
    getOrderList()
}

const stepList = ref([])
const applyInfo = (list) => {
    dialogVisible.value = true
    stepList.value = list
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
        configCode: 'UC61854136383684608',
        name: '采购入库单列表',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data
        pageinfo.total = res.count
    }
}

const apply = async (row, num) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            id: row.id,
            status: Number(num),
            userId: userInfo.value.id,
            userName: userInfo.value.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61855483262779392',
        name: '采购入库单更改状态',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage.success('成功')
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
