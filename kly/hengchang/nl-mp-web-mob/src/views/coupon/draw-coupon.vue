<template>
    <div class="coupon-box" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="pageBack">
                    <van-image :src="require('@/assets/order/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="coupon-container">
            <div class="coupon-box-can" v-if="unclaimedList.length">
                <div class="title-top">可领取</div>
                <div class="coupomn-box" v-for="(item, index) in unclaimedList" :key="item.name">
                    <div class="coupon-box-canleft">
                        <div>
                            <div class="price"><span class="unit">¥</span><span>{{ item.maxMinusAmount/100 }}</span></div>
                            <div class="name">满{{ item.doorsillAmount/100 }}元减</div>
                        </div>
                    </div>
                    <div class="coupon-box-canright">
                        <div class="flex-bar">
                            <div class="title">满减券</div>
                            <van-button @click="drowCouponFn(item, index)">领取</van-button>
                        </div>
                        <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                        <div class="coupon-data coupon-rule" @click="ruleShow">使用规则
                            <van-icon name="arrow-down" />
                        </div>
                        <ul>
                            <li>{{item.couponDesc}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div v-if="receivedList.length">
                <div class="title-top">已领取</div>
                <div class="coupomn-box" v-for="(item, index) in receivedList" :key="index">
                    <div class="coupon-box-canleft">
                        <div>
                            <div class="price"><span>¥</span>{{ item.maxMinusAmount/100 }}</div>
                            <div class="name">满{{ item.doorsillAmount/100 }}元减</div>
                        </div>
                    </div>
                    <div class="coupon-box-canright">
                        <div class="flex-bar">
                            <div class="title title-use">满减券</div>
                        </div>
                        <div class="coupon-data">有效期： {{item.useBeginDate}} 至 {{item.useEndDate}}</div>
                        <div class="coupon-data coupon-rule" @click="ruleShow">使用规则
                            <van-icon name="arrow-down" />
                        </div>
                        <ul>
                            <li>{{item.couponDesc}}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { unclaimedCoupon, drawoneCoupon, receivedCoupon } from '@/api/coupon/index'
import { isApp } from '@/utils'
import { pageBack } from '@/utils/composables'

const props = defineProps(['storeId', 'goodsId'])
// 待领取 / 已领取
const unclaimedList = ref([])
const receivedList = ref([])
const store = useStore()
const token = computed(() => store.state.token)

onMounted(() => {
    if (token.value) {
        couponList()
        receivedcouponList()
    }
    watch([token], () => {
        if (token.value) {
            couponList()
            receivedcouponList()
        }
    })
})

// 待领取领取优惠券
const couponList = async () => {
    const params = { shopCode: props.storeId }
    const data = await unclaimedCoupon(params)
    const resultdata = ref([])
    data.map(item => {
        if (item.couponType === 2) resultdata.value = [...resultdata.value, item]
        return item
    })
    unclaimedList.value = resultdata.value
}
// 已领取优惠券
const receivedcouponList = async () => {
    const data = await receivedCoupon()
    const resultdata = ref([])
    data.map(item => {
        if (item.couponType === 2) resultdata.value = [...resultdata.value, item]
        return item
    })
    receivedList.value = resultdata.value
}

// 领取
const drowCouponFn = async (item, index) => {
    const params = {
        shopCode: props.storeId,
        cdkey: '',
        couponBatchCode: item.batchCode,
        userRangeType: item.userRangeType,
        singleUserMaxNum: item.singleUserMax
    }
    const { code } = await drawoneCoupon(params)
    if (code === 220106) {
        Toast('优惠券已失效')
        await window.location.reload()
    }
    if (code !== 200) return false
    if (code === 220106) return window.location.reload()
    Toast('已领取, 结算时可使用')
    receivedList.value.unshift(unclaimedList.value[index])
    unclaimedList.value.splice(index, 1)
}
const ruleResult = ref(false)
const ruleShow = () => {
    ruleResult.value = !ruleResult.value
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
    // height: 100vh;
    .coupon-container{

        .title-top{
            font-size: 34px;
            color: #222222;
            line-height: 34px;
            padding-top:37px;
            padding-left: 19px;
            font-weight: bold;
        }
        .coupomn-box{
            background-image: url('../../assets/images/coupon-bg.png');
            background-size: 100% 100%;
            display: flex;
            padding: 30px 30px 30px 0;
            margin: 24px 24px 0;
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
                    .unit{
                        font-size: 28px;
                    }
                }
                .name{
                    font-size: 26px;
                    font-weight: 400;
                    color: #F16542;
                    line-height: 26px;
                    margin-top: 3px;
                    text-align: center;
                }
            }

            .coupon-box-canright{
                flex: 1;
                margin-left: 36px;
                .flex-bar{
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    .title{
                        font-size: 30px;
                        color: #222222;
                        line-height: 30px;
                        font-weight: bold;
                    }
                    .title-use{
                        margin-bottom: 23px;
                    }
                    .van-button{
                        width: 110px;
                        height: 60px;
                        background: #F16542;
                        border-radius: 16px;
                        font-size: 24px;
                        font-weight: bold;
                        border: initial;
                        word-break: keep-all;
                        color: #FFFFFF;
                    }
                    .img-box{
                            width: 92px;
                            height: 92px;
                            display: block;
                        img{
                            width: 100%;
                            height: 100%;
                        }
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
                ul{
                    li{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                        line-height: 24px;
                        margin-bottom: 10px;
                    }
                }
            }

        }
    }
}

</style>
