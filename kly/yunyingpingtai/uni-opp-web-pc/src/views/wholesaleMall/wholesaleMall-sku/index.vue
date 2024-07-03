<!-- sku管理 -->
<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商家编号" prop="merchantCode">
                            <el-input v-model.trim="searchData.merchantCode" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商家名称" prop="merchantName">
                            <el-input v-model.trim="searchData.merchantName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku编号" prop="skuId">
                            <el-input v-model.trim="searchData.skuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku名称" prop="skuName">
                            <el-input v-model.trim="searchData.skuName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="sku状态" prop="skuStatus">
                            <el-select v-model="searchData.skuStatus"  placeholder="请选择" >
                                <!-- <el-option label="全部" value="" /> -->
                                <el-option label="待审核" value="1" />
                                <el-option label="已审核" value="2" />
                                <el-option label="已拒绝" value="3" />
                                <el-option label="已上架" value="4" />
                                <el-option label="下架可上架" value="5" />
                                <el-option label="已下架" value="6" />
                                <el-option label="待上架" value="7" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods编号" prop="goodsId">
                            <el-input v-model.trim="searchData.goodsId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌" prop="brandName">
                            <el-select v-model="searchData.brandName" clearable placeholder="请选择">
                                <el-option v-for="el in pinpaiList" :label="el.brandName" :value="el.brandName" :key="el.brandName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="标品编号" prop="spuId">
                            <el-input v-model.trim="searchData.spuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="三级基础分类" prop="thirdCateCode">
                            <el-select v-model="searchData.thirdCateCode" clearable placeholder="请选择"
                                       filterable
                                       remote :remote-method="remoteMethod">
                                <el-option v-for="el in thirdCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                            <!-- <el-input v-model.trim="searchData.thirdCateCode" placeholder="请输入～" clearable /> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="四级基础分类" prop="fourthCateCode">
                            <el-select v-model="searchData.fourthCateCode" clearable placeholder="请选择"   filterable
                                       remote :remote-method="remoteMethodFour">
                                <el-option v-for="el in fourCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                            <!-- <el-input v-model.trim="searchData.fourthCateCode" placeholder="请输入～" clearable /> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="button-box">
                    <!-- <el-button type="primary" @click="handleSku('add', '')">
                        新建
                    </el-button> -->
                    <el-button type="primary" @click="search()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="exportTable()">
                        导出
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
                v-model:current-page="pageinfo.pageNo"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #thumbnail="scope">
                    <img :src="scope.row.thumbnail" alt="" style="width:100px">
                </template>
                <!-- 1, "待审核"  2, "已审核  3 已拒绝 4 已上架  5 下架可上架 6,  下架 7 待上架 -->
                <template #skuStatus="scope">
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
                <template #secondChannelName="scope">
                    {{scope.row.secondChannelName ?? '-'}}
                </template>
                <template #salePrice="scope">
                    {{scope.row.salePrice ?? '-'}}
                </template>
                <template #suggSellingPrice="scope">
                    {{scope.row.suggSellingPrice ?? '-'}}
                </template>
                <template #fluctuateOperation="{ row }">
                    <el-button text @click="toapStandUpDown(row,'4')" v-if="row.skuStatus === 5 || row.skuStatus === 2 || row.skuStatus === 7" type="primary">
                        上架
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'6')" v-if="row.skuStatus ===4" type="primary">
                        下架
                    </el-button>
                    <el-button text @click="toapStandUpDown(row,'5')" v-if="row.skuStatus === 4 " type="primary">
                        下架可上架
                    </el-button>
                    <el-button text  v-if="row.skuStatus === 1 ">
                        -
                    </el-button>
                </template>
                <template #operation="scope">
                    <el-button type="text" v-if="scope.row.skuStatus === 1" @click="handleSku('edit', scope.row.skuId)">
                        编辑
                    </el-button>
                    <el-button text @click="toapStandUpDown(scope.row,'2')" v-if="scope.row.skuStatus === 1 || scope.row.skuStatus === 3" type="primary">
                        审核
                    </el-button>
                    <el-button type="text" @click="handleSku('detail', scope.row.skuId )">
                        查看详情
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
import { getMerchantList, exportCommon } from '@/api/operate/index'
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
    { align: 'center', tooltip: true, prop: 'thumbnail', minWidth: 200, label: 'sku缩略图', slot: true },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '商品分类' },
    { align: 'center', tooltip: true, prop: 'firstChannelName', label: '一级渠道名称' },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '二级渠道名称', slot: true },
    { align: 'center', tooltip: true, prop: 'goodsId', label: 'Goods编号' },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号' },
    { align: 'center', tooltip: true, prop: 'salePrice', label: '原价', slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌' },
    { align: 'center', tooltip: true, prop: 'suggSellingPrice', label: '基础价格', slot: true },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: 'sku状态', slot: true },
    { align: 'center', tooltip: true, prop: 'fluctuateOperation', label: '上下架操作', minWidth: 200, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }

]

const dataState = reactive({
    searchData: {
        merchantCode: '', // 商户编码
        merchantName: '', // 商家名称
        brandName: '', // 品牌名称
        spuId: '',
        goodsId: '',
        skuIds: '', // sku编号
        skuName: '', // sku名称
        thirdCateCode: '',
        fourthCateCode: '',
        skuStatus: null // sku状态
    },
    pageinfo: {
        total: 0,
        pageNo: 1,
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

const orderNo = ref('')
// 上下架
const toapStandUpDown = (row, type) => {
    dataState.dialogVisible = true
    dataState.rowList = row
    dataState.type = type
}

const handleSku = (type, skuId) => {
    router.push({
        name: 'add-wholesaleMall-sku',
        params: {
            skuId,
            merchantCode: type
        }
    })
}

// 跳转审核页面 apply
const toapply = () => {
    router.push({ name: 'apply-sku' })
}

// 列表数据
const getPagingList = async () => {
    const params = {
        body: {
            busiCode: 'A1001005',
            appKey: 'A1001001',
            merchantNames: [dataState.searchData.merchantName],
            merchantIds: [dataState.searchData.merchantCode],
            skuIds: [dataState.searchData.skuId],
            skuName: dataState.searchData.skuName,
            thirdCateNames: [dataState.searchData.thirdCateCode.toString()],
            fourthCateNames: [dataState.searchData.fourthCateCode.toString()],
            brandNames: [dataState.searchData.brandName],
            channelTypes: [4],
            spuIds: [dataState.searchData.spuId],
            goodsIds: [dataState.searchData.goodsId],
            skuStatus: [dataState.searchData.skuStatus ?? -1],
            ...dataState.pageinfo
        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        // configCode: 'UC1657960086989vqiGy',
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.total
}

const querySearchAsync = (queryString, cb) => {
    const results = queryString ? dataState.tableData.filter(createStateFilter(queryString)) : dataState.tableData
    cb(results)
}
const createStateFilter = (queryString) => {
    return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
    }
}
const handleSelect = (item) => {
    console.log(item)
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
            busiCode: 'A1001005',
            level,
            cateName
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
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
            busiCode: 'A1001005',
            pageNo: 1,
            pageSize: 100
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
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
    dataState.pageinfo.pageNo = 1
    getPagingList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.pageNo = val
    getPagingList()
}
const sizeChange = (val) => {
    dataState.pageinfo.pageNo = 1
    dataState.pageinfo.pageSize = val
    getPagingList()
}

// 上架业务
const toDetailupper = (val) => {
    console.log(val)
}

// sku列表导出
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001005', // 业务线编号
        configCode: 'UC15115376423575552',
        exportType: 9,
        body: {
            busiCode: 'A1001005',
            appKey: 'A1001001',
            channelTypes: [4],
            merchantNames: [dataState.searchData.merchantName],
            merchantIds: [dataState.searchData.merchantCode],
            skuIds: [dataState.searchData.skuId],
            skuName: dataState.searchData.skuName,
            thirdCateCodes: [dataState.searchData.thirdCateCode.toString()],
            fourthCateCodes: [dataState.searchData.fourthCateCode.toString()],
            brandNames: [dataState.searchData.brandName],
            spuIds: [dataState.searchData.spuId],
            goodsIds: [dataState.searchData.goodsId],
            skuStatus: [dataState.searchData.skuStatus ? dataState.searchData.skuStatus : -1]
        }
    }
    const res = await exportCommon(params)
    console.log(res, 'res')
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    // console.log(fileName)
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
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
