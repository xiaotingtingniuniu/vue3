<template>
    <div class="entry-record-detail-page">
        <div class="title">{{ $route.query.digest }}</div>
        <div class="content">{{ Number($route.query.amount) >= 0 ? `+${Number($route.query.amount).toFixed(2)}` : Number($route.query.amount).toFixed(2) }}</div>
        <div class="order">
            <div>
                <div>时间</div>
                <div>{{ $route.query.busiTime || '--' }}</div>
            </div>
            <div>
                <div>订单号</div>
                <div class="order-num">
                    <van-button class="copy copyBox copy-bader" @click="copyCode($route.query.subOrderNo)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                    <span id="form-tone" @click="goDetail($route.query.settlementUnitNo, $route.query.orderFlag, $route.query.subOrderNo)">{{ $route.query.subOrderNo }}</span><img v-if="$route.query.orderFlag!=='1'&&$route.query.orderFlag!=='4'" src="@/assets/replenishmentImg/right@2x.png" alt="" />
                </div>
            </div>
            <div v-if="$route.query.balanceAmount!=='-'">
                <div>余额</div>
                <div>¥{{ Number($route.query.balanceAmount).toFixed(2) }}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { newPage } from '@/utils/composables'

const goDetail = (billNo, orderFlag, subOrderNo) => {
    if (orderFlag === '0') {
        newPage(`/containerDetails/${billNo}?roleBillCode=3`, {
            roleBillCode: 3
        })
    } else if (orderFlag === '2') {
        newPage(`/container/lease/${subOrderNo}/9999`)
    } else if (orderFlag === '3') {
        newPage(`/container/stag/${subOrderNo}/9999`)
    }
}

const copyCode = async (value) => {
    const clipboard = new Clipboard('.copyBox', {
        text: () => {
            return value
        }
    })
    clipboard.on('success', () => {
        Toast('复制成功')
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        Toast('复制失败')
        clipboard.destroy()
    })
}
</script>
<style lang="scss" scoped>
.entry-record-detail-page {
    background-color: #fff;
    .title {
        font-size: 30px;
        font-weight: 400;
        color: #191919;
        text-align: center;
        padding-top: 98px;
    }
    .content {
        margin: 60px 50px 0;
        font-size: 64px;
        font-weight: 500;
        color: #191919;
        text-align: center;
        padding-bottom: 98px;
        border-bottom: 1px solid #f4f5f5;
    }
    .order {
        padding: 40px 50px;
        & > div:nth-child(1) {
            margin-top: initial;
        }
        & > div {
            display: flex;
            justify-content: space-between;
            margin-top: 16px;
            div:nth-child(1) {
                font-size: 26px;
                font-weight: 400;
                color: #999999;
            }
            div {
                font-size: 26px;
                font-weight: 400;
                color: #191919;
            }
        }
        .order-num {
            display: flex;
            align-items: center;
            .copy {
                font-size: 24px;
                font-weight: 400;
                color: #fe7e41;
                width: 70px;
                height: 34px;
                background: #fff5f0;
                border-radius: 17px;
                text-align: center;
                line-height: 34px;
                word-break: keep-all;
                border: initial;
                margin-right: 6px;
            }
            img {
                width: 10px;
                height: 20px;
                margin-left: 10px;
            }
        }
    }
}
</style>
