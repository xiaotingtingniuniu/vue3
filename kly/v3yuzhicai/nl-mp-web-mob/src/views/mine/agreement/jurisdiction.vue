<template>
    <div class="setting" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'agreement-privacy'})">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="bg-img">
            <div class="explain">1、iOS系统权限调用说明</div>
            <van-image :src="require('@/assets/mine/ios-agreement.png')"/>
            <div class="explain">2、Android系统权限调用说明</div>
            <van-image :src="require('@/assets/mine/android-agreement.png')"/>
        </div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
}
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
}
.setting{
    background-color: white;
    .bg-img{
        width: 650px;
        margin: 0 auto;
        align-items: center;
    }
    .explain{
        height: 100px;
        line-height: 100px;
    }
}
</style>
