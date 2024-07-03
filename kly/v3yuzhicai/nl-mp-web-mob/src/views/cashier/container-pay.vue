<template>
    <div class="cashier-page" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder>
            <template #left>
                <div class="icon--unselect" @click="appBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
            <template #title>
                {{ $route.meta.title }}
            </template>
        </van-nav-bar>
        <div class="main-container">
            <div class="money">¥<span class="font-din">{{ (props.payAmount / 100).toFixed(2) }}</span></div>
            <div class="payment-method">
                <div class="title">推荐支付方式</div>
                <div class="item van-hairline--top">
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/settlement/wxPay.png')"/>
                        <span>微信支付</span>
                    </div>
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/settlement/checked.png')"/>
                    </div>
                </div>
            </div>
            <div class="button-box" :class="isApp ? 'is-app' : ''">
                <van-button color="#F06441" @click="goPay" text="立即付款" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
import { cashWindowsData, isSuccessPay } from '@/api/order'
import { containerPayCashierDoPay } from '@/utils/order'
import { pageGo } from '@/utils/composables'
import { appBridge, registerhandler } from '@/utils/bridge'
import { Toast } from 'vant'

const props = defineProps(['appKey', 'busiCode', 'orderNo', 'payAmount', 'checkOrder'])
const store = useStore()
const token = computed(() => store.state.token)

const cashierData = ref(null)

// 回退到货柜订单详情
const appBack = () => pageGo(`/container-order-detail/${props.appKey}/${props.busiCode}/${props.orderNo}/1`)

// 安卓物理返回 执行h5PageBack
registerhandler('h5PageBack', () => {
    // 支付超时 返回首页
    if (isLoad.value && !cashierData.value) return appBridge('useCoupon')
    appBack()
})

onMounted(() => {
    watch([token], () => {
        if (token.value) {
            if (props.checkOrder) {
                orderStatusFn()
            } else {
                cashWindowsDataFn()
            }
        }
    })
    if (token.value) {
        if (props.checkOrder) {
            orderStatusFn()
        } else {
            cashWindowsDataFn()
        }
    }
})

const route = useRoute()
// 监听h5页面后台运行 再打开后刷新当前数据
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && !props.checkOrder && token.value && route.name === 'container-pay-cashier') {
        cashWindowsDataFn()
    }
})

const router = useRouter()
const orderStatusFn = async () => {
    const { data } = await isSuccessPay({ orderNumber: props.orderNo, sourceType: 3 })
    if (data === '订单已支付' || data === '订单支付成功') {
        // 支付成功页面
        router.replace({ name: 'container-finish-pay', params: { appKey: props.appKey, busiCode: props.busiCode, orderNo: props.orderNo } })
        // pageGo(`/container-finish-pay/${props.appKey}/${props.busiCode}/${props.orderNo}`)
    } else {
        cashWindowsDataFn()
    }
}

// 数据
const isLoad = ref(false)
const cashWindowsDataFn = async () => {
    const { data } = await cashWindowsData({ orderNumber: props.orderNo, sourceType: 3 })
    isLoad.value = true
    // code===511订单状态错误 data=null
    cashierData.value = data
}

// 支付
const goPay = () => {
    if (isApp) {
        appBridge('checkPayChannel', '微信', (payload) => {
            if ((payload) === 'true') {
                containerPayCashierDoPay(props.orderNo, props.payAmount, props.appKey, props.busiCode)
            } else if ((payload) === 'false') {
                Toast('微信未安装')
            }
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
            background-color: #F7F7F7;
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
.cashier-page{
    .main-container{
        overflow: hidden;
        .money{
            font-size: 40px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #333333;
            text-align: center;
            padding-top: 89px;
            .font-din{
                font-size: 80px;
                font-weight: bold;
                color: #222222;
            }
        }
        .tip{
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: bold;
            color: #999999;
            text-align: center;
            margin-top: 24px;
            span{
                color: #F16542;
            }
        }
        .payment-method{
            margin: 89px 24px 0;
            background-color: #fff;
            padding: 20px 0 10px;
            .title{
                font-size: 30px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #222222;
            }
            &>div{
                padding: 30px 30px 30px 25px;
            }
            :deep(.van-hairline--top:after){
                --van-border-color: #F4F5F5;
            }
            .item{
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #555555;
                span{
                    margin-left: 14px;
                }
                .icon--unselect{
                    .van-image{
                        width: 32px;
                        height: 32px;
                    }
                }
            }
        }
        .button-box{
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #FFFFFF;
            box-shadow: 0px 1px 0px 0px #F5F5F5;
            display: flex;
            .van-button{
                flex: 1;
                height: 88px;
                margin: 12px 24px;
                border-radius: 12px;
                font-size: 30px;
                font-weight: bold;
                color: #FFFFFF;
                font-family: PingFangSC-Semibold, PingFang SC;
            }
        }
        .is-app{
            padding-bottom: constant(safe-area-inset-bottom) !important;
            padding-bottom: env(safe-area-inset-bottom) !important;
        }
    }
}
</style>
