<template>
    <div class="locale-goods-inventory-list">

        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #activeId="scope">
                    <el-button v-if="scope.row?.activeId?.length ===1" style="color: rgb(254, 44, 85);cursor: pointer" type="primary" text>{{ scope.row.activeId }}</el-button>
                    <el-button v-else-if="scope.row?.activeId?.length >1" style="color: rgb(254, 44, 85);cursor: pointer"  @click="toDetail(scope.row, 'cat')" type="primary" text>查看详情</el-button>
                    <el-button v-else style="color: var(--el-table-text-color);cursor: pointer" type="primary" text>-</el-button>

                </template>
                >
                <template #storeName="scope">
                    <span>{{  scope?.row?.store?.storeName|| route?.query?.shopName}}</span>
                </template>
                <template #storeCode="scope">
                    <span>{{  scope?.row?.store?.storeCode|| route?.query?.shopId}}</span>
                </template>

                <template #skuName="scope">
                    <span>{{  scope?.row?.skuName|| route?.query?.skuName}}</span>
                </template>
                <!-- <template #merchantId="scope" v-if="route?.query?.merchantId">
                    <span>{{  scope?.row?.merchantId||route?.query?.merchantId}}</span>
                </template> -->
                <!-- <template #merchantName="scope">
                    <span>{{  scope?.row?.merchantName||route.query.merchantName}}</span>
                </template> -->
                <!-- <template #batchCode="scope">
                    <span>{{  scope?.row?.batchCode||route.query.batchCode}}</span>
                </template> -->
                <template #activeStock="scope">
                    <span>{{ scope.row.stock}}</span>
                </template>
                <template #activeStockPre="scope">
                    <span>{{  scope?.row?.lockStock}}</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row)">编辑</el-button>
                </template>

            </system-list>
            <div class="mt-20 mt-c">
                <el-button type="primary" @click="goBack()">
                    关闭
                </el-button>

            </div>
        </el-card>

    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
// import { publicRequest } from '@/api/common/index.js'
// import { eventdetails } from '@/api/stocklocal.js'
import { getMerchantListCode } from '@/api/operate/index'
const route = useRoute()

const store = useStore()

const router = useRouter()
// const formEl = ref(null)
const rowData = computed(() => store.state.rowData)
console.log(rowData)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantCode', label: '商户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'totalStock', label: '总库存', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'ordStock', label: '普通库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'batchCode', label: '活动编号', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'activeName', label: '活动名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeStock', label: '活动库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'storeCode', label: '店铺编号', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'storeName', label: '店铺名称', minWidth: 130, slot: true },
    // { align: 'center', tooltip: true, prop: 'orgStockPre', label: '普通库存预占', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeStockPre', label: '活动库存预占', minWidth: 130, slot: true }
]
// const tableData = ref([])
// const pageInfo = ref({
//     currPage: 1,
//     pageSize: 20,
//     total: 0
// })
const dataState = reactive({
    pageInfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    searchData: {
        approvalCode: '', // 申请编号
        merchantCode: '', // 商户ID
        merchantName: '', // 商户名称
        approveStatus: '', // 审核状态 2 审批中、3 审批通过、4审批拒绝
        skuId: '', // 商品编码
        skuName: '', // 商品名称
        gmtApplyStart: '', // 提交开始时间
        gmtApplyEnd: '', //	提交结束时间
        date: []
    },
    tableData: [],
    detailDate: {},
    busiCates: ''

})
const { searchData, tableData, pageInfo } = toRefs(dataState)

onMounted(() => {
    getList()

    // searchList()
})
const goBack = () => {
    router.go(-1)
}
console.log(sessionStorage.getItem('rowData'), '01110')
const getList = async (key) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001003',
            // merchantCode: rowData.value?.merchantCode ? rowData.value?.merchantCode : ,
            // skuId: sessionStorage.getItem('rowData').skuId,
            // storeId: sessionStorage.getItem('rowData').shopId,
            merchantCode: rowData.value?.merchantId ? rowData.value?.merchantId : route?.query?.merchantId,
            merchantName: rowData.value?.merchantName ? rowData.value?.merchantName : route?.query?.merchantName,
            skuId: rowData.value?.skuId ? rowData.value?.skuId : route?.query?.skuId,
            storeId: rowData.value?.shopId ? rowData.value?.shopId : route?.query?.shopId,
            pageSize: pageInfo.value.pageSize,
            pageNum: pageInfo.value.currPage

        },
        appKey: 'A1001000',
        busiCode: 'A1001003',
        configCode: 'UCJH60751613490634752',
        name: 'sku详情聚合库存',
        source: '运营后台'

    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        dataState.tableData = res?.data?.list || [JSON.parse(sessionStorage.getItem('rowData'))]
        pageInfo.value.total = res?.data.count
    }
}
// 搜索列表
// const searchList = async (payload) => {
//     const params = {
//         body: {
//             appKey: 'A1001000',
//             busiCode: 'A1001003',
//             skuId: rowData.value?.skuId,
//             skuName: rowData.value?.skuName,
//             merchantId: rowData.value?.merchantId,
//             merchantName: rowData.value?.merchantName,
//             secondChannelId: rowData.value?.secondChannelId,
//             secondChannelName: rowData.value?.secondChannelName,
//             page: {
//                 pageNo: pageInfo.value.currentPage,
//                 pageSize: pageInfo.value.pageSize

//             }
//         },
//         appKey: 'A1001000',
//         busiCode: 'A1001003',
//         configCode: 'UCJH60751613490634752',
//         name: 'sku详情聚合库存',
//         source: '运营后台'

//     }
//     const res = await getMerchantListCode(params)
//     if (res.code === '200') {
//         pageInfo.value.total = res.total
//         tableData.value = res.data ? [res.data] : [JSON.parse(sessionStorage.getItem('rowData'))]
//         // pageInfo.value.total = res.data.total
//         // tableData.value = res?.data?.list ? [res?.data?.list] : [JSON.parse(sessionStorage.getItem('rowData'))]
//     }
//     console.log([sessionStorage.getItem('rowData')], '---')
//     // const res = await eventdetails(params)
//     // console.log(await eventdetails(params), '-res-')

//     // if (res?.list) {
//     //     pageInfo.value.total = res.total
//     //     tableData.value = res.list
//     // }
// }

// // 重置搜索条件
// const resetForm = (formEl) => {
//     if (!formEl) return
//     formEl.resetFields()
//     searchData.value.gmtDealStart = '' //  审核开始时间
//     searchData.value.gmtDealEnd = '' // 审核结束时间
// }
// 导出
// const exportTable = async () => {
//     const params = {
//         merchantCode: userInfo.value.bisMerchantId
//     }
//     const res = await exportStockList(params)

//     const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
//     let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
//     // console.log(fileName)
//     if (fileName) { // 根据后端返回的数据处理文件名称
//         fileName = fileName.substring(fileName.indexOf('=') + 1)
//     }
//     const link = document.createElement('a')// 创建一个a标签
//     link.download = fileName// 设置a标签的下载属性
//     link.style.display = 'none'// 将a标签设置为隐藏
//     link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
//     document.body.appendChild(link)// 将a标签添加到body中
//     link.click()// 执行a标签的点击方法
//     URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
//     document.body.removeChild(link)// 移除a标签
// }
// const sizeChange = (val) => {
//     pageInfo.value.pageSize = val
//     searchList(true)
// }
// const currentChange = val => {
//     pageInfo.value.currPage = val
//     searchList()
// }

const sizeChange = (val) => {
    dataState.pageInfo.currPage = 1
    dataState.pageInfo.pageSize = val
    getList({ ...searchData.value })
}

const currentChange = val => {
    dataState.pageInfo.currPage = val
    getList({ ...searchData.value })
}
const toDetail = async (val, type) => {
    // 跳转到查看详情
    router.push({
        name: 'local-life-examine-mannage-detail',
        query: {
            id: val.activeId,
            type
        }
    })
}
</script>

<style lang="scss">
.locale-goods-inventory-list {

    .mt-20 {
        margin-top: 20px;

    }
        .mt-c {
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
