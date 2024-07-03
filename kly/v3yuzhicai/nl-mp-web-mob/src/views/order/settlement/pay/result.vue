<template>
    <template v-if="!dialogVisible">
        <div class="pay-result-page" v-if="state === 1" :class="isApp ? 'status-bar-height' : ''">
            <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
                <template #left>
                    <div class="icon--unselect" @click="pageBack">
                        <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                    </div>
                </template>
            </van-nav-bar>
            <div class="icon icon1"></div>
            <div class="state">支付成功</div>
            <router-link :to="{name: 'order-detail', params: {id: props.orderNumber}}" custom v-slot="{ navigate }">
                <van-button @click="navigate" class="large">查看订单({{ jumpNum }}s)</van-button>
            </router-link>
        </div>
        <div class="pay-result-page" v-if="state === 2" :class="isApp ? 'status-bar-height' : ''">
            <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
                <template #left>
                    <div class="icon--unselect" @click="pageBack">
                        <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                    </div>
                </template>
            </van-nav-bar>
            <div class="icon icon2"></div>
            <div class="state">请于15分钟内完成支付</div>
            <van-button @click="toPay(props.orderNumber)" class="large">去支付</van-button>
            <div @click="cancelOrderFn" class="small">取消订单</div>
        </div>
        <div class="pay-result-page" v-if="state === 3" :class="isApp ? 'status-bar-height' : ''">
            <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
                <template #left>
                    <div class="icon--unselect" @click="pageBack">
                        <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                    </div>
                </template>
            </van-nav-bar>
            <div class="icon icon3"></div>
            <div class="state">订单已失效</div>
            <router-link :to="{name: 'order-detail', params: {id: props.orderNumber}}" custom v-slot="{ navigate }">
                <van-button @click="navigate" class="large">查看订单</van-button>
            </router-link>
        </div>
    </template>
    <Dialog :visible="dialogVisible" :close="true" @closeClick="closeClick" @leftClick="toPay(props.orderNumber)"  @rightClick="closeDialog" title="您是否已完成支付？" left="继续支付" right="已支付" />
</template>
<script setup>
import Dialog from '@/components/Dialog/index.vue'
import { orderStatus, cancelOrder } from '@/api/order'
import { payFn } from '@/utils/order'
import { isApp, isWx } from '@/utils'
import { Toast } from 'vant'
import { onBeforeRouteLeave } from 'vue-router'
import { pageBack } from '@/utils/composables'

const router = useRouter()
const props = defineProps(['orderNumber'])
const state = ref(0)
const dialogVisible = ref(false)
const store = useStore()
const token = computed(() => store.state.token)

onMounted(async () => {
    watch([token], () => {
        if (token.value) getOrderStatus()
    })
    if (token.value) getOrderStatus()
})

const getOrderStatus = async () => {
    const res = await orderStatus({ orderNumber: props.orderNumber })
    if (res.orderStatus === 100) {
        state.value = 2
    } else if (res.orderStatus > 100 && res.orderStatus < 800) {
        state.value = 1
        countDownFn()
    } else if (res.orderStatus === 800) {
        state.value = 3
    }
    if (!isWx && state.value === 2) (dialogVisible.value = true)
}
// Dialog
const closeDialog = async () => {
    dialogVisible.value = false
    getOrderStatus()
}
const timer = ref(null)
const jumpNum = ref(5)
const countDownFn = () => {
    // 支付成功后 倒计时5秒 后跳转订单/ 备餐
    timer.value = setInterval(() => {
        jumpNum.value--
        if (jumpNum.value === 0) {
            clearInterval(timer.value)
            router.replace({ name: 'order-detail', params: { id: props.orderNumber } })
        }
    }, 1000)
}

onBeforeRouteLeave((to) => {
    clearInterval(timer.value)
})

const cancelOrderFn = async () => {
    const code = await cancelOrder({ orderNumber: props.orderNumber })
    if (code === 200) Toast('操作成功')
    router.replace({ name: 'order-detail', params: { id: props.orderNumber } })
}
const closeClick = () => {
    dialogVisible.value = false
}
// 去付款
const toPay = async (orderNumber) => {
    await payFn(orderNumber)
}

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
.pay-result-page{
    width: 100%;
    text-align: center;
    padding-top: 148px;
    .icon{
        margin: 0 auto;
        width: 122px;
        height: 122px;
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    .icon1{
        background-image: url('../../../../assets/settlement/pay-success.png');
    }
    .icon2{
        background-image: url('../../../../assets/settlement/paying.png');
    }
    .icon3{
        background-image: url('../../../../assets/settlement/pay-fail.png');
    }
    .state{
        font-size: 36px;
        font-weight: bold;
        color: #323340;
        line-height: 50px;
        margin-top: 30px;
    }
    .large{
        width: 654px;
        height: 88px;
        font-size: 32px;
        font-weight: bold;
        color: #FFFFFF;
        background: linear-gradient(270deg, #F46844 0%, #E35A37 100%);
        border-radius: 16px;
        border: initial;
        margin-top: 80px;
    }
    .small{
        font-size: 28px;
        font-weight: 400;
        color: #F26743;
        border: initial;
        margin-top: 30px;
    }
}
</style>
