<template>
    <div class='spu-edit-box'>
        <el-col :span="16">
            <div class='box-title-sm'>
                所属基础类目: {{spuFormData.firstCateName}}-{{spuFormData.secondCateName}}-{{spuFormData.thirdCateName}}-{{spuFormData.fourthCateName}}
            </div>
        </el-col>
        <div>
            <!-- 第一部分：公共重要的 -->
            <div>
                <div class='box-title-sm'>标品重要属性</div>
                <el-form
                    label-width="100px"
                    :model="spuFormData1"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item v-for="item in inputList1" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <!-- 选择框 -->
                        <div v-if="item.type === 'select'">
                            <el-select v-model="spuFormData1[item.name]" clearable :placeholder="item.placeholder || ''" disabled>
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text"/>
                            </el-select>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'radio'">
                            <el-radio-group v-model="spuFormData1[item.name]" disabled>
                                <el-radio v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text">{{ el.text }}</el-radio>
                            </el-radio-group>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'checkbox'">
                            <el-checkbox-group v-model="spuFormData1[item.name]" disabled>
                                <el-checkbox v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text" :rules="{ required: el.required, message: el.label + '不能为空' }">{{ el.text }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 文本输入 -->
                        <div v-else>
                            <el-input v-model="spuFormData1[item.name]" :placeholder="item.placeholder || ''" disabled />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 第三部分：公共非重要的 -->
            <div>
                <div class='box-title-sm'>扩展&补充属性</div>
                <el-form
                    label-width="100px"
                    :model="spuFormData3"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item v-for="item in inputList3" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <div v-if="item.type === 'select'">
                            <el-select v-model="spuFormData3[item.name]" clearable :placeholder="item.placeholder || ''" disabled>
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input v-model='spuFormData3[item.name]' :placeholder="item.placeholder || ''" disabled />
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="btn">
            <el-button @click="goBack">关闭</el-button>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { queryCategory, yingyongQueryCategory } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantList, getupdate, skuMap } from '@/api/operate/index'
import { publicRequest } from '@/api/common/index.js'
import { useRoute, useRouter } from 'vue-router'
import water from './temp/water.js'
import drink from './temp/drink.js'
import coffee from './temp/coffee.js'
import nursing from './temp/nursing.js'
import puffedFood from './temp/puffed_food.js'
import seafood from './temp/seafood.js'
import meat from './temp/meat.js'
import fruitsVeg from './temp/fruits_veg.js'
import { fa } from 'element-plus/es/locale'
const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['type', 'spuTemplate', 'spuId'])
const type = ref(route.params.type)
const form = reactive({
    name: '',
    region: ''
})
const formLabelAlign = reactive({
    name: '',
    region: '',
    type: ''
})
const formParams = ref('')
const supplierForm = ref('')
const addrForm = ref('')
router.beforeEach((to, from, next) => {
    next()
})
const fileList = ref([])
onMounted(async () => {
    await getSpuDetail()
})
const dataState = reactive({
    spuFormData: {
        supplierId: '',
        supplierType: 1,
        supplierName: null,
        purchasePrice: null,
        costPrice: null,
        grossRate: null,
        minOrderNum: null,
        minOrderUnit: '',
        orderCycle: null,
        afterSaleService: 0
    },
    initAddrData: {
        shipper1: [],
        shipper2: [],
        shipper3: [],
        shipper4: [],
        shipper5: []
    },
    spuFormDataAddr: {
        shipper1: { provinceCode: '', provinceName: '', cityCode: '', cityName: '', countyCode: '', countyName: '', addr: '' },
        shipper2: { provinceCode: '', provinceName: '', cityCode: '', cityName: '', countyCode: '', countyName: '', addr: '' },
        shipper3: { provinceCode: '', provinceName: '', cityCode: '', cityName: '', countyCode: '', countyName: '', addr: '' },
        shipper4: { provinceCode: '', provinceName: '', cityCode: '', cityName: '', countyCode: '', countyName: '', addr: '' },
        shipper5: { provinceCode: '', provinceName: '', cityCode: '', cityName: '', countyCode: '', countyName: '', addr: '' }
    },
    spuFormData1: {
        brandName: '',
        spuName: '',
        barcode: '',
        origPlace: '',
        productShelfLife: '',
        productShelfLifeUnit: '年',
        productSpec: '',
        guidePrice: '',
        packageUnit: '',
        storageStyle: '',
        storageCondition: '',
        isImport: '',
        grossWeight: '',
        saleChannel: [],
        suggSellingPrice: '',
        isSmallSpec: ''
    },
    spuFormData3: {
        netRatio: '',
        ingredientList: '',
        entrustedParty: '',
        productLength: '',
        productWidth: '',
        productHeight: '',
        countStyle: '',
        countUnit: '',
        productBbf: '',
        boxFormat: '',
        isBatch: '',
        batchAttrValue: '',
        qualityReport: '',
        availPerson: '',
        prodDesc: '',
        searchTag: '',
        nutrients: '',
        eatStyle: '',
        eatSug: '',
        attention: '',
        guidePrice: '',
        groupAttr: '',
        threeRClassify: '',
        trademark: '',
        marketGuidePrice: '',
        isSuit: 0,
        whseAcceptFactor: '',
        whseDeliveryFactor: '',
        saleablePeriod: '',
        transUnit: '',
        inventoryUnit: '',
        purchaseUnit: '',
        defaultDistributionSpec: '',
        defaultPurchaseSpec: '',
        distributionUnit: '',
        defaultRetailSpec: '',
        retailUnit: '',
        defaultWholesaleSpec: '',
        wholesaleUnit: '',
        barcodeSpec: '',
        barcodeUnit: '',
        allergenInfo: '',
        packageSpec: '',
        packageStyle: '',
        packageList: '',
        manuName: '',
        manuAddr: '',
        manuPhone: '',
        agent: '',
        agentAddr: '',
        agentPhone: '',
        entrustedPartyAddr: '',
        entrustedPartyPhone: ''
    },
    chaildFormData: {
        busiFirstCateName: '',
        busiSecondCateName: '',
        busiThirdCateName: '',
        isEnabled: ''
    },
    selectData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourCateName: ''
    },
    // 一级类目
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],
    fileTemp: '',
    file: '',
    goodsTypeList: []

})
const { spuFormData, initAddrData, spuFormDataAddr, spuFormData1, spuFormData3, chaildFormData, selectData, firstCateNameList, secondCateNameList, thirdCateNameList, fourCateNameList, goodsTypeList } = toRefs(dataState)
// 供应商信息8项，毛利率1项
const inputList = reactive([
    {
        label: '发货类型',
        name: 'supplierType',
        type: 'select',
        placeholder: '请选择',
        required: false,
        menu: [
            { value: 1, text: '一件代发' },
            { value: 2, text: '入库' },
            { value: 3, text: '一件代发+入库' }
        ]
    },
    { label: '发货配送方', name: 'supplierName', type: 'custom', required: false },
    { label: '采购价', name: 'purchasePrice', type: 'number', required: false, precision: 2, step: 0.1, lastText: '元' },
    { label: '成本价', name: 'costPrice', type: 'number', precision: 2, required: false, step: 0.1, lastText: '元' },
    { label: '毛利率', name: 'grossRate', type: 'rate', disabled: false, precision: 2, lastText: '%' },
    { label: '起订量', name: 'minOrderNum', type: 'number', required: false },
    {
        label: '起订量单位',
        name: 'minOrderUnit',
        type: 'select',
        required: false,
        placeholder: '请选择',
        menu: [
            { value: '箱', text: '箱' },
            { value: '包', text: '包' },
            { value: '个', text: '个' }
        ]
    },
    { label: '订单周期', name: 'orderCycle', type: 'number', required: false, lastText: '天' },
    {
        label: '基础服务',
        name: 'afterSaleService',
        type: 'radio',
        required: false,
        menu: [
            { value: 0, text: '无' },
            { value: 1, text: '7天无理由退货' },
            { value: 2, text: '无忧退货' }
        ]
    }
])

// 第一部分：公共重要 14项
const inputList1 = reactive([
    { label: '品牌名称', name: 'brandName' },
    { label: '标品名称', name: 'spuName' },
    { label: '69码', name: 'barcode' },
    { label: '产地', name: 'origPlace' },
    { label: '保质期', name: 'productShelfLife' },
    {
        label: '保质期单位',
        name: 'productShelfLifeUnit',
        type: 'select',
        placeholder: '请选择',
        menu: [
            { value: '年', text: '年' },
            { value: '月', text: '月' },
            { value: '日', text: '日' },
            { value: '小时', text: '小时' }
        ]
    },
    { label: '商品规格', name: 'productSpec' },
    { label: '官方指导价', name: 'guidePrice' },
    { label: '包装单位', name: 'packageUnit' },
    {
        label: '储存方式',
        name: 'storageStyle',
        type: 'select',
        placeholder: '请选择',
        menu: [
            { value: '常温', text: '常温' },
            { value: '冷藏', text: '冷藏' },
            { value: '冷冻', text: '冷冻' }
        ]
    },
    { label: '储存条件', name: 'storageCondition' },
    { label: '建议销售价', name: 'suggSellingPrice' },
    {
        label: '是否小规格',
        name: 'isSmallSpec',
        type: 'radio',
        required: false,
        menu: [
            { value: 0, text: '否' },
            { value: 1, text: '是' }
        ]
    },
    {
        label: '国产/进口',
        name: 'isImport',
        type: 'select',
        menu: [
            { value: '国产', text: '国产' },
            { value: '进口', text: '进口' }
        ]
    },
    { label: '商品毛重', name: 'grossWeight' },
    {
        label: '销售渠道',
        name: 'saleChannel',
        type: 'checkbox',
        required: true,
        menu: [
            { value: '门店', text: '门店' },
            { value: '货柜', text: '货柜' },
            { value: '电商', text: '电商' }
        ]
    }
])
// 第二部分：扩展重要的 方便速食
const inputList21 = reactive([
    { label: '品牌编号', name: 'brandCode' },
    { label: '商品官方名称', name: 'productOfficialName' },
    { label: '产品标准号', name: 'productFormat' },
    { label: '商品净重', name: 'netWeight' },
    { label: '包装规格', name: 'packageSpec' },
    { label: '固形物不少于', name: 'solidRatio' },
    { label: '食用人数', name: 'peopleEatNum' },
    { label: '杀菌方式', name: 'sterilizeStyle' },
    { label: '料包数量', name: 'packageNum' },
    { label: '辣度', name: 'spicy' },
    { label: '是否清真', name: 'isMuslim' },
    { label: '自带酱包', name: 'isMaterial' },
    { label: '食品类型', name: 'foodType' },
    { label: '能否自热', name: 'isSelfHeat' },
    { label: '能否冲泡', name: 'isBrewed' },
    { label: '是否含餐具', name: 'isChop' },
    { label: '能否微波', name: 'isMicro' },
    { label: '粉包', name: 'powderBag' },
    { label: '酱包', name: 'sauceBag' },
    { label: '油包', name: 'oilBag' },
    { label: '菜包', name: 'vegBag' },
    { label: '调味包', name: 'seasonBag' },
    { label: '底料', name: 'primer' },
    { label: '方便米包', name: 'riceBag' },
    { label: '引用纯净水', name: 'pureWater' },
    { label: '肉包', name: 'meatBag' }
])
// 第二部分：扩展重要的 主食面点19项
const inputList22 = reactive([
    { label: '品牌编号', name: 'brandCode' },
    { label: '商品官方名称', name: 'productOfficialName' },
    { label: '产品标准号', name: 'productFormat' },
    { label: '商品净重', name: 'netWeight' },
    { label: '口味', name: 'productTaste' },
    { label: '每袋数量', name: 'quantityPerBag' },
    { label: '每个克重', name: 'singleWeight' },
    { label: '食用人数', name: 'peopleEatNum' },
    { label: '和面介质', name: 'facetMedia' },
    { label: '小麦粉类型', name: 'wheatType' },
    { label: '面条类型', name: 'noodleType' },
    { label: '奶油类型', name: 'creamType' },
    { label: '蛋糕尺寸', name: 'cakeSize' },
    { label: '面粉类型', name: 'flourType' },
    { label: '面点类型', name: 'pastryType' },
    { label: '馅料', name: 'stuff' },
    { label: '馅含量', name: 'stuffRatio' },
    { label: '产品配料', name: 'productIngredient' },
    { label: '加工方式', name: 'processStyle' },
    { label: '杀菌方式', name: 'sterilizeStyle' }
])
// 第二部分：扩展重要的 熟食23项
const inputList23 = reactive([
    { label: '品牌编号', name: 'brandCode' },
    { label: '商品官方名称', name: 'productOfficialName' },
    { label: '产品标准号', name: 'productFormat' },
    { label: '商品净重', name: 'netWeight' },
    { label: '包装规格', name: 'packageSpec' },
    { label: '肉含量', name: 'meatRatio' },
    { label: '部位', name: 'bodyPart' },
    { label: '加工形态', name: 'processFormat' },
    { label: '加工方式', name: 'processStyle' },
    { label: '食材类别', name: 'foodClass' },
    { label: '食品工艺', name: 'foodCraft' },
    { label: '杀菌工艺', name: 'sterilizeCraft' },
    { label: '加工工艺', name: 'processCraft' },
    { label: '口感', name: 'tasteStyle' },
    { label: '口味', name: 'productTaste' },
    { label: '是否脱骨', name: 'isThereis' },
    { label: '是否清真', name: 'isMuslim' },
    { label: '卤制方式', name: 'stewedVegVari' },
    { label: '卤菜品种', name: 'haloStyle' },
    { label: '特产地区', name: 'specialtyArea' },
    { label: '瘦肉含量', name: 'leanRatio' },
    { label: '脂肪含量', name: 'fatRatio' }
])
// 第二部分：扩展重要的 熟食23项
const inputList24 = reactive([
    { label: '品牌编号', name: 'brandCode' },
    { label: '产品标准号', name: 'productFormat' },
    { label: '商品净重', name: 'netWeight' },
    { label: '产品用途', name: 'prodUsage' },
    { label: '脂肪含量', name: 'fatRatio' },
    { label: '原料是否转基因', name: 'isGenetically' },
    { label: '植物甾醇含量', name: 'phytosterolRatio' },
    { label: '是否初榨', name: 'isFirstPressed' },
    { label: '加工工艺', name: 'processCraft' },
    { label: '鲜牛油含量', name: 'freshButterRatio' },
    { label: '酒精含量', name: 'alcoholRatio' },
    { label: '芝麻重量占比', name: 'sesameRatio' },
    { label: '花生仁重量占比', name: 'peanutRatio' },
    { label: '是否内含小包装', name: 'isSmallBag' },
    { label: '调料形态', name: 'seasonForm' },
    { label: '适合用量', name: 'suitableDosage' },
    { label: '梨浆含量', name: 'pearPulpRatio' },
    { label: '固形物含量', name: 'solidRatio' },
    { label: '是否加碘', name: 'lodinedAdded' }
])
// 第三部分：公共非重要的 23项
const inputList3 = reactive([
    { label: '官方指导价', name: 'guidePrice', type: 'input' },
    { label: '集团属性', name: 'groupAttr', type: 'input' },
    { label: '3R分类', name: 'threeRClassify', type: 'input' },
    { label: '商标', name: 'trademark', type: 'input' },
    { label: '市场指导价', name: 'marketGuidePrice', type: 'input' },
    {
        label: '是否为组套商品',
        name: 'isSuit',
        type: 'select',
        menu: [
            { value: 0, text: '否' },
            { value: 1, text: '是' }
        ]
    },
    { label: '条码规格', name: 'barcodeSpec', type: 'input' },
    { label: '条码单位', name: 'barcodeUnit', type: 'input' },
    { label: '净含量', name: 'netRatio' },
    { label: '配料表', name: 'ingredientList' },
    { label: '包装规格', name: 'packageSpec', type: 'input' },
    { label: '包装方式', name: 'packageStyle', type: 'input' },
    { label: '包装清单', name: 'packageList', type: 'input' },
    { label: '生产商', name: 'manuName', type: 'input' },
    { label: '生产商地址', name: 'manuAddr', type: 'input' },
    { label: '生产商电话', name: 'manuPhone', type: 'input' },
    { label: '委托方', name: 'agent', type: 'input' },
    { label: '委托方地址', name: 'agentAddr', type: 'input' },
    { label: '委托方电话', name: 'agentPhone', type: 'input' },
    { label: '受委托方', name: 'entrustedParty' },
    { label: '受委托方地址', name: 'entrustedPartyAddr' },
    { label: '受委托方电话', name: 'entrustedPartyPhone' },
    { label: '产品尺寸-长', name: 'productLength' },
    { label: '产品尺寸-宽', name: 'productWidth' },
    { label: '产品尺寸-高', name: 'productHeight' },
    { label: '计量方式', name: 'countStyle' },
    { label: '计量单位', name: 'countUnit' },
    { label: '保质日期', name: 'productBbf' },
    { label: '箱规管理', name: 'boxFormat' },
    { label: '是否批次管理', name: 'isBatch' },
    { label: '批属性值', name: 'batchAttrValue' },
    { label: '质检报告', name: 'qualityReport' },
    { label: '适合人群', name: 'availPerson' },
    { label: '亮点&产品介绍', name: 'prodDesc' },
    { label: '搜索标签', name: 'searchTag' },
    { label: '营养成分表', name: 'nutrients' }
])
// 查询商户列表
const merchantNameList = ref([])
const getSupplierList = async () => {
    const parm = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            currPage: 1,
            pageSize: 100
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(parm)
    merchantNameList.value = res.list
}
// 城市接口请求
const provincesList = ref([])
const getCities = async (ql, code) => {
    const params = {
        body: {
            ql: ql,
            code: code,
            appKey: 'A1001001',
            busiCode: 'A1001004'
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台'
    }
    const res = await skuMap(params)
    return res
}
// 城市范围联动
const limitedRegionList = ref([])
const goodsCannotSkuArea = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await getCities(level + 1, data.value || '')
        const nodes = res.addressList.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
const numberChange = (item, type) => {
    if (!dataState.spuFormData.costPrice || !dataState.spuFormData.purchasePrice) {
        dataState.spuFormData.grossRate = 0
        return
    }
    dataState.spuFormData.grossRate = Number(((dataState.spuFormData.costPrice - dataState.spuFormData.purchasePrice) / dataState.spuFormData.purchasePrice * 100).toFixed(2))
}
const addressRef = ref(null)
// const cateNameTextList = ref([])
const spuDetail = ref({})

// 查询SPU详情
const getSpuDetail = async () => {
    const params = {
        spuId: props.spuId
    }
    const res = await publicRequest({ key: 'CONTAINER_PRODUCT_DETAIL', body: params })
    spuDetail.value = res
    await initData(res)
}
// 初始化SPU详情
const initData = async (res) => {
    dataState.spuFormData = res.data
    dataState.spuFormData1 = res.data
    dataState.spuFormData3 = res.data
    dataState.spuFormData1.saleChannel = res.saleChannel ? res.saleChannel.split(',') : []
    if (res.shipper1) {
        const shipper1 = JSON.parse(res.shipper1)
        dataState.spuFormDataAddr.shipper1 = shipper1
        dataState.initAddrData.shipper1 = [shipper1.provinceCode, shipper1.cityCode, shipper1.countyCode]
    }
    if (res.shipper2) {
        const shipper2 = JSON.parse(res.shipper2)
        dataState.spuFormDataAddr.shipper2 = shipper2
        dataState.initAddrData.shipper2 = [shipper2.provinceCode, shipper2.cityCode, shipper2.countyCode]
    }
    if (res.shipper3) {
        const shipper3 = JSON.parse(res.shipper3)
        dataState.spuFormDataAddr.shipper3 = shipper3
        dataState.initAddrData.shipper3 = [shipper3.provinceCode, shipper3.cityCode, shipper3.countyCode]
    }
    if (res.shipper4) {
        const shipper4 = JSON.parse(res.shipper4)
        dataState.spuFormDataAddr.shipper4 = shipper4
        dataState.initAddrData.shipper4 = [shipper4.provinceCode, shipper4.cityCode, shipper4.countyCode]
    }
    if (res.shipper5) {
        const shipper5 = JSON.parse(res.shipper5)
        dataState.spuFormDataAddr.shipper5 = shipper5
        dataState.initAddrData.shipper5 = [shipper5.provinceCode, shipper5.cityCode, shipper5.countyCode]
    }
}

// 回退
const goBack = () => {
    router.go(-1)
}
</script>

<style lang="scss" scoped>
.spu-edit-box{
    margin: 30px;
    .box-title{
        font-size:20px;
        font-weight:700;
        margin: 20px 0;
        .el-upload{
            margin-left: 20px;
        }
        .cate-Name:before{
            content: "*";
            color: var(--el-color-danger);
            margin-right: 4px;
        }
    }
    .address-input-box{
        display: inline-block;
        .address-detail{
            margin-left: 10px;
            :deep(.el-input__inner){
                width: 300px;
            }
        }
    }
    .export-title{
        position: relative;
        .export-btns{
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    .box-title-sm{
        font-size:14px;
        font-weight:600;
        margin-bottom: 20px;
        margin-left: 20px;
        color: #333;
    }
    .form-action-item-50w{
        :deep(.el-input){
            width: auto;
        }
    }
    .sel-cate-name{
        margin: 20px 0;
    }
    .header-title{
        font-size:20px;
        color:red;
        height:50px;
        font-weight:700;
        align-items:center
    }
}
.last-text{
    display: inline-block;
    margin-left: 18px;
}
h1{
    font-weight: 800;
    font-size: 30px;
    margin-bottom: 50px;
}
.btn{
    margin-top: 10px;
    display: flex;
    .btn-add-box{
        margin-left: 30px;
    }
    .btn-edit-box{
        margin-left: 30px;
    }
}

</style>
