<!-- 商家售卖范围管理 -->
<template>
    <system-list
        :tHead="tHead"
        :tableData="tableData"
        v-model:current-page="dataState.pageinfo.currPage"
        v-model:page-size="dataState.pageinfo.pageSize"
        v-model:border="boderls"
        v-model:stripe="lines"
        :total="dataState.pageinfo.total"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template #state="{row}">
            <div @click="search" type="primary" text v-if="row.state === '0'">待审核</div>
            <div @click="search" type="primary" text v-else-if="row.state === '1'">已拒绝</div>
        </template>
        <template #merchantStatus="{row}">
            <span  v-if="row.merchantStatus === 1">草稿</span>
            <span  v-if="row.merchantStatus === 2">待审核</span>
            <span  v-if="row.merchantStatus === 3">审核驳回</span>
            <span  v-if="row.merchantStatus === 4">通过</span>
        </template>
        <template #thirdCateName="{row}">
            <el-button @click="toexamine(row, 'applove')" type="text" v-if="row.merchantStatus === 2||row.merchantStatus === 3">审核</el-button>
            <el-button @click="toexamine(row, 'detail')" type="text">查看详情</el-button>
        </template>
    </system-list>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)
// 不展示分页
const isPage = ref(false)

const form = reactive({
    merchantName: '',
    merchantCode: '',
    skuId: '',
    skuName: '',
    goodsId: '',
    goodsName: '',
    stock: '',
    firstChannel: '',
    secondChannel: '',
    numt: ''
})

const dataState = reactive({
    formData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        isEnabled: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    tableData: [{
        firstCateCode: '1',
        firstCateName: '1',
        secondCateCode: '1',
        secondCateName: '1',
        thirdCateCode: '1',
        thirdCateName: '1',
        fourthCateCode: '11',
        fourthCateName: '1',
        type: '11',
        tax: '1',
        state: '0'
    },
    {
        firstCateCode: '1',
        firstCateName: '1',
        secondCateCode: '1',
        secondCateName: '1',
        thirdCateCode: '1',
        thirdCateName: '1',
        fourthCateCode: '11',
        fourthCateName: '1',
        type: '11',
        tax: '1',
        state: '1'
    }]
})
const { pageinfo } = toRefs(dataState)

const tHead = [
    { align: 'center', tooltip: true, prop: 'auditId', label: '申请单号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '申请时间', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantStatus', label: '申请单状态', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审核时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '操作', minWidth: 140, slot: true }
]

// who 弹窗
const whoelastic = ref('')

const dialogObjDelDef = reactive({
    dialogVisible: false,
    width: '70%'
})

const tableData = ref([])
onMounted(() => {
    adminAdd()
})

const searchCoupon = () => {
    dataState.pageinfo.currPage = 1
    adminAdd()
}

const adminAdd = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            page: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC1658866621754FnC2H',
        name: '查询商家属性配置申请信息',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    console.log(data, ' 范围')
    tableData.value = data.list
    dataState.pageinfo.total = data.total
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    // 调用列表方法
    adminAdd()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    // 调用列表方法
    adminAdd()
}

// 审核
const toexamine = (row, handleType) => {
    router.push({
        name: 'sope-list',
        params: { id: row.id, merchantStatus: row.merchantStatus, handleType }
    })
}
// 查看详情
const see = (val, who) => {
    console.log(val, who)
    whoelastic.value = who
    dialogObjDelDef.dialogVisible = true
}

// 关闭弹窗
const dialogCloseDef = () => {
    dialogObjDelDef.dialogVisible = false
}
// 确定
const dialogSuccessDef = () => {
    dialogObjDelDef.dialogVisible = false
}

</script>
<style lang="scss" scoped>
</style>
