<template>
    <div class="information-management">
        <tabsPage :handleType="props.handleType" :cb="submitMerchant1" type=2></tabsPage>
        <el-steps :active="2" align-center v-if="props.handleType==='add'">
            <el-step title="填写认证信息"></el-step>
            <el-step title="选择经营业务"></el-step>
            <el-step title="提交申请资料"></el-step>
            <el-step title="平台审核"></el-step>
        </el-steps>
        <el-form :model="form" label-width="150px"  ref="ruleFormRef">
            <el-row>
                <el-col :span="16">
                    <h5 class="title-head">业务信息</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="业务线" prop="busiCode" :rules="rules.busiCode">
                        <el-select v-model="form.busiCode" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip @change="cahngeBusi" :disabled="noCan||noCanNew">
                            <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="销售人员推广码" prop="roleCode">
                        <el-input v-model="form.roleCode" placeholder="请输入～" clearable :disabled="noCan||noCanNew" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <h5>联系人信息</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="legalName">
                        <el-input v-model="form.legalName" placeholder="请输入～" clearable :disabled="noCan||noCanNew"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号" prop="phoneMobile">
                        <el-input v-model="form.phoneMobile" placeholder="请输入～" clearable :disabled="noCan||noCanNew"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <h5>主体标签</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="主体标签" prop="legalName">
                        <el-select v-model="form.tips" clearable multiple placeholder="请选择"  collapse-tags collapse-tags-tooltip @change="cahngeBusi" :disabled="noCan||noCanNew">
                            <el-option v-for="el in dataState.masTips" :label="el.tagName" :value="el.id" :key="el.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="" v-if="props.handleType==='add' || props.handleType==='editnew'">
                <el-button type="primary" plain @click="prveStep">上一步</el-button>
                <el-button type="primary" @click="submitMerchant(0)">保存</el-button>
                <el-button type="primary" @click="submitMerchant(1)">下一步</el-button>
            </el-form-item>
        </el-form>
        <div>
            <!-- <SubmitLife v-if="addMerchant.busiCode==='A1001010'"></SubmitLife> -->
            <!-- <SubmitSuppliers v-if="addMerchant.busiCode==='A1001009'" :edit="true" :cbState="cbState" :handleType="handleType"></SubmitSuppliers> -->
            <SubmitContainer v-if="addMerchant.busiCode==='A1001002'" :handleType="handleType"></SubmitContainer>
            <SubmitB2B v-else-if="addMerchant.busiCode==='A1001006'||addMerchant.busiCode==='A1001009'||addMerchant.busiCode==='A1001005'||addMerchant.busiCode==='A1001001'||addMerchant.busiCode==='A1001011'" :handleType="handleType"></SubmitB2B>
            <SubmitLife :handleType="handleType" v-else></SubmitLife>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, computed, onMounted, ref } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { phoneNoValidator, idCard, regChinese, regNumber, regAccount } from '@/utils/rule.js'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { queryCategory } from '@/utils'
import tabsPage from './comments/tabsPage.vue'
import SubmitLife from './comments/submit-life.vue'
import SubmitSuppliers from './comments/submit-suppliers.vue'
import SubmitContainer from './comments/submit-container.vue'
import SubmitB2B from './comments/submit-b2b.vue'
const store = useStore()
const router = useRouter()
const route = useRoute()
const userInfo = computed(() => store.state.userInfo)
const merchantId = ref(route.params.merchantId)
const merchantType = ref(route.params.merchantType)
const props = defineProps(['handleType', 'busiMerchantId'])
const noCan = computed(() => props.handleType === 'detail')
const noCanNew = computed(() => props.handleType === 'detailnew' || props.handleType === 'confirm')
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const dataState = reactive({
    form: {
        busiCode: '',
        roleCode: '',
        legalName: '',
        phoneMobile: '',
        tips: []
    },
    passwordForm: {},
    BusiInfoResVo: [],
    rolelist: [],
    merchantClassifyList: [],
    businessPropertyList: [],
    goodsTypeList: [],
    masTips: []

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
        await getMerchantDerail(addMerchant.busiMerchantId)
    } else {

    }
    await businesspList()
    // await masTips()
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
// 主体标签
const masTips = async () => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: addMerchant?.busiCode || dataState.form.busiCode,
            roleType: 1
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC53144788417810432',
        name: '主体标签可用列表',
        source: '商户中台'
    }
    const res = await getMerchantList(param)
    dataState.masTips = res
}
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
        await masTips()
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
        await masTips()
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
const submitMerchant = async (type) => {
    // const certDetailReqVOList = []
    // certDetailReqVOList.push({
    //     // certificateType: dataState.form.certificateType,
    //     certificateType: 1,
    //     certificateNo: dataState.form.certificateNo,
    //     idCardFrontUrl: dataState.form.IdcardFrontUrl,
    //     idCardReverseUrl: dataState.form.IdCardReverseUrl
    // })
    // busiCode: '',
    //     roleCode: '',
    //     legalName: '',
    //     phoneMobile: '',
    //     tips: ''
    const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: dataState.form.busiCode,
            merchantId: addMerchant.parentMerchantId || addMerchant.merchantId,
            merchantType: addMerchant.merchantType + '',
            isCheckParam: 1,
            busiMerchantId: addMerchant.busiMerchantId || addMerchant.newbusiMerchantId,
            promoCode: dataState.form.roleCode,
            contactName: dataState.form.legalName,
            contactMobile: dataState.form.phoneMobile,
            labels: dataState.form.tips.join(','),
            phoneMobile: addMerchant.phoneMobile
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: '创建或更新商户入驻业务信息',
        configCode: 'UC53423393014190080',
        source: '商户中台'
    }
    // if (props.handleType === 'add') {
    //     param.configCode = 'UC53423393014190080'
    // } else {
    //     param.configCode = 'UCJH56518274614194176'
    // }
    if (props.handleType === 'editnew' || props.handleType === 'add' || props.handleType === 'edit') {
        ruleFormRef.value.validate(async (valid) => {
            if (valid) {
                const res = await getMerchantList(param)
                addMerchant.busiCode = dataState.form.busiCode
                if (res.busiMerchantId) {
                    addMerchant.busiMerchantId = res.busiMerchantId
                }
                sessionStorage.removeItem('addMerchant')
                sessionStorage.setItem('addMerchant', JSON.stringify(addMerchant))
                if (type === 1) {
                    if (props.handleType === 'editnew' || props.handleType === 'edit') {
                        router.push({ name: 'submit-apply', params: { handleType: props.handleType } })
                    } else {
                        router.push({ name: 'submit-apply', params: { handleType: 'add' } })
                    }
                }
            }
        })
    } else if (props.handleType === 'detailnew') {
        router.push({ name: 'submit-apply', params: { handleType: props.handleType } })
    } else {
        router.push({ name: 'submit-apply', params: { handleType: 'add' } })
    }
    // ruleFormRef.value.validate(async (valid) => {
    //     if (valid) {
    //         const res = await getMerchantList(param)
    //         addMerchant.newbusiMerchantId = res.busiMerchantId
    //         sessionStorage.removeItem('addMerchant')
    //         sessionStorage.setItem('addMerchant', JSON.stringify(addMerchant))
    //         if (type === 1) {
    //             router.push({ name: 'submit-apply' })
    //         }
    //     }
    // })
}
const submitMerchant1 = () => {
    // const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
    const list = []
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: dataState.form.busiCode,
            merchantId: addMerchant.merchantId,
            merchantType: addMerchant.merchantType + '',
            isCheckParam: 1,
            busiMerchantId: addMerchant.busiMerchantId || addMerchant.newbusiMerchantId,
            promoCode: dataState.form.roleCode,
            contactName: dataState.form.legalName,
            contactMobile: dataState.form.phoneMobile,
            labels: dataState.form.tips.join(','),
            phoneMobile: addMerchant.phoneMobile
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        name: '创建或更新商户入驻业务信息',
        configCode: 'UC53423393014190080',
        source: '商户中台'
    }
    // if (props.handleType === 'add') {
    //     param.configCode = 'UC53423393014190080'
    // } else {
    //     param.configCode = 'UCJH56518274614194176'
    //     param.name = '商户信息变更提审接口聚合创建人'
    // }
    sessionStorage.removeItem('businessLine')
    sessionStorage.setItem('businessLine', JSON.stringify(param))
}
// 上一步
const prveStep = () => {
    if (props.handleType === 'detailnew') {
        router.push({ name: 'settle-apply-person', params: { handleType: props.handleType } })
    } else {
        router.push({ name: 'settle-apply-person', params: { handleType: 'editnew' } })
    }
}
// 上一步
const prveStepAdd = () => {
    router.push({ name: 'settle-apply-person', params: { handleType: 'editnewAdd' } })
}
// 商户详情
const getMerchantDerail = async (id) => {
    const param = {
        body: {
            busiMerchantId: id,
            merchantId: addMerchant.parentMerchantId || addMerchant.merchantId,
            merchantType: addMerchant.merchantType,
            appKey: 'A1001000',
            busiCode: 'A1001001'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC53423558202658816',
        name: '查询商户入驻业务信息',
        source: '商户中台'
    }
    let res = await getMerchantList(param)
    const businessLine = JSON.parse(sessionStorage.getItem('businessLine'))
    res = businessLine?.body || res
    dataState.form.busiCode = res.busiCode
    dataState.form.roleCode = res.promoCode
    dataState.form.legalName = res.contactName
    dataState.form.phoneMobile = res.contactMobile
    if (res.labels) {
        const labels = res.labels.split()
        labels.map((item) => {
            dataState.form.tips.push(Number(item))
        })
    }
    if (res.labelList) {
        res.labelList.map((item) => {
            dataState.form.tips.push(Number(item.labelId))
        })
    }
    // if (res.businessAttrVo.businessCode !== null) {
    //     await getrolelist(res.businessAttrVo.businessCode)
    // }
    // dataState.form.busiCode = res.businessAttrVo.businessCode
    // dataState.form.roleCode = res.businessAttrVo.roleCode
    // dataState.form.legalName = res.legalName
    // dataState.form.certificateNo = res.certDetailResVOList[0].certificateNo
    // dataState.form.IdcardFrontUrl = res.certDetailResVOList[0].idCardFrontUrl
    // dataState.form.IdCardReverseUrl = res.certDetailResVOList[0].idCardReverseUrl
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
