<template>
    <div class="my-income-page">
        <van-nav-bar fixed title="我的收入" placeholder :border="false">
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/page-back-white.png')" />
            </template>
        </van-nav-bar>
        <div class="card">
            <div class="price-box">
                <div>可提现金额(元)<van-image @click="totalStatus = !totalStatus" :src="totalStatus ? showEye : hideEye" /></div>
                <div>
                    <div>
                        <template v-if="!totalStatus">
                            <span v-for="index in 6" :key="index" class="icon iconfont">&#xe64c;</span>
                        </template>
                        <span v-show="totalStatus">{{ Number(cashAvailableAmount).toFixed(2) || '0.00' }}</span>
                    </div>
                    <div class="button" @click="newPage(`/withdrawal-apply/01?amount=${cashAvailableAmount}`, { amount: cashAvailableAmount })">提现</div>
                </div>
            </div>
            <div class="price-box">
                <div>
                    冻结金额(元)<van-popover v-if="flag" placement="bottom-start" v-model:show="showPopover" teleport=".my-income-page">
                        <div class="popover">若商家经营期间违反平台规定或被第三方发起投诉、举报等，平台有权冻结商家交易结算款项，商家可联系平台处理。</div>
                        <template #reference>
                            <img :src="require('@/assets/tip-icon.png')" alt="" />
                        </template>
                    </van-popover>
                </div>
                <div class="fs48" @click="newPage('/freeze-records')">
                    <div>
                        <template v-if="!totalStatus">
                            <span v-for="index in 6" :key="index" class="icon iconfont">&#xe64c;</span>
                        </template>
                        <span v-show="totalStatus">{{ Number(cashFrozenAmount).toFixed(2) || '0.00' }}</span>
                    </div>
                    <img v-if="cashFrozenAmount&&cashFrozenAmount>0" src="@/assets/replenishmentImg/right@2x.png" alt="" />
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="cell" @click="newPage(`/entry-record-list?payMethodListLength=${payMethodListLength}`, { payMethodListLength })">
                <van-image :src="require('@/assets/entry-icon.png')" />
                <div class="title">资金明细</div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="" />
            </div>
            <div class="cell" @click="newPage('/withdrawal-record-list')">
                <van-image :src="require('@/assets/withdrawal-icon.png')" />
                <div class="title">提现记录</div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="" />
            </div>
            <div class="cell" @click="newPage('/expenses-receipts')" v-if="KA">
                <van-image :src="require('@/assets/bill-icon.png')" />
                <div class="title">收支账单</div>
                <img src="@/assets/replenishmentImg/right@2x.png" alt="" />
            </div>
        </div>
        <div class="explain">
            <div class="title">收入说明:</div>
            <div class="content">1. 我的收入余额为您使用小恒收款方式获得的售卖商品结算款项，您可以直接提现，可以使用余额偿还租赁或分期订单，也可以兑换消费。</div>
            <div class="content">2. 选择小恒收款方式，如存在平台补贴，平台补贴与订单合并结算至我的收入余额。</div>
            <div class="content">3. 选择微信收款方式，如存在平台补贴，平台补贴单独结算，请在财务管理-补贴提现查询补贴记录与操作提现；订单会结算至微信余额账户</div>
            <div class="content">4. 我的收入支持近180天动账记录查询</div>
            <div class="content">5. 如产生冻结金额，可点击查询冻结记录及原因，冻结资金不可提现，待符合解冻条件后才可进行提现</div>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { assetsInfo } from '@/api/wallet'
import { closePage, newPage } from '@/utils/composables'
import hideEye from '@/assets/hide-eye.png'
import showEye from '@/assets/show-eye.png'

const showPopover = ref(false)
onBeforeMount(() => {
    getData()
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        getData()
    }
})

const totalStatus = ref(false)
const cashAvailableAmount = ref('0.00')
const cashFrozenAmount = ref('0.00')
const payMethodListLength = ref(0)
const flag = ref(false)
const KA = ref(false) // 是否为ka商家
const getData = async () => {
    const res = await assetsInfo()
    if (res.code === '200') {
        cashAvailableAmount.value = res.data.cashAvailableAmount
        cashFrozenAmount.value = res.data.cashFrozenAmount
        payMethodListLength.value = res.data.payMethodList.length
        KA.value = res.data.ka
        flag.value = true
    }
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
.my-income-page {
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
            .van-nav-bar__title {
                font-size: 36px;
                font-weight: 500;
                color: #ffffff;
            }
        }
    }
    .card {
        padding: 30px 50px 30px 30px;
        margin: 20px 30px;
        background: #ffffff;
        border-radius: 24px;
        .price-box {
            margin-top: 40px;
            & > div:nth-child(1) {
                display: flex;
                align-items: center;
                font-size: 26px;
                font-weight: 400;
                color: #696969;
                .van-image {
                    margin-left: 20px;
                    width: 40px;
                    height: 20px;
                }
            }
            .fs48 {
                font-size: 48px !important;
                justify-content: flex-start !important;
                line-height: 48px !important;
                img {
                    width: 10px;
                    height: 20px;
                    margin-left: 16px;
                }
            }
            & > div:nth-child(2) {
                font-size: 60px;
                font-weight: 500;
                color: #191919;
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-top: 20px;
                div:nth-child(1) {
                    display: flex;
                    align-items: center;
                    font-weight: 800;
                }
                .button {
                    width: 160px;
                    height: 56px;
                    font-size: 28px;
                    font-weight: 400;
                    color: #ffffff;
                    background: linear-gradient(90deg, #fe7e41 0%, #ff5d0f 100%, #ff5c0e 100%);
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
    .cell-group {
        margin: 20px 30px;
        background: #ffffff;
        border-radius: 24px;
        .cell::after {
            content: '';
            position: absolute;
            left: 98px;
            right: 0;
            bottom: 0;
            height: 1px;
            background-color: #f4f5f5;
        }
        .cell:last-child::after {
            content: initial;
        }
        .cell {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 28px;
            position: relative;
            .van-image {
                width: 44px;
                height: 48px;
            }
            .title {
                flex: 1;
                margin-left: 26px;
                font-size: 30px;
                font-weight: 400;
                color: #191919;
            }
            img {
                width: 10px;
                height: 20px;
            }
        }
    }
    .explain {
        background: #ffffff;
        border-radius: 24px;
        padding: 40px 30px;
        margin: 20px 30px;
        .title {
            font-size: 28px;
            font-weight: 500;
            color: #696969;
        }
        .content {
            font-size: 26px;
            font-weight: 400;
            color: #696969;
            margin-top: 20px;
        }
    }
}
</style>
