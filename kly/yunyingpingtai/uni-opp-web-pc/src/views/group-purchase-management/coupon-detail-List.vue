<template>
    <div class="sku-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="券编号" prop="voucherCode">
                            <el-input v-model="searchData.voucherCode" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="券状态" prop="voucherStatus">
                            <el-select v-model="searchData.voucherStatus" clearable placeholder="请选择" >
                                <el-option label="已购买" value="1" />
                                <el-option label="已冻结" value="2" />
                                <el-option label="已核销" value="3" />
                                <el-option label="用户退款中" value="4" />
                                <el-option label="退款成功" value="5" />
                                <el-option label="退款失败" value="6" />
                                <el-option label="过期(退款)" value="7" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="团购订单号" prop="orderCode">
                            <el-input v-model="searchData.orderCode" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <!-- <el-col :span="6">
                        <el-form-item label="核销订单号" prop="verifyOrderCode">
                            <el-input v-model="searchData.verifyOrderCode" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="创建时间" prop="creatDate">
                            <el-date-picker
                                v-model="searchData.creatDate"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD hh:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="核销时间" prop="useDate">
                            <el-date-picker
                                v-model="searchData.useDate"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD hh:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户编号" prop="userId">
                            <el-input v-model="searchData.userId" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="用户手机号" prop="phoneMobile">
                            <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList()">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <!-- <el-button type="primary" @click="handleSku()">
                            跳转
                        </el-button> -->
                    </el-form-item>
                </el-row>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currentPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #couponInfo="{row}">
                    券编号：{{row.voucherCode}}<br>
                    券状态：{{voucherStatusValue[row.voucherStatus]}}<br>
                    团购价：¥{{row.specialPrice / 100}}
                </template>
                <template #skuInfo="{row}">
                    sku编号：{{row.skuId}}<br>
                    sku名称：{{row.skuName}}
                </template>
                <template #activeInfo="{row}">
                    活动编号：{{row.batchCode}}<br>
                    创建时间：{{row.gmtCreate}}
                </template>
                <template #orderInfo="{row}">
                    团购编号：{{row.orderCode}}<br>
                    创建时间：{{row.orderCreateDate ? row.orderCreateDate : '--'}}
                </template>
                <template #recordInfo="{row}">
                    核销时间：{{row.verifyDate ? row.verifyDate : '--'}}<br>
                    <!-- 核销记录号：{{row.verifyOrderCode ? row.verifyOrderCode : '--'}} -->
                </template>
                <template #userInfo="{row}">
                    用户编号：{{row.userId}}<br>
                    用户手机号：{{row.phoneMobile}}
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { commonQuery } from '@/api/group-purchase/index.js'
// import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const skuId = route.params.skuId
const batchCode = route.params.batchCode
const tHead = [
    { align: 'center', prop: 'couponInfo', label: '券信息', slot: true },
    { align: 'center', prop: 'skuInfo', label: '商品信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'activeInfo', label: '活动信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'orderInfo', label: '团购订单信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'recordInfo', label: '核销记录信息', minWidth: 150, slot: true },
    { align: 'center', prop: 'userInfo', label: '用户信息', minWidth: 150, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    voucherStatusValue: {
        1: '已购买',
        2: '已冻结',
        3: '已核销',
        4: '用户退款中',
        5: '退款成功',
        6: '退款失败',
        7: '过期(退款)'
    }, // sku状态key-value
    searchData: {
        voucherCode: '',
        voucherStatus: '1',
        orderCode: '',
        verifyOrderCode: '',
        creatDate: '',
        useDate: '',
        userId: '',
        phoneMobile: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})

const { voucherStatusValue, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getActiveInfo()
})
const skuInfo = ref({})
// 查询单个活动详情
const getActiveInfo = async () => {
    const params = {
        skuIds: [skuId],
        skuStatus: ['-1'],
        productType: 1,
        pageNo: 1,
        pageSize: 1
    }
    const val = {
        configCode: 'UCJH56463083344916480',
        name: '团购商品管理聚合',
        source: '运营后台'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        skuInfo.value = res.data.list[0]
        getActiveList()
    }
}
// 列表数据
const getActiveList = async () => {
    const params = {
        reqSource: 2,
        batchCode: batchCode,
        merchantCode: skuInfo.value.merchantId,
        merchantName: skuInfo.value.merchantName,
        storeId: skuInfo.value.store.storeCode,
        storeName: skuInfo.value.store.storeName,
        skuId: skuInfo.value.skuId,
        skuName: skuInfo.value.skuName,
        voucherCode: dataState.searchData.voucherCode,
        voucherStatus: dataState.searchData.voucherStatus,
        orderCode: dataState.searchData.orderCode,
        verifyOrderCode: dataState.searchData.verifyOrderCode,
        orderStartQuery: dataState.searchData.creatDate[0],
        orderEndQuery: dataState.searchData.creatDate[1],
        useDateStartQuery: dataState.searchData.useDate[0],
        useDateEndQuery: dataState.searchData.useDate[1],
        userId: dataState.searchData.userId,
        phoneMobile: dataState.searchData.phoneMobile,
        pageNum: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const val = {
        configCode: 'UC56015768469876736',
        name: '活动核销明细列表',
        source: '核销系统'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        tableData.value = res.data
    }
    dataState.pageinfo.total = res.count
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getActiveList()
}

// 查询
const searchList = () => {
    dataState.pageinfo.currentPage = 1
    getActiveList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getActiveList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getActiveList()
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
