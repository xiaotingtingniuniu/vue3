<template>
    <div class="account-cancellation-tips">
        <div class="icon--unselect">
            <van-image :src="require('@/assets/mine/编组 3@2x.png')"/>
        </div>
        <div class="account-phone">将{{ phone }}所绑定的账号注销</div>
        <div class="platform-tips">
            恒生活平台采用统一账号，注销后，恒生活平台下多项产品/服务都将无法使用，请谨慎操作。
        </div>
        <div class="card">
            <div class="card-title">注销后，您在相关产品/服务留存的信息及权益将被清空且无法找回，具体包括:</div>
            <div class="card-item">1.个人资料、实名认证信息等身份信息</div>
            <div class="card-item">2.各产品/服务的会员及权益信息</div>
            <div class="card-item">3.银行卡、微信等快捷支付服务</div>
            <div class="card-item">4.业务订单和交易信息</div>
            <div class="card-item">5.以及您在使用各产品/服务时留存的其他信息</div>
        </div>
        <div class="card">
            <div class="card-item">请确保所有交易已完结且无纠纷，存在未完成交易/交易纠纷的账号，不可注销，账号删除后的历史交易可能产生的资金退回权益等将视作自动放弃。</div>
        </div>
        <div class="next-warp">
            <div class="next-tip">点击【下一步】即代表您已经同意<span @click="pageGo('/agreement-cancellation')">《用户注销协议》</span></div>
            <van-button block @click="userCancelFn">下一步</van-button>
        </div>
        <div class="next-warp-height"></div>
    </div>
</template>
<script setup>
import { userCancel } from '@/api/login'
import { pageGo } from '@/utils/composables'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const rep = /(\d{3})\d*(\d{4})/
const phone = userInfo.value.mobile.replace(rep, '$1****$2')
const router = useRouter()

const userCancelFn = async () => {
    const { code } = await userCancel()
    if (code === 518) {
        router.push({ name: 'cancellation-fail' })
    } else {
        router.push({ name: 'cancellation-verification' })
    }
}

</script>
<style lang="scss" scoped>
.account-cancellation-tips{
    .icon--unselect{
        padding-top: 39px;
        .van-image{
            width: 108px;
            height: 108px;
        }
    }
    .account-phone{
        font-size: 34px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #222222;
        text-align: center;
        margin-top: 53px;
    }
    .platform-tips{
        padding: 0 88px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        margin-top: 16px;
        margin-bottom: 44px;
    }
    .card{
        margin: 0 24px 20px;
        padding: 30px;
        background: #FFFFFF;
        border-radius: 16px;
        .card-title{
            font-size: 26px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #666666;
        }
        .card-item{
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            margin-top: 12px;
        }
    }
    .next-warp-height{
        width: 100%;
        height: 230px;
    }
    .next-warp{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0 24px 66px;
        .next-tip{
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #B8B7B7;
            text-align: center;
            span{
                color: #F16542;
            }
        }
        .van-button{
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            height: 88px;
            background: #F06441;
            border-radius: 12px;
            border: initial;
            margin-top: 42px;
        }
    }
}
</style>
