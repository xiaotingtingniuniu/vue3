<template>
    <div class="sku-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="商户编号" prop="merchantIds">
                            <el-input v-model="searchData.merchantIds" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商户名称" prop="merchantNames">
                            <el-input v-model="searchData.merchantNames" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="店铺编号" prop="secondChannelIds">
                            <el-input v-model="searchData.secondChannelIds" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="店铺名称" prop="secondChannelName">
                            <el-input v-model="searchData.secondChannelName" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品编号" prop="skuIds">
                            <el-input v-model="searchData.skuIds" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品名称" prop="skuName">
                            <el-input v-model="searchData.skuName" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="商品状态" prop="skuStatus">
                            <el-select v-model="searchData.skuStatus" clearable placeholder="请选择" >
                                <el-option label="全部" value="" />
                                <el-option label="待审核" value="1" />
                                <el-option label="已审核" value="2" />
                                <el-option label="审核不通过" value="3" />
                                <el-option label="已上架" value="4" />
                                <el-option label="下架可上架" value="5" />
                                <el-option label="下架不可再上架" value="6" />
                                <el-option label="待上架" value="7" />
                            </el-select>
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
                <template #skuInfo="{row}">
                    sku编号：{{row.skuId}}<br>
                    sku名称：{{row.skuName}}
                </template>
                <template #merchantInfo="{row}">
                    商户编号：{{row.merchantId}}<br>
                    商户名称：{{row.merchantName}}
                </template>
                <template #storeInfo="{row}">
                    店铺编号：{{row.shopId}}<br>
                    店铺名称：{{row.shopName}}
                </template>
                <template #skuStatus="{row}">
                    {{skuStstusValue[row.skuStatus.toString()] || '--'}}
                </template>
                <template #isValidTime="{row}">
                    开始：{{row.isValidBeginTime ? row.isValidBeginTime : '--'}}<br>
                    <br>
                    结束：{{row.isValidEndTime ? row.isValidEndTime : '--'}}
                </template>
                <template #count="{row}">
                    {{row.voucherCount ? row.voucherCount : '--'}}/{{row.unVerifyCount ? row.unVerifyCount : '--'}}/{{row.usedCount ? row.usedCount : '--'}}
                </template>
                <template #price="{row}">
                    原价：{{row.markOffPrice ? '¥' + row.markOffPrice/100 : '--'}}<br>
                    团购价：{{row.specialPrice ? '¥' + row.specialPrice/100 : '--'}}<br>
                    折扣率：{{row.rate ? row.rate + '%' : '--'}}
                </template>
                <template #operation="{row}">
                    <el-button type="text" @click="handleSku(row.skuId)">
                        查看团购活动
                    </el-button>
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
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()

const router = useRouter()

const tHead = [
    { align: 'center', prop: 'skuInfo', label: '商品信息', minWidth: 100, slot: true },
    { align: 'center', prop: 'merchantInfo', label: '商户信息', minWidth: 100, slot: true },
    { align: 'center', prop: 'storeInfo', label: '店铺信息', minWidth: 100, slot: true },
    { align: 'center', prop: 'skuStatus', label: '商品状态', slot: true },
    { align: 'center', prop: 'isValidTime', label: '当前团购活动有效期', minWidth: 100, slot: true },
    { align: 'center', prop: 'count', label: '当前团购券数量（申请/待核销/已核销）', minWidth: 100, slot: true },
    { align: 'center', prop: 'price', label: '当前价格', slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 100, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    skuStstusValue: {
        1: '待审核',
        2: '已审核',
        3: '审核不通过',
        4: '已上架',
        5: '下架可上架',
        6: '下架不可再上架',
        7: '待上架'
    }, // sku状态key-value
    searchData: {
        merchantIds: '',
        merchantNames: '',
        secondChannelIds: '',
        secondChannelName: '',
        skuIds: '',
        skuName: '',
        skuStatus: null
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})

const { skuStstusValue, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getActiveList()
})

const handleSku = (skuId) => {
    router.push({
        name: 'group-purchase-active-list',
        params: {
            skuId
        }
    })
}

// 列表数据
const getActiveList = async () => {
    const params = {
        merchantIds: dataState.searchData.merchantIds === '' ? [] : [dataState.searchData.merchantIds],
        merchantNames: dataState.searchData.merchantNames === '' ? [] : [dataState.searchData.merchantNames],
        secondChannelIds: dataState.searchData.secondChannelIds === '' ? [] : [dataState.searchData.secondChannelIds],
        secondChannelName: dataState.searchData.secondChannelName || null,
        skuIds: dataState.searchData.skuIds === '' ? [] : [dataState.searchData.skuIds],
        skuName: dataState.searchData.skuName || null,
        skuStatus: dataState.searchData.skuStatus ? [dataState.searchData.skuStatus] : ['-1'],
        pageNo: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const val = {
        configCode: 'UCJH56463083344916480',
        name: '团购商品管理聚合',
        source: '运营后台'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        tableData.value = res.data.list
        tableData.value.map(item => {
            if (item.markOffPrice && item.specialPrice) {
                item.rate = ((item.markOffPrice - item.specialPrice) / item.markOffPrice * 100).toFixed(2)
            } else {
                item.rate = null
            }
        })
    }
    dataState.pageinfo.total = res.data.total
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
