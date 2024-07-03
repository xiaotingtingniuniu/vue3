<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="采购单号" prop="purchaseNo">
                <el-input v-model="form.purchaseNo" placeholder="请输入采购单号" />
            </el-form-item>
            <el-form-item label="采购主体编号" prop="purchaseCode">
                <el-input v-model="form.purchaseCode" placeholder="请输入采购主体编号" />
            </el-form-item>
            <el-form-item label="采购主体名称" prop="purchaseName">
                <el-input v-model="form.purchaseName" placeholder="请输入采购主体名称" />
            </el-form-item>
            <el-form-item label="采购商品编号" prop="skuCode">
                <el-input v-model="form.skuCode" placeholder="请输入采购商品编号" />
            </el-form-item>
            <el-form-item label="供应商编号" prop="merchantCode">
                <el-input v-model="form.merchantCode" placeholder="请输入供应商编号" />
            </el-form-item>
            <el-form-item label="供应商名称" prop="merchantName">
                <el-input v-model="form.merchantName" placeholder="请输入供应商名称" />
            </el-form-item>
            <el-form-item label="单据类型" prop="purchaseType">
                <!-- 1普通商品、2虚拟商品、3设备商品 -->
                <el-select v-model="form.purchaseType"   clearable placeholder="请选择单据类型"   >
                    <el-option label="普通商品" :value="1" />
                    <el-option label="虚拟商品" :value="2" />
                    <el-option label="设备商品" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建日期" prop="gmtCreate">
                <el-col :span="11">
                    <el-date-picker v-model="querinfo.gmtCreate" type="datetimerange" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss"  @change="daterangeTime"/>
                </el-col>
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" @click="resetForm">重置</el-button>
                    <el-button type="primary" @click="search">搜索</el-button>
                    <el-button type="primary" @click="add()">新增</el-button>
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
                <template #purchaseType="scope">
                    <span v-if="scope.row.purchaseType===1">普通商品</span>
                    <span v-if="scope.row.purchaseType===2">虚拟商品</span>
                    <span v-if="scope.row.purchaseType===3">设备商品</span>
                </template>

                <template #purchaseStatus="scope">
                    <span v-if="scope.row.purchaseStatus===1">待生效</span>
                    <el-button  text type="primary" v-if="scope.row.purchaseStatus===2" @click="applyInfo(scope.row.approvalList)">待审核</el-button>
                    <el-button  text type="primary" v-if="scope.row.purchaseStatus===3" @click="applyInfo(scope.row.approvalList)">审核中</el-button>
                    <el-button  text type="primary" v-if="scope.row.purchaseStatus===4" @click="applyInfo(scope.row.approvalList)">审核拒绝</el-button>
                    <span v-if="scope.row.purchaseStatus===5">已生效</span>
                </template>
                <template #operation="scope">
                    <el-button text @click="toEdit('edit',scope.row)" type="primary" v-if="scope.row.purchaseStatus===1 ||scope.row.purchaseStatus===4  ">
                        编辑
                    </el-button>
                    <el-button text @click="apply(scope.row.purchaseNo)" type="primary" v-if="scope.row.purchaseStatus===1">
                        提交审核
                    </el-button>
                    <el-button text @click="toEdit('detail',scope.row)" type="primary" >
                        查看
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogVisible" title="审核详情">
            <div style="min-height: 150px" v-if="stepList.length">
                <el-steps direction="vertical" :active="1" align-center>
                    <el-step v-for="(item,index) in stepList" :key="index">
                        <template v-slot:description>
                            <p v-if="item.approvalStatus!==0">审核人：{{item.approvalName}}</p>
                            <p v-if="item.approvalStatus===0">待审核人：{{item.approvalName}}</p>
                            <p>审核时间：{{item.approvalTime?item.approvalTime.replace('T',' '):''}}</p>
                            <p>审核结果：{{approvalStatus[item.approvalStatus]}}&nbsp;&nbsp;&nbsp;&nbsp;{{item.refuseReason}}</p>

                        </template>
                    </el-step>
                </el-steps>
            </div>
            <div style="font-size:18px;color:red" v-else>暂无审核结果</div>
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
import { replace } from 'lodash'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 支付时间
const querinfo = ref({
    gmtCreate: [],
    payTime: []
})
// 1同意2拒绝
const approvalStatus = {
    0: '待审核',
    1: '同意',
    2: '拒绝'
}
// 表单数据
const form = ref({
    purchaseNo: '',
    purchaseCode: '',
    purchaseName: '',
    skuCode: '',
    merchantCode: '',
    merchantName: '',
    orderStatus: '',
    purchaseType: '',
    startGmtCreate: '',
    endGmtCreate: ''
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
    { align: 'center', prop: 'purchaseNo', label: '采购单号', minWidth: 250, fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '供应商编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '供应商名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'purchaseCode', label: '采购主体编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'purchaseName', label: '采购主体名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'purchaseType', label: '采购单类型', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量（采购单位）', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'skuStatus', label: '金额', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'totalTaxAmount', label: '含税金额(¥)', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'purchaseStatus', label: '状态', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 230 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 330, slot: true }

]

// 时间选择
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.gmtCreate = val
        form.value.startGmtCreate = val[0]
        form.value.endGmtCreate = val[1]
    } else {
        form.value.startGmtCreate = ''
        form.value.endGmtCreate = ''
    }
}

// 重置按钮功能
const resetFormData = ref(null)
const resetForm = () => {
    querinfo.value.gmtCreate = []
    resetFormData.value.resetFields()
    form.value.startGmtCreate = ''
    form.value.endGmtCreate = ''
}

const add = () => {
    router.push({
        name: 'add-purchase-order-goods',
        params: {
            type: 'add'
        }
    })
}
const toEdit = (type, row) => {
    router.push({
        name: 'add-purchase-order-goods',
        params: {
            type: type,
            purchaseNo: row.purchaseNo
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
    console.log(list)
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
        configCode: 'UC61842262636216320',
        name: '查询采购单列表信息',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data.list
        pageinfo.total = res.data.totalCount
    }
}

const apply = async (row) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            purchaseNo: row,
            userId: userInfo.value.id,
            userName: userInfo.value.name,
            account: userInfo.value.account
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UCJH64736075825991680',
        name: '提交采购单审核聚合用户',
        source: '运营后台'
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
