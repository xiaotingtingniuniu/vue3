<!-- sku管理 -->
<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="一级基础分类" prop="firstCateName">
                            <el-select v-model="searchData.firstCateName" clearable placeholder="请选择"
                                       filterable
                                       remote :remote-method="remoteMethodFirst">
                                <el-option v-for="el in firstCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="二级基础分类" prop="secondCateName">
                            <el-select
                                v-model="searchData.secondCateName"
                                clearable
                                placeholder="请选择"
                                filterable
                                remote :remote-method="remoteMethodSecond"
                            >
                                <el-option v-for="el in secondCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="三级基础分类" prop="thirdCateName">
                            <el-select v-model="searchData.thirdCateName" clearable placeholder="请选择"
                                       filterable
                                       remote :remote-method="remoteMethod">
                                <el-option v-for="el in thirdCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="四级基础分类" prop="fourthCateName">
                            <el-select
                                v-model="searchData.fourthCateName"
                                clearable
                                placeholder="请选择"
                                filterable
                                remote :remote-method="remoteMethodFour"
                            >
                                <el-option v-for="el in fourCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="spu编号" prop="spuId">
                            <el-input v-model.trim="searchData.spuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="标品名称" prop="spuName">
                            <el-input v-model.trim="searchData.spuName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="69码" prop="barcode">
                            <el-input v-model.trim="searchData.barcode" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="算法类型" prop="modelCode">
                            <el-select v-model="searchData.modelCode" clearable placeholder="请选择" >
                                <el-option label="旷视" :value="0" />
                                <el-option label="弹簧柜" :value="1" />
                                <el-option label="美智视觉柜" :value="2" />
                                <el-option label="嗨便利视觉柜" :value="3" />
                                <el-option label="自研柜" :value="4" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="6">
                        <el-form-item label="存储条件" prop="storageStyle">
                            <el-select v-model="searchData.storageStyle" clearable placeholder="请选择" >
                                <el-option label="常温" value="常温" />
                                <el-option label="冷藏" value="冷藏" />
                                <el-option label="冷冻" value="冷冻" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="是否为热销" prop="skuName">
                            <el-select v-model.trim="searchData.brandName" clearable placeholder="请选择" >
                                <el-option label="全部" :value="0" />
                                <el-option label="是" :value="1" />
                                <el-option label="否" :value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="search()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                border
                :tableData="tableData"
                v-model:current-page="pageinfo.currPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #image="scope">
                    <div v-if="scope.row.spuListPicUrl === null || scope.row.spuListPicUrl === ''">
                        -
                    </div>
                    <div v-else>
                        <img :src="scope.row.spuListPicUrl"  alt="">
                    </div>
                </template>
                <template #salePrice="scope">
                    <div style="color:lightskyblue; cursor:pointer" @click="godetail(scope.row.spuId, 'detail')">模型训练媒体文件</div>
                </template>
                <template #productShelfLife="scope">
                    <div v-if="scope.row.productShelfLife === null || scope.row.productShelfLife === '' "> - </div>
                    <div v-else>
                        {{ scope.row.productShelfLife + (scope.row.productShelfLifeUnit === null ? '' : scope.row.productShelfLifeUnit)}}
                    </div>
                </template>
                <template #operation="scope">
                    <el-button type="primary" v-if="scope.row.spuId" @click="goDetail('publicGoodsDetail', scope.row.spuTemplate, scope.row.spuId)">查看</el-button>
                    <!-- <el-button type="primary" v-if="scope.row.spuId">设为热销</el-button> -->
                </template>
            </system-list>
        </div>
        <Detail v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :rowList = "rowList" :type="type" @fevent="getPagingList()"></Detail>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import Detail from './detail.vue'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const tHead = [
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号', minWidth: '250', fixed: true },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: '250', fixed: true },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '一级基础类目' },
    { align: 'center', tooltip: true, prop: 'secondCateName', label: '二级基础类目' },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级基础类目' },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级基础类目' },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌', fixed: true },
    { align: 'center', tooltip: true, prop: 'productTaste', label: '口味', fixed: true },
    { align: 'center', tooltip: true, prop: 'productSpec', label: '商品规格', fixed: true },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', fixed: true },
    { align: 'center', tooltip: true, prop: 'netRatio', label: '净含量' },
    // { align: 'center', tooltip: true, prop: 'netRatioUnit', label: '净含量单位' },
    { align: 'center', tooltip: true, prop: 'barcode', minWidth: '200', label: '69码' },
    { align: 'center', tooltip: true, prop: 'productShelfLife', label: '保质期', slot: true },
    { align: 'center', tooltip: true, prop: 'image', label: '商品展示图片', minWidth: '200', mixWidth: '200', mixHeight: '200', slot: true },
    { align: 'center', tooltip: true, prop: 'storageStyle', label: '存储方式' },
    { align: 'center', tooltip: true, prop: 'salePrice', label: '模型训练详情', minWidth: '150', slot: true },
    // { align: 'center', tooltip: true, prop: 'skuOnshelfStatus', label: '是否为热销', slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: '200', slot: true }

]

const dataState = reactive({
    searchData: {
        merchantIds: '', // 商户编码
        merchantNames: '', // 商家名称
        brandName: '', // 品牌名称
        skuId: '', // sku编号
        barcode: '',
        modelCode: '',
        storageStyle: '',
        spuId: '',
        spuName: '',
        storageMethod: '',
        firstCateName: null,
        secondCateName: null,
        thirdCateName: null,
        fourthCateName: null
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 50
    },
    tableData: [],
    mediaUrl: '',
    firstCateList: [],
    secondCateList: [],
    thirdCateList: [],
    fourCateList: [],
    dialogVisible: false,
    rowList: {},
    type: ''

})
const { searchData, pageinfo, tableData, firstCateList, secondCateList, thirdCateList, fourCateList, dialogVisible, rowList, type } = toRefs(dataState)

onMounted(async () => {
    await getPagingList()
})

// 去详情
const goDetail = (type, spuTemplate, spuId) => {
    router.push({
        name: 'spu-management-editor',
        params: {
            type,
            spuTemplate,
            spuId
        }
    })
}

const godetail = (spuId, type) => {
    router.push({ name: 'model-detail', params: { goodsId: spuId, type } })
}

// 列表数据
const getPagingList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            spuIds: dataState.searchData.spuId ? dataState.searchData.spuId.split(',') : [],
            barcodes: dataState.searchData.barcode ? dataState.searchData.barcode.split(',') : [],
            firstCateNames: dataState.searchData.firstCateName ? dataState.searchData.firstCateName.split(',') : [],
            secondCateNames: dataState.searchData.secondCateName ? dataState.searchData.secondCateName.split(',') : [],
            thirdCateNames: dataState.searchData.thirdCateName ? dataState.searchData.thirdCateName.split(',') : [],
            fourthCateNames: dataState.searchData.fourthCateName ? dataState.searchData.fourthCateName.split(',') : [],
            merchantNames: dataState.searchData.merchantNames ? dataState.searchData.merchantNames.split(',') : [],
            merchantIds: dataState.searchData.merchantIds ? dataState.searchData.merchantIds.split(',') : [],
            skuIds: dataState.searchData.skuIds ? dataState.searchData.skuIds.split(',') : [],
            storageStyles: dataState.searchData.storageStyle ? dataState.searchData.storageStyle.split(',') : [],
            spuName: dataState.searchData.spuName,
            skuStatus: [-1],
            channelTypes: [1],
            modelStatuss: [2], // 模型训练状态  写死  只能展示有模型训练的货柜商品
            skuName: dataState.searchData.skuName,
            pageNo: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.total
}

// 一级&&二级基础类目模糊搜索
const remoteMethodFirst = async (query) => {
    if (query) {
        const res = await getlistByName(1, query)
        dataState.firstCateList = res
        console.log('一级级类目', dataState.firstCateList)
    } else {
        dataState.firstCateList = []
    }
}
const remoteMethodSecond = async (query) => {
    if (query) {
        const res = await getlistByName(2, query)
        dataState.secondCateList = res
        console.log('二级类目', dataState.secondCateList)
    } else {
        dataState.secondCateList = []
    }
}

// 三级&&四级基础类目模糊搜索
const remoteMethod = async (query) => {
    if (query) {
        const res = await getlistByName(3, query)
        dataState.thirdCateList = res
    } else {
        dataState.thirdCateList = []
    }
}
const remoteMethodFour = async (query) => {
    if (query) {
        const res = await getlistByName(4, query)
        dataState.fourCateList = res
    } else {
        dataState.fourCateList = []
    }
}
// 基础类目模糊搜索
const getlistByName = async (level, cateName) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            level,
            cateName
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC1657693119977tVHEb',
        name: '品类模糊搜索接口',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    return res
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 查询
const search = () => {
    dataState.pageinfo.currPage = 1
    getPagingList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getPagingList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getPagingList()
}

</script>

<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
