<template>
    <div class="verify">
        <div class="verify-status">
            <div class="verify-success">
                <div class="image" ></div>
            </div>
            <div class="verify-text">提交成功，资料审核中{{ resultdata }}</div>
            <div class="verify-explain">最快3分钟完成审核，您可进入【我的】</div>
            <div class="verify-explain">【分期订单】查看审核状态</div>
            <div class="button">
                <van-button class="bottom-btn" @click="goDetail" round color="#FE7E41" text="30">完成</van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { appBridge } from '@/utils/bridge.js'

const resultdata = ref(null)
onMounted(() => {
    console.log('提交结果页')
    appBridge('changePayResultNav')
})
const goDetail = () => {
    appBridge('goMyPage')
}
</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.verify {
    height: 100vh;
    background: #f4f5f5;
    .verify-status{
        height: 100vh;
        background: #ffffff;
        .verify-success{
            width: 100%;
            height: 212px;
            padding-top: 170px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            .image{
                width: 212px;
                height: 212px;
                background-image: url('../../../assets/verify-success.png');
                background-size: 100% auto;
                background-repeat: no-repeat;
            }
        }
        .verify-text{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2E2E4D;
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 24px;
        }
        .verify-explain{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #696969;
            font-size: 26px;
            font-weight: 400;
        }
        .button{
            padding: 116px 176px;
            .bottom-btn{
                font-size: 30px;
                height: 92px;
                width: 100%;
            }
        }
    }
}
</style>
