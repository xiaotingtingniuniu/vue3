<template>
    <div class="locale-goods-inventory-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商品编号" prop="skuId">
                        <el-input v-model="searchData.skuId" placeholder="请输入商户ID" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable />
                    </el-form-item>
                    <el-form-item label="活动ID" prop="activeId">
                        <el-input v-model="searchData.activeId" placeholder="请输入活动ID" clearable />
                    </el-form-item>
                    <el-form-item label="活动名称" prop="activeName">
                        <el-input v-model="searchData.activeName" placeholder="请输入活动名称" clearable />
                    </el-form-item>
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
                        <el-button type="primary" @click="searchList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
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
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row)">查看详情</el-button>
                    <el-button type="primary" v-if="scope.row.approveStatus === 2" @click="toDetail(scope.row, 'examine')">审核</el-button>
                </template>
            </system-list>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'

const formRef = ref(null)
const searchData = ref({
    skuId: '',
    skuName: '',
    activeId: '',
    activeName: '',
    secondChannelId: '',
    secondChannelName: '',
    merchantId: '', // 商户ID
    merchantName: '' // 商品名称
})

const router = useRouter()
const formEl = ref(null)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'totalStock', label: '总库存', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'ordStock', label: '普通库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'activeId', label: '活动编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeName', label: '活动名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeStock', label: '活动库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '店铺编号', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '店铺名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'orgStockPre', label: '普通库存预占', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'activeStockPre', label: '活动库存预占', minWidth: 130, slot: true }
]
const tableData = ref([])
const pageInfo = ref({
    currPage: 1,
    pageSize: 10,
    total: 0
})

onMounted(() => {
    searchList()
})

// 搜索列表
const searchList = async (payload) => {
    if (payload) {
        pageInfo.value.currPage = 1
    }
    const params = {
        // ...searchData.value,
        // excludedStatus: '1',
        currPage: pageInfo.value.currPage,
        pageSize: pageInfo.value.pageSize,
        channelType: 1

    }
    const res = await publicRequest({ key: 'LOCAL_LIFE_GOODS_INVENTORY', body: params })
    if (res.code === '200') {
        pageInfo.value.total = res.data.total
        tableData.value = res.data.records
    }
}
// 详情、审批
const toDetail = (val, examine) => {
    console.log(val.approvalCode)
    if (val.busiName === '货柜') {
        router.push({ name: 'product-examine-mannage-detail-container', params: { approvalCode: val.approvalCode, examine } })
    } else {
        router.push({ name: 'product-examine-mannage-detail', params: { approvalCode: val.approvalCode, examine } })
    }
}

// 重置搜索条件
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    searchData.value.gmtDealStart = '' // 	审核开始时间
    searchData.value.gmtDealEnd = '' //	审核结束时间
}
const sizeChange = (val) => {
    pageInfo.value.pageSize = val
    searchList(true)
}
const currentChange = val => {
    pageInfo.value.currPage = val
    searchList()
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
