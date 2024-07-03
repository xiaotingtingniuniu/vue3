<template>
    <div class="cancellation-verification">
        <div class="card">
            <div class="title">
                <div class="icon--unselect">
                    <van-image :src="require('@/assets/mine/编组 3@2x.png')"/>
                </div>
                <span>为确保是您本人操作，请完成以下验证</span>
            </div>
            <div class="account">{{ phone }}</div>
            <div class="verification">
                <van-field v-model="digit" type="digit" placeholder="请输入验证码" :border="false" maxlength="6">
                    <template #right-icon>
                        <div class="icon--unselect" v-if="digit" @click="digit=''">
                            <van-image :src="require('@/assets/mine/删@2x.png')"/>
                        </div>
                    </template>
                </van-field>
                <van-button @click="getSendSms" :class="smsText!=='获取验证码' ? 'style1' : ''">{{ smsText }}</van-button>
            </div>
        </div>
        <div class="button-box">
            <van-button block class="confirm" @click="cancelSubmitFn" :class="digit.length === 6 ? 'opacity' : ''">确认注销</van-button>
        </div>
    </div>
</template>
<script setup>
import { sendSms, cancelSubmit } from '@/api/login'
import { Toast } from 'vant'
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const rep = /(\d{3})\d*(\d{4})/
const phone = userInfo.value.mobile.replace(rep, '$1****$2')
const digit = ref('')
const smsText = ref('获取验证码')

const getSendSms = async () => {
    if (smsText.value === '获取验证码') {
        const { code } = await sendSms({
            userType: 1,
            mobile: userInfo.value.mobile
        })
        if (code === 200) {
            countDownFn()
        }
    }
}
const timer = ref(null)
const count = ref(60)
const countDownFn = () => {
    smsText.value = `${count.value}s后获取`
    timer.value = setTimeout(() => {
        clearTimeout(timer.value)
        if (count.value === 0) {
            smsText.value = '获取验证码'
            count.value = 60
        } else {
            count.value--
            smsText.value = `${count.value}s后获取`
            countDownFn()
        }
    }, 1000)
}

const cancelSubmitFn = async () => {
    if (digit.value.length !== 6) return false
    const { code } = await cancelSubmit({
        userType: 1,
        code: digit.value
    })
    if (code === 200) {
        // 注销成功 清空缓存
        localStorage.clear()
        sessionStorage.clear()
        Toast('账号注销完成')
        const timer = setTimeout(() => {
            clearTimeout(timer)
            window.location.replace(`${location.origin}/mine`)
        }, 1500)
    }
}

</script>
<style lang="scss" scoped>
.cancellation-verification{
    padding-top: 24px;
    .card{
        margin: 0 24px;
        padding: 30px 28px;
        background: #FFFFFF;
        border-radius: 16px;
        .title{
            display: flex;
            .icon--unselect{
                margin-right: 12px;
                .van-image{
                    width: 30px;
                    height: 30px;
                }
            }
            span{
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #222222;
            }
        }
        .account{
            font-size: 34px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #222222;
            margin-top: 30px;
        }
        .verification{
            display: flex;
            justify-content: space-between;
            margin-top: 18px;
            .van-field{
                flex: 1;
                height: 88px;
                background: #FAFAFA;
                border-radius: 16px;
                margin-right: 20px;
                .icon--unselect{
                    width: 30px;
                    height: 30px;
                    .van-image{
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            .van-button{
                width: 240px;
                height: 88px;
                background: #F16542;
                border-radius: 16px;
                border: initial;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
            }
            .style1{
                color: #999999;
                background: #F4F4F4;
            }
        }
    }
    .button-box{
        position: fixed;
        left: 24px;
        right: 24px;
        bottom: 0;
        padding-bottom: 66px;
        .confirm{
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
            background: #F06441;
            border-radius: 12px;
            opacity: 0.49;
        }
        .opacity{
            opacity: 1;
        }
    }
}
</style>
