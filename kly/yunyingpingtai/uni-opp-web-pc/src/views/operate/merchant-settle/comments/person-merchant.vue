<template>
    <div class="basic-container">
        <tabsPage :handleType="props.handleType" :cb="save1" type="1"></tabsPage>
        <el-form :model="form" label-width="150px" ref="ruleFormRef" :rules="rules" :disabled="noCan || noCanNew || isAllowEdit === false">
            <div class="title">
                <p class="title-style">主体信息</p>
            </div>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="企业名称：" prop="merchantName">
                        <el-input v-model="form.merchantName" placeholder="请输入企业名称" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="营业执照类型" prop="businessLicenseType">
                        <el-select v-model="form.businessLicenseType" clearable placeholder="请选择">
                            <el-option label="多证合一营业执照" value="2" />
                            <el-option label="普通营业执照" value="1" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="统一社会信用代码" prop="uniqueCode">
                        <el-input v-model="form.uniqueCode" placeholder="请输入营业执照上的号码" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="7">
                    <el-form-item label="企业注册时间：" prop="regDate">
                        <el-date-picker
                            v-model="form.regDate"
                            type="datetime"
                            placeholder="请输入企业注册时间"
                            value-format="YYYY-MM-DD"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            :default-time="defaultTime"
                            :teleported="false"
                        />
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="企业经营地址：" class="form-action-item-50w" prop="merchAddress">
                        <el-cascader
                            :class="addr[0] ? 'address' : ''"
                            ref="authorityRef"
                            :props="selCitysProp"
                            @change="selCitysChange"
                            v-model="form.limitedCitys"
                            width="100%"
                            v-if="areaRefVisiable"
                            :collapse-tags="true"
                            clearable
                            :disabled="noCan || noCanNew || isAllowEdit === false"
                            :placeholder="addr[0] ? addr.join('/') : '请输入'"
                        />
                        <el-input v-model="form.merchAddress" placeholder="请输入详细地址" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="营业执照：" prop="businessLicenseUrl">
                        <cst-upload :limit="1" :multiple="false" v-model:fileList="form.businessLicenseUrl" accept=".jpg,.png,.jpeg" :disabled="noCan || noCanNew" :mediaType="2" @delete="uploadDel" />
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="组织机构代码证：" props="organizationLicenseUrl">
                        <cst-upload :limit="1" :multiple="false" v-model:fileList="form.organizationLicenseUrl" :disabled="noCan||noCanNew" accept=".jpg,.png,.jpeg" :mediaType="2" @delete="uploadDel" />
                    </el-form-item>
                </el-col> -->
            </el-row>
            <div class="title">
                <p class="title-style">法人信息</p>
            </div>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="姓名：" prop="legalName">
                        <el-input v-model="form.legalName" placeholder="请输入姓名" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="手机号：" prop="legalMobile">
                        <el-input v-model="form.legalMobile" placeholder="请输入手机号" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="证件类型：" prop="certificateType">
                        <!-- <el-input v-model="form.certificateType" placeholder="请输入证件类型" clearable :maxlength="100" /> -->
                        身份证
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="证件号码：" prop="certificateNo">
                        <el-input v-model="form.certificateNo" placeholder="请输入证件号码" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
                <el-col :span="14">
                    <el-form-item label="证件有效期：" prop="validBeginTime">
                        <el-date-picker v-model="form.validBeginTime" type="datetime" value-format="YYYY-MM-DD" placeholder="选择开始时间"></el-date-picker>
                        <el-date-picker v-model="form.validEndTime" type="datetime" value-format="YYYY-MM-DD" placeholder="选择结束时间" :disabled="form.isLongTime || validityPeriod"></el-date-picker>
                        &nbsp;&nbsp;<el-checkbox v-model="form.isLongTime" @change="isLongTime" label="长期有效" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="身份证正面照：" prop="idCardFrontUrl">
                        <cst-upload
                            :limit="1"
                            :multiple="false"
                            v-model:fileList="form.idCardFrontUrl"
                            accept=".jpg,.png,.jpeg"
                            :mediaType="2"
                            @delete="uploadDel"
                            :disabled="noCan || noCanNew || isAllowEdit === false"
                            @handleAvatarSuccess="handleAvatarSuccess3"
                        ></cst-upload>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="身份证背面照：" prop="idCardReverseUrl">
                        <cst-upload
                            :limit="1"
                            :multiple="false"
                            v-model:fileList="form.idCardReverseUrl"
                            accept=".jpg,.png,.jpeg"
                            :mediaType="2"
                            @delete="uploadDel"
                            :disabled="noCan || noCanNew || isAllowEdit === false"
                            @handleAvatarSuccess="handleAvatarSuccess4"
                        />
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="title">
                <p class="title-style">账户信息</p>
            </div>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="账户类型：" prop="batchName">
                        <el-radio-group v-model="form.bindType" class="ml-4" @change="changeBank">
                            <el-radio label="1" size="large">对公</el-radio>
                            <el-radio label="2" size="large">对私（法人银行卡）</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="账户名称：" prop="batchName">
                        <div>{{ form.merchantName }}</div>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="银行账号：" prop="bankNumber">
                        <el-input v-model="form.bankNumber" placeholder="请输入银行账号" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="开户银行：" prop="openBank">
                        <el-select v-model="form.openBank">
                            <el-option v-for="(item, index) in bankNames" :key="index" :label="item.bankName" :value="item.bankName" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label=" 开户银行支行:" prop="bankPhone" v-if="form.bindType == 1">
                        <el-input v-model="form.openBranch" placeholder="请输入银行预留手机号" clearable :maxlength="100" />
                    </el-form-item>
                    <el-form-item label="银行预留手机号：" prop="bankPhone" v-if="form.bindType == 2">
                        <el-input v-model="form.bankPhone" placeholder="请输入银行预留手机号" clearable :maxlength="100" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <!-- <div class="btn">
            <el-button @click="prev">上一步</el-button>
            <el-button @click="save(0)" v-if="isAllowEdit === '' || isAllowEdit">保存</el-button>
            <el-button type="primary" @click="save(1)" v-if="isAllowEdit === '' || isAllowEdit">下一步</el-button>
            <el-button type="primary" @click="next" v-if="isAllowEdit === false">下一步</el-button>
        </div> -->

        <div class="btn" v-if="props.handleType === 'add' || props.handleType === 'editnew'">
            <el-button @click="prev">上一步</el-button>
            <el-button @click="save(0)" v-if="isAllowEdit === '' || isAllowEdit">保存</el-button>
            <el-button type="primary" @click="save(1)" v-if="isAllowEdit === '' || isAllowEdit">下一步</el-button>
            <el-button type="primary" @click="next" v-if="isAllowEdit === false">下一步</el-button>
        </div>
        <div class="btn" v-if="props.handleType === 'detail' || props.handleType === 'edit'">
            <el-button @click="prev1">上一步</el-button>
            <el-button type="primary" plain v-if="props.handleType === 'edit' && (isAllowEdit === '' || isAllowEdit)" @click="save(0)">保存</el-button>
            <el-button type="primary" @click="next" v-if="isAllowEdit === false">下一步</el-button>
        </div>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import CstUpload from '@/components/upload/uploadContract.vue'
import { cityQueryCategory } from '@/utils'
import { unifiedGatewayPost, unifiedGatewayGet } from '@/api/marketing/marketingApply.js'
import tabsPage from './tabsPage.vue'
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
// import { cardocr, cardbin, applyCertSave } from '@/api/merchant-apply.js'
const router = useRouter()
const props = defineProps({
    bindType: String,
    merchantId: String,
    handleType: String
})
const isAllowEdit = ref('')
const reason = ref('')
const bankNames = ref([])
// const bindType = ref(sessionStorage.getItem('bindType'))
const noCan = computed(() => props.handleType === 'detail')
const noCanNew = computed(() => props.handleType === 'detailnew' || props.handleType === 'confirm')
const approval = !!(addMerchant.busiMerchantStatus === 4)
const form = reactive({
    merchantName: '',
    resource: '',
    batchName: '',
    useDate: [],
    limitedCitys: [],
    limitedRegionList: [{}],
    certificateTime: [],
    zhutuList: [],
    businessLicenseUrl: [],
    idCardFrontUrl: [],
    idCardReverseUrl: [],
    organizationLicenseUrl: [],
    openBranch: '',
    isLongTime: false,
    certificateType: '1',
    bindType: '1',
    bankNumber: '',
    validBeginTime: '',
    validEndTime: ''
})
const addr = ref([])
const ruleFormRef = ref(null)
const areaRefVisiable = ref(true)
const validityPeriod = ref(false)
const dataState = reactive({
    form: {
        resource: ''
    }
})
const isLongTime = (val) => {
    form.certificateTime = []
    form.validEndTime = ''
    validityPeriod.value = val
    console.log(val, 'changechangechangechangechange')
}
const apply = async (idNo) => {
    const param = {
        appKey: 'A1001002',
        busiCode: 'A1001002',
        configCode: 'UC56512770320003072',
        name: '卡bin查询接口',
        source: '支付中台',
        body: {
            subProductCode: 'A1008001002',
            productCode: '',
            businessCode: '',
            bankcardNo: idNo
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res.code === '200') {
        form.bankName = res.data.bankName
    }
}
const prev = () => {
    if (props.handleType === 'detailnew') {
        router.push({ name: 'merchant-settle-list', params: { handleType: props.handleType } })
    } else {
        router.push({ name: 'settle-apply', params: { handleType: 'editnew' } })
    }
}
const prev1 = () => {
    if (props.handleType === 'detail') {
        router.push({ name: 'merchant-settle-list', params: { handleType: props.handleType } })
    } else {
        router.push({ name: 'settle-apply', params: { handleType: 'editnew' } })
    }
}
// 下一步
const next = () => {
    router.push({ name: 'business-line-information', params: { result: 'detail' } })
}
const backList = () => {
    router.push({ name: 'merchant-settle-list', handleType: props.handleType })
}
const save = async (type) => {
    console.log('form==', form)
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC53423220426969088',
        name: '创建或更新商户入驻认证信息',
        source: '商户中台',
        body: {
            appKey: 'A1001000',
            merchantType: addMerchant.merchantType,
            merchantName: form.merchantName,
            businessLicenseType: form.businessLicenseType,
            uniqueCode: form.uniqueCode,
            regDate: form.regDate,
            businessLicenseUrl: form.businessLicenseUrl[0]?.url,
            organizationLicenseUrl: form.organizationLicenseUrl[0]?.url,
            provinceCode: form.limitedRegionList[0].provinceCode,
            provinceName: form.limitedRegionList[0].provinceName,
            cityCode: form.limitedRegionList[0].cityCode,
            cityName: form.limitedRegionList[0].cityName,
            countyCode: form.limitedRegionList[0].countyCode,
            countyName: form.limitedRegionList[0].countyName,
            merchAddress: form.merchAddress,
            legalName: form.legalName,
            legalMobile: form.legalMobile,
            certificateType: 1,
            certificateNo: form.certificateNo,
            validBeginTime: form.validBeginTime,
            validEndTime: form.validEndTime,
            // validBeginTime: form.certificateTime[0],
            // validEndTime: form.certificateTime[1],
            isLongTime: form.isLongTime ? 1 : 0,
            idCardFrontUrl: form.idCardFrontUrl[0]?.url,
            idCardReverseUrl: form.idCardReverseUrl[0]?.url,
            bankAcctName: form.merchantName,
            bankNumber: form.bankNumber,
            openBank: form.openBank,
            bankPhone: form.bankPhone,
            openBranch: form.openBranch,
            isCheckParam: type,
            merchantSource: 1,
            bindType: form.bindType,
            phoneMobile: addMerchant.phoneMobile
        }
    }
    if (props.handleType === 'editnew' || props.handleType === 'add' || props.handleType === 'edit') {
        ruleFormRef.value.validate(async (valid) => {
            if (valid) {
                // 保存前先验证银行名称
                if (form.bindType === '2') {
                    const bankName = await apply(form.bankNumber)
                    if (bankName !== form.openBank) {
                        ElMessage({
                            showClose: true,
                            message: '开户银行名称与银行账号不符，请核实',
                            type: 'warning'
                        })
                        return false
                    }
                }
                const res = await unifiedGatewayPost(params)
                if (res) {
                    addMerchant.merchantId = res.data.merchantId
                    addMerchant.merchantType = res.data.merchantType
                    sessionStorage.removeItem('addMerchant')
                    sessionStorage.setItem('addMerchant', JSON.stringify(addMerchant))
                    if (type === 1) {
                        router.push({ name: 'business-line-information', params: { handleType: props.handleType } })
                    }
                }
            }
        })
    } else {
        router.push({ name: 'business-line-information', params: { handleType: props.handleType } })
    }
}
const save1 = () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC53423220426969088',
        name: '创建或更新商户入驻认证信息',
        source: '商户中台',
        body: {
            appKey: 'A1001000',
            merchantType: addMerchant.merchantType,
            merchantName: form.merchantName,
            businessLicenseType: form.businessLicenseType,
            uniqueCode: form.uniqueCode,
            regDate: form.regDate,
            businessLicenseUrl: form.businessLicenseUrl[0]?.url,
            organizationLicenseUrl: form.organizationLicenseUrl[0]?.url,
            provinceCode: form.limitedRegionList[0].provinceCode,
            provinceName: form.limitedRegionList[0].provinceName,
            cityCode: form.limitedRegionList[0].cityCode,
            cityName: form.limitedRegionList[0].cityName,
            countyCode: form.limitedRegionList[0].countyCode,
            countyName: form.limitedRegionList[0].countyName,
            merchAddress: form.merchAddress,
            legalName: form.legalName,
            legalMobile: form.legalMobile,
            certificateType: 1,
            certificateNo: form.certificateNo,
            validBeginTime: form.validBeginTime,
            validEndTime: form.validEndTime,
            // validBeginTime: form.certificateTime[0],
            // validEndTime: form.certificateTime[1],
            isLongTime: form.isLongTime ? 1 : 0,
            idCardFrontUrl: form.idCardFrontUrl[0]?.url,
            idCardReverseUrl: form.idCardReverseUrl[0]?.url,
            bankAcctName: form.merchantName,
            bankNumber: form.bankNumber,
            openBank: form.openBank,
            bankPhone: form.bankPhone,
            openBranch: form.openBranch,
            isCheckParam: 1,
            merchantSource: 1,
            bindType: form.bindType,
            phoneMobile: addMerchant.phoneMobile
        }
    }
    sessionStorage.removeItem('personBusiness')
    sessionStorage.setItem('personBusiness', JSON.stringify(params))
}
// 反序列
const reverseSequence = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC53423060221333504',
        name: '查询商户入驻认证信息',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            merchantType: addMerchant.merchantType,
            phoneMobile: addMerchant.phoneMobile
        }
    }
    let res = await unifiedGatewayPost(params)
    const personBusiness = JSON.parse(sessionStorage.getItem('personBusiness'))
    res = personBusiness?.body || res?.data
    if (res) {
        form.merchantName = res.merchantName
        form.businessLicenseType = res.businessLicenseType ? res.businessLicenseType + '' : ''
        form.uniqueCode = res.uniqueCode
        form.regDate = res.regDate
        res.businessLicenseUrl && form.businessLicenseUrl.push({ url: res.businessLicenseUrl })
        res.organizationLicenseUrl && form.organizationLicenseUrl.push({ url: res.organizationLicenseUrl })
        form.limitedRegionList[0].provinceCode = res.provinceCode
        form.limitedRegionList[0].provinceName = res.provinceName
        form.limitedRegionList[0].cityCode = res.cityCode
        form.limitedRegionList[0].cityName = res.cityName
        form.limitedRegionList[0].countyCode = res.countyCode
        form.limitedRegionList[0].countyName = res.countyName
        addr.value.push(res.provinceName)
        addr.value.push(res.cityName)
        addr.value.push(res.countyName)
        form.merchAddress = res.merchAddress
        form.legalName = res.legalName
        form.legalMobile = res.legalMobile
        // certificateType: 1,
        form.certificateNo = res.certificateNo
        res.isLongTime === 1 ? (form.isLongTime = true) : (form.isLongTime = false)
        form.validBeginTime = res.validBeginTime
        res.isLongTime === 0 && (form.validEndTime = res.validEndTime)
        res.idCardFrontUrl && form.idCardFrontUrl.push({ url: res.idCardFrontUrl })
        res.idCardReverseUrl && form.idCardReverseUrl.push({ url: res.idCardReverseUrl })
        form.merchantName = res.bankAcctName
        form.bankNumber = res.bankNumber
        form.openBank = res.openBank
        form.bankPhone = res.bankPhone
        form.openBranch = res.openBranch
        form.bindType = res.bindType + ''

        if (res.merchantId) {
            checkEdit(res.merchantId)
            getBankList(res.bindType)
        }
    }
}

reverseSequence()

const checkEdit = async (merchantId) => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC78555712025018368',
        name: '校验是否允许编辑商户认证信息',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            merchantId: merchantId,
            merchantType: addMerchant.merchantType
        }
    }
    const res = await unifiedGatewayPost(params)
    if (res.code === '200') {
        isAllowEdit.value = res.data.isAllowEdit
        reason.value = res.data.reason
    }
}

const changeBank = (val) => {
    form.openBank = ''
    getBankList(val)
}

const getBankList = async (bankBizType) => {
    // 对公1/对私2
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC77066995067043840',
        name: '商户入驻-查询银行列表',
        source: '账户中台',
        body: {
            appKey: 'A1001001',
            bankBizType
        }
    }
    const res = await unifiedGatewayPost(params)
    // 添加到form
    if (res.code === '200') {
        bankNames.value = res.data
    }
}

// 调用ocr 识别
const handleAvatarSuccess = async (val, dom, uptype) => {
    console.log('dom==', dom)
    const res = dom
    if (res.code === '200') {
        form.businessLicenseUrl = res.data
    }
}

// 调用ocr 识别
const handleAvatarSuccessBack = async (val, dom, uptype) => {
    const res = dom
    if (res.code === '200') {
        form.organizationLicenseUrl = res.data
    }
}

// 调用ocr 识别
const handleAvatarSuccess3 = async (data) => {
    // form.idCardFrontUrl = data
    const ocrData = await unifiedGatewayPost({
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC56022507929513984',
        name: '身份证ocr识别接口',
        source: '商户PC端',
        body: {
            imageUrl: data
        }
    })

    if (ocrData?.code === '200') {
        form.merchantName = ocrData.data.name
        form.certificateNo = ocrData.data.idCardNo
        form.certificateTime[0] = ocrData.data.idIssueDate
        form.certificateTime[1] = ocrData.data.idExpiryDate
    }
    console.log('ocrData===', ocrData)
}

// 调用ocr 识别
const handleAvatarSuccess4 = async (data) => {
    console.log(123123123123123)
    const ocrData = await unifiedGatewayPost({
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC56022507929513984',
        name: '身份证ocr识别接口',
        source: '商户PC端',
        body: {
            imageUrl1: data
        }
    })

    if (ocrData?.code === '200') {
        form.merchantName = ocrData.data.name
        form.certificateNo = ocrData.data.idCardNo
        form.certificateTime[0] = ocrData.data.idIssueDate
        form.certificateTime[1] = ocrData.data.idExpiryDate
    }
}

// const ruleForm = reactive({
//     merchantName: '',
//     region: '',
//     count: '',
//     date1: '',
//     date2: '',
//     delivery: false,
//     type: [],
//     resource: '',
//     desc: ''
// })

const rules = reactive({
    merchantName: [{ required: true, message: '请输入', trigger: 'blur' }],
    businessLicenseType: [{ required: true, message: '请输入', trigger: 'blur' }],
    uniqueCode: [{ required: true, message: '请输入', trigger: 'blur' }],
    regDate: [{ required: true, message: '请输入', trigger: 'blur' }],
    businessLicenseUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
    organizationLicenseUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
    merchantPhone: [{ required: true, message: '请输入', trigger: 'blur' }],
    // certificateType: [{ required: true, message: '请输入', trigger: 'blur' }],
    certificateNo: [{ required: true, message: '请输入', trigger: 'blur' }],
    certificateTime: [{ required: true, message: '请输入', trigger: 'blur' }],
    idCardFrontUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
    idCardReverseUrl: [{ required: true, message: '请输入', trigger: 'blur' }],
    bankNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
    acctBankName: [{ required: true, message: '请输入', trigger: 'blur' }],
    // bankPhone: [{ required: true, message: '请输入', trigger: 'blur' }]
    merchAddress: [{ required: true, message: '请输入', trigger: 'blur' }],
    validBeginTime: [{ required: true, message: '请输入', trigger: 'blur' }]
})

const authorityRef = ref(null)

// 选择城市联动
const selCitysProp = {
    lazy: true,
    multiple: false,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || 0)
        const nodes = res?.map((item) => {
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
// 选择城市change
const selCitysChange = (value) => {
    dataState.areaCheckedNodes = authorityRef.value.getCheckedNodes(true)
    console.log(dataState.areaCheckedNodes, 'item')
    form.limitedRegionList = []
    dataState.areaCheckedNodes.forEach((item) => {
        form.limitedRegionList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]
        })
    })
}
// 不可配送范围change
const skuAreaChange = (value) => {
    dataState.areaCheckedNodes = authorityRef.value.getCheckedNodes(true)
    form.limitedRegionList = []
    dataState.areaCheckedNodes.forEach((item) => {
        form.limitedRegionList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1],
            countyCode: item.pathValues[2],
            countyName: item.pathLabels[2]
        })
    })
}
// 提
</script>

<style scoped lang="scss">
.basic-container {
    :deep(.address input::placeholder) {
        color: black;
    }
    .title {
        background: #ccc;
        height: 30px;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .title-style {
        background: #969696;
        width: 100px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #ffffff;
        font-weight: bold;
    }
}

.form-action-item-50w {
    :deep(.el-form-item__content) {
        flex-wrap: initial;
        .el-cascader {
            width: 400px;
        }
    }
}
</style>
