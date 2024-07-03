<template>
    <div class="goods-tax-list">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="审核状态" prop="formt">
                        <el-cascader :props="propt" v-model="searchData.formt" clearable/>
                    </el-form-item>
                    <br>
                    <el-button type="primary" @click="searchList(true)">搜索</el-button>
                    <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top: 20px">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                ref="multipleTableRef"
                v-model:current-page="pageInfo.currPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #tax="{row}">
                    {{row.tax}} %
                </template>
            </system-list>
        </el-card>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import { publicRequest } from '@/api/common/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { getMerchantList } from '@/api/operate/index'

const router = useRouter()
const store = useStore()
const formRef = ref(null)
const userInfo = computed(() => store.state.userInfo)
// const formEl = ref(null)
const searchData = ref({
    formt: [],
    date: []
})
const formt = ref([])
const pageInfo = ref({
    currPage: 1,
    pageSize: 10,
    total: 0
})
const selectionData = ref([])
const tableData = ref([])
const multipleTableRef = ref()
const form = reactive({
    skuIds: '',
    skuName: '',
    categoryCode1: '',
    categoryCode2: '',
    categoryCode3: '',
    categoryCode4: '',
    categoryLevel: null
})

const tHead = [
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '一级基础类目' },
    { align: 'center', tooltip: true, prop: 'secondCateName', label: '二级基础类目' },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级基础类目' },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级基础类目' },
    { align: 'center', tooltip: true, prop: 'tax', label: '税率', slot: true }
]

onMounted(() => {
    searchList()
})

// 搜索列表
const searchList = async (payload) => {
    if (payload) {
        pageInfo.value.currPage = 1
    }
    console.log(formt, 11)
    const param = {
        ...pageInfo.value,
        ...searchData.value,
        firstCateCode: searchData.value.formt.length && searchData.value.formt[0] ? searchData.value.formt[0] : '',
        secondCateCode: searchData.value.formt.length && searchData.value.formt[1] ? searchData.value.formt[1] : '',
        thirdCateCode: searchData.value.formt.length && searchData.value.formt[2] ? searchData.value.formt[2] : '',
        fourthCateCode: searchData.value.formt.length && searchData.value.formt[3] ? searchData.value.formt[3] : ''
    }
    delete param.date
    delete param.total
    const res = await publicRequest({ module: 'SPU', key: 'GOODS_TAX_LIST', body: param })
    if (res.code === '200') {
        pageInfo.value.total = res.data?.total || 0
        tableData.value = res.data?.records || []
    }
}
// 重置搜索条件
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    searchList(true)
}
const sizeChange = (val) => {
    pageInfo.value.pageSize = val
    searchList(true)
}
const currentChange = val => {
    pageInfo.value.currPage	 = val
    searchList()
}

const propt = {
    lazy: true,
    checkStrictly: true,
    async lazyLoad (node, resolve) {
        const data = await getMerchantList({
            body: {
                appKey: 'A1001000',
                busiCode: 'A1001001', // ? 'A1001004' // 业务线映射 电商平台 A1001001 改为 A1001004
                code: node.level > 0 ? node.data.value : null,
                level: node.level + 1
            },
            appKey: 'A1001000',
            busiCode: 'A1001001',
            configCode: 'UC1657693233153UhCbX',
            name: '基础类目层级查询',
            source: '商品中台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
            // code: node.level > 0 ? node.data.value : null,
            // level: node.level + 1
        })
        const nodes = data.map((item) => ({
            value: item.code,
            label: item.name,
            leaf: node?.level >= 3
        }))
        if (nodes[0]?.leaf) {
            form.categoryCode = nodes[0].value
            form.categoryLevel = node.level + 1
        }
        resolve(nodes)
    }
}
</script>

<style lang="scss">
.goods-tax-list {
    .search-area {
        .el-form-item__content {
            width: 240px !important;
        }
    }
}
</style>
