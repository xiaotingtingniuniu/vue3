<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="始发省" prop="srcProvinceCode">
                    <!-- <el-input type="input" v-model="searchData.srcProvinceCode" placeholder="始发省" /> -->
                    <el-select v-model="searchData.srcProvinceCode" clearable placeholder="请选择" @change="cahngeProvice">
                        <el-option v-for="el in proviceList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="始发市" prop="srcCityCode">
                    <!-- <el-input type="input" v-model="searchData.srcCityCode" placeholder="始发市" /> -->
                    <el-select v-model="searchData.srcCityCode" clearable placeholder="请选择" @change="cahngeCity">
                        <el-option v-for="el in cityList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="始发县" label-width="80px" prop="srcCountyCode">
                    <!-- <el-input type="input" v-model="searchData.srcCountyCode" placeholder="始发县" /> -->
                    <el-select v-model="searchData.srcCountyCode" clearable placeholder="请选择">
                        <el-option v-for="el in countyList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="目的地省" label-width="80px" prop="targetProvinceCode">
                    <!-- <el-input type="input" v-model="searchData.targetProvinceCode" placeholder="目的地省" /> -->
                    <el-select v-model="searchData.targetProvinceCode" clearable placeholder="请选择" @change="almcahngeProvice">
                        <el-option v-for="el in almproviceList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="目的地市" label-width="80px" prop="targetCityCode">
                    <!-- <el-input type="input" v-model="searchData.targetCityCode" placeholder="目的地市" /> -->
                    <el-select v-model="searchData.targetCityCode" clearable placeholder="请选择" @change="almcahngeCity">
                        <el-option v-for="el in almcityList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>

                <el-form-item label="目的地县" label-width="80px" prop="targetCountyCode">
                    <!-- <el-input type="input" v-model="searchData.targetCountyCode" placeholder="目的地县" /> -->
                    <el-select v-model="searchData.targetCountyCode" clearable placeholder="请选择">
                        <el-option v-for="el in almcountyList" :label="el.addressName" :value="el.addressCode" :key="el.addressCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="明细状态" label-width="80px" prop="status">
                    <el-select v-model="searchData.status" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip >
                        <el-option label="全部" value='' />
                        <el-option label="待审核" value='1' />
                        <el-option label="审核通过" value='9' />
                        <el-option label="审核驳回" value='2' />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="报价单名称" label-width="100px" prop="feeName">
                    <el-input type="input" v-model="searchData.feeName" placeholder="报价单名称" />
                </el-form-item>
                <el-form-item label="报价单编号" label-width="100px" prop="feeNo">
                    <el-input type="input" v-model="searchData.feeNo" placeholder="报价单编号" />
                </el-form-item> -->
                <br />
                <el-form-item class="button-box">
                    <!-- <el-button type="primary" @click="quotation('新增报价单')">
                        新增报价单
                    </el-button> -->
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >

                <template #status="scope">
                    <span v-if="scope.row.status === 1">待审核</span>
                    <span v-if="scope.row.status === 9">审核通过</span>
                    <span v-if="scope.row.status === 2">审核驳回</span>
                </template>
                <!-- <template #operation="{row}">
                    <el-button type="text" @click="quotationDetailed(row)">新增报价明细</el-button>
                    <el-button type="text" @click="quotationdetaileds('modify', row)" v-if="row">编辑</el-button>
                    <el-button type="text" @click="quotationdetaileds('toexamine', row)">审核</el-button>
                    <el-button type="text" @click="quotationdetaileds('deactivate', row)">停用</el-button>
                    <el-button type="text" @click="quotationdetaileds('enable', row)">启用</el-button>
                </template> -->
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'feeNo', label: '报价单号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'feeName', label: '报价单名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '生效日期', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '失效日期', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'srcProvinceName', label: '始发省', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'srcCityName', label: '始发市', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'srcCountyName', label: '始发县', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'targetProvinceName', label: '目的省', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'targetCityName', label: '目的市', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'targetCountyName', label: '目的县', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'firstWeightStr', label: '重量首重(KG)', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'firstWeightPriceStr', label: '首重价格(元)', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'otherWeightStr', label: '续重重量(KG)', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'otherWeightPriceStr', label: '续重价格(元)', minWidth: 120 },
    // { align: 'center', tooltip: true, prop: '', label: '重量进位制', minWidth: 120 },
    // { align: 'center', tooltip: true, prop: '', label: '价格进位制', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'status', label: '报价单状态', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: '', label: '新增明细', minWidth: 120 }
    // { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 300, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        srcProvinceCode: '', // 始发地省code
        srcCityCode: '', // 始发地市code
        srcCountyCode: '', // 始发地县code
        targetProvinceCode: '', // 目的地省code
        targetCityCode: '', // 目的地市code
        targetCountyCode: '', // 目的地县code
        status: null,
        feeName: '', // 报价单名称
        feeNo: '' // 报价单编号
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    BusiInfoResVo: [],
    rolelist: [],
    dialogFormVisible: false
})
const { searchData, pageinfo, BusiInfoResVo, rolelist, dialogFormVisible, applyForm } = toRefs(dataState)

onMounted(async () => {
    await getProviceList()
    await getAlmProviceList()
    await getRefundList()
})

// 获取省市县
const proviceList = ref([])
const cityList = ref([])
const countyList = ref([])
const almproviceList = ref([])
const almcityList = ref([])
const almcountyList = ref([])
const getAllList = async (ql, code) => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            ql: ql,
            code: code
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name

    }
    const res = await getMerchantList(param)
    return res
}
const getProviceList = async () => {
    const res = await getAllList(1, 0)
    proviceList.value = res.addressList
}
const getAlmProviceList = async () => {
    const res = await getAllList(1, 0)
    almproviceList.value = res.addressList
}
const cahngeProvice = async (val) => {
    if (!val) {
        cityList.value = []
        countyList.value = []
        searchData.value.srcCityCode = ''
        searchData.value.srcCountyCode = ''
    } else {
        const res = await getAllList(2, val)
        searchData.value.srcCityCode = ''
        searchData.value.srcCountyCode = ''
        cityList.value = res.addressList
        countyList.value = []
    }
}
const almcahngeProvice = async (val) => {
    if (!val) {
        almcityList.value = []
        almcountyList.value = []
        searchData.value.targetCityCode = ''
        searchData.value.targetCountyCode = ''
    } else {
        const res = await getAllList(2, val)
        searchData.value.targetCityCode = ''
        searchData.value.targetCountyCode = ''
        almcityList.value = res.addressList
        almcountyList.value = []
    }
}
const cahngeCity = async (val) => {
    if (!val) {
        searchData.value.srcCountyCode = ''
        countyList.value = []
    } else {
        const res = await getAllList(3, val)
        countyList.value = res.addressList
        searchData.value.srcCountyCode = ''
    }
}
const almcahngeCity = async (val) => {
    if (!val) {
        searchData.value.targetCountyCode = ''
        almcountyList.value = []
    } else {
        const res = await getAllList(3, val)
        almcountyList.value = res.addressList
        searchData.value.targetCountyCode = ''
    }
}
// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            ...dataState.searchData,
            statusList: dataState.searchData.status ? dataState.searchData.status.split(',') : [],
            pageNo: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1658798288974k1sBb',
        name: '查询报价单',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    if (data) {
        tableData.value = data.feeList
        dataState.pageinfo.total = data.total
    }
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    nextTick(() => {
        getRefundList()
    })
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    setTimeout(() => {
        getRefundList()
    })
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

// 报价单创建
const quotation = (val) => {
    router.push({
        name: 'quotation-establish',
        params: {
        }
    })
}

// 报价单明细创建
const quotationDetailed = (val) => {
    router.push({
        name: 'detailed-establish',
        params: {
            feeNo: val.feeNo
        }
    })
}

// 报价单明细 编辑/审核/启用/停用
const quotationdetaileds = (who, row) => {
    console.log(row?.srcCountyName)
    router.push({
        name: 'quotation-details',
        params: {
            title: who,
            feeNo: row.feeNo,
            feeName: row.feeName,
            srcProvinceName: row.srcProvinceName,
            srcCityName: row.srcCityName,
            srcCountyName: row?.srcCountyName === '' ? '无' : row?.srcCountyName,
            targetProvinceName: row.targetProvinceName,
            targetCityName: row.targetCityName,
            targetCountyName: row?.targetCountyName === '' ? '无' : row?.targetCountyName,
            firstWeightStr: row.firstWeightStr,
            firstWeightPriceStr: row.firstWeightPriceStr,
            otherWeightStr: row.otherWeightStr,
            otherWeightPriceStr: row.otherWeightPriceStr
        }
    })
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
