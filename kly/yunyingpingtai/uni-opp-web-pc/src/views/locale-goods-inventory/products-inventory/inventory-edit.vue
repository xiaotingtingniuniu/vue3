<template>
    <div class="locale-goods-inventory-list">
        <el-card class="box-card">
            <h5>商品库存编辑

            </h5>
        </el-card>
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
                <template #ordStock="scope">
                    <el-input v-model.trim="formData.ordStock" @input="oninput(scope.row)" placeholder="请输入" />

                </template>

            </system-list>
            <div class="mt-20 mt-c">
                <el-button type="primary" @click="submit()">
                    提交
                </el-button>
                <el-button type="primary" @click="goBack()">
                    取消
                </el-button>

            </div>
        </el-card>

    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'
// import { getLocalLifeList, modifyStock } from '@/api/stocklocal.js'
const store = useStore()
const route = useRoute()

const router = useRouter()
// const formEl = ref(null)

const userInfo = computed(() => store.state.userInfo)
const rowData = computed(() => store.state.rowData)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'totalStock', label: '总库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'ordStock', label: '普通库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'activeId', label: '活动编号', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'activeName', label: '活动名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeStock', label: '活动库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '店铺编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '店铺名称', minWidth: 130 }
    // { align: 'center', tooltip: true, prop: 'orgStockPre', label: '普通库存预占', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'activeStockPre', label: '活动库存预占', minWidth: 130 }
]
const tableData = ref([])
const account = ref(0)
const pageInfo = ref({
    currPage: 1,
    pageSize: 20,
    total: 0
})
const formData = ref({
    ordStock: 0
})
onMounted(() => {
    getList()
})
const goBack = () => {
    router.push({
        name: 'inventory-management-local-list'
    })
}
const submit = async () => {
    const params = {
        skuId: rowData.value.skuId,
        stock: formData.value.ordStock

    }
    // const res = await modifyStock(params)
    // console.log(res, 'res=======')

    // if (res) {
    //     ElMessage.success('操作成功')

    //     router.push({
    //         name: 'inventory-management-local-list'
    //     })
    // }
}
// 搜索列表
const getList = async (payload) => {
    if (payload) {
        pageInfo.value.currPage = 1
    }
    const params = {
        skuIds: [route.query?.spuId + ''],
        merchantId: userInfo.value.bisMerchantId || '',
        page: {
            pageNo: pageInfo.value.currPage,
            pageSize: pageInfo.value.pageSize
        }
        // channelType: 1
    }
    // const res = await getLocalLifeList(params)
    // if (res?.list) {
    //     pageInfo.value.total = res.total
    //     tableData.value = res.list
    //     formData.value.ordStock = res.list[0].ordStock
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
const oninput = (val) => {
    account.value = val.ordStock
    console.log(account.value)
}
const sizeChange = (val) => {
    pageInfo.value.pageSize = val
    getList(true)
}
const currentChange = val => {
    pageInfo.value.currPage = val
    getList()
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
