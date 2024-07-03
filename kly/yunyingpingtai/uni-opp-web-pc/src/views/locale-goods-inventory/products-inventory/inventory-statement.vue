<template>
    <div class="locale-goods-inventory-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商品编号" prop="skuId">
                        <el-input v-model="searchData.skuId" placeholder="请输入商品编号" clearable />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="skuName">
                        <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable />
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
                    <el-form-item prop="radiogroup" label="变动日期范围">
                        <el-date-picker
                            v-model="searchData.radiogroup"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD"

                        />
                        <!-- <el-date-picker
                            v-model="searchData.radiogroup"
                            type="datetimerange"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="YYYY-MM-DD hh:mm:ss"
                        /> -->

                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList(true)">
                            查询
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
                <template #activeId="scope">
                    {{ scope.row.activeId }}
                    <el-button  style="color: rgb(254, 44, 85);cursor: pointer" v-if="scope.row.activeId"  @click="toDetail(scope.row, 'cat')" type="primary" text>/查看详情</el-button>

                </template>
                <template #operationType="scope">

                    {{ scope.row.operationType=== 0?'系统': scope.row.operationType===1?'人工' :scope.row.operationType===2?'活动':''
                    }}

                </template>

                <template #stockChange="scope">
                    <span v-if="scope.row.orderStatus>-1 && scope.row.orderStatus < 7">
                        {{ scope.row.stockChange }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <template #stockBefore="scope">

                    <span v-if="scope.row.orderStatus>-1 && scope.row.orderStatus < 7">
                        {{ scope.row.stockBefore }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <template #stockAfter="scope">
                    <span v-if="scope.row.orderStatus>-1 && scope.row.orderStatus < 7">
                        {{ scope.row.stockAfter }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <!-- 这是普通活动库存结束 -->
                <template #lockStockChange="scope">
                    <span  v-if="scope.row.orderStatus>6 && scope.row.orderStatus < 13">
                        {{ scope.row.lockStockChange }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <template #lockStockAfter="scope">
                    <span  v-if="scope.row.orderStatus>6 && scope.row.orderStatus < 13">
                        {{ scope.row.lockStockAfter }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <template #lockStockBefore="scope">
                    <span  v-if="scope.row.orderStatus>6 && scope.row.orderStatus < 13">
                        {{ scope.row.lockStockBefore }}
                    </span>
                    <span v-else>
                        -
                    </span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="toDetail(scope.row)">编辑</el-button>
                </template>
            </system-list>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'

import SystemList from '@/composables/TablePagination/index.vue'
// import { publicRequest } from '@/api/common/index.js'
// import { getLifeFlowList } from '@/api/stocklocal.js'

// const store = useStore()

// const userInfo = computed(() => store.state.userInfo)
import { getMerchantListCode } from '@/api/operate/index'

const formRef = ref(null)
const searchData = ref({
    skuId: '',
    skuName: '',
    activeId: '',
    activeName: '',
    secondChannelId: '',
    secondChannelName: '',
    radiogroup: []

    // merchantId: '', // 商户ID
    // merchantName: '' // 商品名称
})

const router = useRouter()
// const formEl = ref(null)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuId', label: '商品编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '店铺编号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '店铺名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'operationType', label: '变动类型', minWidth: 130, slot: true },

    { align: 'center', tooltip: true, prop: 'stockChange', label: '普通库存变更数量', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'stockBefore', label: '变更前普通库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'stockAfter', label: '变更后普通库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'lockStockChange', label: '活动库存变更数量', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'lockStockBefore', label: '变更前活动库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'lockStockAfter', label: '变更后活动库存', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '相关单号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '变动时间', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '变更人', minWidth: 130 }
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
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001003',
            channelType: 5,
            ...searchData.value,
            skuIds: searchData.value.skuId ? [searchData.value.skuId] : null,
            dateStart: searchData?.value?.radiogroup?.length ? `${searchData?.value?.radiogroup[0]} 00:00:00` : '',
            secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
            dateEnd: searchData.value?.radiogroup?.length ? `${searchData?.value?.radiogroup[1]} 23:59:59` : '',
            page: {
                pageNo: pageInfo.value.currPage,
                pageSize: pageInfo.value.pageSize
            }

        },
        appKey: 'A1001000',
        busiCode: 'A1001003',
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台'

    }
    if (searchData.value.secondChannelId === '') {
        delete params.body.secondChannelId
    }
    if (searchData.value.radiogroup) {
        delete params.body.radiogroup
    }
    // if (payload) {
    //     params.body = {
    //         ...params.body,
    //         ...searchData.value,
    //         skuIds: searchData.value.skuId ? [searchData.value.skuId] : null,
    //         dateStart: searchData?.value?.radiogroup?.length ? searchData?.value?.radiogroup[0] : '',
    //         secondChannelIds: searchData.value.secondChannelId ? [searchData.value.secondChannelId] : [],
    //         dateEnd: searchData.value?.radiogroup?.length ? searchData?.value?.radiogroup[1] : ''
    //     }
    //     if (searchData.value.secondChannelId === '') {
    //         delete params.body.secondChannelId
    //     }
    //     if (searchData.value.radiogroup) {
    //         delete params.body.radiogroup
    //     }
    // }
    // const res = await getLifeFlowList(params)
    const res = await getMerchantListCode(params)

    if (res.code === '200') {
        pageInfo.value.total = res?.data?.total || 0
        tableData.value = res?.data?.records || []
    }
}

const sizeChange = (val) => {
    pageInfo.value.pageSize = val
    searchList(true)
}
const currentChange = val => {
    pageInfo.value.currPage = val
    searchList()
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
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
