<template>
    <div class="invite-com">
        <div class="banner"></div>
        <div class="explain" @click="isDialog = true">活动说明</div>
        <div class="coupon-container">
            <h3 class="title">每邀请1位<span>新用户注册</span>你有机会获得以下奖励</h3>
            <div class="content">
                <coupon :coupon-list="props.invitationCouponList || []" :loading="props.loading" :empty-text="props.invitationCouponList.length ? '' : '优惠券已过期，无可领优惠券'"></coupon>
                <div class="receive-content">
                    <p class="count-down" v-if="props.info.promoStatus === 5">距本期结束时间：&nbsp;&nbsp;{{props.time}}</p>
                    <p class="count-down" v-else>活动未开始</p>
                    <div class="receive" v-if="props.invitationCouponList.length || props.invitedCouponList.length" id="receive" @click="onReceive">立即邀请</div>
                    <div class="receive btn-d-6" v-else id="receive">立即邀请</div>
                </div>
            </div>
        </div>
        <div class="fission-card invited-container">
            <h3 class="fission-card-title title">被邀请人可获得优惠券</h3>
            <div class="coupon-content">
                <coupon :coupon-list="props.invitedCouponList || []" :loading="props.loading" :empty-text="props.invitedCouponList.length ? '' : '优惠券已过期，无可领优惠券'"></coupon>
            </div>
        </div>
        <div class="fission-card step-container">
            <h3 class="fission-card-title title">如何获得奖励</h3>
            <ul class="step-list fx">
                <li class="step-item fx-1 j-s-c" v-for="(step, index) in dataState.steps" :key="index">
                    <van-image :src="step.icon"/>
                    <h3 class="title">{{step.label}}</h3>
                    <div class="desc">{{step.desc}}</div>
                </li>
            </ul>
        </div>
        <div class="fission-card participate-container">
            <h3 class="fission-card-title">参与方式</h3>
            <ul class="participate-list">
                <li class="participate-item">
                    <h3 class="title">1.链接邀请</h3>
                    <div class="desc">将链接分享至微信好友/朋友圈，好友点击链接，成功注册后，您与被邀请人均可获得优惠券奖励。</div>
                </li>
                <li class="participate-item">
                    <h3 class="title">2.分享海报</h3>
                    <div class="desc">将活动海报保存至相册，将海报分享给好友，好友使用微信扫一扫，成功注册后，您与被邀请人均可获得优惠券奖励。</div>
                </li>
            </ul>
        </div>
        <explain v-model="isDialog" title="邀请方活动说明" :text="props.invitationCouponDesc"></explain>
    </div>
</template>
<script setup>
import { getInvitationCode, fissionShare } from '@api/fission'
import { appBridge } from '@utils/bridge'
import coupon from '../../components/coupon'
import { Toast } from 'vant'
import explain from '../../components/explain'

const store = useStore()
const props = defineProps({
    time: {
        type: String
    },
    activityInfo: {
        type: Object,
        default: () => {}
    },
    invitationCouponList: {
        type: Array,
        default: () => []
    },
    invitedCouponList: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    receiveChange: {
        type: Boolean,
        default: false
    },
    invitationCouponDesc: {
        type: String
    },
    promoCode: {
        type: String,
        default: ''
    },
    info: {
        type: Object,
        default: () => {}
    }
})
const emit = defineEmits(['btn-change', 'refresh'])

const dataState = reactive({
    steps: [
        { label: '邀请好友', icon: require('@assets/activity/fission/share-icon.png'), desc: '分享活动给好友' },
        { label: '好友注册', icon: require('@assets/activity/fission/mobile-icon.png'), desc: '注册恒生活APP' },
        { label: '获得奖励', icon: require('@assets/activity/fission/gift-icon.png'), desc: '获得更多优惠' }
    ]
})
const isDialog = ref(false)
// 活动编码
const invitationCode = ref()

// 获取用户邀请码
const getInviteCode = async () => {
    const res = await getInvitationCode()
    invitationCode.value = res.invitationCode
}

onMounted(() => {
    watch(
        () => store.state.token,
        () => {
            if (store.state.token) {
                // 用户邀请记录
                getInviteCode()
            }
        },
        {
            immediate: true
        }
    )
    watch(() => props.receiveChange,
        () => {
            onReceive()
        })
    document.addEventListener('scroll', () => {
        const btn = document.querySelector('#receive')
        if ((btn.getBoundingClientRect().top + 60) < 0) {
            emit('btn-change', true)
        } else {
            emit('btn-change', false)
        }
    })
})

// 立即领取
const onReceive = async () => {
    // 4 待开始 5在线 6 已停止 7 已结束
    if (props.info && (props.info.promoStatus === 4 || props.info.promoStatus === 3 || props.info.promoStatus === 2 || props.info.promoStatus === 1)) {
        Toast('活动未开始,，请稍后再试！')
        return
    }
    if (props.info && (props.info.promoStatus === 6 || props.info.promoStatus === 7)) {
        Toast('活动已结束！')
        return
    }
    if (!props.invitationCouponList.length) {
        Toast('优惠券已发完，活动参与失败！')
        return
    }
    if (!props.invitedCouponList.length) {
        Toast('优惠券已发完，活动参与失败！')
        return
    }
    if (!invitationCode.value) {
        Toast('未获取到邀请码，请稍后再试！')
        return
    }
    const res = await fissionShare({ promoCode: props.promoCode, invitationBatchCodeList: props.invitationCouponList.map(el => el.batchCode) })
    if (res.code === '200') {
        if (!res.data?.canShare) {
            emit('refresh')
            Toast(res.data.notShareReason)
            return
        }
    } else {
        return
    }
    let couponList = []
    if (props.invitedCouponList) {
        const arr = JSON.parse(JSON.stringify(props.invitedCouponList))
        couponList = arr.map(el => {
            return { ...el, batchName: '优惠券' }
        })
    }
    const param = {
        url: `${window.location.origin}/fission/invite-register/${invitationCode.value}`,
        couponList: couponList || []
    }
    appBridge('fissionShare', param)
}

</script>
<style lang="scss" scoped>
@import url('~@styles/fission/common.scss');
.invite-com {
    position: relative;
    .banner {
        height: 638px;
        background: url('~@assets/activity/fission/invite-banner.png') no-repeat;
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
    .coupon-container {
        padding-top: 26px;
        position: relative;
        z-index: 0;
        .title {
            margin: 0 auto;
            width: 674px;
            height: 89px;
            text-align: center;
            background: linear-gradient(180deg, #FFF6E5 0%, #FFE7C3 100%);
            font-size: 28px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #333;
            line-height: 89px;
            border-radius: 23px 23px 0 0;
            span {
                color: #FF474C;
            }
        }
        .content {
            padding-top: 21px;
            margin: 0 auto;
            width: 668px;
            height: 430px;
            background: #FFF0DA;
            border: 3px solid #FFD6BD;
            border-radius: 0 0 23px 23px;
            border-top: 0px;
            &::before {
                content: '';
                display: block;
                position: absolute;
                top: 54px;
                left: 50%;
                z-index: -1;
                transform: translateX(-50%);
                width: 720px;
                height: 515px;
                background: url('~@assets/activity/fission/coupon-content-bg.png') no-repeat;
                background-size: 100% 100%;
            }
            .empty {
                margin: unset;
                padding: 89px 0 73px;
            }
            .receive-content {
                overflow: hidden;
                transform: translateX(-26px);
                width: 720px;
                height: 268px;
                background: url('~@assets/activity/fission/receive-bg.png') no-repeat;
                background-size: 100% 100%;
                .count-down {
                    margin-top: 76px;
                    height: 30px;
                    text-align: center;
                    font-size: 22px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #FFE5D3;
                    line-height: 30px;
                }
                .receive {
                    margin: 23px auto 0;
                    width: 612px;
                    height: 96px;
                    background: url('~@assets/activity/fission/button-bg.png') no-repeat;
                    background-size: 100% 100%;
                    font-size: 38px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                    line-height: 96px;
                    text-align: center;
                }
            }
        }
    }
    .invited-container {
        margin-top: 40px;
        overflow: hidden;
        .fission-card-title {
            width: 442px;
        }
        .coupon-content {
            padding: 49px 0 41px;
            margin: auto;
            width: 688px;
            overflow: hidden;
        }
    }
    .step-container {
        padding-bottom: 35px;
        .step-list {
            margin-top: 52px;
            width: 100%;
            text-align: center;
            .step-item {
                position: relative;
                &::after {
                    content: '';
                    position: absolute;
                    top: 35px;
                    left: 50%;
                    z-index: -1;
                    width: 100%;
                    border-top: 1px dashed #FD8A47;
                }
                &:last-child {
                    &::after {
                        content: '';
                        display: none;
                    }
                }
            }
            .van-image {
                width: 70px;
                height: 70px;
            }
            .title {
                margin-top: 12px;
                height: 40px;
                font-size: 28px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #7C3312;
                line-height: 40px;
            }
            .desc {
                margin-top: 6px;
                height: 33px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #7C3312;
                line-height: 33px;
            }
        }
    }
    .participate-container {
        .participate-list {
            margin-top: 15px;
            padding-bottom: 36px;
            .participate-item {
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
}
</style>
