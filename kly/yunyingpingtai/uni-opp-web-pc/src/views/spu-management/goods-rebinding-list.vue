<template>
    <div>
        <pdf></pdf>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="SPU编号" prop="spuId">
                        <el-input v-model="formData.spuId" placeholder="精确匹配" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标品名称" prop="spuName">
                        <el-input v-model="formData.spuName" placeholder="请选择标品名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="Goods编号" prop="goodsId">
                        <el-input v-model="formData.goodsId" placeholder="请选择Goods编号" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="69码" prop="barcode">
                        <el-input v-model="formData.barcode" placeholder="请输入完整的69码" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商家编号" prop="merchantId">
                        <el-input v-model="formData.merchantId" placeholder="请选择商家编号" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商家名称" prop="merchantName">
                        <el-input v-model="formData.merchantName" placeholder="请选择商家名称" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="换绑状态" prop="ReplaceFlag">
                        <el-select v-model="formData.ReplaceFlag" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="未换绑" value="0" />
                            <el-option label="已换绑" value="1" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item class="button-box">
                        <el-button @click="searchList" type="primary">搜 索</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
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
                <template #supplierType="scope">
                    <span type="text" v-if="scope.row.supplierType === 1" >一件代发</span>
                    <span type="text" v-if="scope.row.supplierType === 2" >入库</span>
                    <span type="text" v-if="scope.row.supplierType === 3" >一件代发+入库</span>
                </template>
                <template #isEnabled="isEnabled">
                    <span type="text" v-if="isEnabled.row.isEnabled === 1" >启用</span>
                    <span type="text" v-if="isEnabled.row.isEnabled === 0" >停用</span>
                </template>
                <template #goodsMediaList="row">
                    <span>{{row.row.goodsMediaList[0].mediaUrl}}</span>
                </template>
                <template #CateName="row">
                    <span>{{row.row.CateName}}</span>
                </template>
                <template #modelStatus="row">
                    <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span>
                </template>
                <template #spuTemplate="row">
                    {{dataState.spuTemplateList.find(el => row.row.spuTemplate === el.template).name}}
                </template>
                <template #goodsReplaceFlag="row">
                    <span>{{rebindingList[row.row.goodsReplaceFlag]}}</span>
                </template>
                <template #goodsStatus="row">
                    <span>{{goodsStatusList[row.row.goodsStatus]}}</span>
                </template>
                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
                <template #saleChannel="row">
                    <span>{{formatValue(row.row.saleChannel) }}</span>
                    <!-- <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span> -->
                </template>
                <template #operation="row">
                    <el-button  class="edit-btn" @click="showDatailDialog(row.row, 0)" type="primary">替换SPU</el-button>
                    <el-button  v-if="row.row.goodsReplaceFlag" class="edit-btn" @click="showDatailDialog(row.row, 1)" type="primary">查看详情</el-button>
                </template>
            </system-list>
        </div>
    </div>
    <standard-detail v-if="dialogDetailVisible" :visible="dialogDetailVisible" :rowType="rowType" @clostDialog="dialogDetailVisible = false" :rowList="rowList" :modifySource="modifySource"></standard-detail>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import StandardDetail from './dialog/detail.vue'
import { useStore } from 'vuex'
import { goodsrebindinglist, getMerchantList, detaillist } from '@/api/operate/index'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import pdf from './pdf.vue'
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
const statusList = {
    0: '未推送',
    1: '已推送',
    2: '训练失败',
    3: '训练成功'
}
const rebindingList = {
    0: '未换绑', 1: '已换绑'
}
const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
// 1.初始核、2.已审核、3.已拒绝、4.启用、5.停用、6.暂时停用
const goodsStatusList = {
    1: '初始核', 2: '已审核', 3: '已拒绝', 4: '启用', 5: '停用', 6: '暂时停用'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        spuId: spuId,
        spuName: '',
        goodsId: '',
        barcode: '', // 69码
        merchantId: '',
        merchantName: '',
        spuTemplates: '',
        rebindingcode: '',
        ReplaceFlag: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    await getTableList()
})
// 表头
const tHead = [
    { align: 'center', tooltip: true, prop: 'goodsId', label: 'Goods编号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'goodsName', label: 'Goods名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'imgUrl', label: 'Goods图片', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'CateName', label: '基础类目', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'goodsStatus', label: 'Goods状态', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 300, slot: true },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 150 },
    // { align: 'center', tooltip: true, prop: 'replaceLogNo', label: '换绑记录编号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'goodsReplaceFlag', label: '换绑状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 300, slot: true }
]
const dialogSearch = ref({
    spuId: null,
    spuName: null,
    barcode: null
})
const dialogTableVisible = ref(false)
const editGoods = ref([])
const newGoods = ref([])
const Reason = ref('')
const dialogDetailVisible = ref(false)
const rowList = ref('')
const modifySource = ref(2)
const rowType = ref(0)
const showDatailDialog = (row, val) => {
    dialogDetailVisible.value = true
    rowList.value = row
    rowType.value = val
}
const dialogRebindVisible = ref(false)
const rebindDialog = () => {
    dialogRebindVisible.value = true
}
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
const spuIdsList = ref([])
const handleSelectionChange = (val) => {
    spuIdsList.value = val.map(item => item.spuId)
    console.log(spuIdsList.value, ' spuIdsList.value')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getTableList()
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
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        spuIds: dataState.formData.spuId ? [dataState.formData.spuId] : [],
        spuName: dataState.formData.spuName,
        brandNames: dataState.formData.brandName ? [dataState.formData.brandName] : [],
        barcodes: dataState.formData.barcode ? [dataState.formData.barcode] : [],
        goodsIds: dataState.formData.goodsId ? [dataState.formData.goodsId] : [],
        merchantIds: dataState.formData.merchantId ? [dataState.formData.merchantId] : [],
        merchantNames: dataState.formData.merchantName ? [dataState.formData.merchantName] : [],
        goodsReplaceFlag: dataState.formData.ReplaceFlag,
        isEnabled: 1,
        pageNo: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await goodsrebindinglist(param)
    const resultdata = res.data.list
    for (let i = 0; i < resultdata.length; i++) {
        const imgurl = ref('')
        if (resultdata[i].goodsMediaList !== null) {
            for (let j = 0; j < resultdata[i].goodsMediaList.length; j++) {
                if (resultdata[i].goodsMediaList[j].mediaType === 2) {
                    imgurl.value = resultdata[i].goodsMediaList[j].mediaUrl
                }
            }
        }
        console.log(imgurl.value + 'imgurl')
        resultdata[i].imgUrl = imgurl.value
        resultdata[i].CateName = `${resultdata[i].firstCateName}/${resultdata[i].secondCateName}/${resultdata[i].thirdCateName}/${resultdata[i].fourthCateName}`
    }
    dataState.tableData = resultdata
    pageInfo.value.total = res.data.total
}
const newGoodsList = (val) => {
    newGoods.value = val
}
// 关闭弹窗
const clostDialog = () => {
    dialogTableVisible.value = false
    Reason.value = ''
    newGoods.value = []
    editGoods.value = []
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
// 获取属性模版列表
const getTemplateList = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001004'
    }
    const res = await publicRequest({ key: 'SPU_TEMPLATE_LIST_V3', body: params })
    if (res.code === '200') {
        dataState.spuTemplateList = res.data
    }
    console.log(res, ' res')
}
getTemplateList()

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
