<template>
    <div class="locale-goods-inventory-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商品编号" prop="skuIds">
                        <el-input v-model="searchData.skuIds" placeholder="请输入商品编号" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable />
                    </el-form-item>
                    <el-form-item label="活动ID" prop="batchCode">
                        <el-input v-model="searchData.batchCode" placeholder="请输入活动ID" clearable />
                    </el-form-item>
                    <!-- <el-form-item label="活动名称" prop="activeName">
                        <el-input v-model="searchData.activeName" placeholder="请输入活动名称" clearable />
                    </el-form-item> -->
                    <el-form-item label="店铺编号" prop="secondChannelId">
                        <el-input v-model="searchData.secondChannelId" placeholder="请输入店铺编号" clearable />
                    </el-form-item>
                    <el-form-item label="店铺名称" prop="secondChannelName">
                        <el-input v-model="searchData.secondChannelName" placeholder="请输入店铺名称" clearable />
                    </el-form-item>
                    <el-form-item label="商户编号" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商户编号" clearable />
                    </el-form-item>
                    <el-form-item label="商户名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入商户名称" clearable />
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList('search')">
                            查询
                        </el-button>
                        <el-button type="primary" @click="exportTable('search')">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #batchCodes="scope">

                    <span v-if="scope.row?.batchCodes?.length ===1" style="color: rgb(254, 44, 85);cursor: pointer" type="primary">{{ scope.row.batchCodes.join('') }}</span>
                    <span v-else-if="scope.row?.batchCodes?.length >1" style="color: rgb(254, 44, 85);cursor: pointer"  @click="toDetail(scope.row, 'cat')" type="primary">查看详情</span>
                    <span v-else style="color: var(--el-table-text-color);cursor: pointer" type="primary">-</span>
                    <!-- <el-button >{{ scope.row.batchCodes.join('') }}</el-button>
                    <el-button v-else-if="scope.row?.batchCodes?.length >1" style="color: rgb(254, 44, 85);cursor: pointer"  @click="toDetail(scope.row, 'cat')" type="primary" text>查看详情</el-button>
                    <el-button v-else style="color: var(--el-table-text-color);cursor: pointer" type="primary" text>-</el-button> -->
                    <!--
                    <el-button v-if="(scope?.row?.batchCodes !== null) && scope?.row?.batchCodes?.split(',')?.length === 1" style="color: rgb(254, 44, 85);cursor: pointer" type="primary" text>{{ scope.row.batchCodes.join('') }}</el-button>
                    <el-button v-else-if="scope.row?.batchCodes && scope.row?.batchCodes?.split(',').length > 1" style="color: rgb(254, 44, 85);cursor: pointer" @click="toDetail(scope.row, 'cat')" type="primary" text>查看详情</el-button>
                    <el-button v-else style="color: var(--el-table-text-color);cursor: pointer" type="primary" text>-</el-button> -->

                </template>

            </system-list>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { exportDetails } from '@/api/accountManagement/index'

import SystemList from '@/composables/TablePagination/index.vue'
// import { publicRequest } from '@/api/common/index.js'
// import { getLocalLifeList, exportStockList } from '@/api/stocklocal.js'
import { getMerchantListCode } from '@/api/operate/index'

const store = useStore()

const userInfo = computed(() => store.state.userInfo)

const formRef = ref(null)
const searchData = ref({
    skuIds: '',
    skuName: '',
    batchCode: '',
    // activeName: '',
    secondChannelId: '',
    secondChannelName: '',
    merchantId: '', // 商户ID
    merchantName: '' // 商品名称
})

const router = useRouter()
// const formEl = ref(null)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 300 },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 300 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'totalStock', label: '总库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'stock', label: '普通库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'batchCodes', label: '活动编号', minWidth: 230, slot: true },
    // { align: 'center', tooltip: true, prop: 'activeName', label: '活动名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'promotionStock', label: '活动库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '店铺编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '店铺名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'lockStock', label: '普通库存预占', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'promotionLockStock', label: '活动库存预占', minWidth: 130 }

]
const tableData = ref([])
// const pageInfo = ref({
//     currentPage: 1,
//     pageSize: 20,
//     total: 0
// })
const dataState = reactive({

    pageInfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
const { pageInfo } = toRefs(dataState)

onMounted(async () => {
    await getTableList()
})
const consition = ref('')
const searchList = async () => {
    // consition.value = 'search'
    pageInfo.value.currentPage = 1
    getTableList()
}

// 搜索列表
const getTableList = async (obj, val) => {
    // const res = await publicRequest({ key: 'LOCAL_LIFE_GOODS_INVENTORY', body: params })
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001003',
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...searchData.value,
            secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
            secondChannelName: searchData.value.secondChannelName ? searchData.value.secondChannelName : '',
            merchantIds: searchData.value.merchantId ? [searchData.value.merchantId] : [],
            merchantNames: searchData.value.merchantName ? [searchData.value.merchantName] : [],
            skuIds: searchData.value.skuIds ? [searchData.value.skuIds] : []

        },
        appKey: 'A1001000',
        busiCode: 'A1001003',
        configCode: 'UCJH60688307006480384',
        name: '库存查询聚合活动信息',
        source: '运营后台'

    }
    if (searchData.value.merchantId === '') {
        delete params.body.merchantId
    }
    if (searchData.value.secondChannelId === '') {
        delete params.body.secondChannelId
    }
    if (searchData.value.merchantName === '') {
        delete params.body.merchantName
    }

    const res = await getMerchantListCode(params)

    if (res.code === '200') {
        pageInfo.value.total = res?.data.total
        tableData.value = res?.data.list
    }

    // if (res.data) {
    //     pageInfo.value.total = res?.total
    //     tableData.value = res?.data
    // }

    // if (res?.code === '200' && res.data) {
    //     pageInfo.value.total = res?.total
    //     tableData.value = res?.data
    // }
}

// // 重置搜索条件
// const resetForm = (formEl) => {
//     if (!formEl) return
//     formEl.resetFields()
//     searchData.value.gmtDealStart = '' //  审核开始时间
//     searchData.value.gmtDealEnd = '' // 审核结束时间
// }
// 导出
const exportTable = async (key) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001003',
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize,
            ...searchData.value,
            secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
            secondChannelName: searchData.value.secondChannelName ? searchData.value.secondChannelName : '',
            merchantIds: searchData.value.merchantId ? [searchData.value.merchantId] : [],
            merchantNames: searchData.value.merchantName ? [searchData.value.merchantName] : [],
            skuIds: searchData.value.skuIds ? [searchData.value.skuIds] : []

        },
        exportType: 7,
        appKey: 'A1001000',
        busiCode: 'A1001003',
        configCode: 'UCJH60688307006480384',
        name: '库存查询聚合活动信息',
        source: '运营后台'

    }
    if (searchData.value.merchantId === '') {
        delete params.body.merchantId
    }
    if (searchData.value.secondChannelId === '') {
        delete params.body.secondChannelId
    }
    if (searchData.value.merchantName === '') {
        delete params.body.merchantName
    }
    const res = await exportDetails(params)
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
const toDetail = async (val, type) => {
    store.commit('setRowData', val)

    // 跳转到查看详情
    router.push({
        name: 'inventory-management-local-detail',
        query: {
            id: val.batchCodes,
            act: val.stock ? val.lockStock : '-',
            storeId: val.storeId ? val.storeId : '-',
            merchantId: val.merchantId, // 商家编码
            shopId: val.shopId, // 店铺编号
            skuId: val.skuId,
            skuName: val.skuName,
            shopName: val.shopName

        }
    })
}
const editDetail = async (val, type) => {
    store.commit('setRowData', val)

    // 编辑
    router.push({
        name: 'inventory-edit',
        query: {
            spuId: val.skuId

        }
    })
}
</script>

<style lang="scss">
.locale-goods-inventory-list {
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
