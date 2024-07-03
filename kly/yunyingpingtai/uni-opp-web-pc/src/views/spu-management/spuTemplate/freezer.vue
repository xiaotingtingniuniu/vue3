<template>
    <div class='spu-edit-box'>
        <!-- <pdf></pdf> -->
        <el-col :span="20">
            <div class='box-title'>请选择基础类目</div>
            <el-row :gutter="20">
                <el-col :span="20" class="cate-Name">
                    <span>基础类目: </span>
                    <el-cascader
                        ref="basicLevelRef"
                        :props="basicLevel"
                        @change="basicLevelChange"
                        v-model="spuFormData.basicLevelChecked"
                        :disabled="route.params.type === 'publicGoodsDetail' ? true : false"
                        remote
                        clearable
                    />

                </el-col>
            </el-row>
        </el-col>
        <div>
            <div class='box-title'>重要必填属性</div>
            <!-- 供应商 -->
            <div>
                <el-form
                    label-width="200px"
                    ref="supplierForm"
                    :model="spuFormData"
                    :disabled="route.params.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item style="width: 35%;" v-for="item in inputList" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name" :rules="item.rules">

                        <!-- <el-form-item style="width: 35%;" v-for="item in inputList" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name" :rules="{ required: item.required , message: item.label + '不能为空', trigger: ['blur', 'change']}"> -->
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
                        <div v-else-if="item.type === 'checkbox'">
                            <el-checkbox-group v-model="spuFormData[item.name]" >
                                <el-checkbox v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text" :rules="{ required: el.required, message: el.label + '不能为空' }">{{ el.text }}</el-checkbox>
                            </el-checkbox-group>
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
                        <!-- 自定义 带有单位的 -->
                        <div v-if="item.type === 'unit'">
                            <div style="display: flex">
                                <el-input v-model="spuFormData[item.name]" :placeholder="item.placeholder || ''" :precision="item.precision" /><p class="last-text">{{ item.lastText || '' }}</p>
                            </div>
                        </div>
                        <!-- 自定义 温度区间 -->
                        <div v-if="item.type === 'zone'">
                            <div style="display: flex">
                                <el-input v-model="temptureZoneLeft" placeholder="整数" />-<el-input v-model="temptureZoneRight" placeholder="整数" />℃
                            </div>
                        </div>
                        <div v-if="item.type === 'text'">
                            <span v-if="route.params.type === 'add'">{{ item.placeholder }}</span>
                            <span v-else>{{ spuFormData[item.name] }}</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <div>
            <!-- 第一部分：公共重要的 -->
            <div>
                <div class='box-title-sm'>通用&专用属性</div>
                <el-form
                    label-width="200px"
                    :model="spuFormData1"
                    :disabled="route.params.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item style="width: 35%;" v-for="item in inputList1" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name" :rules="item.rules">
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
            <!-- 第二部分：公共非重要的 -->
            <div>
                <div class='box-title-sm'>扩展&补充属性</div>
                <el-form
                    label-width="150px"
                    :model="spuFormData2"
                    :disabled="route.params.type === 'publicGoodsDetail' ? true : false"
                    :inline="true">
                    <el-form-item v-for="item in inputList2" :key="item.name" :label="item.label ? item.label+':' : ''" :prop="item.name">
                        <!-- 选择框 -->
                        <div v-if="item.type === 'select'">
                            <el-select v-model="spuFormData2[item.name]" clearable :placeholder="item.placeholder || ''">
                                <el-option v-for="el in item.menu" :label="el.text" :value="el.value" :key="el.text" />
                            </el-select>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'radio'">
                            <el-radio-group v-model="spuFormData2[item.name]" >
                                <el-radio v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text">{{ el.text }}</el-radio>
                            </el-radio-group>
                        </div>
                        <!-- 单选 -->
                        <div v-else-if="item.type === 'checkbox'">
                            <el-checkbox-group v-model="spuFormData2[item.name]" >
                                <el-checkbox v-for="el in item.menu" :label="el.value" :value="el.value" :key="el.text" :rules="{ required: el.required, message: el.label + '不能为空' }">{{ el.text }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <!-- 文本输入 -->
                        <div v-else>
                            <el-input v-model="spuFormData2[item.name]" :placeholder="item.placeholder || ''"/>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="btn">
            <el-button @click="goBack">关闭</el-button>
            <el-button @click="submitTempFormDate()" v-if="route.params.type !== 'publicGoodsDetail'" type="primary">保存</el-button>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, reactive, toRefs, onMounted } from 'vue'
import { useStore } from 'vuex'
import { queryCategory } from '@/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getMerchantList, getAllMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import pdf from '../pdf.vue'
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
const formParams = ref('')
const supplierForm = ref('')

const basicLevelRef = ref(null)
const productDataState = reactive({
    basicLevelRefVisiable: true,
    basicLevelCheckedInfo: {},
    firstCateNameList: [],
    secondCateNameList: [],
    thirdCateNameList: [],
    fourCateNameList: [],
    cateList: []
})
const { basicLevelRefVisiable } = toRefs(productDataState)

// 基础类目联动
const basicLevel = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        const nodes = res.map((item) => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 3
            }
        })
        resolve(nodes)
    }
}
// 基础类目change
const basicLevelChange = (value) => {
    const basicLevelChecked = basicLevelRef.value.getCheckedNodes(true)[0]
    productDataState.cateList = []
    productDataState.basicLevelCheckedInfo.firstCateName = basicLevelChecked.pathLabels[0]
    productDataState.basicLevelCheckedInfo.firstCateCode = basicLevelChecked.pathValues[0]
    productDataState.basicLevelCheckedInfo.secondCateName = basicLevelChecked.pathLabels[1]
    productDataState.basicLevelCheckedInfo.secondCateCode = basicLevelChecked.pathValues[1]
    productDataState.basicLevelCheckedInfo.thirdCateName = basicLevelChecked.pathLabels[2]
    productDataState.basicLevelCheckedInfo.thirdCateCode = basicLevelChecked.pathValues[2]
    productDataState.basicLevelCheckedInfo.fourthCateName = basicLevelChecked.pathLabels[3]
    productDataState.basicLevelCheckedInfo.fourthCateCode = basicLevelChecked.pathValues[3]
}

const tableData = ref([])
const dialogVisible = ref(false)

router.beforeEach((to, from, next) => {
    if (to.name === 'spu-management-list') {
        // resetFormParams()
    }
    next()
})
const fileList = ref([])

onMounted(async () => {
    await getSupplierList()
    if (route.params.type === 'edit' || route.params.type === 'publicGoodsDetail') {
        await getSpuDetail()
    }
})

const dataState = reactive({
    spuFormData: {
        brandName: '',
        // spuDesc: '',
        productOfficialName: '',
        productModel: '',
        spuName: '',
        spuId: '',
        grossWeight: '',
        doorStyle: '',
        identMode: '',
        doorNum: '',
        tempLayer: '',
        tempeZone: '',
        fullLoadQuantity: '',
        isAdScreen: '',
        isSuppFaceScan: '',
        isTouchPanel: '',
        saleChannel: [],
        packageLength: '',
        packageWidth: '',
        packageHeight: ''
    },
    spuFormData1: {
        adScreenSpec: '',
        productAliasName: '',
        spuId: '',
        barcode: '',
        // brandName: '',
        brandCode: '',
        origPlace: '',
        isImport: '',
        // fourthCateCode: '',
        // fourthCateName: '',
        netWeight: '',
        // productModel: '',
        communicatMode: '',
        doorFeatures: '',
        lockType: '',
        lockPosition: '',
        closeType: '',
        doorElecHeat: '',
        antifogFilm: '',
        handleType: '',
        doorMaterial: '',
        doorframeMaterial: '',
        linerMaterial: '',
        overallSize: '',
        doorSize: '',
        foamBoxSize: '',
        tankSize: '',
        grossVolume: '',
        netVolume: '',
        climateType: '',
        fullLoad: '',
        tempControl: '',
        // tempeZone: '',
        refrigeMode: '',
        refrigerantType: '',
        refrigerantDose: '',
        voltage: '',
        current: '',
        power: '',
        frequency: '',
        smpsSpec: '',
        plugType: '',
        cordLen: '',
        emergPower: '',
        elecProtecType: '',
        consumption: '',
        tabScreenComp: '',
        adScreenComp: '',
        botDrainageMode: '',
        botAirMode: '',
        condenserType: '',
        evaporatorType: '',
        dissipMode: '',
        comprBrandNo: '',
        condensBrand: '',
        evaporBrand: '',
        infrared: '',
        boxStructType: '',
        sideThick: '',
        foamThick: '',
        condensRequire: '',
        cameraComp: '',
        voiceTip: '',
        alarm: '',
        gravitySensor: '',
        lightPosition: '',
        lightNum: '',
        lightPower: '',
        casterConfig: '',
        casterNum: '',
        isSpeaker: '',
        lanesNum: '',
        shelfLayer: '',
        // fullLoadQuantity: '',
        sigShelfHeight1: '',
        sigShelfHeight2: '',
        sigShelfHeight3: '',
        sigShelfHeight4: '',
        sigShelfHeight5: '',
        sigShelfHeight6: '',
        sigShelfHeight7: '',
        sigShelfHeight8: '',
        sigShelfArea: '',
        shelfMaterial: '',
        isPriceTag: '',
        priceTagQuantity: '',
        ratPrev: '',
        noiseValue: '',
        resistStandard: '',
        colorMatch: '',
        sticker: '',
        industBoxComp: '',
        applicableEnv: '',
        controlMode: '',
        noise: '',
        elecLockSpec: '',
        isAdScreen: '',
        adSreenSpec: '',
        isSuppFaceScan: '',
        // isTouchPanel: '',
        speakerSpec: '',
        commType: '',
        outsideDim: '',
        vfCf: '',
        powerConsum: '',
        isVapFan: '',
        isCondFan: '',
        coldTempRange: '',
        freezerTempRange: '',
        antiFogMode: '',
        backplaneTemp: '',
        vapMode: '',
        leakProtect: '',
        tankMaterial: '',
        rackBearing: '',
        rackNum: '',
        rackPosition: '',
        rackDim: '',
        footingType: '',
        ratproofNet: '',
        hingeMode: '',
        boxLampNum: '',
        boxLampRequire: '',
        elecLockNum: '',
        ipcWithCamera: '',
        speakerNum: '',
        spareBatteries: '',
        spuDesc: ''
    },

    spuFormData2: {
        prodLicense: '',
        thrcCert: '',
        isoCert: '',
        ceCert: '',
        roshInspecReport: '',
        netAccessLicense: '',
        stickerType: '',
        stickerStyle: '',
        packageRequire: '',
        suppSoftware: ''
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
const { spuFormData, spuFormDataAddr, spuFormData1, spuFormData2, spuFormData3, chaildFormData, selectData, firstCateNameList, secondCateNameList, thirdCateNameList, fourCateNameList, goodsTypeList } = toRefs(dataState)
// 校验规则：支持输入整数数字
const numberValidator = (rule, value, callback) => {
    console.log(value, 'value')
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        if (!Number.isInteger(Number(value))) {
            callback(new Error('支持输入整数数字'))
        }
        callback()
    }
}

// 校验规则：数值格式，支持两位小数
const amountValidator = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else {
        const reg = /^[0-9]*(\.[0-9]{0,2})?$/
        if (!reg.test(value)) {
            callback(new Error('仅限输入数字，支持小数点后两位'))
        }
        callback()
    }
}
const temptureZoneLeft = ref('')
const temptureZoneRight = ref('')

// 重要必填属性
// const inputList = ref([
//     { label: '品牌名称', name: 'brandName', type: 'custom', required: true, rules: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }] },
//     { label: '产品官方名称', name: 'productOfficialName', type: 'input', required: true },
//     { label: '产品型号', name: 'productModel', type: 'input', required: true },
//     { label: '标品名称', name: 'spuName', type: 'input', placeholder: '', required: true },
//     { label: '标品编码', name: 'spuId', type: 'input', placeholder: 'SPUID创建时为空，编辑时显示，支持复制', required: false },
//     { label: '商品毛重', name: 'grossWeight', type: 'unit', placeholder: '00.00', required: true, precision: 2, lastText: 'g' },
//     // { label: '标品编码', name: 'spuId', type: 'input', placeholder: 'SPUID创建时为空，编辑时显示，支持复制', required: false },
//     // { label: '商品毛重', name: 'grossWeight', type: 'unit', placeholder: '00.00', required: true, precision: 2, lastText: 'g' },
//     { label: '开门方式', name: 'doorStyle', type: 'input', placeholder: '扫码开门', required: true },
//     { label: '识别方式', name: 'identMode', type: 'input', placeholder: '动态识别', required: true },
//     { label: '门体数量', name: 'doorNum', type: 'input', placeholder: '单门/双门', required: true },
//     {
//         label: '支持温度层',
//         name: 'tempLayer',
//         type: 'select',
//         required: true,
//         menu: [
//             { value: '常温', text: '常温' },
//             { value: '冷藏', text: '冷藏' },
//             { value: '冷冻', text: '冷冻' }
//         ]
//     },
//     { label: '储温类型/温区', name: 'tempeZone', type: 'zone', required: false },
//     { label: '商品满载数', name: 'fullLoadQuantity', type: 'input', placeholder: '整数', required: true, validator: numberValidator, trigger: 'change' },
//     {
//         label: '有无广告屏幕',
//         name: 'isAdScreen',
//         type: 'select',
//         required: true,
//         menu: [
//             { value: '有', text: '有' },
//             { value: '无', text: '无' }
//         ]
//     },
//     {
//         label: '屏幕是否支持刷脸支付',
//         name: 'isSuppFaceScan',
//         type: 'select',
//         required: true,
//         menu: [
//             { value: '支持', text: '支持' },
//             { value: '不支持', text: '不支持' }
//         ]
//     },
//     {
//         label: '屏幕是否支持操作',
//         name: 'isTouchPanel',
//         type: 'select',
//         required: true,
//         menu: [
//             { value: '支持', text: '支持' },
//             { value: '不支持', text: '不支持' }
//         ]
//     },
//     {
//         label: '销售渠道',
//         name: 'saleChannel',
//         type: 'checkbox',
//         required: true,
//         menu: [
//             { value: '电商', text: '电商' },
//             { value: '设备供应链', text: '设备供应链' },
//             { value: '众包App', text: '众包App' },
//             { value: 'B2B商城', text: '进货商城' }
//         ]
//     },
//     { label: '包装尺寸-长', name: 'packageLength', type: 'unit', placeholder: '', required: true, lastText: 'mm' },
//     { label: '包装尺寸-宽', name: 'packageWidth', type: 'unit', placeholder: '', required: true, lastText: 'mm' },
//     { label: '包装尺寸-高', name: 'packageHeight', type: 'unit', placeholder: '', required: true, lastText: 'mm' }
// ])
const inputList = ref([
    { label: '品牌名称', name: 'brandName', type: 'input', rules: [{ required: true, message: '品牌名称不能为空', trigger: 'change' }] },
    { label: '产品官方名称', name: 'productOfficialName', type: 'input', rules: [{ required: true, message: '产品官方名称不能为空', trigger: 'change' }] },
    { label: '产品型号', name: 'productModel', type: 'input', rules: [{ required: true, message: '产品型号不能为空', trigger: 'change' }] },
    { label: '标品名称', name: 'spuName', type: 'input', placeholder: '', rules: [{ required: true, message: '标品名称不能为空', trigger: 'change' }] },
    { label: '标品编码', name: 'spuId', type: 'text', placeholder: '', required: false },
    { label: '商品毛重', name: 'grossWeight', type: 'unit', placeholder: '00.00', rules: [{ required: true, validator: amountValidator, trigger: 'change' }], precision: 2, lastText: 'g' },
    { label: '开门方式', name: 'doorStyle', type: 'input', placeholder: '扫码开门', rules: [{ required: true, message: '开门方式不能为空', trigger: 'change' }] },
    { label: '识别方式', name: 'identMode', type: 'input', placeholder: '动态识别', rules: [{ required: true, message: '识别方式不能为空', trigger: 'change' }] },
    { label: '门体数量', name: 'doorNum', type: 'input', placeholder: '单门/双门', rules: [{ required: true, message: '门体数量不能为空', trigger: 'change' }] },
    {
        label: '支持温度层',
        name: 'tempLayer',
        type: 'select',
        rules: [{ required: true, message: '支持温度层不能为空', trigger: 'change' }],
        menu: [
            { value: '常温', text: '常温' },
            { value: '冷藏', text: '冷藏' },
            { value: '冷冻', text: '冷冻' }
        ]
    },
    { label: '储温类型/温区', name: 'tempeZone', type: 'zone', rules: [{ }] },
    { label: '商品满载数', name: 'fullLoadQuantity', type: 'input', placeholder: '整数', rules: [{ required: true, validator: numberValidator, trigger: 'change' }], trigger: 'change' },
    {
        label: '有无广告屏幕',
        name: 'isAdScreen',
        type: 'select',
        rules: [{ required: true, message: '有无广告屏幕不能为空', trigger: 'change' }],
        menu: [
            { value: '有', text: '有' },
            { value: '无', text: '无' }
        ]
    },
    {
        label: '屏幕是否支持刷脸支付',
        name: 'isSuppFaceScan',
        type: 'select',
        rules: [{ required: true, message: '屏幕是否支持刷脸支付不能为空', trigger: 'change' }],
        menu: [
            { value: '支持', text: '支持' },
            { value: '不支持', text: '不支持' }
        ]
    },
    {
        label: '屏幕是否支持操作',
        name: 'isTouchPanel',
        type: 'select',
        rules: [{ required: true, message: '屏幕是否支持操作不能为空', trigger: 'change' }],
        menu: [
            { value: '支持', text: '支持' },
            { value: '不支持', text: '不支持' }
        ]
    },
    {
        label: '销售渠道',
        name: 'saleChannel',
        type: 'checkbox',
        rules: [{ required: true, message: '销售渠道不能为空', trigger: 'change' }],
        menu: [
            { value: '电商', text: '电商' },
            { value: '设备供应链', text: '设备供应链' },
            { value: '众包App', text: '众包App' },
            { value: 'B2B商城', text: '进货商城' }
        ]
    },
    { label: '包装尺寸-长', name: 'packageLength', type: 'unit', placeholder: '', rules: [{ required: true, validator: numberValidator, trigger: 'change' }], lastText: 'mm' },
    { label: '包装尺寸-宽', name: 'packageWidth', type: 'unit', placeholder: '', rules: [{ required: true, validator: numberValidator, trigger: 'change' }], lastText: 'mm' },
    { label: '包装尺寸-高', name: 'packageHeight', type: 'unit', placeholder: '', rules: [{ required: true, validator: numberValidator, trigger: 'change' }], lastText: 'mm' }
])
// 通用&专有属性
const inputList1 = ref([
    // { label: '标品编码', name: 'spuId', type: 'input' },
    { label: '69码', name: 'barcode', type: 'input' },
    // { label: '品牌名称', name: 'brandName', type: 'input' },
    { label: '品牌编号', name: 'brandCode', type: 'input' },
    { label: '产地', name: 'origPlace', type: 'input' },
    { label: '国产/进口', name: 'isImport', type: 'input' },
    // { label: '四级品类编号', name: 'fourthCateCode', type: 'input' },
    // { label: '四级品类名称', name: 'fourthCateName', type: 'input' },
    { label: '商品净重', name: 'netWeight', type: 'input' },
    // { label: '产品型号', name: 'productModel', type: 'input' },
    { label: '通讯方式', name: 'communicatMode', type: 'input' },
    { label: '门体特征', name: 'doorFeatures', type: 'input' },
    { label: '门锁类型', name: 'lockType', type: 'input' },
    { label: '门锁位置', name: 'lockPosition', type: 'input' },
    { label: '门自闭类型', name: 'closeType', type: 'input' },
    { label: '门体电加热', name: 'doorElecHeat', type: 'input' },
    { label: '门体防雾LOWE膜', name: 'antifogFilm', type: 'input' },
    { label: '门把手类型', name: 'handleType', type: 'input' },
    { label: '门体材质', name: 'doorMaterial', type: 'input' },
    { label: '门框材质', name: 'doorframeMaterial', type: 'input' },
    { label: '内胆材质', name: 'linerMaterial', type: 'input' },
    { label: '整机尺寸  （含脚轮不含把手）(W×D×H) mm', name: 'overallSize', type: 'input' },
    { label: '门体尺寸（不含把手）(W×D×H）mm', name: 'doorSize', type: 'input' },
    { label: '发泡箱尺寸(W×D×H）mm', name: 'foamBoxSize', type: 'input' },
    { label: '内胆尺寸(W×D×H）mm', name: 'tankSize', type: 'input' },
    { label: '产品毛容积（L）', name: 'grossVolume', type: 'input' },
    { label: '有效净容积（L）', name: 'netVolume', type: 'input' },
    { label: '气候类型', name: 'climateType', type: 'input' },
    { label: '全载冷速 （满载）', name: 'fullLoad', type: 'input' },
    { label: '控温方式', name: 'tempControl', type: 'input' },
    // { label: '储温类型/温区', name: 'tempeZone', type: 'input' },
    { label: '制冷方式', name: 'refrigeMode', type: 'input' },
    { label: '制冷剂类型', name: 'refrigerantType', type: 'input' },
    { label: '制冷剂用量', name: 'refrigerantDose', type: 'input' },
    { label: '工作电压（V）', name: 'voltage', type: 'input' },
    { label: '电流 (A)', name: 'current', type: 'input' },
    { label: '功率 (W)', name: 'power', type: 'input' },
    { label: '电源频率', name: 'frequency', type: 'input' },
    { label: '开关电源规格', name: 'smpsSpec', type: 'input' },
    { label: '电源插头类型', name: 'plugType', type: 'input' },
    { label: '电源线长度', name: 'cordLen', type: 'input' },
    { label: '备用电源', name: 'emergPower', type: 'input' },
    { label: '防触电保护类型', name: 'elecProtecType', type: 'input' },
    { label: '耗电量', name: 'consumption', type: 'input' },
    { label: '8寸支付屏组件', name: 'tabScreenComp', type: 'input' },
    { label: '广告屏组件', name: 'adScreenComp', type: 'input' },
    { label: '底部排水方式', name: 'botDrainageMode', type: 'input' },
    { label: '底部出风方式', name: 'botAirMode', type: 'input' },
    { label: '冷凝器类型', name: 'condenserType', type: 'input' },
    { label: '蒸发器类型', name: 'evaporatorType', type: 'input' },
    { label: '散热方式', name: 'dissipMode', type: 'input' },
    { label: '压缩机品牌型号', name: 'comprBrandNo', type: 'input' },
    { label: '冷凝风机品牌', name: 'condensBrand', type: 'input' },
    { label: '蒸发风机品牌', name: 'evaporBrand', type: 'input' },
    { label: '红外人体感应功能（夜间节电）', name: 'infrared', type: 'input' },
    { label: '箱体结构类型', name: 'boxStructType', type: 'input' },
    { label: '侧钣厚度', name: 'sideThick', type: 'input' },
    { label: '发泡厚度', name: 'foamThick', type: 'input' },
    { label: '凝露要求（满载）', name: 'condensRequire', type: 'input' },
    { label: '摄像头组件', name: 'cameraComp', type: 'input' },
    { label: '开关门提示语音', name: 'voiceTip', type: 'input' },
    { label: '报警提示', name: 'alarm', type: 'input' },
    { label: '重力传感器', name: 'gravitySensor', type: 'input' },
    { label: '照明灯位置', name: 'lightPosition', type: 'input' },
    { label: '照明灯数量', name: 'lightNum', type: 'input' },
    { label: '照明灯位置功率', name: 'lightPower', type: 'input' },
    { label: '脚轮配置', name: 'casterConfig', type: 'input' },
    { label: '脚轮数量', name: 'casterNum', type: 'input' },
    { label: '是否有扬声器', name: 'isSpeaker', type: 'input' },
    { label: '货道数量', name: 'lanesNum', type: 'input' },
    { label: '货架层数', name: 'shelfLayer', type: 'input' },
    { label: '商品满载数', name: 'fullLoadQuantity', type: 'input' },
    { label: '单层货架高度1（mm）', name: 'sigShelfHeight1', type: 'input' },
    { label: '单层货架高度2（mm）', name: 'sigShelfHeight2', type: 'input' },
    { label: '单层货架高度3（mm）', name: 'sigShelfHeight3', type: 'input' },
    { label: '单层货架高度4（mm）', name: 'sigShelfHeight4', type: 'input' },
    { label: '单层货架高度5（mm）', name: 'sigShelfHeight5', type: 'input' },
    { label: '单层货架高度6（mm）', name: 'sigShelfHeight6', type: 'input' },
    { label: '单层货架高度7（mm）', name: 'sigShelfHeight7', type: 'input' },
    { label: '单层货架高度8（mm）', name: 'sigShelfHeight8', type: 'input' },
    { label: '单层货架面积（列×排）', name: 'sigShelfArea', type: 'input' },
    { label: '货架材质', name: 'shelfMaterial', type: 'input' },
    { label: '是否有价签', name: 'isPriceTag', type: 'input' },
    { label: '价格签数量', name: 'priceTagQuantity', type: 'input' },
    { label: '防鼠要求', name: 'ratPrev', type: 'input' },
    { label: '噪声值', name: 'noiseValue', type: 'input' },
    { label: '外观件耐候标准', name: 'resistStandard', type: 'input' },
    { label: '箱体与门体配色', name: 'colorMatch', type: 'input' },
    { label: '贴画（位置及尺寸）', name: 'sticker', type: 'input' },
    { label: '工控盒组件（芯智BOX）', name: 'industBoxComp', type: 'input' },
    { label: '适用环境', name: 'applicableEnv', type: 'input' },
    { label: '控制方式', name: 'controlMode', type: 'input' },
    { label: '噪音（dB）', name: 'noise', type: 'input' },
    { label: '电子锁规格', name: 'elecLockSpec', type: 'input' },
    // {
    //     label: '有无广告屏幕',
    //     name: 'isAdScreen',
    //     type: 'select',
    //     required: true,
    //     menu: [
    //         { value: '有', text: '有' },
    //         { value: '无', text: '无' }
    //     ]
    // },
    { label: '广告屏幕规格', name: 'adScreenSpec', type: 'input' },
    // {
    //     label: '屏幕是否支持刷脸支付',
    //     name: 'isSuppFaceScan',
    //     type: 'select',
    //     required: true,
    //     menu: [
    //         { value: '支持', text: '支持' },
    //         { value: '不支持', text: '不支持' }
    //     ]
    // },
    // { label: '屏幕是否支持操作', name: 'isTouchPanel', type: 'input' },
    { label: '喇叭规格', name: 'speakerSpec', type: 'input' },
    { label: '通讯类型', name: 'commType', type: 'input' },
    { label: '含脚轮含广告屏外形尺寸（mm）', name: 'outsideDim', type: 'input' },
    { label: '变频/定频', name: 'vfCf', type: 'input' },
    { label: '耗电量（Kw.h）', name: 'powerConsum', type: 'input' },
    { label: '是否有蒸发风机', name: 'isVapFan', type: 'input' },
    { label: '是否有冷凝风机', name: 'isCondFan', type: 'input' },
    { label: '冷藏室温度范围', name: 'coldTempRange', type: 'input' },
    { label: '冷冻室温度范围', name: 'freezerTempRange', type: 'input' },
    { label: '防起雾方式（门体电加热/LOWE膜）', name: 'antiFogMode', type: 'input' },
    { label: '箱体两侧壁机背板温度', name: 'backplaneTemp', type: 'input' },
    { label: '化霜水蒸发方式', name: 'vapMode', type: 'input' },
    { label: '漏电保护', name: 'leakProtect', type: 'input' },
    { label: '箱胆材质', name: 'tankMaterial', type: 'input' },
    { label: '搁架承重', name: 'rackBearing', type: 'input' },
    { label: '搁架数量', name: 'rackNum', type: 'input' },
    { label: '搁架位置', name: 'rackPosition', type: 'input' },
    { label: '搁架尺寸（宽*深*厚度mm）', name: 'rackDim', type: 'input' },
    { label: '底脚类型', name: 'footingType', type: 'input' },
    { label: '防鼠网', name: 'ratproofNet', type: 'input' },
    { label: '门铰链类型', name: 'hingeMode', type: 'input' },
    { label: '箱灯数量', name: 'boxLampNum', type: 'input' },
    { label: '箱灯要求', name: 'boxLampRequire', type: 'input' },
    { label: '电子锁个数', name: 'elecLockNum', type: 'input' },
    { label: '工控摄像头一体机', name: 'ipcWithCamera', type: 'input' },
    { label: '喇叭个数', name: 'speakerNum', type: 'input' },
    { label: '备用电池', name: 'spareBatteries', type: 'input' },
    { label: '描述', name: 'spuDesc', type: 'input' }
])

// 第三部分
const inputList2 = ref([
    { label: '生产许可证', name: 'prodLicense', type: 'input' },
    { label: '3C认证', name: 'thrcCert', type: 'input' },
    { label: 'ISO认证', name: 'isoCert', type: 'input' },
    { label: 'CE认证', name: 'ceCert', type: 'input' },
    { label: 'Rosh检测报告', name: 'roshInspecReport', type: 'input' },
    { label: '入网许可证', name: 'netAccessLicense', type: 'input' },
    { label: '贴画供应类型', name: 'stickerType', type: 'input' },
    { label: '贴画供应方式', name: 'stickerStyle', type: 'input' },
    { label: '包装要求', name: 'packageRequire', type: 'input' },
    { label: '支持软件', name: 'suppSoftware', type: 'input' }
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

const numberChange = (item, type) => {
    if (!dataState.spuFormData.costPrice || !dataState.spuFormData.purchasePrice) {
        dataState.spuFormData.grossRate = 0
        return
    }
    dataState.spuFormData.grossRate = Number(((dataState.spuFormData.costPrice - dataState.spuFormData.purchasePrice) / dataState.spuFormData.purchasePrice * 100).toFixed(2))
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

// 查询SPU详情
const getSpuDetail = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuId: route.params.spuId
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
    productDataState.basicLevelCheckedInfo.firstCateName = res.firstCateName
    productDataState.basicLevelCheckedInfo.firstCateCode = res.firstCateCode
    productDataState.basicLevelCheckedInfo.secondCateName = res.secondCateName
    productDataState.basicLevelCheckedInfo.secondCateCode = res.secondCateCode
    productDataState.basicLevelCheckedInfo.thirdCateName = res.thirdCateName
    productDataState.basicLevelCheckedInfo.thirdCateCode = res.thirdCateCode
    productDataState.basicLevelCheckedInfo.fourthCateName = res.fourthCateName
    productDataState.basicLevelCheckedInfo.fourthCateCode = res.fourthCateCode
    dataState.spuFormData.saleChannel = res.saleChannel ? res.saleChannel.split(',') : []
    dataState.spuFormData.basicLevelChecked = [res.firstCateCode, res.secondCateCode, res.thirdCateCode, res.fourthCateCode]
    dataState.selectData.firstCateName = res.firstCateName
    dataState.selectData.secondCateName = res.secondCateName
    dataState.selectData.thirdCateName = res.thirdCateName
    dataState.selectData.fourCateName = res.fourthCateName
    dataState.spuFormData2 = res
    dataState.spuFormData1 = res
    dataState.spuFormData = res
    temptureZoneLeft.value = res.tempeZone ? res.tempeZone.split('~')[0] : ''
    temptureZoneRight.value = res.tempeZone ? res.tempeZone.split('~')[1] : ''
}

// 提交前数据校验
const dataCheck = () => {
    if (!productDataState.basicLevelCheckedInfo.thirdCateCode || !productDataState.basicLevelCheckedInfo.fourthCateCode) {
        ElMessage.error('请选择基础类目！')
        return false
    } else {
        return true
    }
}

// 电商校验
const supplier = async () => {
    return await Promise.all([
        supplierForm.value.validate()
    ])
}

// 温度校验
const tempCkeck = () => {
    if (!temptureZoneLeft.value || !temptureZoneRight.value) {
        ElMessage.error('请选择温区')
        return false
    } else {
        return true
    }
}
const tempZoneCheck = () => {
    if (!Number.isInteger(Number(temptureZoneLeft.value)) || !Number.isInteger(Number(temptureZoneRight.value))) {
        ElMessage.error('温度必须是数字')
        return false
    } else {
        return true
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
                    // resetFormParams()
                    ElMessage.success('提交成功')
                    router.push({ name: 'spu-management-list' })
                }).catch(() => {
                    ElMessage.error('请完成数据填写！')
                })
        } else if (res.code === '200') {
            ElMessage.success('提交成功')
            router.push({ name: 'spu-management-list' })
        }
    })
}

// 提交数据
const submitTempFormDate = async () => {
    if (!dataCheck()) return
    if (!supplier()) return
    if (!tempCkeck()) return
    // if (!tempZoneCheck()) return

    let spuInfo = {
        adScreenComp: dataState.spuFormData1.adScreenComp,
        adScreenSpec: dataState.spuFormData1.adScreenSpec,
        alarm: dataState.spuFormData1.alarm,
        antiFogMode: dataState.spuFormData1.antiFogMode,
        antifogFilm: dataState.spuFormData1.antifogFilm,
        applicableEnv: dataState.spuFormData1.applicableEnv,
        backplaneTemp: dataState.spuFormData1.backplaneTemp,
        barcode: dataState.spuFormData1.barcode,
        botAirMode: dataState.spuFormData1.botAirMode,
        botDrainageMode: dataState.spuFormData1.botDrainageMode,
        boxLampNum: dataState.spuFormData1.boxLampNum,
        boxLampRequire: dataState.spuFormData1.boxLampRequire,
        boxStructType: dataState.spuFormData1.boxStructType,
        brandCode: dataState.spuFormData.brandCode,
        brandName: dataState.spuFormData.brandName,
        cameraComp: dataState.spuFormData1.cameraComp,
        casterConfig: dataState.spuFormData1.casterConfig,
        casterNum: dataState.spuFormData1.casterNum,
        climateType: dataState.spuFormData1.climateType,
        closeType: dataState.spuFormData1.closeType,
        coldTempRange: dataState.spuFormData1.coldTempRange,
        colorMatch: dataState.spuFormData1.colorMatch,
        commType: dataState.spuFormData1.commType,
        communicatMode: dataState.spuFormData1.communicatMode,
        comprBrandNo: dataState.spuFormData1.comprBrandNo,
        condensBrand: dataState.spuFormData1.condensBrand,
        condensRequire: dataState.spuFormData1.condensRequire,
        condenserType: dataState.spuFormData1.condenserType,
        consumption: dataState.spuFormData1.consumption,
        controlMode: dataState.spuFormData1.controlMode,
        cordLen: dataState.spuFormData1.cordLen,
        current: dataState.spuFormData1.current,
        dissipMode: dataState.spuFormData1.dissipMode,
        doorElecHeat: dataState.spuFormData1.doorElecHeat,
        doorFeatures: dataState.spuFormData1.doorFeatures,
        doorMaterial: dataState.spuFormData1.doorMaterial,
        doorNum: dataState.spuFormData.doorNum,
        doorSize: dataState.spuFormData.doorSize,
        doorStyle: dataState.spuFormData.doorStyle,
        doorframeMaterial: dataState.spuFormData1.doorframeMaterial,
        elecLockNum: dataState.spuFormData1.elecLockNum,
        elecLockSpec: dataState.spuFormData1.elecLockSpec,
        elecProtecType: dataState.spuFormData1.elecProtecType,
        emergPower: dataState.spuFormData1.emergPower,
        evaporBrand: dataState.spuFormData1.evaporBrand,
        evaporatorType: dataState.spuFormData1.evaporatorType,
        foamBoxSize: dataState.spuFormData1.foamBoxSize,
        foamThick: dataState.spuFormData1.foamThick,
        footingType: dataState.spuFormData1.footingType,
        fourthCateCode: productDataState.basicLevelCheckedInfo.fourthCateCode,
        fourthCateName: productDataState.basicLevelCheckedInfo.fourthCateName,
        freezerTempRange: dataState.spuFormData1.freezerTempRange,
        frequency: dataState.spuFormData1.frequency,
        fullLoad: dataState.spuFormData1.fullLoad,
        fullLoadQuantity: dataState.spuFormData.fullLoadQuantity,
        gravitySensor: dataState.spuFormData1.gravitySensor,
        grossVolume: dataState.spuFormData1.grossVolume,
        grossWeight: dataState.spuFormData.grossWeight,
        handleType: dataState.spuFormData1.handleType,
        hingeMode: dataState.spuFormData1.hingeMode,
        identMode: dataState.spuFormData.identMode,
        industBoxComp: dataState.spuFormData1.industBoxComp,
        infrared: dataState.spuFormData1.infrared,
        ipcWithCamera: dataState.spuFormData1.ipcWithCamera,
        isAdScreen: dataState.spuFormData.isAdScreen,
        isCondFan: dataState.spuFormData1.isCondFan,
        isImport: dataState.spuFormData1.isImport,
        isPriceTag: dataState.spuFormData1.isPriceTag,
        isSpeaker: dataState.spuFormData1.isSpeaker,
        isSuppFaceScan: dataState.spuFormData.isSuppFaceScan,
        isTouchPanel: dataState.spuFormData.isTouchPanel,
        isVapFan: dataState.spuFormData1.isVapFan,
        lanesNum: dataState.spuFormData1.lanesNum,
        leakProtect: dataState.spuFormData1.leakProtect,
        lightNum: dataState.spuFormData1.lightNum,
        lightPosition: dataState.spuFormData1.lightPosition,
        lightPower: dataState.spuFormData1.lightPower,
        linerMaterial: dataState.spuFormData1.linerMaterial,
        lockPosition: dataState.spuFormData1.lockPosition,
        lockType: dataState.spuFormData1.lockType,
        netVolume: dataState.spuFormData1.netVolume,
        netWeight: dataState.spuFormData1.netWeight,
        noise: dataState.spuFormData1.noise,
        noiseValue: dataState.spuFormData1.noiseValue,
        origPlace: dataState.spuFormData1.origPlace,
        outsideDim: dataState.spuFormData1.outsideDim,
        overallSize: dataState.spuFormData1.overallSize,
        plugType: dataState.spuFormData1.plugType,
        power: dataState.spuFormData1.power,
        powerConsum: dataState.spuFormData1.powerConsum,
        priceTagQuantity: dataState.spuFormData1.priceTagQuantity,
        productAliasName: dataState.spuFormData1.productAliasName,
        productModel: dataState.spuFormData.productModel,
        productOfficialName: dataState.spuFormData.productOfficialName,
        rackBearing: dataState.spuFormData1.rackBearing,
        rackDim: dataState.spuFormData1.rackDim,
        rackNum: dataState.spuFormData1.rackNum,
        rackPosition: dataState.spuFormData1.rackPosition,
        ratPrev: dataState.spuFormData1.ratPrev,
        ratproofNet: dataState.spuFormData1.ratproofNet,
        refrigeMode: dataState.spuFormData1.refrigeMode,
        refrigerantDose: dataState.spuFormData1.refrigerantDose,
        refrigerantType: dataState.spuFormData1.refrigerantType,
        resistStandard: dataState.spuFormData1.resistStandard,
        shelfLayer: dataState.spuFormData1.shelfLayer,
        shelfMaterial: dataState.spuFormData1.shelfMaterial,
        sideThick: dataState.spuFormData1.sideThick,
        sigShelfArea: dataState.spuFormData1.sigShelfArea,
        sigShelfHeight1: dataState.spuFormData1.sigShelfHeight2,
        sigShelfHeight2: dataState.spuFormData1.sigShelfHeight2,
        sigShelfHeight3: dataState.spuFormData1.sigShelfHeight3,
        sigShelfHeight4: dataState.spuFormData1.sigShelfHeight4,
        sigShelfHeight5: dataState.spuFormData1.sigShelfHeight5,
        sigShelfHeight6: dataState.spuFormData1.sigShelfHeight6,
        sigShelfHeight7: dataState.spuFormData1.sigShelfHeight7,
        sigShelfHeight8: dataState.spuFormData1.sigShelfHeight8,
        smpsSpec: dataState.spuFormData1.smpsSpec,
        spareBatteries: dataState.spuFormData1.spareBatteries,
        speakerNum: dataState.spuFormData1.speakerNum,
        speakerSpec: dataState.spuFormData1.speakerSpec,
        saleChannel: dataState.spuFormData.saleChannel ? dataState.spuFormData.saleChannel.join(',') : [],
        firstCateCode: productDataState.basicLevelCheckedInfo.firstCateCode,
        firstCateName: productDataState.basicLevelCheckedInfo.firstCateName,
        secondCateCode: productDataState.basicLevelCheckedInfo.secondCateCode,
        secondCateName: productDataState.basicLevelCheckedInfo.secondCateName,
        spuBusiExtend: {
            afterSaleService: 1,
            costPrice: 2,
            grossRate: 1,
            minOrderNum: 1,
            purchasePrice: 3,
            // "shipper1":"{"addr":"详细地址","cityCode":"市编码","cityName":"市名称","countyCode":"县编码","countyName":"县名称","provinceCode":"省编码","provinceName":"省名称"}",
            supplierId: '1',
            supplierName: '供应商名称',
            supplierType: 1
        },
        spuDesc: dataState.spuFormData1.spuDesc,
        spuExtend: {
            packageLength: dataState.spuFormData.packageLength ? dataState.spuFormData.packageLength : 0,
            packageWidth: dataState.spuFormData.packageWidth ? dataState.spuFormData.packageWidth : 0,
            packageHeight: dataState.spuFormData.packageHeight ? dataState.spuFormData.packageHeight : 0,
            ceCert: dataState.spuFormData2.ceCert,
            isoCert: dataState.spuFormData2.isoCert,
            netAccessLicense: dataState.spuFormData2.netAccessLicense,
            packageRequire: dataState.spuFormData2.packageRequire,
            prodLicense: dataState.spuFormData2.prodLicense,
            roshInspecReport: dataState.spuFormData2.roshInspecReport,
            stickerStyle: dataState.spuFormData2.stickerStyle,
            stickerType: dataState.spuFormData2.stickerType,
            suppSoftware: dataState.spuFormData2.suppSoftware,
            thrcCert: dataState.spuFormData2.thrcCert,
            saleChannel: dataState.spuFormData.saleChannel ? dataState.spuFormData.saleChannel.join(',') : []

        },
        spuName: dataState.spuFormData.spuName,
        sticker: dataState.spuFormData1.sticker,
        tabScreenComp: dataState.spuFormData1.tabScreenComp,
        tankMaterial: dataState.spuFormData1.tankMaterial,
        tankSize: dataState.spuFormData1.tankSize,
        tempControl: dataState.spuFormData1.tempControl,
        tempLayer: dataState.spuFormData.tempLayer,
        tempeZone: `${temptureZoneLeft.value}~${temptureZoneRight.value}`,
        thirdCateCode: productDataState.basicLevelCheckedInfo.thirdCateCode,
        thirdCateName: productDataState.basicLevelCheckedInfo.thirdCateName,
        vapMode: dataState.spuFormData1.vapMode,
        vfCf: dataState.spuFormData1.vfCf,
        voiceTip: dataState.spuFormData1.voiceTip,
        voltage: dataState.spuFormData1.voltage

    }
    console.log(spuInfo, dataState.spuFormData1.barcode, 'dataState.spuFormData1.barcode')
    // let configCode = 'UC16576929736366efU4'
    // let name = 'SPU新增'
    let configCode = 'UCJH47739748739575808'
    let name = '创建SPU聚合-校验69码'
    if (route.params.type === 'add') {
        configCode = 'UCJH47739748739575808'
        name = '创建SPU聚合-校验69码1'
    } else if (route.params.type === 'edit') {
        configCode = 'UCJH47740100939476992'
        name = '更新SPU聚合-校验69码'
        spuInfo.spuId = route.params.spuId
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
            spuTemplate: route.params.spuTemplate,
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
    if ((route.params.type) === 'add') {
        param.body.barcode = [dataState.spuFormData1.barcode]
    } else if (route.params.type === 'edit') {
        param.body.barcode = [dataState.spuFormData1.barcode]
        param.body.spuId = route.params.spuId
    }
    submitSpuData(param)
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
{/* <style lang="scss" scoped>
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

</style> */}
