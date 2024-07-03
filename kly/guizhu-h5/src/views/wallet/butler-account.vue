<template>
    <div class="butler-account-page">
        <van-nav-bar fixed title="管家账户" placeholder :border="false">
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/page-back-white.png')" />
            </template>
        </van-nav-bar>
        <div class="card">
            <div class="price">
                <div>账户金额(元)</div>
                <div>{{ Number(storeAvailableAmount).toFixed(2) }}</div>
            </div>
            <div class="button-box">
                <van-button @click="newPage(`/withdrawal-apply/02?amount=${storeAvailableAmount}`, { storeAvailableAmount })">提现</van-button>
                <van-button class="recharge" @click="reCharge">充值</van-button>
            </div>
        </div>
        <div class="cell-group">
            <div class="cell" @click="newPage('/account-capital-list')">
                <van-image :src="require('@/assets/account-icon.png')" />
                <div class="title">账户明细</div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="">
            </div>
        </div>
    </div>
</template>
<script setup>
import { closePage, newPage, newPageRedirect } from '@/utils/composables'
import { assetsInfo } from '@/api/wallet'
import { ref, onBeforeMount } from 'vue'

onBeforeMount(() => {
    getData()
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getData()
    }
})

const reCharge = () => {
    console.log(`${process.env.VUE_APP_WALLET}/personalTopUp?acctType=02&bizCode=HSH&userPhone=${userPhone.value}&busiUserId=${busiUserId.value}`)
    newPageRedirect(`${process.env.VUE_APP_WALLET}/personalTopUp?acctType=02&bizCode=HSH&userPhone=${userPhone.value}&busiUserId=${busiUserId.value}`)
}

const storeAvailableAmount = ref('0.00')
const userPhone = ref('')
const busiUserId = ref(null)
const getData = async () => {
    const res = await assetsInfo()
    if (res.code === '200') {
        storeAvailableAmount.value = res.data.storeAvailableAmount
        userPhone.value = res.data.userPhone
        busiUserId.value = res.data.busiUserId
    }
}

</script>
<style lang="scss" scoped>
.butler-account-page{
    min-height: calc(100vh - 40px);
    padding-top: 40px;
    background-image: url('../../assets/top_bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder {
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar) {
            background: transparent;
            padding-top: var(--van-status-bar-height);
            .van-image {
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title{
                font-size: 36px;
                font-weight: 500;
                color: #FFFFFF;
            }
        }
    }
    .card{
        padding: 60px 30px 40px;
        margin: 0 30px;
        background: #FFFFFF;
        border-radius: 24px;
        .price{
            text-align: center;
            div{
                font-size: 28px;
                font-weight: 400;
                color: #696969;
            }
            div:nth-child(2){
                font-size: 64px;
                font-weight: 500;
                color: #191919;
                margin-top: 20px;
            }
        }
        .button-box{
            display: flex;
            justify-content: space-between;
            margin-top: 100px;
            .van-button{
                width: 294px;
                height: 92px;
                background: #FFFFFF;
                border-radius: 46px;
                border: 1px solid #FE7E41;
                font-size: 30px;
                font-weight: 400;
                color: #FE7E41;
            }
            .recharge{
                color: #FFFFFF;
                background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            }
        }
    }
    .cell-group{
        margin: 20px 30px;
        background: #FFFFFF;
        border-radius: 24px;
        .cell::after{
            content: '';
            position: absolute;
            left: 98px;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: #F4F5F5;
        }
        .cell:last-child::after{
            content: initial;
        }
        .cell{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 28px;
            position: relative;
            .van-image{
                width: 44px;
                height: 48px;
            }
            .title{
                flex: 1;
                margin-left: 26px;
                font-size: 30px;
                font-weight: 400;
                color: #191919;
            }
            img{
                width: 10px;
                height: 20px;
            }
        }
    }
}
</style>
