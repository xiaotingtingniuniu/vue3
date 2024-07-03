<template>
    <div class="orderDetailsBox">
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <header class="header">
            <nav class="header-nav">
                <!-- <div class="back-icon" @click="closePage"></div> -->
                <div class="title-box">
                    <div v-if="orderInfo.opendoorInfo.processStatus === '600'" class="icon success-icon"></div>
                    <div v-else class="icon warning-icon"></div>
                    <div class="title-content">
                        <div class="status">{{orderInfo.opendoorInfo.processName}}</div>
                        <div v-if="orderInfo.opendoorInfo.errorName" class="desc">{{orderInfo.opendoorInfo.errorName}}</div>
                    </div>
                </div>
            </nav>
            <div class="refund-btn" v-if="orderInfo.identificationRefund" @click="afterSales(orderInfo.orderInfo.orderNoSub, orderInfo.refundInfo.refundNo)">查看</div>
        </header>
        <div class="returnDoods-header" v-if="orderDetail.operateBtn">
            <div class="returnDoods-top">
                <div class="returnDoods-top-test">
                    <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
                    <div class="refuseTop">{{orderDetail.orderInfo?orderDetail.orderInfo.orderStatus:''}}</div>
                </div>
                <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">{{orderDetail.operateBtn?orderDetail.operateBtn.btnName:''}}</van-button>
            </div>
            <div class="returnDoods-bottom">
                <div class="refuseBottun">{{orderDetail.operateBtn?orderDetail.operateBtn.btnRemark:''}}</div>
            </div>
        </div>
        <div class="orderDetailsTop">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    购物信息
                </div>
            </div>
            <div class="videoContent" v-if="orderInfo.videoList?.length">
                <div class="shoppingVideo" v-for="(item,index) in orderInfo.videoList" :key="index">
                    <div class="videxBox">
                        <div class="video-tip">
                            <span>{{orderInfo.opendoorInfo.doorTypeName === '单门' ? '' : orderInfo.opendoorInfo.doorTypeName}}</span>
                            <span>{{orderInfo.opendoorInfo.applyCode}}</span>
                        </div>
                        <video :src="item" controls='controls'></video>
                    </div>
                </div>
            </div>
            <div class="default-videoContent videoContent" v-else>
                <div class="shoppingVideo">
                    <div class="videxBox">
                        <div class="content">
                            <van-icon :name="warningIcon"></van-icon>
                            <span class="text">视频加载失败</span>
                        </div>
                    </div>
                </div>
            </div>
            <template v-if="goodsList.length">
                <div class="goods-list">
                    <div class="goods-item" v-for="goods in goodsList" :key="goods.skuOrderNo">
                        <div class="goods-item-img">
                            <!-- <img :src="goods.skuUrl + 1" alt=""> -->
                            <van-image
                                fit="contain"
                                :loading-icon="errorImage"
                                :error-icon="errorImage"
                                :src="goods.skuUrl"
                            />
                        </div>
                        <div class="goods-item-content">
                            <div class="goods-title van-ellipsis">{{goods.skuName}}</div>
                            <div class="goods-type" v-if="goods.storageStyleCode === 'freeze'"></div>
                            <div class="goods-price">¥{{(goods.realPrice / 100).toFixed(2)}}</div>
                        </div>
                        <div class="goods-item-count">
                            <div class="">{{goods.doorTypeName === '单门' ? '' : goods.doorTypeName}}</div>
                            <div class="">x {{goods.quantity}}</div>
                        </div>
                    </div>
                </div>
            </template>
            <div class="transverse"></div>
            <template v-if="orderInfo.orderInfo?.goodsList?.length">
                <div v-if="orderInfo.orderInfo.goodsList?.length > 2" :class="goodsList?.length > 2 ? 'rotate down-icon' : 'down-icon'" @click="moreGoods"></div>
            </template>
            <div class="videoContent" v-if="orderDetail.orderInfo">
                <div class="shoppingVideo" v-for="(item,index) in orderDetail.orderInfo.buyVideoUrls" :key="index">
                    <video class="videxBox" :src="item" controls='controls'></video>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    购买数量
                </div>
                <div class="orderRight">
                    共{{orderInfo.orderInfo?.totalQuantity || 0}}件
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单金额
                </div>
                <div class="orderRight">
                    ￥{{((orderInfo.orderInfo?.totalAmount || 0)/100).toFixed(2)}}元
                </div>
            </div>
            <div class="order">
                <div class="orderLeft coupon" @click="couponDetail">
                    <div class="coupon-text">优惠券</div>
                    <div class="coupon-question"></div>
                </div>
                <div class="orderRight" v-if="orderInfo.orderInfo?.couponList?.length">
                    ￥{{(orderInfo.orderInfo.couponList[0].usedAmount / 100).toFixed(2)}}元
                </div>
                <div class="orderRight" v-else>￥0.00元</div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    应付金额
                </div>
                <div class="orderRight">
                    ￥{{((orderInfo.orderInfo?.payAmount || 0) / 100).toFixed(2)}}元
                </div>
            </div>

        </div>
        <!--订单信息  -->
        <div class="orderDetailsTop">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    订单信息
                </div>
                <!-- 当订单为手动创建的补扣订单时，显示查看原订单 -->
                <div v-if="orderInfo.opendoorInfo?.haveOriginalOrder">
                    <span class="originalBox" @click="goOrder(orderInfo.opendoorInfo?.originalApplyCode)">查看原订单</span>
                    <img src="../../../assets/replenishmentImg/arrow@2x.png" alt="" class="originalImg">
                </div>
            </div>
            <div class="transverse"></div>
            <div class="order">
                <div class="orderLeft">
                    开门记录
                </div>
                <div class="orderNum">
                    <div id="form-tone" class="copy-left">{{orderInfo.opendoorInfo.applyCode}}</div>
                    <van-button v-if="orderInfo.opendoorInfo.applyCode" class="copyBox copy-bader"  @click="copyCode(orderInfo.opendoorInfo.applyCode)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单编号
                </div>
                <div class="orderNum">
                    <div id="form-tone" class="copy-left">{{orderInfo.orderInfo.orderNoSub}}</div>
                    <van-button v-if="orderInfo.orderInfo.orderNoSub" class="copyBox copy-bader"  @click="copyCode(orderInfo.orderInfo.orderNoSub)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    支付方式
                </div>
                <div class="orderRight">
                    {{orderInfo.opendoorInfo.payTypeName}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    用户手机号
                </div>
                <div class="orderRight">
                    {{orderInfo.opendoorInfo.userMobile}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    业务单号
                </div>
                <div class="orderRight">
                    {{orderInfo.orderInfo.businessOrderNo}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    申请开门时间
                </div>
                <div class="orderRight">
                    {{orderInfo.orderInfo.applyOpenTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    货柜开门时间
                </div>
                <div class="orderRight">
                    {{orderInfo.opendoorInfo.openTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单付款时间
                </div>
                <div class="orderRight">
                    {{orderInfo.opendoorInfo.payTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    购物结束时间
                </div>
                <div class="orderRight">
                    {{orderInfo.opendoorInfo.endTime}}
                </div>
            </div>
        </div>
        <!-- 设备信息 -->
        <div class="card" @click="equipmentBtn()">
            <div class="card-left">设备信息</div>
            <div class="card-content number">{{orderInfo.orderInfo?.deviceDto.deviceNo}}</div>
            <div class="card-right">{{orderInfo.orderInfo?.deviceDto.deviceKindName}}</div>
        </div>
        <!-- 异常审核 -->
        <div class="card" v-if="orderInfo.opendoorInfo?.haveWorkOrder" @click="processBtn()">
            <div class="card-left">售后信息</div>
            <div class="card-content number">{{orderInfo.exceptionInfo?.workStartTime}}</div>
            <div class="card-right" v-if="orderInfo.exceptionInfo?.workStatus === 0">待处理</div>
            <div class="card-right" v-if="orderInfo.exceptionInfo?.workStatus === 1">已完成</div>
            <div class="card-right" v-if="orderInfo.exceptionInfo?.workStatus === 2">已取消</div>
        </div>
        <div class="nobutton" v-if="!orderInfo.identificationError"></div>
        <div class="empty" v-if="orderInfo.identificationError"></div>
        <div class="empty-120 van-safe-area-bottom"></div>
        <footer class="supplementary-order-footer van-safe-area-bottom" v-if="orderInfo.orderInfo?.noShoppingBtn || orderInfo.orderInfo?.manualOrderBtn">
            <div class="btn-container">
                <span v-if="orderInfo.orderInfo?.noShoppingBtn" @click="notShopping">无购物</span>
                <span v-if="orderInfo.orderInfo?.manualOrderBtn" @click="newPage(`/supplementary-order-work/${props.applyCode}/${props.orderNoSub}`)">手动下单</span>
            </div>
        </footer>
        <template v-if="!loading">
            <div class="bottom-button" v-if="orderInfo.identificationError">
                <van-button @click="newPage(`/supplementary-order/${props.applyCode}/${props.orderNoSub}`)" type="warning">商品识别错误</van-button>
            </div>
        </template>
        <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }">
            <div class="pay-plan">
                <div class="pay-sure">
                    <div class="pay-fixed">
                        <div class="pay-title">
                            <div class="close" @click="closeBtn"></div>
                            <div class="text">优惠券信息</div>
                            <div class="sure"></div>
                        </div>
                    </div>
                </div>
                <div class="pay-coupon">
                    <div class="coupon">
                        <div class="name">优惠券ID</div>
                        <div class="text" v-if="orderInfo.orderInfo.couponList?.length">{{orderInfo.orderInfo.couponList[0].couponCode}}</div>
                        <div class="text" v-else>无</div>
                    </div>
                    <div class="coupon">
                        <div class="name">优惠券状态</div>
                        <!-- 券状态 1:已使用,2:已退回 -->
                        <div class="text" v-if="orderInfo.orderInfo.couponList?.length">{{orderInfo.orderInfo.couponList[0].couponStatus===1?'已使用':'已退回'}}</div>
                        <div class="text" v-else>无</div>
                    </div>
                    <div class="coupon">
                        <div class="name">使用金额</div>
                        <div class="text" v-if="orderInfo.orderInfo.couponList?.length">
                            ¥{{(orderInfo.orderInfo.couponList[0].usedAmount / 100).toFixed(2)}}
                        </div>
                        <div class="text" v-else>0.00元</div>
                    </div>
                    <div class="coupon">
                        <div class="name">使用时间</div>
                        <div class="text" v-if="orderInfo.orderInfo.couponList?.length">{{orderInfo.orderInfo.couponList[0].usedTime}}</div>
                        <div class="text" v-else>无</div>
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import { getSaleOrderDetailV10, noShopping } from '@/api/order.js'
import Clipboard from 'clipboard'
import errorImage from '../../../assets/img-error.png'
import { newPage, closePage } from '@/utils/composables'
import warningIcon from '../../../assets/warning-icon1.png'
// 返回上一级
const props = defineProps(['orderNoSub', 'applyCode'])
const orderDetail = ref({})
const loading = ref(true)
const orderInfo = ref({
    exceptionInfo: null,
    opendoorInfo: {
        applyCode: '', // 开门记录
        userMobile: '', // 用户手机号
        startTime: '', // 申请开门时间
        openTime: '', // 货柜开门时间
        endTime: '' // 购物结束时间
    },
    videoList: [],
    orderInfo: {
        deviceDto: {
            deviceNo: '',
            deviceName: ''
        },
        orderStatus: '',
        totalQuantity: 0,
        payAmount: 0, // 应付金额
        totalAmount: 0 // 订单金额
    },
    refundInfo: {
        refundNo: ''
    },
    identificationError: true,
    identificationRefund: false
})
const goodsList = ref([])
const goOrder = (code) => {
    newPage(`/salesOrders/detail/null/${code}?showNavbar=0`)
}
// 新复制订单编号(ios低版本bug)
const copyCode = async (value) => {
    const clipboard = new Clipboard('.copyBox', {
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
onMounted(() => {
    getOrderDetail()
})
// 监听h5页面后台运行 再打开后刷新当前数据
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible') {
        await getOrderDetail()
    }
})

// 详情
const orderState = ref('')
const applycode = ref('')
const ordernosub = ref('')
const getOrderDetail = async () => {
    const param = {
        applyCode: props.applyCode,
        orderNoSub: props.orderNoSub === 'null' ? '' : props.orderNoSub
    }
    loading.value = true
    const res = await getSaleOrderDetailV10(param)
    loading.value = false
    if (res.code === '200') {
        // orderInfo.value = res.data
        Object.assign(orderInfo.value, res.data)
        orderState.value = res.data.orderInfo?.orderStatus
        goodsList.value = res.data.orderInfo?.goodsList?.length ? res.data.orderInfo.goodsList.slice(0, 2) : []
        applycode.value = res.data.opendoorInfo?.applyCode
        ordernosub.value = res.data.orderInfo?.orderNoSub
        // totalList.value = res.data.orderItemsInfo.goodsList
    }
}

const moreGoods = () => {
    if (goodsList.value.length > 2) {
        goodsList.value = orderInfo.value.orderInfo.goodsList.length ? orderInfo.value.orderInfo.goodsList.slice(0, 2) : []
    } else {
        goodsList.value = orderInfo.value.orderInfo.goodsList.length && orderInfo.value.orderInfo.goodsList
    }
}

const afterSales = (orderNoSub, refundNo) => {
    newPage(`/afterDetails/${orderNoSub}/${refundNo}?showNavbar=0`)
    // router.push({
    //     // path: '/afterDetails?showNavbar=0',
    //     name: 'afterDetails',
    //     params: {
    //         orderNoSub: orderNoSub,
    //         refundNo: refundNo
    //     },
    //     query: {
    //         showNavbar: 0
    //     }
    // })
}
const equipmentBtn = (orderNoSub, applyCode) => {
    newPage(`/equipmentDetails/${props.applyCode}/${props.orderNoSub}`)
}
const processBtn = () => {
    if (orderInfo.value.exceptionInfo === null) return
    newPage(`/abnormalProcess/${applycode.value}/${ordernosub.value}`)
}

const show = ref(false)
const couponDetail = () => {
    show.value = true
}
const closeBtn = () => {
    show.value = false
}

// 无购物
const notShopping = () => {
    Dialog.confirm({
        title: '完成异常处理',
        message: '是否确认处理结果？',
        confirmButtonColor: '#FE7E41',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        getContaniner: '.pirce-change'
    }).then(async () => {
        const res = await noShopping({ workNumber: orderInfo.value.orderInfo.workNumber })
        if (res.code === '200') {
            Toast('操作成功')
            const timer = setTimeout(() => {
                clearTimeout(timer)
                getOrderDetail()
            })
        } else {
            Toast(res.message)
        }
    })
}

</script>
<style lang="scss" scoped>
.orderDetailsBox{
    position: relative;
    background: #F4F5F5;
    min-height: 100vh;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        display: block;
        height: 520px;
        width: 100%;
        background: url('~@/assets/detail-head-bg.png') no-repeat;
        background-size: 100% 100%;
    }
    .van-nav-bar__placeholder{
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
    .header {
        position: relative;
        padding-top: 80px;
        padding-bottom: 72px;
        box-sizing: border-box;
        background: transparent;
        &-nav {
            position: relative;
            display: flex;
            justify-content: center;
            height: 88px;
            .back-icon {
                position: absolute;
                top: 28px;
                left: 24px;
                width: 20px;
                height: 34px;
                background: url('~@/assets/back-icon1.png') no-repeat;
                background-size: 100% 100%;
            }
            .title-box {
                display: flex;
                .icon {
                    margin-top: 16px;
                    margin-right: 16px;
                    width: 50px;
                    height: 50px;
                }
                .success-icon {
                    background: url('~@/assets/success-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .warning-icon {
                    background: url('~@/assets/warning-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
                .title-content {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .status {
                        height: 50px;
                        font-size: 36px;
                        font-family: PingFangSC-Medium, PingFang SC;
                        font-weight: 500;
                        color: #FFFFFF;
                        line-height: 50px;
                    }
                    .desc {
                        height: 34px;
                        font-size: 24px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 34px;
                    }
                }
            }
        }
        .refund-btn{
            padding: 0 20px;
            margin: 30px auto 0;
            width: 100px;
            border-radius: 34px;
            font-size: 24px;
            font-weight: 500;
            border-radius: 20px;
            text-align: center;
            line-height: 40px;
            border: 1px solid #fff;
            color: #fff;
        }
    }
    .refundBut{
        height: 62px;
        background: #FFFFFF;
        border-radius: 34px;
        font-size: 24px;
        font-weight: 500;
        color: #FE7E41;
        margin-top: 50px;
        margin-left: 15px !important;

    }
    .returnDoods-header{
        height: 185px;
        background: linear-gradient(#FE7E41 0%, #FF5C0E 100%);
        .returnDoods-top{
            display: flex;
            justify-content: space-between;
            justify-items: center;
            .returnDoods-top-test{
                display: flex;
                // justify-content: flex-end;
                .refundImg{
                    width: 50px;
                    height: 50px;
                    margin-left: 40px;
                    margin-top: 40px;
                }
                .refuseTop{
                    margin-left: 16px;
                    margin-top: 40px;
                    font-size: 36px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #FFFFFF;
                }
            }
            .refundBut{
            height: 62px;
            background: #FFFFFF;
            border-radius: 34px;
            font-size: 24px;
            font-weight: 500;
            color: #FE7E41;
            margin-top: 24px;
            margin-right: 30px;

        }

        }
        .returnDoods-bottom{
            font-size: 26px;
                font-weight: 400;
                color: #FFFFFF;
                margin-top: 8px;
                margin-left: 106px;
        }
    }
    .informationBox{
        display: flex;
        padding-top: 26px;
    }
    .informationTitle{
        font-size: 30px;
        font-weight: bold;
        color: #191919;
        margin-left: 20px;
    }
    .line{
        width: 10px;
        height: 28px;
        background: #FE7E41;
        display: block;
        margin-top: 6px;
    }
    .originalBox{
        font-size: 26px;
        font-weight: 400;
        color: #FE7E41;
        margin-left: 346px;
    }
    .transverse{
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #F2F6F9;
        margin-top: 17px;
    }
    .down-icon {
        margin: 22px auto 0;
        width: 32px;
        height: 32px;
        background: url('~@/assets/down-icon.png') no-repeat;
        background-size: 100% 100%;
    }
    .rotate {
        transform: rotate(180deg);
    }
    .orderDetailsTop{
        position: relative;
        width: 690px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
        padding-bottom: 30px;
        .informationTitle{
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            margin-left: 20px;
        }
        .originalImg{
            width: 24px;
            height: 24px;
            margin-left: 10px;
            margin-top: 6px;
        }
        .order{
            display: flex;
            justify-content:space-between;
            margin-top: 16px;
            padding-left: 30px;
            padding-right: 30px;
            .orderLeft{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
            }
            .orderRight{
                font-size: 26px;
                font-weight: 400;
                color: #191919;
            }
            .orderNum{
                font-size: 26px;
                font-weight: 400;
                color: #191919;
                display: flex;
                .copy-left{
                    padding-right: 21px;
                }
                .copyBox{
                    width: 70px;
                    height: 34px;
                    font-size: 24px;
                    font-weight: 400;
                    color: #FE7E41;
                    background: #FFF5F0;
                    border-radius: 17px;
                    text-align: center;
                    margin-left: 10px;
                }
                .van-button--normal{
                    padding: 0px !important;
                }
            }
            .coupon{
                display: flex;
                align-items: center;
                .coupon-text{
                    margin-right: 5px;
                }
                .coupon-question{
                    width: 26px;
                    height: 26px;
                    background: url('~@/assets/newquestion.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
        }
        .video{
            font-size: 26px;
            font-weight: 400;
            color: #999999;
            margin-left: 30px;
            margin-top: 25px;
        }
        .videoContent{
            overflow: hidden;
            overflow-x: scroll;
            display: flex;
            .shoppingVideo{
                width: 600px;
                height: 300px;
                margin-left: 30px;
                margin-top: 20px;
                .videxBox{
                    position: relative;
                    width: 600px;
                    height: 300px;
                    border-radius: 8px;
                    object-fit: fill;
                    .video-tip {
                        display: flex;
                        justify-content: space-between;
                        position: absolute;
                        z-index: 9;
                        top: 0;
                        left: 0;
                        right: 0;
                        padding: 12px 28px;
                        height: 28px;
                        font-size: 20px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #EBEBEB;
                        line-height: 28px;
                    }
                    video {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
        .default-videoContent {
            .videxBox {
                background: #CCCCCC;
                border-radius: 8px;
                .content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    .van-icon {
                        width: 60px;
                        height: 60px;
                        :deep(.van-icon__image) {
                            width: 100%;
                            height: 100%;
                        }
                    }
                    .text {
                        margin-top: 16px;
                        font-size: 28px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #FFFFFF;
                        line-height: 40px;
                    }
                }
            }
        }
    }
    .card{
        position: relative;
        margin: 20px auto ;
        padding: 20px 30px;
        display: flex;
        width: 690px;
        box-sizing: border-box;
        border-radius: 8px;
        background: #fff;
        line-height: 42px;
        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 28px;
            display: block;
            width: 10px;
            height: 28px;
            background: #FE7E41;
        }
        &-left {
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
        }
        &-content {
            flex: 1;
        }
        &-right {
            margin-right: 28px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FF2442;
            &::after {
                content: '';
                position: absolute;
                right: 30px;
                top: 26px;
                display: block;
                width: 16px;
                height: 28px;
                background: url('~@/assets/back-icon-order.png') no-repeat;
                background-size: 100% 100%;
                transform: rotate(180deg);
            }
        }
        .number {
            margin-left: 16px;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
        }
        .outside{
            display: flex;
            justify-content: space-between;
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            margin-top: 20px;
            .withinLeft{
                color: #999999;
                margin-left: 30px;
            }
            .withinRight{
                width: 470px;
                color: #191919;
                margin-right: 30px;
                text-align: right;
            }
        }
    }
    .moneyBox{
        width: 11px;
        height: 13px;
        margin-right: 5px;
        margin-top: 5px;
    }
    .goods-list {
        // margin-top: 20px;
        padding: 0 30px;
        .goods-item {
            margin-top: 20px;
            display: flex;
            &-img {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                }
                .van-image {
                    width: 100%;
                    height: 100%;
                    border-radius: 8px;
                    :deep(.van-icon__image) {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
            &-content {
                margin: 0 16px;
                flex: 1;
                .goods-title {
                    width: 376px;
                    height: 36px;
                    font-size: 26px;
                    font-family: PingFangSC-Medium, PingFang SC;
                    font-weight: 500;
                    color: #191919;
                    line-height: 36px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .goods-type {
                    width: 116px;
                    height: 32px;
                    background: url('../../../assets/freeze-icon.png') no-repeat 100% 100%;
                }
                .goods-price {
                    margin-top: 16px;
                    height: 30px;
                    font-size: 22px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FF6115;
                    line-height: 30px;
                }
            }
            &-count {
                div {
                    margin: 0 30px 0 0;
                    height: 36px;
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #191919;
                    line-height: 36px;
                }
            }
        }
    }
    .empty {
        height: 180px;
    }
    .nobutton{
        height: 100px;
    }
    .bottom-button {
        position: fixed;
        bottom: 76px;
        left: 60px;
        right: 60px;
        .van-button {
            width: 630px;
            height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            color: #fff;
        }
    }
    .pay-plan{
        // padding: 30px 50px 30px 50px;
        // border-bottom: 1px solid #F2F6F9;
        .pay-sure{
            height: 104px;
        }
        .pay-fixed{
            position: fixed;
            left: 0;
            right: 0;
            background-color: #FFFFFF;
            height: 104px;
            z-index: 99999;
        }
        .pay-coupon{
            padding: 32px 50px;
            .coupon{
                font-size: 26px;
                padding-bottom: 16px;
                display: flex;
                justify-content: space-between;
                .name{
                    color: #999999;
                }
                .text{
                    color: #191919;
                }
            }
        }
        .pay-title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #191919;
            font-size: 32px;
            padding: 30px 50px 30px 50px;
            border-bottom: 1px solid #F2F6F9;
            z-index: 5;
            .close{
                width: 46px;
                height: 46px;
                background-image: url('../../../assets/close.png');
                background-size: 100% auto;
                background-repeat: no-repeat;
            }
            .text{
                font-weight: bold;
            }
            .sure{
                font-size: 28px;
                color: #FE7E41;
                font-weight: bold;
            }
        }
    }
    .empty-120 {
        height: 140px;
    }
    .supplementary-order-footer {
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        padding-left: 32px;
        padding-right: 32px;
        width: 750px;
        min-height: 112px;
        line-height: 112px;
        background: #FFFFFF;
        box-sizing: border-box;
        .text {
            margin-top: 36px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #696969;
            line-height: 40px;
        }
        .btn-container {
            width: 100%;
            height: 112px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            span {
                margin-right: 16px;
                padding: 22px 44px;
                width: 172px;
                height: 38px;
                text-align: center;
                background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
                border-radius: 46px;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 38px;
            }

        }
        .confirm-btn {
            width: 630px;
            text-align: center;
            margin: 20px auto;
            // margin-left: 16px;
            // padding: 22px 44px;
            height: 80px;
            text-align: center;
            background: linear-gradient(90deg, #FE7E41 0%, #FF5D0F 100%, #FF5C0E 100%);
            border-radius: 46px;
            font-size: 28px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 80px;
        }
    }
}
</style>
