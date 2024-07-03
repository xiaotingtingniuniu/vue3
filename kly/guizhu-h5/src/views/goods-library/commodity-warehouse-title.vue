<template>
    <div class="commodity-warehouse-title-page">
        <van-nav-bar fixed placeholder>
            <template #left>
                <van-image @click="closePage" :src="require('@/assets/back-icon.png')"/>
            </template>
            <template #title>
                <div class="nav-title">
                    <router-link to="/publicGoods" replace custom v-slot="{ navigate }">
                        <van-button @click="navigate" :class="$route.name==='publicGoods'?'active':''">公共商品库</van-button>
                    </router-link>
                    <router-link to="/apply-new-products" replace custom v-slot="{ navigate }">
                        <van-button @click="navigate" :class="$route.name==='applyNewProducts'?'active':''">新品申请</van-button>
                    </router-link>
                </div>
            </template>
        </van-nav-bar>
        <router-view v-slot="{ Component }">
            <component :is="Component" :key="$route.path" />
        </router-view>
    </div>
</template>
<script setup>
import { closePage } from '@/utils/composables'

</script>
<style lang="scss" scoped>
.commodity-warehouse-title-page{
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background: #FFFFFF;
            // border-bottom: 2px solid #F4F5F5;
            .van-nav-bar__content{
                background: #FFFFFF;
                align-items: initial;
            }
            .van-nav-bar__left{
                .van-image{
                    width: 44px;
                    height: 44px;
                }
            }
            .van-nav-bar__title{
                .nav-title{
                    margin-top: 6px;
                    .active{
                        background-color: #FE7E41;
                        color: #FFFFFF !important;
                    }
                    .van-button{
                        width: 192px;
                        height: 60px;
                        font-size: 32px;
                        font-weight: 400;
                        line-height: 60px;
                        color: #FE7E41;
                        border-color: #FE7E41;
                    }
                    .van-button:nth-child(1){
                        border-radius: 30px 0 0 30px;
                        border-right: none;
                    }
                    .van-button:nth-child(2){
                        border-radius: 0 30px 30px 0;
                        border-left: none;
                    }
                }
            }
        }
    }
}
</style>
