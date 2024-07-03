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
                    <el-form-item label="69码" prop="barcodes">
                        <el-input v-model="formData.barcodes" placeholder="请输入完整的69码" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="模型训练状态" prop="modelStatuss">
                        <el-select v-model="formData.modelStatuss" placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="初始" :value="0" />
                            <el-option label="训练中" :value="1" />
                            <el-option label="训练完成" :value="2" />
                            <el-option label="上新失败" :value="80" />
                            <el-option label="训练失败" :value="99" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="属性模版" prop="spuTemplates">
                        <el-select v-model="formData.spuTemplates" placeholder="请选择" clearable>
                            <el-option v-for="item in dataState.spuTemplateList" :label="item.name" :value="item.template" :key="item.template" />
                        </el-select>
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
                <template #goodsCount="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" v-if="row.row.goodsCount !== 0" @click="toGoods(row.row)">{{row.row.goodsCount}}</span>
                    <span style="color: rgb(254, 44, 85);cursor:pointer" v-else>{{row.row.goodsCount}}</span>
                </template>
                <template #skuCount="row">
                    <span style="color: rgb(254, 44, 85);cursor:pointer" v-if="row.row.skuCount !== 0" @click="toSku(row.row)">{{row.row.skuCount}}</span>
                    <span style="color: rgb(254, 44, 85);cursor:pointer" v-else>{{row.row.skuCount}}</span>
                </template>
                <template #modelStatus="row">
                    <span v-if="row.row.modelList">{{modelStatusList[row.row.modelList[0]?.modelStatus]}}</span>
                    <span v-else>--</span>
                </template>
                <template #spuStatus="row">
                    <span>{{spuStatusList[row.row.spuStatus]}}</span>
                </template>
                <template #spuTemplate = "row">
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
                    <el-button @click="showDatailDialog(row.row, 0)" type="primary">替换SPU</el-button>
                    <el-button v-if="row.row.replaceLogNo" @click="showDatailDialog(row.row, 1)" type="primary">查看详情</el-button>
                </template>
                <template #status="row">
                    {{statusList[row.row.status]}}
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
import { spurebindinglist, getMerchantList, detaillist } from '@/api/operate/index'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import pdf from './pdf.vue'
import { de } from 'element-plus/lib/locale'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

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
// 0初始，10启用，20停用，30停用不下架
const spuStatusList = {
    0: '初始', 10: '启用', 20: '停用', 30: '停用不下架'
}

// tab 默认值切换
const activeName = ref('fast_food')
const dialogSearch = ref({
    spuId: null,
    spuName: null,
    barcode: null
})
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        spuId: '',
        spuName: '',
        brandName: '',
        barcodes: '', // 69码
        modelStatuss: '',
        spuTemplates: '',
        spuTemplate: 'fast_food',
        ReplaceFlag: ''
    },
    tableData: []
})
const { formData, tableData } = toRefs(dataState)
onMounted(async () => {
    await getTemplateList()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 300, slot: true },
    { align: 'center', tooltip: true, prop: 'spuTemplate', label: '属性模板', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', minWidth: 80, slot: true },
    { align: 'center', tooltip: true, prop: 'guidePrice', label: '官方指导价（¥）', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'imgUrl', label: 'SPU主图', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'spuStatus', label: 'SPU状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'goodsCount', label: '已创建Goods数', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'skuCount', label: '已创建Sku数', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'replaceLogNo', label: '换绑记录编号', minWidth: 110 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 300, slot: true }
]
const dialogTableVisible = ref(false)
const editGoods = ref([])
const newGoods = ref([])
const Reason = ref('')
const dialogDetailVisible = ref(false)
const rowList = ref('')
const modifySource = ref(1)
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
        brandNames: dataState.formData.brandName.split(','),
        // spuTemplate: dataState.formData.spuTemplate,
        barcodes: dataState.formData.barcodes.split(','),
        spuTemplates: dataState.formData.spuTemplates ? [dataState.formData.spuTemplates] : [],
        modelStatuss: dataState.formData.modelStatuss !== '' ? [dataState.formData.modelStatuss] : [],
        spuReplaceFlag: dataState.formData.ReplaceFlag,
        isEnabled: 1,
        pageNo: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize,
        debug: true
    }
    const res = await spurebindinglist(param)
    const resultdata = res.data.list
    for (let i = 0; i < resultdata.length; i++) {
        const imgurl = ref('')
        if (resultdata[i].spuMediaList !== null) {
            for (let j = 0; j < resultdata[i].spuMediaList.length; j++) {
                if (resultdata[i].spuMediaList[j].mediaType === 2) {
                    imgurl.value = resultdata[i].spuMediaList[j].mediaUrl
                }
            }
        }
        console.log(imgurl.value + 'imgurl')
        resultdata[i].imgUrl = imgurl.value
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
// 跳转goods
const toGoods = (row) => {
    const spuId = row.spuId
    router.push({ name: 'goods-rebinding-list', params: { spuId: row.spuId } })
}
// 跳转sku
const toSku = (row) => {
    const spuId = row.spuId
    router.push({ name: 'sku-rebinding-list', params: { spuId: row.spuId } })
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
