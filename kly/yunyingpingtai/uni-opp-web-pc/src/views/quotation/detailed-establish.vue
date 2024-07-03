<template>
    <h3>维护报价明细</h3>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="200px" class="demo-ruleForm" :size="formSize" status-icon :inline="true">
        <el-form-item label="选择报价单号" prop="feeNo">
            <el-input v-model="ruleForm.feeNo" @input="onFeeNo" placeholder="请输入报价单号" />
        </el-form-item>
        <el-form-item label="报价单名称" prop="feeName">
            <el-input v-model="ruleForm.feeName" disabled />
        </el-form-item>
        <el-row>
            <el-col :span="12" justify="start">
                <div class="src-select">
                    <el-form-item label="始发地" prop="srcProvince">
                        <el-select v-model="ruleForm.srcProvince" placeholder="始发省" @change="cahngeProvice" clearable class="input-line">
                            <el-option v-for="el in proviceList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="srcCity">
                        <el-select v-model="ruleForm.srcCity" placeholder="始发市" @change="cahngeCity" clearable class="input-line">
                            <el-option v-for="el in cityList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="srcCountyCode">
                        <el-select v-model="ruleForm.srcCounty" placeholder="始发县" clearable class="input-line">
                            <el-option v-for="el in countyList" :label="el.addressName" :value="{value: el.addressCode,label: el.addressName}" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                </div>
            </el-col>
            <el-col :span="12" justify="start">
                <div class="src-select selectbox">
                    <el-form-item label="目的地" prop="targetProvinceName">
                        <el-select v-model="ruleForm.targetProvinceName" placeholder="目的地省" @change="almcahngeProvice" clearable class="input-line">
                            <el-option v-for="el in almproviceList" :label="el.addressName" :value="{ value: el.addressCode, label: el.addressName }" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="targetCityName">
                        <el-select v-model="ruleForm.targetCityName" placeholder="目的市" @change="almcahngeCity" clearable class="input-line">
                            <el-option v-for="el in almcityList" :label="el.addressName" :value="{ value: el.addressCode, label: el.addressName }" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="targetCountyName">
                        <el-select v-model="ruleForm.targetCountyName" placeholder="目的县" clearable class="input-line">
                            <el-option v-for="el in almcountyList" :label="el.addressName" :value="{ value: el.addressCode, label: el.addressName }" :key="el.addressCode" />
                        </el-select>
                    </el-form-item>
                    <el-button @click="destinationbtn(ruleFormRef)">+</el-button>
                </div>
                <div class="destination">
                    <div v-for="item in destinationarr" :key="item">
                        {{item.targetProvinceName}}/{{item.targetCityName}}<span v-if="item.targetCountyName">/</span>{{item?.targetCountyName ?? ''}}
                        <el-button type="text" @click="deletdest(item)">删除</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-form-item label="首重重量(KG)" prop="firstWeightStr">
            <el-input v-model="ruleForm.firstWeightStr" @keyup="ruleForm.firstWeightStr = oninput(ruleForm.firstWeightStr)" placeholder="首重重量" class="input-line" />
        </el-form-item>
        <el-form-item label="首重价格(元)" prop="firstWeightPriceStr">
            <el-input v-model="ruleForm.firstWeightPriceStr" @keyup="ruleForm.firstWeightPriceStr = oninputprice(ruleForm.firstWeightPriceStr)" placeholder="首重价格" class="input-line" />
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

            <el-input v-model="ruleForm.otherWeightStr" @keyup="ruleForm.otherWeightStr = oninput(ruleForm.otherWeightStr)" placeholder="续重重量" class="input-line" />
        </el-form-item>
        <el-form-item label="续重价格(元)" prop="otherWeightPriceStr">
            <el-input v-model="ruleForm.otherWeightPriceStr" @keyup="ruleForm.otherWeightPriceStr = oninputprice(ruleForm.otherWeightPriceStr)" placeholder="续重价格" class="input-line" />
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
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { Debounce } from '@/components/debounce'

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

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 1:新增，2:修改
const operateType = ref(1)

const formSize = ref('default')
const ruleFormRef = ref()

const ruleForm = reactive({
    id: null,
    feeId: null,
    feeNo: '', // 单号
    feeName: '', // 名称
    // 始发
    srcProvinceName: '',
    srcProvince: '',
    srcCityName: '',
    srcCity: '',
    srcCountyName: '',
    srcCounty: '',
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

const rules = reactive({
    feeNo: [
        {
            required: true,
            message: '单号不能为空',
            trigger: 'change'
        }
    ],
    feeName: [
        {
            required: true,
            message: '单号名称不能为空',
            trigger: 'change'
        }
    ],
    // ---- 省市联机选择
    srcProvince: [
        {
            required: true,
            message: '始发省不能为空',
            trigger: 'change'
        }
    ],
    srcCity: [
        {
            required: true,
            message: '始发市不能为空',
            trigger: 'change'
        }
    ],
    targetProvinceName: [
        {
            required: true,
            message: '目的省不能为空',
            trigger: 'change'
        }
    ],
    targetCityName: [
        {
            required: true,
            message: '目的市不能为空',
            trigger: 'change'
        }
    ],
    // ---- 省市联机选择 ----
    firstWeightStr: [
        { required: true, message: '首重重量不能为空', trigger: 'blur' }
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
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

const getProviceList = async () => {
    const res = await getAllList(1, 0)
    proviceList.value = res.addressList
}
const getAlmProviceList = async () => {
    const res = await getAllList(1, 0)
    almproviceList.value = res.addressList
}
// 始发省 出市
const cahngeProvice = async (val) => {
    ruleForm.srcCityName = ''
    ruleForm.srcCity = ''
    ruleForm.srcCountyName = ''
    ruleForm.srcCounty = ''
    cityList.value = []
    countyList.value = []
    if (ruleForm.srcProvince?.value) {
        const res = await getAllList(2, val.value)
        cityList.value = res.addressList
    }
}
// 始发市 出县
const cahngeCity = async (val) => {
    ruleForm.srcCountyName = ''
    ruleForm.srcCounty = ''
    countyList.value = []
    if (ruleForm.srcCity?.value) {
        const res = await getAllList(3, val.value)
        countyList.value = res.addressList
    }
}
// 目的省 出市
const almcahngeProvice = async (val) => {
    ruleForm.targetCityName = ''
    ruleForm.targetCityCode = ''
    ruleForm.targetCountyName = ''
    ruleForm.targetCountyCode = ''
    almcityList.value = []
    almcountyList.value = []
    if (ruleForm.targetProvinceName) {
        const res = await getAllList(2, val.value)
        almcityList.value = res.addressList
    }
}
// 目的市 出县
const almcahngeCity = async (val) => {
    ruleForm.targetCountyName = ''
    ruleForm.targetCountyCode = ''
    almcountyList.value = []
    if (ruleForm.targetCityName) {
        const res = await getAllList(3, val.value)
        almcountyList.value = res.addressList
    }
}

// 目的地
const destinationarr = ref([])
// 目的地添加按钮
const destinationbtn = async (formEl) => {
    ruleFormRef.value.validateField(['targetProvinceName', 'targetCityName'])
    // 县
    const Countys = destinationarr.value.map(el => el.targetCountyCode).includes(ruleForm.targetCountyName?.value ?? '')
    // 市
    const city = destinationarr.value.map(el => el.targetCityCode).includes(ruleForm.targetCityName?.value ?? '')
    // 有县为空
    const CountysN = destinationarr.value.map(el => el.targetCountyCode).includes('')
    const citycounty = city && CountysN
    const citycountybehind = city && !ruleForm.targetCountyName?.value
    let flag = true
    if (Countys) {
        if (city) {
            flag = false
        }
    } else {
        if (city && citycounty) {
            flag = false
            if (Countys) {
                flag = true
            }
        }
    }
    if (citycountybehind) {
        flag = false
    }
    if (ruleForm.targetProvinceName?.value && ruleForm.targetCityName?.value) {
        if (flag) {
            destinationarr.value.push(
                {
                    targetProvinceName: ruleForm.targetProvinceName?.label ?? '',
                    targetProvinceCode: ruleForm.targetProvinceName?.value ?? '',
                    targetCityName: ruleForm.targetCityName?.label ?? '',
                    targetCityCode: ruleForm.targetCityName?.value ?? '',
                    targetCountyName: ruleForm.targetCountyName?.label ?? '',
                    targetCountyCode: ruleForm.targetCountyName?.value ?? ''
                })
        }
    }
}
// 目的地删除
const deletdest = (val) => {
    destinationarr.value.forEach((el, index) => {
        if (el.targetProvinceCode === val.targetProvinceCode && el.targetCityCode === val.targetCityCode && el.targetCountyCode === val.targetCountyCode) {
            destinationarr.value.splice(index, 1)
        }
    })
}

const onFeeNo = Debounce(() => {
    if (!ruleForm.feeNo) return
    queryFeeByNo()
})

onMounted(async () => {
    // 省选择框
    await getProviceList()
    await getAlmProviceList()

    const destlist = JSON.parse(localStorage.getItem('destinationarr') || '[]')
    destinationarr.value = destlist
    handleScroll()
})
// 页面刷新监听事件
function handleScroll () {
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('destinationarr', JSON.stringify(destinationarr.value))
    })
}
onBeforeUnmount(() => {
    localStorage.setItem('destinationarr', JSON.stringify([]))
    window.removeEventListener('beforeunload', () => {})
})

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            operateType.value = 1
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
        modifierId: store.state?.userInfo?.account ?? '',
        operatorId: store.state?.userInfo?.account ?? '',
        operatorName: store.state?.userInfo?.name ?? ''

    }
    const res = await getMerchantList(param)
    return res
}
// 根据报价单编号查询报价单
const queryFeeByNo = async () => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            feeNo: ruleForm.feeNo
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC11771945740816384',
        name: '根据报价单编号查询报价单',
        source: '运单中台',
        modifierId: store.state?.userInfo?.account ?? '',
        operatorId: store.state?.userInfo?.account ?? '',
        operatorName: store.state?.userInfo?.name ?? ''

    }
    const data = await getMerchantList(param)
    ruleForm.feeName = data?.feeName ?? '此单号无效，请重新输入'
    ruleForm.feeId = data?.feeId ?? null
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
            srcProvinceName: ruleForm.srcProvince.label,
            srcProvinceCode: ruleForm.srcProvince.value,
            srcCityName: ruleForm.srcCity.label,
            srcCityCode: ruleForm.srcCity.value,
            srcCountyName: ruleForm.srcCounty?.label ?? '',
            srcCountyCode: ruleForm.srcCounty?.value ?? '',
            // 目的地
            targetAddressList: destinationarr.value,
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
    const { code } = await getMerchantListCode(params)
    if (code === '200') {
        goout()
    }
}
</script>
<style lang="scss" scoped>
.src-select {
    display: flex;
}

.src-select ::v-deep(.el-form-item) {
    margin-right: 0!important;
}
.destination {
    font-size: 14px;
    color: #a8abb1;
    border: 1px solid #dddfe5;
    margin: 10px 0 10px 200px;
    padding: 5px;
    height: 100px;
    overflow-y: scroll;
}
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
