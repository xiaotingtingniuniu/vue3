<template>
    <div class="fission-register">
        <!-- <activity-conduct></activity-conduct> -->
        <div class="banner"></div>
        <div class="explain" @click="isDialog = true">活动说明</div>
        <div class="center">
            <div class="coupon-container">
                <coupon v-if="dataState?.invitedCouponList" :coupon-list="[]" empty-text="优惠券已到账，请打开APP查看使用"></coupon>
            </div>
            <div class="form">
                <div class="form-text">下载/打开“恒生活APP”即可查看与使用优惠券,享受支付优惠</div>
                <div class="form-btn" @click="onDown">立即下载</div>
            </div>
        </div>
        <div class="fission-card activity-introduce">
            <h3 class="fission-card-title">优惠券说明</h3>
            <ul class="introduce-list">
                <li class="introduce-item">
                    <div class="desc">1.优惠券在（1）APP内下单预制菜使用；（2）恒生活智能零食货柜，使用APP“扫码”开门购物结算核销使用；（3）恒生活美食工坊门店，使用恒生活APP结算核销使用；</div>
                </li>
                <li class="introduce-item">
                    <div class="desc">2.优惠券有效日期，详见恒生活APP，个人中心-优惠券内容；</div>
                </li>
            </ul>
        </div>
        <div class="fission-card activity-introduce">
            <h3 class="fission-card-title">App介绍</h3>
            <ul class="introduce-list">
                <li class="introduce-item">
                    <div class="desc">恒生活APP，是一款本地化数字生活服务平台和预制菜交易平台，也是恒生活智能货柜开门购物的官方入口。</div>
                </li>
                <li class="introduce-item">
                    <div class="desc">用户可通过APP直接线上下单购买多种预制菜和便利食品，也可以可使用APP在恒生活智能货柜上扫码开门、购物及支付。</div>
                </li>
            </ul>
        </div>
        <footer class="footer fx j-s-c a-l-c">
            <img :src="require('@assets/activity/fission/footer-icon.png')" alt="">
        </footer>
        <explain v-model="isDialog" title="被邀请方活动说明" :text="dataState.invitedCouponDesc"></explain>
    </div>
</template>
<script setup>
import coupon from '../components/coupon'
import { useRouter } from 'vue-router'
import { received } from '@api/fission'
import explain from '../components/explain'
import { shareWX } from '@/utils/wx'

const router = useRouter()

const dataState = reactive({
    invitedCouponList: [],
    invitedCouponDesc: ''
})

onMounted(() => {
    document.documentElement.scrollTo(0, 0)
    console.log(`${window.location.href}?shareRedirect=invite-register`, 'sss')
    shareWX({ url: `${window.location.href}?shareRedirect=invite-register` })
})

const isDialog = ref(false)

const init = async () => {
    const res = await received()
    if (res.code === '200') {
        dataState.invitedCouponList = res.data?.invitedCouponList.filter(el => {
            if (el.couponMinusViewName) {
                return el
            }
        })
        dataState.invitedCouponDesc = res.data.invitedCouponDesc
    }
}
init()

const onDown = () => {
    router.push('/guide')
}

</script>
<style lang="scss" scoped>
@import url('../../../../styles/fission/common.scss');
.fission-register {
    position: relative;
    min-height: 100vh;
    background: #FE8029;
    .banner {
        height: 638px;
        background: url('~@assets/activity/fission/receive-success.png') no-repeat;
        background-size: 100% 100%;
    }
    .explain {
        position: absolute;
        top: 100px;
        right: 0;
        width: 118px;
        height: 44px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 100px 0px 0px 100px;
        font-size: 22px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FF503A;
        line-height: 44px;
        text-align: center;
    }
     .center {
        margin-top: 10px;
        position: relative;
        width: 750px;
        .coupon-empty {
            position: relative;
            margin-left: 15px;
            width: 720px;
            height: 52px;
            border-top: 4px solid #FAD793;
            border-left: 4px solid #FAD793;
            border-right: 4px solid #FAD793;
            border-radius: 61px 61px 0 0;
            background: #ff1e35;
            &::after {
                content: '';
                position: absolute;
                top: 36px;
                left: 50%;
                transform: translateX(-50%);
                width: 668px;
                height: 168px;
                background: #FFF0DA;
                border-radius: 23px;
                border: 4px solid #FFF0DA;
            }
        }
        .coupon-container {
            margin-left: 50%;
            transform: translateX(-50%);
            padding: 30px 0 0;
            box-sizing: border-box;
            width: 668px;
            &::before{
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 50%;
                z-index: -2;
                transform: translateX(-50%);
                top: 50px;
                width: 720px;
                // height: 230px;
                height: 515px;
                background: url('~@assets/activity/fission/coupon-content-bg.png') no-repeat;
                background-size: 100% 100%;
            }
            &::after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 50%;
                z-index: -1;
                transform: translateX(-50%);
                width: 668px;
                height: 387px;
                background: #FFF0DA;
                border-radius: 23px;
                border: 4px solid #FFF0DA;
            }
        }
        .form {
            position: relative;
            // top: 252px;
            overflow: hidden;
            margin-left: 15px;
            width: 720px;
            height: 446px;
            background: url('~@assets/activity/fission/receive-form-bg.png') no-repeat;
            background-size: 100% 100%;
            .form-text {
                margin: 114px auto 0;
                width: 527px;
                height: 96px;
                text-align: center;
                font-size: 34px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 48px;
            }
            .form-btn {
                margin: 54px auto 0;
                width: 650px;
                height: 96px;
                background: url('~@assets/activity/fission/button-bg.png') no-repeat;
                background-size: 100% 100%;
                text-align: center;
                line-height: 96px;
                font-size: 38px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFF;
                cursor: pointer;
            }
        }
    }
    .activity-introduce {
        .introduce-list {
            margin-top: 15px;
            padding-bottom: 36px;
            .introduce-item {
                margin: 24px auto 0;
                padding: 20px;
                box-sizing: border-box;
                width: 642px;
                background: #FFF1E8;
                border-radius: 16px;
                border: 1px solid #FFD6CF;
                .title {
                    height: 40px;
                    font-size: 28px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #7F3615;
                    line-height: 40px;
                }
                .desc {
                    margin-top: 12px;
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #7F3615;
                    line-height: 37px;
                }
            }
        }
    }
    .footer {
        height: 147px;
        img {
            display: block;
            width: 200px;
            height: 47px;
        }
    }
}
</style>
