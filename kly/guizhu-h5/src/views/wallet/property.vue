<template>
    <div class="property-page">
        <van-nav-bar fixed placeholder :border="false">
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/page-back-white.png')" />
            </template>
        </van-nav-bar>
        <div class="page-head">
            <van-image :src="require('@/assets/shop_default.png')" />
            <div class="right">{{ pageData?.userName || '--' }}<div class="realName" v-if="pageData?.certificationFlag===1"></div></div>
        </div>
        <div class="bank-card">
            <div class="total">
                <div>总资产(元)</div>
                <van-image @click="totalStatus=!totalStatus" :src="totalStatus ? showEye : hideEye" />
            </div>
            <div class="total-price" v-if="totalStatus">{{ Number(pageData?.totalAvailableAmount || 0).toFixed(2) }}</div>
            <div class="total-price" v-else>******</div>
            <div class="bank" @click="goBankList">
                <van-image :src="require('@/assets/bank-card.png')" />
                <div class="bank-text">银行卡（{{ pageData?.bankCardNum || 0 }}）</div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="">
            </div>
        </div>
        <div class="panel-card">
            <div class="panel-title" @click="newPage('/my-income?showNavbar=0')">
                <van-image :src="require('@/assets/money_icon.png')" />
                <div class="panel-text">我的收入<span>(收入可提现)</span></div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="">
            </div>
            <div class="price-box">
                <div>可提现金额(元)<van-image @click="cashAvailableAmountState=!cashAvailableAmountState" :src="cashAvailableAmountState ? showEye : hideEye" /></div>
                <div>{{ cashAvailableAmountState ? (Number(pageData?.cashAvailableAmount || 0).toFixed(2)) : '******' }}<div v-if="pageData?.cashAvailableAmount" @click="newPage(`/withdrawal-apply/01?amount=${pageData?.cashAvailableAmount || 0}`, {amount: pageData?.cashAvailableAmount || 0})">提现</div></div>
            </div>
            <div class="price-box">
                <div>
                    冻结金额(元)<van-popover v-if="pageData" placement="bottom-start" v-model:show="showPopover" teleport=".property-page">
                        <div class="popover">若商家经营期间违反平台规定或被第三方发起投诉、举报等，平台有权冻结商家交易结算款项，商家可联系平台处理。</div>
                        <template #reference>
                            <img :src="require('@/assets/tip-icon.png')" alt="" />
                        </template>
                    </van-popover>
                </div>
                <div>{{ cashAvailableAmountState ? (Number(pageData?.cashFrozenAmount || 0).toFixed(2)) : '******' }}</div>
            </div>
        </div>
        <div class="panel-card">
            <div class="panel-title" @click="newPage(`/butler-account?showNavbar=0`)">
                <van-image :src="require('@/assets/money_icon2.png')" />
                <div class="panel-text">管家账户<span>(可充值)</span></div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="">
            </div>
            <div class="price-box">
                <div>账户金额(元)<van-image @click="storeAvailableAmountState=!storeAvailableAmountState" :src="storeAvailableAmountState ? showEye : hideEye" /></div>
                <div>{{ storeAvailableAmountState ? (Number(pageData?.storeAvailableAmount || 0).toFixed(2)) : '******' }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { closePage, newPage } from '@/utils/composables'
import hideEye from '@/assets/hide-eye.png'
import showEye from '@/assets/show-eye.png'
import { assetsInfo } from '@/api/wallet'
import { appBridge } from '@/utils/bridge'

onBeforeMount(() => {
    getData()
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getData()
    }
})

const showPopover = ref(false)
const totalStatus = ref(false)
const cashAvailableAmountState = ref(false)
const storeAvailableAmountState = ref(false)

const pageData = ref(null)
const getData = async () => {
    const res = await assetsInfo()
    if (res.code === '200') {
        pageData.value = res.data
        pageData.value.userName = `*${pageData.value.userName.slice(0, 1)}`
    }
}

const goBankList = () => {
    appBridge('openBankList')
}

</script>
<style lang="scss" scoped>
.popover {
    width: 400px;
    padding: 18px 28px;
    background-color: #ffe8bc;
    font-size: 26px;
    font-weight: 400;
    color: #9d7b35;
}
:deep(.van-popover__arrow) {
    color: #ffe8bc !important;
}
.property-page{
    min-height: 100vh;
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
        }
    }
    .page-head{
        display: flex;
        align-items: center;
        padding: 28px 52px;
        .van-image{
            width: 84px;
            height: 84px;
        }
        .right{
            margin-left: 24px;
            font-size: 32px;
            font-weight: 500;
            color: #FFFFFF;
            display: flex;
            align-items: center;
            .realName{
                width: 94px;
                height: 36px;
                background-image: url('../../assets/real-name.png');
                background-size: 100% 100%;
                margin-left: 16px;
            }
        }
    }
    .bank-card{
        background: #FFFFFF;
        border-radius: 24px;
        margin: 0 30px;
        padding: 60px 0 0;
        overflow: hidden;
        .total{
            display: flex;
            align-items: center;
            font-size: 26px;
            font-weight: 400;
            color: #696969;
            padding-left: 30px;
            .van-image{
                width: 40px;
                height: 20px;
                margin-left: 20px;
            }
        }
        .total-price{
            font-size: 64px;
            font-weight: 500;
            color: #FF1E19;
            margin-top: 20px;
            padding-left: 30px;
            line-height: 64px;
        }
        .bank{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 30px 50px 30px 30px;
            background: linear-gradient(270deg, #FFFEFD 0%, #FFFAF6 100%);
            margin-top: 60px;
            .bank-text{
                width: 0;
                flex: 1;
                margin-left: 20px;
                font-size: 32px;
                font-weight: 500;
                color: #191919;
            }
            .van-image{
                width: 56px;
                height: 44px;
            }
            img{
                width: 10px;
                height: 20px;
            }
        }
    }
    .panel-card{
        background: #FFFFFF;
        border-radius: 24px;
        margin: 20px 30px 0;
        padding-bottom: 38px;
        .panel-title::after{
            content: '';
            position: absolute;
            bottom: 0;
            left: 98px;
            right: 0;
            height: 1px;
            background-color: #F4F5F5;
        }
        .panel-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 34px 50px 34px 30px;
            position: relative;
            .van-image{
                width: 52px;
                height: 52px;
            }
            .panel-text{
                width: 0;
                flex: 1;
                font-size: 30px;
                font-weight: 500;
                color: #191919;
                margin-left: 22px;
                span{
                    font-size: 24px;
                    font-weight: 400;
                    color: #999999;
                    margin-left: 20px;
                }
            }
            img{
                width: 10px;
                height: 20px;
            }
        }
        .price-box{
            padding-left: 30px;
            margin-top: 40px;
            div:nth-child(1){
                display: flex;
                align-items: center;
                font-size: 24px;
                font-weight: 400;
                color: #696969;
                .van-image{
                    margin-left: 20px;
                    width: 40px;
                    height: 20px;
                }
            }
            div:nth-child(2){
                font-size: 48px;
                font-weight: 500;
                color: #191919;
                display: flex;
                align-items: center;
                margin-top: 20px;
                div{
                    margin-left: 116px;
                    font-size: 28px;
                    font-weight: 400;
                    color: #FFFFFF;
                    width: 160px;
                    height: 56px;
                    background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
                    border-radius: 31px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
            :deep(.van-popover__wrapper) {
                width: 24px;
                height: 24px;
                display: block;
                margin-left: 8px;
                img {
                    width: 24px;
                    height: 24px;
                    margin-bottom: 2px;
                }
            }
        }
    }
}
</style>
