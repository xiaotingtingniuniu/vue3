<template>
    <div class="work-order-container">

        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户编号" prop="busiMerchantId">
                    <el-input v-model="searchData.busiMerchantId" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
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
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >

                <template #infor="scope">
                    <span>店铺编号：{{scope.row.busiMerchantId}}</span><br/>
                    <span>店铺名称：{{scope.row.merchantName}}</span><br/>
                    <span>店铺类型：{{scope.row.merchantType===1?'企业':scope.row.merchantType===2?'自然人':scope.row.merchantType===3?'个人工商户':'事业单位'}}</span><br/>
                </template>
                <template #operation="scope">
                    <el-button text @click="toEdit(scope.row)" type="primary">
                        <!-- v-if="scope.row.busiMerchantStatus ===1 || scope.row.busiMerchantStatus === 3" -->
                        原价管理
                    </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const props = defineProps(['merchantName', 'busiMerchantId', 'merchantType', 'firstChannelId', 'firstChannelName'])
const radio = ref(3)
const tHead = [
    { align: 'left', tooltip: true, prop: 'infor', label: '商品信息', minWidth: 200, fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: '商品数量', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 230, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        busiMerchantId: '',
        merchantName: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    }

})
const { searchData, pageinfo } = toRefs(dataState)

onMounted(async () => {
    await getRefundList()
})
const orderNo = ref('')

// 列表数据

const getRefundList = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            ...dataState.searchData,
            page: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            // busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
}

const toEdit = (row) => {
    router.push({ name: 'price-adjustment-list', params: { merchantName: row.merchantName, busiMerchantId: row.busiMerchantId, merchantType: row.merchantType, firstChannelName: row.firstChannelName, firstChannelId: row.firstChannelId } })
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    getRefundList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
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
