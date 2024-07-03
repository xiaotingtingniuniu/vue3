<template>
    <div class="login">
        <div class="login-head">
        </div>
        <div class="login-welcome">
            <div class="welcome">输入验证码</div>
            <div class="hsh login-welcome--hsh">验证码已发送到： {{phone}}</div>
        </div>
        <div class="login-phone">
            <!-- 密码输入框 -->
            <van-password-input
                :value="msgs"
                :gutter="6"
                :mask="false"
                :focused="showKeyboard"
                @focus="showKeyboard = true"
            />
            <div class="time-out time-out--time" v-if="data > 0">{{resultdata}}后重新获取</div>
            <div class="time-out time-out--agin" v-else @click="reacquire">重新获取</div>
            <!-- 数字键盘 -->
            <van-number-keyboard
                :show="showKeyboard"
                @input="onInput"
                @delete="onDelete"
                @blur="showKeyboard = false"
            />
        </div>
    </div>
</template>
<script setup>
import { login, sendSms } from '@/api/login/index'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'

const phone = ref('')
const store = useStore()
const router = useRouter()
const route = useRoute()
phone.value = sessionStorage.getItem('phone')
const msgs = ref('')
const showKeyboard = ref(true)
const data = ref(60)
const resultdata = ref(60)
onMounted(() => {
    settime()
})
const settime = () => {
    const myTime = setInterval(() => {
        resultdata.value = data
        data.value--
        if (data.value < 1) {
            clearInterval(myTime)
        }
    }, 1000)
}
const loginbtn = async () => {
    if (msgs.value === '') return Toast('请输入验证码')
    const params = {
        mobile: sessionStorage.getItem('phone'),
        userType: '1',
        code: msgs.value
    }
    const { code, data } = await login(params)
    if (code !== 200) return Toast('验证码有误，请确认')
    await store.dispatch('updateToken', data.token)
    if (route.query.pageName && route.query.pageName !== 'home') {
        router.go(-2)
    } else {
        router.replace({
            name: 'home'
        })
    }
}
const onInput = (key) => {
    msgs.value = (msgs.value + key).slice(0, 6)
    if (msgs.value.length === 6) {
        loginbtn()
    }
}
const onDelete = () => {
    msgs.value = msgs.value.slice(0, msgs.value.length - 1)
}

const reacquire = async () => {
    const { code, msg } = await sendSms({
        mobile: sessionStorage.getItem('phone'),
        userType: '1'
    })
    if (code === 200) {
        Toast('获取成功')
        data.value = 60
        resultdata.value = 60
        await settime()
        msgs.value = ''
    } else {
        Toast(msg)
    }
}
</script>
<style lang="scss" scoped>
.login{
    min-height: 100vh;
    background-image: url('../../../assets/mine/login-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-color: white;
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
        .other{
            font-size: 24px;
            text-align: center;
        }
        .login-msg{
           .van-button{
               height: 96px;
                border-radius: 16px;
                font-size: 30px;
           }
        }
        .time-out{
            width: 650px;
            margin: 40px 0px 0px 50px;
            float: left;
            color: #B8B7B7;
        }
        .time-out--agin{
            color: #E05324;
        }
    }
    .login-btn{
        .van-button{
            width: 650px;
            height: 96px;
            margin: 0 auto;
            border-radius: 16px;
        }
    }
    :deep(.van-password-input){
        width: 650px;
        margin: 0 auto;
    }
    :deep(.van-password-input__security){
        li{
            width: 96px;
            height: 96px;
            border-radius: 16px;
            border: 1px solid #E3E3E3;
        }
    }
    :deep(.van-password-input__info){
        float: left;
        font-size: 28px;
    }
}
</style>
