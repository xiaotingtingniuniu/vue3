<template>
    <div class="change-price-success-box">
        <van-nav-bar title="改价结果" fixed placeholder>
            <template #left>
                <van-image @click="complete" :src="require('@/assets/back-icon.png')"/>
            </template>
        </van-nav-bar>
        <div class="success-content">
            <img src="@/assets/replenishmentImg/success.png" alt="" class="successImg">
            <div class="successComplete">改价完成</div>
            <p>共改价商品{{ $route.query.changeNum || '-' }}种</p>
            <van-button class="completeBox" @click="complete" block>完成</van-button>
            <van-button class="detail" @click="goDetail" block>查看改价详情</van-button>
        </div>
    </div>
</template>

<script setup>
import { appBridge } from '@/utils/bridge'
import { newPage } from '@/utils/composables'
import { useRoute } from 'vue-router'
import { getDate } from '@/utils'

const route = useRoute()
const complete = () => appBridge('goHome')
const goDetail = () => newPage(`/price-change-detail/${route.query.id}?changeDate=${getDate(new Date())}`)

</script>
<style lang="scss" scoped>
.change-price-success-box{
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
    .success-content{
        p{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            text-align: center;
            margin-top: 20px;
        }
        .successImg{
            width: 212px;
            height: 212px;
            margin-top: 153px;
            margin-left: 269px;
        }
        .successComplete{
            text-align: center;
            font-size: 36px;
            font-weight: 610;
            color: #2E2E4D;
            margin-top: 17px;
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
