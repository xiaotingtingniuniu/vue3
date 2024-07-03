<template>
    <div class="order-detail-page" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed left-arrow z-index="10000" :style="{'background': `rgba(241, 101, 66, ${opacity})`}" :border="false">
            <template #title v-if="opacity > 0.1">
                <div class="shop-title">订单详情</div>
            </template>
            <template #left>
                <div class="icon--unselect back" @click="pageBack">
                    <van-image :src="require('@/assets/order/Rectangle @2x.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="order-state">
            <div class="order-state-tip">
                <div class="order-state-title">
                    <div class="icon--unselect">
                        <van-icon v-if="detaildata.orderStatus===100" size="1em" :name="require(`../../assets/order/state100.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===500" size="1em" :name="require(`../../assets/order/state500.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===600" size="1em" :name="require(`../../assets/order/state600.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===700" size="1em" :name="require(`../../assets/order/state700.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===800" size="1em" :name="require(`../../assets/order/state800.png`)" />
                        <van-icon v-else size="1em" :name="require(`../../assets/order/state200.png`)" />
                    </div>
                    <div class="text">{{detaildata.orderStatus===100?'待付款':detaildata.orderStatus===500?'待取货':detaildata.orderStatus===600?'已完成':detaildata.orderStatus===700?'已退款':detaildata.orderStatus===800?'已取消':'备餐中'}}</div>
                </div>
                <div class="order-state-content" v-if="detaildata.orderStatus===200|| detaildata.orderStatus===300|| detaildata.orderStatus===400">商品配送入柜后，会通知您哦~</div>
                <div class="order-state-content" v-if="detaildata.orderStatus===600">已完成取货，欢迎下次惠顾</div>
                <div class="order-state-content" v-if="detaildata.orderStatus===500">请您尽快到货柜里取货哦～</div>
            </div>
            <van-button @click="scanQRCodeFn" v-if="detaildata.orderStatus === 500" icon="scan" type="primary">扫码开柜</van-button>
            <van-button @click="scanQRCodeFn" v-if="detaildata.orderStatus === 600 && detaildata.remainOpenTimes > 0" icon="scan" type="primary">扫码开柜</van-button>
        </div>
        <div class="card">
            <div class="location">
                <div class="location-main">
                    <div class="location-main--counter" @click="navigate">
                        <div class="locotion-point">
                            <div class="icon--unselect">
                                <van-icon size="1em" :name="require('@/assets/home/selfpoint.png')" />
                            </div>
                            <div class="text">自提点</div>
                        </div>
                        <div class="title van-ellipsis">取货点: {{detaildata.cabinetName}}</div>
                        <div class="state" v-if="detaildata.cabinetStatus === 1">在线</div>
                        <div class="nostate" v-else>{{detaildata.cabinetStatus===2?'离线':'不存在'}}</div>
                    </div>
                    <div class="location-main--address">
                        <div class="text">{{detaildata.cabinetAddress}}</div>
                    </div>
                </div>
                <div class="icon--unselect" @click="routePlan(detaildata.cabinetName, `${detaildata.latitude},${detaildata.longitude}`, detaildata.cabinetAddress)">
                    <van-icon size="1em" :name="require('@/assets/settlement/navigation.png')" />
                </div>
            </div>
            <div class="schedule">
                <div class="schedule-time" v-if="detaildata.estimatedPickupTime">
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/settlement/时间@2x.png')"/>
                    </div>
                    预计取货时间：{{detaildata.estimatedPickupTime}}
                </div>
                <div class="schedule-tip" v-if="detaildata.orderStatus===100|| detaildata.orderStatus===800">
                    当日{{detaildata.cutOrderTime}}点前下单，次日{{detaildata.orderArriveTime}}点前送餐入柜
                </div>
                <div class="schedule-tip" v-if="detaildata.orderStatus===100|| detaildata.orderStatus===800">
                    当日{{detaildata.cutOrderTime}}点后下单，后天{{detaildata.orderArriveTime}}点前送餐入柜
                </div>
            </div>
        </div>
        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="icon--unselect shop-icon">
                        <van-icon size="1em" :name="require('@/assets/order/编组 4@2x.png')" />
                    </div>
                    <div class="text">{{detaildata.shopName}}</div>
                </div>
                <div class="goods-list" v-for="(item,index) in detaildata.commodityList" :key='index'>
                    <goodsitem-order2 :class="index === 0 ? '' : 'van-hairline--top'" @click="pageGo(`/shops-goods/goods-detail/${item.commodityId}`)" sales :goodsInfo="item"></goodsitem-order2>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card">
                <div class="group-title van-hairline--bottom">订单信息</div>
                <div class="cell">
                    <div class="title">商品总额</div>
                    <div class="content">¥{{detaildata.totalAmount}}</div>
                </div>
                <div class="cell" v-if="detaildata.discountAmount > 0">
                    <div class="title">优惠金额</div>
                    <div class="content">¥{{detaildata.discountAmount}}</div>
                </div>
                <div class="cell">
                    <div class="title">支付金额</div>
                    <div class="content">¥{{detaildata.payAmount}}</div>
                </div>
                <div class="cell" v-if="detaildata.payType">
                    <div class="title">支付方式</div>
                    <div class="content">{{detaildata.payType===1?'微信':'支付宝'}}</div>
                </div>
                <div class="cell">
                    <div class="title">订单编号</div>
                    <div class="content">{{detaildata.orderNumber}}</div>
                </div>
                <div class="cell">
                    <div class="title">创建时间</div>
                    <div class="content">{{detaildata.createTime}}</div>
                </div>
                <div class="cell" v-if="detaildata.payNumber">
                    <div class="title">支付交易号</div>
                    <div class="content">{{detaildata.payNumber}}</div>
                </div>
                <div class="cell" v-if="detaildata.payTime">
                    <div class="title">付款时间</div>
                    <div class="content">{{detaildata.payTime}}</div>
                </div>
                <div class="cell" v-if="detaildata.putFoodsTime">
                    <div class="title">商品入柜时间</div>
                    <div class="content">{{detaildata.putFoodsTime}}</div>
                </div>
                <div class="cell" v-if="detaildata.takeFoodsTime">
                    <div class="title">取货时间</div>
                    <div class="content">{{detaildata.takeFoodsTime}}</div>
                </div>
                <div class="cell" v-if="detaildata.cancelTime">
                    <div class="title">取消时间</div>
                    <div class="content">{{detaildata.cancelTime}}</div>
                </div>
                <div class="cell" v-if="detaildata.refundTime">
                    <div class="title">退款时间</div>
                    <div class="content">{{detaildata.refundTime}}</div>
                </div>
            </div>
        </div>
        <div class="button" :class="isApp ? 'is-app' : ''">
            <van-button round color="#F16642" v-if='detaildata.orderStatus ===100' @click="toPay(detaildata.orderNumber)">去付款</van-button>
            <a class="onlineservice" v-else href="tel:400-085-5858"><van-button round color="#F16642">联系客服</van-button></a>
        </div>
        <div class="button-height" :class="isApp ? 'is-app' : ''"></div>
    </div>
</template>
<script setup>
import { orderDetail } from '@/api/order'
import GoodsitemOrder2 from '../../components/Goods/GoodsitemOrder2.vue'
import { payFn } from '@/utils/order'
import { isApp } from '@/utils'
import { pageGo, pageBack, routePlan, scanQRCodeFn } from '@/utils/composables'
const store = useStore()
const token = computed(() => store.state.token)
const props = defineProps(['id'])

onMounted(() => {
    watch([token], () => {
        if (token.value) getOrderConfig()
    })
    if (token.value) getOrderConfig()
})

const detaildata = ref({})
const getOrderConfig = async () => {
    const data = await orderDetail({ orderNumber: props.id })
    detaildata.value = data
}
const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 200
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})
// 去付款
const toPay = async (orderNumber) => {
    await payFn(orderNumber)
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    min-height: calc(100vh - 189px - var(--van-status-bar-height)) !important;
    padding-top: calc(60px + var(--van-status-bar-height)) !important;
    background-size: 101% 550px !important;
    .shop-title{
        font-size: 34px;
        font-weight: bold;
        color: #FFFFFF;
    }
    :deep(.van-nav-bar){
        padding-top: var(--van-status-bar-height);
        background-color: #F16542;
    }
    :deep(.van-nav-bar::after){
        content: initial;
    }
    .back{
        .van-image{
            width: 20px;
            height: 35px;
        }
    }
}
.order-detail-page{
    width: 100%;
    min-height: calc(100vh - var(--van-status-bar-height));
    background-image: url('../../assets/order/order-detail-bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #F7F7F7;
    padding-top: var(--van-status-bar-height);
    .order-state{
        display: flex;
        align-items: center;
        padding: 24px;
        margin-bottom: 18px;
        .order-state-tip{
            flex: 1;
            .order-state-title{
                display: flex;
                .icon--unselect{
                    font-size: 48px;
                    margin-right: 11px;
                }
                .text{
                    font-size: 42px;
                    font-weight: bold;
                    color: #FFFFFF;
                }
            }
            .order-state-content{
                font-size: 26px;
                font-weight: 400;
                color: #FFFFFF;
                margin-top: 5px;
            }
        }
        .van-button{
            width: 236px;
            height: 80px;
            background: #FFFFFF;
            border-radius: 40px;
            font-size: 30px;
            font-weight: bold;
            color: #F16542;
        }
    }
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
        padding: 32px 24px 20px;
        .location-main{
            flex: 1;
            .location-main--counter{
                display: flex;
                align-items: center;
                .locotion-point{
                    // width: 126px;
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
                    font-weight: bold;
                    color: #222222;
                    margin-right: 7px;
                }
                .state{
                    font-size: 24px;
                    font-weight: bold;
                    color: #F16542;
                    line-height: 21px;
                    padding: 6px;
                    border-radius: 6px;
                    border: 1px solid #F16542;
                }
                .nostate{
                    font-size: 24px;
                    font-weight: bold;
                    color: #AAAAAA;
                    line-height: 21px;
                    padding: 6px;
                    border-radius: 6px;
                    border: 1px solid #AAAAAA;
                    margin-right: 16px;
                }
            }
            .location-main--address{
                display: flex;
                align-items: center;
                color: #828080;
                margin-top: 5px;
                .text{
                    font-size: 24px;
                }
            }
        }
       .icon--unselect{
            font-size: 54px;
        }
    }
    .schedule{
        padding: 20px 24px 32px;
        .schedule-time{
            display: flex;
            align-items: center;
            font-size: 26px;
            line-height: 26px;
            font-weight: bold;
            color: #222222;
            .van-image{
                width: 26px;
                height: 26px;
                margin-right: 10px;
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
        .shop-info-name:after{
            border: 0 solid #F4F5F5 !important;
        }
        .shop-info-name{
            display: flex;
            align-items: center;
            padding: 30px 30px 22px;
            .shop-icon{
                font-size: 30px;
                height: 28px;
                margin-right: 8px;
            }
            .text{
                font-size: 30px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #222222;
                font-weight: bold;
            }
        }
        .goods-list{
            padding: 0 30px;
            .van-hairline--top:after{
                border: 0 solid #F4F5F5 !important;
            }
        }
    }
    .cell-group{
        margin-top: 20px;
        .card{
            margin-top: 20px;
            padding: 16px 0;
            .group-title{
                font-size: 28px;
                font-weight: bold;
                color: #222222;
                padding: 8px 24px 24px;
                margin-bottom: 16px;
            }
        }
        .cell{
            padding: 16px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title{
                font-size: 24px;
                font-weight: 400;
                color: #555555;
                line-height: 24px;
            }
            .content{
                font-size: 24px;
                font-weight: bold;
                color: #222222;
                line-height: 24px;
                .van-icon{
                    color: #999999;
                }
            }
        }
    }
    .is-app{
        padding-bottom: calc(10px + constant(safe-area-inset-bottom)) !important;
        padding-bottom: calc(10px + env(safe-area-inset-bottom)) !important;
    }
    .button{
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
        .onlineservice{
            width: 100%;
            height: 88px;
        }
        .van-button{
            width: 100%;
            height: 88px;
            background: #F16642;
            border-radius: 16px;
            font-size: 32px;
            font-weight: bold;
            color: #FFFFFF;
        }
        .price{
            font-size: 28px;
            font-weight: 400;
            color: #191919;
            display: flex;
            align-items: flex-end;
            span{
                font-size: 40px;
                line-height: 40px;
                font-weight: bold;
                color: #F16542;
            }
            .unit{
                font-size: 26px;
                line-height: 26px;
                margin-left: 16px;
                margin-right: 4px;
            }
        }
    }
    .button-height{
        width: 100%;
        height: 108px;
    }
}
</style>
