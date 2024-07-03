<template>
    <div class="pay-result-new" v-if="pageData">
        <div class="pay-result">
            <van-nav-bar v-if="opacity>0" fixed z-index="10000" :style="{'background': `rgba(241, 101, 66, ${opacity})`}" :border="false">
                <template #title v-if="opacity >= 1">
                    <div class="shop-title">支付完成</div>
                </template>
            </van-nav-bar>
            <div class="tip--success">
                <div class="tip">
                    <div class="icon--unselect">
                        <van-image :src="require('@/assets/order/state600.png')"/>
                    </div>
                    <div class="tip-content">
                        <div>支付完成</div>
                        <div class="tip-btn" @click="goHomePage2">返回首页</div>
                    </div>
                </div>
                <div class="pay-amount">支付金额：{{ pageData.totalAmount / 100 }}</div>
                <div class="pay-time" v-if="pageData.payTime">支付时间：{{ pageData.payTime.replace('T',' ') }}</div>
            </div>
        </div>
        <div class="goods-box">
            <div class="title van-hairline--bottom">订单商品明细</div>
            <div class="goods-list" v-for="(item,index) in list.slice(0, showNum)" :key='index'>
                <goodsitem-orderinfo :class="index === 0 ? '' : 'van-hairline--top'" :goodsInfo="item" />
            </div>
            <div class="button-line" v-if="list.length > 5">
                <van-button round plain hairline @click="changeShowNum">
                    <template #default>
                        <div class="button-content">
                            <div>{{ showNum===5 ?  '展示完整信息' : '收起完整信息'}}</div>
                            <div class="icon--unselect">
                                <van-image v-if="showNum===5" :src="require('@/assets/order/arrow-down.png')"/>
                                <van-image v-else :src="require('@/assets/order/up.png')"/>
                            </div>
                        </div>
                    </template>
                </van-button>
            </div>
        </div>
        <div class="button-box" :class="isApp ? 'is-app' : ''">
            <van-button @click="pageGo(`/container-order-detail/${props.appKey}/${props.busiCode}/${props.orderNo}/1`)" round color="#F06441">查看订单</van-button>
        </div>
        <div class="button-height" :class="isApp ? 'is-app' : ''"></div>
    </div>
</template>
<script setup>
import { isApp } from '@/utils'
import { pageGo, goHomePage2 } from '@/utils/composables'
import { appBridge, registerhandler } from '@/utils/bridge'
import { containerOrderDetail } from '@/api/container-shopping'
import GoodsitemOrderinfo from '@/components/Goods/GoodsitemOrderinfo.vue'

const props = defineProps(['appKey', 'busiCode', 'orderNo'])
const store = useStore()
const token = computed(() => store.state.token)

onMounted(() => {
    if (token.value) containerOrderDetailFn()
    watch([token], () => {
        if (token.value) containerOrderDetailFn()
    })
})

// 展开 / 收起
const showNum = ref(5)
const changeShowNum = () => {
    if (showNum.value > 5) return (showNum.value = 5)
    showNum.value = list.value.length
}

const list = ref(null)
const pageData = ref(null)
const containerOrderDetailFn = async () => {
    const data = await containerOrderDetail({
        appKey: props.appKey,
        busiCode: props.busiCode,
        orderNo: props.orderNo
    })
    console.log(data)
    pageData.value = data
    list.value = data.goodsList
}

// 安卓物理返回 回到首页
registerhandler('h5PageBack', () => appBridge('useCoupon'))

// 页面滑动导航渐变
const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 30
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})

</script>
<style lang="scss" scoped>
.pay-result-new{
    min-height: 100vh;
    background-image: url('../../../assets/order/order-detail-bg.png');
    background-size: contain;
    background-repeat: no-repeat;
    .pay-result{
        padding-top: var(--van-status-bar-height);
        :deep(.van-nav-bar){
            background: transparent;
        }
        .van-nav-bar{
            padding-top: var(--van-status-bar-height);
            .shop-title{
                font-size: 34px;
                font-weight: bold;
                color: #FFFFFF;
            }
        }
        .tip{
            display: flex;
            align-items: center;
            padding: 47px 48px 0;
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
    .goods-box{
        margin: 40px 24px 44px;
        padding-bottom: 36px;
        background-color: #fff;
        border-radius: 12px;
        .title{
            font-size: 28px;
            font-weight: bold;
            color: #222222;
            padding: 24px;
        }
        .goods-list{
            padding: 0 24px;
        }
        .button-line{
            margin-top: 8px;
            text-align: center;
            .van-button{
                width: 260px;
                height: 50px;
                border-radius: 30px;
                border: 1px solid #E4E4E4;
                color: #222222;
                font-size: 22px;
                font-weight: 400;
                line-height: 50px;
                .button-content{
                    display: flex;
                    .icon--unselect{
                        margin-left: 16px;
                        .van-image{
                            width: 14px;
                            height: 8px;
                        }
                    }
                }
            }
        }
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
