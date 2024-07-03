<template>
    <div class="container-order-detail-page status-bar-height" v-if="detaildata">
        <van-nav-bar fixed z-index="10000" :style="{'background': `rgba(241, 101, 66, ${opacity})`}" :border="false">
            <template #title v-if="opacity >= 1">
                <!-- <div class="shop-title" v-if="detaildata.orderStatus===100 && detaildata.payStatus===1">补扣订单</div> -->
                <div class="shop-title" v-if="detaildata.orderStatus===100">扣款失败</div>
                <div class="shop-title" v-else-if="detaildata.orderStatus===600 ">已完成</div>
                <div class="shop-title" v-else-if="detaildata.orderStatus===800 ">已取消</div>
                <div class="shop-title" v-else>异常订单</div>
            </template>
            <template #left>
                <div class="icon--unselect back" @click="appBack">
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
                        <!-- <van-icon v-if="detaildata.orderStatus===100 && detaildata.payStatus===1" size="1em" :name="require(`@/assets/order/state700.png`)" /> -->
                        <van-icon v-if="detaildata.orderStatus===100" size="1em" :name="require(`@/assets/order/state800.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===600" size="1em" :name="require(`@/assets/order/state600.png`)" />
                        <van-icon v-else-if="detaildata.orderStatus===800" size="1em" :name="require(`@/assets/order/state800.png`)" />
                        <van-icon v-else size="1em" :name="require(`@/assets/order/error-icon.png`)" />
                    </div>
                    <!-- detaildata.orderStatus===100&&detaildata.payStatus===1 ? '补扣订单' :  -->
                    <div class="text">{{detaildata.orderStatus===100 ? '扣款失败' : detaildata.orderStatus===600 ? '已完成' : detaildata.orderStatus===800 ? '已取消' : '异常订单'}}</div>
                </div>
                <!-- <div class="order-state-content" v-if="detaildata.orderStatus===100 && detaildata.payStatus ===1">您有待支付的订单，请尽快支付，以免影响您再次购物，如有疑问，请联系客服</div> -->
                <div class="order-state-content" v-if="detaildata.orderStatus===100">您当前订单自动扣款失败，请手动支付，以免影响您再次购物，如有疑问，请联系客服</div>
                <div class="order-state-content" v-else-if="detaildata.orderStatus===600">本次购物结束，祝您购物愉快，如有疑问，请联系客服</div>
                <div class="order-state-content" v-else-if="detaildata.orderStatus===800">您本单未购物，已自动为您取消支付</div>
                <div class="order-state-content" v-else>订单识别失败，异常订单会影响您再次购物，请尽快联系客服处理</div>
            </div>

        </div>

        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="text-order">订单商品明细</div>
                </div>
                <div class="order-erro-img-box" v-if="detaildata.orderStatus===800">
                    <img class="order-erro-img" :src="require('@/assets/order/quxiao.png')" />
                    <div class="order-erro-text">暂无商品哦~</div>
                </div>
                <div class="order-erro-img-box" v-else-if="detaildata.orderStatus===900">
                    <img class="order-erro-img" :src="require('@/assets/order/error.png')" />
                    <div class="order-erro-text">订单异常,请尽快联系客服处理</div>
                </div>
                <div class="list-box" v-else>
                    <div class="goods-list" v-for="(item,index) in detaildata.goodsList.slice(0, showNum)" :key='index'>
                        <goodsitem-orderinfo :class="index === 0 ? '' : 'van-hairline--top'" :goodsInfo="item" />
                    </div>
                    <div class="button-box" v-if="commodityListnum>5">
                        <div v-if="detaildata.goodsList.length > 5" @click="changeShowNum">{{showNum === 5 ? '展示完整信息' : '收起完整信息'}} </div>
                        <img v-if="showNum === 5" :src="require('@/assets/order/down.png')"/>
                        <img v-else :src="require('@/assets/order/up.png')"/>
                    </div>

                </div>

            </div>

        </div>
        <div class="cell-group">
            <div class="card">
                <div class="group-title van-hairline--bottom">货柜信息</div>
                <div class="cell">
                    <div class="title">货柜编号</div>
                    <div class="content">{{detaildata.poiCode}}</div>
                </div>
                <div class="cell">
                    <div class="title">货柜地址</div>
                    <div class="content">{{detaildata.poiAddress}}</div>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card">
                <div class="group-title van-hairline--bottom">订单信息</div>
                <div class="cell">
                    <div class="title" v-if="detaildata.orderStatus===800">开门行为编号</div>
                    <div class="title" v-else>订单编号</div>
                    <div class="content-box">
                        <div class="content" id="form-tone">{{detaildata.orderNo}}</div>
                        <div class="copy-bader" @click="copyCode(detaildata.orderNo)">复制</div>
                    </div>
                </div>
                <div class="cell" v-if="detaildata.orderStatus===600&&detaildata.payType">
                    <div class="title">支付方式</div>
                    <div class="content">{{detaildata.payType===1?'微信支付':'免密支付'}}</div>
                </div>
                <div class="cell" v-if="detaildata.gmtCreate">
                    <div class="title">下单时间</div>
                    <div class="content">{{detaildata.gmtCreate.replace('T',' ')}}</div>
                </div>
                <div class="cell" v-if="detaildata.orderStatus===600&&detaildata.payTime">
                    <div class="title">支付时间</div>
                    <div class="content">{{detaildata.payTime.replace('T',' ')}}</div>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card">
                <div class="cell">
                    <div class="title">订单总价</div>
                    <div class="content">¥{{ (detaildata.payAmount / 100).toFixed(2) }}</div>
                </div>
                <div class="cell" v-if="detaildata.orderStatus===600&&detaildata.disctAmount">
                    <div class="title">优惠金额</div>
                    <div class="content">¥{{ (detaildata.disctAmount / 100).toFixed(2) }}</div>
                </div>
                <div class="cell" v-if="detaildata.orderStatus===600">
                    <div class="title">支付金额</div>
                    <div class="content">¥{{ (detaildata.totalAmount / 100).toFixed(2) }}</div>
                </div>
            </div>
        </div>
        <template v-if="detaildata.orderStatus===100 && detaildata.payType===1 || detaildata.orderStatus === 900 || detaildata.orderStatus === 600">
            <div class="button" :class="isApp ? 'is-app' : ''">
                <van-button v-if="detaildata.orderStatus === 900 || detaildata.orderStatus === 600" @click="showServiceActionSheet" round color="#F16642">联系客服</van-button>
                <van-button v-else-if="detaildata.payType===1" round color="#F16642" @click="pageGo(`/container-order-confirm/${props.appKey}/${props.busiCode}/${detaildata.orderNo}`)">确认订单</van-button>
            </div>
            <div class="button-height" :class="isApp ? 'is-app' : ''"></div>
        </template>
    </div>
</template>
<script setup>
import { Toast } from 'vant'
import { isApp } from '@/utils'
import { containerOrderDetail } from '@/api/container-shopping'
import { pageGo, pageBack, goMinePage } from '@/utils/composables'
import GoodsitemOrderinfo from '@/components/Goods/GoodsitemOrderinfo.vue'
import { appBridge } from '@/utils/bridge'

const store = useStore()
const token = computed(() => store.state.token)
const props = defineProps(['appKey', 'busiCode', 'orderNo', 'goMine'])

const showServiceActionSheet = () => appBridge('serviceActionSheet')

const showNum = ref(5)
const changeShowNum = () => {
    if (showNum.value === 5) return (showNum.value = detaildata.value.goodsList.length)
    showNum.value = 5
}

const appBack = () => {
    if (props.goMine) {
        goMinePage()
    } else {
        pageBack()
    }
}

onMounted(() => {
    watch([token], () => {
        if (token.value) getOrderConfig()
    })
    if (token.value) getOrderConfig()
})

const detaildata = ref(null)
const commodityListnum = ref('')
const getOrderConfig = async () => {
    const data = await containerOrderDetail({
        appKey: props.appKey,
        busiCode: props.busiCode,
        orderNo: props.orderNo
    })
    detaildata.value = data
    commodityListnum.value = detaildata.value.goodsList.length
}

const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 30
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})

// 复制订单编号
const copyCode = async (value) => {
    var cInput = document.createElement('input')
    cInput.value = value
    document.body.appendChild(cInput)
    cInput.select() // 选取文本框内容
    document.execCommand('copy')

    Toast('复制成功')
    // 复制成功后再将构造的标签 移除
    document.body.removeChild(cInput)
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
.container-order-detail-page{
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
            .text-order{
                height: 40px;
                font-size: 28px;
                font-weight: bold;
                color: #222222;
                line-height: 40px;
            }
        }
        .list-box{
            .goods-list{
                padding: 0 30px;
                .van-hairline--top:after{
                    border: 0 solid #F4F5F5 !important;
                }
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

        }

        .order-erro-img-box{
                margin:28px auto 36px auto;
                .order-erro-img{
                    width: 300px;
                    height: 202px;
                    background: #FFFFFF;
                    border-radius: 12px;
                    display:block;
                    margin:0 auto
                }
                .order-erro-text{
                    font-size: 26px;
                    font-weight: bold;
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
                font-weight: bold;
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
            .content-box{
                display:flex;
                justify-content: space-between;
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
