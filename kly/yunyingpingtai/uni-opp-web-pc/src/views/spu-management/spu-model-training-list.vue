<template>
    <div>
        <pdf></pdf>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-form-item label="SPU编号" prop="spuId">
                <!--<el-select v-model="formData.state" placeholder="精确匹配">
                    <el-option label="A1" :value="1" />
                    <el-option label="A2" :value="0" />
                </el-select>-->
                <el-input v-model="formData.spuId" placeholder="精确匹配" clearable />
            </el-form-item>
            <!-- <el-form-item label="品牌名称" prop="brandName">
                <el-select v-model="formData.brandName" clearable placeholder="请选择">
                    <el-option v-for="el in brandNameList" :label="el.brandName" :value="el.brandName" :key="el.brandName" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="标品名称" prop="spuName">
                <el-input v-model="formData.spuName" placeholder="请选择商品名称" clearable />
            </el-form-item>
            <el-form-item label="69码" prop="barcode">
                <el-input v-model="formData.barcode" placeholder="请输入完整的69码" clearable />
            </el-form-item>
            <el-form-item label="模型训练状态" prop="modelStatus">
                <el-select v-model="formData.modelStatus" placeholder="请选择" clearable>
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
            <el-button @click="submitList" type="primary">批量推送</el-button>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"  @selection-change="handleSelectionChange">
                <!-- supplierType'供应商类型：1：一件代发、2：入库、3：一件代发+入库', -->
                <!-- <template #supplierType="scope">
                    <span type="text" v-if="scope.row.supplierType === 1" >一件代发</span>
                    <span type="text" v-if="scope.row.supplierType === 2" >入库</span>
                    <span type="text" v-if="scope.row.supplierType === 3" >一件代发+入库</span>
                </template>
                <template #isEnabled="isEnabled">
                    <span type="text" v-if="isEnabled.row.isEnabled === 1" >启用</span>
                    <span type="text" v-if="isEnabled.row.isEnabled === 0" >停用</span>
                </template> -->
                <!-- 1自研 2旷世 3嗨便利 -->
                <template #algModels="algModels">
                    <p type="test" v-for="item in algModels.row.algModels" :key="item">{{item==='1'?'自研':item==='2'?'旷视':item==='3'?'嗨便利':''}}</p>
                </template>
                <!-- 0 初始 1 训练中 2 训练完成 99 训练失败 -->
                <template #modelStatus="scope">
                    <span type="text" v-if="scope.row.modelStatus === 0" >初始</span>
                    <span type="text" v-if="scope.row.modelStatus === 1" >训练中</span>
                    <span type="text" v-if="scope.row.modelStatus === 2" >训练完成</span>
                    <span type="text" v-if="scope.row.modelStatus === 80" >上新失败</span>
                    <span type="text" v-if="scope.row.modelStatus === 99" >训练失败</span>
                </template>
                <template #goodsImg="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.goodsImg"
                        :zoom-rate="1.2"
                        :preview-src-list="[scope.row.goodsImg]"
                        :initial-index="4"
                        fit="cover"
                    />
                </template>
                <template #operation="row">
                    <!--<router-link  :to="{name: 'spu-management-editor', params: {type:'edit',spuTemplate:formData.spuTemplate}}">-->
                    <el-button  class="edit-btn" @click="editBtn(row.row)" type="primary">查看</el-button>
                    <el-button  class="edit-btn" @click="addedCheck(row.row)" type="primary">再次查询</el-button>
                    <!--</router-link>-->
                    <el-button v-if="row.row.modelStatus === 1 || row.row.modelStatus === 3" @click="pushSpu(row)" type="primary">推送</el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import pdf from './pdf.vue'
import { async } from 'q'
const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
// tab 默认值切换
const activeName = ref('fast_food')
const dataState = reactive({
    formData: {
        spuId: '',
        spuName: '',
        brandName: '',
        spuTemplate: '',
        modelStatus: '',
        barcode: ''
    },
    tablist: [
        {
            tabname: '方便速食',
            spuTemplate: 'fast_food'
        },
        {
            tabname: '主食面点',
            spuTemplate: 'pastry'
        },
        {
            tabname: '卤味熟食',
            spuTemplate: 'cooked_food'
        },
        {
            tabname: '调味酱汁',
            spuTemplate: 'sauces'
        }
    ],
    tableData: []
})
const { formData, tablist, tableData } = toRefs(dataState)
onMounted(async () => {
    console.log(route.params.goodsId, 123123123)
    dataState.formData.spuId = route.params.goodsId
    await getPinpaiList()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'center', tooltip: true, minWidth: 76, type: 'selection' },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', minWidth: 300 },
    { align: 'center', tooltip: true, prop: 'applyId', label: '商品标识ID', minWidth: 140 },
    // { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 140 },
    // { align: 'center', tooltip: true, prop: 'barcode', label: '商品图片', minWidth: 140, slot: true },
    // { align: 'center', tooltip: true, prop: 'saleChannel', label: '产地', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'algModels', label: '适用算法', minWidth: 80, slot: true },
    { align: 'center', tooltip: true, prop: 'resultId', label: '模型ID', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'sendTime', label: '推送时间', minWidth: 110 },
    // { align: 'center', tooltip: true, prop: 'goodsImg', label: 'KSID', minWidth: 110 },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 110, slot: true },
    { align: 'center', tooltip: true, prop: 'finishTime', label: '建模完成时间', minWidth: 110 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 300, slot: true }
]
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 切换TAB
const handleClick = (tab, event) => {
    dataState.formData.spuTemplate = tab.props.name
    pageInfo.value.currentPage = 1
    getTableList()
}

// 全选
const spuIdsList = ref([])
const handleSelectionChange = (val) => {
    spuIdsList.value = val.map(item => item.spuId)
    console.log(spuIdsList.value, ' spuIdsList.value')
}
const submitList = async () => {
    if (spuIdsList.value.length > 0) {
        const parm = {
            body: {
                appKey: 'A1001000',
                busiCode: 'A1001001',
                spuIds: spuIdsList.value
            },
            appKey: 'A1001000',
            busiCode: 'A1001001',
            configCode: 'UC32051390528004096',
            name: 'SPU训练批量推送V3',
            source: '商品中台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        }
        const res = await getMerchantListCode(parm)
        if (res.code === '200') {
            ElMessage.success('成功')
            getTableList()
        }
    } else {
        ElMessage.error('请勾选SPU列表！')
    }
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
// 品牌搜索
const brandNameList = ref([])
const getPinpaiList = async () => {
    const parm = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            currPage: 1,
            pageSize: 999
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657693014433SoKeV',
        name: '品牌查询',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(parm)
    brandNameList.value = res.records
}
// 获取SPU列表
const getTableList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: dataState.formData.spuId,
            spuName: dataState.formData.spuName,
            brandName: dataState.formData.brandName,
            spuTemplate: dataState.formData.spuTemplate,
            modelStatus: dataState.formData.modelStatus,
            barcode: dataState.formData.barcode,
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC18418238653853696',
        name: 'SPU训练分页列表',
        url: '/goods/spu/model/list/v1',
        source: '商品中台'
    }
    const res = await getMerchantList(param)
    tableData.value = res.records
    pageInfo.value.total = res.total
}
// 编辑
const editBtn = (row) => {
    const spuId = row.spuId
    router.push({ name: 'model-detail', params: { goodsId: row.spuId } })
}
// 补偿结果查询
const addedCheck = async (row) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: row.spuId
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'SPU推送结果补偿',
        url: '/goods/spu/model/compensation/v1',
        source: '商品中台'
    }
    const res = await getMerchantListCode(param)
    if (res.code === '200') {
        ElMessage.success('推送成功,请稍后查看结果！')
    } else {
        ElMessage.error('推送失败,请稍后再试！')
    }
}
// 停用/启用
const stopBtn = async (num, row) => {
    let codeName = '启用'
    let configCode = 'UC1657692954782aSE9W'
    let name = ''
    if (num === 1) {
        codeName = '启用'
        name = 'SPU启用'
        configCode = 'UC1657692954782aSE9W'
    } else if (num === 0) {
        codeName = '停用'
        name = 'SPU停用'
        configCode = 'UC16576928834392Nnv5'
    }
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: row.row.spuId,
            spuTemplate: dataState.formData.spuTemplate
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: configCode,
        name: name,
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        'SPU停用后，所有SPU关联的Goods、SKU将全部下架！',
        // `确定要${codeName}吗？`,
        '确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await getMerchantList(param)
            ElMessage.success(codeName + '成功')
            getTableList()
        })
}
const pushSpu = async (row) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            spuId: row.row.spuId // ,
            // modelCodeList: [row.row.modelCode]
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: 'SPU训练推送',
        url: '/goods/spu/model/send/v1',
        source: '商品中台'
    }
    const res = await getMerchantList(param)
}
// 查看素材媒体文件跳转
const checkMaterial = (row) => {
    router.push({ name: 'apply-detail', params: { goodsId: row.spuId } })
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
