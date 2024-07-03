<template>
    <div>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="所属业务线" prop="busiCode">
                        <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推广产品id" prop="productCode">
                        <el-input v-model="formData.productCode" placeholder="请输入产品id" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="推广产品名称" prop="productName">
                        <el-input v-model="formData.productName" placeholder="请输入产品名称" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="状态" prop="productStatus">
                        <el-select v-model="formData.productStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="24">
                    <el-form-item class="button-box">
                        <el-button @click="searchList" type="primary">查询</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                        <el-button @click="newBtn('new')" type="primary">新建</el-button>
                        <el-button @click="editBtn('edit')" type="primary">编辑</el-button>
                        <el-button @click="enableBtn('1')" type="primary">启用</el-button>
                        <el-button @click="disableBtn('2')" type="primary">禁用</el-button>
                    </el-form-item>
                </el-col>
            </el-row>

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
                @selection-change="handleSelectionChange"
            >
                <template #spuId="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer">{{row.row.spuId}}</span>
                </template>
                <template #productStatus="row">
                    <span>{{productStatusList[row.row.productStatus]}}</span>
                </template>
                <template #productType="row">
                    <span>{{producttypelist[row.row.productType]}}</span>
                </template>
                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
                <template #saleChannel="row">
                    <span>{{formatValue(row.row.saleChannel) }}</span>
                    <!-- <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span> -->
                </template>
            </system-list>
        </div>
    </div>
    <el-dialog
        v-model="dialogCancel"
        width="40%"
    >
        <div style="font-size: 18px;width: 100%;text-align: left;margin: 0px 10px 20px 0px">是否{{typebtn === '1' ? '启' : '禁'}}用所选数据，共{{indexvalue}}条</div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogCancel = false">关闭</el-button>
                <el-button type="primary" @click="submitReason(ruleFormRef)"
                >确认</el-button
                >
            </span>
        </template>
    </el-dialog>
    <detail-idx v-if="dialogTableVisible" :visible="dialogTableVisible" :title="Title" :rowList="rowList" @clostDialog="clostDialog"></detail-idx>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import DetailIdx from './dialog/index.vue'
import { useStore } from 'vuex'
import { productlist, allbusiness, productenable } from '@/api/promocodeManagement/index'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const spuId = route.params.spuId
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
const productStatusList = {
    1: '启用', 2: '禁用'
}
// 1-商家入驻 2-用户拉新 3-货柜分期 4-全款货柜
const producttypelist = {
    1: '本地商家入驻', 2: '本地生活拉新', 3: '到家电商拉新', 4: '门店拉新', 5: '货柜分期', 6: '全款货柜'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        busiCode: '',
        productCode: '',
        productName: '',
        productStatus: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    await business()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productCode', label: '推广产品id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productName', label: '推广产品名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'productType', label: '推广产品类型', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'productStatus', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '更新人', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '更新时间', minWidth: 150 }
]
const dialogTableVisible = ref(false)
const editGoods = ref([])
const newGoods = ref([])
const Reason = ref('')
const showDialog = async (row) => {
    const image = ref('')
    if (row.spuMediaList !== null) {
        for (let i = 0; i < row.spuMediaList.length; i++) {
            if (row.spuMediaList[i].mediaType + '' === '2') {
                image.value = row.spuMediaList[i].mediaUrl
            }
        }
    }
    row.image = image.value
    dialogTableVisible.value = true
    editGoods.value = row
}
const dialogDetailVisible = ref(false)
const showDatailDialog = async (row) => {
    dialogDetailVisible.value = true
    // editGoods.value = row
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        productCode: dataState.formData.productCode,
        productName: dataState.formData.productName,
        productStatus: dataState.formData.productStatus,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await productlist(param)
    editGoods.value = res.data.oldSpuInfo
    newGoods.value = res.data.spuInfo
    Reason.value = res.data.replaceReason
}
const dialogRebindVisible = ref(false)
// 处理数据
const formatValue = (value) => {
    if (!value) return ''
    const reg = /B2B/gi
    const rst = value.toLowerCase().replace(reg, '进货')
    return rst
}
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 全选
const selectlist = ref([])
const handleSelectionChange = (val) => {
    selectlist.value = val
    console.log(val, ' spuIdsList.value')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getTableList()
}
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 获取推广产品列表
const getTableList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: dataState.formData.busiCode,
        productCode: dataState.formData.productCode,
        productName: dataState.formData.productName,
        productStatus: dataState.formData.productStatus,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await productlist(param)
    const resultdata = res.data
    dataState.tableData = resultdata
    pageInfo.value.total = res.count
}
const dialogCancel = ref(false)
const typebtn = ref('')
// 启用禁用
const indexvalue = ref(0)
const enableBtn = (val) => {
    if (selectlist.value.length) {
        dialogCancel.value = true
        indexvalue.value = selectlist.value.length
        typebtn.value = val
    } else {
        ElMessage({
            type: 'error',
            message: '至少选择一条数据'
        })
    }
}
// 启用禁用
const disableBtn = async (val) => {
    if (selectlist.value.length) {
        dialogCancel.value = true
        indexvalue.value = selectlist.value.length
        typebtn.value = val
    } else {
        ElMessage({
            type: 'error',
            message: '至少选择一条数据'
        })
    }
}
const submitReason = async () => {
    const arrlist = ref([])
    for (let i = 0; i < selectlist.value.length; i++) {
        arrlist.value.push(selectlist.value[i].productCode)
    }
    if (typebtn.value === '1') {
        const param = {
            appKey: 'A1001001',
            idSet: arrlist.value,
            status: 1,
            modifierId: userInfo.value.name
        }
        await productenable(param)
        ElMessage({
            type: 'success',
            message: '修改成功'
        })
        dialogCancel.value = false
        getTableList()
    } else {
        const param = {
            appKey: 'A1001001',
            idSet: arrlist.value,
            status: 2,
            modifierId: userInfo.value.name
        }
        await productenable(param)
        dialogCancel.value = false
        ElMessage({
            type: 'success',
            message: '修改成功'
        })
        getTableList()
    }
    // const param = {
    //     appKey: 'A1001001',
    //     idSet: arrlist.value,
    //     status: 1,
    //     modifierId: userInfo.value.name
    // }
    // await productenable(param)
    // ElMessage({
    //     type: 'success',
    //     message: '修改成功'
    // })
}
const clostDialog = () => {
    dialogTableVisible.value = false
    getTableList()
}
const Title = ref('')
const newBtn = (titledata) => {
    dialogTableVisible.value = true
    Title.value = titledata
}
const rowList = ref('')
const editBtn = (titledata) => {
    if (selectlist.value.length === 1) {
        dialogTableVisible.value = true
        Title.value = titledata
        rowList.value = selectlist.value[0]
    } else {
        ElMessage({
            type: 'error',
            message: '请选择一条数据'
        })
    }
    // dialogTableVisible.value = true
    // Title.value = titledata
}
const dialogTableListRef = ref(null)
const bindSpu = async (formEl) => {
    if (!dialogTableListRef.value) return
    const selectionRows = dialogTableListRef.value.tableRef.getSelectionRows()
    if (selectionRows.length > 1) {
        ElMessage({
            type: 'error',
            message: '只能选择一条标品数据'
        })
        return
    }
    if (selectionRows.length === 0) {
        ElMessage({
            type: 'error',
            message: '请选择一条标品数据'
        })
        return
    }
    const image = ref('')
    if (selectionRows[0].spuMediaList !== null) {
        for (let i = 0; i < selectionRows[0].spuMediaList.length; i++) {
            if (selectionRows[0].spuMediaList[i].mediaType + '' === '2') {
                image.value = selectionRows[0].spuMediaList[i].mediaUrl
            }
        }
    }
    selectionRows[0].image = image.value
    newGoods.value = selectionRows[0]
    dialogRebindVisible.value = false
    if (!formEl) return
    formEl.resetFields()
}
// 跳转详情
const toDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 编辑
// const editBtn = (row) => {
//     const spuId = row.spuId
//     // router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: dataState.formData.spuTemplate, spuId: row.spuId } })
//     router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: row.spuTemplate, spuId: row.spuId } })
// }
// 查看详情
const checkDetail = (row) => {
    router.push({ name: 'spu-model-training-list', params: { goodsId: row.spuId } })
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
.content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
</style>
