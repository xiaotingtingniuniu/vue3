<template>
    <div class="pay-result-new" v-if="orderData">
        <div class="pay-result">
            <van-nav-bar v-if="isApp" fixed z-index="10000" placeholder :border="false">
                <template #left v-if="orderData.orderStatus!==200">
                    <div class="icon--unselect back" @click="pageBack">
                        <van-image :src="require('@/assets/order/Rectangle @2x.png')"/>
                    </div>
                </template>
            </van-nav-bar>
            <div class="tip" v-if="orderData.orderStatus!==200">
                <div class="icon--unselect">
                    <van-image :src="require('@/assets/order/state800.png')"/>
                </div>
                <div class="tip-content">
                    <div>结果获取失败</div>
                </div>
            </div>
            <div class="tip--success" v-else>
                <div class="tip">
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/order/state600.png')"/>
                    </div>
                    <div class="tip-content">
                        <div>支付成功</div>
                        <div class="tip-btn" @click="goHomePage2">完成</div>
                    </div>
                </div>
                <div class="pay-amount">实际付款：{{ orderData.payAmount }}</div>
                <div class="pay-time" v-if="orderData.payTime">支付时间：{{ orderData.payTime }}</div>
            </div>
        </div>
        <div class="address-card">
            <div class="pick-up" v-if="orderData.orderStatus===200">
                <div class="icon--unselect">
                    <van-image :src="require('@/assets/settlement/时间@2x.png')"/>
                </div>
                <div class="pick-up-time">预计取货时间：{{ orderData.estimatedPickupTime }}</div>
            </div>
            <div class="address">
                <div class="address-info">
                    <div class="main">取货点: {{ orderData.cabinetName }}
                        <div class="icon" v-if="orderData.cabinetStatus === 1">在线</div>
                        <div class="icon icon2" v-else>{{ orderData.cabinetStatus===2 ? '离线' : '不存在' }}</div>
                    </div>
                    <div class="content van-ellipsis">{{ orderData.cabinetAddress }}</div>
                </div>
                <div class="icon--unselect navigation" @click="routePlan(orderData.cabinetName, `${orderData.latitude},${orderData.longitude}`, orderData.cabinetAddress)">
                    <van-image :src="require('@/assets/home/navigation-icon2.png')" />
                </div>
            </div>
        </div>
        <div class="icon--unselect popularize">
            <van-image :src="require('@/assets/home/banner.png')" />
        </div>
        <div class="button-box" :class="isApp ? 'is-app' : ''">
            <van-button v-if="orderData.orderStatus!==200" @click="orderDetailFn" round color="#F06441">查询结果</van-button>
            <van-button v-else @click="goOrderDetail" round color="#F06441">查看订单</van-button>
        </div>
        <div class="button-height" :class="isApp ? 'is-app' : ''"></div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
import { orderDetail } from '@/api/order'
import { pageBack, routePlan, goHomePage2 } from '@/utils/composables'
import { appBridge, registerhandler } from '@/utils/bridge'

const props = defineProps(['orderNumber'])
const router = useRouter()
const store = useStore()
const token = computed(() => store.state.token)

// 安卓物理返回 执行h5PageBack
registerhandler('h5PageBack', () => {
    if (isApp) return appBridge('useCoupon')
})

onMounted(() => {
    watch([token], () => {
        if (token.value) {
            orderDetailFn()
        }
    })
    if (token.value) {
        orderDetailFn()
    }
})

const orderData = ref(null)
const orderDetailFn = async () => {
    const data = await orderDetail({ orderNumber: props.orderNumber })
    orderData.value = data
}

const goOrderDetail = () => {
    router.replace({ name: 'order-detail', params: { id: props.orderNumber, goMine: 1 } })
}

</script>
<style lang="scss" scoped>
.pay-result-new{
    min-height: 100vh;
    background-image: url('../../../../assets/order/order-detail-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    .pay-result{
        :deep(.van-nav-bar){
            background: transparent;
        }
        .van-nav-bar{
            .icon--unselect.back{
                .van-image{
                    width: 20px;
                    height: 35px;
                }
            }
        }
        .tip{
            display: flex;
            align-items: center;
            padding: 21px 48px 0;
            .icon--unselect{
                width: 48px;
                height: 48px;
                display: inline-block;
                .van-image{
                    width: 48px;
                    height: 48px;
                }
            }
            .tip-content{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: space-between;
                div{
                    font-size: 42px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: bold;
                    color: #FFFFFF;
                    margin-left: 12px;
                }
                .tip-btn{
                    font-size: 30px;
                }
            }
        }
        .pay-amount{
            font-size: 26px;
            font-weight: bold;
            color: #FFFFFF;
            margin: 20px 48px 0;
        }
        .pay-time{
            font-size: 26px;
            font-weight: 400;
            color: #FFFFFF;
            margin: 20px 48px 0;
        }
    }
    .address-card{
        margin: 42px 24px 0;
        background-color: #fff;
        padding: 32px 24px;
        border-radius: 12px;
        .pick-up{
            display: flex;
            margin-bottom: 36px;
            .icon--unselect{
                .van-image{
                    width: 30px;
                    height: 30px;
                }
            }
            .pick-up-time{
                font-size: 28px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #222222;
                margin-left: 6px;
            }
        }
        .address{
            display: flex;
            .address-info{
                flex: 1;
                .main{
                    font-size: 34px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: bold;
                    color: #222222;
                    display: flex;
                    align-items: center;
                    .icon{
                        width: 60px;
                        height: 34px;
                        font-size: 24px;
                        line-height: 34px;
                        text-align: center;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #F16542;
                        border-radius: 6px;
                        border: 1px solid #F16542;
                        margin-left: 7px;
                    }
                    .icon.icon2{
                        color: #AAAAAA;
                        border: 1px solid #AAAAAA;
                    }
                }
                .content{
                    width: 300px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                    margin-top: 6px;
                }
            }
            .navigation{
                width: 54px;
                height: 54px;
                .van-image{
                    width: 54px;
                    height: 54px;
                }
            }
        }
    }
    .popularize{
        margin: 21px 24px 0;
        height: 287px;
        border-radius: 16px;
        overflow: hidden;
    }
    .is-app{
        padding-bottom: calc(10px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    }
    .button-box{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding: 10px 24px;
        box-shadow: 0px 1px 0px 0px #F5F5F5;
        .van-button{
            width: 100%;
            height: 88px;
            border-radius: 12px;
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: bold;
        }
    }
    .button-height{
        width: 100%;
        height: 112px;
    }
}
</style>
