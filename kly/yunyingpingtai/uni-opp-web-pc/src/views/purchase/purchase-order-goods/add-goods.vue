<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <h3>供货方信息</h3>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="供应商编号" prop="merchantCode">
                        <el-input v-model="form.merchantCode" placeholder="请输入供应商编号"  @change="getMerchant"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="供应商名称" prop="merchantName">
                        <!-- <el-input v-model="form.merchantName" placeholder="请输入供应商名称"  @change="getMerchantName"/> -->
                        <el-select v-model="form.merchantName" clearable placeholder="请选择供应商名称"   filterable
                                   remote
                                   reserve-keyword   :remote-method="getMerchantName" @change="getName">
                            <el-option v-for="item in merchantList" :key="item.busiMerchantId
                            " :label="item.merchantName" :value="item.busiMerchantId" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="供应商联系人" prop="merchantUser">
                        <el-input v-model="form.merchantUser" placeholder="请输入供应商联系人" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商联系方式" prop="merchantMobile">
                        <el-input v-model="form.merchantMobile" placeholder="请输入供应商联系方式" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="供应商地址" prop="merchantAddress">
                        <el-input v-model="form.merchantAddress" placeholder="请输入供应商地址"  disabled/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h3>采购方信息</h3>
            <el-form-item label="采购主体编号" prop="purchaseCode">
                <el-input v-model="form.purchaseCode" placeholder="请输入采购主体编号" @change="getPurchase"/>
            </el-form-item>
            <el-form-item label="采购主体名称" prop="purchaseName">
                <!-- <el-input v-model="form.purchaseName" placeholder="请输入采购主体名称" disabled/> -->
                <el-select v-model="form.purchaseName" clearable placeholder="请选择采购主体名称"   filterable
                           remote
                           reserve-keyword  value-key="busiMerchantId" :remote-method="getSMerchant" @change="getSName">
                    <el-option v-for="item in smerchantList" :key="item.busiMerchantId
                    " :label="item.merchantName" :value="item" />
                </el-select>
            </el-form-item>
            <h3>单据信息</h3>
            <el-form-item label="单据编号" prop="purchaseNo" v-if="props.type!=='add'">
                <span>{{form.purchaseNo}}</span>
            </el-form-item>
            <el-form-item label="单据类型" prop="purchaseType">
                <el-select v-model="form.purchaseType"    clearable placeholder="请选择单据类型" >
                    <el-option label="普通商品" :value="1" />
                    <el-option label="虚拟商品" :value="2" />
                    <el-option label="设备商品" :value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="数量" prop="quantity">
                <el-input v-model="form.quantity" placeholder="供应商商品数量累加" disabled/>
            </el-form-item>
            <el-form-item label="金额" prop="totalTaxAmount">
                <el-input v-model="form.totalTaxAmount" placeholder="含税金额" disabled/>
            </el-form-item>
            <div class="tableList-area">
                <el-button type="primary"  @click="addRow()"  v-if="props.type !=='detail'&& form.merchantCode !== ''">添加商品</el-button>
                <system-list
                    :tHead="tHead"
                    :tableData="form.goodsDetails"
                    title='SKU'
                >

                    <template #skuCode="scope">
                        <el-input v-model="scope.row.skuCode" placeholder="请输入供应商SKU编号，查找"  @change="getSku(scope.row.skuCode,scope.index)"/>
                    </template>
                    <template #skuName="scope">
                        <!-- <el-input v-model="scope.row.skuName"   @change="getSkuname(scope.row.skuName,scope.index)"/> -->
                        <el-select v-model="scope.row.skuName"  placeholder="请选择供应商名称" clearable  filterable
                                   remote
                                   reserve-keyword  value-key="skuName" :remote-method="getSkuname" @change="getSkuName(scope.row.skuName,scope.index)">
                            <!-- @change="getSkuname(scope.row.skuName,scope.index)" -->
                            <el-option v-for="item in skuNameList" :key="item.skuId" :label="item.skuName" :value="item" />
                        </el-select>
                    </template>
                    <template #quantity="scope">
                        <el-input v-model="scope.row.quantity"   />
                    </template>
                    <template #unitPrice="scope">
                        <el-input v-model="scope.row.unitPrice"   />
                    </template>
                    <template #taxRate="scope">
                        <el-input v-model="scope.row.taxRate"   />
                    </template>
                    <template #taxPrice="scope">
                        <el-input v-model="scope.row.taxPrice"  readonly  @change="changePrice(scope.row.unitPrice,scope.index)"/>
                    </template>
                    <template #totalAmount="scope">
                        <el-input v-model="scope.row.totalAmount" />
                    </template>
                    <template #totalTaxAmount="scope">
                        <el-input v-model="scope.row.totalTaxAmount"   />
                    </template>
                    <template #busiCateList="scope">
                        <div v-for="(item,index) in scope.row.busiCateList" :key="index">
                            <span>{{item.bfirstCateName}}/{{item.bsecondCateName}}</span>
                        </div>
                    </template>
                    <template #operation="scope">
                        <el-button type="primary" text @click="delate(scope.row,scope.index)" >删除</el-button>
                    </template>
                </system-list>
            </div>
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" @click="goBack">取消</el-button>
                    <el-button type="primary" @click="submit" v-if="props.type !=='detail'">保存</el-button>
                </div>
            </el-form-item>
        </el-form>

    </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import SystemList from '@/composables/TablePagination/totalTable.vue'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['type', 'purchaseNo'])
// 表单数据
const quantityTotal = computed(() => {
    const quiltyList = form.value.goodsDetails.map(el => el.quantity)
    return quiltyList.reduce((acc, cur) => parseFloat(cur) + acc, 0) || 0
})
const totalTaxAmount = computed(() => {
    const totalTaxAmountList = form.value.goodsDetails.map(el => el.totalTaxAmount)
    return totalTaxAmountList.reduce((acc, cur) => parseFloat(cur) + acc, 0) || 0
})
const form = ref({
    merchantId: '',
    merchantCode: '',
    merchantName: '',
    merchantUser: '',
    merchantMobile: '',
    merchantAddress: '',
    purchaseCode: '',
    purchaseName: '',
    skuCode: '',
    purchaseNo: '',
    purchaseType: '',
    totalTaxAmount: totalTaxAmount,
    quantity: quantityTotal,
    goodsDetails: []
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})
const dialogVisible = ref(false)
// 表格数据
const tableData = ref([])

const tHead = [
    // { align: 'center', tooltip: true, prop: 'barcode', label: '商品条码', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'skuCode', label: '商品编号', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'unit', label: '采购单位', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'quantity', label: '采购数量', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'unitPrice', label: '不含税单价', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'taxRate', label: '税率', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'taxPrice', label: '含税单价', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'totalAmount', label: '金额', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'totalTaxAmount', label: '含税金额', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'busiCateList', label: '商品类目', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'standardCode', label: '标品编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'standardName', label: '标品名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'spuTransUnit', label: '商品与标品转换关系', minWidth: 200 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 230, slot: true, fixed: 'right' }
]

// 表格添加
const addRow = async (row) => {
    form.value.goodsDetails.push({})
    await getSkunameList()
}

const delate = (row, index) => {
    console.log(row, index)
    form.value.goodsDetails.splice(index, 1)
}

const goBack = () => {
    router.go(-1)
}

// 供货方信息
const merchantList = ref([])
const getMerchantName = async (value) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            merchantName: value,
            busiMerchantStatus: 4

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        merchantList.value = res.data.list.map(item => {
            return {
                busiMerchantId: item.busiMerchantId,
                merchantName: item.merchantName
            }
        })
    }
}
const getName = async (value) => {
    if (value) {
        await getMerchant(value)
    } else {
        form.value.merchantCode = ''
        form.value.merchantName = ''
        form.value.merchantUser = ''
        form.value.merchantMobile = ''
        form.value.merchantAddress = ''
        form.value.merchantId = ''
        form.value.goodsDetails = []
    }
}
const getMerchant = async (value) => {
    if (value || form.value.merchantCode) {
        const params = {
            body: {
                businessCode: 'A1001006',
                busiCode: 'A1001006',
                appKey: 'A1001001', // 系统标识
                busiMerchantId: value || form.value.merchantCode

            },
            appKey: 'A1001001',
            busiCode: 'A1001006',
            configCode: 'UC1657593710597AS3QX',
            name: '商户信息详情',
            source: '商户中台'
        }
        const res = await getMerchantListCode(params)
        if (res.code === '200') {
            form.value.merchantCode = res.data.busiMerchantId
            form.value.merchantName = res.data.merchantName
            form.value.merchantUser = res.data.legalName
            form.value.merchantMobile = res.data.phoneMobile
            form.value.merchantAddress = res.data.merchAddress
            form.value.merchantId = res.data.busiMerchantId
            await getSkuname()
        }
    } else {
        form.value.merchantCode = ''
        form.value.merchantName = ''
        form.value.merchantUser = ''
        form.value.merchantMobile = ''
        form.value.merchantAddress = ''
        form.value.merchantId = ''
    }
}
// 采购方信息
const smerchantList = ref([])
const getSMerchant = async (value) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            merchantName: value,
            busiMerchantStatus: 4

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        smerchantList.value = res.data.list.map(item => {
            return {
                busiMerchantId: item.busiMerchantId,
                merchantName: item.merchantName
            }
        })
    }
}
const getSName = async (value) => {
    if (value) {
        form.value.purchaseCode = value.busiMerchantId
        form.value.purchaseName = value.merchantName
    }
}
const getPurchase = async () => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            busiMerchantId: form.value.purchaseCode

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC1657593710597AS3QX',
        name: '商户信息详情',
        source: '商户中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        form.value.purchaseName = res.data.merchantName
    }
}

// sku查询
const getSku = async (value, index) => {
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            skuIds: [value] || [],
            // skuName: value.skuName,
            // merchantIds: [form.value.merchantId],
            channelTypes: [6],
            skuStatus: [-1]
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UCJH64045180106321920',
        name: '采购单商品聚合价格',
        source: '运营后台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        // Object.assign(res.data, form.value.goodsDetails[index])
        // form.value.goodsDetails[index] = res.data
        if (!form.value.goodsDetails[index].skuName) {
        }
        form.value.goodsDetails[index].skuName = res.data.skuName
        form.value.goodsDetails[index].standardName = res.data.spuName
        form.value.goodsDetails[index].standardCode = res.data.spuId
        form.value.goodsDetails[index].unit = res.data.productSpec
        form.value.goodsDetails[index].firstCateCode = res.data.firstCateCode
        form.value.goodsDetails[index].firstCateName = res.data.firstCateName
        form.value.goodsDetails[index].secondCateCode = res.data.secondCateCode
        form.value.goodsDetails[index].secondCateName = res.data.secondCateName
        form.value.goodsDetails[index].thirdCateCode = res.data.thirdCateCode
        form.value.goodsDetails[index].thirdCateName = res.data.thirdCateName
        form.value.goodsDetails[index].fourthCateCode = res.data.fourthCateCode
        form.value.goodsDetails[index].fourthCateName = res.data.fourthCateName
        form.value.goodsDetails[index].busiCateList = res.data.firstCateName + '/' + res.data.secondCateName + '/' + res.data.thirdCateName + '/' + res.data.fourthCateName
        form.value.goodsDetails[index].spuTransUnit = res.data.spuTransUnit
        if (res.data.taxInfo) {
            form.value.goodsDetails[index].taxRate = (res.data.taxInfo.tax) / 100
        }
        form.value.goodsDetails[index].taxPrice = res.data.priceInfo ? res.data.priceInfo.purchasePrice : ''
    }
}

const skuNameList = ref([])
const getSkunameList = async (value, index) => {
    console.log(value, index)
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            skuName: value,
            merchantIds: [form.value.merchantId],
            channelTypes: [6],
            skuStatus: [2, 4, 5, 6, 7]
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {}
    skuNameList.value = res.data.list
}
const getSkuName = async (value, index) => {
    if (value) {
        form.value.goodsDetails[index].skuCode = value.skuId
        await getSku(value.skuId, index)
    } else {
        form.value.goodsDetails[index] = {}
    }
}
const getSkuname = async (value, index) => {
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            skuName: value,
            merchantIds: [form.value.merchantId],
            channelTypes: [6],
            skuStatus: [2, 4, 5, 6, 7]
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {}
    skuNameList.value = res.data.list
    if (value) {
        form.value.goodsDetails[index].skuCode = res.data.list[0].skuId
        await getSku(form.value.goodsDetails[index].skuCode, index)
    } else {
        form.value.goodsDetails[index] = {}
    }
}
// 计算
// const changePrice = async (value, index) => {
//     form.value.goodsDetails[index].unitPrice = value * (1 - form.value.goodsDetails[index].taxRate)
// }
watch(() => form.value.goodsDetails,
    (val) => {
        form.value.goodsDetails.map(item => {
            if (item.taxPrice && item.taxRate) {
                // item.unitPrice = item.taxPrice * (1 - item.taxRate)
                item.unitPrice = (item.taxPrice / (1 + item.taxRate)).toFixed(2)
            }
            if (item.unitPrice && item.quantity) {
                item.totalAmount = (item.unitPrice * item.quantity).toFixed(2) || ''
            }
            if (item.taxPrice && item.quantity) {
                item.totalTaxAmount = (item.taxPrice * item.quantity).toFixed(2) || 0
            }

            item.taxAmount = item.totalTaxAmount - item.totalAmount
        })
    },
    {
        deep: true
    })

// 接口请求数据
const submit = async () => {
    form.value.goodsDetails.map((item, index) => {
        // if () {
        //     return ElMessage.success('商品不得重复')
        // }
    })
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            ...form.value,
            createId: userInfo.value.id
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        // configCode: 'UC61842783942066176',
        // name: '新增保存采购单信息',
        source: '采销系统'
    }
    console.log(params, 'baocuyn')
    if (props.type === 'add') {
        params.configCode = 'UCJH64751011981815808'
        params.name = '新增保存采购单信息'
    } else {
        params.configCode = 'UCJH64750610515619840'
        params.name = '更新保存采购单信息'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        router.go(-1)
    }
}
const getDetail = async () => {
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            purchaseNo: props.purchaseNo
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61842559349669888',
        name: '根据采购单编号查询单个采购单信息',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        form.value.merchantCode = res.data.merchantCode
        form.value.merchantId = res.data.merchantCode
        form.value.purchaseNo = res.data.purchaseNo
        form.value.merchantUser = res.data.merchantUser
        form.value.merchantName = res.data.merchantName
        form.value.merchantMobile = res.data.merchantMobile
        form.value.merchantAddress = res.data.merchantAddress
        form.value.purchaseCode = res.data.purchaseCode
        form.value.purchaseName = res.data.purchaseName
        form.value.purchaseType = res.data.purchaseType
        form.value.goodsDetails = res.data.goodsDetails
    }
}
onMounted(async () => {
    if (props.type !== 'add') {
        await getDetail()
    } else {
        // await getMerchant()
    }
})

</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
