<template>
    <div class="goods-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商家编号" prop="merchantId">
                            <el-input v-model.trim="searchData.merchantId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商家名称" prop="merchantName">
                            <el-input v-model.trim="searchData.merchantName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="品牌" prop="brandCode">
                            <el-select v-model.trim="searchData.brandName" clearable placeholder="请选择" >
                                <el-option v-for="item in brandList" :key="item.brandCode" :label="item.brandName" :value="item.brandCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods编号" prop="goodsId">
                            <el-input v-model.trim="searchData.goodsId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods名称" prop="goodsName">
                            <el-input v-model.trim="searchData.goodsName" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="三级类目" prop="thirdCateCode">
                            <el-select v-model="searchData.thirdCateCode" clearable placeholder="请选择"
                                       filterable
                                       remote :remote-method="remoteMethod">
                                <el-option v-for="el in thirdCateList" :label="el.cateName" :value="el.cateName" :key="el.cateName" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="四级类目" prop="fourthCateCode">
                            <el-select
                                v-model="searchData.fourthCateCode"
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
                        <el-form-item label="标品编号" prop="spuId">
                            <el-input v-model.trim="searchData.spuId" placeholder="请输入～" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="Goods状态" prop="goodsStatus">
                            <el-select v-model.trim="searchData.goodsStatus" clearable placeholder="请选择" >
                                <el-option label="初始" value="1"/>
                                <el-option label="审核通过" value="2"/>
                                <el-option label="已拒绝" value="3"/>
                                <el-option label="启用" value="4"/>
                                <el-option label="停用" value="5"/>
                                <el-option label="暂停使用" value="6"/>
                            </el-select>
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
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="dataState.pageinfo.pageNo"
                v-model:page-size="dataState.pageinfo.pageSize"
                :total="dataState.pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #img="scope">
                    <img :src="scope.row.img" alt="">
                </template>
                <template #brandName="scope">
                    <span>{{scope.row.brandName}}</span>
                </template>
                <template #goodsStatus="scope">
                    <!-- 1、初始，2、审核通过，3、已拒绝，4、启用，5、停用 -->
                    <span v-if="scope.row.goodsStatus===1">待审核</span>
                    <span v-if="scope.row.goodsStatus===2">审核通过</span>
                    <span v-if="scope.row.goodsStatus===3">已拒绝</span>
                    <span v-if="scope.row.goodsStatus===4">启用</span>
                    <span v-if="scope.row.goodsStatus===5">停用</span>
                    <span v-if="scope.row.goodsStatus===6">暂停使用</span>
                </template>
                <template #category="scope">
                    <span>{{scope.row.firstCateName}}/{{scope.row.secondCateName}}/{{scope.row.thirdCateName}}/{{scope.row.fourthCateName}}</span>
                </template>
                <template #operation="scope">
                    <el-button text type="primary" @click="edit(scope.row.merchantCode,scope.row.goodsId, 'edit')" v-if="scope.row.goodsStatus === 1">
                        编辑
                    </el-button>
                    <el-button text type="primary" @click="changeType(scope.row,'5')" v-if="scope.row.goodsStatus === 4">
                        停用
                    </el-button>
                    <el-button type="text" v-if="scope.row.goodsStatus===5" @click="onDel('detail', scope.row.goodsId)">
                        删除
                    </el-button>
                    <el-button text type="primary" @click="edit(scope.row.merchantCode,scope.row.goodsId,'detail')">
                        查看详情
                    </el-button>
                    <el-button text type="primary" @click="changeType(scope.row,'4')" v-if="scope.row.goodsStatus === 1 || scope.row.goodsStatus === 5|| scope.row.goodsStatus === 5 || scope.row.goodsStatus === 6">
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
import client from '@/utils/request'
import SystemList from '@/composables/TablePagination/index.vue'
import applyGoods from './apply-goods.vue'
import { getMerchantList } from '@/api/operate/index'
import { goodsSkuList, goodsBrand, setStatus } from '@/api/goods-sku'
import { queryCategory } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const loginOrgRole = computed(() => store.state.loginOrgRole)

const dialogVisible = ref(false)
const orderNo = ref('')
const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商家编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商家名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'goodsName', label: 'Goods名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'goodsId', label: 'Goods编号', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'img', label: 'Goods图片', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'category', label: '基础类目名称', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'goodsStatus', label: '商品状态', minWidth: 100, slot: true },
    // { align: 'center', prop: 'statusOperation', label: '上下架操作', minWidth: 200, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }

]
const getMerchantlistDel = async (params) => {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

const tableData = ref([])
const dataState = reactive({
    searchData: {
        merchantId: null,
        merchantName: null,
        goodsId: null,
        goodsName: null,
        brandName: null,
        thirdCateCode: null,
        fourthCateCode: null,
        spuId: null,
        goodsStatus: null
    },
    pageinfo: {
        total: 0,
        pageNo: 1,
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

const edit = (merchantCode, goodsId, type) => {
    router.push({ name: 'add-wholesaleMall-goods', params: { merchantCode, goodsId, type } })
}

const toapply = (orderNo) => {
    dialogVisible.value = true
    orderNo.value = orderNo
}

// 列表数据
const getGoodsList = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001005',
            pageNo: dataState.pageinfo.pageNo,
            pageSize: dataState.pageinfo.pageSize,
            merchantIds: [dataState.searchData.merchantId],
            merchantNames: [dataState.searchData.merchantName],
            goodsIds: [dataState.searchData.goodsId],
            goodsName: dataState.searchData.goodsName,
            brandNames: [dataState.searchData.brandName],
            thirdCateNames: [dataState.searchData.thirdCateCode],
            fourthCateNames: [dataState.searchData.fourthCateCode],
            spuIds: [dataState.searchData.spuId],
            goodsStatus: [dataState.searchData.goodsStatus ?? -1]
        },
        appKey: 'A1001000',
        busiCode: 'A1001005',
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

// 删除goods
const onDel = async (type, goodsId) => {
    const params = {
        body: {
            busiCode: 'A1001005',
            appKey: 'A1001001',
            goodsId: goodsId
        },
        appKey: 'A1001001',
        busiCode: 'A1001005',
        configCode: 'UC17349244193808384',
        name: 'Goods删除接口',
        source: '商品中台'
    }
    const res = await getMerchantlistDel(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        getGoodsList()
    } else {
        ElMessage.error('失败')
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
            busiCode: 'A1001001',
            level,
            cateName
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
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
            busiCode: 'A1001001',
            pageNo: 1,
            pageSize: 100
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
    const res = await getMerchantList(param)
    dataState.brandList = res.list
}
// 更改列表状态
const changeType = async (row, state) => {
    dialogVisible.value = true
    dataState.rowList = row
    dataState.type = state
}

// 查商品品牌
// const getGoodsBrand = async () => {
//     const params = {
//         pageNo: 1,
//         pageSize: 999,
//         brandName: ''
//     }
//     const res = await goodsBrand(params)
//     dataState.brandList = res.object.list
// }

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getGoodsList()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.pageNo = 1
    getGoodsList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.pageNo = val
    getGoodsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.pageNo = 1
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
