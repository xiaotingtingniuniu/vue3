<template>
    <div>
        <!-- <pdf></pdf> -->
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-form-item label="SPU编号" prop="spuId">
                <el-input v-model="formData.spuId" placeholder="精确匹配" clearable />
            </el-form-item>
            <el-form-item label="品牌名称" prop="brandName">
                <el-input v-model="formData.brandName" placeholder="请输入品牌名称" clearable />
            </el-form-item>
            <el-form-item label="标品名称" prop="spuName">
                <el-input v-model="formData.spuName" placeholder="请输入标品名称" clearable />
            </el-form-item>
            <el-form-item label="货柜商品名称" prop="spuContainerName">
                <el-input v-model="formData.spuContainerName" placeholder="请输入商品名称" clearable />
            </el-form-item>
            <el-form-item label="69码" prop="barcodes">
                <el-input v-model="formData.barcodes" placeholder="请输入完整的69码" clearable />
            </el-form-item>
            <el-form-item label="模型训练状态" prop="modelStatus">
                <el-select v-model="formData.modelStatus" placeholder="请选择">
                    <el-option label="全部" value="" />
                    <el-option label="初始" :value="0" />
                    <el-option label="训练中" :value="1" />
                    <el-option label="训练完成" :value="2" />
                    <el-option label="上新失败" :value="80" />
                    <el-option label="训练失败" :value="99" />
                </el-select>
            </el-form-item>
            <el-form-item class="button-box">
                <el-button @click="searchList" type="primary">搜 索</el-button>
            </el-form-item>
        </el-form>
        <div>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #spuId="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" @click="checkDetail(row.row)">{{row.row.spuId}}</span>
                </template>
                <template #isEnabled="isEnabled">
                    <span type="text" v-if="isEnabled.row.isEnabled === 1" >启用</span>
                    <span type="text" v-if="isEnabled.row.isEnabled === 0" >停用</span>
                </template>
                <template #modelStatus="row">
                    {{modelStatusList[row.row.modelStatus]}}
                </template>
                <template #logoImage="row">
                    <img :src="row.row.logoImage" alt="" style="width: 100px">
                </template>
                <template #listImage="row">
                    <img :src="row.row.listImage" alt="" style="width: 100px">
                </template>
                <template #operation="row">
                    <el-button  class="edit-btn" @click="showEditDialog(row.row)" type="primary">编辑</el-button>
                </template>
                <template #isMaterial="row">
                    <el-button class="text-btn db" @click="checkModel(row.row)" type="primary" text>模型训练媒体文件</el-button>
                </template>
                <template #status="row">
                    {{statusList[row.row.status]}}
                </template>
            </system-list>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="编辑"
            width="30%"
            :before-close="handleClose"
        >
            <el-form :inline="true" :model="formEdit" class="demo-form-inline" ref="editNameRef">
                <el-form-item label="货柜商品名称" prop="name" :rules="rules.name">
                    <el-input v-model="formEdit.name" placeholder="请输入" maxlength="32"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">关闭</el-button>
                    <el-button type="primary" @click="editSubmit(editNameRef)">保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()

const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const statusList = {
    0: '未推送',
    1: '已推送',
    2: '训练失败',
    3: '训练成功'
}
const dataState = reactive({
    formData: {
        spuId: '',
        spuName: '',
        brandName: '',
        barcodes: '', // 69码
        modelStatus: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    // await getPinpaiList()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 300, slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'spuContainerName', label: '货柜商品名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'suggSellingPrice', label: '建议售卖价', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'guidePrice', label: '官方指导价（¥）', minWidth: 100 },
    { align: 'center', prop: 'logoImage', label: '正面Logo图', minWidth: 100, slot: true },
    { align: 'center', prop: 'listImage', label: '列表图', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'isEnabled', label: '状态', minWidth: 80, slot: true },
    { align: 'center', tooltip: true, prop: 'isMaterial', label: '多媒体素材管理', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}

const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
const createSpu = () => {
    console.log(dataState.formData.spuTemplates)
    if (!dataState.formData.spuTemplates) return ElMessage.error('请选择属性模版！')
    router.push({
        name: 'spu-management-editor',
        params: {
            type: 'add',
            spuTemplate: dataState.formData.spuTemplates
        }
    })
}

// 获取SPU列表
const getTableList = async () => {
    const params = {
        spuId: dataState.formData.spuId,
        spuName: dataState.formData.spuName,
        spuContainerName: dataState.formData.spuContainerName,
        brandName: dataState.formData.brandName,
        barcode: dataState.formData.barcodes,
        modelStatus: dataState.formData.modelStatus,
        currPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await publicRequest({ key: 'CONTAINER_PRODUCT_LIBRARY_LIST', body: params })
    dataState.tableData = res.data.list
    pageInfo.value.total = res.data.totalCount
}
// 跳转详情
const checkDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'container-product-detail', params: { spuId: row.spuId } })
}
// 查看媒体素材
const checkModel = (row) => {
    router.push({ name: 'model-detail', params: { goodsId: row.spuId } })
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}

// 编辑操作
const dialogVisible = ref(false)
const editSpuId = ref('')
const formEdit = ref({
    name: ''
})
const rules = reactive({
    name: [{ required: true, message: '请输入', trigger: 'change' }]
})
const showEditDialog = (row) => {
    dialogVisible.value = true
    editSpuId.value = row.spuId
    formEdit.value.name = row.spuContainerName
}
const handleClose = () => {
    dialogVisible.value = false
}
const editNameRef = ref()
const editSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (!valid) return
        const params = {
            spuId: editSpuId.value,
            spuContainerName: formEdit.value.name
        }
        const res = await publicRequest({ key: 'CONTAINER_PRODUCT_LIBRARY_LIST_EDIT', body: params })
        if (res.code === '200') {
            ElMessage.success(res.message)
            handleClose()
            searchList()
        }
    })
}
</script>
<style lang="scss" scoped>
a{
    text-decoration-line: none;
}
.edit-btn{
    color: #ffffff;
    margin-right: 10px;
}
.text-btn{
    color: rgb(254, 44, 85);
    margin: auto !important;
    cursor:pointer;
}
.db{
    display: block;
}
</style>
