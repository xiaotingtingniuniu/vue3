<template>
    <div>
        <div class="info-area">
            <el-table :data="tableDataInfo" border style="width: 100%">
                <el-table-column prop="merchantInfo" label="商户信息">
                    <template v-slot="{row}">
                        <div>商户编号：{{row.merchantId}}</div>
                        <div>商户名称: {{row.merchantName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="storeInfo" label="店铺信息">
                    <template v-slot="{row}">
                        <div>门店编号：{{row.secondChannelId}}</div>
                        <div>门店名称: {{row.secondChannelName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsInfo" label="商品信息">
                    <template v-slot="{row}">
                        <div>sku编号：{{row.skuId}}</div>
                        <div>sku名称: {{row.skuName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态">
                    <template v-slot="{row}">
                        {{skuStstusValue[row.skuStatus.toString()]}}
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="原价">
                    <template v-slot="{row}">
                        <div>原价：¥{{row.channelPrice}}</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="活动编号" prop="batchCode">
                            <el-input v-model="searchData.batchCode" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建人" prop="applier">
                            <el-input v-model="searchData.applier" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="创建时间" prop="gmtCreate">
                            <el-date-picker
                                v-model="searchData.gmtCreate"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD hh:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="活动有效期" prop="isValidTime">
                            <el-date-picker
                                v-model="searchData.isValidTime"
                                type="datetimerange"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="YYYY-MM-DD hh:mm:ss"
                            />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="活动状态" prop="batchStatus">
                            <el-select v-model="searchData.batchStatus" clearable placeholder="请选择" >
                                <el-option label="全部" value="" />
                                <el-option label="草稿" value="1" />
                                <el-option label="待开始" value="2" />
                                <el-option label="在线" value="3" />
                                <el-option label="已停止" value="4" />
                                <el-option label="已结束" value="5" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="reload()">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
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
                <template #activeInfo="{row}">
                    活动编号：{{row.batchCode}}<br>
                    创建时间：{{row.gmtCreate}}<br>
                    创建人：{{row.applier}}
                </template>
                <!-- 活动有效期 -->
                <template #activeIsValidTime="{row}">
                    开始：{{row.isValidBeginTime}}<br>
                    结束：{{row.isValidEndTime}}
                </template>
                <!-- 券有效期 -->
                <template #couponIsValidTime="{row}">
                    <span v-if="row.termType === 1">
                        领取后{{row.isValidDays}}天后生效，有效期{{row.validDays}}天
                    </span>
                    <span v-if="row.termType === 2">
                        开始：{{row.useBeginDate}}<br>
                        结束：{{row.useEndDate}}
                    </span>
                </template>
                <!-- 接待时间 -->
                <template #useTimeContent="{row}">
                    <span v-if="row.useTimeContent">
                        星期几接待：{{row.useTimeContent.weeks && row.useTimeContent.weeks}}<br>
                        接待时间：{{row.useTimeContent.timeRanges && row.useTimeContent.timeRanges[0]}}<br>
                        接待时间：{{row.useTimeContent.timeRanges && row.useTimeContent.timeRanges[1]}}
                    </span>
                    <span v-else>
                        --
                    </span>
                </template>
                <!-- 价格信息 -->
                <template #price="{row}">
                    原价：{{row.markOffPrice ? '¥' + row.markOffPrice/100 : '--'}}<br>
                    团购价：{{row.specialPrice ? '¥' + row.specialPrice/100 : '--'}}<br>
                    折扣率：{{row.rate ? row.rate + '%' : '--'}}
                </template>
                <!-- 团购券数量 -->
                <template #count="{row}">
                    {{row.voucherCount ? row.voucherCount : '--'}}/{{row.unVerifyCount ? row.unVerifyCount : '--'}}/{{row.usedCount ? row.usedCount : '--'}}
                </template>
                <template #batchStatus="{row}">
                    {{batchStatusValue[row.batchStatus.toString()] || '--'}}
                </template>
                <template #operation="{row}">
                    <el-button type="text" @click="toCouponDetail(row.batchCode)">
                        券详情
                    </el-button>
                    <el-button type="text" @click="stopAvtive(row.batchCode)" v-if="row.platformType === 1 && (row.batchStatus === 2 || row.batchStatus === 3)">
                        停止
                    </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { commonQuery } from '@/api/group-purchase/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

const userInfo = computed(() => store.state.userInfo)
const skuId = route.params.skuId
const tHead = [
    { align: 'center', prop: 'activeInfo', label: '活动信息', minWidth: 100, slot: true },
    { align: 'center', prop: 'activeIsValidTime', label: '活动有效期', minWidth: 100, slot: true },
    { align: 'center', prop: 'couponIsValidTime', label: '券有效期', minWidth: 100, slot: true },
    { align: 'center', prop: 'useTimeContent', label: '接待时间', minWidth: 200, slot: true },
    { align: 'center', prop: 'price', label: '价格信息', minWidth: 100, slot: true },
    { align: 'center', prop: 'count', label: '当前团购券数量（申请/待核销/已核销）', minWidth: 100, slot: true },
    { align: 'center', prop: 'singleUserMax', label: '单人限购数量' },
    { align: 'center', prop: 'batchStatus', label: '活动状态', slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 100, slot: true }
]

const tableData = ref([])
const tableDataInfo = ref([])
const dataState = reactive({
    skuStstusValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    }, // sku状态key-value
    batchStatusValue: {
        1: '草稿',
        2: '待开始',
        3: '在线',
        4: '已停止',
        5: '已结束'
    }, // sku状态key-value
    searchData: {
        batchCode: '',
        applier: '',
        gmtCreate: [],
        isValidTime: [],
        batchStatus: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})

const { skuStstusValue, searchData, pageinfo, batchStatusValue } = toRefs(dataState)

onMounted(() => {
    getActiveInfo()
})

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getActiveList()
}

// 查询
const reload = () => {
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
const skuInfo = ref({})
// 查询单个活动详情
const getActiveInfo = async () => {
    const params = {
        skuIds: [skuId],
        skuStatus: ['-1'],
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
        tableDataInfo.value = res.data.list
        if (res.data.list.length === 0) return false
        skuInfo.value = tableDataInfo.value[0]
        getActiveList()
    }
}
// 新增/编辑团购活动
const goToActiveConfig = (type, skuId, batchCode) => {
    router.push({
        name: 'group-purchase-active-config',
        params: {
            batchCode,
            type,
            skuId
        }
    })
}

// 列表数据
const getActiveList = async () => {
    const params = {
        reqSource: 2,
        merchantCode: skuInfo.value.merchantId,
        merchantName: skuInfo.value.merchantName,
        storeId: skuInfo.value.store.storeCode,
        storeName: skuInfo.value.store.storeName,
        skuId: skuInfo.value.skuId,
        skuName: skuInfo.value.skuName,
        applier: dataState.searchData.applier || null,
        batchCode: dataState.searchData.batchCode,
        gmtCreateBegin: dataState.searchData.gmtCreate[0] || null,
        gmtCreateEnd: dataState.searchData.gmtCreate[1] || null,
        isValidBeginTime: dataState.searchData.isValidTime[0] || null,
        isValidEndTime: dataState.searchData.isValidTime[1] || null,
        batchStatus: dataState.searchData.batchStatus || null,
        pageNum: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const val = {
        configCode: 'UC56014491518218240',
        name: 'sku履约批次列表',
        source: '核销系统'
    }
    const res = await commonQuery(params, val)
    if (res.code === '200') {
        tableData.value = res.data
        tableData.value.map(item => {
            if (item.markOffPrice && item.specialPrice) {
                item.rate = ((item.markOffPrice - item.specialPrice) / item.markOffPrice * 100).toFixed(2)
            } else {
                item.rate = null
            }
        })
    }
    tableData.value.map(item => {
        if (!item.useTimeContent) return false
        item.useTimeContent = JSON.parse(item.useTimeContent)
        item.useTimeContent.weeks = item.useTimeContent.weeks.join()
    })
    dataState.pageinfo.total = res.count
}
// 删除
const delAvtive = async (batchCode) => {
    ElMessageBox.confirm(
        '确定删除当前活动？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const params = {
                operateFlag: 2,
                batchCode
            }
            const val = {
                configCode: 'MS55704494929162243',
                name: '删除团购活动"',
                source: '核销中台'
            }
            const res = await commonQuery(params, val)
            if (res.code === '200') {
                ElMessage.success(res.message)
                reload()
            }
        })
}
// 停止
const stopAvtive = async (batchCode) => {
    ElMessageBox.confirm(
        '确定停止当前活动？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const params = {
                merchantCode: skuInfo.value.merchantId,
                skuId: skuInfo.value.skuId,
                operateFlag: 4,
                batchCode
            }
            const val = {
                configCode: 'UC55977928772005888',
                name: '发布/停止团购活动接口',
                source: '核销系统'
            }
            const res = await commonQuery(params, val)
            if (res.code === '200') {
                ElMessage.success(res.message)
                reload()
            }
        })
}
// 券详情
const toCouponDetail = (batchCode) => {
    router.push({
        name: 'coupon-detail-List',
        params: {
            skuId: route.params.skuId,
            batchCode
        }
    })
}
</script>
<style lang="scss" scoped>
.info-area{
    margin-bottom: 30px;
}
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
