<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="始发省" prop="srcProvinceCode">
                    <el-autocomplete
                        v-model="searchData.srcProvinceName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync"
                        :trigger-on-focus="false"
                        placeholder="始发省"
                        @select="handleSelect($event, 'srcProvince')"
                        @input="oninput('srcProvince')"
                    />
                </el-form-item>
                <el-form-item label="始发市" prop="srcCityCode">
                    <el-autocomplete
                        v-model="searchData.srcCityName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync2"
                        :trigger-on-focus="false"
                        placeholder="始发市"
                        @select="handleSelect($event, 'srcCity')"
                        @input="oninput('srcCity')"
                    />
                </el-form-item>
                <el-form-item label="始发县" label-width="80px" prop="srcCountyCode">
                    <el-autocomplete
                        v-model="searchData.srcCountyName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync3"
                        :trigger-on-focus="false"
                        placeholder="始发县"
                        @select="handleSelect($event, 'srcCounty')"
                        @input="oninput('srcCounty')"
                    />
                </el-form-item>
                <el-form-item label="目的地省" label-width="80px" prop="targetProvinceCode">
                    <el-autocomplete
                        v-model="searchData.targetProvinceName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync"
                        :trigger-on-focus="false"
                        placeholder="目的地省"
                        @select="handleSelect($event, 'targetProvince')"
                        @input="oninput('targetProvince')"
                    />
                </el-form-item>
                <el-form-item label="目的地市" label-width="80px" prop="targetCityCode">
                    <el-autocomplete
                        v-model="searchData.targetCityName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync2"
                        :trigger-on-focus="false"
                        placeholder="目的地市"
                        @select="handleSelect($event, 'targetCity')"
                        @input="oninput('targetCity')"
                    />
                </el-form-item>
                <el-form-item label="目的地县" label-width="80px" prop="targetCountyCode">
                    <el-autocomplete
                        v-model="searchData.targetCountyName"
                        value-key="addressName"
                        :fetch-suggestions="querySearchAsync3"
                        :trigger-on-focus="false"
                        placeholder="目的地县"
                        @select="handleSelect($event, 'targetCounty')"
                        @input="oninput('targetCounty')"
                    />
                </el-form-item>
                <el-form-item label="明细状态" label-width="80px" prop="status">
                    <el-select v-model="searchData.status" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip >
                        <el-option label="待审核" :value='1' />
                        <el-option label="审核通过" :value='9' />
                        <el-option label="审核驳回" :value='2' />
                        <!-- <el-option label="审核中" :value='3' /> -->
                        <el-option label="启用" :value='3' />
                        <el-option label="停用" :value='4' />
                    </el-select>
                </el-form-item>
                <el-form-item label="报价单名称" label-width="100px" prop="feeName">
                    <el-input type="input" v-model="searchData.feeName" placeholder="报价单名称" />
                </el-form-item>
                <el-form-item label="报价单编号" label-width="100px" prop="feeNo">
                    <el-input type="input" v-model="searchData.feeNo" placeholder="报价单编号" />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="quotation('新增报价单')">
                        新增报价单
                    </el-button>
                    <el-button type="primary" @click="quotationDetailed">
                        新增报价明细
                    </el-button>
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <!-- <el-button type="primary">
                        导出
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button> -->
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

                <template #operation="{row}">
                    <el-button type="text" @click="quotationdetaileds('modify', row)" v-if="row.status === 1 || row.status === 2">编辑</el-button>
                    <el-button type="text" @click="quotationdetaileds('toexamine', row)" v-if="row.status === 1">审核</el-button>
                    <el-button type="text" @click="quotationdetaileds('deactivate', row)" v-if="row.status === 9">停用</el-button>
                    <el-button type="text" @click="quotationdetaileds('enable', row)" v-if="row.status === 4" >启用</el-button>
                </template>
            </system-list>
        </div>
    </div>
    <waybillOperationVue
        :dialog-object="dialogObjDelDef"
        @dialogClose="dialogCloseDef"
        @dialogSuccess="dialogSuccessDef"
        @forkSuccess="forkSuccessDef"
    ></waybillOperationVue>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Debounce } from '@/components/debounce/index.js'
import waybillOperationVue from './waybill-operation.vue' // 弹窗组件

import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'feeNo', label: '报价单号', minWidth: 140, fixed: true },
    { align: 'center', tooltip: true, prop: 'feeName', label: '报价单名称', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '生效日期', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '失效日期', minWidth: 200 },
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
    { align: 'center', tooltip: true, prop: 'weightCalTypeStr', label: '重量进位制', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'priceCalTypeStr', label: '价格进位制', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'statusName', label: '报价单状态', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

const loading = ref(null)
// 省 测试
const ttrst = reactive([
    // {
    //     label: '北京',
    //     value: 'code1'
    // },
    // {
    //     label: '上海',
    //     value: 'code2'
    // },
    // {
    //     label: '广州',
    //     value: 'code3'
    // }
])

// 始发/目的省市县 模糊 []
// 自动补全
const hierarchy = ref(1) // 层级
const querySearchAsync = (queryString, cb) => {
    hierarchy.value = 1
    replenishqi(queryString, cb)
}
const querySearchAsync2 = (queryString, cb) => {
    hierarchy.value = 2
    replenishqi(queryString, cb)
}
const querySearchAsync3 = (queryString, cb) => {
    hierarchy.value = 3
    replenishqi(queryString, cb)
}
let timeout
const replenishqi = (queryString, cb) => {
    searchList(queryString).then(res => {
        const results = res ?? []
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(results)
        }, 200)
    })
}

const handleSelect = (item, val) => {
    if (val === 'srcProvince') {
        dataState.searchData.srcProvinceCode = item.addressCode
    } else if (val === 'srcCity') {
        dataState.searchData.srcCityCode = item.addressCode
    } else if (val === 'srcCounty') {
        dataState.searchData.srcCountyCode = item.addressCode
    } else if (val === 'targetProvince') {
        dataState.searchData.targetProvinceCode = item.addressCode
    } else if (val === 'targetCity') {
        dataState.searchData.targetCityCode = item.addressCode
    } else if (val === 'targetCounty') {
        dataState.searchData.targetCountyCode = item.addressCode
    }
}
// 为空清空 code
const oninput = (val) => {
    if (val === 'srcProvince') {
        if (dataState.searchData.srcProvinceName) {
            dataState.searchData.srcProvinceCode = ''
        }
    } else if (val === 'srcCity') {
        if (dataState.searchData.srcCityName) {
            dataState.searchData.srcCityCode = ''
        }
    } else if (val === 'srcCounty') {
        if (dataState.searchData.srcCountyName) {
            dataState.searchData.srcCountyCode = ''
        }
    } else if (val === 'targetProvince') {
        if (dataState.searchData.targetProvinceName) {
            dataState.searchData.targetProvinceCode = ''
        }
    } else if (val === 'targetCity') {
        if (dataState.searchData.targetCityName) {
            dataState.searchData.targetCityCode = ''
        }
    } else if (val === 'targetCounty') {
        if (dataState.searchData.targetCountyName) {
            dataState.searchData.targetCountyCode = ''
        }
    }
}

const tableData = ref([])
const dataState = reactive({
    searchData: {
        srcProvinceCode: '', // 始发地省code
        srcProvinceName: '',
        srcCityCode: '', // 始发地市code
        srcCityName: '',
        srcCountyCode: '', // 始发地县code
        srcCountyName: '',
        targetProvinceCode: '', // 目的地省code
        targetProvinceName: '',
        targetCityCode: '', // 目的地市code
        targetCityName: '',
        targetCountyCode: '', // 目的地县code
        targetCountyName: '',
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
    // await getProviceList()
    // await getAlmProviceList()
    await getRefundList()
})

// 获取省市县
// const proviceList = ref([])
// const cityList = ref([])
// const countyList = ref([])
// const almproviceList = ref([])
// const almcityList = ref([])
// const almcountyList = ref([])
// const getAllList = async (ql, code) => {
//     const param = {
//         body: {
//             appKey: 'A1001001',
//             busiCode: 'A1001001',
//             ql: ql,
//             code: code
//         },
//         appKey: 'A1001001',
//         busiCode: 'A1001001',
//         sceneCode: '1',
//         functionCode: 'functionCode',
//         configCode: 'UC1658391004384SvOqm',
//         name: '查询四级地址库信息',
//         source: '运单中台',
//         modifierId: store.state.userInfo.account,
//         operatorId: store.state.userInfo.account,
//         operatorName: store.state.userInfo.name

//     }
//     const res = await getMerchantList(param)
//     return res
// }
// const getProviceList = async () => {
//     const res = await getAllList(1, 0)
//     proviceList.value = res.addressList
// }
// const getAlmProviceList = async () => {
//     const res = await getAllList(1, 0)
//     almproviceList.value = res.addressList
// }
// const cahngeProvice = async (val) => {
//     // console.log(1)
//     // dataState.searchData.srcCityCode = ''
//     const res = await getAllList(2, val)
//     cityList.value = res.addressList
// }
// const almcahngeProvice = async (val) => {
//     const res = await getAllList(2, val)
//     almcityList.value = res.addressList
// }
// const cahngeCity = async (val) => {
//     const res = await getAllList(3, val)
//     countyList.value = res.addressList
// }
// const almcahngeCity = async (val) => {
//     const res = await getAllList(3, val)
//     almcountyList.value = res.addressList
// }

// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            ...dataState.searchData,
            pageNo: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11772812913168384',
        name: '查询报价单明细列表（页面）',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    if (data) {
        tableData.value = data.list
        dataState.pageinfo.total = data.total
    }
}

// 重置
const formRef = ref(null)
// const resetForm = formEl => {
//     if (!formEl) return
//     formEl.resetFields()
// }

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
const quotationDetailed = () => {
    router.push({ name: 'detailed-establish' })
}

// 删除弹框数据
const dialogObjDelDef = reactive({
    dialogVisible: false,
    title: '报价单明细',
    width: '50%',
    who: '',
    id: null,
    feeNo: '',
    successBtnText: '确定',
    closeBtnText: '取消',
    isFooter: true // 是否显示按钮
})

// 报价单明细 编辑/审核/启用/停用
const quotationdetaileds = (who, row) => {
    if (who === 'modify') { // 编辑跳转页面
        router.push({
            name: 'quotation-details',
            params: {
                title: who,
                id: row?.id ?? 'empty',
                feeNo: row?.feeNo ?? 'empty'
            }
        })
    } else { // 审核/启用/停用 弹窗
        if (who === 'toexamine') { // 审核 改变状态-审核中
            dialogObjDelDef.title = '报价单明细审核'
            dialogObjDelDef.successBtnText = '审核'
            dialogObjDelDef.closeBtnText = '驳回'
            console.log('审核操作')
        } else if (who === 'deactivate') {
            dialogObjDelDef.title = '报价单明细停用'
            dialogObjDelDef.successBtnText = '确认'
            dialogObjDelDef.closeBtnText = '取消'
        } else if (who === 'enable') {
            dialogObjDelDef.title = '报价单明细启用'
            dialogObjDelDef.successBtnText = '确认'
            dialogObjDelDef.closeBtnText = '取消'
        }
        dialogObjDelDef.who = who
        dialogObjDelDef.id = row.id
        dialogObjDelDef.feeNo = row.feeNo
        dialogObjDelDef.dialogVisible = true
    }
}

// 取消/驳回
const dialogCloseDef = () => {
    dialogObjDelDef.dialogVisible = false
    getRefundList()
}
// 确定
const dialogSuccessDef = () => {
    dialogObjDelDef.dialogVisible = false
    getRefundList()
}
// 右上角x
const forkSuccessDef = () => {
    dialogObjDelDef.dialogVisible = false
}

// 根据地址名称模糊匹配地址信息列表
const searchList = async (val) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            name: val, // 名称
            ql: hierarchy.value // 层级
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11163895669215232',
        name: '根据地址名称模糊匹配地址信息列表',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    return data.addressList
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
