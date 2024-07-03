
<template>
    <div class ="identity">
        <p class="title">请先验证身份</p>
        <p class="phone">{{$store.state.phone.replace(/^(\d{3})\d+(\d{4})$/,'$1 **** $2')}}</p>
        <div class="code_btn">
            <input maxlength='6' placeholder="请输入短信验证码" class="code" v-model="codeVal">
            <p class="get_code" @click="getCode">{{btnTitle}}</p>
        </div>
        <p class="btn" v-if="codeVal.length===6" @click="btn">下一步</p>
        <p class="btn btn_no" v-else @click="btn">下一步</p>
    </div>
</template>
<script setup>
import store from '@/store'
import { Toast } from 'vant'
import { getPhone, setTitle } from '@/utils/composables'
import { reactive, toRefs, onMounted } from 'vue'
import { smsyztCode, smsCode, checkSmsCode } from '@/api/login'
import { useRouter } from 'vue-router'

const router = useRouter()
const dataState = reactive({
    sendDisabled: false,
    btnTitle: '获取验证码',
    codeVal: '',
    phone: ''
})

onMounted(() => {
    setTitle('')
    getPhone()
    dataState.phone = store.state.phone
})
const { btnTitle, codeVal } = toRefs(dataState)
// 发送短信
const getCode = async () => {
    if (dataState.sendDisabled) {
        return false
    }
    const params = {
        phone: store.state.phone
    }
    const res = await smsCode(params)
    if (res.code === '200') {
        let time = 60
        const dataP = res.data
        const object = await smsyztCode(dataP)
        if (object.code === 0) {
            Toast({
                message: '发送成功',
                duration: 2000
            })
        }
        const timer = setInterval(() => {
            if (time === 0) {
                clearInterval(timer)
                dataState.sendDisabled = false
                dataState.btnTitle = '获取验证码'
            } else {
                time--
                dataState.btnTitle = `${time > 9 ? time : '0' + time}秒后重试`
                dataState.sendDisabled = true
            }
        }, 1000)
    }
}
const btn = async () => {
    const res = await checkSmsCode({
        phone: store.state.phone,
        smsCode: dataState.codeVal
    })
    if (res.code === '200') {
        router.push({ path: '/setting/cancellation' })
    }
}

</script>

<style scoped lang="scss">
.identity{
    min-height: 100vh;
    background: #FFFFFF;
    .title{
        padding: 60px;
        margin-bottom:0px;
        font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #494849;
        line-height: 42px;
    }
    .phone{
        margin-top:18px;
        margin-left:60px;
        font-size: 56px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #494849;
        line-height: 78px;
    }
    .code_btn{
        margin-top:40px;
        margin-left: 60px;
        width: 630px;
        height: 86px;
        background: #F7F7F7;
        border-radius: 43px;
        overflow: hidden;
        .code{
            float: left;
            width:408px;
            outline: none;
            border:none;
            height: 86px;
            padding-left: 60px;
            box-sizing: border-box;
            background: #F7F7F7;

        }
        .code::-webkit-input-placeholder{ /*WebKit browsers*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C9C9C9;
            line-height: 42px;
        }
        .code::-moz-input-placeholder{ /*Mozilla Firefox*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C9C9C9;
            line-height: 42px;
        }

        .code::-ms-input-placeholder{ /*Internet Explorer*/
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C9C9C9;
            line-height: 42px;
        }
        .get_code{
            float: left;
            margin-top:26px;
            width:200px;
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FE7E41;
            line-height: 33px;
            text-align: center;
            border-left: 1px solid #D6D6D6;
        }
    }
    .btn{
        margin-left: 60px;
        margin-top:222px;
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        text-align: center;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 92px;
    }
    .btn_no{
        background: #FFD6C2;
    }
}
</style>
