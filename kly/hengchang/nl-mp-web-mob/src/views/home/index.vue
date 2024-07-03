<template>
    <div class="home-page">
        <!-- 没有定位权限 -->
        <template v-if="!locationPermission&&!counterInfo">
            <div :class="isApp ? 'status-bar-height' : ''">
                <div class="location">
                    <div class="location-main">
                        <router-link :to="{name: 'counter-map-index'}" custom v-slot="{ navigate }">
                            <div class="location-main--counter" @click="navigate">
                                <div class="title">未获取到定位信息</div>
                                <div class="icon--unselect">
                                    <van-icon size="1em" :name="require('@/assets/home/right-icon.png')" />
                                </div>
                            </div>
                        </router-link>
                        <div class="location-main--address">
                            <div class="icon--unselect">
                                <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                            </div>
                            <div class="text">点击开启位置信息, 纵享美味</div>
                        </div>
                    </div>
                    <van-button class="location-no-icon width172" @click="getCurrenLocation(true)" type="primary">
                        <div class="button-content">
                            <div class="text">立即开启</div>
                        </div>
                    </van-button>
                </div>
            </div>
        </template>
        <!-- 有定位权限 -->
        <template v-else>
            <!-- 有货柜 -->
            <template v-if="counterInfo">
                <div v-for="index in 2" :key="index" :class="isApp ? 'status-bar-height' : ''">
                    <div class="location" :class="index === 1 ? 'float-location' : ''">
                        <div class="location-main">
                            <router-link :to="{name: 'counter-map-index'}" custom v-slot="{ navigate }">
                                <div class="location-main--counter" @click="navigate">
                                    <div class="locotion-point">
                                        <div class="icon--unselect">
                                            <van-icon size="1em" :name="require('@/assets/home/selfpoint.png')" />
                                        </div>
                                        <div class="text">自提点</div>
                                    </div>
                                    <div class="title van-ellipsis">{{ counterInfo.name }}</div>
                                    <div class="status" v-if="counterInfo.statusDesc === '离线'">
                                        <div class="nostate">{{ counterInfo.statusDesc }}</div>
                                        <div class="icon--unselect">
                                            <van-icon size="1em" :name="require('@/assets/home/right-icon.png')" />
                                        </div>
                                    </div>
                                    <div class="status" v-else>
                                        <div class="state">{{ counterInfo.statusDesc }}</div>
                                        <div class="icon--unselect">
                                            <van-icon size="1em" :name="require('@/assets/home/right-icon2.png')" />
                                        </div>
                                    </div>
                                </div>
                            </router-link>
                            <div class="location-main--address">
                                <div class="icon--unselect">
                                    <div class="text">
                                        <van-icon size="1em" :name="require('@/assets/home/location-icon.png')" />
                                        <span>{{ formatDistance(counterInfo.distance) }}m</span>{{ counterInfo.address }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <van-button class="location-route-plan" @click="routePlan(counterInfo.name, `${counterInfo.latitude},${counterInfo.longitude}`, counterInfo.address)">
                            <div class="button-content">
                                <div class="icon--unselect">
                                    <van-icon size="1em" :name="require('@/assets/home/navigation-icon.png')" />
                                </div>
                                <div class="text">导航</div>
                            </div>
                        </van-button>
                    </div>
                </div>
            </template>

            <!-- 没有货柜 -->
            <div v-else :class="isApp ? 'status-bar-height' : ''">
                <div class="location">
                    <router-link :to="{name: 'counter-map-index'}" custom v-slot="{ navigate }">
                        <div class="location-main">
                            <div class="location-main--counter">
                                <div class="title" :style="{'maxWidth': 'max-content'}">无可用自提柜，请手动选择</div>
                            </div>
                        </div>
                        <van-button class="location-no-icon" type="primary" @click="navigate">选择自提柜</van-button>
                    </router-link>
                </div>
            </div>
        </template>
        <!-- banner -->
        <div class="banner">
            <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" lazy-render>
                <van-swipe-item>
                    <img class="swipe-img" :src="require('@/assets/home/banner.png')" />
                </van-swipe-item>
                <van-swipe-item>
                    <img class="swipe-img" :src="require('@/assets/home/banner2.png')" />
                </van-swipe-item>
            </van-swipe>
        </div>
        <!-- notice -->
        <div class="notice">
            <div class="icon--unselect">
                <van-icon size="1em" :name="require('@/assets/home/notice-icon.png')" />
            </div>
            <div class="text">
                简单加工即食, 吃出放心, 吃出健康, 人人轻松当大厨
            </div>
        </div>
        <!-- 推荐店铺 -->
        <div class="recommend-store" v-if="storeInfo">
            <van-image :src="storeInfo.storeLogo" radius="4">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
            <div class="recommend-store-main">
                <router-link :to="{name: 'store-map-index'}" custom v-slot="{ navigate }">
                    <div @click="navigate" class="recommend-store-main--name">
                        <div class="text van-ellipsis">{{ storeInfo.storeName }}</div>
                        <div class="click-tip icon--unselect">
                            <van-icon size="1em" :name="require('@/assets/home/right-icon2.png')" />
                        </div>
                    </div>
                </router-link>
                <div class="recommend-store-main--tip">当日{{storeInfo.cutOrderTime}}点前下单，次日{{storeInfo.orderArriveTime}}点前送餐入柜</div>
                <div class="recommend-store-main--tip">当日{{storeInfo.cutOrderTime}}点后下单，后天{{storeInfo.orderArriveTime}}点前送餐入柜</div>
            </div>
        </div>
        <!-- 优惠券 -->
        <div class="coupon" v-if="storeInfo && coupons.length">
            <div class="coupon-scroll-area">
                <div class="coupon-list">
                    <template v-for="(coupon, index) in coupons" :key="index">
                        <div class="coupon-item">
                            <div class="reduction" v-if="coupon.couponType === 3">{{ coupon.couponMinusViewName.slice(0, coupon.couponMinusViewName.indexOf('折')) }}<span>折</span></div>
                            <div class="reduction" v-else>{{ coupon.couponMinusViewName.slice(0, coupon.couponMinusViewName.indexOf('元')) }}<span>元</span></div>
                            <div class="desc" v-if="coupon.couponType === 2">{{ coupon.couponDoorViewName}}</div>
                            <div class="desc" v-else>无门槛</div>
                        </div>
                    </template>
                </div>
            </div>
            <van-button @click="availableBtn" :icon="require('@/assets/home/coupon-button-icon.png')">
                一键领取
            </van-button>
        </div>
        <!-- 无定位权限 -->
        <div class="no-authority" v-if="!locationPermission&& !counterInfo">
            <div class="no-authority-bg"></div>
            <div class="no-authority-tip">未获取到定位信息</div>
            <van-button @click="getCurrenLocation(true)">
                开启定位, 浏览美食
            </van-button>
        </div>
        <!-- 附近无自提柜 -->
        <div class="no-counter" v-if="locationPermission && !counterInfo">
            <div class="no-counter-bg"></div>
            <div class="no-counter-tip">附近无可用自提柜，请重新选择自提柜</div>
            <router-link :to="{name: 'counter-map-index'}" custom v-slot="{ navigate }">
                <van-button block color="linear-gradient(270deg, #F16542 0%, #E35A37 100%)" type="primary" @click="navigate">
                    重新选择自提柜
                </van-button>
            </router-link>
        </div>
        <!-- 商品列表 -->
        <div class="hot-sale" v-if="counterInfo&&hotList.length">
            <div class="box-title">
                <div class="box-title--label">
                    <div class="label">热销菜品</div>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/hot-icon.png')" />
                    </div>
                </div>
                <div class="box-title--more">
                    <router-link :to="{name: 'menu'}" custom v-slot="{ navigate }">
                        <div class="label" @click="navigate">查看更多</div>
                    </router-link>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/more-icon.png')" />
                    </div>
                </div>
            </div>
            <div class="goods-list">
                <template v-for="(item, index) in hotList" :key="index">
                    <goods-item @cliadd="cartAddFn" @clickItem="clickItemFn(item)" sales :goodsInfo="item" :index="index+1">剩余 {{item.stock}}</goods-item>
                </template>
            </div>
        </div>
        <div class="new-goods" v-if="counterInfo&&newList.length">
            <div class="box-title">
                <div class="box-title--label">
                    <div class="label">新品上架</div>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/new-icon.png')" />
                    </div>
                </div>
                <div class="box-title--more">
                    <router-link :to="{name: 'menu'}" custom v-slot="{ navigate }">
                        <div class="label" @click="navigate">查看更多</div>
                    </router-link>
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/home/more-icon.png')" />
                    </div>
                </div>
            </div>
            <div class="goods-list">
                <template v-for="(item, index) in newList" :key="index">
                    <goods-item @cliadd="cartAddFn" @clickItem="clickItemFn(item)" sales :goodsInfo="item">剩余 {{ formatNum(item.stock) }}</goods-item>
                </template>
            </div>
        </div>
    </div>
    <coupon-overlay v-if="coupons.length" :visible="couponOverlayVisible" @close="closeCouponOverlay" />
</template>
<script setup>
import { shopIndexSku } from '@/api/home'
import { cartAdd } from '@/api/shopping-cart'
import { unclaimedCoupon, allreceiveCoupon } from '@/api/coupon'
import GoodsItem from '@/components/Goods/GoodsItem.vue'
import CouponOverlay from './components/Overlay/CouponOverlay.vue'
import { getCurrenLocation } from '@/utils/location'
import { formatNum, formatDistance, isApp } from '@/utils'
import { routePlan } from '@/utils/composables'
import { Toast } from 'vant'

const store = useStore()
const router = useRouter()
const locationPermission = computed(() => store.state.locationPermission)
const counterInfo = computed(() => store.state.counterInfo)
const storeInfo = computed(() => store.state.storeInfo)
const userInfo = computed(() => store.state.userInfo)
const carChoose = computed(() => store.state.carChoose)
// const images = ref([
//     'https://img.yzcdn.cn/vant/apple-1.jpg',
//     'https://img.yzcdn.cn/vant/apple-2.jpg'
// ])
watch([storeInfo], () => getshopIndexSku())
watch([storeInfo, userInfo], () => {
    if (storeInfo.value && userInfo.value) {
        couponList()
    }
})
onMounted(() => {
    if (storeInfo.value && (!hotList.value.length || !newList.value.length)) getshopIndexSku()
    if (storeInfo.value && userInfo.value) couponList()
})

const hotList = ref([])
const newList = ref([])
const getshopIndexSku = async () => {
    const res = await shopIndexSku({
        storeId: storeInfo.value.id
    })
    hotList.value = res.hotSku || []
    newList.value = res.newestSku || []
}
const clickItemFn = item => {
    router.push({ name: 'goods-detail', params: { id: item.id } })
}
const cartAddFn = async (skuId, quantity, num) => {
    if (num === 99 && quantity === 1) return Toast('已经是最大可购买数量了')
    const code = await cartAdd({
        storeId: storeInfo.value.id,
        skuId: skuId,
        quantity
    })
    if (code === 200) {
        await getshopIndexSku()
        if (quantity > 0) {
            store.commit('setcarChoose', [...carChoose.value, skuId])
        }
    } else if (code === 509) {
        Toast('已经是最大可购买数量了')
    }
}

// header
const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = (scrollTop - 52) / 50
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})

// 优惠券领取
const couponOverlayVisible = ref(false) // 优惠券领取提示是否可见
const closeCouponOverlay = () => {
    couponOverlayVisible.value = false
}

const coupons = ref([])
const couponList = async () => {
    const data = await unclaimedCoupon({ shopCode: storeInfo.value.id, landingPageKey: 'dict_app_home_page' })
    // const resultdata = ref([])
    // data.map(item => {
    //     if (item.couponType === 2) resultdata.value = [...resultdata.value, item]
    //     return item
    // })
    coupons.value = data || []
}
// 批量领取优惠券
const availableBtn = async () => {
    const Codes = []
    for (var i = 0; i < coupons.value.length; i++) {
        const objs = {}
        objs.batchCode = coupons.value[i].batchCode
        objs.userRangeType = coupons.value[i].userRangeType
        objs.singleUserMaxNum = coupons.value[i].singleUserMax
        Codes.push(objs)
    }
    const data = await allreceiveCoupon({
        shopCode: storeInfo.value.id,
        batchCodes: Codes
    })
    console.log(data)
    couponOverlayVisible.value = true
}

</script>
<style lang="scss" scoped>
.home-page{
    min-height: calc(100vh - 148px);
    background-image: url('../../assets/home/home-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    .float-location{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        opacity: v-bind(opacity);
        z-index: 101;
        background-color: #fff;
    }
    .status-bar-height{
        .location{
            padding-top: var(--van-status-bar-height);
        }
    }
    .location{
        min-height: 86px;
        display: flex;
        align-items: center;
        padding: 0 24px;
        .location-main{
            flex: 1;
            padding: 9px 0;
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
                        margin: 0px 4px 0px 8px;
                    }
                    .text{
                        padding-right: 8px;
                    }
                }
                .title{
                    max-width: 300px;
                    width: max-content;
                    font-size: 34px;
                    font-weight: bold;
                    color: #222222;
                    margin-right: 7px;
                }
                .status{
                    display: flex;
                    .state{
                        font-size: 24px;
                        font-weight: bold;
                        color: #F16542;
                        line-height: 24px;
                        padding: 5px 6px;
                        border-radius: 6px;
                        border: 1px solid #F16542;
                        margin-right: 16px;
                    }
                    .nostate{
                        font-size: 24px;
                        font-weight: bold;
                        color: #AAAAAA;
                        line-height: 24px;
                        padding: 5px 6px;
                        border-radius: 6px;
                        border: 1px solid #AAAAAA;
                        margin-right: 16px;
                    }
                    .icon--unselect{
                        font-size: 14px;
                    }
                }
            }
            .location-main--address{
                display: flex;
                align-items: center;
                color: #828080;
                margin-top: 5px;
                .icon--unselect{
                    font-size: 23px;
                    margin-right: 6px;
                    display: flex;
                    align-items: baseline;
                    .van-icon{
                        margin-right: 6px;
                        position: relative;
                        top: 3px;
                    }
                    .text{
                        width: 500px;
                        font-size: 24px;
                        margin-top: 5px;
                        margin-left: 10px;
                        span{
                            margin-right: 10px;
                            font-family: 'DIN Alternate Bold';
                        }
                    }
                }
            }
        }
        .location-no-icon{
            font-size: 28px;
            word-break: keep-all;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            height: 56px;
            background: linear-gradient(270deg, #F46844 0%, #E35A37 100%);
            border-radius: 28px;
        }
        .width172{
            width: 172px !important;
        }
        .location-route-plan{
            width: 100px;
            height: 45px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
            border-radius: 28px;
            font-size: 20px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            word-break: keep-all;
            .button-content{
                display: flex;
                align-items: center;
            }
            .icon--unselect{
                font-size: 18px;
                height: 18px;
                margin-right: 10px;
            }
        }
    }
    .banner{
        height: 288px;
        margin: 33px 24px 0;
        .my-swipe{
            height: 100%;
            width: 100%;
            border-radius: 16px;
            .swipe-img{
                height: 100%;
                width: 100%;
                background-size: contain;
            }
            :deep(.van-swipe__indicator){
                width: 14px;
                height: 10px;
                background: #FFFFFF;
                border-radius: 5px;
                opacity: 0.69;
            }
            :deep(.van-swipe__indicator--active){
                width: 20px;
                opacity: 1;
            }
        }
        .van-image{
            width: 100%;
            height: 100%;
        }
    }
    .notice{
        display: flex;
        align-items: center;
        height: 76px;
        margin: 19px 24px 0;
        background-image: url('../../assets/home/notice-bg.png');
        background-size: 100% 100%;
        padding-left: 24px;
        .icon--unselect{
            font-size: 30px;
            margin-right: 16px;
        }
        .text{
            font-size: 24px;
            font-weight: 400;
            color: #BE815D;
        }
    }
    .recommend-store{
        margin: 20px 24px 0;
        padding: 24px;
        background-color: #fff;
        border-radius: 12px;
        display: flex;
        align-items: center;
        .van-image{
            width: 100px;
            height: 100px;
            margin-right: 20px;
        }
        .recommend-store-main{
            .recommend-store-main--name{
                display: flex;
                .text{
                    max-width: 450px;
                    font-size: 32px;
                    font-weight: bold;
                    color: #222222;
                    margin-right: 13px;
                    margin-right: 20px;
                }
                .click-tip{
                    font-size: 14px;
                }
            }
            .recommend-store-main--tip{
                font-size: 22px;
                line-height: 25px;
                font-weight: 400;
                color: #AB9F9F;
                margin-top: 10px;
            }
        }
    }
    .coupon::after{
        content: '';
        width: 34px;
        height: 94px;
        background: linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%);
        opacity: 0.5;
        filter: blur(0px);
        position: absolute;
        top: 24px;
        right: 0;
        z-index: 1;
    }
    .coupon{
        position: relative;
        margin: 0 24px;
        padding: 24px 0;
        background-color: #fff;
        border-radius: 12px;
        .coupon-scroll-area{
            width: 100%;
            overflow-x: scroll;
            .coupon-list{
                padding-left: 12px;
                padding-right: 24px;
                width: max-content;
                display: flex;
                .coupon-item{
                    width: 150px;
                    height: 94px;
                    padding-right: 28px;
                    margin-left: 12px;
                    background-image: url('../../assets/home/coupon-bg.png');
                    background-size: contain;
                    text-align: center;
                    .reduction{
                        font-size: 38px;
                        font-weight: bold;
                        color: #E24017;
                        margin-top: 10px;
                        span{
                            font-size: 22px;
                            font-weight: bold;
                            color: #E24017;
                            margin-left: 2px;
                        }
                    }
                    .desc{
                        font-size: 22px;
                        font-weight: 400;
                        color: #DD7838;
                    }
                }
            }
        }
        .van-button{
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: bold;
            color: #FFFFFF;
            width: -webkit-fill-available;
            margin: 30px 24px 0;
            height: 88px;
            border-radius: 16px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
        }
    }
    .no-authority{
        margin: 20px 24px 0;
        padding: 24px 0;
        background-color: #fff;
        border-radius: 12px;
        .no-authority-bg{
            width: 301px;
            height: 201px;
            background-image: url('../../assets/home/no-authority-bg.png');
            background-size: 100% 100%;
            margin: 54px auto 0;
        }
        .no-authority-tip{
            font-size: 26px;
            font-weight: bold;
            color: #222222;
            margin-top: 46px;
            text-align: center;
        }
        .van-button{
            width: -webkit-fill-available;
            margin: 50px 24px 0;
            height: 88px;
            border-radius: 16px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
            color: #fff;
        }
    }
    .no-counter{
        margin: 20px 24px 0;
        padding: 24px 0;
        background-color: #fff;
        border-radius: 12px;
        .no-counter-bg{
            width: 301px;
            height: 201px;
            background-image: url('../../assets/home/no-counter-bg.png');
            background-size: 100% 100%;
            margin: 54px auto 0;
        }
        .no-counter-tip{
            font-size: 26px;
            font-weight: bold;
            color: #222222;
            margin-top: 46px;
            text-align: center;
        }
        .van-button{
            width: -webkit-fill-available;
            margin: 50px 24px 0;
            height: 88px;
            border-radius: 16px;
            background: linear-gradient(270deg, #F16542 0%, #E35A37 100%);
            color: #fff;
        }
    }
    .hot-sale{
        margin: 20px 24px 0;
        padding: 26px 28px 32px;
        background-color: #fff;
    }
    .new-goods{
        margin: 20px 24px 50px;
        padding: 26px 28px 32px;
        background-color: #fff;
    }
    // 复用
    .box-title{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .box-title--label{
            display: flex;
            align-items: center;
            .label{
                font-size: 34px;
                font-weight: bold;
                color: #222222;
                margin-right: 6px;
            }
            .icon--unselect{
                font-size: 60px;
                height: 30px;
            }
        }
        .box-title--more{
            display: flex;
            align-items: center;
            .label{
                font-size: 26px;
                line-height: 26px;
                font-weight: 400;
                color: #999999;
                margin-right: 7px;
            }
            .icon--unselect{
                font-size: 15px;
            }
        }
    }
    .goods-list{
        .goods-item{
            margin-top: 28px;
        }
    }
}
</style>
