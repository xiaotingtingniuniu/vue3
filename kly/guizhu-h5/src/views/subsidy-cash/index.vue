<template>
    <div class="subsidy-cash">
        <van-nav-bar title="补贴提现" fixed placeholder left-arrow right-text="补贴记录" @click-left="closePage" @click-right="newPage(`/subsidy-record/${subAcctId}`)"/>
        <div class="amount-of-money">
            <div class="txt">可提现金额（元）</div>
            <div class="price"><span>¥</span>{{ price }}</div>
        </div>
        <div class="withdrawal-amount">
            <div class="title">提现金额</div>
            <div class="input-group van-hairline--bottom">
                <div class="unit">¥</div>
                <van-field v-model="number" :formatter="formatter" type="number" :placeholder="`最多可提现${price}元`" />
                <div class="shortcut-button" @click="shortcutFn">全部提现</div>
            </div>
            <div class="account" v-if="alipayinfo && alipayinfo.thirdUserId!==''">
                <div>提现至{{alipayinfo.nickName}}</div>
                <div class="account-right-title" @click="bindAlipay">重新绑定</div>
            </div>
            <div class="account" v-if="alipayinfo && alipayinfo.thirdUserId==='' || alipayinfo===null">
                <div>提现至</div>
                <div>支付宝账号 —</div>
            </div>
            <van-button block round color="#FE7E41" @click="bindAlipay" v-if="!alipayinfo">绑定支付宝账号</van-button>
            <van-button block round color="#FE7E41" @click="toWithdrawal"  v-if="alipayinfo" :disabled="number===null">提现</van-button>
            <div class="withdrawal-record" @click="newPage(`/withdrawal-record/${subAcctId}`)">提现记录</div>
        </div>
        <div class="withdrawal-rules">
            <div class="title">提现规则：</div>
            <div class="txt">
                <p>1. 用户需要通过支付宝提现，需按照要求绑定支付宝帐号并填写提现金额或其他提现所需信息，请确保提供的信息准确无误，以免提现失败。</p>
                <p>2. 如果用户发现显示「提现失败」，需确认当前填写或绑定的支付宝帐号是否正确，以及支付宝帐号号是否可用。</p>
                <p>3. 如果用户发现显示「提现成功」但没到账，</p>
                <p>(1）如果用户有多个支付宝帐号，请检查用户是否提现到了其他支付宝帐号；</p>
                <p>(2）高峰期提现人数多会导致网络拥堵，显示提现成功之后72小时内属于正常现象，请耐心等候</p>
                <!-- <p>4. 发生退款时需退回补贴，预留20元作为退补贴资金</p> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { newPage, closePage } from '@/utils/composables'
import { appBridge, registerhandler } from '@/utils/bridge'
import { accountInfo, saveWithdrawal, saveBind } from '@/api/subsidy'
import { v4 as uuidv4 } from 'uuid'
import { Dialog } from 'vant'
// import { isApp } from '@/utils'

const price = ref('')
const subAcctId = ref('')
const number = ref(null)
const formatter = (value) => Number(value) > Number(price.value) ? Number(price.value) : value

const shortcutFn = () => {
    number.value = price.value
}

const bindAlipay = () => {
    appBridge('bindAlipay')
    registerhandler('setAlipayAuthCode', async (res) => {
        console.log(res)
        await saveBind({ authCode: res, applyType: '2' })
        await getAccountInfo()
    })
}

const alipayinfo = ref(null)
const getAccountInfo = async () => {
    const res = await accountInfo({ classifyType: 2 })
    if (res.code === '200') {
        price.value = (res.object.subAvailableAmount / 100).toFixed(2)
        subAcctId.value = res.object.subAcctId
        alipayinfo.value = res.object.alipayInfoVO
    }
}

onMounted(async () => {
    await getUuuid()
    await getAccountInfo()
})

// 监听h5页面后台运行 再打开后刷新当前数据
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getAccountInfo()
    }
})

const uuid = ref('')
const getUuuid = () => {
    uuid.value = uuidv4()
}

const toWithdrawal = async () => {
    const res = await saveWithdrawal({
        transAmount: number.value * 100,
        subAcctId: subAcctId.value,
        requestNo: uuid.value.replace(/-/g, ''),
        channelType: 2
    })
    if (res.code === '200') {
        Dialog.alert({
            title: '提现申请中',
            message: res.msg,
            confirmButtonColor: '#FE7E41'
        }).then(async () => {
            number.value = ''
            await getUuuid()
            await getAccountInfo()
        })
    } else {
        Dialog.alert({
            title: '提现失败',
            message: res.msg,
            confirmButtonColor: '#FE7E41'
        }).then(() => {
            number.value = ''
            getUuuid()
        })
    }
}

</script>
<style lang="scss" scoped>
.subsidy-cash{
    --van-nav-bar-icon-color: #ffffff;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-background-color: transparent;
    --van-nav-bar-title-text-color: #ffffff;
    --van-nav-bar-text-color: #ffffff;
    --van-nav-bar-title-font-size: 34px;
    background-image: url('../../assets/subsidy-cash/subsidy-cash-bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
        }
        :deep(.van-hairline--bottom:after){
            border-bottom-width: 0;
        }
    }
    .amount-of-money{
        color: #FFFFFF;
        padding: 34px 40px;
        .txt{
            font-size: 28px;
        }
        .price{
            font-size: 64px;
            font-weight: 500;
            span{
                font-size: 22px;
                margin-right: 10px;
            }
        }
    }
    .withdrawal-amount{
        margin: 0 30px;
        background: #FFFFFF;
        box-shadow: 0px 10px 20px 0px rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        padding: 33px 40px 40px;
        .title{
            font-size: 28px;
            font-weight: 400;
            color: #191919;
        }
        .input-group{
            display: flex;
            align-items: center;
            margin-top: 50px;
            .unit{
                font-size: 40px;
                font-weight: bold;
                margin-right: 11px;
            }
            .van-field{
                width: 0;
                flex: 1;
                font-size: 42px;
                padding-left: 0;
            }
            .van-cell:after{
                content: initial;
            }
            .shortcut-button{
                font-size: 26px;
                font-weight: 400;
                color: #FE7E41;
            }
        }
        .account{
            margin-top: 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 28px;
            font-weight: 400;
            color: #191919;
            .account-right-title{
                font-size: 26px;
                font-weight: 400;
                color: #FE7E41;
                line-height: 37px;
            }
        }
        .van-button{
            margin-top: 60px;
        }
        .withdrawal-record{
            width: max-content;
            margin: 26px auto 0;
            font-size: 26px;
            font-weight: 400;
            color: #FE7E41;
        }
    }
    .withdrawal-rules{
        margin: 109px 40px;
        color: #BBBBBB;
        .title{
            font-size: 26px;
            font-weight: 500;
        }
        .txt{
            font-size: 24px;
            font-weight: 400;
            margin-top: 12px;
            line-height: 33px;
        }
    }
}
</style>
