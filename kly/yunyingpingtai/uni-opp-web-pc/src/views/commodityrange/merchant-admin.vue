<!-- 商户品牌围管理 -->
<template>
    <h1></h1>
    <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
        <el-form-item label="商户编号" prop="merchantId">
            <el-input v-model="form.merchantId" placeholder="商户编号" />
        </el-form-item>
        <el-form-item label="商户名称" prop="merchantName">
            <el-input v-model="form.merchantName" placeholder="商户名称" />
        </el-form-item>
        <el-form-item label="品牌名称" prop="brandName">
            <el-input v-model="form.brandName" placeholder="品牌名称" />
        </el-form-item><br />
        <el-form-item class="button-box" style="margin-left:90%">
            <el-button type="primary" @click="searchCoupon">
                查询
            </el-button>
            <!-- <el-button type="primary" @click="resetForm">
                重置
            </el-button> -->
        </el-form-item>
    </el-form>
    <!-- <el-select v-model="value" class="m-2" placeholder="显示条数" style="margin-left: 90%">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
    </el-select> -->
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
        <template #gmtCreate="{row}">
            <span>{{row.gmtCreate.replace('T',' ')}}</span>
        </template>
    </system-list>
</template>

<script setup>
import { reactive, ref } from '@vue/reactivity'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    merchantId: '',
    merchantName: '',
    brandName: '',
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
        state: '1'
    }]
})

const tableData = ref([])

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantId', label: '商户编号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: '', label: '状态', minWidth: 120 },
    { align: 'center', tooltip: true, prop: '', label: '申请单号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: '', label: '申请时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '审核时间', minWidth: 120, slot: true }
    // { align: 'center', tooltip: true, prop: 'fourthCateName', label: '操作', minWidth: 120, slot: true }
]

// 修改
const search = (val) => {
    _search(val)
}

const _search = async (res) => {
    const params = {
        body: {
            reqVO: '',
            id: res.id
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC16585640013641ac6i',
        name: '根据品牌id修改品牌信息',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    await getMerchantList(params)
}

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
            merchantId: form.merchantId,
            merchantName: form.merchantName,
            brandName: form.brandName,
            page: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1658564001361qkVES',
        name: '分页品牌查询',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
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
</script>
<style lang="scss" scoped>
</style>
