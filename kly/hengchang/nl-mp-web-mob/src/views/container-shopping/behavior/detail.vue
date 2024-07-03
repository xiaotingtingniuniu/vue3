<template>
    <div class="container-behavior-detail-page status-bar-height">
        <van-nav-bar fixed z-index="10000" :style="{'background': `rgba(241, 101, 66, ${opacity})`}"   :border="false">
            <template #title v-if="opacity >= 1">
                <div class="shop-title" v-if="orderStatus === 2">异常订单</div>
                <div class="shop-title" v-else>识别中...</div>
            </template>
            <template #left>
                <div class="icon--unselect back" @click="pageBack">
                    <van-image :src="require('@/assets/order/Rectangle @2x.png')"/>
                </div>
            </template>
            <template #right>
                <div class="icon--unselect kefu" @click="showServiceActionSheet">
                    <van-image :src="require('@/assets/order/kefuphone.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="order-state">
            <div class="order-state-tip">
                <div class="order-state-title">
                    <div class="icon--unselect">
                        <van-icon v-if="orderStatus === 2" size="1em" :name="require(`@/assets/order/error-icon.png`)" />
                        <van-icon v-else size="1em" :name="require(`@/assets/order/shibie.png`)" />
                    </div>
                    <div class="text" v-if="orderStatus === 2">异常订单</div>
                    <div class="text" v-else>识别中...</div>
                </div>
                <div class="order-state-content" v-if="orderStatus === 2">订单识别失败，异常订单会影响您再次购物，请尽快联系客服处理</div>
                <div class="order-state-content" v-else>当前订单正在结算中，请等待，如有疑问，请联系客服</div>
            </div>

        </div>

        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="text-order">购物商品明细</div>
                </div>
                <div class="order-erro-img-box" v-if="orderStatus === 1">
                    <img class="order-erro-img" :src="require('@/assets/order/shibie-bg.png')" />
                    <div class="order-erro-text">商品识别中...</div>
                </div>
                <div class="order-erro-img-box" v-else>
                    <img class="order-erro-img" :src="require('@/assets/order/error.png')" />
                    <div class="order-erro-text">订单异常,请尽快联系客服处理</div>
                </div>
            </div>

        </div>
        <div class="cell-group">
            <div class="card">
                <div class="group-title van-hairline--bottom">货柜信息</div>
                <div class="cell">
                    <div class="title">货柜编号</div>
                    <div class="content">{{ deviceCode }}</div>
                </div>
                <div class="address-content">
                    <div class="title address">货柜地址</div>
                    <div class="content address-text">{{ deviceAddress }}</div>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card" v-if="Number(props.status)===2">
                <div class="group-title van-hairline--bottom">订单信息</div>
                <div class="cell">
                    <div class="title">订单编号</div>
                    <div class="content-box">
                        <div class="content" id="form-tone">{{ orderNo }}</div>
                        <div class="copy-bader" @click="copyCode(orderNo)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</div>
                    </div>
                </div>
                <div class="cell">
                    <div class="title">下单时间</div>
                    <div class="content">{{ gmtCreate.replace('T',' ') }}</div>
                </div>
            </div>
            <div class="card" v-else>
                <div class="group-title">行为信息</div>
                <div class="cell">
                    <div class="title">开门行为编号</div>
                    <div class="content-box">
                        <div class="content" id="form-tone">{{ orderNo }}</div>
                        <div class="copy-bader" @click="copyCode(orderNo)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</div>
                    </div>
                </div>
                <div class="cell">
                    <div class="title">开门时间</div>
                    <div class="content">{{ gmtCreate.replace('T',' ') }}</div>
                </div>
            </div>
        </div>
        <template v-if="orderStatus === 2">
            <div class="button is-app">
                <a class="onlineservice" href="tel:400-085-5858">
                    <van-button round color="#F16642">联系客服</van-button>
                </a>
            </div>
            <div class="button-height is-app"></div>
        </template>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { pageBack } from '@/utils/composables'
import { appBridge } from '@/utils/bridge'
import Clipboard from 'clipboard'

const props = defineProps(['status'])
const route = useRoute()

const showServiceActionSheet = () => appBridge('serviceActionSheet')

const orderStatus = Number(props.status)
const orderNo = decodeURIComponent(route.query.orderNo)
const gmtCreate = decodeURIComponent(route.query.gmtCreate)
const deviceCode = decodeURIComponent(route.query.deviceCode)
const deviceAddress = decodeURIComponent(route.query.deviceAddress)

const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 30
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})
// 新复制订单编号(ios低版本bug)
const copyCode = async (value) => {
    const clipboard = new Clipboard('.copy-bader', {
        text: () => {
            return value
        }
    })
    clipboard.on('success', () => {
        Toast('复制成功')
        clipboard.destroy()
    })
    clipboard.on('error', () => {
        Toast('复制失败')
        clipboard.destroy()
    })
}
</script>
<style lang="scss" scoped>
.status-bar-height{
    .shop-title{
        font-size: 34px;
        font-weight: bold;
        color: #FFFFFF;
    }
    :deep(.van-nav-bar){
        padding-top: var(--van-status-bar-height);
        .back{
            .van-image{
                width: 20px;
                height: 35px;
            }
        }
        .kefu{
            .van-image{
                width: 34px;
                height: 40px;
            }
        }
    }
    :deep(.van-nav-bar::after){
        content: initial;
    }
}
.container-behavior-detail-page{
    padding-top: var(--van-status-bar-height);
    width: 100%;
    background-image: url('../../../assets/order/order-detail-bg.png');
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-color: #F7F7F7;
    .order-state{
        display: flex;
        align-items: center;
        padding: 113px 24px 24px;
        margin-bottom: 18px;
        .order-state-tip{
            flex: 1;
            margin-left: 24px;
            margin-right:24px;
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
                margin-top: 12px;
            }
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
        .shop-info-name:after{
            border: 0 solid #F4F5F5 !important;
        }
        .shop-info-name{
            display: flex;
            align-items: center;
            padding: 30px 30px 22px;
            border-bottom:1px solid #F4F5F5;
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
            .text-order{
                height: 40px;
                font-size: 28px;
                font-weight: 500;
                color: #222222;
                line-height: 40px;
            }
        }
        .order-erro-img-box{
            margin:28px auto 36px auto;
            .order-erro-img{
                width: 300px;
                height: 204px;
                background: #FFFFFF;
                border-radius: 12px;
                display:block;
                margin:0 auto
            }
            .order-erro-text{
                font-size: 26px;
                font-weight: 500;
                color: #222222;
                line-height: 37px;
                margin-top:45px;
                text-align:center
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
                color: #222222;
                padding: 8px 24px 24px;
                margin-bottom: 16px;
                font-weight: 500;
                border-bottom:1px solid #F4F5F5
            }
        }
        .address-content{
            padding: 16px 30px;
            display: flex;
            justify-content: space-between;
            font-size: 24px;
            color: #555555;
            .address{
                width: 200px;
            }
            .address-text{
                text-align: right;
                font-weight: bold;
                width: 0;
                flex: 1;
                word-break: break-all;
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
              line-height: 33px;
            }
            .address{
                width: 200px;
            }
            .address-text{
                text-align: right;
            }
            .content-box{
                display:flex;
                justify-content: space-between;
                align-items:center
            }

            .content{
                font-size: 24px;
                font-weight: bold;
                color: #555555;
                line-height: 33px;
                .van-icon{
                    color: #999999;
                }
            }
            .copy-bader{
                    font-size: 20px;
                    font-weight: 400;
                    color: #F06441;
                    line-height: 28px;
                    border-radius: 17px;
                    border: 1px solid #F06441;
                    padding:3px 14px;
                    margin-left:16px;
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
            border-radius: 16px;
            font-size: 32px;
            font-weight: bold;
            color: #FFFFFF;
        }
    }
    .button-height{
        width: 100%;
        height: 152px;
    }
}
</style>
