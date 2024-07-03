<template>
    <el-dialog custom-class="choise-organization-page" :model-value="true" title="选择组织" width="900px" @close="close" draggable>
        <el-card class="box-card">
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                <el-form-item label="组织名称" prop="name" style="width: 200px">
                    <el-input v-model="formData.name" placeholder="组织名称" />
                </el-form-item>
                <el-form-item label="组织编码" prop="code" style="width: 200px">
                    <el-input v-model="formData.code" placeholder="组织编码" />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button @click="organizationListFn(true)" type="primary">搜索</el-button>
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
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="close">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { organizationList } from '@/api/authority'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'update:selectionData'])
const props = defineProps(['selectionData'])

const close = () => emits('close')

const formData = ref({
    name: null,
    code: null,
    state: 1
})
const pageInfo = ref({
    total: 1,
    currentPage: 1,
    pageSize: 10
})

const tableData = ref([])
const organizationListFn = async (restPage = false) => {
    if (!formData.value.name && !formData.value.code) {
        return ElMessage({
            showClose: true,
            message: '请输入筛选项',
            type: 'warning'
        })
    }
    if (restPage) (pageInfo.value.currentPage = 1)
    const { list, totalCount } = await organizationList({
        ...formData.value,
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    tableData.value = list
    pageInfo.value.total = totalCount
    checkRows()
}

const checkRows = () => {
    const checkedList = JSON.parse(JSON.stringify(props.selectionData))
    nextTick(() => {
        tableData.value.forEach((row) => {
            checkedList.forEach((item) => {
                if (item.id === row.id) {
                    multipleTableRef.value.tableRef.toggleRowSelection(row, true)
                }
            })
        })
    })
}

const tHead = [
    { align: 'center', tooltip: true, type: 'selection', reserveSelection: true, minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'name', label: '组织名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'code', label: '组织编码', minWidth: 100 }
]
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    organizationListFn()
}
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    organizationListFn()
}
const getRowKeys = (row) => {
    return row.id
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
</script>
<style lang="scss">
.choise-organization-page{
    .el-tag{
        max-width: 150px;
    }
    .el-tag__content{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inline-block;
        justify-content: flex-start;
    }
}

</style>
