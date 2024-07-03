<template>
    <div class="information-management">
        <el-form :model="form" label-width="150px"  ref="ruleFormRef">
            <el-row>
                <el-col :span="12">
                    <h5 class="title-head">入驻业务线和角色</h5>
                </el-col>
                <!-- <el-col :span="6">
                    <h5 class="title-head">经营品类</h5>
                </el-col> -->
                <!-- <el-col :span="6">
                    <h5 class="title-head">所属城市</h5>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="业务线" label-width="80px" prop="busiCode" :rules="rules.busiCode">
                        <el-select v-model="form.busiCode" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip @change="cahngeBusi" :disabled="noCan" class="form-action-item-50w">
                            <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="角色" label-width="80px" prop="roleCode" :rules="rules.roleCode">
                        <el-select v-model="form.roleCode" clearable placeholder="请选择" :disabled="noCan" class="form-action-item-50w">
                            <el-option v-for="el in rolelist" :label="el.roleName" :value="el.roleCode" :key="el.roleCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="6">
                    <el-form-item label="商品品类" label-width="100px" prop='goodsTypeName'>
                        <el-cascader ref="applyClassifyRef" :props="skuApplyClassify" @change="applyClassifyChange"/>
                    </el-form-item>
                </el-col> -->
            </el-row>
            <el-row>
                <el-col :span="6">
                    <el-form-item label="商户类型" label-width="80px" prop="merchantClassify" :rules="rules.busiCode" v-if="merchantClassifyList.length>0">
                        <el-select v-model="form.merchantClassify" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip :disabled="noCan" class="form-action-item-50w" @change="cahngeProperty">
                            <el-option v-for="el in merchantClassifyList" :label="el.merchantClassifyName" :value="el.merchantClassify" :key="el.merchantClassify" />
                            <!-- <el-option label="柜主" :value="1" v-if="form.busiCode === 'A1001002'"/>
                            <el-option label="厂商" :value="2" v-if="form.busiCode === 'A1001002'"/>
                            <el-option label="批发商" :value="3" v-if="form.busiCode === 'A1001002'"/>
                            <el-option label="平台商家" :value="4" v-if="form.busiCode === 'A1001007'"/> -->
                            <!-- <el-option label="补货员" :value="4" /> -->
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="经营属性" label-width="80px" prop="businessProperty" :rules="rules.roleCode" v-if="businessPropertyList.length >0">
                        <el-select v-model="form.businessProperty" clearable placeholder="请选择" :disabled="noCan" class="form-action-item-50w"  >
                            <el-option v-for="el in businessPropertyList" :label="el.businessPropertyName" :value="el.businessProperty" :key="el.businessProperty" />
                            <!-- <el-option label="自营" :value="1" />
                            <el-option label="加盟" :value="2" /> -->
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5>填写商户主体信息</h5>
            <el-form-item label="商户主体类型" prop="merchantType"  :rules="rules.merchantType">
                <el-col :span="6">
                    <el-select v-model="form.merchantType" clearable placeholder="请选择" :disabled="noCan" class="form-action-item-50w">
                        <el-option label="企业" :value="1" />
                    <!-- <el-option label="自然人" :value="2" />
                    <el-option label="个人工商户" :value="3"/>
                    <el-option label="事业单位" :value="4" /> -->
                    </el-select>
                </el-col>

            </el-form-item>
            <el-form-item label="企业名称" prop="merchantName" :rules="rules.merchantName" >
                <el-col :span="10">
                    <el-input v-model="form.merchantName" placeholder="请输入～" clearable :disabled="noCan" class="form-action-item-50w"/>
                </el-col >
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="统一社会信用代码" prop="uniqueCode"  :rules="rules.uniqueCode">
                        <el-input v-model="form.uniqueCode" placeholder="请输入～" clearable :disabled="noCan" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="企业注册时间" prop="regDate" :rules="rules.regDate" class="form-action-item-50w">
                <el-date-picker
                    v-model="form.regDate"
                    type="date"
                    placeholder="注册时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    :disabled="noCan"
                />
            </el-form-item>
            <el-form-item label="营业执照照片上传" prop="businessLicenseUrl" :rules="rules.businessLicenseUrl">
                <!-- <img :src="form.businessLicenseUrl" alt=""> -->
                <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="businessLicenseUrl" :imgList="form.businessLicenseUrl"  :disabled='noCan' class="form-action-item-50w"/>
            </el-form-item>
            <div style="margin-left:130px;font-size:14px;">
                <p class="chinese-font1">1、照片必须为彩色扫描或彩色图片</p>
                <p  class="chinese-font1">2、图片仅支持BMP、JPG、JPEG、RNG格式,大小不超过2MB</p>
            </div>
            <el-row>
                <el-col :span="6">
                    <h5>法人/销售信息</h5>
                </el-col>
            </el-row>
            <el-form-item label="" prop="merchUserType"  :rules="rules.merchUserType">
                <el-radio-group v-model="form.merchUserType"  :disabled="noCan" class="form-action-item-50w">
                    <el-radio :label="1">法人</el-radio>
                    <el-radio :label="2">销售</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名" prop="legalName" :rules="rules.legalName">
                        <el-input v-model="form.legalName" placeholder="请输入～" clearable :disabled="noCan" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机号" prop="phoneMobile" :rules="rules.phoneMobile">
                        <el-input v-model="form.phoneMobile" placeholder="请输入～" clearable :disabled="noCan" class="form-action-item-50w"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="证件类型" prop="certificateType">
                <!-- <el-select v-model="form.certificateType" clearable placeholder="请选择" :disabled="noCan">
                    <el-option label="身份证" :value="1" />
                    <el-option label="户口本" :value="2" />
                </el-select> -->
                <span>身份证</span>
            </el-form-item>
            <el-form-item label="证件号码" prop="certificateNo" :rules="rules.certificateNo">
                <el-col :span="10">
                    <el-input v-model="form.certificateNo" placeholder="请输入～" clearable :disabled="noCan" class="form-action-item-50w"/>
                </el-col>
            </el-form-item>
            <el-form-item label="身份证照片上传">
                <el-row>
                    <el-col :span="12">
                        <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="IdcardFrontUrl" :imgList="form.IdcardFrontUrl" :disabled='noCan' class="form-action-item-50w"/>
                        <p style="color: #FF4D51;">身份证人像面照片</p>
                    </el-col>
                    <el-col :span="12">
                        <Upload :num="1"  @delImage = 'delImage' @handleAvatarSuccess= 'handleAvatarSuccess' dom="IdCardReverseUrl" :imgList="form.IdCardReverseUrl" :disabled='noCan' class="form-action-item-50w"/>
                        <p style="color: #FF4D51;">身份证人背面照片</p>
                    </el-col>
                </el-row>
            </el-form-item>
            <div style="margin-left:130px;font-size:14px;">
                <p class="chinese-font1">1、照片必须为彩色扫描或彩色图片</p>
                <p  class="chinese-font1">2、图片仅支持BMP、JPG、JPEG、RNG格式,大小不超过2MB</p>
            </div>
            <el-form-item label="" v-if="props.handleType !== 'detail'">
                <el-button type="primary" @click="submitMerchant(ruleFormRef)">提交审核</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { toRefs, reactive, computed, onMounted, ref } from 'vue'
import Upload from '@/components/upload'
import { getMerchantList } from '@/api/operate/index'
import { phoneNoValidator, idCard, regChinese, regNumber, regAccount } from '@/utils/rule.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { queryCategory } from '@/utils'

const store = useStore()
const router = useRouter()
const userInfo = computed(() => store.state.userInfo)

const props = defineProps(['handleType', 'busiMerchantId', 'busiMerchantStatus'])
const noCan = computed(() => props.handleType === 'detail')
const dataState = reactive({
    form: {
        busiCode: '',
        roleCode: '',
        goodsTypeCode: '',
        merchantType: '',
        regName: '',
        uniqueCode: '',
        regDate: '',
        businessLicenseUrl: '',
        merchUserType: '',
        legalName: '',
        phoneMobile: '',
        certificateType: '',
        certificateNo: '',
        IdcardFrontUrl: '',
        IdCardReverseUrl: '',
        businessProperty: '', // 经营属性
        merchantClassify: '', //	商户类型 1-柜主 2-厂商 3-批发商
        busiCates: []

    },
    passwordForm: {},
    BusiInfoResVo: [],
    rolelist: [],
    merchantClassifyList: [],
    businessPropertyList: [],
    goodsTypeList: []

})
const { form, BusiInfoResVo, rolelist, goodsTypeList, merchantClassifyList, businessPropertyList } = toRefs(dataState)

// 手机号校验
const validphone = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入正确的用户11位手机号～')) }
    if (!phoneNoValidator(value)) return callback(new Error('请输入正确的用户11位手机号～'))
    if (value.length !== 11) return callback(new Error('请输入正确的用户11位手机号～'))
    callback()
}
// 身份证校验
const validIDcard = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入身份证号码～')) }
    if (!idCard(value)) return callback(new Error('请输入正确的身份证号码～'))
    callback()
}
// 文字校验
const validChinese = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入汉字～')) }
    if (!regChinese(value)) { return callback(new Error('请输入汉字～')) }
    callback()
}
// 数字校验
const validNumber = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入数字～')) }
    if (!regNumber(value)) return callback(new Error('请输入数字～'))
    callback()
}
// 数字+字母
const validAccount = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入数字或字母～')) }
    if (!regAccount(value)) return callback(new Error('请输入数字或字母～'))
    callback()
}
const novalidChinese = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入～')) }
    if (regAccount(value)) return callback(new Error('请输入正确的企业名称'))
    callback()
}

onMounted(async () => {
    if (props.handleType !== 'add') {
        await getMerchantDerail(props.busiMerchantId)
    } else {

    }
    await businesspList()
})
// 表单项规则
const rules = reactive({
    busiCode: [{ required: true, message: '请选择', trigger: 'change' }],
    roleCode: [{ required: true, message: '请选择', trigger: 'change' }],
    goodsTypeCode: [{ required: true, message: '请选择', trigger: 'change' }],
    merchantType: [{ required: true, message: '请选择', trigger: 'change' }],
    merchantName: [{ required: true, message: '请输入企业名称', trigger: 'change' }],
    businessLicenseUrl: [{ required: true, message: '请选择', trigger: 'change' }],
    merchUserType: [{ required: true, message: '请选择', trigger: 'change' }],
    uniqueCode: [{ required: true, validator: validAccount, trigger: 'blur' }],
    legalName: [{ required: true, validator: validChinese, trigger: 'blur' }],
    phoneMobile: [{ required: true, validator: validphone, trigger: 'blur' }],
    regName: [{ required: true, validator: validChinese, trigger: 'blur' }],
    regDate: [{ required: true, message: '请选择企业注册时间', trigger: 'change' }]

})
// const showimg = (url) => {
//     dialogVisible.value = true
//     dataState.dialogImageUrl = url
// }

// 查询业务线
const businesspList = async () => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            roleType: 1
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657884654291RUuhQ',
        name: '查询业务线列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(param)
    dataState.BusiInfoResVo = res
    console.log(dataState.form.busiCode, 'dataState.form.busiCode')
    if (dataState.form.busiCode) {
        dataState.BusiInfoResVo.map(item => {
            if (dataState.form.busiCode === item.busiCode) {
                dataState.rolelist = item.roles
                dataState.merchantClassifyList = item.merchantClassifyList
            }
        })
        dataState.merchantClassifyList.map(el => {
            if (dataState.form.merchantClassify === el.merchantClassify) {
                dataState.businessPropertyList = el.businessPropertyList
            }
        })
    }
}

// 业务线查询
const cahngeBusi = async (val) => {
    dataState.rolelist = []
    dataState.merchantClassifyList = []
    dataState.businessPropertyList = []
    if (val) {
        dataState.BusiInfoResVo.map(item => {
            if (val === item.busiCode) {
                dataState.rolelist = item.roles
                dataState.merchantClassifyList = item.merchantClassifyList
            }
        })
    }
    dataState.form.merchantClassify = ''
}
const cahngeProperty = (val) => {
    if (val) {
        dataState.merchantClassifyList.map(item => {
            if (val === item.merchantClassify) {
                dataState.businessPropertyList = item.businessPropertyList
            }
        })
    }
}
// 查询业务线
const getrolelist = async (val) => {
    const param = {
        body: {
            businessCode: val,
            appKey: 'A1001001',
            busiCode: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657597210662FSEfM',
        name: '业务线角色级联查询',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(param)
    if (res) {
        dataState.rolelist = res.map(item => {
            return {
                roleName: item.roleName,
                roleCode: item.roleCode
            }
        })
    }
}

// 商品品类
// 应用类目联动
const applyClassifyRef = ref(null)
const skuApplyClassify = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
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
// 应用类目change
const applyClassifyChange = (value) => {
    dataState.goodsTypeList = applyClassifyRef.value.getCheckedNodes(true)
    form.busiCates = []
    dataState.applyClassifyCheckedNodes.forEach((item) => {
        form.busiCates.push({
            busiFirstCateCode: item.pathValues[0],
            busiFirstCateName: item.pathLabels[0],
            busiSecondCateCode: item.pathValues[1],
            busiSecondCateName: item.pathLabels[1],
            busiThirdCateCode: item.pathValues[2],
            busiThirdCateName: item.pathLabels[2]
        })
    })
    // console.log(dataState.busiCates)
}
// 商户录入
const ruleFormRef = ref(null)
const submitMerchant = async () => {
    const certDetailReqVOList = []
    certDetailReqVOList.push({
        // certificateType: dataState.form.certificateType,
        certificateType: 1,
        certificateNo: dataState.form.certificateNo,
        idCardFrontUrl: dataState.form.IdcardFrontUrl,
        idCardReverseUrl: dataState.form.IdCardReverseUrl
    })
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            businessCode: 'A1001001',
            merchantSource: 3,
            merchantClassify: dataState.form.merchantClassify,
            businessProperty: dataState.form.businessProperty,
            goodsTypeCode: dataState.form.goodsTypeCode,
            merchantType: dataState.form.merchantType,
            merchantName: dataState.form.merchantName,
            uniqueCode: dataState.form.uniqueCode,
            regDate: dataState.form.regDate,
            businessLicenseUrl: dataState.form.businessLicenseUrl,
            legalName: dataState.form.legalName,
            phoneMobile: dataState.form.phoneMobile,
            certDetailReqVOList,
            merchUserType: dataState.form.merchUserType,
            businessAttrVo: {
                businessCode: dataState.form.busiCode,
                roleCode: dataState.form.roleCode
            }
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (props.handleType === 'add') {
        param.configCode = 'UC1657589207027VKUZE'
        param.name = '商户信息录入'
        param.source = '商户中台'
    } else if (props.handleType === 'edit') {
        param.configCode = 'UC1657596318890dDOqr'
        param.name = '商户信息修改接口'
        param.source = '商户中台'
        param.body.busiMerchantId = dataState.form.busiMerchantId
        // param.body.busiMerchantStatus = dataState.form.busiMerchantStatus
        param.body.busiMerchantStatus = 2
    }
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            await getMerchantList(param)
            ElMessage({
                message: '录入成功',
                type: 'success'
            })
            router.push({ name: 'merchant-settle-list' })
        }
    })
}

// 商户详情
const getMerchantDerail = async (id) => {
    const param = {
        body: {
            busiMerchantId: id,
            businessCode: 'A1001001',
            appKey: 'A1001000',
            busiCode: 'A1001001'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657593710597AS3QX',
        name: '商户信息详情',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    Object.assign(dataState.form, res)
    // if (res.businessAttrVo.businessCode !== null) {
    //     await getrolelist(res.businessAttrVo.businessCode)
    // }
    dataState.form.busiCode = res.businessAttrVo.businessCode
    dataState.form.roleCode = res.businessAttrVo.roleCode
    dataState.form.legalName = res.legalName
    dataState.form.certificateNo = res.certDetailResVOList[0].certificateNo
    dataState.form.IdcardFrontUrl = res.certDetailResVOList[0].idCardFrontUrl
    dataState.form.IdCardReverseUrl = res.certDetailResVOList[0].idCardReverseUrl
}
// 上传成功回掉
const handleAvatarSuccess = (n, e) => {
    if (dataState.form[n]) {
        dataState.form[n] = dataState.form[n] + ',' + e.data
    } else {
        dataState.form[n] = e.data
    }
}
// 删除图片
const delImage = (n, i) => {
    const old = dataState.form[n]
    const arr = old.split(',')
    arr.splice(i, 1)
    const str = arr.length === 0 ? '' : arr.toString()
    dataState.form[n] = str
    console.log(dataState.form.businessLicenseUrl, 'dataState')
}
</script>
<style lang="scss" scoped>
.information-management{
    .title-head{
        line-height:50px;
    }
     .form-action-item-50w{
            width: 50%;
        }
        .form-action-item-100w{
            width: 100%;
        }

}
</style>
