<template>
    <!-- <h1>四级地址表格</h1> -->
    <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="80px">
        <el-form-item label="省" prop="province">
            <el-autocomplete
                v-model="searchData.provinceName"
                value-key="addressName"
                :fetch-suggestions="querySearchAsync"
                :trigger-on-focus="false"
                placeholder="根据省名称查询"
                @select="handleSelect($event, '1')"
                @input="oninput('1')"
            />
        </el-form-item>
        <el-form-item label="市" prop="cityCode">
            <el-autocomplete
                v-model="searchData.cityName"
                value-key="addressName"
                :fetch-suggestions="querySearchAsync2"
                :trigger-on-focus="false"
                placeholder="根据市名称查询"
                @select="handleSelect($event, '2')"
                @input="oninput('2')"
            />
        </el-form-item>
        <el-form-item label="县" prop="countyCode">
            <el-autocomplete
                v-model="searchData.countyName"
                value-key="addressName"
                :fetch-suggestions="querySearchAsync3"
                :trigger-on-focus="false"
                placeholder="根据县名称查询"
                @select="handleSelect($event, '3')"
                @input="oninput('3')"
            />
        </el-form-item>
        <el-form-item label="镇/街道" prop="townCode">
            <el-autocomplete
                v-model="searchData.townName"
                value-key="addressName"
                :fetch-suggestions="querySearchAsync4"
                :trigger-on-focus="false"
                placeholder="根据镇/街道名称查询"
                @select="handleSelect($event, '4')"
                @input="oninput('4')"
            />
        </el-form-item>
        <el-form-item class="button-box">
            <el-button type="primary" @click="searchCoupon()">
                查询
            </el-button>
            <!-- <el-button type="primary" @click="resetForm(formRef)">
                重置
            </el-button> -->
        </el-form-item>
    </el-form>
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
                <el-button type="text" v-if="row.state === 1" @click="quotationdetaileds('modify', row)">编辑</el-button>
                <el-button type="text" v-if="row.state === 1" @click="onEnable('Deactivate', row)">停用</el-button>
                <el-button type="text" v-if="row.state === 2" @click="onEnable('Enable', row)">启用</el-button>
                <br />
                <el-button type="text" @click="quotationdetaileds('increase', row)">增加四级地址</el-button>
            </template>
        </system-list>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { Debounce } from '@/components/debounce/index.js'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const tableData = ref([])
// { provinceName: '123', cityName: '北京', countyName: '朝阳', countyCode: '110000000000', townName: '四惠东', townCode: '110000000010' }
const dataState = reactive({
    searchData: {
        provinceCode: '', // 省
        provinceName: '',
        cityCode: '', // 市
        cityName: '',
        countyCode: '', // 县
        countyName: '',
        townCode: '', // 街道
        townName: ''
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

const proviceList = ref([])
const cityList = ref([])
const countyList = ref([])
const almproviceList = ref([])
const almcityList = ref([])
const almcountyList = ref([])

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
const querySearchAsync4 = (queryString, cb) => {
    hierarchy.value = 4
    replenishqi(queryString, cb)
}
let timeout
const replenishqi = (queryString, cb) => {
    if (Number(hierarchy.value) === 4) {
        //
        searchListFore(queryString).then(res => {
            console.log(res, '--0')
            const results = res ?? []
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(results)
            }, 200)
        })
    } else {
        searchList(queryString).then(res => {
            console.log(res, '--0')
            const results = res ?? []
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                cb(results)
            }, 200)
        })
    }
}

const handleSelect = (item, val) => {
    console.log(item, '--', val)
    if (val === '1') {
        dataState.searchData.provinceCode = item.addressCode
    } else if (val === '2') {
        dataState.searchData.cityCode = item.addressCode
    } else if (val === '3') {
        dataState.searchData.countyCode = item.addressCode
    } else if (val === '4') {
        dataState.searchData.townCode = item.addressCode
    }
}
const oninput = (val) => {
    if (val === '1') {
        if (dataState.searchData.provinceName) {
            dataState.searchData.provinceCode = ''
        }
    } else if (val === '2') {
        if (dataState.searchData.cityName) {
            dataState.searchData.cityCode = ''
        }
    } else if (val === '3') {
        if (dataState.searchData.countyName) {
            dataState.searchData.countyCode = ''
        }
    } else if (val === '4') {
        if (dataState.searchData.townName) {
            dataState.searchData.townCode = ''
        }
    }
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'provinceName', label: '省', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'provinceCode', label: '省编码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '市', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'cityCode', label: '市编码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'countyName', label: '县', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'countyCode', label: '县编码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'townName', label: '镇/街道', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'townCode', label: '镇/街道编码', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'stateName', label: '状态', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]

// 判断 停用 false 启用 true
const statetow = ref(true)
// 是启用/停用操作
const area = ref(1)
const onEnable = (val, row) => {
    // console.log(row)
    if (val === 'Deactivate') {
        statetow.value = false
    } else {
        statetow.value = true
    }
    ElMessageBox.confirm(
        statetow.value ? '确认启用此项?' : '确认停用此项?',
        '警告',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
        }
    )
        .then(() => {
            if (statetow.value) {
                area.value = 1
                operateArea(row)
                nextTick(() => {
                    queryAreaPage()
                })
            } else {
                area.value = 2
                operateArea(row)
                nextTick(() => {
                    queryAreaPage()
                })
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消'
            })
        })
}

// 修改/新增操作
const quotationdetaileds = (val, row) => {
    router.push({
        name: 'leveladdress-operation',
        params: {
            title: val,
            countyCode: row?.countyCode ?? 'empty',
            townCode: row?.townCode ?? 'empty'
        }
    })
}

onMounted(async () => {
    await queryAreaPage()
})

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    queryAreaPage()
}

// 查询四级地址列表
const queryAreaPage = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            provinceCode: dataState.searchData.provinceCode,
            cityCode: dataState.searchData.cityCode,
            countyCode: dataState.searchData.countyCode,
            townCode: dataState.searchData.townCode,
            pageNo: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11162849488162816',
        name: '查询四级地址列表',
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
// 启用/停用四级地址信息
const operateArea = async (val) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            townCode: val.townCode,
            countyCode: val.countyCode,
            operateType: area.value,
            operator: userInfo.value.id + ''
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11164204047028224',
        name: '启用/停用四级地址信息',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === 200) {
        ElMessage({
            type: 'success',
            message: message
        })
    } else {
        ElMessage({
            type: 'success',
            message: message
        })
    }
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
    console.log(data.addressList)
    return data.addressList
}
// 根据地址名称模糊匹配地址信息列表 4级--
const searchListFore = async (val) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            name: val, // 名称
            ql: hierarchy.value // 层级
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC13583860593827840',
        name: '模糊搜索四级地址信息',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    console.log(data.addressList)
    return data.addressList
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    queryAreaPage()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    queryAreaPage()
}

// 重置
// const formRef = ref(null)
// const resetForm = formEl => {
//     if (!formEl) return
//     formEl.resetFields()
//     nextTick(() => {

//     })
// }

</script>
<style lang="scss" scoped>
.input-line {
    width: 220px;
}
</style>
