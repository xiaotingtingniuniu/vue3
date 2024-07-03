<template>
    <div class="successBox">
        <van-nav-bar title="补货结果" fixed placeholder>
            <template #left>
                <van-image @click="complete" :src="require('@/assets/back-icon.png')"/>
            </template>
        </van-nav-bar>
        <div class="successContent">
            <img src="@/assets/replenishmentImg/success.png" alt="" class="successImg">
            <div class="successComplete">补货完成</div>
            <div class="gray">共补商品{{ skuTypeCount }}种，补充库存{{ diffCount }}</div>
            <van-button class="completeBox" @click="complete" block>完成</van-button>
            <van-button class="detail" @click="goDetail" block>查看补货详情</van-button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { appBridge } from '@/utils/bridge'
import { deleteAppStorageFn } from '@/utils/storage'
import { useRoute } from 'vue-router'
import { newPage } from '@/utils/composables'
import { getDate } from '@/utils'

const route = useRoute()
const { billNo, skuCount, skuTypeCount, beforeSkuCount, afterSkuCount } = route.query

const diffCount = computed(() => {
    return (Number(afterSkuCount) - Number(beforeSkuCount)) || 0
})

const goDetail = () => {
    if (route.query.isReplenishmentOrder) {
        newPage(`/replenishment-order-detail?showNavbar=0&billNo=${billNo}`, {
            billNo
        })
    } else {
        const changeDate = getDate(new Date())
        newPage(`/replenish-detail/${billNo}?changeDate=${changeDate}&skuTypeCount=${skuTypeCount}&skuCount=${skuCount}&afterSkuCount=${afterSkuCount}`, {
            changeDate,
            skuTypeCount,
            skuCount,
            afterSkuCount
        })
    }
}

deleteAppStorageFn('trackerAct')
const complete = () => appBridge('goHome')

</script>
<style lang="scss" scoped>
.successBox{
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
    .successContent{
        .successImg{
            width: 212px;
            height: 212px;
            margin-top: 153px;
            margin-left: 269px;
        }
        .successComplete{
            text-align: center;
            font-size: 36px;
            font-weight: 500;
            color: #2E2E4D;
            margin-top: 17px;
        }
        .gray{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            text-align: center;
            margin-top: 20px;
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
