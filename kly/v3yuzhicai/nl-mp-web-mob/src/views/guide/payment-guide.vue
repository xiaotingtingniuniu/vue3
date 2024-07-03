<template>
    <div class="guide-page">
        <van-nav-bar fixed z-index="10000" :border="false">
            <template #left>
                <div class="icon--unselect back" @click="pageBack()">
                    <van-image :src="require('@/assets/order/Rectangle @2x.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="guide">
            <div class="guide-box">
                <div class="guide-head"></div>
                <div class="guide-content">
                    <div class="guide-content--title">购物引导流程</div>
                    <div class="guide-content--shopping">
                        <div class="guide-step">
                            <div class="guide-icon guide-iconone"></div>
                            <div class="guide-text">
                                <div class="text">第<span>1</span>步</div>
                                <div>使用恒生活智能柜需要开通支付分自助先购后付服务</div>
                            </div>
                        </div>
                        <div class="segmentation-line"></div>
                        <div class="guide-step">
                            <div class="guide-icon guide-icontwo"></div>
                            <div class="guide-text">
                                <div  class="text">第<span>2</span>步</div>
                                <div>开门成功后，选取产品，取货完成后关门</div>
                            </div>
                        </div>
                        <div class="segmentation-line"></div>
                        <div class="guide-step">
                            <div class="guide-icon guide-iconthree"></div>
                            <div class="guide-text">
                                <div  class="text">第<span>3</span>步</div>
                                <div>关门后自动结算</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="guide-content guide-top">
                    <div class="guide-content--title">注意事项</div>
                    <div class="guide-content--shopping">
                        <div class="metter-step metter-stepone">
                            <div class="metter-icon metter-iconone"></div>
                            <div class="guide-text">
                                恒生活智能柜使用智能识别技术，设备关门后，会自动识别所拿商品，并进行自动结算，如扣款失败，则会影响您的二次购物体验，所以请确保余额充足
                            </div>
                        </div>
                        <div class="metter-segmentation"></div>
                        <div class="metter-step">
                            <div class="metter-icon metter-icontwo"></div>
                            <div class="guide-text">
                                个别订单如出现识别异常，会出现需要您手动支付的情况，属正常情况
                            </div>
                        </div>
                        <div class="metter-segmentation"></div>
                        <div class="metter-step">
                            <div class="metter-icon metter-iconthree"></div>
                            <div class="guide-text">
                                请勿恶意破坏设备，否则我司将会保留追究您法律责任的权利
                            </div>
                        </div>
                        <div class="metter-segmentation"></div>
                        <div class="metter-step">
                            <div class="metter-icon metter-iconfour"></div>
                            <div class="guide-text">
                                请勿出现遮挡摄像头等违规操作，否则系统将会进行罚款处罚
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="button">
                    <van-button @click="authorizedPayment" round color="#F16642">同意开通支付分自助先购后付服务</van-button>
                </div>
                <div class="bottom-text">
                    <div class="icon"></div>
                    <div class="text">微信支付分</div>
                    <div class="segmentation"></div>
                    <div class="text">550分及以上优享</div>
                </div>
            </div>
            <div class="bottom-height"></div>
        </div>
    </div>
</template>
<script setup>
import { appBridge } from '@/utils/bridge'
import { pageBack } from '@/utils/composables'

const authorizedPayment = () => appBridge('authorizedPayment')

</script>
<style lang="scss" scoped>
.guide-page{
    .van-nav-bar{
        padding-top: var(--van-status-bar-height);
        background-color: transparent !important;
        .van-image{
            width: 20px;
            height: 35px;
        }
    }
    .guide{
        min-height: 100vh;
        background-image: url('../../assets/guide/payguide-bg.png');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: 0 -1px;
        .guide-box{
            margin: 0px 34px;
            .guide-head{
                height: 417px;
            }
            .guide-content{
                .guide-content--title{
                    display: flex;
                    align-items: center;
                    height: 68px;
                    padding-left: 32px;
                    background-image: url('../../assets/guide/guide-title.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                    color: #813927;
                    font-size: 28px;
                }
                .guide-content--shopping{
                    background-color: #FFFFFF;
                    border-top-right-radius: 16px;
                    border-bottom-left-radius: 16px;
                    border-bottom-right-radius: 16px;
                    .guide-step{
                        height: 168px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        .guide-icon{
                            width: 81px;
                            height: 81px;
                            margin: 0px 26px 0px 42px;
                        }
                        .guide-iconone{
                            background-image: url('../../assets/guide/payguide-icon1.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .guide-icontwo{
                            background-image: url('../../assets/guide/payguide-icon2.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .guide-iconthree{
                            background-image: url('../../assets/guide/payguide-icon3.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .guide-text{
                            flex: 1;
                            padding-right: 43px;
                            font-size: 26px;
                            .text{
                                margin-bottom: 7px;
                            }
                            span{
                                color: #F16642;
                            }
                        }
                    }
                    .segmentation-line{
                        width: 473px;
                        height: 1px;
                        background: #F0ECEC;
                        // opacity: 0.59;
                        margin-left: 145px;
                        transform: scaleY(0.5);
                    }
                    .metter-step{
                        height: 100px;
                        width: 100%;
                        display: flex;
                        padding-top: 38px;
                        // .guide-icon{
                        //     width: 81px;
                        //     height: 81px;
                        //     margin: 0px 26px 0px 42px;
                        //     background-image: url('../../assets/guide/payguide-icon1.png');
                        //     background-size: contain;
                        //     background-repeat: no-repeat;
                        // }
                        .metter-icon{
                            width: 45px;
                            height: 45px;
                            margin: 0px 26px 0px 42px;
                        }
                        .metter-iconone{
                            background-image: url('../../assets/guide/metter-icon1.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .metter-icontwo{
                            background-image: url('../../assets/guide/metter-icon2.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .metter-iconthree{
                            background-image: url('../../assets/guide/metter-icon3.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .metter-iconfour{
                            background-image: url('../../assets/guide/metter-icon4.png');
                            background-size: contain;
                            background-repeat: no-repeat;
                        }
                        .guide-text{
                            flex: 1;
                            padding-right: 43px;
                            font-size: 26px;
                            span{
                                color: #F16642;
                            }
                        }
                    }
                    .metter-segmentation{
                        margin-top: 10px;
                        width: 500px;
                        height: 1px;
                        background: #F0ECEC;
                        // opacity: 0.59;
                        margin-left: 122px;
                        transform: scaleY(0.5);
                    }
                    .metter-stepone{
                        height: 168px;
                    }
                }
            }
            .guide-top{
                margin-top: 30px;
            }
        }
        .bottom-height{
            width: 100%;
            height: 262px;
        }
        .bottom{
            height: 220px;
            background-color: #fff;
            box-shadow: 0px -2px 8px 0px rgba(0, 0, 0, 0.09);
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            .button{
                margin-top: 40px;
                padding: 0 100px;
                .van-button{
                    width: 100%;
                    height: 80px;
                    line-height: 80px;
                    background: #F16642;
                    font-size: 24px;
                    color: #FFFFFF;
                }
            }
            .bottom-text {
                margin-top: 22px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #666666;
                font-size: 22px;
                .icon{
                    width: 24px;
                    height: 24px;
                    margin-right: 6px;
                    background-image: url('../../assets/guide/wx.png');
                    background-size: contain;
                    background-repeat: no-repeat;
                }
                .segmentation{
                    width: 1px;
                    height: 22px;
                    background: #666666;
                    opacity: 0.59;
                    margin: 0 6px;
                }
            }
        }
    }
}
</style>
