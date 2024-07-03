<template>
    <div class="work-order-container">
        <el-card shadow="always">
            <div class="title">
                绑卡
            </div>
            <div class="formBox">
                <el-form ref="ruleFormRef" :model="dataState.formData" :rules="rules" :label-width="150">
                    <el-form-item label="证件类型" prop="bindType">
                        <div v-if="user.merchantType==1||user.merchantType==4">
                            <el-radio-group v-model="formData.bindType">
                                <el-radio :label="1" border>对公</el-radio>
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="该商户仅支持对公绑卡"
                                    placement="right"
                                >
                                    <el-radio :label="1" disabled border>对私</el-radio>
                                </el-tooltip>
                            </el-radio-group>
                        </div>
                        <div v-else-if="user.merchantType==2">
                            <el-radio-group v-model="formData.bindType">
                                <el-tooltip
                                    class="box-item"
                                    effect="dark"
                                    content="该商户仅支持对私绑卡"
                                    placement="right"
                                >
                                    <el-radio :label="1" disabled border>对公</el-radio>
                                </el-tooltip>
                                <el-radio :label="2" border>对私</el-radio>
                            </el-radio-group>
                        </div>
                        <div v-else>
                            <el-radio-group v-model="formData.bindType">
                                <el-radio :label="1" border>对公</el-radio>
                                <el-radio :label="2" border>对私</el-radio>
                            </el-radio-group>
                        </div>
                    </el-form-item>
                    <div>
                        <el-form-item v-if="formData.bindType=='1'" label="公司名称" prop="merchantName">
                            <el-input disabled v-model="formData.merchantName" />
                        </el-form-item>
                        <el-form-item v-if="formData.bindType=='2'" label="姓名" prop="legalName">
                            <el-input disabled v-model="formData.legalName" />
                        </el-form-item>
                    </div>
                    <div>
                        <el-form-item v-if="formData.bindType=='1'" label="统一信用代码编号" prop="uniqueCode">
                            <el-input disabled v-model="formData.uniqueCode" />
                        </el-form-item>
                        <el-form-item v-if="formData.bindType=='2'" label="身份证号" prop="legalCertNo">
                            <el-input disabled v-model="formData.legalCertNo" />
                        </el-form-item>
                    </div>
                    <el-form-item label="开户银行" prop="openBank">
                        <el-input v-model="formData.openBank" />
                    </el-form-item>
                    <el-form-item label="开户支行" prop="openBranch">
                        <el-input v-model="formData.openBranch" />
                    </el-form-item>
                    <el-form-item label="银行账号" prop="bankNumber">
                        <el-input v-model="formData.bankNumber" />
                    </el-form-item>
                    <el-form-item v-if="formData.bindType=='2'" label="预留手机号" prop="bankPhone">
                        <el-input v-model="formData.bankPhone" />
                    </el-form-item>
                    <el-form-item class="botton">
                        <el-button type="primary" @click="submitForm(ruleFormRef)">绑卡</el-button>
                        <el-button type="primary" @click="goBack">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { publicRequest } from '@/api/common/index.js'
import { useStore } from 'vuex'
const store = useStore()
const route = useRoute()
const router = useRouter()
const user = ref(JSON.parse(route.params.id))
const getloginOrgRole = () => {
    if (store.state.loginOrgRole && typeof store.state.loginOrgRole !== 'object') {
        return JSON.parse(store.state.loginOrgRole)
    } else {
        return store.state.loginOrgRole
    }
}
const getBindType = () => {
    if (user.value.merchantType === 2) {
        return 2
    } else {
        return 1
    }
}
const loginOrgRole = getloginOrgRole()
const bindType = user.value.bindType ? user.value.bindType : getBindType()
const dataState = reactive({
    formData: {
        bindType: bindType,
        merchantName: user.value.merchantName,
        legalName: user.value.legalName,
        uniqueCode: user.value.uniqueCode,
        legalCertNo: user.value.legalCertNo,
        bankNumber: user.value.bankNumber,
        openBank: user.value.openBank,
        openBranch: user.value.openBranch,
        bankPhone: user.value.bankPhone
    }
})
const { formData } = toRefs(dataState)
const ruleFormRef = ref(null)
const rules = reactive({
    bindType: [
        { required: true, message: '请选择绑卡类型~', trigger: 'change' }
    ],
    merchantName: [
        { required: true, message: '请填写银行卡账户名称', trigger: 'blur' },
        { min: 2, max: 50, message: '2-50位字符', trigger: 'blur' }
    ],
    legalName: [
        { required: true, message: '请填写银行卡账户名称', trigger: 'blur' },
        { min: 2, max: 50, message: '2-50位字符', trigger: 'blur' }
    ],
    uniqueCode: [
        { required: true, message: '请填写统一信用代码编号', trigger: 'blur' }
        // { min: 3, max: 50, message: '3-50位字符', trigger: 'blur' }
    ],
    legalCertNo: [
        { required: true, message: '请填写身份证号', trigger: 'blur' }
        // { min: , max: 50, message: '3-50位字符', trigger: 'blur' }
    ],
    openBank: [
        { required: true, message: '请填写发卡银行', trigger: 'blur' },
        { min: 3, max: 50, message: '3-50位字符', trigger: 'blur' }
    ],
    openBranch: [
        { required: true, message: '请填写发卡银行', trigger: 'blur' },
        { min: 3, max: 50, message: '3-50位字符', trigger: 'blur' }
    ],
    bankNumber: [
        { required: true, message: '请填写银行账号', trigger: 'blur' },
        { min: 3, max: 50, message: '3-50位字符', trigger: 'blur' }
    ],
    bankPhone: [
        { required: true, message: '请填写银行预留手机号', trigger: 'blur' },
        { min: 3, max: 50, message: '3-50位字符', trigger: 'blur' }
    ]
})

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log(user.value)
            const param = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                // modifierId: loginOrgRole.bisMerchantId,
                busiMerchantId: user.value.userId, // loginOrgRole.bisMerchantId,
                bindType: formData.value.bindType,
                bankAcctName: formData.value.bindType === 1 ? formData.value.merchantName : formData.value.legalName,
                uniqueCode: formData.value.uniqueCode,
                bankNumber: formData.value.bankNumber,
                openBank: formData.value.openBank,
                openBranch: formData.value.openBranch
            }
            const res = await publicRequest({ key: 'FINANCE_CORE_CAPITAL_CARD_BINDING', body: param })
            // const res = await bindingCard(param)
            if (res.code === '200') {
                ElMessage({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                })
                router.go(-1)
            } else {
                ElMessage({
                    message: res.msg,
                    type: 'error'
                })
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
const goBack = () => {
    router.go(-1)
}
</script>
<style lang="scss" scoped>
.work-order-container{
    :deep(.el-dialog__body){
        max-height: 600px;
        overflow-y: scroll;
    }
    .el-card{
        width:80%;
        margin-left:10%;
    }
    .title{
        width:100%;
        font-size:26px;
        font-weight:900;
        text-align:center;
        margin-top:20px;
        margin-bottom:30px;
    }
    .formBox{
        width:50%;
        margin-left:25%;
    }
}
</style>
