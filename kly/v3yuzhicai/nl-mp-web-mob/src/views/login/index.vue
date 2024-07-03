<template>
    <div class="login">
        <div class="login-head">
        </div>
        <div class="login-welcome">
            <div class="welcome">您好，</div>
            <div class="hsh">欢迎登录恒生活</div>
        </div>
        <div class="login-phone">
            <van-cell-group inset>
                <van-field v-model="phone" name="pattern" type="number" label="+86" placeholder="请输入手机号" clearable maxlength="11" :rules="[{ required: true, message: '请输入手机号' }]"/>
            </van-cell-group>
            <div class="login-agreement">
                <van-checkbox v-model="checked" icon-size="16px" checked-color="#F06441"></van-checkbox>
                <span class="login-agreement--agree">请详细阅读并同意</span>
                <span style="color: #F16542" @click="privacyagreement">《用户隐私协议》</span>
                <span style="color: #F16542;" @click="serviceagreement">《用户服务协议》</span>
            </div>
        </div>
        <div class="login-btn">
            <van-button block color="#F06441" native-type="submit" @click="sendMessage">
                获取验证码
            </van-button>
        </div>
    </div>
</template>
<script setup>
import { sendSms } from '@/api/login'
import { Toast } from 'vant'
import { useRouter } from 'vue-router'
const router = useRouter()
const phone = ref('')
const checked = ref(false)
const pattern = /^1[3-9]\d{9}$/
watchEffect(() => {
    if (!phone.value) return
    phone.value = phone.value.replace(/[^\d]/g, '')
    sessionStorage.setItem('phone', phone.value)
})

onMounted(() => {
    checked.value = sessionStorage.getItem('checked') ? JSON.parse(sessionStorage.getItem('checked')) : checked.value
    phone.value = sessionStorage.getItem('phone')
})
const route = useRoute()
const sendMessage = async () => {
    if (phone.value === '') {
        Toast('请输入手机号')
    } else if (!pattern.test(phone.value)) {
        Toast('请输入正确手机号')
    } else if (checked.value === false) {
        Toast('请勾选用户隐私协议')
    } else {
        const { code, msg } = await sendSms({
            mobile: phone.value,
            userType: '1'
        })
        if (code === 200) {
            Toast('验证码已发送')
            router.push({ name: 'login-msg', query: { pageName: route.query.pageName } })
        } else {
            Toast(msg)
        }
    }
}
const privacyagreement = () => {
    sessionStorage.setItem('checked', checked.value)
    router.push({ name: 'agreement-privacy', query: { issetting: true } })
}
const serviceagreement = () => {
    sessionStorage.setItem('checked', checked.value)
    router.push({ name: 'agreement-service', query: { issetting: true } })
}
</script>
<style lang="scss" scoped>
.login{
    min-height: 100vh;
    background-image: url('../../assets/mine/login-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-color: #FFFFFF;
    .login-head{
        height: 280px;
        .van-image{
            width: 100%;
            height: 300px;
        }
    }
    .login-welcome{
        width: 650px;
        margin: 0 auto;
        margin-left: 50px;
        .welcome{
            font-size: 54px;
        }
        .hsh{
            margin-top: 20px;
            font-size: 46px;
        }
        .login-welcome--hsh{
            font-size: 30px;
        }
    }
    .login-phone{
        margin-top: 80px;
        // .other{
        //     font-size: 24px;
        //     text-align: center;
        // }
        // .van-cell{
        //     // font-size: 34px;
        //     color: #999999;
        // }
        :deep(.van-field__label){
            font-size: 34px;
            color: #222222;
            width: auto;
        }
        :deep(.van-cell__value){
            font-size: 34px;
            color: #999999;
        }
        .login-agreement{
            position: relative;
            height: 100px;
            line-height: 100px;
            width: 650px;
            margin: 0 auto;
            font-size: 24px;
            .login-agreement--agree{
                padding-left: 10px;
                color: #B8B7B7;
            }
            .van-checkbox{
                display: inline-block;
                vertical-align:middle;
            }
        }
        .login-agreement::after{
            border-top-width: 1px !important;
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            border: 0 solid #E3E3E3;
            transform: scale(.5);
        }
    }
    .login-btn{
        .van-button{
            width: 650px;
            height: 96px;
            margin: 0 auto;
            border-radius: 16px;
            font-size: 30px;
        }
    }
}
</style>
