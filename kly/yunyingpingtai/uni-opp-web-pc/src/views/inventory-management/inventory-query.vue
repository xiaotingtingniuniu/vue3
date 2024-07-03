<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="商家名称" prop="merchantName">
                <el-input v-model="form.merchantName"  placeholder="商家名称"/>
            </el-form-item>
            <el-form-item label="商家编号" prop="merchantCode">
                <el-input v-model="form.merchantCode"  placeholder="商家编号"/>
            </el-form-item>
            <el-form-item label="SKU编号" prop="skuIds">
                <el-input v-model="form.skuIds"  placeholder="SKU编号"/>
            </el-form-item>
            <el-form-item label="SKU名称" prop="skuName">
                <el-input v-model="form.skuName"  placeholder="SKU名称"/>
            </el-form-item>
            <el-form-item label="Goods编号" prop="goodsIds">
                <el-input v-model="form.goodsIds"  placeholder="Goods编号"/>
            </el-form-item>
            <el-form-item label="Goods名称" prop="goodsName">
                <el-input v-model="form.goodsName"  placeholder="Goods名称"/>
            </el-form-item>
            <el-form-item label="一级渠道" prop="firstChannelId">
                <!-- <el-input v-model="form.firstChannelId"  placeholder="一级渠道"/> -->
                <el-select v-model="form.firstChannelId" placeholder="一级渠道">
                    <el-option label="B2B商城" :value="4" />
                    <el-option label="APP" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="二级渠道" prop="secondChannelId">
                <el-input v-model="form.secondChannelId"  placeholder="二级渠道"/>
                <!-- <el-select v-model="form.secondChannelId" placeholder="二级渠道">
                    <el-option label="second" value="second" />
                    <el-option label="Zone two" value="beijing" />
                </el-select> -->
            </el-form-item><br />
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="resetForm">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="date-list"  style="float:right">
            <el-form :model="form" label-width="120px">
                <el-select v-model="form.region" placeholder="排列顺序">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form>
        </div> -->
        <el-table :data="tableData" style="width: 100%" @select="onselect">
            <!-- <el-table-column prop="checked1" label="选择列" align="center">
                <div >
                    <el-checkbox v-model="checked1" label="" size="large" />
                </div>
            </el-table-column> -->
            <el-table-column prop="merchantId" label="商家编号" />
            <el-table-column prop="skuId" label="SKU编号"/>
            <el-table-column prop="skuName" label="SKU名称"/>
            <el-table-column prop="thirdCateName" label="三级分类"/>
            <el-table-column prop="goodsId" label="Goods编号"/>
            <el-table-column prop="goodsName" label="Goods名称"/>
            <el-table-column prop="stockUnit" label="存储单位"/>
            <el-table-column prop="stock" label="可售数量"/>
            <el-table-column prop="channelType" label="一级渠道"/>
            <el-table-column prop="secondChannelName" label="二级渠道"/>
            <el-table-column prop="salePrice" label="价格"/>
            <el-table-column prop="lockStock" label="预占数量"/>
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
        </el-table>
        <div class="bottom">
            <div class="demo-pagination-block" style="margin:0 auto">
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
import { computed, onMounted, reactive, ref } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
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
    merchantCode: '',
    skuIds: '',
    skuName: '',
    goodsIds: '',
    goodsName: '',
    stock: '',
    firstChannelId: 0,
    secondChannelId: ''
})
// 底部全选复选框
const checked = ref(false)
const checked1 = ref(false)

const add = () => {
    router.push({ name: 'inventory-add-list' })
}
const toapply = (orderNo) => {
    router.push({ name: 'inventory-editor-list' })
}

const tableData = ref([])

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getRefundList()
    })
}

// 数据接口

const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
// 数据总数
const totals = ref(0)

onMounted(async () => {
    getRefundList()
    // uslistone()
    // uslisttwo()
})

const onelist = ref([])
const twolist = ref([])
// 查询业务线
// const uslistone = async () => {
//     const params = {
//         body: {
//             busiCode: 'A1001001',
//             busiName: '',
//             roleCode: userInfo.value.userInfo,
//             roleName: userInfo.value.name,
//             creatorId: userInfo.value.id
//         },
//         appKey: 'A1001000',
//         busiCode: 'A1001001',
//         configCode: 'UC1657884654291RUuhQ',
//         name: '查询业务线列表',
//         source: '商户中台',
//         modifierId: userInfo.value.id,
//         operatorId: userInfo.value.id,
//         operatorName: userInfo.value.name
//     }
//     const data = await getMerchantList(params)
//     onelist.value = data
// }

// const uslisttwo = async () => {
//     const params = {
//         body: {
//             channelName: userInfo.value.name,
//             channelId: userInfo.value.id.toString()
//         },
//         appKey: 'A1001000',
//         busiCode: 'A1001001',
//         configCode: 'UC1658393478054vdsgC',
//         name: '查询业务线下二级渠道接口',
//         source: '商户中台',
//         modifierId: userInfo.value.id,
//         operatorId: userInfo.value.id,
//         operatorName: userInfo.value.name
//     }
//     const data = await getMerchantList(params)
//     twolist.value = data
// }

// 展示数据接口
const getRefundList = async () => {
    const params = {
        body: {
            merchantName: form.merchantName,
            merchantId: form.merchantCode,
            // channelType: 0,
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            goodsIds: form.goodsIds === '' ? [] : [form.goodsIds],
            goodsName: form.goodsName,
            stock: form.stock,
            channelType: form.firstChannelId,
            secondChannelIds: [form.secondChannelId],
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            },
            appKey: 'A1001000',
            busiCode: busiCodeValue[form.firstChannelId]
        },
        appKey: 'A1001000',
        busiCode: busiCodeValue[form.firstChannelId],
        configCode: 'UC16216846724755456',
        name: '库存查询',
        source: '库存中台',
        modifierId: userInfo.value.id,
        operatorId: userInfo.value.id,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    if (data) {
        tableData.value = data.list
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

// 查询
// GOODS165796715460328471 SKU165797196618369677
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
}

// 复选全选
const onselect = (selection, row) => {
    // console.log(selection, row)
}

const onCheck = () => {
    if (checked.value) {
        checked1.value = true
    } else {
        checked1.value = false
    }
}

</script>

<style lang="scss" scoped>
.btns{
    margin: 50px 0 20px 1300px;
}
.date-list{
    background-color: rgba($color: black, $alpha: 0.2);
    margin-top: 10px;
    display: flex;
span{
    flex: 1;
}
}
.bottom{
    display: flex;
}
</style>
