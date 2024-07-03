<template>
    <div class="order-confirm-page" :class="isApp ? 'status-bar-height' : ''" v-if="detaildata">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="order-state">
            <div class="order-status">
                <div class="icon--unselect">
                    <van-icon size="1em" :name="require(`../../../assets/order/statefaild.png`)" />
                </div>
                <!-- <div class="order-status--text" v-if="detaildata.orderStatus===100 && detaildata.payStatus ===1">补扣订单</div> -->
                <div class="order-status--text" v-if="detaildata.orderStatus===100">扣款失败</div>
            </div>
            <div class="order-text">为不影响您的后续购物体验，烦请确认订单，并完成支付</div>
        </div>
        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="text">订单商品明细</div>
                </div>
                <div class="goods-list" v-for="(item,index) in detaildata.goodsList.slice(0, showNum)" :key='index'>
                    <goodsitem-orderinfo :class="index === 0 ? '' : 'van-hairline--top'" :goodsInfo="item"></goodsitem-orderinfo>
                </div>
                <div class="button-box" v-if="detaildata.goodsList.length > 5">
                    <div v-if="detaildata.goodsList.length > 5" @click="changeShowNum">{{showNum === 5 ? '展示完整信息' : '收起完整信息'}} </div>
                    <img v-if="showNum === 5" :src="require('@/assets/order/down.png')"/>
                    <img v-else :src="require('@/assets/order/up.png')"/>
                </div>
            </div>
            <div class="card shop-msg">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="text">货柜信息</div>
                </div>
                <div class="shop-msg--text">
                    <div class="title">货柜编号</div>
                    <div class="text">{{detaildata.poiCode}}</div>
                </div>
                <div class="shop-msg--text">
                    <div class="title">货柜地址</div>
                    <div class="text">{{detaildata.poiAddress}}</div>
                </div>
            </div>
            <div class="cell-group">
                <div class="cell card">
                    <div class="title title-bold">优惠券</div>
                    <div v-if="detaildata.couponMinusViewName" class="content">
                        <div class="content-text"></div>
                        <div>{{ detaildata.couponViewName }}</div>
                        <div class="discount">-{{ detaildata.couponMinusViewName.slice(0, detaildata.couponMinusViewName.indexOf('元')) }}</div>
                    </div>
                    <div v-else class="content">无可用优惠券</div>
                </div>
                <div class="cell card">
                    <div class="title title-bold">支付方式</div>
                    <div class="content">微信支付</div>
                </div>
                <div class="card pd16">
                    <div class="cell">
                        <div class="title">商品总额</div>
                        <div class="content">¥{{ (detaildata.totalAmount / 100).toFixed(2) }}</div>
                    </div>
                    <div class="cell" v-if="detaildata.couponMinusViewName">
                        <div class="title">优惠金额</div>
                        <div class="content">¥{{ detaildata.couponMinusViewName.slice(0, detaildata.couponMinusViewName.indexOf('元')) }}</div>
                    </div>
                    <div class="cell">
                        <div class="title">支付金额</div>
                        <div class="content">¥{{(detaildata.payAmount / 100).toFixed(2)}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="payment-bar" :class="isApp ? 'is-app' : ''">
            <div class="total">
                <div class="total-num">合计: <span class="unit">¥</span><span class="font-din">{{ (detaildata.payAmount / 100).toFixed(2) }}</span></div>
                <div class="total-discount" v-if="detaildata.couponMinusViewName">已优惠¥{{ detaildata.couponMinusViewName.slice(0, detaildata.couponMinusViewName.indexOf('元')) }}</div>
            </div>
            <van-button round color="#F16642" @click="pageGo(`/container-pay-cashier/${props.appKey}/${props.busiCode}/${props.orderNo}/${detaildata.payAmount}`)">确认订单</van-button>
        </div>
        <div class="payment-bar-height" :class="isApp ? 'is-app' : ''"></div>
    </div>
</template>
<script setup>
import GoodsitemOrderinfo from '@/components/Goods/GoodsitemOrderinfo.vue'
import { containerOrderDetail } from '@/api/container-shopping'
import { pageBack, pageGo } from '@/utils/composables'
import { isApp } from '@/utils'
// import { orderreceivedCoupon } from '@/api/coupon'

const props = defineProps(['appKey', 'busiCode', 'orderNo'])
const token = computed(() => store.state.token)
const store = useStore()

onMounted(() => {
    watch([token], () => {
        if (token.value) orderDetail()
    })
    if (token.value) orderDetail()
})

const showNum = ref(5)
const changeShowNum = () => {
    if (showNum.value === 5) return (showNum.value = detaildata.value.goodsList.length)
    showNum.value = 5
}

const detaildata = ref(null)
const orderDetail = async () => {
    const params = {
        appKey: props.appKey,
        busiCode: props.busiCode,
        orderNo: 'MO202206011432594077XQZF'
    }
    const data = await containerOrderDetail(params)
    detaildata.value = data
}

// const couponList = ref([])
// const couponSelectFn = async () => {
//     const Codes = []
//     for (var i = 0; i < list.value.length; i++) {
//         const objs = {}
//         objs.sku = list.value[i].skuCode
//         objs.skuName = list.value[i].skuName
//         objs.price = list.value[i].realPrice
//         objs.num = list.value[i].quantity
//         Codes.push(objs)
//     }
//     const { code, data } = await orderreceivedCoupon({
//         shopCode: '',
//         orderAmount: detaildata.value.payAmount,
//         skuList: Codes
//     })
//     if (code === '200') {
//         couponList.value = data
//         if (data.length !== 0) {
//             if (!currentActiveCoupon.value) {
//                 store.commit('setCurrentActiveCoupon', data[0])
//             }
//         }
//     }
// }
// const list = ref([])

// const router = useRouter()
// const currentActiveCoupon = computed(() => store.state.currentActiveCoupon)
// const payAmount = computed(() => {
//     return currentActiveCoupon.value ? (currentActiveCoupon.value.payAmount / 100).toFixed(2) : detaildata.value.payAmount
// })

// const goSelectCoupon = () => {
//     store.commit('setCouponList', couponList.value)
//     router.push({ name: 'select-coupon' })
// }
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
    .order-state{
        margin: 0 24px;
        border-radius: 12px;
        overflow: hidden;
        background-color: #fff;
        padding: 32px 24px;
        .order-status{
            display: flex;
            .icon--unselect{
                font-size: 48px;
                margin-right: 11px;
            }
            .order-status--text{
                 font-size: 42px;
                font-weight: bold;
                color: #222;
            }
        }
        .order-text{
            padding-top: 18px;
            font-size: 26px;
        }
    }
    .card{
        margin: 0 24px;
        border-radius: 12px;
        overflow: hidden;
        background-color: #fff;
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
                font-size: 28px;
                font-family: PingFangSC-Medium, PingFang SC;
                color: #222222;
                line-height: 30px;
                font-weight: bold;
            }
        }
        .goods-list{
            padding: 0 30px;
        }
        .button-box{
            width: 260px;
            height: 50px;
            border-radius: 30px;
            border: 1px solid #E4E4E4;
            font-size: 22px;
            font-weight: 400;
            color: #222222;
            display:flex;
            justify-content: center;
            margin:10px auto;
            align-items:center;

            img{
                height:8px ;
                line-height:50px;
                margin-left:16px;
            }
        }
        .shop-msg{
            margin-top: 20px;
            .shop-msg--text {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 16px 30px;
                font-size: 24px;
                color: #555;
                .text{
                    font-weight: bold;
                }
            }
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
                    // font-weight: 400;
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
                    color: #555555;
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
