<template>
    <div class="newcomer-registration">
        <div class="top">
            <div class="icon share" @click="onShare"></div>
            <div class="logo"></div>
            <div class="theme-text"></div>
        </div>
        <div class="main-container">
            <div class="center">
                <div class="coupon-empty" v-if="!dataState.isCoupon"></div>
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
                    <div class="phone-inp form-inp">
                        <span class="inp-icon phone-icon"></span>
                        <input type="tel" v-model="dataState.mobile" placeholder="输入手机号" maxlength="11" @focus="dataState.delIcon = true" @blur="onBlur('delIcon')">
                        <span class="get-code" v-if="!isGetCode" @click="getCode">获取验证码</span>
                        <span class="count-down" v-else>{{codeCount}}s后获取</span>
                        <span v-if="dataState.delIcon" class="del-icon" @click="cleanText('mobile')"></span>
                    </div>
                    <div class="code-inp form-inp">
                        <span class="inp-icon code-icon"></span>
                        <input type="tel" v-model="dataState.code" placeholder="输入验证码" maxlength="6" @focus="dataState.delIconCode = true" @blur="onBlur('delIconCode')">
                        <span v-if="dataState.delIconCode" class="del-icon" @click="cleanText('code')"></span>
                    </div>
                    <div class="form-btn" @click="onReceive">立即领取</div>
                    <p class="form-tip"><span class="check" :class="checkClass" @click="checkChange"></span>我已阅读并接受 <router-link :to="{name: 'agreement-privacy'}">《用户隐私协议》</router-link><router-link :to="{name: 'agreement-service'}">《用户服务协议》</router-link></p>
                </div>
            </div>
            <div class="introduce">
                <h3 class="title">活动规则</h3>
                <p class="text-area">该活动仅限未注册过恒生活APP的用户参与</p>
            </div>
            <div class="introduce last-introduce">
                <h3 class="title">活动流程</h3>
                <ul class="text-container">
                    <li class="introduce-text">1.填写手机号完成注册，注册成功后优惠券将发放至恒生活APP中</li>
                    <li class="introduce-text">2.下载并打开恒生活APP，点击“我的”-“优惠券”，可查看到账优惠券，优惠券可直接抵扣货柜购物支付金额</li>
                    <li class="introduce-text">3.打开恒生活APP，点击底部菜单栏中间的“扫描”按钮，扫描货柜二维码开柜购物，在关闭柜门后完成支付</li>
                </ul>
            </div>
            <div class="bottom-text">如有疑问，请联系客服 400-085-5858
                <div class="tips" v-if="isIos">本活动与苹果官方无关</div>
            </div>
        </div>
        <div class="mask" v-if="isMask" @click="isMask = false">
            <div class="share-arrow"></div>
            <div class="share-text"></div>
        </div>
    </div>
</template>

<script setup>
import { isIos, isMobile } from '@/utils'
import { shareWX } from '@/utils/wx'
import { getCouponListApi, getMobileCode, receiveCoupon } from '@/api/store-pay'
import { Toast } from 'vant'

const router = useRouter()
const store = useStore()
const props = defineProps(['shopCode', 'promoCode'])

onMounted(() => {
    document.documentElement.scrollTo(0, 0)
    shareWX({ url: window.location.href })
})

const dataState = reactive({
    timer: null,
    mobile: '',
    code: '',
    isCoupon: false,
    couponBatchCodeList: [],
    delIcon: false,
    delIconCode: false
})

const checked = ref(false)
const isMask = ref(false)
const couponList = ref([])
const codeCount = ref(60)
const isGetCode = ref(false)

// 勾选协议
const checkChange = () => {
    checked.value = !checked.value
}

const checkClass = computed(() => checked.value ? 'checked' : '')

const splitConpon = (el) => {
    const arr = []
    if (el.singleUserMax > 1) {
        for (let i = 0; i < el.singleUserMax; i++) {
            const unit = el.couponMinusViewName.slice(el.couponMinusViewName.length - 1, el.couponMinusViewName.length)
            const money = el.couponMinusViewName.slice(0, -1)
            arr.push({ ...el, unit, money })
        }
    } else {
        const unit = el.couponMinusViewName.slice(el.couponMinusViewName.length - 1, el.couponMinusViewName.length)
        const money = el.couponMinusViewName.slice(0, -1)
        arr.push({ ...el, unit, money })
    }
    return arr
}

// 获取优惠券
const getCouponList = async () => {
    const res = await getCouponListApi({ promoCode: props.promoCode })
    if (res.code === '200') {
        if (!res.data?.length) return
        dataState.isCoupon = true
        let arr = []
        res.data.map((el, ind) => {
            dataState.couponBatchCodeList.push(el.batchCode)
            arr = [...arr, ...splitConpon(el)]
        })
        const len = 3 - arr.length
        if (len > 0) {
            const nullArr = new Array(len)
            arr = [...arr, ...nullArr]
        }
        couponList.value = arr
    }
}
getCouponList()

const cleanText = key => {
    dataState[key] = ''
}

const onBlur = (key) => {
    const time = setTimeout(() => {
        dataState[key] = false
        clearTimeout(time)
    }, 0)
}

// 获取验证码
const getCode = async () => {
    if (isGetCode.value) return
    if (!dataState.mobile) {
        Toast('手机号不可为空！')
        return
    }
    if (!isMobile(dataState.mobile)) {
        Toast('请输入正确格式的手机号！')
        return
    }
    const res = await getMobileCode({ mobile: dataState.mobile })
    if (res.code === 200) {
        Toast(res.data)
        isGetCode.value = true
        dataState.timer = setInterval(() => {
            if (codeCount.value <= 1) {
                clearInterval(dataState.timer)
                codeCount.value = 60
                dataState.timer = null
                isGetCode.value = false
                return
            }
            codeCount.value -= 1
        }, 1000)
    }
}

// 立即领取
const onReceive = async () => {
    if (!dataState.mobile) {
        Toast('手机号不可为空！')
        return
    }
    if (!isMobile(dataState.mobile)) {
        Toast('请输入正确格式的手机号！')
        return
    }
    if (!isGetCode.value) {
        Toast('请发送验证码！')
        return
    }
    if (!dataState.code) {
        Toast('验证码不可为空！')
        return
    }
    if (!checked.value) {
        Toast('请阅读并同意用户协议！')
        return
    }
    if (!dataState.couponBatchCodeList.length) {
        Toast('无可领取优惠券!')
        return
    }
    const param = {
        mobile: dataState.mobile, // 手机号
        couponBatchCodeList: dataState.couponBatchCodeList, // 优惠编号券列表
        shopCode: props.shopCode, // 店铺编号
        code: dataState.code // 短信验证码
    }
    const res = await receiveCoupon(param)
    if (res.code === 200) {
        store.dispatch('updateToken', res.data.token)
        const timer = setTimeout(() => {
            Toast('领取成功！')
            clearTimeout(timer)
            router.push({ name: 'receive-result', query: { userId: res.data.userId } })
        }, 300)
    }
    // else {
    //     Toast(res.msg)
    // }
}

const onShare = () => {
    isMask.value = true
}
</script>

<style lang="scss" scoped>
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
    width: 100vw;
    height: 100vh;
    &::before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        background: #000;
        opacity: 0.69;
        width: 100vw;
        height: 100vh;
    }
    .share-arrow {
        position: absolute;
        top: 33px;
        right: 152px;
        z-index: 10;
        width: 282px;
        height: 233px;
        background: url('../../assets/store-pay/share-arrow.png') no-repeat;
        background-size: 100% 100%;
    }
    .share-text {
        position: absolute;
        top: 301px;
        right: 207px;
        width: 338px;
        height: 90px;
        z-index: 10;
        background: url('../../assets/store-pay/share-text.png') no-repeat;
        background-size: 100% 100%;
    }
}
.newcomer-registration {
    width: 100%;
    background: linear-gradient(180deg, #FFC6A1 0%, #FFF3EA 100%);
    .top {
        position: relative;
        height: 512px;
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
        .share {
            position: absolute;
            top: 47px;
            right: 20px;
            z-index: 1;
            width: 50px;
            height: 50px;
            background: url('../../assets/store-pay/share-icon.png') no-repeat;
            background-size: 100% 100%;
        }
        .theme-text {
            position: absolute;
            top: 175px;
            left: 50%;
            z-index: 1;
            transform: translateX(-50%);
            width: 272px;
            height: 165px;
            background: url('../../assets/store-pay/theme-text.png') no-repeat;
            background-size: 100% 100%;
        }
    }
    }
    .main-container {
        position: relative;
    }
    .center {
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
                    width: 190px;
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
            overflow: hidden;
            // z-index: 9;
            margin-left: 15px;
            width: 720px;
            height: 536px;
            background: url('../../assets/store-pay/form-bg.png') no-repeat;
            background-size: 100% 100%;
            input {
                width: 642px;
                height: 82px;
                line-height: 82px;
                background: linear-gradient(90deg, #FFFFFF 0%, #FFFFFF 100%);
                border-radius: 20px;
                border: 1px solid #FFD0BA;
                outline: unset;
                text-indent: 74px;
                font-size: 28px;
                &::placeholder {
                    color: #999;
                }
            }
            .inp-icon {
                position: absolute;
                top: 28px;
                left: 30px;;
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            .phone-inp {
                position: relative;
                margin: 86px auto 0;
                width: 642px;
                .phone-icon {
                    background: url('../../assets/store-pay/phone-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .get-code {
                    position: absolute;
                    top: 21px;
                    right: 40px;
                    width: 150px;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FF464C;
                    line-height: 40px;
                    cursor: pointer;
                }
                .count-down {
                    position: absolute;
                    top: 21px;
                    right: 40px;
                    width: 150px;
                    height: 40px;
                    font-size: 28px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #999999;
                    line-height: 40px;
                    text-align: right;
                }
                .del-icon {
                    display: inline-block;
                    position: absolute;
                    top: 24px;
                    right: 200px;
                    z-index: 9;
                    width: 30px;
                    height: 30px;
                    background: url('../../assets/store-pay/del-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .code-inp {
                position: relative;
                margin: 20px auto 0;
                width: 642px;
                .code-icon {
                    left: 32px;
                    width: 26px;
                    background: url('../../assets/store-pay/code-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .del-icon {
                    display: inline-block;
                    position: absolute;
                    top: 26px;
                    right: 26px;
                    z-index: 9;
                    width: 30px;
                    height: 30px;
                    background: url('../../assets/store-pay/del-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .form-btn {
                margin: 30px auto 0;
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
            .form-tip {
                margin: 22px auto 0;
                width: 620px;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 40px;
                .check {
                    position: relative;
                    top: 10px;
                    display: inline-block;
                    // margin-right: 10px;
                    width: 36px;
                    height: 36px;
                    background: url('../../assets/store-pay/check-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .checked {
                    background: url('../../assets/store-pay/checked-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                a {
                    color: #FFFFFF;
                }
            }
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
            position: relative;
            z-index: 2;
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
