<template>
    <div class="inventoryResultsBox">
        <van-nav-bar title="盘货结果" fixed placeholder>
            <template #left>
                <van-image @click="complete" :src="require('@/assets/back-icon.png')"/>
            </template>
        </van-nav-bar>
        <div class="resultsContent">
            <img src="@/assets/replenishmentImg/success.png" alt="" class="successImg">
            <div class="successComplete">盘货完成</div>
            <div class="gray">共盘点商品{{ skuTypeCount }}种，盘前库存{{ beforeSkuCount }}，盘后库存{{ afterSkuCount }}，</div>
            <div :class="(diffCount >= 0) ? 'colour' : 'green'">盘点差异{{ diffCount > 0 ? "+" : '' }}{{ diffCount }}</div>
            <van-button class="completeBox" @click="complete" block>完成</van-button>
            <van-button class="detail" @click="goDetail" block>查看盘货详情</van-button>
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue'
import { appBridge } from '@/utils/bridge'
import { useRoute } from 'vue-router'
import { newPage } from '@/utils/composables'
import { getDate } from '@/utils'

const route = useRoute()
const { billNo, skuTypeCount, beforeSkuCount, afterSkuCount } = route.query

const diffCount = computed(() => {
    return (Number(afterSkuCount) - Number(beforeSkuCount)) || 0
})
const goDetail = () => {
    const changeDate = getDate(new Date())
    newPage(`/inventory-detail/${billNo}?changeDate=${changeDate}&skuTypeCount=${skuTypeCount}&beforeSkuCount=${beforeSkuCount}&afterSkuCount=${afterSkuCount}`, {
        changeDate,
        skuTypeCount,
        beforeSkuCount,
        afterSkuCount
    })
}

const complete = () => appBridge('goHome')
</script>
<style lang="scss" scoped>
.inventoryResultsBox{
    background: #fff;
    min-height: 100vh;
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            .van-image{
                width: 44px;
                height: 44px;
            }
            .van-nav-bar__title{
                font-size: 36px;
                font-weight: 500;
                color: #191919;
            }
        }
    }
    .resultsContent{
        .successImg{
            width: 212px;
            height: 212px;
            margin-top: 283px;
            margin-left: 269px;
        }
        .successComplete{
            text-align: center;
            font-size: 36px;
            font-weight: 600;
            color: #2E2E4D;
            margin-top: 17px;
        }
        .gray{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            text-align: center;
            margin-top: 20px;
            line-height: 40px;
        }
        .colour{
            font-size: 28px;
            color: #FE7E41;
            text-align: center;
            line-height: 40px;
        }
        .green{
            font-size: 28px;
            color: #68BD49;
            text-align: center;
            line-height: 40px;
        }
        .completeBox{
            width: 398px;
            height: 92px;
            border-radius: 46px;
            margin: 190px auto 0;
            font-size: 30px;
            font-weight: 610;
            color: #FFFFFF;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
        }
        .detail{
            width: 398px;
            height: 92px;
            background: #FFFFFF;
            border-radius: 46px;
            border: 2px solid #FE7E41;
            font-size: 30px;
            font-weight: 500;
            color: #FE7E41;
            margin: 40px auto 0;
        }
    }
}
</style>
