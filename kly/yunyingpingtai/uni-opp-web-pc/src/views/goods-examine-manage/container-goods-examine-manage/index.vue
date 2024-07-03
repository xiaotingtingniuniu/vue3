<template>
    <div class="container-goods-examine-manage-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商户ID" prop="merchantId">
                        <el-input v-model="searchData.merchantId" placeholder="请输入商户ID" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="goodsName">
                        <el-input v-model="searchData.goodsName" placeholder="请输入商品名称" clearable />
                    </el-form-item>
                    <el-form-item label="审核状态" prop="approvalStatus">
                        <el-select v-model="searchData.approvalStatus" clearable placeholder="请选择" >
                            <el-option label="待审核" :value="1" />
                            <el-option label="审核通过" :value="2" />
                            <el-option label="驳回" :value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="提交时间" prop="date1">
                        <el-date-picker
                            v-model="searchData.date1"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="YYYY-MM-DD"
                            @change="submitDateChange"
                        />
                    </el-form-item>
                    <el-form-item label="审核时间" prop="date2">
                        <el-date-picker
                            v-model="searchData.date2"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="YYYY-MM-DD"
                            @change="examineDateChange"
                        />
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="currentChange(1)">
                            搜索
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <el-button type="primary" @click="onExamine('2')">
                审批通过
            </el-button>
            <el-button type="primary" @click="onExamine('3')">
                驳回
            </el-button>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="tableSelection"
            >
                <template #approveStatus="scope">
                    <span v-if="scope.row.approveStatus === 1">待审核</span>
                    <span v-if="scope.row.approveStatus === 2">审核通过</span>
                    <span v-if="scope.row.approveStatus === 3">驳回</span>
                </template>
            </system-list>
        </el-card>
        <el-dialog
            v-if="dialogVisible"
            v-model="dialogVisible"
            title="提示"
            width="30%"
            :before-close="handleClose"
        >
            <el-form :model="form" label-width="120px">
                <el-form-item label="审批意见">
                    <el-input v-model="form.approveAdvise" type="textarea" placeholder="请输入审批意见" maxlength="80" :show-word-limit="true"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="onSubmit">提交</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'
import { updateGoodsStatus } from '@/api/goods-sku/index.js'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
const searchData = ref({
    merchantId: '', // 商户ID
    goodsName: '', // goods 名称
    approvalStatus: '', // 审核状态 1、待审核 2、审核通过 3、驳回
    gmtCreateStart: '', // 提交开始时间
    gmtCreateEnd: '', // 提交结束时间
    gmtDealStart: '', // 审核开始时间
    gmtDealEnd: '', // 审核结束时间
    date1: [],
    date2: []
})
const userInfo = computed(() => store.state.userInfo)
const formRef = ref(null)
const router = useRouter()
const formEl = ref(null)
const form = reactive({
    approveAdvise: '',
    approveState: ''
})
const tHead = [
    { align: 'center', label: '申请编号', minWidth: 100, type: 'selection' },
    { align: 'center', tooltip: true, prop: 'approvalCode', label: '申请编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'goodsName', label: '审核项-Goods名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'guideSalePrice', label: '非审核项-Goods价格', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '提交时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '审核时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'approveStatus', label: '审核状态', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'approveAdvise', label: '审核意见', minWidth: 130 }
]
const dialogVisible = ref(false)
const selectionData = ref([])
const tableData = ref([{
    a: 1,
    approvalCodes: 'APLSPA1A1A2012346'
}])
const pageInfo = ref({
    currentPage: 1,
    pageSize: 10,
    total: 10
})
// 搜索列表
const searchList = async () => {
    const params = {
        ...searchData.value,
        currPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await publicRequest({ key: 'CONTAINER_GOODS_EXAMINE_MANAGE_LIST', body: params })
    if (res.code === '200') {
        pageInfo.value.total = res.data.total
        tableData.value = res.data.records
    }
}
searchList()
// 提交时间
const submitDateChange = val => {
    searchData.value.gmtCreateStart = val[0] || ''
    searchData.value.gmtCreateEnd = val[1] || ''
}
// 审核时间
const examineDateChange = val => {
    searchData.value.gmtDealStart = val[0] || ''
    searchData.value.gmtDealEnd = val[1] || ''
}
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    searchData.value.gmtCreateStart = ''
    searchData.value.gmtCreateEnd = ''
    searchData.value.gmtDealStart = ''
    searchData.value.gmtDealEnd = ''
}
const sizeChange = val => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    searchList()
}
const currentChange = val => {
    pageInfo.value.currentPage = val
    searchList()
}
const tableSelection = val => {
    selectionData.value = val
    console.log(val, 'val')
}
const onExamine = async (state) => {
    if (!selectionData.value.length) {
        return ElMessage.error('请选择商品')
    }
    form.approveAdvise = ''
    form.approveState = state
    dialogVisible.value = true
}
const handleClose = () => {
    dialogVisible.value = false
}
// const updataPrices = async (channelPrices) => {
//     const params = {
//         operatorId: userInfo.value.account,
//         operatorName: userInfo.value.name,
//         channelPrices
//     }
//     const res = await publicRequest({ key: 'UPDATE_GOODS_PRICES', body: params })
//     console.log(res)
// }
const onSubmit = async () => {
    const approvalGoods = []
    selectionData.value.map(el => {
        approvalGoods.push({
            approvalCode: el.approvalCode,
            channelPrice: el.guideSalePrice
        })
    })
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC16223209018355712',
        name: '修改Goods修改申请单状态',
        source: '商品中台',
        body: {
            ...form,
            appKey: 'A1001000',
            busiCode: 'A1001002',
            approvalGoods,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        }
    }
    const res = await updateGoodsStatus(params)
    if (res.code === '200') {
        ElMessage.success('操作成功')
        searchList()
        dialogVisible.value = false
    }
}
</script>
