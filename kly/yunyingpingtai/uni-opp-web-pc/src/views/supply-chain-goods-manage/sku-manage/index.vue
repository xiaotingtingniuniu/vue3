<template>
    <div class="product-examine-manage-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="140px">
                    <el-form-item label="Sku编码" prop="skuId">
                        <el-input v-model="searchData.skuId" placeholder="请输入Sku编码" clearable />
                    </el-form-item>
                    <el-form-item label="Sku名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入Sku名称" clearable />
                    </el-form-item>
                    <el-form-item label="供应链-商家编号" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商家编号" clearable />
                    </el-form-item>
                    <el-form-item label="供应链-商家名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入商家名称" clearable />
                    </el-form-item>
                    <el-form-item label="标品编号" prop="spuId">
                        <el-input v-model="searchData.spuId" placeholder="请输入标品编号" clearable />
                    </el-form-item>
                    <el-form-item label="标品名称" prop="spuName">
                        <el-input v-model="searchData.spuName" placeholder="请输入标品名称" clearable />
                    </el-form-item>
                    <el-form-item label="上架渠道" prop="secondChannelId">
                        <el-select v-model="searchData.secondChannelId" clearable placeholder="请选择" >
                            <el-option v-for="item in channelList" :key="item.id" :value="item.secondChannelId" :label="item.secondChannelName"></el-option>
                            <!-- <el-option label="全部" value="" />
                            <el-option label="待审核" :value="2" />
                            <el-option label="审核通过" :value="3" />
                            <el-option label="驳回" :value="4" /> -->
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Sku状态" prop="skuStatus">
                        <el-select v-model="searchData.skuStatus" clearable placeholder="请选择" >
                            <!--  1.待审核、2.已审核、3.审核不通过、4.已上架、5.下架可上架、6.下架不可再上架、7.待上架 -->
                            <el-option label="全部" value="" />
                            <el-option label="待审核" :value="1" />
                            <el-option label="已审核" :value="2" />
                            <el-option label="审核不通过" :value="3" />
                            <el-option label="已上架" :value="4" />
                            <el-option label="下架可上架" :value="5" />
                            <el-option label="下架不可再上架" :value="6" />
                            <!-- <el-option label="待上架" :value="7" /> -->
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-button type="primary" @click="opneExamineFn">导出</el-button>
                    <el-button type="primary" @click="searchList(true)">搜索</el-button>
                    <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                ref="multipleTableRef"
                v-model:current-page="pageInfo.pageNo"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #skuId="{row}">
                    <span style="color: #fe2c55;font-size: 14px;font-weight: 500;cursor: pointer;" @click="toDetail(row)">{{row.skuId}}</span>
                </template>
                <template #skuStatus="{row}">
                    <!-- 1.待审核、2.已审核、3.审核不通过、4.已上架、5.下架可上架、6.下架不可再上架、7.待上架 -->
                    <span v-if="row.skuStatus === 1">待审核</span>
                    <span v-if="row.skuStatus === 2">已审核</span>
                    <span v-if="row.skuStatus === 3">审核不通过</span>
                    <span v-if="row.skuStatus === 4">已上架</span>
                    <span v-if="row.skuStatus === 5">下架可上架</span>
                    <span v-if="row.skuStatus === 6">下架不可再上架</span>
                    <span v-if="row.skuStatus === 7">待上架</span>
                </template>
                <template #operation="{row}">
                    <el-button type="primary" @click="toDetail(row)">审核详情</el-button>
                </template>
                <template #gmtCreate="{row}">
                    <div v-if="row.gmtCreate">{{row.gmtCreate.replace('T', ' ')}}</div>
                </template>
                <template #gmtModify="{row}">
                    <div v-if="row.gmtCreate">{{row.gmtModify.replace('T', ' ')}}</div>
                </template>
                <template #image="{row}">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="row.goodsMediaList.find(el => el.mediaType === 4).mediaUrl" :preview-src-list="[row.goodsMediaList.find(el => el.mediaType === 4).mediaUrl]" fit="cover" />
                </template>
            </system-list>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest, publicExport } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
// const formEl = ref(null)
const searchData = ref({
    approvalCode: '', // 申请编码
    merchantId: '', // 商户ID
    merchantName: '', // 商户名称
    skuStatus: '', // sku状态
    skuId: '', // sku编号
    skuName: '', // sku名称
    spuId: '',
    spuName: '',
    secondChannelId: '',
    date: []
})
const pageInfo = ref({
    pageNo: 1,
    pageSize: 10,
    total: 0
})
const selectionData = ref([])
const channelList = ref([])
const tableData = ref([])
const multipleTableRef = ref()

const tHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'skuId', label: 'Sku编号', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'skuName', label: 'Sku名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'image', label: '商品图片', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '供应链-商家编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '供应链-商家名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'productModel', label: '产品型号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'channelPrice', label: 'Sku原价', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '上架渠道', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号', minWidth: 240 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: 'Sku创建时间', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '最新操作时间', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: '商品状态', minWidth: 130, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

onMounted(() => {
    searchList()
    getChannleList()
})

const getChannleList = async () => {
    const param = {
        merchantType: 1,
        channelType: 6
    }
    const res = await publicRequest({ module: 'SUPPLY_CHAIN_GOODS', key: 'SUPPLY_CHAIN_CHANNEL_LIST', body: param })
    console.log(res, 'getChannleList')
    if (res.code === '200') {
        channelList.value = res.data ? res.data : []
    }
}

// 搜索列表
const searchList = async (payload) => {
    if (payload) {
        pageInfo.value.pageNo = 1
    }
    const param = {
        ...pageInfo.value,
        ...searchData.value,
        skuIds: searchData.value.skuId ? [searchData.value.skuId] : [],
        merchantIds: searchData.value.merchantId ? [searchData.value.merchantId] : [],
        merchantNames: searchData.value.merchantName ? [searchData.value.merchantName] : [],
        spuIds: searchData.value.spuId ? [searchData.value.spuId] : [],
        skuStatus: searchData.value.skuStatus ? [searchData.value.skuStatus] : [-1],
        channelTypes: [6],
        secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
        gmtApplyStart: searchData.value.date[0] || '', // 提交开始时间
        gmtApplyEnd: searchData.value.date[1] || '' // 提交结束时间
    }
    delete param.date
    delete param.total
    const res = await publicRequest({ module: 'SUPPLY_CHAIN_GOODS', key: 'SUPPLY_CHAIN_GOODS_LIST', body: param })
    if (res.code === '200') {
        pageInfo.value.total = res.data?.total || 0
        tableData.value = res.data?.list || []
    }
}
// 详情、审批
const toDetail = (val, examine) => {
    router.push({ name: 'supply-chain-goods-detail', params: { skuId: val.skuId, examine } })
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
const currentChange = val => {
    pageInfo.value.pageNo	 = val
    searchList()
}

const opneExamineFn = () => {
    const param = {
        ...pageInfo.value,
        ...searchData.value,
        skuIds: searchData.value.skuId ? [searchData.value.skuId] : [],
        merchantIds: searchData.value.merchantId ? [searchData.value.merchantId] : [],
        merchantNames: searchData.value.merchantName ? [searchData.value.merchantName] : [],
        spuIds: searchData.value.spuId ? [searchData.value.spuIds] : [],
        skuStatus: searchData.value.skuStatus ? [searchData.value.skuStatus] : [-1],
        channelTypes: [6],
        secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
        gmtApplyStart: searchData.value.date[0] || '', // 提交开始时间
        gmtApplyEnd: searchData.value.date[1] || '' // 提交结束时间
    }
    delete param.date
    delete param.total
    publicExport({ module: 'SUPPLY_CHAIN_GOODS', key: 'SUPPLY_CHAIN_GOODS_LIST', body: param })
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
