<!-- 商品管理 -->
<template>
    <h1></h1>
    <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
        <el-form-item label="渠道类型" prop="merchantName">
            <!-- <el-input v-model="form.channelType" placeholder="渠道类型" /> -->
            <el-select v-model="form.channelType" placeholder="二级渠道名称">
                <el-option label="全部" value="" />
                <el-option label="APP" value="0" />
                <el-option label="货柜" value="1" />
                <el-option label="门店" value="2" />
                <el-option label="供应链" value="3" />
                <el-option label="B2B商城" value="4" />
            </el-select>
        </el-form-item>
        <el-form-item label="一级渠道名称" prop="firstChannel">
            <el-input v-model="form.firstChannelName" placeholder="请输入一级渠道名称" />
        </el-form-item>
        <el-form-item label="二级渠道名称" prop="secondChannel">
            <el-input v-model="form.secondChannelName" placeholder="请输入二级渠道名称" />
        </el-form-item>
        <el-form-item class="button-box">
            <el-button type="primary" @click="searchCoupon">
                查询
            </el-button>
            <!-- <el-button type="primary" @click="resetForm">
                重置
            </el-button> -->
        </el-form-item>
    </el-form>
    <system-list
        :tHead="tHead"
        :tableData="tableData"
        v-model:current-page="pageinfo.currPage"
        v-model:page-size="pageinfo.pageSize"
        v-model:border="boderls"
        v-model:stripe="lines"
        :total="pageinfo.total"
        @size-change="sizeChange"
        @current-change="currentChange">
        <template #channelType="{row}">
            <span>{{setChannelType[row.channelType]}}</span>
        </template>
    </system-list>
</template>

<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    channelType: '',
    firstChannelName: '',
    secondChannelName: '',
    numt: '啥也没有'
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

const { pageinfo } = toRefs(dataState)

const tableData = ref([])

const formLabelAlign = reactive({
    merchantId: '',
    skuId: '',
    goodsId: '',
    stock: '',
    firstChannel: '',
    secondChannel: '',
    numt: ''
})

const tHead = [
    { align: 'center', tooltip: true, prop: 'skuChannelId', label: '渠道编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'channelType', label: '渠道类型', minWidth: 140, slot: true },
    { align: 'center', tooltip: true, prop: 'firstChannelName', label: '一级渠道名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'channelType', label: '一级渠道编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'secondChannelName', label: '二级渠道名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'secondChannelId', label: '二级渠道编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: '', label: '三级渠道名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: '', label: '三级渠道编号', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'provinceName', label: '三级渠道所在省名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '三级渠道所在市名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'state', label: '三级渠道所在县名', minWidth: 150 }
]
const setChannelType = ref({
    0: 'APP',
    1: '货柜',
    2: '门店',
    3: '供应链',
    4: 'B2B商城'
})
onMounted(() => {
    // console.log(userInfo)
    adminAdd()
})

const searchCoupon = () => {
    dataState.pageinfo.currPage = 1
    adminAdd()
}

const adminAdd = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            channelType: form.channelType === '' ? null : form.channelType,
            firstChannelName: form.firstChannelName === '' ? null : form.firstChannelName,
            secondChannelName: form.secondChannelName === '' ? null : form.secondChannelName,
            page: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC1658564001352htiW2',
        name: '查询商品渠道接口',
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
    // 调用列表方法\
    adminAdd()
}
</script>
<style lang="scss" scoped>
</style>
