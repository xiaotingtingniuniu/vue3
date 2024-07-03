<template>
    <div class="stockListBox">
        <div class="big-title">{{props.type === 'add'?'采购入库单新增':'采购入库单详情'}}</div>
        <el-form ref="resetFormData" :model="form" label-width="140px" :inline="true">
            <el-form-item label="采购单号：" prop="purchaseNo">
                <el-input v-model="form.purchaseNo"  placeholder="请输入采购单号" @change="getChange"/>
            </el-form-item>
            <el-form-item label="单据类型：" prop="documentType">
                <el-select v-model="form.documentType"   clearable placeholder="请选择单据类型" disabled>
                    <el-option label="采购入库单（店）" :value="1" />
                    <el-option label="采购入库单" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="采购入库单号：" prop="warehousingNo" v-if="props.type !== 'add'">
                <el-input v-model="form.warehousingNo"  disabled/>
            </el-form-item>
            <br>
            <div class="small-title">发货方信息</div>
            <el-form-item label="发货方编号：" prop="deliveryCode">
                <el-input v-model="form.deliveryCode"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="发货方名称：" prop="deliveryName">
                <el-input v-model="form.deliveryName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="发货方联系人：" prop="deliver">
                <el-input v-model="form.deliver"  placeholder="请输入发货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="发货方联系方式：" prop="deliveryMobile">
                <el-input v-model="form.deliveryMobile"  placeholder="请输入发货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="发货方地址：" prop="deliveryAddress">
                <el-input v-model="form.deliveryAddress"  placeholder="请输入发货方地址" disabled/>
            </el-form-item>
            <div class="small-title">收货方信息</div>
            <el-form-item label="收货方编号：" prop="receiverNo">
                <el-input v-model="form.receiverNo"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方名称：" prop="receiverName">
                <!-- <el-input v-model="form.receiverName"  placeholder="发货方名称" @change="getMerchantName(form.receiverName)"/> -->
                <el-select v-model="form.receiverName" clearable placeholder="请输入发货方名称"   filterable
                           remote
                           reserve-keyword value-key="warehouseCode"  :remote-method="getMerchantName" @change="getName">
                    <el-option v-for="item in merchantList" :key="item.warehouseCode
                    " :label="item.warehouseName" :value="item" />
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="收货方联系人：" prop="receiver">
                <el-input v-model="form.receiver"  placeholder="请输入收货方联系人" disabled />
            </el-form-item>
            <el-form-item label="收货方联系方式：" prop="receiverMobile">
                <el-input v-model="form.receiverMobile"  placeholder="请输入收货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="收货方地址：" prop="receiverAddress">
                <el-input v-model="form.receiverAddress"  placeholder="请输入收货方地址" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">单据信息</div>
            <el-form-item label="数量：" prop="quantity">
                <el-input v-model="form.quantity"  placeholder="商品数量" />
            </el-form-item>
            <!-- <el-form-item label="体积（立方米）：" prop="volume" v-if="props.type ==='detail'">
                <el-input v-model="form.volume" />
            </el-form-item>
            <el-form-item label="重量（千克）：" prop="weight"  v-if="props.type ==='detail'">
                <el-input v-model="form.weight"  placeholder="总重量" />
            </el-form-item> -->
        </el-form>
        <div  class="tableList-area">
            <div class="big-title">商品明细</div>
            <el-button type="primary"  @click="addRow()" v-if="form.purchaseNo !=='' && props.type !=='detail'">添加商品</el-button>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column type="index" label="序号" />
                <el-table-column prop="barcode" label="商品条码"  />
                <el-table-column prop="skuCode" label="商品编号"  >
                    <template v-slot="scope">
                        <el-input v-model="scope.row.skuCode" placeholder="请输入供应商SKU编号，查找"  @change="getSku(scope.row.skuCode,scope.$index)"/>
                        <!--  -->
                    </template>
                </el-table-column>
                <el-table-column prop="skuName" label="商品名称">
                    <template v-slot="scope">
                        <!-- <el-input v-model="scope.row.skuName"   /> -->
                        <el-select v-model="scope.row.skuName"  placeholder="请选择供应商名称" clearable  filterable
                                   remote
                                   reserve-keyword  value-key="skuCode" @change="getskuName(scope.row.skuName,scope.$index)">
                            <el-option v-for="item in tableDataList" :key="item.skuCode" :label="item.skuName" :value="item" />
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="unit" label="商品单位" />
                <el-table-column prop="quantity" label="数量" >
                    <template v-slot="scope">
                        <el-input v-model="scope.row.quantity"  @change="getQuanuty(scope.row.quantity,scope.$index)"/>
                    </template>
                </el-table-column>
                <el-table-column prop="volume" label="体积" >
                    <!-- <template v-slot="scope">
                        <el-input v-model="scope.row.volume"  />
                    </template> -->
                </el-table-column>
                <el-table-column prop="weight" label="重量" >
                    <!-- <template v-slot="scope">
                        <el-input v-model="scope.row.weight"  />
                    </template> -->
                </el-table-column>
                <!-- <el-table-column prop="relatedNo" label="相关商品编号" />
                <el-table-column prop="relatedName" label="相关商品名称" />
                <el-table-column prop="relatedModel" label="相关商品规格" />
                <el-table-column prop="relatedQuantity" label="相关商品数量" />
                <el-table-column prop="productCategory" label="商品类目" />
                <el-table-column prop="standardNo" label="标品编号" />
                <el-table-column prop="deliveryRelation" label="商品与标品关系" />
                <el-table-column prop="receiverRelation" label="相关商品与标品关系">
                    <template v-slot="scope">
                        <el-input v-model.number="scope.row.realCount"></el-input>
                    </template>
                </el-table-column> -->
                <el-table-column prop="operation" label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" text @click="delate(scope.row,scope.$index)" :disabled="props.type ==='detail'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div>
            <el-button type="primary" @click="goBack"> 关闭 </el-button>
            <el-button type="primary" @click="submit" v-if="props.type !== 'detail'">保存</el-button>
            <el-button type="primary" @click="effect" v-if="props.type !== 'detail'"> 生效 </el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, defineEmits } from 'vue'
import { getMerchantListCode, getenMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['type', 'warehousingNo'])
const emits = defineEmits(['update:modelValue', 'getList'])
// 查询项
const quantityTotal = computed(() => {
    const quiltyList = tableData.value.map(el => el.quantity)
    return quiltyList.reduce((acc, cur) => parseFloat(cur) + acc, 0) || 0
})
// const volumeTotal = computed(() => {
//     const volumeList = tableData.value.map(el => el.volume)
//     return volumeList.reduce((acc, cur) => parseFloat(cur) + acc, 0) || 0
// })
// const weightTotal = computed(() => {
//     const weightList = tableData.value.map(el => el.weight)
//     return weightList.reduce((acc, cur) => parseFloat(cur) + acc, 0) || 0
// })
const form = reactive({
    purchaseNo: '',
    documentType: 0,
    warehousingNo: '',
    deliveryCode: '',
    deliveryName: '',
    deliver: '',
    deliveryMobile: '',
    deliveryAddress: '',
    receiverNo: '',
    receiverName: '',
    receiver: '',
    receiverMobile: '',
    receiverAddress: '',
    quantity: quantityTotal,
    volume: '',
    weight: ''
})
const tableData = ref([])
// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    row: null
})

// 表格添加
const addRow = (row) => {
    tableData.value.push({})
}

const delate = (row, index) => {
    tableData.value.splice(index, 1)
}
// 数据总数
const totals = ref(0)
const tableDataList = ref([])
const getChange = async (value) => {
    if (value) {
        const params = {
            body: {
                businessCode: 'A1001006',
                busiCode: 'A1001006',
                appKey: 'A1001001', // 系统标识
                purchaseNo: value,
                purchaseStatus: 5

            },
            appKey: 'A1001001',
            busiCode: 'A1001006',
            configCode: 'UCJH63269786297679872',
            name: '采购单商品聚合相关商品',
            source: '运营后台'
        }
        const res = await getMerchantListCode(params)
        if (res.code === '200') {
        // form.documentType = res.data.purchaseType
            form.deliveryCode = res.data.merchantCode
            form.deliveryName = res.data.merchantName
            form.deliver = res.data.merchantUser
            form.deliveryMobile = res.data.merchantMobile
            form.deliveryAddress = res.data.merchantAddress
            // form.receiverNo = res.data.purchaseCode
            // form.receiverName = res.data.purchaseName
            tableData.value = res.data.goodsDetails.map(item => {
                return {
                    relatedCode: item.relationSku ? item.relationSku.skuId : '',
                    relatedName: item.relationSku ? item.relationSku.skuName : '',
                    relatedModel: item.relationSku ? item.relationSku.productSpec : '',
                    relatedQuantity: item.quantity,
                    relatedFirstChannel: item.relationSku ? item.relationSku.firstChannelName : '',
                    relatedSecondChannel: item.relationSku ? item.relationSku.secondChannelName : '',
                    receiverRelation: item.relationSku ? item.relationSku.receiverRelation : '',
                    deliveryRelation: item.relationSku ? item.relationSku.deliveryRelation : '',
                    relatedWeight: item.relationSku ? (item.relationSku.grossWeight / 1000).toFixed(3) : '',
                    relatedVolume: item.relationSku ? ((item.relationSku.packageWidth / 1000) * (item.relationSku.packageLength / 1000) * (item.relationSku.packageHeight / 1000)).toFixed(3) : '',
                    weight: item.goodsSkuInfo ? (item.goodsSkuInfo.grossWeight / 1000).toFixed(3) : '',
                    volume: item.goodsSkuInfo ? ((item.goodsSkuInfo.packageWidth / 1000) * (item.goodsSkuInfo.packageLength / 1000) * (item.goodsSkuInfo.packageHeight / 1000)).toFixed(3) : '',
                    ...item
                }
            })
            tableDataList.value = res.data.goodsDetails
            form.merchantId = res.data.merchantCode
            // await getSkuname()
        }
    } else {
        form.deliveryCode = ''
        form.deliveryName = ''
        form.deliver = ''
        form.deliveryMobile = ''
        form.deliveryAddress = ''
        form.receiverNo = ''
        form.receiverName = ''
        tableData.value = []
        form.merchantId = ''
    }
}

// 仓列表
const merchantList = ref([])
const getMerchantName = async (value) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            warehouseName: value,
            status: 1,
            pageNum: 1,
            pageSize: 999

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61835295184240640',
        name: '库房主数据列表',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        merchantList.value = res.data
    }
}
const getName = (value) => {
    form.receiverNo = value.warehouseCode
    form.receiverName = value.warehouseName
    form.receiver = value.contacter
    form.receiverMobile = value.contacterMobile
    form.receiverAddress = value.detAddress
}

const getskuName = (value, index) => {
    tableData.value[index].skuCode = value.skuCode
    tableData.value[index].barcode = value.barcode
    tableData.value[index].skuName = value.skuName
    tableData.value[index].quantity = value.quantity
    tableData.value[index].standardCode = value.spuId
    tableData.value[index].standardName = value.spuName
    tableData.value[index].unit = value.productSpec
    tableData.value[index].standardNo = value.spuId
    tableData.value[index].relatedQuantity = value.quantity
    tableData.value[index].firstCateCode = value.firstCateCode
    tableData.value[index].firstCateName = value.firstCateName
    tableData.value[index].secondCateCode = value.secondCateCode
    tableData.value[index].secondCateName = value.secondCateName
    tableData.value[index].thirdCateCode = value.thirdCateCode
    tableData.value[index].thirdCateName = value.thirdCateName
    tableData.value[index].fourthCateCode = value.fourthCateCode
    tableData.value[index].fourthCateName = value.fourthCateName
    if (value.relationSku) {
        tableData.value[index].relatedCode = value.relationSku.skuId
        tableData.value[index].relatedName = value.relationSku.skuName
        tableData.value[index].relatedFirstChannel = value.relationSku.firstChannelName
        tableData.value[index].relatedSecondChannel = value.relationSku.secondChannelName
        tableData.value[index].relatedModel = value.relationSku.productSpec
        tableData.value[index].receiverRelation = value.relationSku.receiverRelation
        tableData.value[index].deliveryRelation = value.relationSku.deliveryRelation
        tableData.value[index].relatedWeight = (value.relationSku.grossWeight / 1000).toFixed(3)
        tableData.value[index].relatedVolume = ((value.relationSku.packageWidth / 1000) * (value.relationSku.packageLength / 1000) * (value.relationSku.packageHeight / 1000)).toFixed(3)
    }
    if (value.goodsSkuInfo) {
        tableData.value[index].weight = (value.goodsSkuInfo.grossWeight / 1000).toFixed(3)
        tableData.value[index].volume = ((value.goodsSkuInfo.packageWidth / 1000) * (value.goodsSkuInfo.packageLength / 1000) * (value.goodsSkuInfo.packageHeight / 1000)).toFixed(3)
    }
}
// sku查询
const getSku = async (value, index) => {
    const obj = tableDataList.value.find(item => item.skuCode === value)
    if (obj) {
        tableData.value[index].skuCode = obj.skuCode
        tableData.value[index].barcode = obj.barcode
        tableData.value[index].skuName = obj.skuName
        tableData.value[index].quantity = obj.quantity
        tableData.value[index].standardCode = obj.spuId
        tableData.value[index].standardName = obj.spuName
        tableData.value[index].unit = obj.productSpec
        tableData.value[index].standardNo = obj.spuId
        if (obj.relationSku) {
            tableData.value[index].relatedCode = obj.relationSku.skuId
            tableData.value[index].relatedName = obj.relationSku.skuName
            tableData.value[index].relatedFirstChannel = obj.relationSku.firstChannelName
            tableData.value[index].relatedSecondChannel = obj.relationSku.secondChannelName
            tableData.value[index].relatedModel = obj.relationSku.productSpec
            tableData.value[index].receiverRelation = obj.relationSku.receiverRelation
            tableData.value[index].deliveryRelation = obj.relationSku.deliveryRelation
            tableData.value[index].relatedWeight = (obj.relationSku.grossWeight / 1000).toFixed(3)
            tableData.value[index].relatedVolume = ((obj.relationSku.packageWidth / 1000) * (obj.relationSku.packageLength / 1000) * (obj.relationSku.packageHeight / 1000)).toFixed(3)
        }
        tableData.value[index].relatedQuantity = obj.quantity
        tableData.value[index].firstCateCode = obj.firstCateCode
        tableData.value[index].firstCateName = obj.firstCateName
        tableData.value[index].secondCateCode = obj.secondCateCode
        tableData.value[index].secondCateName = obj.secondCateName
        tableData.value[index].thirdCateCode = obj.thirdCateCode
        tableData.value[index].thirdCateName = obj.thirdCateName
        tableData.value[index].fourthCateCode = obj.fourthCateCode
        tableData.value[index].fourthCateName = obj.fourthCateName
        if (obj.goodsSkuInfo) {
            tableData.value[index].weight = obj.goodsSkuInfo.grossWeight ? (obj.goodsSkuInfo.grossWeight / 1000).toFixed(3) : obj.goodsSkuInfo.grossWeight
            tableData.value[index].volume = ((obj.goodsSkuInfo.packageWidth / 1000) * (obj.goodsSkuInfo.packageLength / 1000) * (obj.goodsSkuInfo.packageHeight / 1000)).toFixed(3)
        }
    } else {
        ElMessage.warning('请输入采购单中已有的商品编号！')
    }

    // const params = {
    //     body: {
    //         busiCode: 'A1001004',
    //         appKey: 'A1001001', // 系统标识
    //         skuIds: [value],
    //         skuStatus: [-1]
    //     },
    //     appKey: 'A1001001',
    //     busiCode: 'A1001004',
    //     configCode: 'UCJH64045180106321920',
    //     name: '采购单商品聚合价格',
    //     source: '运营后台'
    // }
    // const res = await getMerchantListCode(params)
    // if (res.code === '200') {
    // tableData.value[index].barcode = res.data.barcode
    // tableData.value[index].skuName = res.data.skuName
    // tableData.value[index].standardCode = res.data.spuId
    // tableData.value[index].standardName = res.data.spuName
    // tableData.value[index].unit = res.data.productSpec
    // tableData.value[index].standardNo = res.data.spuId
    // form.value.goodsDetails[index].relatedCode = res.data.skuCode
    // form.value.goodsDetails[index].relatedName = res.data.skuName
    // form.value.goodsDetails[index].relatedModel = res.data.storageStatus
    // form.value.goodsDetails[index].relatedQuantity = res.data.storageQuantity
    // form.value.goodsDetails[index].firstCateName = res.data.firstCateName
    // form.value.goodsDetails[index].secondCateCode = res.data.secondCateCode
    // form.value.goodsDetails[index].secondCateName = res.data.secondCateName
    // form.value.goodsDetails[index].thirdCateCode = res.data.thirdCateCode
    // form.value.goodsDetails[index].thirdCateName = res.data.thirdCateName
    // form.value.goodsDetails[index].fourthCateCode = res.data.fourthCateCode
    // form.value.goodsDetails[index].fourthCateName = res.data.fourthCateName
    // form.value.goodsDetails[index].deliveryRelation = res.data.deliveryRelation
    // // tableData.value[index].weight = value.goodsSkuInfo.packageWidth ? value.goodsSkuInfo.packageWidth / 1000 : value.goodsSkuInfo.packageWidth
    // // tableData.value[index].volume = (value.goodsSkuInfo.packageWidth / 1000) * (value.goodsSkuInfo.packageLength / 1000) * (value.goodsSkuInfo.packageHeight / 1000).toFixed(3)
    // // tableData.value[index].productCategory = res.data.busiCateList
    // tableData.value[index].spuTransUnit = res.data.spuTransUnit
    // tableData.value[index].taxPrice = res.data.channelPrice
    // if (res.data.taxInfo) {
    //     tableData.value[index].taxRate = res.data.taxInfo.tax
    // }
}
// }
// 供货方信息
const getMerchant = async (num, value) => {
    const params = {
        body: {
            businessCode: 'A1001006',
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            busiMerchantId: value

        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC1657593710597AS3QX',
        name: '商户信息详情',
        source: '商户中台'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        if (num === 1) {
            form.value.deliveryName = res.data.merchantName
            form.value.deliver = res.data.legalName
            form.value.deliveryMobile = res.data.phoneMobile
            form.value.deliveryAddress = res.data.regAddress
        }
        if (num === 2) {
            form.value.receiverName = res.data.merchantName
            form.value.receiver = res.data.legalName
            form.value.receiverMobile = res.data.phoneMobile
            form.value.receiverAddress = res.data.regAddress
        }
    }
}
const skuNameList = ref([])
const getSkuname = async (value, index) => {
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            skuName: value,
            merchantIds: [form.merchantId],
            channelTypes: [6],
            skuStatus: [-1]
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
    }
}
// 修改数量
const getQuanuty = (num, index) => {
    tableData.value[index].relatedQuantity = num
}
const submit = async () => {
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            ...form,
            productList: tableData.value,
            createId: userInfo.value.id
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        source: '采销系统'
    }
    console.log(params, ' tableData.')
    if (props.type === 'add') {
        params.configCode = 'UC61854545038917632'
        params.name = '采购入库单保存'
    } else {
        params.configCode = 'UC61855173635063808'
        params.name = '采购入库单更新'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        ElMessage.success('成功')
        router.go(-1)
    }
}
// 生效
const effect = async () => {
    console.log(props.type)
    const params = {
        body: {
            busiCode: 'A1001006',
            appKey: 'A1001001', // 系统标识
            ...form,
            productList: tableData.value,
            createId: userInfo.value.id
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC65741169028022272',
        name: '采购入库单生效',
        source: '采销系统'
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
            warehousingNo: props.warehousingNo
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC61854943560712192',
        name: '采购入库单详情',
        source: '采销系统'
    }
    const res = await getMerchantListCode(params)

    if (res.code === '200') {
        form.purchaseNo = res.data.purchaseNo
        form.documentType = Number(res.data.documentType)
        form.warehousingNo = res.data.warehousingNo
        form.deliveryCode = res.data.deliveryCode
        form.deliveryName = res.data.deliveryName
        form.deliver = res.data.deliver
        form.deliveryMobile = res.data.deliveryMobile
        form.deliveryAddress = res.data.deliveryAddress
        form.receiverNo = res.data.receiverNo
        form.receiverName = res.data.receiverName
        form.receiver = res.data.receiver
        form.receiverMobile = res.data.receiverMobile
        form.receiverAddress = res.data.receiverAddress
        form.weight = res.data.weight
        form.volume = res.data.volume
        tableData.value = res.data.productList
    }
}
onMounted(async () => {
    if (props.type !== 'add') {
        await getDetail()
    }
})

const goBack = () => {
    router.go(-1)
}
</script>

<style lang="scss" scoped>
.stockListBox{
    .big-title{
        font-weight: bold;
        margin-bottom: 20px;
    }
    .small-title{
        font-weight: bold;
        margin-bottom: 12px;
        font-size: 14px;
        width: 120px;
        text-align: right;
    }
    .btns{
        margin: 50px 0 20px 1300px;
    }
    .date-list{
        background-color: rgba($color: black, $alpha: 0.2);
        margin-top: 10px;
        display: flex;
        span{
            flex: 1;
        }
    }
    .bottom{
        display: flex;
    }
    .confirm-btns{
        margin: 0 auto;
        width: fit-content;
        margin-top: 20px;
    }
    .el-pager li.is-active{
        color: #409EFF !important;
    }
    .primaryBox{
        color: #409EFF !important;
    }
    .demo-pagination-block{
        .is-active{
            color: #409EFF !important;
        }
    }
}

</style>
