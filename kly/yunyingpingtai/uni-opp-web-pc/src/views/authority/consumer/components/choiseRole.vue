<template>
    <el-dialog :model-value="true" title="选择角色" width="900px" @close="close(false)" draggable>
        <el-card class="box-card">
            <div>

            </div>
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px" @submit.prevent>
                <el-form-item label="角色名称" prop="name" style="width: 200px">
                    <el-input v-model.trim="formData.name" placeholder="角色名称" />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button @click="roleListFn(true)" type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
            <system-list
                ref="multipleTableRef"
                :rowKey="getRowKeys"
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="selectionDataFn"
            >
            </system-list>
            <el-tag v-for="tag in selectionData" :key="tag" closable :disable-transitions="false" @close="toggleSelection([tag], false)" style="margin: 12px 12px 0 0;">{{ tag.name }}</el-tag>
        </el-card>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close(false)">取消</el-button>
                <el-button type="primary" @click="close(true)">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { roleList } from '@/api/authority'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'update:selectionData', 'update:organizationArr'])
const props = defineProps(['organizationArr', 'selectionData'])
const oldSelectionData = JSON.parse(JSON.stringify(props.selectionData))

const close = (submit) => {
    if (!submit) {
        emits('update:selectionData', oldSelectionData)
    }
    emits('close')
}
const formData = ref({
    name: '',
    state: 1
})

const pageInfo = ref({
    total: 1,
    currentPage: 1,
    pageSize: 10
})

const tableData = ref([])
const roleListFn = async (restPage = false) => {
    if (!formData.value.name) {
        return ElMessage({
            showClose: true,
            message: '请输入筛选项',
            type: 'warning'
        })
    }
    if (restPage) (pageInfo.value.currentPage = 1)
    const organizationIds = props.organizationArr.map(item => item.id)
    const { list, totalCount } = await roleList({
        ...formData.value,
        organizationIds: organizationIds.join(','),
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    tableData.value = list
    pageInfo.value.total = totalCount

    const tempCheckData = JSON.parse(JSON.stringify(props.selectionData))
    multipleTableRef.value.tableRef.clearSelection()

    for (let i = 0; i < tableData.value.length; i++) {
        for (let j = 0; j < tempCheckData.length; j++) {
            if (tableData.value[i].id === tempCheckData[j].id) {
                tempCheckData[j] = tableData.value[i]
            }
        }
    }
    toggleSelection(tempCheckData, true)
}

const tHead = [
    { align: 'center', tooltip: true, type: 'selection', reserveSelection: true, minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'name', label: '角色名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'detail', label: '角色说明', minWidth: 100 }
]

const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    roleListFn()
}
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    roleListFn()
}

const multipleTableRef = ref(null)
// 表格选中的数据
const selectionDataFn = (val) => {
    emits('update:selectionData', val)
}

// 控制表格选中数据的 true/false
const toggleSelection = (rows, selected) => {
    const arr = []
    if (rows) {
        rows.forEach((row) => {
            if (!selected) {
                for (let i = 0; i < props.selectionData.length; i++) {
                    const element = props.selectionData[i]
                    if (row.id !== element.id) arr.push(element)
                }
                emits('update:selectionData', arr)
            }
            nextTick(() => {
                multipleTableRef.value.tableRef.toggleRowSelection(row, selected)
            })
        })
    } else {
        multipleTableRef.value.tableRef.clearSelection()
    }
}
const getRowKeys = (row) => {
    return row.id
}
</script>
<style lang="scss" scoped>

</style>
