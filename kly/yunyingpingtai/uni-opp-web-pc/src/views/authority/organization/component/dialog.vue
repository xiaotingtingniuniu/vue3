<template>
    <!-- 组织表单 -->
    <el-dialog v-model="$props.modelValue" :title="dialogTitle" width="30%" :close-on-click-modal="false" :before-close="handleClose" :destroy-on-close="true">
        <el-form ref="ruleFormRef" :model="organizationForm" :rules="rules" label-width="120px" class="demo-ruleForm"
                 status-icon>
            <el-form-item label="上级组织名称" v-if="organizationForm.upperLevelName && $props.type === 'add'">{{ organizationForm.upperLevelName }}
            </el-form-item>
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="organizationForm.name" max-length="20" :disabled="$props.type === 'detail'" />
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-radio-group v-model="organizationForm.state" :disabled="$props.type === 'detail'">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">停用</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="是否终端" prop="terminalFlag">
                <el-radio-group v-model="organizationForm.terminalFlag" :disabled="$props.type === 'detail'">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="organizationForm.terminalFlag === 1" label="是否终端" prop="terminalFlag">
                <div class="flex flex-wrap gap-2 my-2">
                    <el-tag v-for="tag in organizationForm.confirmSelectData" :key="tag" class="mx-1" style="margin-right: 10px;" :disable-transitions="false">{{ tag.name }}</el-tag>
                </div>
                <el-button v-if="$props.type !== 'detail'" type="primary" size="small" @click="openTermSelect">{{ organizationForm.confirmSelectData.length ? '编辑' : '选择'}}</el-button>
            </el-form-item> -->
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 选择终端 -->
    <el-dialog v-model="dataStateTerm.visible" title="选择终端" width="60%" :before-close="tableDialogClose">
        <el-form label-width="120px" @submit.prevent>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="组织名称">
                        <el-input v-model="form.organizationName" clearable=""/>
                    </el-form-item>
                </el-col>
                <el-col :span="4"> <el-button type="primary" @click="getOrganizationList">确定</el-button></el-col>
            </el-row>
        </el-form>
        <system-list :tHead="organizationTHead" :tableData="dataStateTerm.organizationData" :isPage="false" ref="tableRef" @selection-change="handleSelectionChange" />
        <el-tag v-for="tag in dataStateTerm.selectionTags" :key="tag" class="mx-1" closable :disable-transitions="false" @close="tagClose(tag)" style="margin: 12px 12px 0 0;">{{ tag.name }}</el-tag>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="tableDialogClose">取消</el-button>
                <el-button type="primary" @click="confirmOrganization">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { organizationList, organizationListNew, organizationCreate, organizationDetail, organizationModify, organizationDel } from '@/api/authority'
import { ElMessage, ElMessageBox } from 'element-plus'
import SystemList from '@/composables/TablePagination/index.vue'
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    type: String,
    title: String,
    organizationVal: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['update:modelValue', 'refresh'])
const ruleFormRef = ref(null)
const tableRef = ref(null)

// 组织表单
const organizationForm = reactive({
    upperLevelName: '',
    name: '',
    state: 1,
    parentId: -1,
    terminalFlag: 2,
    confirmSelectData: []
})

const rules = reactive({
    name: [
        { required: true, message: '请输入组织名称', trigger: 'blur' }
    ]
})

const form = reactive({
    organizationName: ''
})

const dataStateTerm = reactive({
    visible: false,
    selectionData: [],
    selectionTags: [],
    organizationData: []
})

// 所属组织表头
const organizationTHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'code', label: '组织编码' },
    { align: 'center', tooltip: true, prop: 'name', label: '组织名称' }
]

const dialogTitle = computed(() => {
    let title = '提示'
    switch (props.type) {
    case 'add':
        title = props.organizationVal?.id ? '新增下级组织' : '新增一级组织'
        break
    case 'edit':
        title = '编辑'
        break
    case 'detail':
        title = '详情'
        break
    }
    return title
})

onMounted(() => {
    if (props.organizationVal?.id) {
        organizationForm.upperLevelName = props.organizationVal.name
        organizationForm.id = props.organizationVal.id
    }
    if (props.type !== 'add') {
        getDetail()
    }
})

const handleClose = () => {
    emit('update:modelValue', false)
}

// 提交
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                name: organizationForm.name, // 组织名称
                state: organizationForm.state, // 是否启用，默认1启用
                parentId: props.organizationVal?.id ? props.organizationVal.id : organizationForm.parentId, // 父组织ID 没有为 -1
                sort: 1 // 排序值
                // terminalFlag: ruleForm.terminalFlag // 是否为终端节点
            }
            if (props.type === 'add') {
                newLyReq(params)
            } else if (props.type === 'edit') {
                params.id = organizationForm.id
                editReq(params)
            }
        }
    })
}

// 新增请求
const newLyReq = async param => {
    const res = await organizationCreate(param)
    if (res.code === '200') {
        ElMessage.success(res.message)
        emit('refresh')
        handleClose()
    }
}

// 编辑请求
const editReq = async param => {
    const res = await organizationModify(param)
    if (res.code === '200') {
        ElMessage.success(res.message)
        emit('refresh')
        handleClose()
    }
}
// 查看组织详情
const getDetail = async () => {
    const res = await organizationDetail({ id: organizationForm.id })
    if (res.code === '200') {
        organizationForm.name = res.data.name
        organizationForm.state = res.data.state
        organizationForm.id = res.data.id
        organizationForm.parentId = res.data.parentId
    } else {
        ElMessage.error(res.message)
    }
    return res.code === '200'
}

// 选择终端
const openTermSelect = () => {
    if (organizationForm.confirmSelectData.length) {
        dataStateTerm.selectionTags = organizationForm.confirmSelectData
    }
    dataStateTerm.visible = true
}

// 关闭所属组织
const tableDialogClose = () => {
    dataStateTerm.visible = false
    dataStateTerm.selectionData = []
    dataStateTerm.selectionTags = []
    dataStateTerm.organizationData = []
    // form.organizationName = ''
}
// 所属组织查询
const getOrganizationList = async () => {
    form.organizationName = form.organizationName.trim()
    if (!form.organizationName) {
        return ElMessage({
            showClose: true,
            message: '组织名称不能为空',
            type: 'warning'
        })
    }
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: 1,
        pageSize: 10000,
        state: 1,
        name: form.organizationName
    }
    const res = await organizationList(params)
    dataStateTerm.organizationData = res.list
    const tempCheckData = JSON.parse(JSON.stringify(dataStateTerm.selectionTags))
    tableRef.value.tableRef.clearSelection()
    for (let i = 0; i < dataStateTerm.organizationData.length; i++) {
        for (let j = 0; j < tempCheckData.length; j++) {
            if (dataStateTerm.organizationData[i].id === tempCheckData[j].id) {
                tempCheckData[j] = dataStateTerm.organizationData[i]
            }
        }
    }
    toggleSelection(tempCheckData, true)
}
const toggleSelection = (rows, selected) => {
    if (rows) {
        rows.forEach((row) => {
            nextTick(() => {
                tableRef.value.tableRef.toggleRowSelection(row, selected)
            })
        })
    }
}

// 选择组织
const handleSelectionChange = (val) => {
    dataStateTerm.selectionData = val
    dataStateTerm.selectionTags = val
}
// 确认所属组织
const confirmOrganization = () => {
    dataStateTerm.confirmSelectData = dataStateTerm.selectionTags
    tableDialogClose()
}

</script>
