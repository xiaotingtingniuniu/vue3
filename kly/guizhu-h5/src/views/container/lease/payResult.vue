<template>
    <div class="pay">
        <div class="pay-status" v-if="resultdata">
            <div class="pay-success">
                <div class="image" ></div>
            </div>
            <div class="pay-text">成功支付￥{{resultdata.payAmount}}</div>
            <div class="button">
                <van-button class="bottom-btn" @click="goDetail" round color="#FE7E41" text="30">完成</van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { leaseOrderPayResult, stageOrderPayResult } from '@/api/container'
import { ref, onMounted } from 'vue'
import { appBridge } from '@/utils/bridge.js'
// 0待支付1支付中2支付成功3支付超时4支付失败9主动撤销91支付人撤销92退款人撤销
const props = defineProps(['prePayNo', 'orderNo', 'orderStatus', 'num'])
const resultdata = ref(null)
onMounted(() => {
    props.num === '1' ? stagOrderPayResult() : OrderPayResult()
})
const OrderPayResult = async () => {
    const res = await leaseOrderPayResult({
        prePayNo: props.prePayNo
    })
    console.log(res)
    resultdata.value = res.data
}
const stagOrderPayResult = async () => {
    const res = await stageOrderPayResult({
        prePayNo: props.prePayNo
    })
    console.log(res)
    resultdata.value = res.data
}
const goDetail = () => {
    appBridge('goMyPage')
}
</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.pay {
    height: 100vh;
    background: #f4f5f5;
    // .height-line {
    //     font-size: 18px;
    //     overflow: hidden;
    //     opacity: 0;
    // }
    .pay-status{
        height: 100vh;
        background: #ffffff;
        .pay-success{
            width: 100%;
            height: 212px;
            padding-top: 155px;
            display: flex;
            align-items: center;
            justify-content: center;
            .image{
                width: 212px;
                height: 212px;
                background-image: url('../../../assets/pay-success.png');
                background-size: 100% auto;
                background-repeat: no-repeat;
            }
        }
        .pay-text{
            display: flex;
            align-items: center;
            justify-content: center;
            color: #2E2E4D;
            font-size: 36px;
            font-weight: bold;
        }
        .button{
            padding: 190px 60px;
            .bottom-btn{
                font-size: 30px;
                height: 92px;
                width: 100%;
            }
        }
    }
}
</style>
