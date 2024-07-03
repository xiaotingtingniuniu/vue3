<template>
    <div class="coupon-box" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="!isIos ? appBridge('goBack') : router.go(-1)">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="coupon-container" v-if="couponList">
            <van-radio-group v-model="checked">
                <template v-for="(item, index) in couponList" :key="index">
                    <div class="coupomn-box" @click="getCheckout(item)">
                        <div class="coupon-box-canleft">
                            <div>
                                <div class="price" v-if="item.couponType === 3">{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('折')) }}<span>折</span></div>
                                <div class="price" :class="getTextSize(item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('元')), item)" v-else><span>¥</span>{{ item.couponMinusViewName.slice(0, item.couponMinusViewName.indexOf('元')) }}</div>
                                <div class="name" v-if="item.couponType === 2">{{ item.couponViewName.slice(0, item.couponViewName.indexOf('减')) }}可用</div>
                                <div class="name" v-else>无门槛</div>
                            </div>
                        </div>
                        <div class="coupon-box-canright">
                            <div class="flex-bar">
                                <div class="title" v-if="item.couponType === 1">立减券</div>
                                <div class="title" v-else-if="item.couponType === 2">满减券</div>
                                <div class="title" v-else>折扣券</div>
                                <van-radio :name="item.couponCode" :disabled="item.status !== 2">
                                    <template #icon="check">
                                        <img class="img-icon" :src="check.checked ? activeIcon : (check.disabled ? disableIcon : inactiveIcon)" />
                                    </template>
                                </van-radio>
                            </div>
                            <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                            <div class="coupon-data coupon-rule" @click="ruleShow">使用规则
                                <van-icon name="arrow-up" />
                            </div>
                            <ul>
                                <li>{{item.couponDesc}}</li>
                            </ul>
                        </div>
                    </div>
                </template>
            </van-radio-group>
        </div>
    </div>
</template>
<script setup>
import { isApp, isIos } from '@/utils'
import { appBridge } from '@/utils/bridge'
const inactiveIcon = require('@/assets/images/cercle.png')
const activeIcon = require('@/assets/images/cercle-check.png')
const disableIcon = require('@/assets/shopping-cart/disableIcon.png')

const store = useStore()
const router = useRouter()
const couponList = computed(() => store.state.couponList)
const currentActiveCoupon = computed(() => store.state.currentActiveCoupon)

const checked = ref(null)
onMounted(() => {
    document.documentElement.scrollTo(0, 0)
    if (!couponList.value) return router.replace({ name: 'shopping-cart' })
    checked.value = currentActiveCoupon.value ? currentActiveCoupon.value.couponCode : null
})

// 选中
const getCheckout = (item) => {
    store.commit('setCurrentActiveCoupon', item)
    if (!isIos && isApp) {
        appBridge('goBack')
    } else {
        router.go(-1)
    }
}

const getTextSize = (text, item) => {
    if (text.length > 5 && text.length <= 7) {
        return 'midden-price'
    } else if (text.length > 8) {
        return 'small-price'
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
    background: #F7F7F7;
    .coupon-container{
        padding-top: 24px;
        .coupomn-box{
            background-image: url('../../assets/images/coupon-bg.png');
            background-size: 100% 100%;
            display: flex;
            padding: 30px 30px 30px 0;
            margin: 0 24px 24px;
            .coupon-box-canleft{
                width: 190px;
                color: #F16542;
                flex-wrap: wrap;
                display: flex;
                align-items: center;
                justify-content: center;
                .price{
                    font-size: 58px;
                    line-height: 58px;
                    font-weight: bold;
                    color: #F16542;
                    text-align: center;
                    span{
                        font-size: 28px;
                    }
                }
                .midden-price {
                    font-size: 38px;
                }
                .small-price {
                    font-size: 22px;
                }
                .name{
                    font-size: 22px;
                    font-weight: 400;
                    text-align: center;
                    color: #F16542;
                    line-height: 26px;
                    margin-top: 3px;
                }
            }
            .coupon-box-canright{
                flex: 1;
                margin-left: 36px;
                .flex-bar{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 23px;
                    .title{
                        font-size: 30px;
                        font-weight: bold;
                        color: #222222;
                        line-height: 30px;
                    }
                    .van-radio{
                        .img-icon{
                            width: 36px;
                            height: 36px;
                            display: block;
                        }
                    }
                }
                ul{
                    li{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 24px;
                        margin-bottom: 10px;
                    }
                }
                .coupon-data{
                    font-size: 20px;
                    color: #999999;
                    margin-top: 12px;
                }
                .coupon-rule{
                    // margin-top: 40px;
                    font-size: 24px;
                    margin: 41px 0px 14px 0px;
                }
            }
        }
    }

}
</style>
