<template>
    <el-card class="box-card">
        <div class="search-area">
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                <!-- <el-form-item label="组织编码" prop="code">
                    <el-input v-model="formData.code" placeholder="请输入" />
                </el-form-item> -->
                <el-form-item label="组织名称" prop="name">
                    <el-input v-model.trim="formData.name" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="formData.state" placeholder="请选择组织状态" clearable>
                        <el-option label="启用" :value="1" />
                        <el-option label="停用" :value="0" />
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item class="button-box">
                    <el-button v-if="checkRole('permission-2')" @click="organizationListFn(true)" type="primary">搜索</el-button>
                    <el-button @click="resetForm" type="primary">重置</el-button>
                    <el-button v-if="checkRole('permission-4')" @click.stop="onAdd()" type="primary">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.currentPage"
                     v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" :row-key="getRowKeys"
                     @size-change="sizeChange" @current-change="currentChange">
            <template #state="row">
                {{ row.row.state === 0 ? '停用' : '启用' }}
            </template>
            <template #operation="scope">
                <el-button type="primary" v-if="checkRole('permission-35') && !scope.row.disabled" link @click.stop="onAdd(scope)">新增下级组织</el-button>
                <el-button type="primary" v-if="checkRole('permission-36')" link @click="onDel(scope)">删除</el-button>
                <el-button type="primary" v-if="checkRole('permission-5')" link @click="onSelect(scope, 'edit', '编辑')">编辑</el-button>
                <el-button type="primary" link @click="onSelect(scope, 'detail', '查看')">查看</el-button>
            </template>
        </system-list>
        <cst-dialog
            v-if="dialogState.visible"
            v-model="dialogState.visible"
            :title="dialogState.title"
            :type="dialogState.type"
            :organizationVal="dialogState.val"
            @refresh="onRefresh"
        ></cst-dialog>

    </el-card>
</template>
<script setup>
import { ref, onMounted, reactive, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { organizationList, organizationListNew, organizationCreate, organizationDetail, organizationModify, organizationDel } from '@/api/authority'
import { checkRole } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import CstDialog from './component/dialog.vue'

onMounted(() => {
    organizationListFn()
})

const urlParam = {
    appKey: 'A1001000',
    busiCode: 'A1001000'
}

const dialogState = reactive({
    title: '新增一级组织',
    visible: false,
    upperLevelName: '',
    type: '',
    val: {}
})

const pageInfo = ref({
    total: 1,
    currentPage: 1,
    pageSize: 10
})

const ruleForm = reactive({
    name: '',
    state: 1, // 是否启用，默认1启用
    id: '',
    parentId: '', // 父组织id
    terminalFlag: 2 // 新增 1 是 2 否，默认1
})

// 搜索form
const formRef = ref(null)
// 新增弹窗 form
const ruleFormRef = ref(null)

const rules = reactive({
    name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
    ]
})

const tableData = ref([])
const getRowKeys = (row) => {
    return row.id
}

const formData = ref({
    code: null,
    name: null,
    state: null
})
const tHead = [
    { align: 'left', tooltip: true, prop: 'name', label: '组织名称', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: '', label: '是否为终端节点', minWidth: 100 },
    // { align: 'center', tooltip: true, prop: '', label: '绑定终端数' },
    { align: 'center', tooltip: true, prop: 'state', label: '状态', minWidth: 80, slot: true },
    { align: 'center', tooltip: true, prop: 'createAt', label: '创建时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

const resetForm = () => {
    if (!formRef.value) return
    formRef.value.resetFields()
}
// 获取组织列表
const organizationListFn = async (restPage = false) => {
    if (restPage) (pageInfo.value.currentPage = 1)
    const res = await organizationListNew({
        ...formData.value,
        ...urlParam,
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}

// 新增
const onAdd = (scope) => {
    if (scope?.row) {
        dialogState.title = '新增下级组织'
        dialogState.val = scope.row
        dialogState.upperLevelName = scope.row.name
        ruleForm.parentId = scope.row.id
    } else {
        dialogState.title = '新增一级组织'
        dialogState.upperLevelName = ''
        ruleForm.parentId = ''
        dialogState.val = {}
    }
    dialogState.type = 'add'
    dialogState.visible = true
}

// 删除
const onDel = async scope => {
    ElMessageBox.alert(`确定要删除  ${scope.row.name}  吗?`, '提示', {
        type: 'error',
        confirmButtonText: '确定',
        callback: async (action) => {
            if (action !== 'confirm') return
            const res = await organizationDel({ id: scope.row.id })
            if (res.code === '200') {
                pageInfo.value.currentPage = 1
                organizationListFn()
            }
            ElMessage({
                type: res.code === '200' ? 'success' : 'warning',
                message: res.message
            })
        }
    })
}
// 刷新列表
const onRefresh = () => {
    organizationListFn()
}

// 查看
const onSelect = async (scope, type, title) => {
    dialogState.type = type
    dialogState.val = scope.row
    dialogState.visible = true
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    organizationListFn()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    organizationListFn()
}

</script>
<style lang="scss" scoped>
.box-card {
    border: initial;
}
</style>
