<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <!-- <el-form-item label="计费场景" prop="feeScene">
                <el-select v-model="form.feeScene" clearable placeholder="请选择">
                    <el-option label="货柜" value="1" />
                    <el-option label="批发商城" value="2" />
                </el-select>
            </el-form-item> -->
            <el-form-item label="生效状态" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择">
                    <el-option label="生效中" value="1" />
                    <el-option label="已失效" value="2" />
                    <el-option label="待生效" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="addBilling">
                    + 新增
                </el-button>
            </el-form-item>
        </el-form>
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
            <template #feeAmount="{row}">
                <span v-if="row.feeMode === 1">{{row.feeAmount / 100}}元</span>
                <span v-if="row.feeMode === 2">{{row.feeAmount /100}}%</span>
            </template>
            <!-- <template #feeMode="scope">
                <span v-if="scope.row.feeMode === 1">直营</span>
                <span v-if="scope.row.feeMode === 2">代运营</span>
            </template> -->
            <template #operationN="{row}">
                <el-button @click="search(row)" type="text">编辑</el-button>
            </template>
        </system-list>
    </div>
</template >

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
    feeScene: '',
    status: ''
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
    }
})

const tHead = [
    { align: 'center', tooltip: true, prop: 'feeSceneName', label: '计费场景', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'feeCodeName', label: '计费项名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'feeAmount', label: '费率', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'feeAttributionName', label: '归属角色', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '生效开始时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '生效结束时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'statusDesc', label: '生效状态', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'modifier', label: '操作员', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operationN', label: '操作', minWidth: 120, slot: true }
]

// 添加
const addBilling = () => {
    router.push({ name: 'billing-item-add' })
}

// 修改
const search = (val) => {
    router.push({ name: 'billing-item-edit', params: { id: val.id } })
}

const tableData = ref([])
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
            feeScene: form.feeScene,
            status: form.status,
            page: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC32467687032135680',
        name: '计费项列表',
        source: '结算中台',
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
