<template>
    <freezer v-if="props.spuTemplate==='freezer'"></freezer>
    <div class='spu-edit-box' v-else>
        <pdf></pdf>
        <el-col :span="16">
            <div class='box-title'>请选择基础类目</div>
            <el-row :gutter="20">
                <el-col :span="5" class="cate-Name">
                    <el-select v-model="selectData.firstCateName" class="m-2" placeholder="请选择一级类目" @change='changeFirst' :disabled="props.type === 'publicGoodsDetail' ? true : false">
                        <el-option v-for="item in firstCateNameList" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.secondCateName" class="m-2" placeholder="请选择二级类目" @change="changeSeccond" :disabled="props.type === 'publicGoodsDetail' ? true : false">
                        <el-option v-for="item in secondCateNameList" :key="item.code" :label="item.name" :value="item.code"/>
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.thirdCateName" class="m-2" placeholder="请选择三级类目" @change="changeThird" :disabled="props.type === 'publicGoodsDetail' ? true : false">
                        <el-option v-for="item in thirdCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
                <el-col :span="5">
                    <el-select v-model="selectData.fourCateName" class="m-2" placeholder="请选择四级类目" @change="changeFour" :disabled="props.type === 'publicGoodsDetail' ? true : false">
                        <el-option v-for="item in fourCateNameList" :key="item.name" :label="item.name" :value="item.code" />
                    </el-select>
                </el-col>
                <!--<el-col :span="4">
                    <el-button text type="primary" @click="addCateName">确定</el-button>
                </el-col>-->
            </el-row>
            <!--<div class="sel-cate-name">已选择的基础类目：</div>
            <el-row :gutter="20" v-for="item in cateNameTextList" :key="item">
                <el-col :span="10">
                    <div>{{item.firstCateName}}/{{item.secondCateName}}/{{item.thirdCateName}}/{{item.fourthCateName}}</div>
                </el-col>
                <el-col :span="6">
                    <el-button text type="primary" @click="detali(index)">删除</el-button>
                </el-col>
            </el-row>-->
        </el-col>
        <div v-if="props.type !== 'publicGoodsDetail'">
            <div class='box-title'>供应商、发货地址信息</div>
            <!-- 供应商 -->
            <div>
                <el-form
                    label-width="100px"
                    ref="supplierForm"
                    :model="spuFormData"
                    :inline="true">
                    <el-form-item style="width: 32%;" v-for="item in inputList" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name" :rules="{ required: !!spuFormData1.saleChannel.includes('电商'), message: item.label + '不能为空', trigger: ['blur', 'change']}">
                        <!-- 文本输入 -->
                        <div v-if="item.type === 'input'">
                            <el-input v-model='spuFormData[item.name]' :placeholder="item.placeholder || ''"/>
                        </div>
                        <!-- 选择框 -->
                        <div v-if="item.type === 'select'">
                            <el-select v-model="spuFormData[item.name]" clearable :placeholder="item.placeholder || ''">
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <!-- 数字 -->
                        <div v-if="item.type === 'number'">
                            <el-input-number v-model="spuFormData[item.name]" @change="numberChange(item, 'spuFormData')" :precision="item.precision" :step="item.step" :max="9999" :min="0" /><p class="last-text">{{ item.lastText || '' }}</p>
                        </div>
                        <!-- 单选 -->
                        <div v-if="item.type === 'radio'">
                            <el-radio-group v-model="spuFormData[item.name]" >
                                <el-radio v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text">{{ el.text }}</el-radio>
                            </el-radio-group>
                        </div>
                        <!-- 自定义 供应商 -->
                        <div v-if="item.type === 'custom'">
                            <el-select v-model="spuFormData[item.name]" value-key="busiMerchantId" clearable placeholder="请选择">
                                <el-option v-for="el in merchantNameList" :label="el.merchantName" :value="el" :key="el.busiMerchantId" />
                            </el-select>
                        </div>
                        <!-- 自定义 毛利率 -->
                        <div v-if="item.type === 'rate'">
                            <el-input-number v-model="spuFormData[item.name]" disabled :precision="item.precision" /><p class="last-text">{{ item.lastText || '' }}</p>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-form
                    label-width="100px"
                    :model="spuFormDataAddr"
                    ref="addrForm"
                    :inline="true">
                    <el-form-item style="width: 100%;" v-for="item in inputListAddr" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name+'.provinceCode'" :rules="{ required: false, message: item.label + '不能为空', trigger: ['blur', 'change']}">
                        <!-- 省,市,区,详细地址 -->
                        <div v-if="item.type === 'address'">
                            <div class="address-input-box">
                                <el-cascader
                                    ref="addressRef"
                                    :props="goodsCannotSkuArea"
                                    @change="spuAddrChange(item)"
                                    v-model="initAddrData[item.name]"
                                    class="form-action-item-50w"/>
                            </div>
                            <div class="address-input-box">
                                <el-input class="address-detail" v-model='spuFormDataAddr[item.name].addr' :placeholder="item.placeholder || ''"/>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div>
            <div class='box-title'>填写标品属性
                <!-- <el-button type="primary" @click="exportData()"> 导出属性模型 </el-button> -->
                <!-- <el-upload
                    :http-request="fileRequest"
                    :on-change="handleChange"
                    :file-list="fileList"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    :limit="1"
                    show-file-list
                    class="el-upload"
                >
                    <el-button v-if="props.type !== 'publicGoodsDetail'" type="primary" > 导入SPU </el-button>
                    <span style="font-size: 14px;margin-left: 5px; color: green;">{{fileName}}</span>
                </el-upload> -->
            </div>
            <!-- 第一部分：公共重要的 -->
            <div>
                <div class='box-title-sm'>标品重要属性</div>
                <el-form
                    label-width="120px"
                    :model="spuFormData1"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item v-for="item in inputList1" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <!-- 选择框 -->
                        <div v-if="item.type === 'select'">
                            <el-select v-model="spuFormData1[item.name]" clearable :placeholder="item.placeholder || ''">
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'radio'">
                            <el-radio-group v-model="spuFormData1[item.name]" >
                                <el-radio v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text">{{ el.text }}</el-radio>
                            </el-radio-group>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'checkbox'">
                            <el-checkbox-group v-model="spuFormData1[item.name]" >
                                <el-checkbox v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text" :rules="{ required: el.required, message: el.label + '不能为空' }">{{ el.text }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 文本输入 -->
                        <div v-else>
                            <el-input v-model="spuFormData1[item.name]" :placeholder="item.placeholder || ''"/>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 第二部分：扩展重要的 -->
            <div>
                <div class='box-title-sm'>通用&专用属性</div>
                <el-form
                    v-if="props.spuTemplate === 'fast_food'"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    label-width="100px"
                    :model="spuFormData21"
                    :inline="true">
                    <el-form-item v-for="item in inputList21" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <el-input v-model='spuFormData21[item.name]' :placeholder="item.placeholder || ''"/>
                    </el-form-item>
                </el-form>
                <el-form
                    v-if="props.spuTemplate === 'pastry'"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    label-width="100px"
                    :model="spuFormData22"
                    :inline="true">
                    <el-form-item v-for="item in inputList22" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <el-input v-model='spuFormData22[item.name]' :placeholder="item.placeholder || ''"/>
                    </el-form-item>
                </el-form>
                <el-form
                    v-if="props.spuTemplate === 'cooked_food'"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    label-width="100px"
                    :model="spuFormData23"
                    :inline="true">
                    <el-form-item v-for="item in inputList23" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <el-input v-model='spuFormData23[item.name]' :placeholder="item.placeholder || ''"/>
                    </el-form-item>
                </el-form>
                <el-form
                    v-if="props.spuTemplate === 'sauces'"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    label-width="100px"
                    :model="spuFormData24"
                    :inline="true">
                    <el-form-item v-for="item in inputList24" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <el-input v-model='spuFormData24[item.name]' :placeholder="item.placeholder || ''"/>
                    </el-form-item>
                </el-form>
                <el-form
                    v-if="newTempFormData"
                    :disabled="props.type === 'publicGoodsDetail' ? true : false"
                    label-width="100px"
                    :model="newTempFormData.tempFormData"
                    :inline="true">
                    <el-form-item v-for="item in newTempFormData.extendImportant" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <div v-if="item.type === 'radio'">
                            <el-radio-group v-model="newTempFormData.tempFormData[item.name]" >
                                <el-radio v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text">{{ el.text }}</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-if="item.type === 'select'">
                            <el-select v-model="newTempFormData.tempFormData[item.name]" clearable :placeholder="item.placeholder || ''">
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <el-input v-if="item.type === 'input'" v-model='newTempFormData.tempFormData[item.name]' :readonly="item.readonly?'':false" :placeholder="item.placeholder || ''" />
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
                            <el-select v-model="spuFormData3[item.name]" clearable :placeholder="item.placeholder || ''">
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <div v-else>
                            <el-input v-model='spuFormData3[item.name]' :placeholder="item.placeholder || ''"/>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="btn">
            <el-button @click="goBack">关闭</el-button>
            <div class="btn-add-box" v-show="type ==='edit'||type ==='add'">
                <el-button v-if="props.spuTemplate === 'fast_food'" @click="submitSpu1()" type="primary">保存</el-button>
                <el-button v-if="props.spuTemplate === 'pastry'" @click="submitSpu2()" type="primary">保存</el-button>
                <el-button v-if="props.spuTemplate === 'cooked_food'" @click="submitSpu3()" type="primary">保存</el-button>
                <el-button v-if="props.spuTemplate === 'sauces'" @click="submitSpu4()" type="primary">保存</el-button>
                <el-button v-if="newTempFormData" @click="submitTempFormDate()" type="primary">保存</el-button>
            </div>
        </div>
        <el-dialog v-model="dialogVisible" title="导入失败文件下载：" >
            <div>
                <system-list  :tHead="tHead"
                              :tableData="tableData"
                >
                    <template #operation="row">
                        <el-button  class="text-btn db" @click="exports(row.row.url)" type="primary" text>下载</el-button>

                    </template>
                </system-list>
            </div>
        </el-dialog>
    </div>

</template>

<script setup>
import { ref, computed, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import SystemList from '@/composables/TablePagination/table.vue'
import { queryCategory, yingyongQueryCategory } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantList, getupdate, skuMap, getAllMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import freezer from './spuTemplate/freezer.vue'

import pdf from './pdf.vue'
import dairy from './temp/dairy.js'
import water from './temp/water.js'
import drink from './temp/drink.js'
import coffee from './temp/coffee.js'
import nursing from './temp/nursing.js'
import puffedFood from './temp/puffed_food.js'
import seafood from './temp/seafood.js'
import meat from './temp/meat.js'
import fruitsVeg from './temp/fruits_veg.js'
import { fa } from 'element-plus/es/locale'
import { async } from 'q'
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

const tHead = [
    { align: 'center', tooltip: true, prop: 'fileName', label: '文件名', minWidth: 300 },
    { align: 'center', tooltip: true, prop: 'operateTime', label: '导入失败时间', minWidth: 140 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }
]
const tableData = ref([])
const dialogVisible = ref(false)
const getNewTempType = (type) => {
    switch (type) {
    case 'dairy':
        return reactive(dairy)
    case 'water':
        return reactive(water)
    case 'drink':
        return reactive(drink)
    case 'coffee':
        return reactive(coffee)
    case 'nursing':
        return reactive(nursing)
    case 'puffed_food':
        return reactive(puffedFood)
    case 'seafood':
        return reactive(seafood)
    case 'meat':
        return reactive(meat)
    case 'fruits_veg':
        return reactive(fruitsVeg)
    default:
        return false
    }
}

const newTempFormData = getNewTempType(props.spuTemplate)
if (newTempFormData) {
    formParams.value = JSON.parse(JSON.stringify(newTempFormData.tempFormData))
}
// 清空数据
const resetFormParams = () => {
    newTempFormData && (newTempFormData.tempFormData = formParams.value)
    fileName.value = ''
}
router.beforeEach((to, from, next) => {
    if (to.name === 'spu-management-list') {
        resetFormParams()
    }
    next()
})
const fileList = ref([])
onMounted(async () => {
    await getfirstCateNameList()
    await getSupplierList()
    if (props.type === 'edit' || props.type === 'publicGoodsDetail') {
        await getSpuDetail()
    }
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
        isSmallSpec: '',
        isFreezeStored: ''

    },
    spuFormData21: {
        brandCode: '',
        productOfficialName: '',
        productFormat: '',
        netWeight: '',
        packageSpec: '',
        packageStyle: '',
        solidRatio: '',
        peopleEatNum: '',
        sterilizeStyle: '',
        packageNum: '',
        spicy: '',
        isMuslim: '',
        isMaterial: '',
        foodType: '',
        isSelfHeat: '',
        isBrewed: '',
        isChop: '',
        isMicro: '',
        powderBag: '',
        sauceBag: '',
        oilBag: '',
        vegBag: '',
        seasonBag: '',
        primer: '',
        riceBag: '',
        pureWater: '',
        meatBag: ''
    },
    spuFormData22: {
        brandCode: '',
        productOfficialName: '',
        productFormat: '',
        netWeight: '',
        productTaste: '',
        quantityPerBag: '',
        singleWeight: '',
        peopleEatNum: '',
        facetMedia: '',
        wheatType: '',
        noodleType: '',
        creamType: '',
        cakeSize: '',
        flourType: '',
        pastryType: '',
        stuff: '',
        stuffRatio: '',
        productIngredient: '',
        processStyle: '',
        sterilizeStyle: ''
    },
    spuFormData23: {
        brandCode: '',
        productOfficialName: '',
        productFormat: '',
        netWeight: '',
        packageSpec: '',
        packageStyle: '',
        meatRatio: '',
        bodyPart: '',
        processFormat: '',
        processStyle: '',
        foodClass: '',
        foodCraft: '',
        sterilizeCraft: '',
        processCraft: '',
        tasteStyle: '',
        productTaste: '',
        isThereis: '',
        isMuslim: '',
        stewedVegVari: '',
        haloStyle: '',
        specialtyArea: '',
        leanRatio: '',
        fatRatio: ''
    },
    spuFormData24: {
        brandCode: '',
        productFormat: '',
        netWeight: '',
        prodUsage: '',
        fatRatio: '',
        isGenetically: '',
        phytosterolRatio: '',
        isFirstPressed: '',
        processCraft: '',
        freshButterRatio: '',
        alcoholRatio: '',
        sesameRatio: '',
        peanutRatio: '',
        isSmallBag: '',
        seasonForm: '',
        suitableDosage: '',
        pearPulpRatio: '',
        solidRatio: '',
        lodinedAdded: ''
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
        entrustedPartyPhone: '',
        unrealBarcode: '',
        ksid: ''
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
const { spuFormData, initAddrData, spuFormDataAddr, spuFormData1, spuFormData21, spuFormData22, spuFormData23, spuFormData24, spuFormData3, chaildFormData, selectData, firstCateNameList, secondCateNameList, thirdCateNameList, fourCateNameList, goodsTypeList } = toRefs(dataState)
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

// 地址信息5项
const inputListAddr = reactive([
    {
        label: '收货地址1',
        name: 'shipper1',
        type: 'address',
        placeholder: '请输入详细地址'
    },
    { label: '收货地址2', name: 'shipper2', type: 'address', value: dataState.spuFormDataAddr.shipper2, placeholder: '请输入详细地址' },
    { label: '收货地址3', name: 'shipper3', type: 'address', value: dataState.spuFormDataAddr.shipper3, placeholder: '请输入详细地址' },
    { label: '收货地址4', name: 'shipper4', type: 'address', value: dataState.spuFormDataAddr.shipper4, placeholder: '请输入详细地址' },
    { label: '收货地址5', name: 'shipper5', type: 'address', value: dataState.spuFormDataAddr.shipper5, placeholder: '请输入详细地址' }
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
            { value: '电商', text: '电商' },
            { value: 'B2B商城', text: '进货商城' }
        ]
    },
    {
        label: '是否可冷冻储存',
        name: 'isFreezeStored',
        type: 'radio',
        required: false,
        menu: [
            { value: 0, text: '否' },
            { value: 1, text: '是' }
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
    { label: '营养成分表', name: 'nutrients' },
    { label: '致敏原信息', name: 'allergenInfo' },
    { label: '食用方法', name: 'eatStyle' },
    { label: '食用建议', name: 'eatSug' },
    { label: '注意事项', name: 'attention' },
    { label: '仓库允收期', name: 'whseAcceptFactor', type: 'input' },
    { label: '仓库允发期', name: 'whseDeliveryFactor', type: 'input' },
    { label: '商品可售期', name: 'saleablePeriod', type: 'input' },
    { label: '运输单位', name: 'transUnit', type: 'input' },
    { label: '库存单位', name: 'inventoryUnit', type: 'input' },
    { label: '默认采购规格', name: 'defaultPurchaseSpec', type: 'input' },
    { label: '采购单位', name: 'purchaseUnit', type: 'input' },
    { label: '默认配货规格', name: 'defaultDistributionSpec', type: 'input' },
    { label: '配货单位', name: 'distributionUnit', type: 'input' },
    { label: '默认零售规格', name: 'defaultRetailSpec', type: 'input' },
    { label: '零售单位', name: 'retailUnit', type: 'input' },
    { label: '默认批发规格', name: 'defaultWholesaleSpec', type: 'input' },
    { label: '批发单位', name: 'wholesaleUnit', type: 'input' },
    { label: '旷视KS_ID', name: 'ksid', type: 'input' },
    { label: '迁移前69码', name: 'unrealBarcode', type: 'input' }
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
// 商家选择
// const supplierNameChange = (item, type) => {
//     console.log(item)
//     console.log(item.input)
//     console.log(dataState[type][item.name])
// }
const numberChange = (item, type) => {
    if (!dataState.spuFormData.costPrice || !dataState.spuFormData.purchasePrice) {
        dataState.spuFormData.grossRate = 0
        return
    }
    dataState.spuFormData.grossRate = Number(((dataState.spuFormData.costPrice - dataState.spuFormData.purchasePrice) / dataState.spuFormData.purchasePrice * 100).toFixed(2))
}
const addressRef = ref(null)
// 选择城市值变化
const spuAddrChange = (item) => {
    let num = 0
    if (item.name === 'shipper1') num = 0
    if (item.name === 'shipper2') num = 1
    if (item.name === 'shipper3') num = 2
    if (item.name === 'shipper4') num = 3
    if (item.name === 'shipper5') num = 4
    limitedRegionList.value = []
    dataState.goodsTypeList = addressRef.value[num].getCheckedNodes(true)
    dataState.goodsTypeList.forEach((item) => {
        limitedRegionList.value.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]

        })
    })
    dataState.spuFormDataAddr[item.name] = limitedRegionList.value[0]
}
// 详细地址输入
const spuAddressChange = (item, type) => {
    dataState[type][item.name].addr = item.value.addr
}
// 按基础类目层级查询类目
const selectFirst = ref({})
const selectSecond = ref({})
const selectThird = ref({})
const selectFour = ref({})
// const cateNameTextList = ref([])
const spuDetail = ref({})
// 获取基础类目，1,2,3,
const getfirstCateNameList = async () => {
    const res = await queryCategory(1)
    dataState.firstCateNameList = res
}
const changeFirst = async (val) => {
    const res = await queryCategory(2, val)
    selectFirst.value = dataState.firstCateNameList.find(item => item.code === val)
    dataState.secondCateNameList = res
    dataState.thirdCateNameList = []
    dataState.fourCateNameList = []
    dataState.selectData.secondCateName = ''
    dataState.selectData.thirdCateName = ''
    dataState.selectData.fourCateName = ''
}
const changeSeccond = async (val) => {
    selectSecond.value = dataState.secondCateNameList.find(item => item.code === val)
    const res = await queryCategory(3, val)
    dataState.thirdCateNameList = res
    dataState.fourCateNameList = []
    dataState.selectData.thirdCateName = ''
    dataState.selectData.fourCateName = ''
}
const changeThird = async (val) => {
    selectThird.value = dataState.thirdCateNameList.find(item => item.code === val)
    const res = await queryCategory(4, val)
    dataState.fourCateNameList = res
    dataState.selectData.fourCateName = ''
}
const changeFour = async (val) => {
    selectFour.value = dataState.fourCateNameList.find(item => item.code === val)
}

// 确定添加展示文本-基础类目
// const addCateName = async () => {
//     if (cateNameTextList.value.length === 0) {
//         cateNameTextList.value.push({
//             firstCateName: selectFirst.value.name,
//             firstCateCode: selectFirst.value.code,
//             secondCateName: selectSecond.value.name,
//             secondCateCode: selectSecond.value.code,
//             thirdCateName: selectThird.value.name,
//             thirdCateCode: selectThird.value.code,
//             fourthCateName: selectFour.value.name,
//             fourthCateCode: selectFour.value.code
//         })
//     } else {
//         ElMessage.warning('只能选择一条基础类目')
//     }
// }

// 删除-基础类目
// const detali = async (index) => {
//     cateNameTextList.value.splice(index, 1)
// }

// 导入
// const importData = async () => {
//     ElMessage.warning('导入')
// }

// 导出
// const exportData = async () => {
//     ElMessage.warning('导出')
// }
// 查询SPU详情
const getSpuDetail = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: props.spuId
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC16579603902195QEmS',
        name: 'spu详情',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    spuDetail.value = res
    await initData(res)
}
// 初始化SPU详情
const initData = async (res) => {
    dataState.spuFormData = res
    dataState.spuFormData1 = res
    dataState.spuFormData3 = res
    if (props.spuTemplate === 'fast_food') {
        dataState.spuFormData21 = res
    } else if (props.spuTemplate === 'pastry') {
        dataState.spuFormData22 = res
    } else if (props.spuTemplate === 'cooked_food') {
        dataState.spuFormData23 = res
    } else if (props.spuTemplate === 'sauces') {
        dataState.spuFormData24 = res
    } else if (newTempFormData) {
        let key
        for (key in newTempFormData.tempFormData) {
            if (res[key]) {
                newTempFormData.tempFormData[key] = res[key]
            }
        }
    }
    selectFirst.value.name = res.firstCateName
    selectFirst.value.code = res.firstCateCode
    selectSecond.value.name = res.secondCateName
    selectSecond.value.code = res.secondCateCode
    selectThird.value.name = res.thirdCateName
    selectThird.value.code = res.thirdCateCode
    selectFour.value.name = res.fourthCateName
    selectFour.value.code = res.fourthCateCode
    dataState.spuFormData1.saleChannel = res.saleChannel ? res.saleChannel.split(',') : []

    dataState.selectData.firstCateName = res.firstCateName
    dataState.selectData.secondCateName = res.secondCateName
    dataState.selectData.thirdCateName = res.thirdCateName
    dataState.selectData.fourCateName = res.fourthCateName
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
// 提交前数据校验
const dataCheck = () => {
    if (!selectFirst.value.code) {
        ElMessage.error('请选择一级类目！')
        return false
    } else if (!selectSecond.value.code) {
        ElMessage.error('请选择二级类目！')
        return false
    } else if (!selectThird.value.code) {
        ElMessage.error('请选择三级类目！')
        return false
    } else if (!dataState.spuFormData1.saleChannel.length) {
        ElMessage.error('请选择销售渠道！')
        return false
    } else {
        return true
    }
}
// 电商校验
const supplier = async () => {
    return await Promise.all([
        supplierForm.value.validate(),
        addrForm.value.validate()
    ])
}
// 69码校验
const getBracode = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            barcodes: dataState.spuFormData1.barcode ? dataState.spuFormData1.barcode.split(',') : []
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台',
        url: '/search/spu/list/v2',
        // configCode: 'UCJH47739748739575808',
        // name: '创建SPU聚合-校验69码',
        // source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getAllMerchantList(params)
    if (res.code === '200' && res.data.list.length > 0) {
        ElMessageBox.confirm(
            '即将落库的标品69码在标品库中已存在，请检查当前标品信息字段值的正确性，并确认是否继续当前操作！',
            '确认框',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }
        )
            .then(async () => {
                submitSpuData()
            })
    }
}
// 提交
const submitSpuData = async (param) => {
    supplier().then(async () => {
        // const params = {
        //     body: {
        //         appKey: 'A1001000',
        //         busiCode: 'A1001004',
        //         barcodes: dataState.spuFormData1.barcode ? dataState.spuFormData1.barcode.split(',') : []
        //     },
        //     appKey: 'A1001000',
        //     busiCode: 'A1001004',
        //     // configCode: 'UC15115376448741376',
        //     // name: 'spu通用搜索接口V2',
        //     // source: '商品中台',
        //     // url: '/search/spu/list/v2',
        //     modifierId: userInfo.value.account,
        //     operatorId: userInfo.value.account,
        //     operatorName: userInfo.value.name
        // }
        const res = await getAllMerchantList(param, param.body.isCheck = '0')
        if (res.code === '1001') {
            ElMessageBox.confirm(
                res.message,
                '确认框',
                {
                    confirmButtonText: '继续创建',
                    cancelButtonText: '返回'
                }
            )
                .then(async () => {
                    const res = await getMerchantList(param, delete param.body.isCheck)
                    resetFormParams()
                    ElMessage.success('提交成功')
                    router.push({ name: 'spu-management-list' })
                }).catch(() => {
                    ElMessage.error('请完成数据填写！')
                })
        } else if (res.code === '200') {
            ElMessage.success('提交成功')
            router.push({ name: 'spu-management-list' })
            // ElMessageBox.confirm(
            //     '确定要提交吗？',
            //     '确认框',
            //     {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消'
            //     }
            // )
            //     .then(async () => {
            //         const res = await getMerchantList(param, delete param.body.isCheck)
            //         resetFormParams()
            //         ElMessage.success('提交成功')
            //         router.push({ name: 'spu-management-list' })
            //     }).catch(() => {
            //         ElMessage.error('请完成数据填写！')
            //     })
        }
        // if (res.code === '200' && res.data.list.length > 0) {
        //     ElMessageBox.confirm(
        //         '即将落库的标品69码在标品库中已存在，请检查当前标品信息字段值的正确性，并确认是否继续当前操作！',
        //         '确认框',
        //         {
        //             confirmButtonText: '继续创建',
        //             cancelButtonText: '返回'
        //         }
        //     )
        //         .then(async () => {
        //             const res = await getMerchantList(param)
        //             resetFormParams()
        //             ElMessage.success('提交成功')
        //             router.push({ name: 'spu-management-list' })
        //         }).catch(() => {
        //             ElMessage.error('请完成数据填写！')
        //         })
        // } else {
        //     ElMessageBox.confirm(
        //         '确定要提交吗？',
        //         '确认框',
        //         {
        //             confirmButtonText: '确定',
        //             cancelButtonText: '取消'
        //         }
        //     )
        //         .then(async () => {
        //             const res = await getMerchantList(param)
        //             resetFormParams()
        //             ElMessage.success('提交成功')
        //             router.push({ name: 'spu-management-list' })
        //         }).catch(() => {
        //             ElMessage.error('请完成数据填写！')
        //         })
        // }
    })
    //     ElMessageBox.confirm(
    //         '确定要提交吗？',
    //         '确认框',
    //         {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消'
    //         }
    //     )
    //         .then(async () => {

    //             const res = await getMerchantList(param)
    //             resetFormParams()
    //             ElMessage.success('提交成功')
    //             router.push({ name: 'spu-management-list' })
    //         })
    // }).catch(() => {
    //     ElMessage.error('请完成数据填写！')
    // })
}

// 提交数据
const submitTempFormDate = async () => {
    if (!dataCheck()) return
    if (!supplier()) return
    let spuInfo = {
        barcode: dataState.spuFormData1.barcode,
        brandName: dataState.spuFormData1.brandName,
        fourthCateCode: selectFour.value.code,
        fourthCateName: selectFour.value.name,
        grossWeight: dataState.spuFormData1.grossWeight,
        isImport: dataState.spuFormData1.isImport,
        origPlace: dataState.spuFormData1.origPlace,
        productAliasName: '',
        productOfficialName: dataState.spuFormData21.productOfficialName,
        productShelfLife: dataState.spuFormData1.productShelfLife,
        productShelfLifeUnit: dataState.spuFormData1.productShelfLifeUnit,
        productSpec: dataState.spuFormData1.productSpec,
        spuBusiExtend: {
            afterSaleService: dataState.spuFormData.afterSaleService,
            costPrice: dataState.spuFormData.costPrice,
            grossRate: dataState.spuFormData.grossRate,
            minOrderNum: dataState.spuFormData.minOrderNum,
            purchasePrice: dataState.spuFormData.purchasePrice,
            shipper1: dataState.spuFormDataAddr.shipper1,
            shipper2: dataState.spuFormDataAddr.shipper2,
            shipper3: dataState.spuFormDataAddr.shipper3,
            shipper4: dataState.spuFormDataAddr.shipper4,
            shipper5: dataState.spuFormDataAddr.shipper5,
            supplierId: dataState.spuFormData.supplierName?.busiMerchantId || dataState.spuFormData.supplierId,
            supplierName: dataState.spuFormData.supplierName?.merchantName || dataState.spuFormData.supplierName,
            supplierType: dataState.spuFormData.supplierType,
            minOrderUnit: dataState.spuFormData.minOrderUnit,
            orderCycle: dataState.spuFormData.orderCycle
        },
        spuDesc: '',
        spuExtend: {
            allergenInfo: dataState.spuFormData3.allergenInfo,
            barcodeSpec: dataState.spuFormData3.barcodeSpec,
            barcodeUnit: dataState.spuFormData3.barcodeUnit,
            allergenicIngredients: '',
            attention: dataState.spuFormData3.attention,
            availPerson: dataState.spuFormData3.availPerson,
            boxFormat: dataState.spuFormData3.boxFormat,
            cookeSug: '',
            countStyle: dataState.spuFormData3.countStyle,
            countUnit: dataState.spuFormData3.countUnit,
            eatStyle: dataState.spuFormData3.eatStyle,
            eatSug: dataState.spuFormData3.eatSug,
            eatWay: '',
            entrustedParty: dataState.spuFormData3.entrustedParty,
            gtmBestDrink: '',
            guidePrice: dataState.spuFormData1.guidePrice,
            ingredientList: dataState.spuFormData3.ingredientList,
            isCombine: '',
            mainRawMaterials: '',
            manuContact: '',
            manuCreditCode: '',
            manuWeb: '',
            materialGuarant: '',
            netRatio: dataState.spuFormData3.netRatio,
            nutrients: dataState.spuFormData3.nutrients,
            packageSpec: dataState.spuFormData3.packageSpec,
            packageStyle: dataState.spuFormData3.packageStyle,
            packageList: dataState.spuFormData3.packageList,
            manuName: dataState.spuFormData3.manuName,
            manuAddr: dataState.spuFormData3.manuAddr,
            manuPhone: dataState.spuFormData3.manuPhone,
            agent: dataState.spuFormData3.agent,
            agentAddr: dataState.spuFormData3.agentAddr,
            agentPhone: dataState.spuFormData3.agentPhone,
            entrustedPartyAddr: dataState.spuFormData3.entrustedPartyAddr,
            entrustedPartyPhone: dataState.spuFormData3.entrustedPartyPhone,
            packageUnit: dataState.spuFormData1.packageUnit,
            prodDesc: dataState.spuFormData3.prodDesc,
            productBbf: dataState.spuFormData3.productBbf,
            productHeight: dataState.spuFormData3.productHeight,
            productLength: dataState.spuFormData3.productLength,
            productType: '',
            productWidth: dataState.spuFormData3.productWidth,
            qualityReport: dataState.spuFormData3.qualityReport,
            saleChannel: dataState.spuFormData1.saleChannel.join(','),
            suggSellingPrice: dataState.spuFormData1.suggSellingPrice,
            isSmallSpec: dataState.spuFormData1.isSmallSpec,
            isFreezeStored: dataState.spuFormData1.isFreezeStored,
            searchTag: dataState.spuFormData3.searchTag,
            unavailPerson: '',
            usageScene: '',
            isBatch: dataState.spuFormData3.isBatch,
            batchAttrValue: dataState.spuFormData3.batchAttrValue,
            groupAttr: dataState.spuFormData3.groupAttr,
            threeRClassify: dataState.spuFormData3.threeRClassify,
            trademark: dataState.spuFormData3.trademark,
            marketGuidePrice: dataState.spuFormData3.marketGuidePrice,
            isSuit: dataState.spuFormData3.isSuit,
            whseAcceptFactor: dataState.spuFormData3.whseAcceptFactor,
            whseDeliveryFactor: dataState.spuFormData3.whseDeliveryFactor,
            saleablePeriod: dataState.spuFormData3.saleablePeriod,
            transUnit: dataState.spuFormData3.transUnit,
            inventoryUnit: dataState.spuFormData3.inventoryUnit,
            defaultPurchaseSpec: dataState.spuFormData3.defaultPurchaseSpec,
            purchaseUnit: dataState.spuFormData3.purchaseUnit,
            defaultDistributionSpec: dataState.spuFormData3.defaultDistributionSpec,
            distributionUnit: dataState.spuFormData3.distributionUnit,
            defaultRetailSpec: dataState.spuFormData3.defaultRetailSpec,
            retailUnit: dataState.spuFormData3.retailUnit,
            defaultWholesaleSpec: dataState.spuFormData3.defaultWholesaleSpec,
            wholesaleUnit: dataState.spuFormData3.wholesaleUnit,
            ksid: dataState.spuFormData3.ksid,
            unrealBarcode: dataState.spuFormData3.unrealBarcode
        },
        spuName: dataState.spuFormData1.spuName,
        storageCondition: dataState.spuFormData1.storageCondition,
        storageStyle: dataState.spuFormData1.storageStyle,
        thirdCateCode: selectThird.value.code,
        thirdCateName: selectThird.value.name
    }
    spuInfo = Object.assign(newTempFormData.tempFormData, spuInfo)
    console.log(spuInfo, dataState.spuFormData1.barcode, 'dataState.spuFormData1.barcode')
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'

    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (props.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码'
    } else if (props.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = props.spuId
    }
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    // if (props.type === 'add') {
    //     configCode = 'UC16576929736366efU4'
    //     name = 'SPU新增'
    // } else if (props.type === 'edit') {
    //     configCode = 'UC1657692988594r5Xac'
    //     name = 'spu更新'
    //     spuInfo.spuId = props.spuId
    // }
    spuInfo = JSON.stringify(spuInfo)
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuTemplate: props.spuTemplate,
            spuInfo: spuInfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: configCode,
        name: name,
        // source: '商品中台',
        source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.type === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (props.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = props.spuId
    }
    submitSpuData(param)
}

// 提交数据(方便速食)
const submitSpu1 = async () => {
    if (!dataCheck()) return
    let spuInfo = {
        barcode: dataState.spuFormData1.barcode,
        brandCode: dataState.spuFormData21.brandCode,
        brandName: dataState.spuFormData1.brandName,
        foodType: dataState.spuFormData21.foodType,
        fourthCateCode: selectFour.value.code,
        fourthCateName: selectFour.value.name,
        grossWeight: dataState.spuFormData1.grossWeight,
        isBrewed: dataState.spuFormData21.isBrewed,
        isChop: dataState.spuFormData21.isChop,
        isImport: dataState.spuFormData1.isImport,
        isMaterial: dataState.spuFormData21.isMaterial,
        isMicro: dataState.spuFormData21.isMicro,
        isMuslim: dataState.spuFormData21.isMuslim,
        isSelfHeat: dataState.spuFormData21.isSelfHeat,
        meatBag: dataState.spuFormData21.meatBag,
        netWeight: dataState.spuFormData21.netWeight,
        oilBag: dataState.spuFormData21.oilBag,
        origPlace: dataState.spuFormData1.origPlace,
        packageNum: dataState.spuFormData21.packageNum,
        peopleEatNum: dataState.spuFormData21.peopleEatNum,
        powderBag: dataState.spuFormData21.powderBag,
        primer: dataState.spuFormData21.primer,
        productAliasName: '',
        productFormat: dataState.spuFormData21.productFormat,
        productOfficialName: dataState.spuFormData21.productOfficialName,
        productShelfLife: dataState.spuFormData1.productShelfLife,
        productShelfLifeUnit: dataState.spuFormData1.productShelfLifeUnit,
        productSpec: dataState.spuFormData1.productSpec,
        pureWater: dataState.spuFormData21.pureWater,
        riceBag: dataState.spuFormData21.riceBag,
        sauceBag: dataState.spuFormData21.sauceBag,
        seasonBag: dataState.spuFormData21.seasonBag,
        solidRatio: dataState.spuFormData21.solidRatio,
        spicy: dataState.spuFormData21.spicy,
        spuBusiExtend: {
            afterSaleService: dataState.spuFormData.afterSaleService,
            costPrice: dataState.spuFormData.costPrice,
            grossRate: dataState.spuFormData.grossRate,
            minOrderNum: dataState.spuFormData.minOrderNum,
            purchasePrice: dataState.spuFormData.purchasePrice,
            shipper1: dataState.spuFormDataAddr.shipper1,
            shipper2: dataState.spuFormDataAddr.shipper2,
            shipper3: dataState.spuFormDataAddr.shipper3,
            shipper4: dataState.spuFormDataAddr.shipper4,
            shipper5: dataState.spuFormDataAddr.shipper5,
            supplierId: dataState.spuFormData.supplierName?.busiMerchantId || dataState.spuFormData.supplierId,
            supplierName: dataState.spuFormData.supplierName?.merchantName || dataState.spuFormData.supplierName,
            supplierType: dataState.spuFormData.supplierType,
            minOrderUnit: dataState.spuFormData.minOrderUnit,
            orderCycle: dataState.spuFormData.orderCycle
        },
        spuDesc: '',
        spuExtend: {
            allergenInfo: dataState.spuFormData3.allergenInfo,
            barcodeSpec: dataState.spuFormData3.barcodeSpec,
            barcodeUnit: dataState.spuFormData3.barcodeUnit,
            allergenicIngredients: '',
            attention: dataState.spuFormData3.attention,
            availPerson: dataState.spuFormData3.availPerson,
            boxFormat: dataState.spuFormData3.boxFormat,
            cookeSug: '',
            countStyle: dataState.spuFormData3.countStyle,
            countUnit: dataState.spuFormData3.countUnit,
            eatStyle: dataState.spuFormData3.eatStyle,
            eatSug: dataState.spuFormData3.eatSug,
            eatWay: '',
            entrustedParty: dataState.spuFormData3.entrustedParty,
            gtmBestDrink: '',
            guidePrice: dataState.spuFormData1.guidePrice,
            ingredientList: dataState.spuFormData3.ingredientList,
            isCombine: '',
            mainRawMaterials: '',
            manuContact: '',
            manuCreditCode: '',
            manuWeb: '',
            materialGuarant: '',
            netRatio: dataState.spuFormData3.netRatio,
            nutrients: dataState.spuFormData3.nutrients,
            packageSpec: dataState.spuFormData3.packageSpec,
            packageStyle: dataState.spuFormData3.packageStyle,
            packageList: dataState.spuFormData3.packageList,
            manuName: dataState.spuFormData3.manuName,
            manuAddr: dataState.spuFormData3.manuAddr,
            manuPhone: dataState.spuFormData3.manuPhone,
            agent: dataState.spuFormData3.agent,
            agentAddr: dataState.spuFormData3.agentAddr,
            agentPhone: dataState.spuFormData3.agentPhone,
            entrustedPartyAddr: dataState.spuFormData3.entrustedPartyAddr,
            entrustedPartyPhone: dataState.spuFormData3.entrustedPartyPhone,
            packageUnit: dataState.spuFormData1.packageUnit,
            prodDesc: dataState.spuFormData3.prodDesc,
            productBbf: dataState.spuFormData3.productBbf,
            productHeight: dataState.spuFormData3.productHeight,
            productLength: dataState.spuFormData3.productLength,
            productType: '',
            productWidth: dataState.spuFormData3.productWidth,
            qualityReport: dataState.spuFormData3.qualityReport,
            saleChannel: dataState.spuFormData1.saleChannel.join(','),
            suggSellingPrice: dataState.spuFormData1.suggSellingPrice,
            isSmallSpec: dataState.spuFormData1.isSmallSpec,
            isFreezeStored: dataState.spuFormData1.isFreezeStored,
            searchTag: dataState.spuFormData3.searchTag,
            unavailPerson: '',
            usageScene: '',
            isBatch: dataState.spuFormData3.isBatch,
            batchAttrValue: dataState.spuFormData3.batchAttrValue,
            groupAttr: dataState.spuFormData3.groupAttr,
            threeRClassify: dataState.spuFormData3.threeRClassify,
            trademark: dataState.spuFormData3.trademark,
            marketGuidePrice: dataState.spuFormData3.marketGuidePrice,
            isSuit: dataState.spuFormData3.isSuit,
            whseAcceptFactor: dataState.spuFormData3.whseAcceptFactor,
            whseDeliveryFactor: dataState.spuFormData3.whseDeliveryFactor,
            saleablePeriod: dataState.spuFormData3.saleablePeriod,
            transUnit: dataState.spuFormData3.transUnit,
            inventoryUnit: dataState.spuFormData3.inventoryUnit,
            defaultPurchaseSpec: dataState.spuFormData3.defaultPurchaseSpec,
            purchaseUnit: dataState.spuFormData3.purchaseUnit,
            defaultDistributionSpec: dataState.spuFormData3.defaultDistributionSpec,
            distributionUnit: dataState.spuFormData3.distributionUnit,
            defaultRetailSpec: dataState.spuFormData3.defaultRetailSpec,
            retailUnit: dataState.spuFormData3.retailUnit,
            defaultWholesaleSpec: dataState.spuFormData3.defaultWholesaleSpec,
            wholesaleUnit: dataState.spuFormData3.wholesaleUnit,
            ksid: dataState.spuFormData3.ksid,
            unrealBarcode: dataState.spuFormData3.unrealBarcode
        },
        spuName: dataState.spuFormData1.spuName,
        sterilizeStyle: dataState.spuFormData21.sterilizeStyle,
        storageCondition: dataState.spuFormData1.storageCondition,
        storageStyle: dataState.spuFormData1.storageStyle,
        thirdCateCode: selectThird.value.code,
        thirdCateName: selectThird.value.name,
        vegBag: dataState.spuFormData21.vegBag
    }
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    // if (props.type === 'add') {
    //     configCode = 'UC16576929736366efU4'
    //     name = 'SPU新增'
    // } else if (props.type === 'edit') {
    //     configCode = 'UC1657692988594r5Xac'
    //     name = 'spu更新'
    //     spuInfo.spuId = props.spuId
    // }
    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (props.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码'
    } else if (props.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = props.spuId
    }
    spuInfo = JSON.stringify(spuInfo)
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuTemplate: props.spuTemplate,
            spuInfo: spuInfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: configCode,
        name: name,
        source: '运营后台',
        // source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.type === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (props.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = props.spuId
    }
    submitSpuData(param)
}
// 提交数据(主食面点)
const submitSpu2 = async () => {
    if (!dataCheck()) return

    let spuInfo = {
        barcode: dataState.spuFormData1.barcode,
        brandCode: dataState.spuFormData22.brandCode,
        brandName: dataState.spuFormData1.brandName,
        cakeSize: dataState.spuFormData22.cakeSize,
        creamType: dataState.spuFormData22.creamType,
        facetMedia: dataState.spuFormData22.facetMedia,
        flourType: dataState.spuFormData22.flourType,
        fourthCateCode: selectFour.value.code,
        fourthCateName: selectFour.value.name,
        grossWeight: dataState.spuFormData1.grossWeight,
        isImport: dataState.spuFormData1.isImport,
        netWeight: dataState.spuFormData22.netWeight,
        noodleType: dataState.spuFormData22.noodleType,
        origPlace: dataState.spuFormData1.origPlace,
        pastryType: dataState.spuFormData22.pastryType,
        peopleEatNum: dataState.spuFormData22.peopleEatNum,
        processStyle: dataState.spuFormData22.processStyle,
        productAliasName: '',
        productFormat: dataState.spuFormData22.productFormat,
        productIngredient: dataState.spuFormData22.productIngredient,
        productOfficialName: dataState.spuFormData22.productOfficialName,
        productShelfLife: dataState.spuFormData1.productShelfLife,
        productShelfLifeUnit: dataState.spuFormData1.productShelfLifeUnit,
        productSpec: dataState.spuFormData1.productSpec,
        productTaste: dataState.spuFormData22.productTaste,
        quantityPerBag: dataState.spuFormData22.quantityPerBag,
        singleWeight: dataState.spuFormData22.singleWeight,
        spuBusiExtend: {
            afterSaleService: dataState.spuFormData.afterSaleService,
            costPrice: dataState.spuFormData.costPrice,
            grossRate: dataState.spuFormData.grossRate,
            minOrderNum: dataState.spuFormData.minOrderNum,
            purchasePrice: dataState.spuFormData.purchasePrice,
            shipper1: dataState.spuFormDataAddr.shipper1,
            shipper2: dataState.spuFormDataAddr.shipper2,
            shipper3: dataState.spuFormDataAddr.shipper3,
            shipper4: dataState.spuFormDataAddr.shipper4,
            shipper5: dataState.spuFormDataAddr.shipper5,
            supplierId: dataState.spuFormData.supplierName?.busiMerchantId || dataState.spuFormData.supplierId,
            supplierName: dataState.spuFormData.supplierName?.merchantName || dataState.spuFormData.supplierName,
            supplierType: dataState.spuFormData.supplierType,
            minOrderUnit: dataState.spuFormData.minOrderUnit,
            orderCycle: dataState.spuFormData.orderCycle
        },
        spuDesc: '',
        spuExtend: {
            allergenInfo: dataState.spuFormData3.allergenInfo,
            barcodeSpec: dataState.spuFormData3.barcodeSpec,
            barcodeUnit: dataState.spuFormData3.barcodeUnit,
            allergenicIngredients: '',
            attention: dataState.spuFormData3.attention,
            availPerson: dataState.spuFormData3.availPerson,
            boxFormat: dataState.spuFormData3.boxFormat,
            cookeSug: '',
            countStyle: dataState.spuFormData3.countStyle,
            countUnit: dataState.spuFormData3.countUnit,
            eatStyle: dataState.spuFormData3.eatStyle,
            eatSug: dataState.spuFormData3.eatSug,
            eatWay: '',
            entrustedParty: dataState.spuFormData3.entrustedParty,
            gtmBestDrink: '',
            guidePrice: dataState.spuFormData1.guidePrice,
            ingredientList: dataState.spuFormData3.ingredientList,
            isCombine: '1',
            mainRawMaterials: '',
            manuContact: '',
            manuCreditCode: '',
            manuWeb: '',
            materialGuarant: '',
            netRatio: dataState.spuFormData3.netRatio,
            nutrients: dataState.spuFormData3.nutrients,
            packageSpec: dataState.spuFormData3.packageSpec,
            packageStyle: dataState.spuFormData3.packageStyle,
            packageList: dataState.spuFormData3.packageList,
            manuName: dataState.spuFormData3.manuName,
            manuAddr: dataState.spuFormData3.manuAddr,
            manuPhone: dataState.spuFormData3.manuPhone,
            agent: dataState.spuFormData3.agent,
            agentAddr: dataState.spuFormData3.agentAddr,
            agentPhone: dataState.spuFormData3.agentPhone,
            entrustedPartyAddr: dataState.spuFormData3.entrustedPartyAddr,
            entrustedPartyPhone: dataState.spuFormData3.entrustedPartyPhone,
            packageUnit: dataState.spuFormData1.packageUnit,
            prodDesc: dataState.spuFormData3.prodDesc,
            productBbf: dataState.spuFormData3.productBbf,
            productHeight: dataState.spuFormData3.productHeight,
            productLength: dataState.spuFormData3.productLength,
            productType: '',
            productWidth: dataState.spuFormData3.productWidth,
            qualityReport: dataState.spuFormData3.qualityReport,
            saleChannel: dataState.spuFormData1.saleChannel.join(','),
            suggSellingPrice: dataState.spuFormData1.suggSellingPrice,
            isSmallSpec: dataState.spuFormData1.isSmallSpec,
            isFreezeStored: dataState.spuFormData1.isFreezeStored,
            searchTag: dataState.spuFormData3.searchTag,
            unavailPerson: '',
            usageScene: '',
            isBatch: dataState.spuFormData3.isBatch,
            batchAttrValue: dataState.spuFormData3.batchAttrValue,
            groupAttr: dataState.spuFormData3.groupAttr,
            threeRClassify: dataState.spuFormData3.threeRClassify,
            trademark: dataState.spuFormData3.trademark,
            marketGuidePrice: dataState.spuFormData3.marketGuidePrice,
            isSuit: dataState.spuFormData3.isSuit,
            whseAcceptFactor: dataState.spuFormData3.whseAcceptFactor,
            whseDeliveryFactor: dataState.spuFormData3.whseDeliveryFactor,
            saleablePeriod: dataState.spuFormData3.saleablePeriod,
            transUnit: dataState.spuFormData3.transUnit,
            inventoryUnit: dataState.spuFormData3.inventoryUnit,
            defaultPurchaseSpec: dataState.spuFormData3.defaultPurchaseSpec,
            purchaseUnit: dataState.spuFormData3.purchaseUnit,
            defaultDistributionSpec: dataState.spuFormData3.defaultDistributionSpec,
            distributionUnit: dataState.spuFormData3.distributionUnit,
            defaultRetailSpec: dataState.spuFormData3.defaultRetailSpec,
            retailUnit: dataState.spuFormData3.retailUnit,
            defaultWholesaleSpec: dataState.spuFormData3.defaultWholesaleSpec,
            wholesaleUnit: dataState.spuFormData3.wholesaleUnit,
            ksid: dataState.spuFormData3.ksid,
            unrealBarcode: dataState.spuFormData3.unrealBarcode
        },
        spuName: dataState.spuFormData1.spuName,
        sterilizeStyle: dataState.spuFormData22.sterilizeStyle,
        storageCondition: dataState.spuFormData1.storageCondition,
        storageStyle: dataState.spuFormData1.storageStyle,
        stuff: dataState.spuFormData22.stuff,
        stuffRatio: dataState.spuFormData22.stuffRatio,
        thirdCateCode: selectThird.value.code,
        thirdCateName: selectThird.value.name,
        wheatType: dataState.spuFormData22.wheatType
    }
    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (props.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码'
    } else if (props.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = props.spuId
    }
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    // if (props.type === 'add') {
    //     configCode = 'UC16576929736366efU4'
    //     name = 'SPU新增'
    // } else if (props.type === 'edit') {
    //     configCode = 'UC1657692988594r5Xac'
    //     name = 'spu更新'
    //     spuInfo.spuId = props.spuId
    // }
    spuInfo = JSON.stringify(spuInfo)
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuTemplate: props.spuTemplate,
            spuInfo: spuInfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: configCode,
        name: name,
        source: '运营后台',
        // source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.type === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (props.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = props.spuId
    }
    submitSpuData(param)
}
// 提交数据(卤味熟食)
const submitSpu3 = async () => {
    if (!dataCheck()) return
    let spuInfo = {
        barcode: dataState.spuFormData1.barcode,
        bodyPart: dataState.spuFormData23.bodyPart,
        brandCode: dataState.spuFormData23.brandCode,
        brandName: dataState.spuFormData1.brandName,
        fatRatio: dataState.spuFormData23.fatRatio,
        foodClass: dataState.spuFormData23.foodClass,
        foodCraft: dataState.spuFormData23.foodCraft,
        fourthCateCode: selectFour.value.code,
        fourthCateName: selectFour.value.name,
        grossWeight: dataState.spuFormData1.grossWeight,
        haloStyle: dataState.spuFormData23.haloStyle,
        isImport: dataState.spuFormData1.isImport,
        isMuslim: dataState.spuFormData23.isMuslim,
        isThereis: dataState.spuFormData23.isThereis,
        leanRatio: dataState.spuFormData23.leanRatio,
        meatRatio: dataState.spuFormData23.meatRatio,
        netWeight: dataState.spuFormData23.netWeight,
        origPlace: dataState.spuFormData1.origPlace,
        processCraft: dataState.spuFormData23.processCraft,
        processFormat: dataState.spuFormData23.processFormat,
        processStyle: dataState.spuFormData23.processStyle,
        productAliasName: '',
        productFormat: dataState.spuFormData23.productFormat,
        productOfficialName: dataState.spuFormData23.productOfficialName,
        productShelfLife: dataState.spuFormData1.productShelfLife,
        productShelfLifeUnit: dataState.spuFormData1.productShelfLifeUnit,
        productSpec: dataState.spuFormData1.productSpec,
        productTaste: dataState.spuFormData23.productTaste,
        specialtyArea: dataState.spuFormData23.specialtyArea,
        spuBusiExtend: {
            afterSaleService: dataState.spuFormData.afterSaleService,
            costPrice: dataState.spuFormData.costPrice,
            grossRate: dataState.spuFormData.grossRate,
            minOrderNum: dataState.spuFormData.minOrderNum,
            purchasePrice: dataState.spuFormData.purchasePrice,
            shipper1: dataState.spuFormDataAddr.shipper1,
            shipper2: dataState.spuFormDataAddr.shipper2,
            shipper3: dataState.spuFormDataAddr.shipper3,
            shipper4: dataState.spuFormDataAddr.shipper4,
            shipper5: dataState.spuFormDataAddr.shipper5,
            supplierId: dataState.spuFormData.supplierName?.busiMerchantId || dataState.spuFormData.supplierId,
            supplierName: dataState.spuFormData.supplierName?.merchantName || dataState.spuFormData.supplierName,
            supplierType: dataState.spuFormData.supplierType,
            minOrderUnit: dataState.spuFormData.minOrderUnit,
            orderCycle: dataState.spuFormData.orderCycle
        },
        spuDesc: '',
        spuExtend: {
            allergenInfo: dataState.spuFormData3.allergenInfo,
            barcodeSpec: dataState.spuFormData3.barcodeSpec,
            barcodeUnit: dataState.spuFormData3.barcodeUnit,
            allergenicIngredients: '',
            attention: dataState.spuFormData3.attention,
            availPerson: dataState.spuFormData3.availPerson,
            boxFormat: dataState.spuFormData3.boxFormat,
            cookeSug: '',
            countStyle: dataState.spuFormData3.countStyle,
            countUnit: dataState.spuFormData3.countUnit,
            eatStyle: dataState.spuFormData3.eatStyle,
            eatSug: dataState.spuFormData3.eatSug,
            eatWay: '',
            entrustedParty: dataState.spuFormData3.entrustedParty,
            gtmBestDrink: '',
            guidePrice: dataState.spuFormData1.guidePrice,
            ingredientList: dataState.spuFormData3.ingredientList,
            isCombine: '1',
            mainRawMaterials: '',
            manuContact: '',
            manuCreditCode: '',
            manuWeb: '',
            materialGuarant: '',
            netRatio: dataState.spuFormData3.netRatio,
            nutrients: dataState.spuFormData3.nutrients,
            packageSpec: dataState.spuFormData3.packageSpec,
            packageStyle: dataState.spuFormData3.packageStyle,
            packageList: dataState.spuFormData3.packageList,
            manuName: dataState.spuFormData3.manuName,
            manuAddr: dataState.spuFormData3.manuAddr,
            manuPhone: dataState.spuFormData3.manuPhone,
            agent: dataState.spuFormData3.agent,
            agentAddr: dataState.spuFormData3.agentAddr,
            agentPhone: dataState.spuFormData3.agentPhone,
            entrustedPartyAddr: dataState.spuFormData3.entrustedPartyAddr,
            entrustedPartyPhone: dataState.spuFormData3.entrustedPartyPhone,
            packageUnit: dataState.spuFormData1.packageUnit,
            prodDesc: dataState.spuFormData3.prodDesc,
            productBbf: dataState.spuFormData3.productBbf,
            productHeight: dataState.spuFormData3.productHeight,
            productLength: dataState.spuFormData3.productLength,
            productType: '',
            productWidth: dataState.spuFormData3.productWidth,
            qualityReport: dataState.spuFormData3.qualityReport,
            saleChannel: dataState.spuFormData1.saleChannel.join(','),
            suggSellingPrice: dataState.spuFormData1.suggSellingPrice,
            isSmallSpec: dataState.spuFormData1.isSmallSpec,
            isFreezeStored: dataState.spuFormData1.isFreezeStored,
            searchTag: dataState.spuFormData3.searchTag,
            unavailPerson: '',
            usageScene: '',
            isBatch: dataState.spuFormData3.isBatch,
            batchAttrValue: dataState.spuFormData3.batchAttrValue,
            groupAttr: dataState.spuFormData3.groupAttr,
            threeRClassify: dataState.spuFormData3.threeRClassify,
            trademark: dataState.spuFormData3.trademark,
            marketGuidePrice: dataState.spuFormData3.marketGuidePrice,
            isSuit: dataState.spuFormData3.isSuit,
            whseAcceptFactor: dataState.spuFormData3.whseAcceptFactor,
            whseDeliveryFactor: dataState.spuFormData3.whseDeliveryFactor,
            saleablePeriod: dataState.spuFormData3.saleablePeriod,
            transUnit: dataState.spuFormData3.transUnit,
            inventoryUnit: dataState.spuFormData3.inventoryUnit,
            defaultPurchaseSpec: dataState.spuFormData3.defaultPurchaseSpec,
            purchaseUnit: dataState.spuFormData3.purchaseUnit,
            defaultDistributionSpec: dataState.spuFormData3.defaultDistributionSpec,
            distributionUnit: dataState.spuFormData3.distributionUnit,
            defaultRetailSpec: dataState.spuFormData3.defaultRetailSpec,
            retailUnit: dataState.spuFormData3.retailUnit,
            defaultWholesaleSpec: dataState.spuFormData3.defaultWholesaleSpec,
            wholesaleUnit: dataState.spuFormData3.wholesaleUnit,
            ksid: dataState.spuFormData3.ksid,
            unrealBarcode: dataState.spuFormData3.unrealBarcode
        },
        spuName: dataState.spuFormData1.spuName,
        starchRatio: '',
        sterilizeCraft: dataState.spuFormData23.sterilizeCraft,
        stewedVegVari: dataState.spuFormData23.stewedVegVari,
        storageCondition: dataState.spuFormData1.storageCondition,
        storageStyle: dataState.spuFormData1.storageStyle,
        tasteStyle: dataState.spuFormData23.tasteStyle,
        thirdCateCode: selectThird.value.code,
        thirdCateName: selectThird.value.name
    }
    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (props.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码'
    } else if (props.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = props.spuId
    }
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    // if (props.type === 'add') {
    //     configCode = 'UC16576929736366efU4'
    //     name = 'SPU新增'
    // } else if (props.type === 'edit') {
    //     configCode = 'UC1657692988594r5Xac'
    //     name = 'spu更新'
    //     spuInfo.spuId = props.spuId
    // }
    spuInfo = JSON.stringify(spuInfo)
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuTemplate: props.spuTemplate,
            spuInfo: spuInfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: configCode,
        name: name,
        source: '运营后台',
        // source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.type === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (props.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = props.spuId
    }
    submitSpuData(param)
}
// 提交数据(调味酱汁)
const submitSpu4 = async () => {
    if (!dataCheck()) return
    let spuInfo = {
        alcoholRatio: dataState.spuFormData24.alcoholRatio,
        barcode: dataState.spuFormData1.barcode,
        brandCode: dataState.spuFormData24.brandCode,
        brandName: dataState.spuFormData1.brandName,
        fatRatio: dataState.spuFormData24.fatRatio,
        fourthCateCode: selectFour.value.code,
        fourthCateName: selectFour.value.name,
        freshButterRatio: dataState.spuFormData24.freshButterRatio,
        grossWeight: dataState.spuFormData1.grossWeight,
        isFirstPressed: dataState.spuFormData24.isFirstPressed,
        isGenetically: dataState.spuFormData24.isGenetically,
        isImport: dataState.spuFormData1.isImport,
        isSmallBag: dataState.spuFormData24.isSmallBag,
        lodinedAdded: dataState.spuFormData24.lodinedAdded,
        netWeight: dataState.spuFormData24.netWeight,
        origPlace: dataState.spuFormData1.origPlace,
        peanutRatio: dataState.spuFormData24.peanutRatio,
        pearPulpRatio: dataState.spuFormData24.pearPulpRatio,
        phytosterolRatio: dataState.spuFormData24.phytosterolRatio,
        processCraft: dataState.spuFormData24.processCraft,
        prodUsage: dataState.spuFormData24.prodUsage,
        productAliasName: '',
        productFormat: dataState.spuFormData24.productFormat,
        productOfficialName: dataState.spuFormData24.productOfficialName,
        productShelfLife: dataState.spuFormData1.productShelfLife,
        productShelfLifeUnit: dataState.spuFormData1.productShelfLifeUnit,
        productSpec: dataState.spuFormData1.productSpec,
        seasonForm: dataState.spuFormData24.seasonForm,
        sesameRatio: dataState.spuFormData24.sesameRatio,
        solidRatio: dataState.spuFormData24.solidRatio,
        spuBusiExtend: {
            afterSaleService: dataState.spuFormData.afterSaleService,
            costPrice: dataState.spuFormData.costPrice,
            grossRate: dataState.spuFormData.grossRate,
            minOrderNum: dataState.spuFormData.minOrderNum,
            purchasePrice: dataState.spuFormData.purchasePrice,
            shipper1: dataState.spuFormDataAddr.shipper1,
            shipper2: dataState.spuFormDataAddr.shipper2,
            shipper3: dataState.spuFormDataAddr.shipper3,
            shipper4: dataState.spuFormDataAddr.shipper4,
            shipper5: dataState.spuFormDataAddr.shipper5,
            supplierId: dataState.spuFormData.supplierName?.busiMerchantId || dataState.spuFormData.supplierId,
            supplierName: dataState.spuFormData.supplierName?.merchantName || dataState.spuFormData.supplierName,
            supplierType: dataState.spuFormData.supplierType,
            minOrderUnit: dataState.spuFormData.minOrderUnit,
            orderCycle: dataState.spuFormData.orderCycle
        },
        spuDesc: '',
        spuExtend: {
            allergenInfo: dataState.spuFormData3.allergenInfo,
            barcodeSpec: dataState.spuFormData3.barcodeSpec,
            barcodeUnit: dataState.spuFormData3.barcodeUnit,
            allergenicIngredients: '',
            attention: dataState.spuFormData3.attention,
            availPerson: dataState.spuFormData3.availPerson,
            boxFormat: dataState.spuFormData3.boxFormat,
            cookeSug: '',
            countStyle: dataState.spuFormData3.countStyle,
            countUnit: dataState.spuFormData3.countUnit,
            eatStyle: dataState.spuFormData3.eatStyle,
            eatSug: dataState.spuFormData3.eatSug,
            eatWay: '',
            entrustedParty: dataState.spuFormData3.entrustedParty,
            gtmBestDrink: '',
            guidePrice: dataState.spuFormData1.guidePrice,
            ingredientList: dataState.spuFormData3.ingredientList,
            isCombine: '1',
            mainRawMaterials: '',
            manuContact: '',
            manuCreditCode: '',
            manuWeb: '',
            materialGuarant: '',
            netRatio: dataState.spuFormData3.netRatio,
            nutrients: dataState.spuFormData3.nutrients,
            packageSpec: dataState.spuFormData3.packageSpec,
            packageStyle: dataState.spuFormData3.packageStyle,
            packageList: dataState.spuFormData3.packageList,
            manuName: dataState.spuFormData3.manuName,
            manuAddr: dataState.spuFormData3.manuAddr,
            manuPhone: dataState.spuFormData3.manuPhone,
            agent: dataState.spuFormData3.agent,
            agentAddr: dataState.spuFormData3.agentAddr,
            agentPhone: dataState.spuFormData3.agentPhone,
            entrustedPartyAddr: dataState.spuFormData3.entrustedPartyAddr,
            entrustedPartyPhone: dataState.spuFormData3.entrustedPartyPhone,
            packageUnit: dataState.spuFormData1.packageUnit,
            prodDesc: dataState.spuFormData3.prodDesc,
            productBbf: dataState.spuFormData3.productBbf,
            productHeight: dataState.spuFormData3.productHeight,
            productLength: dataState.spuFormData3.productLength,
            productType: '',
            productWidth: dataState.spuFormData3.productWidth,
            qualityReport: dataState.spuFormData3.qualityReport,
            saleChannel: dataState.spuFormData1.saleChannel.join(','),
            suggSellingPrice: dataState.spuFormData1.suggSellingPrice,
            isSmallSpec: dataState.spuFormData1.isSmallSpec,
            isFreezeStored: dataState.spuFormData1.isFreezeStored,
            searchTag: dataState.spuFormData3.searchTag,
            unavailPerson: '不适合人群',
            usageScene: '',
            isBatch: dataState.spuFormData3.isBatch,
            batchAttrValue: dataState.spuFormData3.batchAttrValue,
            groupAttr: dataState.spuFormData3.groupAttr,
            threeRClassify: dataState.spuFormData3.threeRClassify,
            trademark: dataState.spuFormData3.trademark,
            marketGuidePrice: dataState.spuFormData3.marketGuidePrice,
            isSuit: dataState.spuFormData3.isSuit,
            whseAcceptFactor: dataState.spuFormData3.whseAcceptFactor,
            whseDeliveryFactor: dataState.spuFormData3.whseDeliveryFactor,
            saleablePeriod: dataState.spuFormData3.saleablePeriod,
            transUnit: dataState.spuFormData3.transUnit,
            inventoryUnit: dataState.spuFormData3.inventoryUnit,
            defaultPurchaseSpec: dataState.spuFormData3.defaultPurchaseSpec,
            purchaseUnit: dataState.spuFormData3.purchaseUnit,
            defaultDistributionSpec: dataState.spuFormData3.defaultDistributionSpec,
            distributionUnit: dataState.spuFormData3.distributionUnit,
            defaultRetailSpec: dataState.spuFormData3.defaultRetailSpec,
            retailUnit: dataState.spuFormData3.retailUnit,
            defaultWholesaleSpec: dataState.spuFormData3.defaultWholesaleSpec,
            wholesaleUnit: dataState.spuFormData3.wholesaleUnit,
            ksid: dataState.spuFormData3.ksid,
            unrealBarcode: dataState.spuFormData3.unrealBarcode
        },
        spuName: dataState.spuFormData1.spuName,
        storageCondition: dataState.spuFormData1.storageCondition,
        storageStyle: dataState.spuFormData1.storageStyle,
        tasteStyle: dataState.spuFormData24.tasteStyle,
        suitableDosage: dataState.spuFormData24.suitableDosage,
        thirdCateCode: selectThird.value.code,
        thirdCateName: selectThird.value.name
    }
    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (props.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码'
    } else if (props.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = props.spuId
    }
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    // if (props.type === 'add') {
    //     configCode = 'UC16576929736366efU4'
    //     name = 'SPU新增'
    // } else if (props.type === 'edit') {
    //     configCode = 'UC1657692988594r5Xac'
    //     name = 'spu更新'
    //     spuInfo.spuId = props.spuId
    // }
    spuInfo = JSON.stringify(spuInfo)
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuTemplate: props.spuTemplate,
            spuInfo: spuInfo
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: configCode,
        name: name,
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.type === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (props.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = props.spuId
    }
    submitSpuData(param)
}

// 导入spu
// const handleExceed = async (files, fileList) => {
//     if (fileList.length > 0) {
//         fileList.value = [fileList[fileList.length - 1]]// 这一步，是 展示最后一次选择文件
//     }
//     console.log(fileList.value, files[0], ' 覆盖党法')
//     // fileRequest(fileList.value)
// }
const fileName = ref('')
const handleChange = async (file, fileList) => {
    if (file.name !== fileList[0].name) {
        fileList.shift()
    }
    fileList.splice(0, 1)
    fileName.value = file.name
    tableData.value = []
    dataState.fileTemp = file.raw
    // dataState.fileTemp = file.raw
    // if (dataState.fileTemp) {
    //     // 判断文件类别是否是excel
    //     // console.log(this.fileTemp.type)
    //     if (dataState.fileTemp.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    //                     dataState.fileTemp.type === 'application/vnd.ms-excel') {
    //     } else {
    //         ElMessageBox({
    //             type: 'warning',
    //             message: '附件格式错误，请删除后重新上传!'
    //         })
    //     }
    // }
}

const fileRequest = async (file) => {
    console.log(file, '方法')
    let goodsName = ''
    if (props.spuTemplate === 'fast_food') {
        goodsName = '方便速食'
    } else if (props.spuTemplate === 'pastry') {
        goodsName = '主食面点'
    } else if (props.spuTemplate === 'cooked_food') {
        goodsName = '卤味熟食'
    } else if (props.spuTemplate === 'sauces') {
        goodsName = '调味酱汁'
    } else if (props.spuTemplate === 'dairy') {
        goodsName = '乳制品'
    } else if (props.spuTemplate === 'water') {
        goodsName = '水饮'
    } else if (props.spuTemplate === 'drink') {
        goodsName = '果汁饮料'
    } else if (props.spuTemplate === 'coffee') {
        goodsName = '乳饮咖啡'
    } else if (props.spuTemplate === 'nursing') {
        goodsName = '个人护理'
    } else if (props.spuTemplate === 'puffed_food') {
        goodsName = '膨化食品'
    } else if (props.spuTemplate === 'seafood') {
        goodsName = '海鲜水产'
    } else if (props.spuTemplate === 'meat') {
        goodsName = '肉禽类'
    } else if (props.spuTemplate === 'fruits_veg') {
        goodsName = '果蔬类'
    }
    const formData = new FormData()
    formData.append('file', file.file)
    formData.append('appKey', 'A1001001')
    formData.append('busiCode', 'A1001001')
    formData.append('goodsName', goodsName)
    formData.append('creatorName', userInfo.value.name)
    formData.append('configCode', 'UC16588040604786UChg')
    formData.append('creatorId', userInfo.value.account)
    const res = await getupdate(formData)
    console.log(res, 'res.xiazai ')
    if (res.code === '200' && res.data.success === false) {
        dialogVisible.value = true
        tableData.value.push({
            fileName: res.data.fileName,
            operateTime: res.data.operateTime,
            url: res.data.url
        })
    }
}
// 下载链接
const exports = (url) => {
    window.location.href = url
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
