<template>
    <div class="invite-com">
        <div class="banner"></div>
        <div class="explain" @click="isDialog = true">活动说明</div>
        <div class="center">
            <div class="coupon-container">
                <coupon :coupon-list="props.couponList" :loading="props.loading" :empty-text="props.couponList.length ? '' : '优惠券已过期，无可领优惠券'"></coupon>
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
                <div class="form-btn" v-if="props.couponList.length" @click="onReceive">立即领取</div>
                <div class="form-btn disab-btn" v-else>立即领取</div>
                <p class="form-tip"><span class="check" :class="checkClass" @click="checkChange"></span>我已阅读并接受 <router-link :to="{name: 'agreement-privacy'}">《用户隐私协议》</router-link><router-link :to="{name: 'agreement-service'}">《用户服务协议》</router-link></p>
            </div>
        </div>
        <explain v-model="isDialog" title="被邀请方活动说明" :text="props.invitedCouponDesc"></explain>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { isMobile } from '@/utils'
import coupon from '../../components/coupon'
import { register } from '@api/fission'
import { getMobileCode } from '@/api/store-pay'
import explain from '../../components/explain'

const route = useRoute()
const router = useRouter()
const store = useStore()

const props = defineProps({
    couponList: {
        type: Object,
        default: () => { }
    },
    loading: {
        type: Boolean,
        default: false
    },
    invitedCouponDesc: {
        type: String
    },
    promoCode: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['refresh'])

const dataState = reactive({
    couponList: [],
    timer: null,
    mobile: '',
    code: '',
    delIcon: false,
    delIconCode: false
})

const checked = ref(false)
const codeCount = ref(60)
const isGetCode = ref(false)
const isDialog = ref(false)

// 勾选协议
const checkChange = () => {
    checked.value = !checked.value
}

const checkClass = computed(() => checked.value ? 'checked' : '')

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
    if (!props.couponList.length) {
        Toast('抱歉，本次活动优惠券已发完~')
        return
    }
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
    const param = {
        mobile: dataState.mobile, // 手机号
        code: dataState.code, // 短信验证码
        invitationCode: route.params.code, // 邀请码
        promoCode: props.promoCode
    }
    const res = await register(param)
    if (res.code === 200) {
        store.dispatch('updateToken', res.data.token)
        const timer = setTimeout(() => {
            Toast('领取成功！')
            clearTimeout(timer)
            router.push({ name: 'invite-receive-result', params: { code: route.params.code } })
        }, 300)
    } else {
        emit('refresh')
        Toast(res.msg)
    }
}

</script>
<style lang="scss">
@import url('~@styles/fission/common.scss');
.invite-com {
    position: relative;
    .banner {
        height: 638px;
        background: url('~@assets/activity/fission/register-banner.png') no-repeat;
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
            overflow: hidden;
            // z-index: 9;
            margin-left: 15px;
            width: 720px;
            height: 536px;
            // background: url('~@assets/store-pay/form-bg.png') no-repeat;
            background: url('~@assets/activity/fission/receive-form1-bg.png') no-repeat;
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
                    background: url('~@assets/store-pay/phone-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .get-code {
                    position: absolute;
                    // top: 21px;
                    top: 50%;
                    transform: translateY(-50%);
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
                    top: 50%;
                    right: 40px;
                    transform: translateY(-50%);
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
                    // top: 24px;
                    top: 50%;
                    right: 200px;
                    transform: translateY(-50%);
                    z-index: 9;
                    width: 30px;
                    height: 30px;
                    background: url('~@assets/store-pay/del-icon.png') no-repeat;
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
                    background: url('~@assets/store-pay/code-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .del-icon {
                    display: inline-block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 26px;
                    z-index: 9;
                    width: 30px;
                    height: 30px;
                    background: url('~@assets/store-pay/del-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .form-btn {
                margin: 30px auto 0;
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
            .disab-btn {
                opacity: 0.49
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
                    background: url('~@assets/store-pay/check-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .checked {
                    background: url('~@assets/store-pay/checked-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                a {
                    color: #FFFFFF;
                }
            }
        }
    }
    .invited-container {
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
}
</style>
