<template>
    <div class="information-management">
        <el-form :model="form" label-width="150px"  ref="ruleFormRef">
            <el-row>
                <el-col :span="16">
                    <h5 class="title-head">经营信息</h5>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="商户类型" label-width="80px" prop="merchantClassify" :rules="rules.busiCode">
                        <el-select v-model="form.merchantClassify" clearable placeholder="请选择" @change="getQualification" collapse-tags collapse-tags-tooltip :disabled="noCan||noCanNew|| props.edit">
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
                        <el-cascader ref="applyClassifyRef" v-model="form.busiCatesArr" :props="skuApplyClassify" @change="applyClassifyChange" :disabled="noCan||noCanNew"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <h5 v-if="form.cost.length">平台服务费信息</h5>
            <el-row :span="16">
                <div v-for="item in form.cost" :key="item" style="width:100%">
                    <el-form-item label="平台服务费: " v-if="item.cost" prop="merchantType">
                        <el-col :span="4">
                            {{item.cost}}
                        </el-col>
                    </el-form-item>
                    <el-form-item label="平台类目佣金费率: " prop="merchantType">
                        <el-col :span="12"><div v-for="litem in item.rate" :key="litem">{{litem.text+" :  "+litem.value}}</div></el-col>
                    </el-form-item>
                </div>
            </el-row>
            <h5>税务信息</h5>
            <el-row :span="16">
                <el-form-item label="发票类型" prop="merchantType"  :rules="rules.busiCode">
                    <el-col>
                        <el-select v-model="form.merchantType" clearable placeholder="请选择" :disabled="noCan||noCanNew">
                            <el-option label="普通发票" :value="1" />
                            <el-option label="增值税普通发票" :value="2" />
                            <el-option label="增值税专用发票" :value="3"/>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="税点(%)" prop="taxRate"  :rules="rules.busiCode">
                    <el-col :span="4">
                        <el-input-number v-model="form.taxRate" controls-position="right" @change="handleChange" :min="1" :max="100" :disabled="noCan||noCanNew"></el-input-number>
                    </el-col>
                </el-form-item>
                <el-form-item label="纳税类型" prop="taxType"  :rules="rules.busiCode">
                    <el-col>
                        <el-select v-model="form.taxType" clearable placeholder="请选择" :disabled="noCan||noCanNew">
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
                    <cst-upload :limit="3" :multiple="false" v-model:fileList="item.imgUrl" accept=".jpg,.png,.jpeg" :mediaType="1" :disabled="noCan||noCanNew" @handleAvatarSuccess="fn"></cst-upload>
                </el-form-item>
                <div style="margin-left:130px;font-size:14px;">
                    <p class="chinese-font1">说明：需要提供有效证件，或监管部门认可的具有同等法律效力的其他证件</p>
                    <p class="chinese-font1">1、支持扩展名：jpg、jpeg、png，文件最大不超过2M；</p>
                    <p  class="chinese-font1">2、最多不超过3张图片；</p>
                </div>
            </div>
            <!-- <el-form-item class="agreement-show">
                <el-checkbox v-model="dataState.checked" @change="agreementChecked"></el-checkbox>
                <p style="margin-left:10px;">已阅读并同意<span style="color:#F56C6C;" v-for="item in dataState.agreementDialogTabTit" :key="item" @click="agreementDialog">《{{item}}》</span></p>
            </el-form-item> -->
            <el-form-item label="" class="submit-btn" v-if="props.handleType==='add' || props.handleType==='editnew'">
                <el-button type="primary" plain @click="back">上一步</el-button>
                <el-button type="primary" plain @click="submitMerchant(0)">保存</el-button>
                <!-- :disabled="dataState.submitStatus"  -->
                <el-button type="primary" @click="submitMerchant(1)">发送客户</el-button>
            </el-form-item>
            <el-form-item v-if="props.handleType === 'detail'">
                <el-button type="primary" plain @click="back">上一步</el-button>
                <el-button type="primary" plain v-if="props.handleType === 'edit'" @click="submitMerchant(0)">保存</el-button>
                <el-button type="primary" v-if="addMerchant.busiMerchantStatus !== 1" plain @click="next">下一步</el-button>
            </el-form-item>
            <el-form-item v-if="props.handleType === 'edit'">
                <el-button type="primary" plain @click="back">上一步</el-button>
                <el-button type="primary" plain v-if="props.handleType === 'edit'" @click="submitMerchant(0)">保存</el-button>
                <el-button type="primary" @click="submitMerchant(1)">发送客户</el-button>
            </el-form-item>
        </el-form>
        <!-- 修改手机号弹窗 -->
        <el-dialog
            v-model="dataState.editorPhoneNumDialog"
            width="35%"
            center
            :show-close="false"
        >
            <p style="text-align:center">{{dataState.editorPhone}}</p>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editorPhoneNumDialog">取 消</el-button>
                    <el-button type="primary" @click="submitMerchant(ruleFormRef)">去修改</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 验证码弹窗 -->
        <el-dialog
            v-model="dataState.phoneVerCodeDialog"
            width="35%"
            center
            :show-close="false"
        >
            <!-- <template #title>
                <div class="dialog-title">
                    123123
                </div>
            </template> -->
            <span>需校验您的银行预留手机号进行账户信息认证，验证码已发送到手机 {{dataState.phoneNnumber}}</span>
            <el-row class="phone-ver-outter">
                <el-input class="phone-ver-input" placeholder="请输入验证码" v-model="dataState.phoneVer" maxlength=6 clearable></el-input>
                <el-button type="primary">获取验证码</el-button>
            </el-row>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dataState.phoneVerCode = false">取 消</el-button>
                    <el-button type="primary" :disabled="dataState.verStatus" @click="submitMerchant(ruleFormRef)">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 协议弹窗 -->
        <el-dialog
            v-model="dataState.agreementDialog"
            width="50%"
            center
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-tabs v-model="dataState.agreementActive" type="card">
                <el-tab-pane v-for="(item, index) in dataState.agreementDialogTabTit" :label="item" :key="item">{{dataState.agreementDialogTabCon[index]}}</el-tab-pane>
            </el-tabs>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" :disabled="dataState.agreementStatus" @click="agreementDialog">我已全部阅读并同意{{dataState.agreementDownCountText}}</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 引导弹窗 -->
        <el-dialog
            v-model="dataState.downloadDialog"
            width="50%"
            center
            :close-on-click-modal="false"
            :show-close="false"
        >
            <!-- <p style="text-align:center">请联系商户登录商家PC或下载恒掌柜APP</p>
            <p style="text-align:center">完成信息确认及提交</p> -->
            <p style="text-align:center">{{dataState.signUrl}}</p>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="copyText(dataState.signUrl)">复 制</el-button>
                    <el-button type="primary" @click="closeDownLoadPop">确 认</el-button>
                </span>
            </template>
        </el-dialog>
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
import { queryCategory, queryCategoryByBusiCode } from '@/utils'
import { tr } from 'element-plus/es/locale'
import { unifiedGatewayPost, unifiedGatewayGet } from '@/api/marketing/marketingApply.js'
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()
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
        cost: [], // 平台服务费
        rate: [], // 平台类目佣金费率
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
    signUrl: '',
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
    submitStatus: true,
    applyClassifyListString: []
})
watch(
    () => props.cbState,
    (val) => {
        submitMerchant1()
    }
)
const { form, BusiInfoResVo, rolelist, goodsTypeList, merchantClassifyList, businessPropertyList } = toRefs(dataState)
// 协议勾选
const agreementChecked = (val) => {
    dataState.submitStatus = !val
}
// 修改验证码
const editorPhoneNumDialog = () => {
    dataState.editorPhoneNumDialog = !dataState.editorPhoneNumDialog
}
// 验证提交弹窗
const submitVerDialog = () => {
    dataState.phoneVerCodeDialog = !dataState.phoneVerCodeDialog
    if (!dataState.phoneVerCodeDialog) {
        dataState.phoneVer = ''
    }
}
// 复制
const copyText = async (value) => {
    await toClipboard(value)
    ElMessage.success('复制成功')
}
const fn = () => {
}
// 协议弹窗
const agreementDialog = () => {
    dataState.agreementDialog = !dataState.agreementDialog
    clearInterval(dataState.agreementDialogTime)
    dataState.agreementDialogTime = setInterval(() => {
        dataState.agreementDownCountText = '（' + (--dataState.agreementDownCount) + 's）'
        if (dataState.agreementDownCount <= 0) {
            clearInterval(dataState.agreementDialogTime)
            dataState.agreementStatus = false
            dataState.agreementDownCountText = ''
            dataState.agreementDownCount = 11
        }
    }, 1200)
    if (!dataState.agreementDialog) {
        clearInterval(dataState.agreementDialogTime)
        dataState.agreementDownCount = 11
        dataState.agreementStatus = true
    }
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
    await businesspList()
    if (props.handleType !== 'add') {
        await getMerchantDerail()
    }
    if (props.handleType === 'add') {
        await getQualification()
    }
})
// 表单项规则
const rules = reactive({
    busiCode: [{ required: true, message: '请选择', trigger: 'blur' }],
    roleCode: [{ required: true, message: '请选择', trigger: 'change' }],
    goodsTypeCode: [{ required: true, message: '请选择', trigger: 'change' }],
    merchantType: [{ required: true, message: '请选择', trigger: 'blur' }],
    taxType: [{ required: true, message: '请选择', trigger: 'blur' }],
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
// 关闭弹窗
const closeDownLoadPop = () => {
    dataState.downloadDialog = false
    router.push({ name: 'merchant-settle-list', handleType: props.handleType })
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
            busiCode: addMerchant.busiCode
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
    if (!data) {
        return
    }
    const param = {
        body: {
            merchantId: addMerchant.newMerchantId || addMerchant.merchantId,
            busiCode: addMerchant.busiCode,
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
    if (res) {
        dataState.form.cost = []
        res.map((item) => {
            item.feeCateValue.map((lItem) => {
                dataState.form.cost.push(
                    {
                        cost: item.feeTextValue,
                        rate: [
                            {
                                text: [lItem.firstCateName, lItem.secondCateName, lItem.thirdCateName].join('/'),
                                value: lItem.value
                            }
                        ]
                    }
                )
            })
        })
    }
    console.log(res)
}
// 获取资质
const getQualification = async () => {
    const param = {
        body: {
            busiCode: addMerchant.busiCode,
            businessCates: dataState?.applyClassifyListString.join(','),
            mchtType: dataState.form.merchantClassify + ''
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC56396945346834432',
        name: '经营资质-查询可用资质',
        source: '商户中台'
    }
    const res = await getMerchantList(param)
    res.map((item) => {
        item.certId = item.id
        item.certName = item.qualificationName
        if (!item.certUrlList) {
            item.imgUrl = []
        } else {
            item.imgUrl = [{ url: item.certUrlList }]
        }
    })
    dataState.form.merchantCertUrlList = res
}
// 商品品类
// 应用类目联动
const applyClassifyRef = ref(null)
const skuApplyClassify = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await queryCategoryByBusiCode(level + 1, data.value || '', addMerchant.busiCode)
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
    dataState.applyClassifyListString = []
    dataState.goodsTypeList = applyClassifyRef.value.getCheckedNodes(true)
    form.busiCates = {}
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
        dataState.applyClassifyListString.push(item.pathValues[2])
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
    getQualification()
    // console.log(form.busiCates, 'rerererererererererer')
}
// 商户录入
const ruleFormRef = ref(null)
const submitMerchant = async (type) => {
    dataState.form.merchantCertUrlList.map((item) => {
        item.certUrlList = item.imgUrl ? item.imgUrl[0]?.url : ''
        // delete item.imgUrl
    })
    const param = {
        body: {
            appKey: 'A1001000',
            busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
            merchantClassify: dataState.form.merchantClassify,
            merchantBusiCateList: [dataState.form.busiCates],
            invoiceType: dataState.form.merchantType,
            taxRate: dataState.form.taxRate + '',
            taxType: dataState.form.taxType,
            merchantCertUrlList: dataState.form.merchantCertUrlList,
            isCheckParam: type
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC53423790223167488',
        name: '创建或更新商户入驻申请资料',
        source: '商户中台'
    }
    const res = await unifiedGatewayPost(param)
    if (props.handleType === 'editnew' || props.handleType === 'add' || props.handleType === 'edit') {
        // ruleFormRef.value.validate(async (valid) => {
        //     if (valid) {
        //         const res = await unifiedGatewayPost(param)
        //         if (res.data === 200 && addMerchant.busiMerchantStatus && addMerchant.busiMerchantStatus === 4) {
        //             const subParam = {
        //                 body: {
        //                     appKey: 'A1001000',
        //                     busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
        //                     modifierId: userInfo.value.id,
        //                     modifierName: userInfo.value.name
        //                 },
        //                 appKey: 'A1001000',
        //                 busiCode: 'A1001001',
        //                 configCode: 'UC54149104745869312',
        //                 name: '商户信息提交审核接口',
        //                 source: '商户中台'
        //             }
        //             const submitRes = await unifiedGatewayPost(subParam)
        //             if (type === 1) {
        //                 dataState.downloadDialog = true
        //             }
        //         } else {
        //             if (type === 1) {
        //                 dataState.downloadDialog = true
        //             }
        //         }
        //         // if (type === 1) {
        //         //     router.push({ name: 'merchant-settle-list', handleType: props.handleType })
        //         // }
        //     }
        // })
        if (res.code === '200') {
            if (type === 1) {
                dataState.downloadDialog = true
                dataState.signUrl = res.data.signUrl
            }
        } else {
            ElMessage({
                message: '保存失败，请检查填写信息',
                type: 'fail'
            })
        }
    } else {
        router.push({ name: 'merchant-settle-list', handleType: props.handleType })
    }
    // ruleFormRef.value.validate(async (valid) => {
    //     if (valid) {
    //         await unifiedGatewayPost(param)
    //         ElMessage({
    //             message: '录入成功',
    //             type: 'success'
    //         })
    //         router.push({ name: 'merchant-settle-list', handleType: props.handleType })
    //     }
    // })
}
const submitMerchant1 = async (type) => {
    dataState.form.merchantCertUrlList.map((item) => {
        item.certUrlList = item.imgUrl ? item.imgUrl[0]?.url : ''
        // delete item.imgUrl
    })
    const param = {
        body: {
            appKey: 'A1001000',
            busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
            merchantClassify: dataState.form.merchantClassify,
            merchantBusiCateList: [dataState.form.busiCates],
            invoiceType: dataState.form.merchantType,
            taxRate: dataState.form.taxRate + '',
            taxType: dataState.form.taxType,
            merchantCertUrlList: dataState.form.merchantCertUrlList,
            isCheckParam: type
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC53423790223167488',
        name: '创建或更新商户入驻申请资料',
        source: '商户中台'
    }
    sessionStorage.removeItem('submitApply')
    sessionStorage.setItem('submitApply', JSON.stringify(param))
}
const getMerchantBusiCateList = (data) => {
    data = data[0]
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
            merchantId: addMerchant.newMerchantId || addMerchant.merchantId,
            appKey: 'A1001000',
            busiCode: addMerchant.busiCode
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC53424001670615040',
        name: '查询商户入驻申请资料',
        source: '商户中台'
    }
    const res = await getMerchantList(param)
    Object.assign(dataState.form, res)
    if (props.handleType !== 'add') {
        dataState.signUrl = res.signUrl
        dataState.form.merchantClassify = res.merchantClassify
        dataState.form.busiCatesArr = getMerchantBusiCateList(res.merchantBusiCateList || {})
        // dataState.form.busiCatesArr = [['PL01', 'PL0103', 'PL010302'], ['PL01', 'PL0103', 'PL010303']]
        dataState.form.merchantType = res.invoiceType
        dataState.form.taxRate = res.taxRate
        dataState.form.taxType = res.taxType
        dataState.form.merchantCertUrlList = res.merchantCertUrlList
        dataState.form.merchantCertUrlList.map((item) => {
            if (!item.certUrlList) {
                item.imgUrl = []
            } else {
                item.imgUrl = [{ url: item.certUrlList }]
            }
        })
        dataState.form.signUrl = res.signUrl
        // res.merchantCertUrlList.map((item) => {
        //     if (!item.certUrlList) {
        //         item.imgUrl = []
        //     } else {
        //         item.imgUrl = [{ url: item.certUrlList }]
        //     }
        // })
        // dataState.form.merchantCertUrlList = res.merchantCertUrlList
        // form.permitImg[0].url = dataState.merchantCertUrlList[0].certUrlList
        // form.trademarkRegistrationCertificate[0].url = dataState.merchantCertUrlList[1].certUrlList
        // form.brandAuthorizationLetter[0].url = dataState.merchantCertUrlList[2].certUrlList
        // form.otherQualifications[0].url = dataState.merchantCertUrlList[3].certUrlList
        getPlatFee(res.merchantBusiCateList)
    } else {
        res.merchantCertUrlList.map((item) => {
            if (!item.certUrlList) {
                item.imgUrl = []
            } else {
                item.imgUrl = [{ url: item.certUrlList }]
            }
        })
        dataState.form.merchantCertUrlList = res.merchantCertUrlList
    }
}
// 上传成功回掉
const handleAvatarSuccess = (n, e) => {
    if (dataState.form[n]) {
        dataState.form[n] = dataState.form[n] + ',' + e.data
    } else {
        dataState.form[n] = e.data
    }
}
// 下一步
const next = () => {
    router.push({ name: 'merchant-settle-result', params: { result: 'detail' } })
}
// 后退
const back = () => {
    if (props.handleType === 'detailnew' || props.handleType === 'detail') {
        router.push({ name: 'business-line-information', params: { handleType: props.handleType } })
    } else {
        router.push({ name: 'business-line-information', params: { handleType: 'editnew' } })
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
