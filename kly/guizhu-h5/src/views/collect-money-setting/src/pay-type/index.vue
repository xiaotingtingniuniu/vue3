<template>
    <div class="pay-type">
        <div class="img-box">
            <img :src="payTypes[payType].payImg" alt="">
            <p class="message">{{ payTypes[payType].message }}<template v-if="$props.wxInfo?.contractStatus ==='3'">已开通</template></p>
        </div>
        <van-button v-if="payActive === 'open'" @click="onOpenPay" class="pay-button" type="primary" size="large">
            {{applyStatus[$props.wxInfo?.contractStatus]}}
        </van-button>
        <van-button v-if="payActive === 'signing'" @click="onSigning" class="pay-button" type="primary" size="large">审核中/签约中/已驳回</van-button>
        <van-button v-if="payActive === 'detail'" @click="onDetail" class="pay-button" type="primary" size="large">查看详情</van-button>
        <van-popup v-model:show="show" round teleport="body" :style="{ height: '30%', width: '80%' }">
            <div class="box">
                <img :src="require('@/assets/mine/wx-pay-two.png')" alt="" class="wx-pay-two">
                <van-steps :active="active" active-color="#FE7E41" :active-icon="require('@/assets/stepsPina.png')">
                    <van-step>提交材料</van-step>
                    <van-step>受理中</van-step>
                    <van-step>入驻完成</van-step>
                </van-steps>
                <div class="partnerid">微信二级商户号: {{$props.wxInfo?.subMchid}}</div>
            </div>
        </van-popup>
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps({
    wxInfo: {
        type: Object,
        default: () => {}
    }
})

watch(() => props.wxInfo,
    (val) => {
        console.log(val)
    })
//  1-初始化 2-签约审核中 3-已完成 4-签约审核中被驳回 5-待签约 6-资料审核中 7-资料审核中被驳回
const applyStatus = {
    1: '开通',
    2: '审核中',
    3: '查看详情',
    4: '已驳回',
    5: '待签约',
    6: '审核中',
    7: '已驳回'
}

const router = useRouter()
const active = ref(2) // 步骤条状态
// 支付状态
const payType = ref('wx')
const payTypes = {
    wx: {
        payImg: require('@/assets/mine/wx-pay.png'),
        message: '微信支付'
    }
}
// 按钮状态
const payActive = ref('open')
const show = ref(false)

// 开通支付
const onOpenPay = () => {
    console.log('开通支付', props.wxInfo)
    if (props.wxInfo.contractStatus === '1') {
        router.push('/mine/open-pay')
    } else if (['2', '4', '5', '6', '7'].includes(props.wxInfo.contractStatus)) {
        router.push({ name: 'open-steps', params: { status: props.wxInfo.contractStatus } })
    } else if (props.wxInfo.contractStatus === '3') {
        show.value = true
    }
}

// 查看审核
const onSigning = () => {
    console.log('查看审核')
}

// 查看详情
const onDetail = () => {
    console.log('查看详情')
    show.value = true
}
</script>

<style lang="scss" scoped>
    .box{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .van-overlay{
            position: relative;
        }
        .wx-pay-two{
            width: 227px;
            height: 59px;
        }
        .van-steps{
            width: 80%;
            margin: 30px 0;
        }
        .partnerid{
            width: 464px;
            height: 68px;
            background-color: #F7F7F7;
            text-align: center;
            line-height: 68px;
            font-size: 30px;
        }
        .box-x{
            position: relative;
            bottom: -20px;
            z-index: 1;
        }
    }
.pay-type {
    width: 100%;
    height: 100%;
    .img-box {
        overflow: hidden;
        img {
            display: block;
            margin: 115px auto 0;
            width: 134px;
            height: 117px;
        }
        .message {
            margin-top: 17px;
            text-align: center;
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 42px;
        }
    }

    .pay-button {
        display: block;
        margin: 100px auto;
        width: 630px;
        background: #FE7E41;
        border-color: #FE7E41;
        border-radius: 46px;
        text-align: center;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #FFF;
        line-height: 92px;
    }

    .van-popup{
        display: flex !important;
        flex-direction: column !important;
        justify-content: center !important;
        align-items: center !important;
    }

}
</style>
