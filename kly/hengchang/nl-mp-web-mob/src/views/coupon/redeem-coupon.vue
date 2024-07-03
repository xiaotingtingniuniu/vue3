<template>
    <div class="coupon-box" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="coupon-container">
            <div class="exchange">
                <van-cell-group inset>
                    <van-field v-model="exchangeCodde" label="" placeholder="请输入兑换码" left-icon="scan" @click-left-icon="couponCdkeyeFn" clearable/>
                </van-cell-group>
            </div>
            <div class="button">
                <van-button round color="#F16642" @click="exChangeFn">兑换</van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { drawoneCoupon } from '@/api/coupon/index'
import { isApp } from '@/utils'
import { pageBack, couponCdkeyeFn } from '@/utils/composables'
import { Toast } from 'vant'
import Dialog from '@/components/Dialog'

const router = useRouter()
const exchangeCodde = ref('')

const exChangeFn = async () => {
    if (exchangeCodde.value === '') return Toast('请输入兑换码')
    const params = {
        shopCode: JSON.parse(sessionStorage.getItem('optimalStore')) ? JSON.parse(sessionStorage.getItem('optimalStore')).id : '',
        cdkey: exchangeCodde.value
    }
    const { code, msg } = await drawoneCoupon(params)
    if (code === 200) {
        Dialog({
            title: '兑换优惠券成功',
            right: '查看优惠券',
            showLeftButton: false
        }).then(() => {
            router.push({ name: 'mine-coupon' })
        })
    } else {
        Dialog({
            title: '兑换优惠券失败',
            message: msg,
            showLeftButton: false
        })
    }
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar__placeholder{
        height: calc(92px + var(--van-status-bar-height)) !important;
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            z-index: 1000;
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
.coupon-box{
    min-height: calc(100vh - 30px - var(--van-status-bar-height));
    background: #F7F7F7;
    padding-bottom: 30px;
    .coupon-container{
        padding-top: 25px;
        .exchange{
            margin: 0px 24px;
            height: 118px;
            border-radius: 16px;
            background-color: #fff;
            font-size: 30px;
            padding-top: 30px;
            :deep(.van-cell-group){
                width: 626px;
                margin: 0 auto;
                border: 1px solid #FAFAFA;
                // padding-top: 30px;
                .van-cell{
                    background-color: #FAFAFA;
                }
            }
            :deep(.van-cell-group):hover{
                border: 1px solid #F16542;
            }
            :deep(.van-field__body){
                margin-left: 30px;
            }
            :deep(.van-field__left-icon){
                margin-right: 30px;
            }
            :deep(.van-field__left-icon .van-icon){
                font-size: 40px;
            }
            :deep(.van-field__body)::after{
                border-left-width: 1px !important;
                position: absolute;
                box-sizing: border-box;
                content: " ";
                pointer-events: none;
                top: -50%;
                right: -50%;
                bottom: -50%;
                left: -50%;
                border: 0 solid #979797;
                transform: scale(.5);
            }
        }
        .button{
            position: fixed;
            left: 0;
            right: 0;
            bottom: 66px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.333333vw 3.2vw;
            box-shadow: 0px 1px 0px 0px #f5f5f5;
            .van-button{
                width: 100%;
                height: 88px;
                background: #F16642;
                border-radius: 16px;
                font-size: 32px;
                font-weight: bold;
                color: #FFFFFF;
            }
        }
    }
}
</style>
