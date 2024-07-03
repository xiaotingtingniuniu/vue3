<template>
    <el-dialog :model-value="true" title="选择员工账号" width="900px" @close="close" draggable>
        <el-card class="box-card">
            <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="80px">
                <el-form-item label="姓名" prop="name" style="width: 200px">
                    <el-input v-model.trim="formData.name" placeholder="员工姓名" />
                </el-form-item>
                <el-form-item label="员工账号" prop="emplid" style="width: 200px">
                    <el-input v-model.trim="formData.emplid" placeholder="员工账号" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" style="width: 200px">
                    <el-input v-model.trim="formData.mobile" placeholder="员工手机号" />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button @click="ehrManagerListFn(true)" type="primary">搜索</el-button>
                </el-form-item>
            </el-form>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                highlightCurrentRow
                @choiseTableItem="choiseTableItem"
            >
            </system-list>
        </el-card>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="close">取消</el-button>
                <el-button type="primary" @click="confirm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { ehrManagerList } from '@/api/authority'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['close', 'selectionData'])
const close = () => emits('close')
const confirm = () => {
    if (!currentRow.value) {
        return ElMessage({
            showClose: true,
            message: '请选择用户',
            type: 'warning'
        })
    }
    emits('selectionData', currentRow.value)
    close()
}

const pageInfo = ref({
    total: 1,
    currentPage: 1,
    pageSize: 10
})
const formData = ref({
    name: null,
    emplid: null,
    mobile: null
})

const tableData = ref([])
const ehrManagerListFn = async (restPage = false) => {
    if (!formData.value.name && !formData.value.emplid && !formData.value.mobile) {
        return ElMessage({
            showClose: true,
            message: '请输入筛选项',
            type: 'warning'
        })
    }
    if (restPage) (pageInfo.value.currentPage = 1)
    const { list, totalCount } = await ehrManagerList({
        ...formData.value,
        appKey: 'A1001000',
        busiCode: 'A1001000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    tableData.value = list
    pageInfo.value.total = totalCount
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'name', label: '姓名', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'emplid', label: '员工号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'mobile', label: '手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'email', label: '邮箱', minWidth: 130 }
]

const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    ehrManagerListFn()
}

const currentChange = (val) => {
    pageInfo.value.currentPage = val
    ehrManagerListFn()
}

const currentRow = ref(null)
const choiseTableItem = (val) => {
    currentRow.value = val
}
</script>
<style lang="scss">

</style>
