<template>
    <div class="goods-container">
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
                        <el-form-item label="品牌" prop="brandNames">
                            <el-select v-model.trim="searchData.brandNames" clearable placeholder="请选择" >
                                <el-option v-for="item in brandList" :key="item.brandCode" :label="item.brandName" :value="item.brandName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods编号" prop="goodsIds">
                            <el-input v-model.trim="searchData.goodsIds" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods名称" prop="goodsName">
                            <el-input v-model.trim="searchData.goodsName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="三级类目" prop="thirdCateNames">
                            <el-input v-model.trim="searchData.thirdCateNames" placeholder="请输入～" clearable />
                            <!-- <el-select v-model="searchData.thirdCateCode" clearable placeholder="请选择"
                                       filterable
                                       remote :remote-method="remoteMethod">
                                <el-option v-for="el in thirdCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="四级类目" prop="fourthCateNames">
                            <!-- <el-select v-model="searchData.fourthCateCode" clearable placeholder="请选择"   filterable
                                       remote :remote-method="remoteMethodFour">
                                <el-option v-for="el in fourCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select> -->
                            <el-input v-model.trim="searchData.fourthCateNames" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <!-- <el-button type="primary" @click="resetForm(formRef)">
                        导出
                    </el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="dataState.pageinfo.currPage"
                v-model:page-size="dataState.pageinfo.pageSize"
                :total="dataState.pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #img="scope">
                    <img :src="scope.row.img" alt="">
                </template>
                <template #goodsStatus="scope">
                    <!-- 1、初始，2、审核通过，3、已拒绝，4、启用，5、停用 -->
                    <span v-if="scope.row.goodsStatus===1">初始</span>
                    <span v-if="scope.row.goodsStatus===2">审核通过</span>
                    <span v-if="scope.row.goodsStatus===3">已拒绝</span>
                    <span v-if="scope.row.goodsStatus===4">启用</span>
                    <span v-if="scope.row.goodsStatus===5">停用</span>
                </template>
                <template #category="scope">
                    <span>{{scope.row.firstCateName}}/{{scope.row.secondCateName}}/{{scope.row.thirdCateName}}/{{scope.row.fourthCateName}}</span>
                </template>
                <template #operation="scope">
                    <el-button text type="primary" @click="edit(scope.row.merchantCode,scope.row.goodsId)" v-if=" scope.row.goodsStatus !==5">
                        编辑
                    </el-button>
                    <el-button text type="primary" @click="changeType(scope.row,'5')" v-if="scope.row.goodsStatus ===4 && scope.row.goodsStatus !==5">
                        停用
                    </el-button>
                    <el-button text type="primary" @click="changeType(scope.row,'4')" v-if="scope.row.goodsStatus ===1 && scope.row.goodsStatus !==5">
                        启用
                    </el-button>
                </template>
            </system-list>
        </div>
        <apply-goods v-if="dialogVisible" :visible ='dialogVisible'  @handleClose="dialogVisible = false" :rowList = "rowList" :type="type" @fevent="getGoodsList()" ></apply-goods>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import applyGoods from './apply-goods.vue'
import { getMerchantList } from '@/api/operate/index'
import { queryCategory } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const dialogVisible = ref(false)
const orderNo = ref('')
const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'goodsName', label: 'Goods名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'goodsId', label: 'Goods编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'img', label: 'Goods图片', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'category', label: 'Goods类目', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'goodsStatus', label: '商品状态', minWidth: 100, slot: true }
    // { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        merchantIds: '',
        merchantNames: '',
        goodsIds: '',
        goodsName: '',
        thirdCateNames: '',
        fourthCateNames: '',
        brandNames: '',
        cerType: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    brandList: [],
    thirdCateList: [],
    fourCateList: [],
    rowList: {},
    type: ''

})
const { searchData, pageinfo, brandList, thirdCateList, fourCateList, rowList, type } = toRefs(dataState)

onMounted(async () => {
    await getGoodsList()
    await getPinpaiList()

    // await getCateNameList()
})

const toDetail = (orderNo) => {
    router.push({ name: 'work-order-detail', params: { orderNo } })
}

const edit = (merchantCode, goodsId) => {
    router.push({ name: 'container-add-goods', params: { merchantCode, goodsId } })
}

const toapply = (orderNo) => {
    dialogVisible.value = true
    orderNo.value = orderNo
}

// 列表数据
const getGoodsList = async () => {
    const params = {
        body: {
            merchantIds: dataState.searchData.merchantIds ? dataState.searchData.merchantIds.split(',') : [],
            merchantNames: dataState.searchData.merchantNames ? dataState.searchData.merchantNames.split(',') : [],
            brandNames: dataState.searchData.brandNames ? dataState.searchData.brandNames.split(',') : [],
            goodsIds: dataState.searchData.goodsIds ? dataState.searchData.goodsIds.split(',') : [],
            goodsName: dataState.searchData.goodsName,
            thirdCateNames: dataState.searchData.thirdCateNames ? dataState.searchData.thirdCateNames.split(',') : [],
            fourthCateNames: dataState.searchData.fourthCateNames ? dataState.searchData.fourthCateNames.split(',') : [],
            pageNo: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize,
            goodsStatus: [-1],
            appKey: 'A1001000',
            busiCode: 'A1001002'
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC15115376406798336',
        name: 'goods查询通用接口V2',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.pageinfo.total = data.total
    tableData.value = data.list.map(item => {
        if (item.goodsMediaList) {
            item.goodsMediaList.map(el => {
                if (el.mediaType === 4) {
                    item.img = el.mediaUrl
                }
            })
        }
        return {
            ...item
        }
    })
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
    dataState.brandList = res.list
}
// 更改列表状态
const changeType = async (row, state) => {
    dialogVisible.value = true
    dataState.rowList = row
    dataState.type = state
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currPage = 1
    getGoodsList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getGoodsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getGoodsList()
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
