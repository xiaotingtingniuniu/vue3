<template>
    <div class="surplus-cash">
        <div class="card">
            <div class="title">提现金额(元)</div>
            <div class="input-group van-hairline--bottom">
                <van-field v-model="number" clearable @clear="clearFn" :formatter="formatter" type="number" :placeholder="`最多可提现${price}元`" />
                <div class="shortcut-button" @click="shortcutFn">全部提现</div>
            </div>
            <div class="account">可提现金额{{ price }}元</div>
        </div>
        <van-button block round color="#FE7E41" @click="toWithdrawal">提现</van-button>
        <div class="withdrawal-record" @click="newPage(`/withdrawal-record/${subAcctId}`)">提现记录</div>
        <div class="rules">
            <span>提现规则：</span>
            <p>1. 只记录在恒掌柜发起的提现记录</p>
            <p>2.T日发起提现申请，T+1日预计当日到账。具体到账时间以实际银行处理为准</p>

        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { newPage } from '@/utils/composables'
import { accountInfo, saveWithdrawal } from '@/api/subsidy'
import { v4 as uuidv4 } from 'uuid'
import { Dialog } from 'vant'

const price = ref('')
const subAcctId = ref('')
const number = ref(null)
const formatter = (value) => value > price.value ? price.value : value
const shortcutFn = () => {
    number.value = price.value
}
const clearFn = () => {
    number.value = null
}

const getAccountInfo = async () => {
    const res = await accountInfo({ classifyType: 1 })
    if (res.code === '200') {
        price.value = (res.object.subAvailableAmount / 100).toFixed(2)
        subAcctId.value = res.object.subAcctId
    }
}

onMounted(() => {
    getAccountInfo()
})

const uuid = uuidv4()
const toWithdrawal = async () => {
    if (price.value < 0.01) {
        Dialog.alert({
            title: '提现申请中',
            message: '提现金额需超过0.01元',
            confirmButtonColor: '#FE7E41'
        })
    } else {
        const res = await saveWithdrawal({
            transAmount: number.value * 100,
            subAcctId: subAcctId.value,
            requestNo: uuid.replace(/-/g, ''),
            channelType: 1
        })
        if (res.code === '200') {
            Dialog.alert({
                title: '提现申请中',
                message: res.msg,
                confirmButtonColor: '#FE7E41'
            }).then(() => {
                getAccountInfo()
            })
        } else {
            Dialog.alert({
                title: '提现失败',
                message: res.msg,
                confirmButtonColor: '#FE7E41'
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.surplus-cash{
    margin-top: 20px;
    .card{
        background: #FFFFFF;
        padding: 40px;
        .title{
            font-size: 30px;
            font-weight: 400;
            color: #191919;
        }
        .input-group{
            display: flex;
            align-items: center;
            margin-top: 25px;
            .van-field{
                width: 0;
                flex: 1;
                font-size: 42px;
                font-weight: 500;
                color: #191919;
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
            font-size: 24px;
            font-weight: 400;
            color: #A2A7B0;
            margin-top: 16px;
        }
    }
    .van-button{
        width: 630px;
        margin: 60px auto 0;
    }
    .withdrawal-record{
        width: max-content;
        margin: 26px auto 0;
        font-size: 26px;
        font-weight: 400;
        color: #FE7E41;
    }
    .rules{
        position:absolute ;
        bottom: 100px;
        left:40px;
        right: 40px;
          color: #BBBBBB;
        span{
            font-size: 26px;
            font-weight: 500;
        }
        p{
            font-size: 24px;
            font-weight: 400;
        }
        // margin:40px auto 100px;
    }
}

</style>
