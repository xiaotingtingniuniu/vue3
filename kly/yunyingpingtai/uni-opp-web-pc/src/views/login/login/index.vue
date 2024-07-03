<template>
    <div  class="login relative w-full h-full px-4">
        <div class="container relative h-full py-2 mx-auto sm:px-10">
            <div class="flex h-full">
                <div class="hidden min-h-full pl-4 mr-4 flex-1">
                    <div class="my-logo">
                        <img src="@/assets/images/hengchang.png" alt="">
                        <div class="my-title">恒生活</div>
                    </div>
                    <div class="my-auto">
                        <img src="@/assets/svg/login-box-bg.svg" class="w-1/2 -mt-16 -enter-x"/>
                    </div>
                </div>
                <div class="flex flex-1">
                    <div class="relative form-container">
                        <h2 class="title">登录</h2>
                        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0" class="demo-ruleForm" status-icon>
                            <el-form-item v-if="ruleForm.loginType === '1'" label="" prop="account">
                                <el-input v-model="ruleForm.account" clearable placeholder="请输入企业EHR账号"/>
                            </el-form-item>
                            <el-form-item v-if="ruleForm.loginType === '1'" label="" prop="pwd">
                                <el-input @keyup.enter="onLogon(ruleFormRef)" v-model="ruleForm.pwd" type="password" clearable placeholder="请输入EHR密码" />
                            </el-form-item>
                            <el-form-item v-if="ruleForm.loginType === '2'" label="" prop="mobile">
                                <el-input v-model="ruleForm.mobile"  clearable placeholder="请输入手机号" maxlength="11"/>
                            </el-form-item>
                            <el-form-item v-if="ruleForm.loginType === '2'" label="" prop="verifyCode">
                                <el-row style="width: 100%">
                                    <el-col :span="16"><div class="grid-content ep-bg-purple" />
                                        <el-input v-model="ruleForm.verifyCode" clearable placeholder="请输入验证码" maxlength="6" />
                                    </el-col>
                                    <el-col :span="8" style="margin-right: 0;"><div class="grid-content ep-bg-purple" />
                                        <el-button style="width: calc(100% - 10px);margin-left: 10px;line-height: 40px;height: 40px;" :disabled="disabled" @click="getCode">{{btnText}}</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item style="margin-top: 30px;"><el-button type="primary" style="width: 100%;" @click="onLogon(ruleFormRef)">登录</el-button></el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getVerifyCode, login } from '@/api/login'
import { isMobile } from '@/utils'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()

const ruleForm = reactive({
    account: '', // 账号
    pwd: '', // 密码
    mobile: '', // 手机号
    verifyCode: '', // 验证码
    loginType: '1' // 1 账号密码/手机号密码 2 手机验证码
})

const btnText = ref('获取验证码')
const disabled = ref(false)
const loading = ref(false)
const isGetCode = ref(false)
const ruleFormRef = ref(null)

const validateMobile = (rule, value, callback) => {
    if (value) {
        if (isMobile(value)) {
            ruleFormRef.value.validateField('checkPass', () => null)
            callback()
        } else {
            callback(new Error('请输入正确的手机号'))
        }
    } else {
        callback(new Error('请输入手机号'))
    }
}
const rules = reactive({
    account: [
        { required: true, message: '请输入企业EHR账号', trigger: 'blur' }
    ],
    pwd: [
        { required: true, message: '请输入EHR密码', trigger: 'blur' }
    ],
    mobile: [
        { validator: validateMobile, trigger: 'blur' }
    ],
    verifyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ]
})

// 获取验证码
const getCode = async () => {
    if (!isMobile(ruleForm.mobile)) {
        ElMessage.warning('请输入正确的手机号!')
        return
    }
    const res = await getVerifyCode({ mobile: ruleForm.mobile })
    if (res.code === '200') {
        isGetCode.value = true
        ElMessage.success('发送成功!')
        countdown()
    }
}

// 验证码倒计时
const countdown = () => {
    let num = 60
    disabled.value = true
    const timer = setInterval(() => {
        if (num <= 1) {
            clearInterval(timer)
            btnText.value = '获取验证码'
            num = 60
            disabled.value = false
            return
        }
        btnText.value = `${num -= 1}秒后重新获得`
    }, 1000)
}

// 登录
const onLogon = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        if (valid) {
            if (!isGetCode.value && ruleForm.verifyCode === '2') {
                ElMessage.error('请先获取验证码!')
                return
            }
            loading.value = true
            const param = {
                systemSign: 'HSHYWZTPC',
                loginType: ruleForm.loginType,
                account: ruleForm.account, // 账号
                pwd: ruleForm.pwd, // 密码
                mobile: ruleForm.mobile, // 手机号
                verifyCode: ruleForm.verifyCode // 验证码
            }
            const res = await login(param)
            loading.value = false
            if (res.code === '200') {
                store.commit('syncToken', res.data.token)
                store.commit('setUserInfo', res.data)
                if (route.query.returnUrl) return router.push({ path: route.query.returnUrl })
                router.push({ name: 'acpable-app' })
            }
        }
    })
}
</script>
<style lang="scss" scoped>
.w-full {
    width: 100%;
}
.h-full {
    height: 100%;
}
.relative {
    position: relative;
}
.flex {
    display: flex;
}
.flex-1 {
    flex: 1;
}
.mt-10 {
    margin-top: 30px;
}
.login {
    height: 100vh;
    overflow: hidden;
    &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-left: -48%;
        background-image: url(~@/assets/svg/login-bg.svg);
        background-position: 100%;
        background-repeat: no-repeat;
        background-size: auto 100%;
        content: '';
        position: absolute;
    }
    .container {
        margin: 36px 160px 0;
        padding: 6px 30px;
        box-sizing: border-box;
    }
    .my-auto {
        margin-top: auto;
        margin-bottom: auto;
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        img {
            width: 50%;
            z-index: 9;
        }
    }
    .my-logo {
        position: absolute;
        top: 12px;
        display: flex;
        width: 60%;
        height: 80px;
        align-items: center;
        padding-left: 7px;
        cursor: pointer;
        transition: all .2s ease;
        img {
            width: 48px;
        }
        .my-title {
            margin-left: 6px;
            font-size: 42px;
            color: #fff;
            font-weight: 700;
            transition: all .5s;
            line-height: normal;
        }
    }
    .form-container {
        padding: 12px;
        margin-top: 83px;
        margin-left: 43px;
        width: 404px;
        height: 390px;
        margin-top: auto;
        margin-bottom: auto;
        .title {
            margin-bottom: 9px;
            font-size: 22px;
            font-weight: 700;
            color: rgba(0, 0, 0, 0.85);
            line-height: 27px;
        }
        .el-input {
            line-height: 40px;
            height: 40px;
            width: 100%;
        }
        .form-tab {
            width: 100%;
            text-align: center;
            span {
                flex: 1;
                border: 1px solid transparent;
                box-shadow: 0 2px #00000004;
                color: #000000d9;
                border-color: #d9d9d9;
                line-height: 30px;
                cursor: pointer;
                &:last-child {
                    margin-left: 10px;
                }
                &:hover {
                    color: #2a7dc9;
                    border-color: #2a7dc9;
                }
            }
        }
    }

}
</style>
