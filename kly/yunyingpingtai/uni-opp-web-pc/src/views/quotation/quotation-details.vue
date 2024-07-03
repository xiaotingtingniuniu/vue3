<template>
    <!-- <span v-if="props.title === 'modify'"></span><span v-else-if="props.title === 'toexamine'">审核</span><span v-else-if="props.title === 'deactivate'">停用</span><span  v-else-if="props.title === 'enable'">启用</span> -->
    <h3>报价单明细修改</h3>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="150px" class="demo-ruleForm" :size="formSize" status-icon :inline="true" >
        <el-form-item label="报价单号" prop="feeNo">
            <el-input v-model="ruleForm.feeNo" disabled />
        </el-form-item>
        <el-form-item label="报价单名称" prop="feeName">
            <el-input v-model="ruleForm.feeName" disabled />
        </el-form-item>
        <br />
        <el-form-item label="始发省" prop="srcProvinceName">
            <el-input v-model="ruleForm.srcProvinceName" disabled />
        </el-form-item>
        <el-form-item label="始发市" prop="srcCityName">
            <el-input v-model="ruleForm.srcCityName" disabled />
        </el-form-item>
        <el-form-item label="始发县" prop="srcCountyName">
            <el-input v-model="ruleForm.srcCountyName" disabled />
        </el-form-item>
        <br />
        <el-form-item label="目的省" prop="targetProvinceName">
            <el-input v-model="ruleForm.targetProvinceName" disabled />
        </el-form-item>
        <el-form-item label="目的市" prop="targetCityName">
            <el-input v-model="ruleForm.targetCityName" disabled />
        </el-form-item>
        <el-form-item label="目的县" prop="targetCountyName">
            <el-input v-model="ruleForm.targetCountyName" disabled />
        </el-form-item>
        <br />
        <el-form-item label="首重重量(KG)" prop="firstWeightStr">
            <el-input v-model="ruleForm.firstWeightStr" @keyup="ruleForm.firstWeightStr = oninput(ruleForm.firstWeightStr)" :disabled="props.title !== 'modify'" class="input-line" />
        </el-form-item>
        <el-form-item label="首重价格(元)" prop="firstWeightPriceStr">
            <el-input v-model="ruleForm.firstWeightPriceStr" @keyup="ruleForm.firstWeightPriceStr = oninputprice(ruleForm.firstWeightPriceStr)" :disabled="props.title !== 'modify'" class="input-line" />
        </el-form-item>
        <el-form-item label="重量进位制" prop="weightCalType">
            <el-select v-model="ruleForm.weightCalType" placeholder="重量进位制"  class="input-line">
                <el-option label="0.5进位" :value="1" />
                <el-option label="1进位" :value="2" />
                <el-option label="四舍五入" :value="3" />
            </el-select>
        </el-form-item>
        <br />
        <el-form-item label="续重重量(KG)" prop="otherWeightStr">
            <el-input v-model="ruleForm.otherWeightStr" @keyup="ruleForm.otherWeightStr = oninput(ruleForm.otherWeightStr)" :disabled="props.title !== 'modify'" class="input-line" />
        </el-form-item>
        <el-form-item label="续重价格(元)" prop="otherWeightPriceStr">
            <el-input v-model="ruleForm.otherWeightPriceStr" @keyup="ruleForm.otherWeightPriceStr = oninputprice(ruleForm.otherWeightPriceStr)" :disabled="props.title !== 'modify'" class="input-line" />
        </el-form-item>
        <el-form-item label="价格进位制" prop="priceCalType">
            <el-select v-model="ruleForm.priceCalType" placeholder="价格进位制" class="input-line">
                <el-option label="0.5进位" :value="1" />
                <el-option label="1进位" :value="2" />
                <el-option label="四舍五入" :value="3" />
            </el-select>
        </el-form-item>
        <br />
        <el-form-item class="onfunction-btn">
            <el-button @click="cancel()">取消</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const props = defineProps(['title', 'id', 'feeNo'])
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 重量-正则
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
    str = str.replace(/\.\d\d\d\d$/, '') // 小数点后只能输三位
    return str
}

// 价格-正则
const oninputprice = (num) => {
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
    str = str.replace(/\.\d\d\d$/, '') // 小数点后只能输三位
    return str
}

// 1:新增，2:修改
const operateType = ref(1)

const formSize = ref('default')
const ruleFormRef = ref()
const ruleForm = reactive({
    id: null,
    feeId: null,
    feeNo: '', // 单号
    feeName: '', // 名称
    //
    srcProvinceName: '',
    srcProvinceCode: '',
    srcCityName: '',
    srcCityCode: '',
    srcCountyName: '',
    srcCountyCode: '',
    //
    targetProvinceName: '',
    targetProvinceCode: '',
    targetCityName: '',
    targetCityCode: '',
    targetCountyName: '',
    targetCountyCode: '',
    //
    firstWeightStr: null,
    firstWeightPriceStr: null,
    weightCalType: null,
    //
    otherWeightStr: null,
    otherWeightPriceStr: null,
    priceCalType: null
})
const targetAddressList = reactive([
    {
        targetProvinceName: '',
        targetProvinceCode: '',
        targetCityName: '',
        targetCityCode: '',
        targetCountyName: '',
        targetCountyCode: ''
    }
])
watch(ruleForm,
    (newVal, oldVal) => {
        targetAddressList[0].targetProvinceCode = newVal.targetProvinceCode
        targetAddressList[0].targetCityCode = newVal.targetCityCode
        targetAddressList[0].targetCountyCode = newVal.targetCountyCode
        targetAddressList[0].targetProvinceName = newVal.targetProvinceName
        targetAddressList[0].targetCityName = newVal.targetCityName
        targetAddressList[0].targetCountyName = newVal.targetCountyName
    })

const rules = reactive({
    feeNo: [
        { required: true, message: '输入框不能为空', trigger: 'blur' }
        // { min: 0, max: 30, message: '输入长度不符', trigger: 'blur' }
    ],
    feeName: [
        { required: true, message: '输入框不能为空', trigger: 'blur' }
        // { min: 0, max: 30, message: '输入长度不符', trigger: 'blur' }
    ],
    firstWeightStr: [
        { required: true, message: '首重重量不能为空', trigger: 'blur' }
    ],
    firstWeightPriceStr: [
        { required: true, message: '首重价格不能为空', trigger: 'blur' }
    ],
    weightCalType: [
        {
            required: true,
            message: '重量进位制不能为空',
            trigger: 'change'
        }
    ],
    //
    otherWeightStr: [
        { required: true, message: '续重重量不能为空', trigger: 'blur' }
    ],
    otherWeightPriceStr: [
        { required: true, message: '续重价格不能为空', trigger: 'blur' }
    ],
    priceCalType: [
        {
            required: true,
            message: '价格进位制不能为空',
            trigger: 'change'
        }
    ]
})
// modify 修改 toexamine 审核 deactivate 停用 enable 启用
// 校验 确认/通过按钮
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!通过校验')
            operateType.value = 2
            addDeliveryFeeDetail()
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 取消
const cancel = () => {
    goout()
}

const goout = () => {
    router.go(-1)
}

onMounted(() => {
    getDeliveryFeeDetail()
    // setTimeout(() => {
    //     targetAddressList.targetProvinceCode = ruleForm.targetProvinceCode
    //     targetAddressList.targetCityCode = ruleForm.targetCityCode
    //     targetAddressList.targetCountyCode = ruleForm.targetCountyCode
    //     console.log(targetAddressList)
    // }, 300)
})

// 查询报价单明细详情
const getDeliveryFeeDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            id: props.id,
            feeNo: props.feeNo
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11773469736980480',
        name: '查询报价单明细详情',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    ruleForm.id = data.id
    ruleForm.feeId = data.feeId
    ruleForm.feeNo = data.feeNo // 单号
    ruleForm.feeName = data.feeName // 名称
    //
    ruleForm.srcProvinceName = data.srcProvinceName
    ruleForm.srcProvinceCode = data.srcProvinceCode
    ruleForm.srcCityName = data.srcCityName
    ruleForm.srcCityCode = data.srcCityCode
    ruleForm.srcCountyName = data.srcCountyName || ''
    ruleForm.srcCountyCode = data.srcCountyCode || ''
    //
    ruleForm.targetProvinceName = data.targetProvinceName
    ruleForm.targetProvinceCode = data.targetProvinceCode
    ruleForm.targetCityName = data.targetCityName
    ruleForm.targetCityCode = data.targetCityCode
    ruleForm.targetCountyName = data.targetCountyName || ''
    ruleForm.targetCountyCode = data.targetCountyCode || ''
    //
    ruleForm.firstWeightStr = data.firstWeightStr
    ruleForm.firstWeightPriceStr = data.firstWeightPriceStr
    ruleForm.weightCalType = data.weightCalType
    //
    ruleForm.otherWeightStr = data.otherWeightStr
    ruleForm.otherWeightPriceStr = data.otherWeightPriceStr
    ruleForm.priceCalType = data.priceCalType
}
// 新建(修改)报价单明细
const addDeliveryFeeDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            id: ruleForm.id,
            feeId: ruleForm.feeId,
            feeNo: ruleForm.feeNo, // 单号
            feeName: ruleForm.feeName, // 名称
            //
            srcProvinceName: ruleForm.srcProvinceName,
            srcProvinceCode: ruleForm.srcProvinceCode,
            srcCityName: ruleForm.srcCityName,
            srcCityCode: ruleForm.srcCityCode,
            srcCountyName: ruleForm.srcCountyName || '无',
            srcCountyCode: ruleForm.srcCountyCode || '',
            // 目的地
            targetAddressList: targetAddressList,
            //
            firstWeight: ruleForm.firstWeightStr * 1000,
            firstWeightPrice: ruleForm.firstWeightPriceStr * 100,
            weightCalType: ruleForm.weightCalType,
            //,
            otherWeight: ruleForm.otherWeightStr * 1000,
            otherWeightPrice: ruleForm.otherWeightPriceStr * 100,
            priceCalType: ruleForm.priceCalType,
            operateType: operateType.value,
            creatorId: userInfo.value.id
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11772570847301632',
        name: '新建(修改)报价单明细',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === '200') {
        goout()
        ElMessage({
            message: message,
            type: 'success'
        })
    }
}
</script>
<style lang="scss" scoped>
.input-line {
    width: 170px;
}
.onfunction-btn {
    margin: 0;
    width: 100%;
}
.onfunction-btn ::v-deep(.el-form-item__content) {
    width: 100%;
    margin-top: 50px;
    justify-content: center;
}
</style>
