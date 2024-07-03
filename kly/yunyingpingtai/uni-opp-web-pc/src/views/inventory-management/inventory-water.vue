<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item prop="merchantName" label="商家名称">
                <el-input v-model="form.merchantName" placeholder="商家名称" />
            </el-form-item>
            <el-form-item prop="merchantId" label="商家编号">
                <el-input v-model="form.merchantId" placeholder="商家编号" />
            </el-form-item>
            <el-form-item prop="skuIds" label="SKU编号">
                <el-input v-model="form.skuIds" placeholder="SKU编号" />
            </el-form-item>
            <el-form-item prop="skuName" label="SKU名称">
                <el-input v-model="form.skuName" placeholder="SKU名称" />
            </el-form-item>
            <el-form-item prop="dateStart" label="日期范围">
                <el-date-picker
                    v-model="form.dateStart"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                />
            </el-form-item>
            <!-- type="monthrange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" -->
            <!-- <el-form-item label="Goods名称">
                <el-input v-model="form.name" placeholder="Goods名称" />
            </el-form-item> -->
            <el-form-item prop="firstChannelId" label="一级渠道">
                <el-select v-model="form.firstChannelId" placeholder="一级渠道">
                    <el-option label="B2B商城" :value="4" />
                    <el-option label="APP" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item prop="secondChannelId" label="二级渠道">
                <el-input v-model="form.secondChannelId" placeholder="二级渠道" />
                <!-- <el-select v-model="form.secondChannelId" placeholder="二级渠道">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select> -->
            </el-form-item>
            <el-form-item prop="goodsIds" label="Goods编号">
                <el-input v-model="form.goodsIds" placeholder="Goods编号" />
            </el-form-item>
            <el-form-item prop="goodsName" label="Goods名称">
                <el-input v-model="form.goodsName" placeholder="Goods名称" />
            </el-form-item><br />
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon()">
                    查询
                </el-button>
                <el-button type="primary" @click="resetForm(formRef)">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="date-list">
            <span>
                <el-form :model="form" label-width="120px">
                    <el-select v-model="form.region" placeholder="显示条数">
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                    </el-select>
                    <el-select v-model="form.region" placeholder="排列顺序">
                        <el-option label="Zone one" value="shanghai" />
                        <el-option label="Zone two" value="beijing" />
                    </el-select> </el-form
                ></span>
        </div> -->
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="merchantId" label="商家编号" />
            <el-table-column prop="merchantName" label="商家名称" />
            <el-table-column prop="channelType" label="一级渠道" />
            <el-table-column prop="skuId" label="SKU编号" />
            <el-table-column prop="skuName" label="SKU名称" />
            <el-table-column prop="goodsId" label="Goods编号" />
            <!-- 库存流水类型：0系统，1人工，2活动 -->
            <el-table-column prop="operationType" label="变动类型" >
                <template v-slot="{row}">
                    {{row.operationType ===0?"系统":row.operationType ===1?"人工":'活动'}}
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="可售数量变更">
                <template v-slot="{row}">
                    {{row.stockAfter - row.stockBefore}}
                </template>
            </el-table-column>
            <el-table-column prop="stockBefore" label="变更前可售数量" />
            <el-table-column prop="stockAfter" label="变更后可售数量" />
            <el-table-column prop="lockStockBefore" label="预占变更前" />
            <el-table-column prop="lockStockAfter" label="预占变更后" />
            <el-table-column prop="orderStatus" label="状态">
                <template v-slot="{ row }">
                    <div v-if="row.orderStatus === 0">提交订单</div>
                    <div v-else-if="row.orderStatus === 1">支付订单</div>
                    <div v-else-if="row.orderStatus === 2">取消订单</div>
                    <div v-else-if="row.orderStatus === 3">订单取消退款</div>
                    <div v-else-if="row.orderStatus === -1">人工操作</div>
                    <div v-else-if="row.orderStatus === 4">活动锁定</div>
                    <div v-else-if="row.orderStatus === 5">活动返回</div>
                    <div v-else>-</div>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="相关单号" />
            <el-table-column prop="gmtCreate" label="变动时间" />
            <el-table-column prop="modifierId" label="变更人" />
        </el-table>
        <div class="bottom">
            <!-- <el-checkbox v-model="checked" label="全选" size="large" />
            <el-select v-model="form.region" placeholder="批量操作">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
            </el-select> -->
            <div class="demo-pagination-block" style="margin: 0 auto">
                <el-pagination
                    v-model:currentPage="dataState.pageinfo.currentPage"
                    v-model:page-size="dataState.pageinfo.pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="dataState.pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { getMerchantList } from '@/api/operate/index'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const busiCodeValue = {
    0: 'A1001004',
    4: 'A1001005'
}
const form = reactive({
    merchantName: '',
    merchantId: '',
    skuIds: '',
    skuName: '',
    dateStart: [],
    firstChannelId: 0,
    secondChannelId: '',
    goodsIds: '',
    goodsName: ''
})
// 底部全选复选框
const checked = ref(false)

// 分页中的页面默认跳转至页数
const currentPage4 = ref('')
// 分页中页面条数的显示
const pageSize4 = ref(100)

const tableData = ref([])

onMounted(() => {
    getRefundList()
})

// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getRefundList()
}

// 展示数据接口
const getRefundList = async () => {
    const params = {
        body: {
            merchantId: form.merchantId,
            merchantName: form.merchantName,
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            goodsIds: form.goodsIds === '' ? [] : [form.goodsIds],
            channelType: form.firstChannelId,
            secondChannelIds: [form.secondChannelId],
            dateStart: form.dateStart[0],
            dateEnd: form.dateStart[1],
            goodsName: form.goodsName,
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            },
            appKey: 'A1001000',
            busiCode: busiCodeValue[form.firstChannelId]
        },
        appKey: 'A1001000',
        busiCode: busiCodeValue[form.firstChannelId],
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台',
        modifierId: userInfo.value.id,
        operatorId: userInfo.value.id,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    if (data) {
        tableData.value = data.records
        dataState.pageinfo.total = data.total
    } else {
        tableData.value = []
        dataState.pageinfo.total = 0
    }
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getRefundList()
    })
}

</script>

<style lang="scss" scoped>
.date-list {
    background-color: rgba($color: black, $alpha: 0.2);
    margin-top: 10px;
    display: flex;
    span {
        flex: 1;
    }
}
.bottom {
    display: flex;
}
</style>
