<template>
    <div class="information-management">
        <el-form :model="form" label-width="150px"  ref="ruleFormRef">
            <el-row>
                <el-col :span="16">
                    <h5>联系人信息</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="姓名" prop="legalName">
                        <el-input v-model="form.legalName" placeholder="请输入～" clearable/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号" prop="phoneMobile">
                        <el-input v-model="form.phoneMobile" placeholder="请输入～" clearable/>
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
                        <el-select v-model="form.tips" clearable multiple placeholder="请选择"  collapse-tags collapse-tags-tooltip>
                            <el-option v-for="el in dataState.masTips" :label="el.tagName" :value="el.id" :key="el.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="16">
                    <h5 class="title-head">经营信息</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="商户类型" label-width="80px" prop="merchantClassify" :rules="rules.busiCode">
                        <el-select v-model="form.merchantClassify" clearable placeholder="请选择"  collapse-tags collapse-tags-tooltip>
                            <el-option v-for="item in merchantClassifyList" :label="item.label" :value="item.value" :key="item.value" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- <el-col :span="8">
                    <el-form-item label="经营属性" label-width="80px" prop="businessProperty" :rules="rules.roleCode">
                        <el-select v-model="form.businessProperty" clearable placeholder="请选择" :disabled="noCan"  >
                            <el-option v-for="el in businessPropertyList" :label="el.businessPropertyName" :value="el.businessProperty" :key="el.businessProperty" />
                        </el-select>
                    </el-form-item>
                </el-col> -->
                <el-col :span="8">
                    <el-form-item label="商户经营类目" prop='goodsTypeName'>
                        <el-cascader ref="applyClassifyRef" v-model="form.busiCatesArr" :props="skuApplyClassify" @change="applyClassifyChange"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5>平台服务费信息</h5>
            <el-row :span="16">
                <el-form-item label="平台服务费: " prop="merchantType">
                    <el-col :span="8"><div>{{form.cost}}</div></el-col>
                </el-form-item>
                <el-form-item label="平台类目佣金费率: " prop="merchantType">
                    <el-col :span="8"><div>{{form.rate}}</div></el-col>
                </el-form-item>
            </el-row>
            <h5>税务信息</h5>
            <el-row :span="16">
                <el-form-item label="发票类型" prop="invoiceType"  :rules="rules.busiCode">
                    <el-col>
                        <el-select v-model="form.invoiceType" clearable placeholder="请选择">
                            <el-option label="普通发票" :value="1" />
                            <el-option label="增值税普通发票" :value="2" />
                            <el-option label="增值税专用发票" :value="3"/>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="税点(%)" prop="taxRate"  :rules="rules.busiCode">
                    <el-col :span="4">
                        <el-input-number v-model="form.taxRate" controls-position="right" @change="handleChange" :min="1" :max="100"></el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="纳税类型" prop="taxType"  :rules="rules.busiCode">
                    <el-col>
                        <el-select v-model="form.taxType" clearable placeholder="请选择">
                            <el-option label="一般纳税人" :value="1" />
                            <el-option label="小规模纳税人" :value="2" />
                        </el-select>
                    </el-col>
                </el-form-item>
            </el-row>
            <h5>经营资质</h5>
            <div v-for="item in form.merchantCertUrlList" :key="item.certName">
                <el-form-item :label="item.certName" prop="permitImg">
                    <!-- <img :src="form.businessLicenseUrl" alt=""> -->
                    <cst-upload :limit="1" :multiple="false" v-model:fileList="item.imgUrl" accept=".jpg,.png,.jpeg" :mediaType="1" @handleAvatarSuccess="fn"></cst-upload>
                </el-form-item>
                <div style="margin-left:130px;font-size:14px;">
                    <p class="chinese-font1">说明：需要提供有效证件，或监管部门认可的具有同等法律效力的其他证件</p>
                    <p class="chinese-font1">1、支持扩展名：jpg、jpeg、png，文件最大不超过2M；</p>
                    <p  class="chinese-font1">2、最多不超过3张图片；</p>
                </div>
            </div>
            <el-form-item>
                <el-button type="primary" plain @click="back">取 消</el-button>
                <el-button type="primary" @click="submitMerchant">提交审核</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup>
import { toRefs, reactive, computed, onMounted, ref, watch } from 'vue'
import CstUpload from '@/components/upload/uploadContract.vue'
import { getMerchantList } from '@/api/operate/index'
import { phoneNoValidator, idCard, regChinese, regNumber, regAccount } from '@/utils/rule.js'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { queryCategory } from '@/utils'
import { tr } from 'element-plus/es/locale'
import { unifiedGatewayPost, unifiedGatewayGet } from '@/api/marketing/marketingApply.js'
const store = useStore()
const router = useRouter()
const userInfo = computed(() => store.state.userInfo)

const props = defineProps(['handleType', 'edit', 'cbState'])
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const noCan = computed(() => props.handleType === 'detail')
const noCanNew = computed(() => props.handleType === 'detailnew')
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
        // 新增
        busiCates: {},
        busiCatesArr: [], // 服务类目
        cost: 1, // 平台服务费
        rate: 1, // 平台类目佣金费率
        taxPoint: 1, // 税点
        merchantCertUrlList: []
    },
    passwordForm: {},
    BusiInfoResVo: [],
    rolelist: [],
    merchantClassifyList: [],
    businessPropertyList: [],
    goodsTypeList: [],
    phoneVerCodeDialog: false,
    verStatus: true,
    phoneNnumber: '123456',
    phoneVer: '',
    invoiceType: 1,
    agreementDialog: false,
    agreementDialogTabTit: ['123', '234'],
    agreementDialogTabCon: ['13123123', '123123123'],
    agreementStatus: true,
    agreementActive: '1',
    agreementDownCount: 11,
    agreementDownCountTest: '',
    agreementDialogTime: null,

    editorPhoneNumDialog: false,
    editorPhone: 'qweqweqweqweq',

    checked: false,
    downloadDialog: false,
    submitStatus: true
})
const { form, BusiInfoResVo, rolelist, goodsTypeList, merchantClassifyList, businessPropertyList } = toRefs(dataState)
const fn = () => {
}
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
    await getMerchantDerail()
    await businesspList()
    await masTips()
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
    legalName: [{ required: true, trigger: 'blur' }],
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
            businessCode: 'A1001000',
            appKey: 'A1001001',
            busiCode: addMerchant.busiCode,
            roleType: 1
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC54632674881867776',
        name: '获取商户类型列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(param)
    console.log(res, 'resresresres')
    res.map((item) => {
        dataState.merchantClassifyList.push({
            value: item.merchantClassify,
            label: item.merchantClassifyName
        })
    })
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
// 平台服务费信息
const getPlatFee = async (data) => {
    const param = {
        body: {
            merchantId: addMerchant.newMerchantId || addMerchant.merchantId,
            busiCode: 'A1001001',
            cateType: 1,
            merchantBusiCateList: [data]
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC56749335831015424',
        name: '查询商家平台费用',
        source: '结算中台'
    }
    const res = await getMerchantList(param)
    form.cost = res.data?.feeTextValue
    form.rate = res.data?.feeCateValue.value
    console.log(res)
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
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
// 应用类目change
const applyClassifyChange = (value) => {
    const form = dataState.form
    dataState.goodsTypeList = applyClassifyRef.value.getCheckedNodes(true)
    // form.busiCates = []
    const re = {
        secondCateList: []
    }
    const fourth = {}
    const third = {}
    const second = {}
    dataState.goodsTypeList.forEach((item) => {
        console.log(item, 'item')
        if (!fourth[item.pathLabels[2]]) {
            fourth[item.pathLabels[2]] = []
        }
        // if (!fourth[item.pathLabels[2]][item.pathLabels[3]]) {
        //     fourth[item.pathLabels[2]][item.pathLabels[3]] = []
        // }
        fourth[item.pathLabels[2]].push(
            {
                fourthCateCode: item.pathValues[3],
                fourthCateName: item.pathLabels[3]
            }
        )

        if (!third[item.pathLabels[1]]) {
            third[item.pathLabels[1]] = []
        }
        // if (!third[item.pathLabels[1]][item.pathLabels[2]]) {
        //     third[item.pathLabels[1]][item.pathLabels[2]] = []
        // }
        third[item.pathLabels[1]].push(
            {
                thirdCateCode: item.pathValues[2],
                thirdCateName: item.pathLabels[2]
            }
        )
        third[item.pathLabels[1]] = [...new Set(third[item.pathLabels[1]].map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item))

        if (!second[item.pathLabels[0]]) {
            second[item.pathLabels[0]] = []
        }
        // if (!second[item.pathLabels[0]][item.pathLabels[1]]) {
        //     second[item.pathLabels[0]][item.pathLabels[1]] = []
        // }
        second[item.pathLabels[0]].push(
            {
                secondCateCode: item.pathValues[1],
                secondCateName: item.pathLabels[1]
            }
        )
        second[item.pathLabels[0]] = [...new Set(second[item.pathLabels[0]].map((item) => JSON.stringify(item)))].map((item) => JSON.parse(item))
        // form.busiCates.push({
        //     busiFirstCateCode: item.pathValues[0],
        //     busiFirstCateName: item.pathLabels[0],
        //     busiSecondCateCode: item.pathValues[1],
        //     busiSecondCateName: item.pathLabels[1],
        //     busiThirdCateCode: item.pathValues[2],
        //     busiThirdCateName: item.pathLabels[2]
        // })
        form.busiCates.firstCateCode = item.pathValues[0]
        form.busiCates.firstCateName = item.pathLabels[0]
    })
    // console.log(dataState.busiCates)
    form.busiCates.secondCateList = []
    let a, b
    for (a in second) {
        for (b in second[a]) {
            form.busiCates.secondCateList.push(
                {
                    secondCateCode: second[a][b].secondCateCode,
                    secondCateName: second[a][b].secondCateName,
                    thirdCateList: [
                        ...third[second[a][b].secondCateName]
                    ]
                }
            )
        }
    }
    getPlatFee(form.busiCates)
    // console.log(form.busiCates, 'rerererererererererer')
}
// 商户录入
const ruleFormRef = ref(null)
const submitMerchant = async () => {
    dataState.form.merchantCertUrlList.map((item) => {
        item.certUrlList = item.imgUrl ? item.imgUrl[0]?.url : ''
        // delete item.imgUrl
    })
    const param = {
        body: {
            appKey: 'A1001000',
            creatorId: userInfo.value.account,
            busiCode: dataState.form.busiCode,
            merchantId: addMerchant.merchantId,
            busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
            phoneMobile: addMerchant.phoneMobile,
            contactName: dataState.form.legalName,
            contactMobile: dataState.form.phoneMobile,
            labels: dataState.form.tips.join(','),
            merchantClassify: dataState.form.merchantClassify,
            merchantBusiCateList: [dataState.form.busiCates],
            invoiceType: dataState.form.invoiceType,
            taxRate: dataState.form.taxRate + '',
            taxType: dataState.form.taxType,
            merchantCertUrlList: dataState.form.merchantCertUrlList
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC54148542616858624',
        name: '商户信息变更提审接口',
        source: '商户中台'
    }
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await unifiedGatewayPost(param)
            if (res) {
                router.push({ name: 'merchant-settle-list', handleType: props.handleType })
            }
        }
    })
}
const getMerchantBusiCateList = (data) => {
    if (data.firstCateCode) {
        const re = []
        data.secondCateList.map((item, index) => {
            re[index] = []
            re[index].push(data.firstCateCode)
            re[index].push(item.secondCateCode)
            item.thirdCateList.map((tItem) => {
                re[index].push(tItem.thirdCateCode)
            })
        })
        return re
    } else {
        return {}
    }
}
// 商户详情
const getMerchantDerail = async (type) => {
    const param = {
        body: {
            busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
            appKey: 'A1001000',
            busiCode: 'A1001001'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC53426212320481280',
        name: '查询商户入驻所有信息详情',
        source: '商户中台'
    }
    const res = await getMerchantList(param)
    if (res) {
        dataState.form.phoneMobile = res.merchantBusiInfo.contactMobile
        dataState.form.legalName = res.merchantBusiInfo.contactName
        if (res.merchantBusiInfo.labelList) {
            res.merchantBusiInfo.labelList.map((item) => {
                dataState.form.tips.push(Number(item.labelId))
            })
        }
    }
    dataState.form.busiCode = res.merchantBusiInfo.busiCode
    dataState.form.merchantClassify = res.merchantDatumInfo.merchantClassify
    dataState.form.busiCatesArr = getMerchantBusiCateList(res.merchantDatumInfo.merchantBusiCateList || {})
    // dataState.form.busiCatesArr = [['PL01', 'PL0103', 'PL010302'], ['PL01', 'PL0103', 'PL010303']]
    dataState.form.invoiceType = res.merchantDatumInfo.invoiceType
    dataState.form.taxRate = res.merchantDatumInfo.taxRate
    dataState.form.taxType = res.merchantDatumInfo.taxType
    dataState.form.merchantCertUrlList = res.merchantDatumInfo.merchantCertUrlList
    dataState.form.merchantCertUrlList.map((item) => {
        if (!item.certUrlList) {
            item.imgUrl = []
        } else {
            item.imgUrl = [{ url: item.certUrlList }]
        }
    })
}
// 上传成功回掉
const handleAvatarSuccess = (n, e) => {
    if (dataState.form[n]) {
        dataState.form[n] = dataState.form[n] + ',' + e.data
    } else {
        dataState.form[n] = e.data
    }
}
// 后退
const back = () => {
    router.push({ name: 'merchant-settle-list', handleType: props.handleType })
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
    .phone-ver-outter{
        margin-top: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        justify-content: space-between;
        .phone-ver-input{
            width: 60%;
            :deep(.el-input__wrapper){
                box-shadow: none;
            }
        }
    }
    .agreement-show{
        margin-top: 50px;
    }
    .submit-btn{
        margin-top: 30px;
    }
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
