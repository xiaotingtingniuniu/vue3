
<template>
    <div class="sign-contract">
        <div class="top-bg">
            <div class="tit">
                <p class="tit">尊敬的{{merchantName}}<span v-if="merchantType===2">先生/女士</span>，</p>
                <span class="tips" v-if="type===1">您好！您的<span>{{busiType[busi]}}</span>业务线的入驻申请平台已处理，请您进行入驻确认。</span>
                <span class="tips" v-else>您好！您的<span>{{busiType[busi]}}</span>业务线的入驻申请已提交，请您登录商家PC查看更多。</span>
            </div>
        </div>
        <div class="verbox-outter" v-if="type===1">
            <p class="phone">{{phone.replace(/^(\d{3})\d+(\d{4})$/,'$1 **** $2')}}</p>
            <div class="code_btn">
                <input maxlength='6' placeholder="请输入短信验证码" class="code" v-model="codeVal">
                <p class="get_code" v-if="countDownText===''" @click="getCode">获取验证码</p>
                <p class="reget_code" v-if="countDownText!==''">{{countDownText}}后重试</p>
            </div>
            <div class="confirm" @click="confirm">确定</div>
        </div>
        <div class="copyurl-outter" v-else>
            <p class="tit">https://customer.hengshenghuo.com/login</p>
            <div class="copy-btn" @click="copy('https://customer.hengshenghuo.com/login')">复制链接</div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Toast } from 'vant'
import useClipboard from 'vue-clipboard3'
import { getDetail, sendMsg, verCode } from '@/api/sign-contract'
const route = useRoute()
const router = useRouter()
// 复制
const { toClipboard } = useClipboard()
console.log(route.params.id, route.params.busi)
// 账号状态
const type = ref(null)
const busi = ref(null)
const phone = ref('')
const countDown = ref(60)
const countDownText = ref('')
const timer = ref(null)
const codeVal = ref('')
const merchantName = ref('')
const merchantType = ref('')
const busiType = ref({
    A1001001: '到家电商/平台商家',
    A1001002: '智能货柜',
    A1001005: 'B2B商城',
    A1001009: '供应商',
    A1001010: '本地生活'
})
// 账户详情
const getMaDatail = async () => {
    const param = {
        busiCode: route.params.busi,
        appKey: 'A1001001',
        busiMerchantId: route.params.id
    }
    const res = await getDetail(param)
    if (res.code === '200') {
        console.log(res)
        const data = res.object
        type.value = data.busiMerchantStatus
        busi.value = data.merchantCertInfo.busiCode
        phone.value = data.merchantCertInfo.phoneMobile
        merchantName.value = data.merchantCertInfo.merchantName
        merchantType.value = data.merchantCertInfo.merchantType
    }
}
onMounted(() => {
    getMaDatail()
})
const countDownFn = () => {
    clearInterval(timer.value)
    timer.value = setInterval(() => {
        --countDown.value
        countDownText.value = '(' + countDown.value + 's)'
        if (countDown.value <= 0) {
            clearInterval(timer.value)
            countDownText.value = ''
            countDown.value = 60
        }
    }, 1000)
}
const getCode = async () => {
    const param = {
        mobile: phone.value
    }
    const res = await sendMsg(param)
    if (res.code === '200') {
        countDownFn()
    }
}
const confirm = async () => {
    const param = {
        mobile: phone.value,
        smsCode: codeVal.value
    }
    const res = await verCode(param)
    if (res.code === '200') {
        router.push({ name: 'merchant-msg', params: { id: route.params.id, busi: route.params.busi } })
    }
}
const copy = async (val) => {
    try {
        await toClipboard(val)
        Toast.success('复制成功')
    } catch (e) {
        // Toast.fail(e)
    }
}
</script>
<style lang="scss">
.signContract .van-sticky--fixed {
    top: var(--van-nav-bar-height) !important;
}
</style>
<style lang="scss" scoped>
@mixin flex {
    display: flex;
    justify-content: space-around;
    align-items: center;
}
.sign-contract{
    width: 100%;
    .top-bg{
        width: 100%;
        height: 480px;
        background: url('~@/assets/sign-top.png') no-repeat;
        background-size: cover;
        padding: 80px 70px 0;
        box-sizing: border-box;
        .tit{
            height: 50px;
            font-size: 36px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 50px;
        }
        .tips{
            height: 96px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 48px;
            span{
                color: #FFE081;
            }
        }
    }
    .verbox-outter{
        width: 690px;
        height: 514px;
        background: #FFFFFF;
        border-radius: 16px;
        padding: 60px 30px 70px;
        box-sizing: border-box;
        margin: -154px auto 0;
        .phone{
            width: 630px;
            height: 96px;
            background: #FFFFFF;
            padding-left: 82px;
            border-radius: 16px;
            border: 1px solid #CCCCCC;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #696969;
            line-height: 96px;
            background: url('~@/assets/phone.png') 32px center no-repeat;
            background-size: 28px 36px;
            box-sizing: border-box;
        }
        .code_btn{
            margin-top:40px;
            padding-left: 82px;
            width: 630px;
            height: 96px;
            display: flex;
            align-items: center;
            background: #FFFFFF;
            border-radius: 16px;
            border: 1px solid #CCCCCC;
            background: url('~@/assets/verCode.png') 32px center no-repeat;
            background-size: 28px 36px;
            box-sizing: border-box;
            .code{
                width: 340px;
                height: 90px;
                font-size: 32px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #696969;
                border: none;
            }
            .code::-webkit-input-placeholder{ /*WebKit browsers*/
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C9C9C9;
                line-height: 42px;
            }
            .code::-moz-input-placeholder{ /*Mozilla Firefox*/
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C9C9C9;
                line-height: 42px;
            }

            .code::-ms-input-placeholder{ /*Internet Explorer*/
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C9C9C9;
                line-height: 42px;
            }
            .get_code{
                width: 180px;
                height: 64px;
                background: #f8cebb;
                border-radius: 8px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FE7E41;
                line-height: 64px;
                text-align: center;
            }
            .reget_code{
                width: 180px;
                height: 64px;
                background: #f0f0f0;
                border-radius: 8px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 64px;
                text-align: center;
            }
        }
        .confirm{
            width: 630px;
            height: 92px;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            border-radius: 46px;
            margin: 60px auto 0;
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 92px;
            text-align: center;
        }
    }
    .copyurl-outter{
        width: 690px;
        height: 280px;
        background: #FFFFFF;
        border-radius: 16px;
        margin: -154px auto 0;
        padding: 40px;
        box-sizing: border-box;
        .tit{
            height: 88px;
            font-size: 32px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 44px;
        }
        .copy-btn{
            width: 180px;
            height: 64px;
            background: #f8cebb;
            border-radius: 8px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FE7E41;
            line-height: 64px;
            margin: 48px auto 0;
            text-align: center;
        }
    }
}
</style>
