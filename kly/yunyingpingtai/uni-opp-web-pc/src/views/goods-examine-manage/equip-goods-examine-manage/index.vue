<template>
    <div class="product-examine-manage-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="申请编号" prop="approvalCode">
                        <el-input v-model="searchData.approvalCode" placeholder="请输入申请编号" clearable />
                    </el-form-item>
                    <el-form-item label="商户ID" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商户ID" clearable />
                    </el-form-item>
                    <el-form-item label="商户名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入商户名称" clearable />
                    </el-form-item>
                    <el-form-item label="审核状态" prop="approveStatus">
                        <el-select v-model="searchData.approveStatus" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="待审核" :value="2" />
                            <el-option label="审核通过" :value="3" />
                            <el-option label="驳回" :value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品编码" prop="skuId">
                        <el-input v-model="searchData.skuId" placeholder="请输入Sku编号" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入Sku名称" clearable />
                    </el-form-item>
                    <el-form-item label="提交时间" prop="date">
                        <el-date-picker v-model="searchData.date" type="daterange" range-separator="-" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br />
                    <el-button type="primary" @click="opneExamineFn">审核通过</el-button>
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
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="selectionDataFn"
            >
                <template #approvalCode="{ row }">
                    <span style="color: #fe2c55; font-size: 14px; font-weight: 500; cursor: pointer" @click="toDetail(row)">{{ row.approvalCode }}</span>
                </template>
                <template #approveStatus="scope">
                    <span v-if="scope.row.approveStatus === 2" style="color: rgb(254, 44, 85)">待审核</span>
                    <span v-else-if="scope.row.approveStatus === 3">审核通过</span>
                    <span v-else-if="scope.row.approveStatus === 4">驳回</span>
                    <span v-else>-</span>
                </template>
                <template #approveAdvise="{ row }">
                    <span v-if="row.approveStatus === 3">通过</span>
                    <span v-if="row.approveStatus === 4">驳回</span>
                </template>
                <template #categoryList="{ row }">
                    <template v-if="row.categoryList && row.categoryList.length">
                        {{
                            row.categoryList
                                .map((el) => {
                                    const firstCateName = el.busiFirstCateName ? el.busiFirstCateName : ''
                                    const secondCateName = el.busiSecondCateName ? el.busiSecondCateName : ''
                                    const thirdCateName = el.busiThirdCateName ? el.el.busiThirdCateName : ''
                                    let str = firstCateName
                                    if (secondCateName) {
                                        str += '-' + secondCateName
                                    }
                                    if (thirdCateName) {
                                        str += '-' + thirdCateName
                                    }

                                    return str
                                    //return `${el.busiFirstCateName}-${el.busiSecondCateName}-${el.busiThirdCateName}`
                                })
                                .join(',')
                        }}
                    </template>
                </template>
                <template #operation="{ row }">
                    <el-button type="primary" v-if="row.approveStatus === 2" @click="toDetail(row, 'examine')">审核</el-button>
                    <el-button type="primary" v-else @click="toDetail(row)">审核详情</el-button>
                </template>
                <template #image="{ row }">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="row.image" :preview-src-list="[row.image]" fit="cover" />
                </template>
                <template #spuImage="{ row }">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="row.spuImage" :preview-src-list="[row.spuImage]" fit="cover" />
                </template>
                <!-- 2 审批中、3 审批通过、4审批拒绝 -->
                <template #spuId="scope">
                    {{ scope.row.spuId ? scope.row.spuId : '--' }}
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
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
// const formEl = ref(null)
const searchData = ref({
    approvalCode: '', // 申请编码
    merchantId: '', // 商户ID
    merchantName: '', // 商户名称
    approveStatus: '', // 审核状态
    skuId: '', // sku编号
    skuName: '', // sku名称
    date: []
})
const pageInfo = ref({
    currPage: 1,
    pageSize: 10,
    total: 0
})
const selectionData = ref([])
const tableData = ref([])
const multipleTableRef = ref()

const tHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 80 },
    { align: 'center', tooltip: true, prop: 'approvalCode', label: '申请编号', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'approveStatus', label: '审核状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 180 },
    { align: 'center', prop: 'categoryList', label: '商品分类', minWidth: 200, slot: true },
    { align: 'center', prop: 'secondChannelName', label: '适用店铺', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户ID', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'image', label: 'Sku商品图片', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '提交时间', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'approveTime', label: '审核时间', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'approveAdvise', label: '审核结果', minWidth: 130, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 200, slot: true }

    // { align: 'center', tooltip: true, prop: 'spuId', label: '标品编号', minWidth: 240 },
    // { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'spuImage', label: '标品图片', minWidth: 180, slot: true },
]

onMounted(() => {
    searchList()
})

// 搜索列表
const searchList = async (payload) => {
    if (payload) {
        pageInfo.value.currPage = 1
    }
    const param = {
        ...pageInfo.value,
        ...searchData.value,
        gmtApplyStart: searchData.value.date[0] || '', // 提交开始时间
        gmtApplyEnd: searchData.value.date[1] || '' // 提交结束时间
    }
    delete param.date
    delete param.total
    // const res = await publicRequest({ module: 'SPU', key: 'MALL_GOODS_EXAMINE_MANAGE_LIST', body: param })
    const res = await publicRequest({ module: 'SUPPLY_CHAIN_GOODS', key: 'EQUIP_GOODS_EXAMINE_LIST', body: param })
    if (res.code === '200') {
        pageInfo.value.total = res.data?.total || 0
        tableData.value = res.data?.list || []
    }
}
// 详情、审批
const toDetail = (val, examine) => {
    router.push({ name: 'equip-goods-examine-manage-detail', params: { approvalCode: val.approvalCode, examine } })
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

const selectionDataFn = (row) => {
    selectionData.value = []
    row.forEach((el) => {
        if (el.approveStatus === 2) selectionData.value.push(el.approvalCode)
    })
}
const opneExamineFn = () => {
    if (selectionData.value.length) {
        ElMessageBox.confirm('若确认无误，请点击“确定”按钮完成审核。', '请确认是否提交审批结果？', {
            confirmButtonText: '确定',
            cancelButtonText: '关闭'
        })
            .then(async () => {
                const param = {
                    approvalCodeList: selectionData.value,
                    approveStatus: 3
                }
                const res = await publicRequest({ module: 'SPU', key: 'MALL_GOODS_EXAMINE_MANAGE_LIST_EXAMINE', body: param })
                if (res.code === '200') {
                    ElMessage.success('操作成功！')
                    searchList()
                } else {
                    ElMessage.error(res.message)
                }
            })
            .catch(() => {})
    } else {
        ElMessage.warning('请至少选择一条待审核的数据！')
    }
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
