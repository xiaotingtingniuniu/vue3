<template>
    <div class="addOrderBox">
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'abnormalDetails',query:{workOrderNo: props.workOrderNo}})">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <!-- <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="$router.replace({name: 'hesalesOrders'})">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar> -->
        <div class="main-page">
            <div class="main">
                <div class="image">
                    <img src="../../../assets/success.png" alt="">
                </div>
                <div class="text">订单创建成功</div>
            </div>
            <div class="order-info">
                <van-button class="button-boxs" @click="finishBtn">完成</van-button>
                <div class="order-text" @click="addGoods">查看订单</div>
            </div>
        </div>

    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
// import { newPage } from '@/utils/composables'

const router = useRouter()
const props = defineProps(['workOrderNo', 'orderNo'])
const addGoods = () => {
    // const param = {
    //     orderNoSub: props.orderNo,
    //     orderStatus: '代付款'
    // }
    // newPage(`/details?orderNoSub=${props.orderNo}&orderStatus='代付款'`, param)
    router.push({
        path: '/details',
        name: 'details',
        params: {
            orderNoSub: props.orderNo,
            orderStatus: '代付款'
        }
    })
}

const finishBtn = () => {
    console.log(props.workOrderNo, 'props.workOrderNo')
    // const param = {
    //     workOrderNo: props.workOrderNo
    // }
    // newPage(`/abnormalDetails?workOrderNo=${props.workOrderNo}`, param)
    router.push({
        path: '/abnormalDetails',
        name: 'abnormalDetails',
        query: {
            workOrderNo: props.workOrderNo
        }
        // query: {
        //     showNavbar: 0
        // }
    })
}
</script>
<style lang="scss" scoped>
   .addOrderBox{
    background: #FFFFFF;
    height: 100vh;

    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #F7F7F7;
            .icon--unselect{
                width: 20px;
                height: 35px;
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
    }
    .icon--unselect{
            width: 20px;
            height: 35px;
        }
        .main-page{
            min-height: calc(100vh - 40px - var(--van-status-bar-height));
            .main{
        padding-top: 155px;
        .image{
            width:212px;
            height:213px;
            margin: 0 auto;
            img{
                width:100%;
                height:100%;
            }
        }
        .text{
            font-size: 36px;
            font-weight: 600;
            color: #2E2E4D;
            margin-top: 17px;
            text-align: center;
        }
    }
    .order-info{
        text-align: center;
        margin-top: 190px;
        .button-boxs{
            width: 630px;
            height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 600;
            color: #FFFFFF;
        }
        .order-text{
            margin-top: 26px;
            font-size: 26px;
            font-weight: 400;
            color: #FE7E41;
        }
    }
        }

}
</style>
