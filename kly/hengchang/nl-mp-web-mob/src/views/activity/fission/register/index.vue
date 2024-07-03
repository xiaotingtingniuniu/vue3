<template>
    <div class="fission-register">
        <activity-conduct
            v-if="dataState.promoStatus === 5"
            :coupon-list="dataState.invitedCouponList"
            :loading="dataState.loading"
            :invited-coupon-desc="dataState.invitedCouponDesc"
            :promoCode="dataState.promoCode"
            @refresh="init"
        >
        </activity-conduct>
        <activity-end v-else></activity-end>
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
    </div>
</template>
<script setup>
import { reactive } from 'vue'
import activityConduct from './components/activity-conduct.vue'
import activityEnd from './components/activity-end.vue'
import { getActivityInfoNoLogin } from '@api/fission'
import { shareWX } from '@/utils/wx'

const dataState = reactive({
    // isActivity: true,
    promoStatus: 5, // 活动状态
    invitedCouponList: [],
    loading: false,
    invitedCouponDesc: '',
    promoCode: '' // 活动编码
})

const init = async () => {
    dataState.loading = true
    const res = await getActivityInfoNoLogin()
    dataState.loading = false
    if (res.code === '200') {
        dataState.promoStatus = res.data.promoStatus
        dataState.promoCode = res.data.promoCode
        dataState.invitedCouponDesc = res.data.invitedCouponDesc
        // 根据优惠券金额过滤优惠券列表
        dataState.invitedCouponList = res.data?.invitedCouponList.filter(el => {
            if (el.couponMinusViewName) {
                return el
            }
        })
        // if (new Date().getTime() > res.data.endTimeStamp) {
        //     dataState.isActivity = false
        // }
    }
}
init()

onMounted(() => {
    document.documentElement.scrollTo(0, 0)
    shareWX({ url: window.location.href })
})
</script>
<style lang="scss" scoped>
.fission-register {
    min-height: 100vh;
    background: #FE8029;
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
