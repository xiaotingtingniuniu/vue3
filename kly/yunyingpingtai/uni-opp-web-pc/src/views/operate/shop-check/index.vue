<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="店铺名称" prop="storeName">
                    <el-input v-model="searchData.storeName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                        <el-option v-for="(item, index) in busiCodeOption" :key="index" :label="item.buisName" :value="item.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="申请类型" label-width="80px" prop="applyType">
                    <el-select v-model="searchData.applyType" clearable placeholder="请选择" >
                        <el-option label="新增店铺" value="1" />
                        <el-option label="信息变更" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" label-width="80px" prop="auditStatus">
                    <el-select v-model="searchData.auditStatus" clearable placeholder="请选择" >
                        <el-option label="未审核" value="2" />
                        <el-option label="通过" value="3" />
                        <el-option label="驳回" value="4" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="reload()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
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
                <template #applyType="row">
                    {{applyTypeValue[row.row.applyType]}}
                </template>
                <template #auditStatus="row">
                    {{auditStatusValue[row.row.auditStatus]}}
                </template>
                <template #operation="scope">
                    <el-button text type="primary" @click="goToDetail('check', scope.row, 'process')">
                        查看
                    </el-button>
                    <el-button text type="primary" @click="agree(scope.row.id)" v-if="scope.row.auditStatus === 2">
                        通过
                    </el-button>
                    <el-button text type="primary" @click="showDialog('refuse', scope.row.id)" v-if="scope.row.auditStatus === 2">
                        驳回
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogFormVisible" title="" :close-on-click-modal="false" @close="hideDialog">
            <el-form :model="dialogFormData" label-width="100px" :rules="rules" ref="dialogFormRef">
                <el-form-item label="驳回原因" prop="remark">
                    <el-input
                        v-model="dialogFormData.remark"
                        :rows="3"
                        type="textarea"
                        placeholder="请详细说明驳回原因"
                    />
                </el-form-item>
            </el-form>
            <el-button style="margin-left:20%" @click="dialogSubmit(dialogFormRef)" type="primary">确认</el-button>
            <el-button @click="hideDialog">取消</el-button>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { merchantIntention, getShopCheckList, addLabel, getAllBusiCode, updateLabel, getLabelDetail, checkHandle } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useStore } from 'vuex'
const subsidyFlagValue = ref({ 1: '柜主' })
const applyTypeValue = ref({ 1: '店铺新增', 2: '信息变更' })
const auditStatusValue = ref({ 2: '未审核', 3: '通过', 4: '驳回' })
const tagTypeValue = ref({ 1: '手动标签' })
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    // { align: 'center', tooltip: true, type: 'index', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '业务线', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'storeName', label: '店铺名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'applyType', label: '申请类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'creatorId', label: '申请人', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '申请时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审核时间', minWidth: 100 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 120, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        tagName: '',
        busiCode: '',
        merchantName: '',
        applyType: '',
        auditStatus: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    BusiInfoResVo: [],
    rolelist: [],
    dialogType: '',
    dialogFormVisible: false,
    dialogFormData: {
        remark: ''
    },
    rowId: ''
})
const { searchData, pageinfo, BusiInfoResVo, rolelist, dialogFormVisible, applyForm, dialogFormData } = toRefs(dataState)

onMounted(() => {
    dataState.searchData.auditStatus = '2'
    queryList()
    queryAllBusicode()
})
// 获取全部业务线
const queryAllBusicode = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000'
    }
    const res = await getAllBusiCode(params)
    busiCodeOption.value = res.data
}
// 列表数据
const queryList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        ...dataState.searchData,
        page: dataState.pageinfo.page,
        pageSize: dataState.pageinfo.pageSize
    }
    const res = await getShopCheckList(params)
    tableData.value = res.data.list
    dataState.pageinfo.total = res.data.total
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    queryList()
}

// 查询
const reload = () => {
    dataState.pageinfo.page = 1
    queryList()
}

// // 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    queryList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    queryList()
}
const open = () => {
    ElMessage({
        showClose: true,
        message: '导出列表不能为空',
        type: 'warning'
    })
}
// 新增/编辑
const showDialog = (type, id) => {
    dataState.dialogType = type
    dataState.rowId = id
    dataState.dialogFormVisible = true
}
const hideDialog = () => {
    dataState.dialogFormVisible = false
    resetDialogForm()
}
const dialogFormRef = ref()
const rules = reactive({
    remark: [{ required: true, message: '请输入', trigger: 'change' }]
})
const tagNameOption = ref([])
const busiCodeOption = ref([])
const tagNameLoading = ref(false)
// 标签名称搜索下拉框
const remoteMethod = () => {
    tagNameOption.value = [
        { lable: '1111', value: '1' },
        { lable: '2222', value: '2' },
        { lable: '3333', value: '3' }
    ]
}
// 审核通过
const agree = (id) => {
    ElMessageBox.confirm(
        '确认通过',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    ).then(async () => {
        const params = {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            id,
            auditStatus: '3',
            modifierId: userInfo.value.account
        }
        const res = await checkHandle(params)
        if (res.code === '200') {
            ElMessage.success(res.message)
            reload()
        }
    })
}
// 表单重置
const resetDialogForm = () => {
    if (!dialogFormRef.value) return
    dialogFormRef.value.resetFields()
}
// 提交（新增/编辑）
const dialogSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                id: dataState.rowId,
                auditStatus: '4',
                modifierId: userInfo.value.account,
                ...dataState.dialogFormData
            }
            const res = await checkHandle(params)
            console.log(res)
            if (res.code === '200') {
                ElMessage.success(res.message)
                reload()
                hideDialog()
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
// 查看
const goToDetail = async (handleType, info, type) => {
    router.push({ name: 'shop-detail', params: { handleType, type, storeCode: info && info.id, busiMerchantId: info && info.busiMerchantId } })
}
</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
