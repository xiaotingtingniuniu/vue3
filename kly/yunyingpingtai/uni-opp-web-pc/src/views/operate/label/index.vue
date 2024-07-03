<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="标签名称" prop="tagName">
                    <el-input v-model="searchData.tagName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                        <el-option v-for="(item, index) in busiCodeOption" :key="index" :label="item.buisName" :value="item.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="reload()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <el-button type="primary" @click="showDialog('add')">新增</el-button>
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
                <template #tagGroup="row">
                    {{tagGroupValue[row.row.tagGroup]}}
                </template>
                <template #tagType="row">
                    {{tagTypeValue[row.row.tagType]}}
                </template>
                <template #operation="scope">
                    <el-button text type="primary" @click="showDialog('edit', scope.row.id)">
                        编辑
                    </el-button>
                    <el-button text type="primary" @click="delRow(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogFormVisible" title="新增/编辑" :close-on-click-modal="false" @close="hideDialog">
            <el-form :model="dialogFormData" label-width="100px" :rules="rules" ref="dialogFormRef">
                <el-form-item label="业务线" prop="busiCode">
                    <el-select v-model="dialogFormData.busiCode" clearable placeholder="请选择" >
                        <el-option v-for="(item, index) in busiCodeOption" :key="index" :label="item.buisName" :value="item.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称" prop="tagName">
                    <el-select
                        v-model="dialogFormData.tagName"
                        multiple
                        :reserve-keyword="false"
                        placeholder="请选择"
                        remote-show-suffix
                        :remote-method="remoteMethod"
                        :loading="tagNameLoading"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in tagNameOption"
                            :key="index"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="已有标签">
                    <el-tag
                        v-for="tag in dialogFormData.tagNameHas"
                        :key="tag"
                        class="mx-1"
                        type="info"
                        style="margin-right: 5px"
                    >
                        {{ tag }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="标签组" prop="tagGroup">
                    <el-select v-model="dialogFormData.tagGroup" clearable placeholder="请选择" style="width: 100%">
                        <el-option label="平台标签" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="标签类型" prop="tagType">
                    <el-select v-model="dialogFormData.tagType" clearable placeholder="请选择" style="width: 100%">
                        <el-option label="手动标签" value="1" />
                    </el-select>
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
import { getLabelName, getLabelList, addLabel, getAllBusiCode, updateLabel, getLabelDetail, delLabel } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useStore } from 'vuex'
const subsidyFlagValue = ref({ 1: '柜主' })
const tagGroupValue = ref({ 1: '平台标签' })
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
    { align: 'center', tooltip: true, prop: 'tagName', label: '标签名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'tagGroup', label: '标签组', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'tagType', label: '标签类型', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 120, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        tagName: '',
        busiCode: ''
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
        busiCode: '',
        tagName: [],
        tagNameHas: [],
        tagGroup: '1',
        tagType: '1'
    },
    rowId: ''
})
const { searchData, pageinfo, BusiInfoResVo, rolelist, dialogFormVisible, applyForm, dialogFormData } = toRefs(dataState)

onMounted(() => {
    getList()
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
const getList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        ...dataState.searchData,
        page: dataState.pageinfo.page,
        pageSize: dataState.pageinfo.pageSize
    }
    const res = await getLabelList(params)
    tableData.value = res.data.list
    dataState.pageinfo.total = res.data.total
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 查询
const reload = () => {
    dataState.pageinfo.page = 1
    getList()
}

// // 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    getList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    getList()
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
    if (type === 'edit') {
        queryDetail()
    }
    remoteMethod()
}
const hideDialog = () => {
    dataState.dialogFormVisible = false
    resetDialogForm()
}
const dialogFormRef = ref()
const rules = reactive({
    busiCode: [{ required: true, message: '请选择', trigger: 'change' }],
    tagName: [{ required: true, message: '请选择', trigger: 'change' }],
    tagGroup: [{ required: true, message: '请选择', trigger: 'change' }],
    tagType: [{ required: true, message: '请选择', trigger: 'change' }]
})
const tagNameOption = ref([])
const busiCodeOption = ref([])
const tagNameLoading = ref(false)
// 标签名称搜索下拉框
const remoteMethod = async (name) => {
    const params = {
        tagName: name
    }
    const res = await getLabelName(params)
    tagNameOption.value = res.data
}
// // 标签名称删除
// const removeLabel = async (name) => {
//     dataState.dialogFormData.tagName = dataState.dialogFormData.tagName.filter(item => item !== name)
// }
// 获取详情
const queryDetail = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: dataState.rowId
    }
    const res = await getLabelDetail(params)
    dataState.dialogFormData.busiCode = res.data.busiCode
    dataState.dialogFormData.tagName = res.data.tagName.split(',')
    dataState.dialogFormData.tagNameHas = res.data.tagName.split(',')
    dataState.dialogFormData.tagGroup = res.data.tagGroup.toString()
    dataState.dialogFormData.tagType = res.data.tagType.toString()
}
// 删除标签
const delRow = (id) => {
    ElMessageBox.confirm(
        '确定删除当前数据吗？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    ).then(async () => {
        const params = {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            id
        }
        const res = await delLabel(params)
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
            if (dataState.dialogType === 'add') {
                const params = {
                    appKey: 'A1001000',
                    busiCode: 'A1001000',
                    creatorId: userInfo.value.account,
                    ...dataState.dialogFormData,
                    tagName: dataState.dialogFormData.tagName.join()
                }
                const res = await addLabel(params)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    reload()
                    resetDialogForm()
                    hideDialog()
                }
            } else if (dataState.dialogType === 'edit') {
                const params = {
                    appKey: 'A1001000',
                    busiCode: 'A1001000',
                    id: dataState.rowId,
                    modifierId: userInfo.value.account,
                    ...dataState.dialogFormData,
                    tagName: dataState.dialogFormData.tagName.join()
                }
                const res = await updateLabel(params)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    reload()
                    resetDialogForm()
                    hideDialog()
                }
            }
        } else {
            console.log('error submit!', fields)
        }
    })
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
