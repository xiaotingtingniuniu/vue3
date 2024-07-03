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
                    <el-form-item label="品牌名称" prop="brandName">
                        <el-input v-model="formData.brandName" placeholder="请选择品牌名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标品名称" prop="spuName">
                        <el-input v-model="formData.spuName" placeholder="请选择标品名称" clearable />
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
                    <el-form-item label="商家编号" prop="merchantIds">
                        <el-input v-model="formData.merchantIds" placeholder="请选择商家编号" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="商家名称" prop="merchantNames">
                        <el-input v-model="formData.merchantNames" placeholder="请选择商家名称" clearable />
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
                <template #modelStatus="row">
                    <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span>
                </template>
                <template #spuStatus="row">
                    <span>{{spuStatusList[row.row.spuStatus]}}</span>
                </template>
                <template #skuReplaceFlag="row">
                    <span>{{rebindingList[row.row.skuReplaceFlag]}}</span>
                </template>
                <template #skuStatus="row">
                    <span>{{skustatuslist[row.row.skuStatus]}}</span>
                </template>
                <template #spuTemplate="row">
                    {{dataState.spuTemplateList.find(el => row.row.spuTemplate === el.template).name}}
                </template>
                <template #saleChannel="row">
                    <span>{{formatValue(row.row.saleChannel) }}</span>
                    <!-- <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span> -->
                </template>
                <template #imgUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.imgUrl" :preview-src-list="[scope.row.imgUrl]" fit="cover" />
                </template>
                <template #operation="row">
                    <el-button  class="edit-btn" @click="showDatailDialog(row.row, 0)" type="primary">替换SPU</el-button>
                    <el-button  v-if="row.row.skuReplaceFlag" class="edit-btn" @click="showDatailDialog(row.row, 1)" type="primary">查看详情</el-button>
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
import { skurebindinglist, getMerchantList, detaillist } from '@/api/operate/index'
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
// 1.待审核、2.已审核、3.审核不通过、4.已上架、5.下架可上架、6.下架不可再上架、7.待上架
const skustatuslist = {
    1: '待审核', 2: '已审核', 3: '审核不通过', 4: '已上架', 5: '下架可上架', 6: '下架不可再上架', 7: '待上架'
}
const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
// 0初始，10启用，20停用，30停用不下架
const spuStatusList = {
    0: '初始', 10: '启用', 20: '停用', 30: '停用不下架'
}
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        spuId: spuId,
        spuName: '',
        brandName: '',
        merchantIds: '',
        merchantNames: '',
        spuTemplate: '',
        rebindingcode: '',
        ReplaceFlag: '',
        skuStatus: [1, 2, 3, 4, 5, 7],
        channelTypes: -1,
        skuReplaceFlag: '',
        barcode: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    await getTableList()
})
// 表头
const tHead = [
    // { align: 'center', tooltip: true, minWidth: 300, type: 'selection' },
    { align: 'center', tooltip: true, prop: 'skuId', label: 'Sku编号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'skuName', label: 'Sku名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'imgUrl', label: 'Sku图片', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'salePrice', label: 'Sku售价', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'goodsId', label: 'Goods编号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'goodsName', label: 'Goods名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'CateName', label: '基础类目', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: 'Sku状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 150, slot: true },
    // { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 110 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 150 },
    // { align: 'center', tooltip: true, prop: 'modelStatus', label: '换绑状态', minWidth: 110 },
    { align: 'center', tooltip: true, prop: 'skuReplaceFlag', label: '换绑状态', minWidth: 100, slot: true },
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
const modifySource = ref(3)
const rowType = ref(0)
const showDatailDialog = async (row, val) => {
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
        barcodes: dataState.formData.barcode ? [dataState.formData.barcode] : [],
        brandNames: dataState.formData.brandName ? [dataState.formData.brandName] : [],
        merchantIds: dataState.formData.merchantIds ? [dataState.formData.merchantIds] : [],
        merchantNames: dataState.formData.merchantNames ? [dataState.formData.merchantNames] : [],
        skuReplaceFlag: dataState.formData.ReplaceFlag,
        skuStatus: dataState.formData.skuStatus,
        channelTypes: [dataState.formData.channelTypes],
        isEnabled: 1,
        pageNo: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await skurebindinglist(param)
    const resultdata = res.data.list
    for (let i = 0; i < resultdata.length; i++) {
        const imgurl = ref('')
        if (resultdata[i].goodsMediaList !== null) {
            for (let j = 0; j < resultdata[i].goodsMediaList.length; j++) {
                if (resultdata[i].goodsMediaList[j].mediaType === 2) {
                    imgurl.value = resultdata[i].goodsMediaList[j].mediaUrl
                }
            }
            console.log(imgurl.value + 'imgurl')
        }
        resultdata[i].imgUrl = imgurl.value
        resultdata[i].CateName = `${resultdata[i].firstCateName}/${resultdata[i].secondCateName}/${resultdata[i].thirdCateName}/${resultdata[i].fourthCateName}`
        resultdata[i].ChannelName = `${resultdata[i].firstChannelName}/${resultdata[i].secondChannelName}`
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
