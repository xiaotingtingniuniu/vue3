<template>
    <div class="product-examine-manage-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商户ID" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商户ID" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="spuName">
                        <el-input v-model="searchData.spuName" placeholder="请输入商品名称" clearable />
                    </el-form-item>
                    <el-form-item label="申请状态" prop="approvalStatus">
                        <el-select v-model="searchData.approvalStatus" clearable placeholder="请选择" >
                            <!-- <el-option label="未提交" :value="1" /> -->
                            <el-option label="待审核" :value="2" />
                            <el-option label="审核通过" :value="3" />
                            <el-option label="驳回" :value="4" />
                            <el-option label="建模审核中" :value="5" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="69码" prop="barcode">
                        <el-input v-model="searchData.barcode" placeholder="请输入69码" clearable />
                    </el-form-item>
                    <el-form-item label="申请编号" prop="approvalCode">
                        <el-input v-model="searchData.approvalCode" placeholder="请输入申请编号" clearable />
                    </el-form-item>
                    <el-form-item label="审核时间" prop="date">
                        <el-date-picker
                            v-model="searchData.date"
                            type="daterange"
                            range-separator="-"
                            value-format="YYYY-MM-DD"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            @change="dateChange"
                        />
                    </el-form-item>
                    <el-form-item label="业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择">
                            <el-option label="货柜" :value="'A1001002'" />
                            <el-option label="恒掌柜进货商城" :value="'A1001005'" />
                            <el-option label="到家电商" :value="'A1001004'" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList(true)"> 搜索 </el-button>
                        <el-button type="primary" @click="resetForm(formRef)"> 重置 </el-button>
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
                <!-- 申请状态 -->
                <template #approveStatus="scope">
                    <span v-if="scope.row.approveStatus === 1">未提交</span>
                    <span v-if="scope.row.approveStatus === 2" style="color: rgb(254, 44, 85)">待审核</span>
                    <span v-if="scope.row.approveStatus === 3">审核通过</span>
                    <span v-if="scope.row.approveStatus === 4">驳回</span>
                    <span v-if="scope.row.approveStatus === 5">建模审核中</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row)">查看详情</el-button>
                    <el-button type="primary" v-if="scope.row.approveStatus === 2" @click="toDetail(scope.row, 'examine')">审核</el-button>
                </template>
                <template #goodsPhoto="scope">
                    <el-button style="color: rgb(254, 44, 85); cursor: pointer" v-if="scope.row.spuId" @click="checkMaterial(scope.row)" type="primary" text>补充商品素材图</el-button>
                    <span v-if="!scope.row.spuId">--</span>
                </template>
                <template #spuId="scope">
                    {{ scope.row.spuId ? scope.row.spuId : '--' }}
                </template>
                <template #checkStatus="scope">
                    <span v-if="scope.row.approveStatus === 3 || scope.row.approveStatus === 5">通过</span>
                    <span v-if="scope.row.approveStatus === 4">驳回</span>
                    <span v-if="scope.row.approveStatus !== 3 && scope.row.approveStatus !== 4 && scope.row.approveStatus !== 5">--</span>
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
    merchantId: '', // 商户ID
    spuName: '', // 商品名称
    approvalStatus: '', // 申请状态
    barcode: '', // 69码
    approvalCode: '', // 申请编码
    busiCode: '', // 业务线
    gmtDealStart: '', // 	审核开始时间
    gmtDealEnd: '', //	审核结束时间
    date: []
})
const router = useRouter()
const formEl = ref(null)

const tHead = [
    { align: 'center', tooltip: true, prop: 'approvalCode', label: '申请编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '业务线', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '商品名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'approveStatus', label: '申请状态', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编码', minWidth: 240, slot: true },
    { align: 'center', tooltip: true, prop: 'goodsPhoto', label: '商品素材图', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '提交时间', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'gmtDeal', label: '审核时间', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'checkStatus', label: '审核结果', minWidth: 130, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }
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

// 日期数据变化
const dateChange = (val) => {
    console.log(val, 'val')
    searchData.value.gmtDealStart = val === null ? '' : val[0] // 	审核开始时间
    searchData.value.gmtDealEnd = val === null ? '' : val[1] //	审核结束时间
}

// 搜索列表
const searchList = async (payload) => {
    if (payload) {
        pageInfo.value.currPage = 1
    }
    const params = {
        ...searchData.value,
        excludedStatus: '1',
        currPage: pageInfo.value.currPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await publicRequest({ key: 'PRODUCT_EXAMINE_MANAGE_LIAS', body: params })
    if (res.code === '200') {
        pageInfo.value.total = res.data.total
        tableData.value = res.data.records
    }
}
// 详情、审批
const toDetail = (val, examine) => {
    console.log(val.approvalCode)
    // if (val.busiName === '货柜') {
    //     router.push({ name: 'product-examine-mannage-detail-container', params: { approvalCode: val.approvalCode, examine } })
    // } else {
    //     router.push({ name: 'product-examine-mannage-detail', params: { approvalCode: val.approvalCode, examine } })
    // }
    router.push({ name: 'product-examine-mannage-detail-container', params: { approvalCode: val.approvalCode, examine } })
}

// 查看素材媒体文件跳转
const checkMaterial = (row) => {
    router.push({ name: 'apply-detail', params: { goodsId: row.spuId } })
}
// 重置搜索条件
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    searchData.value.gmtDealStart = '' // 	审核开始时间
    searchData.value.gmtDealEnd = '' //	审核结束时间
    searchList(true)
}
const sizeChange = (val) => {
    pageInfo.value.pageSize = val
    searchList(true)
}
const currentChange = (val) => {
    pageInfo.value.currPage = val
    searchList()
}
</script>

<style lang="scss">
.product-examine-manage-list {
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
