<!-- sku管理 -->
<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商家编号" prop="merchantIds">
                            <el-input v-model.trim="searchData.merchantIds" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商家名称" prop="merchantNames">
                            <el-input v-model.trim="searchData.merchantNames" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku编号" prop="skuIds">
                            <el-input v-model.trim="searchData.skuIds" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku名称" prop="skuName">
                            <el-input v-model.trim="searchData.skuName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="三级基础分类" prop="thirdCateNames">
                            <el-input v-model.trim="searchData.thirdCateNames" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="四级基础分类" prop="fourthCateNames">
                            <el-input v-model.trim="searchData.fourthCateNames" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
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
                :tableData="tableData"
                v-model:current-page="pageinfo.currPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #thumbnail="scope">
                    <img :src="scope.row.thumbnail" alt="" style="width:100px">
                </template>
                <!-- 1, "待审核"  2, "已审核  3 已拒绝 4 已上架  5 下架可上架
6,  下架 7 待上架 -->
                <template #skuOnshelfStatus="scope">
                    <span v-if="scope.row.skuStatus === 1">待审核</span>
                    <span v-if="scope.row.skuStatus === 2">已审核</span>
                    <span v-if="scope.row.skuStatus === 3">已拒绝</span>
                    <span v-if="scope.row.skuStatus === 4">已上架</span>
                    <span v-if="scope.row.skuStatus === 5">下架可上架</span>
                    <span v-if="scope.row.skuStatus === 6">下架</span>
                    <span v-if="scope.row.skuStatus === 7">待上架</span>
                </template>
                <template #tag="scope">
                    <span v-if="scope.row.tag === '1'">支持7天无理由退货</span>
                    <span v-if="scope.row.tag === '2'">无忧退货</span>
                </template>
                <template #category="scope">
                    {{scope.row.firstCateName}}/{{scope.row.secondCateName}}/{{scope.row.thirdCateName}}/{{scope.row.fourthCateName}}
                </template>
                <template #operation="{ row }">
                    <el-button text @click="toAdd(row)" type="primary" v-if="row.skuStatus === 1||row.skuStatus === 3|| row.skuStatus === 5">
                        编辑
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'2')" v-if="row.skuStatus === 1 || row.skuStatus === 3" type="primary">
                        审核
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'4')" v-if="row.skuStatus === 7|| row.skuStatus === 2||row.skuStatus === 5" type="primary">
                        上架
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'6')" v-if="row.skuStatus === 4 " type="primary">
                        下架
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'5')" v-if="row.skuStatus === 4 " type="primary">
                        下架可上架
                    </el-button>
                </template>
            </system-list>
        </div>
        <apply-sku v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :rowList = "rowList" :type="type" @fevent="getPagingList()"></apply-sku>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import applySku from './apply-sku.vue'
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编号', fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称' },
    { align: 'center', tooltip: true, prop: 'skuId', label: 'sku编号' },
    { align: 'center', tooltip: true, prop: 'skuName', label: 'sku名称' },
    { align: 'center', tooltip: true, prop: 'thumbnail', label: 'sku图片', slot: true },
    { align: 'center', tooltip: true, prop: 'category', label: '商品分类', slot: true },
    { align: 'center', tooltip: true, prop: 'tag', label: '标签', slot: true },
    { align: 'center', tooltip: true, prop: 'salePrice', label: '基础价格' },
    { align: 'center', tooltip: true, prop: 'skuOnshelfStatus', label: 'sku状态', slot: true },
    { align: 'center', prop: 'operation', label: '操作', slot: true }

]

const dataState = reactive({
    searchData: {
        merchantIds: '', // 商户编码
        merchantNames: '', // 商家名称
        brandName: '', // 品牌名称
        skuIds: '', // sku编号
        skuName: '', // sku名称
        thirdCateNames: '',
        fourthCateNames: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    tableData: [],
    thirdCateList: [],
    fourCateList: [],
    pinpaiList: [],
    dialogVisible: false,
    rowList: {},
    type: ''

})
const { searchData, pageinfo, tableData, thirdCateList, fourCateList, pinpaiList, dialogVisible, rowList, type } = toRefs(dataState)

onMounted(async () => {
    await getPinpaiList()
    await getPagingList()
})

// 跳转编辑
const toAdd = (row) => {
    router.push({ name: 'add-sku', params: { skuId: row.skuId, merchantCode: row.merchantCode } })
}

const querySearchAsync = (queryString, cb) => {
    console.log(queryString)
    const results = queryString ? dataState.tableData.filter(createStateFilter(queryString)) : dataState.tableData
    console.log(results)
    cb(results)
}
const createStateFilter = (queryString) => {
    return (state) => {
        return (state.skuId.includes(queryString))
    }
}
const handleSelect = (item) => {
    console.log(item)
}

const orderNo = ref('')
// 上下架
const toapStandUpDown = (row, type) => {
    dataState.dialogVisible = true
    dataState.rowList = row
    dataState.type = type
}

// 跳转审核页面 apply
const toapply = () => {
    router.push({ name: 'apply-sku' })
}

// 列表数据
const getPagingList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001004',
            thirdCateNames: dataState.searchData.thirdCateNames ? dataState.searchData.thirdCateNames.split(',') : [],
            fourthCateNames: dataState.searchData.fourthCateNames ? dataState.searchData.fourthCateNames.split(',') : [],
            merchantNames: dataState.searchData.merchantNames ? dataState.searchData.merchantNames.split(',') : [],
            merchantIds: dataState.searchData.merchantIds ? dataState.searchData.merchantIds.split(',') : [],
            skuIds: dataState.searchData.skuIds ? dataState.searchData.skuIds.split(',') : [],
            skuName: dataState.searchData.skuName,
            skuStatus: [-1],
            channelTypes: [0],
            pageNo: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.total
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
            busiCode: 'A1001004',
            level,
            cateName
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
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

// 品牌模糊搜索
const getPinpaiList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            currPage: 1,
            pageSize: 100
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC1657693014433SoKeV',
        name: '品牌查询',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.pinpaiList = res.list
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

// 上架业务
const toDetailupper = (val) => {
    console.log(val)
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
