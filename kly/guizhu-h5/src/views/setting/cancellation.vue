
<template>
    <div class ="cancellation">
        <img class="logo" src="../../assets/error.png"/>
        <p class="title">重要提醒</p>
        <p class="text text_t1">注销前请认真阅读以下重要提醒。账号注销后，您将无法再使用该账号，包括但不限于：</p>
        <p class="text text_t2">1、无法登录使用该账号。</p>
        <p class="text">2、无法使用该账号绑定的手机号重新注册。</p>
        <p class="text">3、该账号下的个人资料和历史信息都将无法找回。</p>
        <p class="text">4、无法继续处理购买交易和售后等流程。</p>

        <p class="btn" @click="btn">提交</p>
    </div>
</template>
<script setup>
import store from '@/store'
import { appBridge } from '@/utils/bridge'
import { cancellationUser } from '../../api/login'
console.log(window)
const btn = async () => {
    const res = await cancellationUser({
        phone: store.state.phone
    })
    if (res.code === '200') {
        appBridge('loginOut')
    }
    appBridge('loginOut')
    console.log(res)
}

</script>

<style scoped lang="scss">
.cancellation{
    min-height: 100vh;
    background: #FFFFFF;
    text-align: center;
    .logo{
        width:72px;
        height:72px;
        margin-top:109px;
    }
    .title{
        margin-top:30px;
        height: 48px;
        font-size: 34px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 48px;
    }
    .text{
        margin:0 60px;
        width: 630px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #494849;
        text-align: justify;
        line-height: 40px;
    }
    .text_t1{
        margin-top:36px;
    }
    .text_t2{
        margin-top:21px;
    }
    .btn{
        margin:85px 60px;
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 92px;
    }
}
</style>
