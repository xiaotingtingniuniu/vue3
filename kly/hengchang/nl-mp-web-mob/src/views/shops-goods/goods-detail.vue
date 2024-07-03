<template>
    <div class="goods-detail-page" :class="isApp ? 'status-bar-height' : ''" v-if="goodsData">
        <van-nav-bar v-if="isApp&&(opacity < 0.1)" fixed left-arrow z-index="10000" :border="false">
            <template #left>
                <div class="icon--unselect back" @click="pageBack()">
                    <van-icon size="1em" :name="require('@/assets/goods/back-icon.png')" />
                </div>
            </template>
        </van-nav-bar>
        <van-tabs ref="pageTabs" class="page-tabs" v-model:active="pageActive" color="#F06441" title-inactive-color="#191919" title-active-color="#F06441" scrollspy sticky>
            <template #nav-left>
                <div v-if="isApp" class="icon--unselect back" @click="pageBack()">
                    <van-icon size="1em" :name="require('@/assets/goods/back-icon2.png')" />
                </div>
                <div v-else class="nav-left"></div>
            </template>
            <template #nav-right>
                <div class="nav-right"></div>
            </template>
            <van-tab title="商品" title-class="van-tab-title-class">
                <van-swipe>
                    <template v-if="goodsData.videoList">
                        <van-swipe-item @click="changePlayerState" class="video-box" v-for="(item, index) in goodsData.videoList" :key="index">
                            <video ref="myPlayer"  :poster="goodsData.bannerList.length ?  goodsData.bannerList[0] : ''" id="myPlayer" v-if="item" playsinline webkit-playsinline x5-video-player-type="h5-page" x5-playsinline x-webkit-airplay='allow'>
                                <source :src="item" type="video/ogg" />
                                <source :src="item" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <van-image v-if="myPlayerState !== 'play'" class="play-circle" :src="require('@/assets/goods/video-play.png')" />
                        </van-swipe-item>
                    </template>
                    <van-swipe-item v-for="(item, index) in goodsData.bannerList" :key="index">
                        <van-image fit="cover" :src="item">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                    </van-swipe-item>
                    <template #indicator="{ active, total }">
                        <div class="custom-indicator">{{ active + 1 }}<span>/{{ total }}</span></div>
                    </template>
                </van-swipe>
                <div class="introduce-group van-hairline--bottom">
                    <div class="introduce-price">
                        <div class="price">
                            <div class="ruling-price"><span class="unit">¥</span><span class="font-din">{{ goodsData.sellPrice.toFixed(2) }}</span></div>
                            <!-- <div class="marking-off" v-if="goodsData.scribingPrice"><span class="unit">¥</span><span class="font-din">{{ goodsData.scribingPrice.toFixed(2) }}</span></div> -->
                        </div>
                        <!-- <div class="stock">
                            <div>库存: {{ goodsData.stock }}</div>
                            <div>销量: {{ goodsData.salesQuantity }}</div>
                        </div> -->
                    </div>
                    <div class="introduce-name van-multi-ellipsis--l2">{{ goodsData.name }}</div>
                    <div class="introduce-desc">{{ goodsData.summary }}</div>
                    <div class="label-group">
                        <div class="label" v-for="(item, index) in goodsData.labelList" :key="index">{{ item }}</div>
                    </div>
                </div>
                <!-- <div v-if="showCoupon !== null" class="coupon" @click="pageGo(`/coupon/draw-coupon/${goodsData.storeId}/${goodsData.id}`)">
                    <div class="coupon-title">优惠信息</div>
                    <div class="coupon-detail">
                        <div class="coupon-detail--leftimg"></div>
                        <div class="coupon-detail--title">
                            <div class="coupon-show--img"></div>
                            <div class="coupon-show--text">优惠活动</div>
                            <div class="coupon-detail-dic" v-if="showCoupon">满{{ showCoupon.doorsillAmount/100 }}减{{ showCoupon.maxMinusAmount/100 }}</div>
                            <div class="coupon-detail-frac" v-if="showCoupon">-{{ showCoupon.maxMinusAmount/100 }}</div>
                        </div>
                        <div class="coupon-detail--rightimg"></div>
                    </div>
                </div> -->
                <div v-if="showCoupon.length" class="coupon">
                    <div class="coupon-title">优惠券</div>
                    <div class="coupon-content">
                        <div class="coupon-list">
                            <template v-for="(item, index) in showCoupon" :key="index">
                                <div class="coupon-item">{{item.couponViewName}}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </van-tab>
            <van-tab title="详情" title-class="van-tab-title-class">
                <van-tabs class="goods-tabs" title-active-color="#F06441" title-inactive-color="#191919" animated>
                    <van-tab title="产品信息" class="data-info">
                        <div class="info" v-if="goodsData.qualityDay || goodsData.weight">
                            <div v-if="goodsData.qualityDay" class="quality-day">保质期: {{ goodsData.qualityDay }}天</div>
                            <div v-if="goodsData.weight">净重: {{ goodsData.weight }}{{ goodsData.weightUnit }}</div>
                        </div>
                        <template v-for="(item, index) in goodsData.informationList" :key="index">
                            <van-image fit="cover" :src="item">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                        </template>
                    </van-tab>
                    <van-tab title="烹饪方法" class="data-info">
                        <template v-for="(item, index) in goodsData.cookMethodList" :key="index">
                            <van-image fit="cover" :src="item">
                                <template v-slot:loading>
                                    <van-loading type="spinner" size="20" />
                                </template>
                            </van-image>
                        </template>
                    </van-tab>
                </van-tabs>
            </van-tab>
        </van-tabs>

        <div class="operation">
            <div class="icon-button">
                <div @click="checkLogin" class="icon-button-item">
                    <div class="icon--unselect">
                        <van-icon :badge="cartNum ? cartNum : ''" size="1em" :name="require('@/assets/goods/cart-icon.png')" />
                    </div>
                    <div class="text">购物车</div>
                </div>
                <div class="icon-button-item" @click="pageGo(`/shops-goods/shops-detail/${goodsData.storeId}`)">
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/goods/shop-icon.png')" />
                    </div>
                    <div class="text">门店</div>
                </div>
            </div>
            <van-button @click="(goodsData.skuState&&goodsData.storeStatus&&goodsData.stock) ? cartAddFn() : ''" :class="(!goodsData.skuState || !goodsData.storeStatus || !goodsData.stock) ? 'offShelf' : ''" round color="#FFAF01">加入购物车</van-button>
            <van-button @click="(goodsData.skuState&&goodsData.storeStatus&&goodsData.stock&&goodsData.sellPrice) ? cartByFn() : ''" :class="(!goodsData.skuState || !goodsData.storeStatus || !goodsData.stock || !goodsData.sellPrice) ? 'offShelf' : ''" round color="#F06441">立即抢购</van-button>
        </div>
        <div v-if="!goodsData.skuState" class="off-shelf">商品已下架，请选择其他商品</div>
        <div v-if="!goodsData.storeStatus" class="off-shelf">商家已打烊，请选择其他商品</div>
        <div v-if="!goodsData.stock" class="off-shelf">商品已售罄，请选择其他商品</div>
        <div class="operation-height"></div>
    </div>
</template>
<script setup>
import { goodsDetail } from '@/api/shops-goods'
import { cartAdd, cartBy } from '@/api/shopping-cart'
import { Toast } from 'vant'
import { goodsreceivedCoupon } from '@/api/coupon/index'
import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
import { pageGo, pageBack } from '@/utils/composables'

const props = defineProps(['id'])
const goodsData = ref(null)
const store = useStore()
const cartNum = computed(() => store.state.cartNum)
const carChoose = computed(() => store.state.carChoose)
const token = computed(() => store.state.token)
const pageActive = ref(0)
// play / pause
const myPlayerState = ref('pause')

const changePlayerState = () => {
    const myPlayer = document.getElementById('myPlayer')
    if (myPlayerState.value === 'pause') {
        myPlayer.play()
        myPlayerState.value = 'play'
        myPlayer.addEventListener('ended', function () { // 结束
            myPlayerState.value = 'pause'
        }, false)
    } else {
        myPlayer.pause()
        myPlayerState.value = 'pause'
    }
}

const pageTabs = ref(null)
const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 200
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})

onMounted(async () => {
    await getData()
    if (token.value) await showOneCouponFn()
    watch([token], async () => {
        if (token.value) await showOneCouponFn()
    })
})

// 跳转前判断登陆状态
const checkLogin = () => {
    if (isApp && !token.value) return appBridge('goLogin')
    pageGo('/shopping-cart?hasback=1')
}

// 商品数据
const getData = async () => {
    const res = await goodsDetail({ id: props.id })
    goodsData.value = res
}
// 要展示的优惠券
const showCoupon = ref([])
const showCoupons = ref([])
const showOneCouponFn = async () => {
    let price = goodsData.value.sellPrice
    price = (price + '').replace('.', '')
    const params = {
        shopCode: goodsData.value.storeId,
        sku: props.id,
        price: Number(price),
        dealType: 2,
        businessCode: 2

    }
    const data = await goodsreceivedCoupon(params)
    showCoupon.value = data || []
    showCoupons.value = data || []
    store.dispatch('updateCartNum')
}

// // 是否有可领取优惠券
// const couponList = async () => {
//     const data = await Coupon({ shopCode: goodsData.value.storeId })
//     // console.log(code)
//     console.log(data)
//     // if (code === '200') {
//     //     if (data.length !== 0) (iscoupon.value = true)
//     // }
// }

// 添加商品到购物车中
const cartAddFn = async () => {
    if (goodsData.value.quantity === 99) return Toast('已经是最大可购买数量了')
    const code = await cartAdd({
        storeId: goodsData.value.storeId,
        skuId: goodsData.value.id,
        quantity: 1
    })
    if (code === 200) {
        Toast('添加成功')
        store.commit('setcarChoose', [...carChoose.value, goodsData.value.id])
    } else {
        await getData()
    }
}
// 立即购买
const cartByFn = async () => {
    const params = {
        storeId: goodsData.value.storeId,
        id: goodsData.value.id,
        quantity: 1
    }
    const { code, data } = await cartBy(params)
    if (code === 200) {
        if (isApp) { store.commit('setCurrentActiveCoupon', null) }
        store.commit('settlementSave', data)
        pageGo('/order-confirm?position=2')
    } else {
        await getData()
    }
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .van-nav-bar{
        background-color: transparent !important;
        .back{
            font-size: 34px;
            height: 100%;
            display: flex;
            justify-content: center;
            .van-icon{
                width: 60px;
                height: 60px;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }
    :deep(.page-tabs){
        &>div:nth-child(1){
            .van-tabs__nav{
                padding-top: var(--van-tabs-line-height);
            }
            .van-tabs__wrap{
                height: initial;
                min-height: var(--van-tabs-line-height);
                .van-tabs__nav--line{
                    padding-bottom: 19px;
                    .van-tabs__line{
                        bottom: 0;
                    }
                }
            }
        }
    }
    .van-swipe{
        height: calc(750px + var(--van-status-bar-height)) !important;
    }
}
.goods-detail-page{
    background-color: #F7F7F7;
    :deep(.van-tab-title-class){
        font-size: 32px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 400 !important;
    }
    .van-nav-bar{
        padding-top: var(--van-status-bar-height);
        background-color: #fff;
    }
    :deep(.van-nav-bar::after){
        content: initial;
    }
    :deep(.page-tabs){
        &>div:nth-child(1){
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            .van-tabs__nav{
                opacity: v-bind(opacity);
            }
            .nav-right{
                width: 170px;
            }
            .nav-left{
                width: 170px;
            }
            .back{
                font-size: 34px;
                height: 100%;
                display: flex;
                justify-content: center;
                margin-left: 30px;
                margin-right: 80px;
                .van-icon{
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
    }
    .custom-indicator{
        position: absolute;
        right: 30px;
        bottom: 30px;
        padding: 5px 21px;
        font-size: 30px;
        color: #fff;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 22px;
        display: flex;
        align-items: center;
        span{
            font-size: 26px;
            color: rgba(255, 255, 255, 0.6);
        }
    }
    .van-swipe{
        width: 100%;
        height: 750px;
        .van-swipe-item{
            .van-image{
                width: 100%;
                height: 100%;
            }
            video{
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }
        .video-box{
            position: relative;
            .play-circle{
                position: absolute;
                width: 102px;
                height: 102px;
                top: 50%;
                left: 50%;
                color: #ccc;
                margin-left: -51px;
                margin-top: -51px;
            }
        }
    }
    .introduce-group{
        background-color: #fff;
        position: relative;
        padding: 30px 24px;
        .introduce-price{
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price{
                display: flex;
                align-items: baseline;
                .ruling-price{
                    font-size: 50px;
                    font-weight: bold;
                    color: #F16542;
                    line-height: 50px;
                    margin-right: 13px;
                    .unit{
                        font-size: 32px;
                        line-height: 32px;
                        font-weight: 400;
                    }
                }
            }
            .stock{
                display: flex;
                div{
                    font-size: 24px;
                    font-weight: 400;
                    color: #999999;
                    margin-left: 36px;
                }
            }
        }
        .introduce-name{
            font-size: 34px;
            font-weight: bold;
            color: #222222;
            margin-top: 18px;
            line-height: 48px;
        }
        .introduce-desc{
            font-size: 24px;
            font-weight: 400;
            color: #999999;
            line-height: 33px;
            margin-top: 11px;
        }
        .label-group{
            display: flex;
            margin-top: 12px;
            .label{
                font-size: 20px;
                font-weight: 400;
                color: #F68033;
                line-height: 20px;
                padding: 3px 8px;
                background: #FFF5F2;
                border-radius: 6px;
                margin-right: 13px;
            }
        }
    }
    .introduce-group::after{
            border-bottom-width: 1px !important;
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            border: 0 solid #E3E3E3;
            transform: scale(.5);
        }
    // .coupon{
    //     // display: flex;
    //     // // height: 112px;
    //     // border-radius: 15px;
    //     // align-items: center;
    //     padding: 30px 24px;
    //     background-color: #fff;
    //     .coupon-title{
    //         font-size: 28px;
    //         font-weight: bold;
    //         color: #191919;
    //         margin-bottom: 18px;
    //     }
    //     .coupon-detail{
    //         display: flex;
    //         height: 112px;
    //         border-radius: 15px;
    //         align-items: center;
    //         justify-content: center;
    //         background-color: #FBEBDB;
    //         font-size: 24px;
    //         // .coupon-detail--leftimg{
    //         //     width: 24px;
    //         //     height: 72px;
    //         //     background-image: url('../../assets/goods/discountleft.png');
    //         //     background-size: contain;
    //         //     background-repeat: no-repeat;
    //         // }
    //         // .coupon-detail--rightimg{
    //         //     width: 24px;
    //         //     height: 72px;
    //         //     background-image: url('../../assets/goods/discountright.png');
    //         //     background-size: contain;
    //         //     background-repeat: no-repeat;
    //         // }
    //         .coupon-detail--title{
    //             display: flex;
    //             align-items: center;
    //             width: 646px;
    //             height: 72px;
    //             background-image: url('../../assets/goods/discount.png');
    //             background-size: contain;
    //             background-repeat: no-repeat;
    //             .coupon-show--img{
    //                 width: 28px;
    //                 height: 28px;
    //                 background-image: url('../../assets/home/coupon1.png');
    //                 background-size: contain;
    //                 background-repeat: no-repeat;
    //                 margin-left: 31px;
    //             }
    //             .coupon-show--text{
    //                 color: #585858;
    //                 font-size: 22px;
    //                 margin-left: 12px;
    //             }
    //             .coupon-detail-dic{
    //                 flex: 1;
    //                 text-align: center;
    //             }
    //             .coupon-detail-frac{
    //                 color: #F06441;
    //                 font-size: 30px;
    //                 width: 20%;
    //             }
    //         }
    //     }
    //     .coupon-item{
    //         margin-right: 16px;
    //         font-size: 20px;
    //         font-weight: 400;
    //         color: #F06441;
    //         line-height: 72px;
    //         padding: 0 16px;
    //         position: relative;
    //         box-sizing: border-box;
    //         background: url('../../assets/goods/discountleft.png') no-repeat top left/24px 100%,
    //         url('../../assets/goods/商品详情备份 3@2x.png') no-repeat top center/calc(100% - 48px) 100%,
    //         url('../../assets/goods/discountright.png') no-repeat top right/24px 100%;
    //     }
    // }
    .coupon{
        display: flex;
        align-items: center;
        padding: 30px 24px;
        background-color: #fff;
        .coupon-title{
            font-size: 24px;
            font-weight: bold;
            color: #222222;
        }
        .coupon-content{
            width: 80%;
            display: flex;
            align-items: center;
            padding: 30px 23px;
            overflow-x: scroll;
            .coupon-list{
                display: flex;
                .coupon-item{
                    width: max-content;
                    margin-right: 16px;
                    font-size: 20px;
                    font-weight: 400;
                    color: #F06441;
                    line-height: 33px;
                    padding: 0 16px;
                    position: relative;
                    box-sizing: border-box;
                    background: url('../../assets/goods/商品详情备份@2x.png') no-repeat top left/8px 100%,
                    url('../../assets/goods/商品详情备份 3@2x.png') no-repeat top center/calc(100% - 14px) 100%,
                    url('../../assets/goods/商品详情备份 2@2x.png') no-repeat top right/8px 100%;
                }
            }
        }
    }

    .goods-tabs{
        margin-top: 20px;
        background-color: #fff;
        .data-info{
            padding: 37px 24px 0;
            min-height: 30vh;
            .title{
                font-size: 24px;
                font-weight: 400;
                color: #222222;
                margin-bottom: 26px;
            }
            .info{
                display: flex;
                font-size: 24px;
                font-weight: 400;
                color: #222222;
                margin-bottom: 26px;
                .quality-day{
                    margin-right: 100px;
                }
            }
        }
        .van-tab__panel{
            background-color: #fff;
        }
        :deep(.van-tabs__wrap){
            position: relative;
        }
        :deep(.van-tabs__wrap::after){
            border-bottom-width: 1px !important;
            position: absolute;
            box-sizing: border-box;
            content: " ";
            pointer-events: none;
            top: -50%;
            right: -50%;
            bottom: -50%;
            left: -50%;
            border: 0 solid #EEEEEE;
            transform: scale(.5);
        }
        :deep(.van-tabs__line){
            background: #F06441;
        }
    }
    .operation-height{
        width: 100%;
        height: 108px;
        padding-bottom: calc(8px + constant(safe-area-inset-bottom));
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
    }
    .operation{
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 24px 8px 0;
        box-shadow: 0px 1px 0px 0px #F5F5F5;
        background-color: #fff;
        padding-bottom: calc(8px + constant(safe-area-inset-bottom));
        padding-bottom: calc(8px + env(safe-area-inset-bottom));
        .icon-button{
            display: flex;
            .icon-button-item{
                text-align: center;
                margin-left: 46px;
                .icon--unselect{
                    font-size: 40px;
                }
                .text{
                    font-size: 20px;
                    font-weight: 400;
                    color: #222222;
                    line-height: 28px;
                    margin-top: 4px;
                }
            }
        }
        .van-button{
            width: 220px;
            height: 88px;
            border-radius: 16px;
            font-size: 30px;
            font-weight: bold;
            color: #FFFFFF;
        }
        .offShelf{
            opacity: 0.5;
        }
    }
    .off-shelf{
        width: 100%;
        height: 73px;
        font-size: 26px;
        font-weight: 400;
        color: #FFFFFF;
        background: rgba(0, 0, 0, 0.6);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 96px;
        text-align: center;
        line-height: 73px;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
    }
}
</style>
