<template>
    <div class="newcomer-registration">
        <div class="top">
            <div class="logo"></div>
        </div>
        <div class="main-container">
            <div class="center">
                <div class="coupon-empty" v-if="!couponList.length"></div>
                <div class="coupon-container" v-else>
                    <ul class="coupon-box">
                        <template v-for="(el, ind) in couponList" :key="ind">
                            <li v-if="el?.couponDoorViewName" class="coupon">
                                <div class="text">优惠券</div>
                                <div class="money" :class="el.money.length > 4 ? 'small-text': ''">{{el.money}}<span class="unit">{{el.unit}}</span></div>
                                <div class="condition">{{el.couponDoorViewName}}</div>
                            </li>
                            <li v-else class="coupon not-coupon"></li>
                        </template>
                    </ul>
                </div>
                <div class="form">
                    <div class="form-text">下载/打开“恒生活APP”即可查看与使用优惠券,享受支付优惠</div>
                    <div class="form-btn" @click="onDown">立即下载</div>
                </div>
            </div>
            <div class="introduce last-introduce">
                <h3 class="title">活动流程</h3>
                <ul class="text-container">
                    <li class="introduce-text">1.下载并打开恒生活APP，点击“我的”—“优惠券”，可查看到账优惠券，优惠券可直接抵扣店内支付金额</li>
                    <li class="introduce-text">2.打开恒生活APP，点击“我的”—“到店支付”，扫描店内支付二维码，然后输入支付金额完成支付</li>
                </ul>
            </div>
            <div class="bottom-text">如有疑问，请联系客服 400-085-5858
                <div class="tips" v-if="isIos">本活动与苹果官方无关</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { isIos } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { getCouponList } from '@/api/store-pay'
import { Toast } from 'vant'

const route = useRoute()
const router = useRouter()

onMounted(() => {
    document.documentElement.scrollTo(0, 0)
})

const couponList = ref([])

const onDown = () => {
    router.push('/guide')
}

const init = async () => {
    const res = await getCouponList({ userId: route.query.userId })
    if (res.code === '200') {
        if (!res.data?.length) return
        const arr = new Array(3)
        res.data.map((el, ind) => {
            let couponTypeLabel = ''
            const unit = el.couponMinusViewName.slice(el.couponMinusViewName.length - 1, el.couponMinusViewName.length)
            const money = el.couponMinusViewName.slice(0, -1)
            switch (el.couponType) {
            case 1:
                couponTypeLabel = '无门槛'
                break
            case 2:
                couponTypeLabel = '满减券'
                break
            case 3:
                couponTypeLabel = '折扣券'
                break
            }
            arr[ind] = { ...el, couponTypeLabel, unit, money }
        })
        couponList.value = arr
    } else {
        Toast(res.msg)
    }
}
init()

</script>

<style lang="scss" scoped>
.newcomer-registration {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(180deg, #FFC6A1 0%, #FFF3EA 100%);
    .top {
        position: relative;
        height: 512px;
        &::before {
            content: '';
            position: absolute;
            top: 214px;
            left: 50%;
            transform: translateX(-50%);
            width: 272px;
            height: 74px;
            z-index: 1;
            background: url('../../assets/store-pay/result-text.png') no-repeat;
            background-size: 100% 100%;
        }
        &::after {
            content: '';
            position: absolute;
            top: 0;
            display: block;
            width: 100%;
            height: 625px;
            background: url('../../assets/store-pay/register-bj.png') no-repeat;
            background-size: 100% 100%;
        }
        .logo {
            position: absolute;
            top: 52px;
            left: 50%;
            z-index: 1;
            transform: translateX(-50%);
            width: 162px;
            height: 38px;
            background: url('../../assets/store-pay/logo.png') no-repeat;
            background-size: 100% 100%;
        }
        .result-text {
            position: absolute;
            top: 214px;
            left: 50%;
            transform: translateX(-50%);
            width: 272px;
            height: 74px;
            background: url('../../assets/store-pay/result-text.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    }
    .center {
        position: relative;
        width: 750px;
        // height: 700px;
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
            // display: inline-block;
            margin-left: 50%;
            transform: translateX(-50%);
            padding: 30px 30px 0;
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
                height: 230px;
                background: url('../../assets/store-pay/out-frame.png') no-repeat;
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
            .coupon-box {
                // margin: 30px 30px 0;
                overflow-x: scroll;
                width: 100%;
                height: 230px;
                display: flex;
                align-items: center;
                overflow-y: hidden;
                flex-wrap: nowrap;
                .coupon {
                    display: inline-block;
                    flex: none;
                    margin-right: 20px;
                    background: url('../../assets/store-pay/coupon-bg.png') no-repeat;
                    background-size: 100% 100%;
                    width: 184px;
                    height: 224px;
                    white-space: nowrap;
                    &:last-child{
                        margin-right: 0;
                    }
                    .text {
                        margin-top: 30px;
                        font-size: 20px;
                        text-align: center;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFECBE;
                        line-height: 28px;
                    }
                    .money {
                        text-align: center;
                        font-size: 64px;
                        font-family: DINAlternate-Bold, DINAlternate;
                        font-weight: bold;
                        color: #FF474C;
                        line-height: 74px;
                        background: linear-gradient(180deg, #FFF7DD 0%, #FEE3A5 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        .unit {
                            width: 28px;
                            height: 40px;
                            font-size: 28px;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: bold;
                            line-height: 40px;
                            // background: linear-gradient(180deg, #FFF7DD 0%, #FEE3A5 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }
                    .small-text {
                        font-size: 42px;
                    }
                    .condition {
                        margin-top: 42px;
                        font-size: 20px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFECBE;
                        line-height: 28px;
                        text-align: center;
                    }
                }
                .not-coupon {
                    background: url('../../assets/store-pay/coupon-not-bg.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        .form {
            position: relative;
            // top: 252px;
            overflow: hidden;
            margin-left: 15px;
            width: 720px;
            height: 446px;
            background: url('../../assets/store-pay/result-container-bg.png') no-repeat;
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
                background: url('../../assets/store-pay/button-bg.png') no-repeat;
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
        .form-top {
            top: -130px;
        }
    }
    .introduce {
        position: relative;
        margin: 30px auto;
        width: 710px;
        background: linear-gradient(90deg, #FFF4E6 0%, #FFD3A7 100%);
        box-shadow: 0px 5px 13px 0px #F9D7BC, 0px 1px 3px 0px rgba(0, 0, 0, 0.52);
        border-radius: 30px;
        border: 3px solid #FFFDE9;
        &::before{
            content: '';
            display: block;
            position: absolute;
            top: 39px;
            right: 67px;
            width: 207px;
            height: 207px;
            border-radius: 50%;
            background: linear-gradient(90deg, #FFECD7 0%, rgba(255, 255, 255, 0) 100%);
            opacity: 0.86;
        }
        .title {
            margin: 28px 0 20px 44px;
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #333333;
            line-height: 45px;
        }
        .introduce-text {
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
        }
        .text-area {
            margin: 0 auto 16px;
            padding: 47px 28px;
            box-sizing: border-box;
            width: 678px;
            height: 134px;
            background: linear-gradient(90deg, #FFFAF2 0%, #FEF1E2 100%);
            border-radius: 30px;
            border: 1px solid #FFD0BA;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #333333;
            line-height: 40px;
        }
        .text-container {
            position: relative;
            z-index: 2;
            margin: 0 auto 16px;
            padding: 30px 28px;
            box-sizing: border-box;
            width: 678px;
            background: linear-gradient(90deg, #FFFAF2 0%, #FEF1E2 100%);
            border-radius: 30px;
            border: 1px solid #FFD0BA;
            li {
                margin-bottom: 24px;
                &:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }
    .last-introduce {
        margin-bottom: unset;
    }
    .bottom-text {
        position: relative;
        padding: 40px 0 90px;
        text-align: center;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 37px;
        // height: 172px;
        .tips {
            position: absolute;
            top: 92px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #666666;
            line-height: 33px;
        }
    }

</style>
