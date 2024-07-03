<template>
    <div class="container-order-detail-page status-bar-height" v-if="detaildata">
        <van-nav-bar fixed :style="{'background': `rgba(241, 101, 66, ${opacity})`}" :border="false">
            <template #title v-if="opacity >= 1">
                <div class="shop-title" v-if="detaildata.refundStatus===1 || detaildata.refundStatus===2">退款处理中...</div>
                <div class="shop-title" v-else-if="detaildata.refundStatus===3 ">退款成功</div>
                <div class="shop-title" v-else>退款失败</div>
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
                        <van-icon v-if="detaildata.refundStatus===1 || detaildata.refundStatus===2" size="1em" :name="require(`@/assets/order/state100.png`)" />
                        <van-icon v-else-if="detaildata.refundStatus===3" size="1em" :name="require(`@/assets/order/state600.png`)" />
                        <van-icon v-else size="1em" :name="require(`@/assets/order/state800.png`)" />
                    </div>
                    <div class="text">{{(detaildata.refundStatus===1 || detaildata.refundStatus===2) ? '退款处理中...' : detaildata.refundStatus===3 ? '退款成功' : '退款失败'}}</div>
                </div>
            </div>

        </div>
        <div class="cell-group">
            <div class="card">
                <div class="cell">
                    <div class="content-step">
                        <div class="step-progress">
                            <div class="step-finish"></div>
                            <div class="step-line"></div>
                            <div class="step-start"></div>
                        </div>
                        <div class="step-content">
                            <div class="step1">
                                <div class="step-one">
                                    <div class="text-tep1" v-if="detaildata.auditStatus===1">等待商家处理</div>
                                    <div class="text-tep1" v-else-if="detaildata.auditStatus===2">退款申请已同意</div>
                                    <div class="text-tep1" v-else>退款申请已被拒绝</div>
                                    <div class="text-tep2">{{detaildata.refManageTime ? detaildata.refManageTime.replace('T',' ') : detaildata.refApplyTime.replace('T',' ')}}</div>
                                </div>
                                <div class="text-tep2" v-if="detaildata.auditStatus===1">商家正在处理中，请您耐心等候</div>
                                <div class="text-tep2" v-else-if="detaildata.auditStatus===2">退款￥{{(detaildata.refActAmt / 100).toFixed(2)}}将返回至您的原支付账户，请您在1-7工作日内注意查收,部分退款，已使用的优惠券不做退还处理</div>
                                <div class="text-tep2" v-else>{{detaildata.rejectReason}}</div>
                            </div>
                            <div class="step">
                                <div class="step-one">
                                    <div class="text-tep1">退款已受理</div>
                                    <div class="text-tep2">{{detaildata.refApplyTime.replace('T',' ')}}</div>
                                </div>
                                <div class="text-tep2">退款申请已处理</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="settlement">
            <div class="card">
                <div class="shop-info-name van-hairline--bottom">
                    <div class="text-order">退款信息</div>
                </div>
                <div class="list-box">
                    <div class="goods-list" v-for="(item,index) in detaildata.refundGoodList.slice(0, showNum)" :key='index'>
                        <goodsitem-orderinfo :class="index === 0 ? '' : 'van-hairline--top'" :goodsInfo="item" />
                    </div>
                    <div class="button-box" v-if="commodityListnum>5">
                        <div v-if="detaildata.refundGoodList.length > 5" @click="changeShowNum">{{showNum === 5 ? '展示完整信息' : '收起完整信息'}} </div>
                        <img v-if="showNum === 5" :src="require('@/assets/order/down.png')"/>
                        <img v-else :src="require('@/assets/order/up.png')"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="cell-group--money">
            <div class="card">
                <div class="cell-one">
                    <div class="title">申请退款金额</div>
                    <div class="content">¥{{ (detaildata.refShouldAmt / 100).toFixed(2) }}</div>
                </div>
                <div class="cell-two" v-if="detaildata.refundStatus===3">
                    <div class="title">实际退款金额</div>
                    <div class="content">¥{{ (detaildata.refActAmt / 100).toFixed(2) }}</div>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card">
                <div :class="detaildata.remark ? 'group-type' : 'group-type--no'">
                    <div>退款类型</div>
                    <div class="group-text">{{detaildata.refundReasonType=== 1 ? '商品/包装破损' : detaildata.refundReasonType=== 2 ? '商品变质' : detaildata.refundReasonType=== 3 ? '订单金额有误' : detaildata.refundReasonType=== 4 ? '手动补扣' : '其他'}}</div>
                </div>
                <div class="group-content" v-if="detaildata.remark">
                    <div class="title">{{detaildata.remark}}<span @click="ShowAll"></span></div>
                </div>
            </div>
        </div>
        <div class="cell-group">
            <div class="card">
                <div class="group-type">补充凭证</div>
                <div :class="previewArray && previewArray.length === 4 ? 'cell-img' : 'cell-img--no'">
                    <img
                        class="img"
                        width="69"
                        height="69"
                        fit="cover"
                        v-for="(item, index) in previewArray"
                        :key="index"
                        :src="item"
                        @click="openImg(index)"
                    />
                </div>
            </div>
        </div>
        <div class="button-height is-app"></div>
    </div>
</template>
<script setup>
import { ImagePreview } from 'vant'
import { orderProgress } from '@/api/container-shopping'
import { pageBack } from '@/utils/composables'
import GoodsitemOrderinfo from '@/components/Goods/GoodsitemOrderinfo.vue'
import { appBridge } from '@/utils/bridge'
import ImagePreviewClose from '@/assets/images/ImagePreviewClose.png'

const store = useStore()
const token = computed(() => store.state.token)
const props = defineProps(['refundNo', 'orderNoSub'])

const showServiceActionSheet = () => appBridge('serviceActionSheet')

const showNum = ref(5)
const changeShowNum = () => {
    if (showNum.value === 5) return (showNum.value = detaildata.value.refundGoodList.length)
    showNum.value = 5
}

onMounted(() => {
    watch([token], () => {
        if (token.value) getOrderProgress()
    })
    if (token.value) getOrderProgress()
})

const detaildata = ref(null)
const commodityListnum = ref('')
const previewArray = ref([])
const getOrderProgress = async () => {
    const data = await orderProgress({
        refundNo: props.refundNo,
        orderNoSub: props.orderNoSub,
        sourceType: 3
    })
    detaildata.value = data
    commodityListnum.value = detaildata.value.refundGoodList.length
    previewArray.value = detaildata.value.applyAttachmentList
}

const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 30
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})
const openImg = (index) => {
    ImagePreview({
        images: previewArray.value,
        closeable: true,
        startPosition: index,
        showIndex: true,
        closeIconPosition: 'top-left',
        teleport: '.container-order-detail-page',
        closeIcon: ImagePreviewClose
    })
}
</script>
<style lang="scss">
.container-order-detail-page{
    // .van-overlay{
    //     top: var(--van-status-bar-height);
    //     height: calc(100% - var(--van-status-bar-height));
    // }
    .van-image-preview{
        top: var(--van-status-bar-height);
        height: calc(100% - var(--van-status-bar-height));
        .van-image-preview__swipe{
            height: calc(100% - 96px);
            margin-top: 96px;
        }
        .van-icon__image{
            width: 35px;
            height: 34px;
        }
    }
}
</style>
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
            margin-right:24px;
            .order-state-title{
                display: flex;
                // align-items: center;
                .icon--unselect{
                    font-size: 48px;
                    margin-right: 11px;
                }
                .text{
                    flex: 1;
                    font-size: 42px;
                    font-weight: bold;
                    color: #FFFFFF;
                }
                .detail{
                    width: 164px;
                    height: 54px;
                    line-height: 54px;
                    border: 1px solid #fff;
                    border-radius: 30px;
                    font-size: 24px;
                    text-align: center;
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
                font-weight: bold;
                color: #222222;
                line-height: 40px;
            }
        }
        .list-box{
            .goods-list{
                padding: 0 30px;
                .van-hairline--top:after{
                    border-bottom: 1px solid #F4F5F5 !important;
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
                margin: 36px auto;
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
    .cell-group--money{
        margin-top: 20px;
        .card{
            padding: 24px 24px;
            .cell-one{
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .cell-two{
                padding-top: 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .title{
              font-size: 24px;
              font-weight: 400;
              color: #222222;
              font-weight: bold;
              line-height: 33px;
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
                border-bottom:1px solid #F4F5F5
            }
            .group-type{
                display: flex;
                justify-content: space-between;
                font-size: 28px;
                color: #222222;
                padding: 8px 24px 24px;
                margin-bottom: 16px;
                font-weight: bold;
                border-bottom:1px solid #F4F5F5
            }
            .group-type--no{
                display: flex;
                justify-content: space-between;
                font-size: 28px;
                color: #222222;
                padding: 16px 30px;
                font-weight: bold;
            }
            .group-content{
                margin: 36px 24px;
                padding: 26px;
                border-radius: 6px;
                background-color: #FAFAFA;
                color: #555555;
                font-size: 24px;
            }
            .group-text{
                color: #555555;
                font-weight: bold;
            }
        }
        .cell{
            padding: 24px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title{
              font-size: 24px;
              font-weight: 400;
              color: #222222;
              font-weight: bold;
              line-height: 33px;
            }
            .content-box{
                display:flex;
                justify-content: space-between;
                align-items:center;
            }
            .content-step{
                width: 100%;
                color: #222222;
                display: flex;
                .step-progress{
                    width: 34px;
                    margin-right: 20px;
                    display: flex;
                    flex-direction: column;
                    .step-finish{
                        width: 34px;
                        height: 34px;
                        background-image: url('../../../assets/order/progress-icon2.png');
                        background-size: 100% auto;
                        background-repeat: no-repeat;
                    }
                    .step-line{
                        width: 1px;
                        height: 126px;
                        background: #FE7E41;
                        margin-left: 16.5px;
                        transform: scaleY(0.5);
                        flex: 1;
                    }
                    .step-start{
                        width: 34px;
                        height: 34px;
                        background-image: url('../../../assets/order/progress-icon1.png');
                        background-size: 100% auto;
                        background-repeat: no-repeat;
                        margin-bottom: 33px;
                    }
                }
                .step-content{
                    flex: 1;
                    .step1{
                        min-height: 100px;
                        margin-bottom: 50px;
                    }
                    .step-one{
                        display: flex;
                        justify-content: space-between;
                        font-size: 26px;
                        font-weight: none;
                        .text-tep1{
                            flex: 1;
                            color: #222222;
                        }
                        .text-tep2{
                            color: #999999;
                            font-size: 24px;
                        }
                    }
                    .text-tep2{
                        color: #999999;
                        font-size: 24px;
                    }
                }
            }
            .content-progress{
                width: 100%;
                color: #222222;
                :deep(.van-step__circle-container){
                    width: 34px;
                    height: 34px;
                }
                :deep(.van-icon__image){
                    width: 34px;
                    height: 34px;
                }
                :deep(.van-step--vertical .van-step__line){
                    background-color: #FE7E41;
                    height: 60%;
                    top: 70px;
                }
                :deep(.van-step--vertical .van-step--process){
                    margin-bottom: 10px;
                }
                :deep(.van-step__title .van-step__title--active){
                    padding-bottom: 10px;
                }
                :deep(.van-step--vertical){
                    border-bottom-style: none;
                }
                .content-progress--text{
                    .text-tep{
                        display: flex;
                        justify-content: space-between;
                        font-size: 26px;
                        .text-tep1{
                            flex: 1;
                            color: #222222;
                        }
                    }
                    .text-tep2{
                        color: #999999;
                        font-size: 24px;
                    }
                }
                .content-progress--one{
                    min-height: 130px;
                    height: max-content;
                }
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
            .van-image{
                // width: 138px;
                // height: 138px;
                // border-radius: 8px;
            }
        }
        .cell-img{
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .img{
                width: 138px;
                height: 138px;
                border-radius: 8px;
            }
        }
        .cell-img--no{
            padding: 16px 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .img{
                width: 138px;
                height: 138px;
                border-radius: 8px;
                margin-right: 34px;
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
