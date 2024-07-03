<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form :model="form" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户编号:" prop="busiMerchantId">
                    <span>{{props.busiMerchantId}}</span>
                </el-form-item>
                <el-form-item label="商户名称:" prop="merchantName">
                    <span>{{props.merchantName}}</span>
                </el-form-item>
                <el-form-item label="商户类型:" prop="merchantType">
                    <span>{{Number(props.merchantType) === 1 ? '企业' : Numbeformtr(props.merchantType) === 2 ? '自然人' : '系统'}}</span>
                </el-form-item>
                <el-form-item label="一级渠道:" prop="firstChannelName">
                    <span>{{props.firstChannelName}}</span>
                </el-form-item>
            </el-form>
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商品名称" prop="skuName">
                    <el-input v-model.trim="searchData.skuName" placeholder="请输入～" />
                </el-form-item>
                <el-form-item label="商品编号" prop="skuId">
                    <el-input v-model.trim="searchData.skuId" placeholder="请输入～" />
                </el-form-item>
                <el-form-item label="商品分类" prop="formt">
                    <el-cascader :props="propt" @change="onfocus" v-model="formt" />
                </el-form-item>
                <el-form-item class="button-box">
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

                <template #infor="scope">
                    <span>sku编号：{{scope.row.skuId}}</span><br/>
                    <span>商品名称：{{scope.row.skuName}}</span><br/>
                    <!-- <span>售卖规格：{{scope.row.specName}}</span><br/> -->
                    <span>商品分类：{{scope.row.firstCateName}}/{{scope.row.secondCateName}}/{{scope.row.thirdCateName}}/{{scope.row.fourthCateName}}</span>
                </template>
                <template #skuStatus="scope">
                    <span>{{scope.row.skuStatus===0?'初始':scope.row.skuStatus===1?'待审核':scope.row.skuStatus===2?'已审核':scope.row.skuStatus===3?'已拒绝':scope.row.skuStatus===4?'已上架':scope.row.skuStatus===5?'下架可上架':scope.row.skuStatus===6?'下架':'待上架'}}</span>
                </template>
                <template #tax="scope">
                    <div>{{ scope.row.tax?scope.row.tax:'1' }}%</div>
                    <!-- <el-input @focus="onfcus(scope.row)" v-model="scope.row.purchasePrice" maxlength="6" @keyup="scope.row.purchasePrice = oninput(scope.row.purchasePrice)" placeholder="" style="width: 80px"/>% -->
                </template>
                <template #purchasePrice="scope">
                    <el-input @focus="onfcus(scope.row)" v-model="scope.row.purchasePrice" maxlength="9" @keyup="scope.row.purchasePrice = oninput(scope.row.purchasePrice)" placeholder="" style="width: 100px"/>
                </template>
                <template #operation="scope">
                    <el-button text @click="toEdit(scope.row)" type="primary">
                        保存
                    </el-button>

                </template>
            </system-list>
        </div>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="采购价涨价会导致毛利降低，建议及时评估是否需要先调整原价"
        width="50%"
    >
        <template #footer="{row}">
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialookt(row)"
                >确认保存</el-button
                >
            </span>
        </template>
    </el-dialog>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed, watch } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { useStore } from 'vuex'

const form = reactive({
    skuIds: '',
    skuName: '',
    categoryCode: '',
    categoryLevel: null
})

const formt = ref('')

// 目录层级
const propt = {
    lazy: true,
    async lazyLoad (node, resolve) {
        console.log(node)
        const data = await getMerchantList({
            body: {
                appKey: 'A1001000',
                busiCode: 'A1001001',
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
        console.log(form.categoryLevel)
        const nodes = data.map((item) => ({
            value: item.code,
            label: item.name,
            leaf: node?.level >= 3
        }))
        console.log(nodes)
        if (nodes[0]?.leaf) {
            dataState.searchData.categoryCode = nodes[0].value
            dataState.searchData.categoryLevel = node.level + 1
        }
        resolve(nodes)
    }
}

const onfocus = (e) => {
    console.log(e.length)
    dataState.searchData.categoryCode = e[e.length - 1]
}

// 原始数据
const olderls = ref(null)
const oldersku = ref('')

const onfcus = (val) => {
    olderls.value = val.purchasePrice
    oldersku.value = val.skuId
}

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const props = defineProps(['merchantName', 'busiMerchantId', 'merchantType', 'firstChannelId', 'firstChannelName', 'secondChannelId'])
const radio = ref(3)
const tHead = [
    { align: 'left', tooltip: true, prop: 'infor', label: '商品信息', minWidth: 200, fixed: true, slot: true },
    { align: 'center', tooltip: true, prop: 'skuStatus', label: '商品状态', minWidth: 200, slot: true },
    // { align: 'center', tooltip: true, prop: 'supplierName', label: '供应商', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'tax', label: '税率', minWidth: 120, slot: true },
    { align: 'center', tooltip: false, prop: 'purchasePrice', label: '采购价(含税)', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 230, slot: true }

]

const oninput = (num) => {
    var str = num
    var len1 = str.substr(0, 1)
    var len2 = str.substr(1, 1)
    // 如果第一位是0，第二位不是点，就用数字把点替换掉
    if (str.length > 1 && Number(len1) === 0 && len2 !== '.') {
        str = str.substr(1, 1)
    }
    // 第一位不能是.
    if (len1 === '.') {
        str = ''
    }
    // 限制只能输入一个小数点
    if (str.indexOf('.') !== -1) {
        var str_ = str.substr(str.indexOf('.') + 1)
        if (str_.indexOf('.') !== -1) {
            str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
        }
    }
    // 正则替换
    str = str.replace(/[^\d^.]+/g, '') // 保留数字和小数点
    str = str.replace(/\.\d\d\d\d\d\d\d$/, '') // 小数点后只能输2位
    return str
}

const tableData = ref([])
const dataState = reactive({
    searchData: {
        skuName: '',
        skuId: '',
        categoryCode: '',
        categoryLevel: null
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    }

})
const { searchData, pageinfo } = toRefs(dataState)

onMounted(async () => {
    await getRefundList()
})
const orderNo = ref('')

// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            skuIds: dataState.searchData.skuId === '' ? [] : [dataState.searchData.skuId],
            skuName: dataState.searchData.skuName,
            pageNo: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            channelCodes: props.secondChannelId === '' ? null : props.secondChannelId.split(','), // 商品编号
            // busiMerchantId: props.busiMerchantId,
            categoryCode: dataState.searchData.categoryCode,
            categoryLevel: dataState.searchData.categoryLevel,
            merchantIds: [
                props.busiMerchantId
            ],
            skuStatus: [-1],
            channelTypes: [6],
            appKey: 'A1001000',
            fourthCateCodes: formt.value ? [formt.value[3]] : [],
            busiCode: props.firstChannelId ? props.firstChannelId : ''
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UCJH64755469667135488',
        name: '查询渠道商品信息聚合税率',
        source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    const arr = data?.list?.map(item => {
        if (typeof item.purchasePrice === 'object' || item.purchasePrice === 'null') {
            item.purchasePrice = 0
        }
        return item
    })
    tableData.value = arr
    // tableData.value = data.list
    dataState.pageinfo.total = data.total
}

const dialogVisible = ref(false)
const skuPrice = reactive({
    purchasePrice: '',
    skuId: ''
})

// 保存
const toEdit = async (row) => {
    skuPrice.purchasePrice = row.purchasePrice
    skuPrice.skuId = row.skuId
    if (row.purchasePrice > olderls.value && oldersku.value && oldersku.value === row.skuId) {
        dialogVisible.value = true
    } else {
        toLSt(row)
    }
}

// 修改价格接口
const toLSt = async (row) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            purchasePrice: Number(row.purchasePrice),
            skuId: row.skuId,
            // modifierId: userInfo.value.account,
            operatorId: Number(userInfo.value.id),
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1658546637222WTdfg',
        name: '更新商品采购价',
        source: '价格中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const code = await getMerchantList(params)
    console.log(code)
    ElMessage.success('修改成功')
    await getRefundList()
}

const dialookt = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            purchasePrice: Number(skuPrice.purchasePrice),
            skuId: skuPrice.skuId,
            // modifierId: userInfo.value.account,
            operatorId: Number(userInfo.value.id),
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1658546637222WTdfg',
        name: '更新商品采购价',
        source: '价格中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    dialogVisible.value = false
    await getMerchantList(params)
    ElMessage.success('成功')
    await getRefundList()
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    dataState.searchData.categoryCode = ''
    dataState.searchData.categoryLevel = null
    formt.value = ''
    formEl.resetFields()
    setTimeout(() => {
        getRefundList()
    })
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    getRefundList()
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
