<template>
    <div class="order-confirm-page" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="card">
            <div class="location" v-if="counterInfo">
                <div class="location-main">
                    <div class="location-main--counter" @click="navigate">
                        <div class="locotion-point">
                            <div class="icon--unselect">
                                <van-icon size="1em" :name="require('@/assets/home/selfpoint.png')" />
                            </div>
                            <div class="text">自提点</div>
                        </div>
                        <div class="title van-ellipsis">取货点: {{ counterInfo.name }}</div>
                        <div class="state" v-if="counterInfo.statusDesc === '在线'">{{ counterInfo.statusDesc }}</div>
                        <div class="nostate" v-else>{{ counterInfo.statusDesc }}</div>
                    </div>
                    <div class="location-main--address">
                        <div class="text">{{ counterInfo.address }}</div>
                    </div>
                </div>
                <div class="icon--unselect" @click="routePlan(counterInfo.name, `${counterInfo.latitude},${counterInfo.longitude}`, counterInfo.address)" >
                    <van-icon size="1em" :name="require('@/assets/settlement/navigation.png')" />
                </div>
            </div>
            <div class="schedule">
                <div class="schedule-time">
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/settlement/时间@2x.png')"/>
                    </div>
                    预计取货时间：{{settlementData.pickupTime}}点
                </div>
                <div class="schedule-tip">
                    当日{{settlementData.cutOrderTime}}点前下单，次日{{settlementData.orderArriveTime}}点前送餐入柜
                </div>
                <div class="schedule-tip">
                    当日{{settlementData.cutOrderTime}}点后下单，后天{{settlementData.orderArriveTime}}点前送餐入柜
                </div>
            </div>
        </div>
        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="icon--unselect shop-icon">
                        <van-image :src="require('@/assets/settlement/编组 4备份 11@2x.png')"/>
                    </div>
                    <div class="text">{{settlementData.storeName}}</div>
                </div>
                <div class="goods-list" v-for="(item, index) in settlementData.skuList" :key="index">
                    <goods-item3 :goods="item" :class="index === 0 ? '' : 'van-hairline--top'" />
                </div>
            </div>
            <div class="cell-group" v-if="settlementData">
                <div class="cell card">
                    <div class="title title-bold">优惠券</div>
                    <div v-if="currentActiveCoupon" @click="goSelectCoupon" class="content">
                        <div class="content-text"></div>
                        <div>{{ currentActiveCoupon.couponViewName }}</div>
                        <div class="discount">-{{ Number(currentActiveCoupon.couponAmount/100) }}</div>
                    </div>
                    <div v-else class="content">无可用券</div>
                </div>
                <div class="cell card">
                    <div class="title title-bold">支付方式</div>
                    <div class="content">微信支付</div>
                </div>
                <div class="card pd16">
                    <div class="cell">
                        <div class="title">商品总额</div>
                        <div class="content">¥{{ settlementData.totalAmt }}</div>
                    </div>
                    <div class="cell" v-if="currentActiveCoupon">
                        <div class="title">优惠金额</div>
                        <div class="content">¥{{ Number(currentActiveCoupon.couponAmount/100) }}</div>
                    </div>
                    <div class="cell">
                        <div class="title">支付金额</div>
                        <div class="content">¥{{ payAmount }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="payment-bar" :class="isApp ? 'is-app' : ''">
            <div class="total">
                <div class="total-num">合计: <span class="unit">¥</span><span class="font-din">{{ payAmount }}</span></div>
                <div class="total-discount" v-if="currentActiveCoupon">已优惠¥{{ Number(currentActiveCoupon.couponAmount/100) }}</div>
            </div>
            <van-button round color="#F16642" @click="getSettle()">确认订单</van-button>
        </div>
        <div class="payment-bar-height" :class="isApp ? 'is-app' : ''"></div>
    </div>
</template>
<script setup>
import GoodsItem3 from '@/components/Goods/GoodsItem3.vue'
import { orderInfoAdd } from '@/api/order'
import { orderreceivedCoupon } from '@/api/coupon'
import { routePlan, pageBack, goHomePage, pageGo } from '@/utils/composables'
import { isApp } from '@/utils'

const store = useStore()
const router = useRouter()
const route = useRoute()
const settlementData = computed(() => store.state.settlementData)
const counterInfo = computed(() => store.state.counterInfo)
const userInfo = computed(() => store.state.userInfo)
const currentActiveCoupon = computed(() => store.state.currentActiveCoupon)
const payAmount = computed(() => {
    return currentActiveCoupon.value ? (currentActiveCoupon.value.payAmount / 100).toFixed(2) : settlementData.value.totalAmt
})
const token = computed(() => store.state.token)

const orderItemList = ref()
onMounted(() => {
    orderItemList.value = settlementData.value.skuList.map(item => {
        return {
            commodityId: item.commodityId,
            commodityUnitPrice: item.commodityUnitPrice,
            commodityQuantity: item.commodityQuantity,
            commoditySecCid: item.commoditySecCid
        }
    })
    watch([token], () => {
        if (token.value) couponSelectFn()
    })
    if (token.value) couponSelectFn()
})

const couponList = ref([])
const couponSelectFn = async () => {
    const list = JSON.parse(localStorage.getItem('settlementData')).skuList
    const Codes = []
    const priceAmount = ref(0)
    for (var i = 0; i < list.length; i++) {
        const objs = {}
        objs.shopCode = list[i].storeId
        objs.shopName = settlementData.value.storeName
        objs.sku = list[i].id
        objs.skuName = list[i].name
        objs.price = list[i].sellPrice * 100
        objs.num = list[i].quantity
        objs.batchCode = list[i].batchCode
        objs.userRangeType = list[i].userRangeType
        Codes.push(objs)
        priceAmount.value = priceAmount.value + list[i].sellPrice * list[i].quantity * 100
    }
    console.log(Codes)
    const { code, data } = await orderreceivedCoupon({
        shopCode: JSON.parse(localStorage.getItem('settlementData')).storeId,
        orderAmount: priceAmount.value,
        skuList: Codes
    })
    if (code === '200') {
        couponList.value = data
        if (data.length !== 0) {
            if (!currentActiveCoupon.value) {
                store.commit('setCurrentActiveCoupon', data[0])
            }
        }
    }
    // if (!res.length) return false
    // couponList.value = data
    // if (!currentActiveCoupon.value) {
    //     store.commit('setCurrentActiveCoupon', res[0].statusSDK === 2 ? res[0] : null)
    // }
}

const goSelectCoupon = () => {
    store.commit('setCouponList', couponList.value)
    router.push({ name: 'select-coupon' })
}
const getSettle = async () => {
    if (isApp && !userInfo.value) await store.dispatch('updateUserInfo')
    if (!userInfo.value && !counterInfo.value) return false
    const param = {
        orderItemDTOList: settlementData.value.skuList,
        cabinetAddress: counterInfo.value.address || null,
        cabinetName: counterInfo.value.name || null,
        cabinetNumber: counterInfo.value.counterNum || null,
        mobile: userInfo.value.mobile || null,
        payAmount: payAmount.value,
        shopId: settlementData.value.storeId || null,
        shopName: settlementData.value.storeName || null,
        totalAmount: settlementData.value.totalAmt || null,
        userId: userInfo.value.id || null,
        userName: userInfo.value.nickname || null,
        couponCode: currentActiveCoupon.value ? currentActiveCoupon.value.couponCode : null,
        discountAmount: currentActiveCoupon.value ? Number(currentActiveCoupon.value.couponAmount / 100) : 0,
        payType: 1,
        sourceType: 2,
        position: route.query.position,
        couponSource: 1
    }
    const res = await orderInfoAdd(param)
    if (res.code === 200) {
        pageGo(`/cashier/${res.data}`)
        store.commit('setCurrentActiveCoupon', null)
    }
    if (res.code === 510) {
        store.commit('setCurrentActiveCoupon', null)
        couponSelectFn()
    } else if (res.code === 516) {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            pageBack()
        }, 1500)
    } else if (res.code === 517) {
        const timer = setTimeout(() => {
            clearTimeout(timer)
            goHomePage()
        }, 1500)
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
.order-confirm-page{
    min-height: calc(100vh - 40px - var(--van-status-bar-height));
    background-color: #F7F7F7;
    padding-top: 20px;
    padding-bottom: 20px;
    .card{
        margin: 0 24px;
        border-radius: 12px;
        overflow: hidden;
        background-color: #fff;
    }
    .location{
        min-height: 86px;
        display: flex;
        align-items: center;
        padding: 9px 30px;
        .location-main{
            flex: 1;
            .location-main--counter{
                display: flex;
                align-items: center;
                .locotion-point{
                    height: 42px;
                    display: flex;
                    align-items: center;
                    background-color: rgba(241, 101, 66, 0.14);
                    border-radius: 6px;
                    font-size: 26px;
                    color: #F16542;
                    margin-right: 8px;
                    .icon--unselect{
                        margin: 0px 4px 0px 4px;
                        font-size: 26px;
                    }
                    .text{
                        margin-right: 8px;
                    }
                }
                .title{
                    max-width: 300px;
                    font-size: 34px;
                    color: #222222;
                    margin-right: 7px;
                    font-weight: bold;
                }
                .state{
                    width: 60px;
                    height: 34px;
                    border-radius: 6px;
                    border: 1px solid #F16542;
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: bold;
                    color: #F16542;
                    text-align: center;
                    line-height: 34px;
                }
                .nostate{
                    width: 60px;
                    height: 34px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    text-align: center;
                    line-height: 34px;
                    font-size: 24px;
                    font-weight: bold;
                    color: #AAAAAA;
                    border-radius: 6px;
                    border: 1px solid #AAAAAA;
                }
            }
            .location-main--address{
                display: flex;
                align-items: center;
                color: #828080;
                margin-top: 5px;
                .text{
                    width: 480px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #555555;
                }
            }
        }
       .icon--unselect{
            font-size: 54px;
        }
    }
    .schedule{
        padding: 30px;
        .schedule-time{
            display: flex;
            align-items: center;
            font-size: 26px;
            font-weight: bold;
            color: #222222;
            line-height: 28px;
            .icon--unselect{
                .van-image{
                    width: 28px;
                    height: 28px;
                    margin-right: 10px;
                }
            }
        }
        .schedule-tip{
            font-size: 24px;
            font-weight: 400;
            color: #999999;
            margin-top: 7px;
        }
    }
    .settlement{
        margin-top: 20px;
        .shop-info-name{
            display: flex;
            align-items: center;
            padding: 30px 30px 22px;
            .shop-icon{
                margin-right: 9px;
                height: 30px;
                display: flex;
                align-items: center;
                .van-image{
                    width: 30px;
                    height: 28px;
                }
            }
            .text{
                font-size: 30px;
                font-family: PingFangSC-Medium, PingFang SC;
                color: #222222;
                line-height: 30px;
                font-weight: bold;
            }
        }
        .goods-list{
            padding: 0 30px;
        }
        .cell-group{
            .pd16{
                padding: 16px 0;
            }
            .card{
                margin-top: 20px;
                .cell{
                    padding: 16px 30px;
                }
            }
            .cell{
                padding: 30px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .title{
                    font-size: 24px;
                    font-weight: 400;
                    color: #555555;
                    line-height: 24px;
                }
                .title-bold{
                    font-size: 24px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: bold;
                    color: #555555;
                }
                .content{
                    display: flex;
                    align-items: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: #222222;
                    .van-icon{
                        color: #999999;
                    }
                    .content-text{
                        width: 28px;
                        height: 28px;
                        background-image: url('../../../assets/home/coupon1.png');
                        background-size: 100% 100%;
                        margin-right: 10px;
                    }
                    .discount{
                        margin-left: 30px;
                        color: #F06441;
                        font-size: 24px;
                    }
                }
            }
        }
    }
    .payment-bar{
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
        .total{
            .total-num{
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #222222;
                span{
                    font-size: 26px;
                    color: #FF1A1A;
                }
                .unit{
                    margin-left: 5px;
                }
                .font-din{
                    font-size: 40px;
                    font-weight: bold;
                }
            }
            .total-discount{
                font-size: 24px;
                font-weight: 400;
                color: #FF1A1A;
                margin-left: 48px;
            }
        }

        .van-button{
            width: 304px;
            height: 88px;
            background: #F16642;
            border-radius: 16px;
            font-size: 32px;
            font-weight: bold;
            color: #FFFFFF;
        }
    }
    .is-app{
        padding-bottom: calc(10px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    }
    .payment-bar-height{
        width: 100%;
        height: 108px;
        padding-bottom: calc(10px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    }
}
</style>
