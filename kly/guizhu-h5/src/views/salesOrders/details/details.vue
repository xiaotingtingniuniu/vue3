<template>
    <div class="orderDetailsBox">
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <!-- <div class="returnDoods"  v-if="orderState === '退款拒绝'">
            <img src="@/assets/replenishmentImg/refund@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款拒绝</div>
                <div class="refuseBottun">退款申请已拒绝</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">退款详情</van-button>
        </div> -->
        <!-- 退款待处理 -->
        <!-- <div class="returnDoods" v-if="orderState === '退款待处理'">
            <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款待处理</div>
                <div class="refuseBottun">用户发起退款申请，请尽快处理</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">去处理</van-button>
        </div> -->
        <!-- 退款完成 -->
        <!-- <div class="returnDoods" v-if="orderState === '退款完成' || (orderDetail.orderInfo&&orderDetail.orderInfo.orderStatus === '退款完成')">
            <img src="@/assets/replenishmentImg/complete@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款完成</div>
                <div class="refuseBottun">退款申请已同意，系统已退款给用户</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">退款详情</van-button>
        </div> -->
        <!-- 退款处理中 -->
        <!-- <div class="returnDoods" v-if="orderState === '退款处理中'">
            <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款处理中</div>
                <div class="refuseBottun">退款申请已同意，等待系统退款给用户</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">退款详情</van-button>
        </div> -->
        <!-- <div class="returnDoods" v-if="orderDetail.operateBtn">
            <div class="returnDoods-text">
                <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
                <div class="refundTitle">
                    <div class="refuseTop">{{orderDetail.orderInfo?orderDetail.orderInfo.orderStatus:''}}</div>
                    <div class="refuseBottun">{{orderDetail.operateBtn?orderDetail.operateBtn.btnRemark:''}}</div>
                </div>
            </div>

            <van-button type="default" class="refundBut" @click="afterSales(orderDetail.orderInfo.orderNoSub,orderDetail.orderInfo.refundNo)">{{orderDetail.operateBtn?orderDetail.operateBtn.btnName:''}}</van-button>
        </div> -->
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
        <!--订单信息  -->
        <div class="orderDetailsTop">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    订单信息
                </div>
                <!-- 当订单为手动创建的补扣订单时，显示查看原订单 -->
                <div v-if="orderDetail&&orderDetail.originOrderNo !== null">
                    <span class="originalBox" @click="goOrder(orderDetail.originOrderNo)">查看原订单</span>
                    <img src="../../../assets/replenishmentImg/arrow@2x.png" alt="" class="originalImg">
                </div>

            </div>
            <div class="transverse"></div>
            <div class="order">
                <div class="orderLeft">
                    订单状态
                </div>
                <div class="orderRight" style="color: #FE7E41" v-if="orderState === '退款待处理'">
                    <!-- 待支付（补扣） -->
                    {{orderDetail.orderInfo?orderDetail.orderInfo.orderStatus:''}}
                </div>
                <div class="orderRight" v-else>
                    <!-- 待支付（补扣） -->
                    {{orderDetail.orderInfo?orderDetail.orderInfo.orderStatus:''}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单号
                </div>
                <div class="orderNum">
                    <div id="form-tone" class="copy-left">{{orderDetail.orderInfo?orderDetail.orderInfo.orderNoSub:''}}</div>
                    <van-button class="copyBox copy-bader"  @click="copyCode(orderDetail.orderInfo.orderNoSub)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    下单时间
                </div>
                <div class="orderRight">
                    {{orderDetail.orderInfo?orderDetail.orderInfo.createOrderTime.replace('T',' '):''}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单金额
                </div>
                <div class="orderRight">
                    {{orderDetail.orderInfo?(orderDetail.orderInfo.totalAmount/100).toFixed(2):0}}元
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    应付金额
                </div>
                <div class="orderRight">
                    {{orderDetail.orderInfo?(orderDetail.orderInfo.payAmount/100).toFixed(2):0}}元
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    支付类型
                </div>
                <div class="orderRight">
                    {{orderDetail.orderInfo?orderDetail.orderInfo.payTypeDesc:''}}
                </div>
            </div>
            <div class="order" v-if="orderDetail.orderInfo">
                <div class="orderLeft" v-if="orderDetail.orderInfo.consumerMobile !== null">
                    用户手机号
                </div>
                <div class="orderRight">
                    {{orderDetail.orderInfo.consumerMobile !== null?orderDetail.orderInfo.consumerMobile.replace(/^(.{3})(?:\d+)(.{4})$/, "$1****$2"):''}}
                </div>
            </div>
            <div class="video">
                购物视频
            </div>
            <div class="videoContent" v-if="orderDetail.orderInfo">
                <div class="shoppingVideo" v-for="(item,index) in orderDetail.orderInfo.buyVideoUrls" :key="index">
                    <video class="videxBox" :src="item" controls='controls'></video>
                </div>
            </div>
        </div>
        <!-- 订单明细 -->
        <div class="orderDetailsMiddle">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    商品明细
                </div>
            </div>
            <div class="transverse"></div>
            <div class="orderBox" :class="classOne" v-if="orderDetail.orderItemsInfo">
                <div class="orderList" v-for="(item,index) in orderDetail.orderItemsInfo.goodsList.slice(0, showNum)" :key="index" @click="changeShowNum">
                    <div class="bottonTop">
                        <div class="content">
                            <div class="content-left">
                                <img :src="item.skuImgUrl" alt="" class="orderImg"/>
                            </div>
                            <div class="content-right">
                                <div class="orderTitle">{{item.skuName}}</div>
                                <div class="orderPrice">{{(item.salesPrice/100).toFixed(2)}}元</div>
                            </div>

                        </div>
                        <div class="orderQuantity">x{{item.quantity}}</div>
                    </div>

                    <div class="bottonLine" :class="bottonList"></div>
                </div>
            </div>
            <div class="button-box" v-if="totalList.length > 1">
                <img v-if="showNum === 1" :src="require('@/assets/replenishmentImg/arrowLower.png')" @click="changeShowNum"/>
                <img v-else :src="require('@/assets/replenishmentImg/putAway@2x.png')" @click="changeShowNum"/>
            </div>
            <div class="orderListFoot" >
                <div class="common">共{{orderDetail.orderItemsInfo?orderDetail.orderItemsInfo.skuCount:''}}件</div>
                <div class="commonOne">合计：{{orderDetail.orderInfo?(orderDetail.orderInfo.totalAmount/100).toFixed(2):''}}元</div>
            </div>
            <div class="cell">
                <div class="cell-title">优惠：{{orderDetail.orderInfo?(orderDetail.orderInfo.disctAmount/100).toFixed(2):''}}元</div>
                <div class="cell-money">
                    <div class="title">应付：</div>
                    <div class="money">¥{{orderDetail.orderInfo?(orderDetail.orderInfo.payAmount/100).toFixed(2):''}}</div>
                </div>
            </div>
        </div>
        <!-- 设备信息 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    设备信息
                </div>
            </div>
            <div class="transverse"></div>
            <div class="outside">
                <div class="withinLeft">设备编号</div>
                <div class="withinRight">{{orderDetail.deviceInfo?orderDetail.deviceInfo.deviceCode:''}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备类型</div>
                <div class="withinRight">{{orderDetail.deviceInfo?orderDetail.deviceInfo.deviceType:''}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备名称</div>
                <div class="withinRight">{{orderDetail.deviceInfo?orderDetail.deviceInfo.deviceName:''}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备地址</div>
                <div class="withinRight">{{orderDetail.deviceInfo?orderDetail.deviceInfo.deviceAddr:''}}</div>
            </div>
            <div class="outside">
                <div class="withinLeft">厂商设备ID</div>
                <div class="withinRight">{{orderDetail.deviceInfo?orderDetail.deviceInfo.merchantEqId:''}}</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Toast } from 'vant'
import { openOrdeDetail } from '@/api/order.js'
import Clipboard from 'clipboard'
import { useRouter } from 'vue-router'
import { closePage } from '@/utils/composables'
const router = useRouter()
// import { Collapse, CollapseItem } from 'vant'
// 返回上一级
// const onClickLeft = () => history.back()
const props = defineProps(['orderNoSub', 'orderStatus'])
const orderDetail = ref({})
// 合计
// const totalNum = ref(Number)
// const totalNum = computed(() => {
//     let sum = 0
//     for (var i = 0; i < orderListData.length; i++) {
//         sum += orderListData[i].price * orderListData[i].quantity
//     }
//     return sum
// })
// 展开
// const showAll = ref(false)
const classOne = ref('orderBox')
// const putClass = ref('putOne')
const bottonList = ref('bottonLine')
// const btnTypes = {
//     1: '退款待处理',
//     3: '退款完成',
//     4: '退款拒绝'
// }
// const open = () => {
//     // classOne.value = 'classTow'
//     putClass.value = 'putTow'
//     bottonList.value = 'bottonLine'
//     showAll.value = true
// }
// 收起
// const putAwayBtn = () => {
//     // classOne.value = 'orderBox'
//     putClass.value = 'putOne'
//     bottonList.value = 'bottonModify'
//     showAll.value = false
// }
// 展开收起
// const showList = computed(() => {
//     if (showAll.value === false) {
//         var showDta = ref([])
//         if (orderListData.length > 1) {
//             for (var i = 0; i < 1; i++) {
//                 showDta.value.push(orderListData[i])
//             }
//         } else {
//             showDta.value = orderListData
//         }
//         // bottonList.value = 'bottonLineOne'
//         return showDta.value
//     } else {
//         return orderListData
//     }
// })

const showNum = ref(1)
const changeShowNum = () => {
    if (showNum.value === 1) return (showNum.value = orderDetail.value.orderItemsInfo.goodsList.length)
    showNum.value = 1
}
const order = ref('')
const goOrder = (orderno) => {
    order.value = orderno
    getOrderDetail(order)
}
// 新复制订单编号(ios低版本bug)
const copyCode = async (value) => {
    console.log(value, 'copyCode')
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
    getOrderDetail(order)
})

// 详情
const orderState = ref('')
const totalList = ref([])
const getOrderDetail = async (order) => {
    const param = {
        orderNoSub: order.value !== '' ? order.value : props.orderNoSub
    }
    const res = await openOrdeDetail(param)
    if (res.code === '200') {
        Object.assign(orderDetail.value, res.data)
        orderState.value = res.data.orderInfo.orderStatus
        totalList.value = res.data.orderItemsInfo.goodsList
    }
}

const afterSales = (orderNoSub, refundNo) => {
    router.push({
        path: '/afterDetails',
        name: 'afterDetails',
        params: {
            orderNoSub: orderNoSub,
            refundNo: refundNo
        }
    })
}
</script>
<style lang="scss" scoped>
.orderDetailsBox{
    background: #F4F5F5;
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
     .returnDoods{
        height: 185px;
        background: linear-gradient(#FE7E41 0%, #FF5C0E 100%);
        display: flex;
        justify-content: space-between;
        padding-right: 30px;
        .returnDoods-text{
            display: flex;
            .refundImg{
            width: 50px;
            height: 50px;
            margin-left: 40px;
            margin-top: 40px;
        }
        .refundTitle{
            margin-left: 16px;
            margin-top: 40px;
            .refuseTop{
                font-size: 36px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
            }
            .refuseBottun{
                font-size: 26px;
                font-weight: 400;
                color: #FFFFFF;
                margin-top: 8px;
                // width: 440px I !important;
            }
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
    .orderDetailsTitle{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        line-height: 140px;
        .equipment{
            font-weight: 600;
            color: #000000;
            width: 136px;
            height: 48px;
        }
        .back{
            color: #000;
            float: left;
            margin-left:20px;
            margin-top: 50px;
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
    .orderDetailsTop{
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
                    width: 600px;
                    height: 300px;
                    border-radius: 8px;
                    object-fit: fill;
                }
            }
        }
    }
    .classTow{
        min-height: 391px;
        overflow: initial;
    }
    .putTow{
        display: flex;
        justify-content: flex-end;
        height: 96px;
        margin-top: -20px;
    }
    .putOne{
        display: flex;
        justify-content: flex-end;
        height: 96px;
        margin-top: -30px;
    }
    .orderDetailsMiddle{
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        margin-right: 30px;
        padding-bottom: 45px;
        .orderList{
            margin-left: 30px;
            margin-right: 30px;
            .bottonTop{
                 padding-top: 26px;
                padding-bottom: 30px;
                display: flex;
                justify-content: space-between;

            }
            .content{
                display: flex;
                justify-content: flex-start;
                .content-right{
                    padding-left:16px ;
                }
            }
            .bottonLine{
                height: 2px;
                background: #F2F6F9;
            }
            .bottonModify{
                height: 2px;
                background: #F2F6F9;
                margin-top: 20px;
            }
            .orderImg{
                width: 100px;
                height: 100px;
            }
            .orderTitle{
                font-size: 26px;
                font-weight: 500;
                color: #191919;
            }
            .orderPrice{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 10px;
            }
            .orderQuantity{
                font-size: 27px;
                font-weight: 500;
                color: #494849;
                display: flex;
                justify-items: center;
                align-items: center;
            }
        }
        .putBox{
            .putAway{
                width: 22px;
                height: 12px;
                margin-left: 334px;
                margin-top: 25px;
            }
        }
        .bottonBox{
            width: 621px;
            height: 2px;
            background: #F2F6F9;
            margin-top: -50px;
            margin-left: 32px;;
        }
        .putAwayBox{
            .putAway{
                width: 22px;
                height: 12px;
                margin-left: 334px;
                margin-top: 30px;
            }
        }
        .van-cell__right-icon{
            margin-left: 334px;
        }
        .orderListFoot{
            display: flex;
            justify-content: flex-end;
            margin-top: 5px;
            padding-right: 30px;
            letter-spacing: 1px;
            .common{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
                margin-right: 16px;
            }
            .commonOne{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
            }
            .totalBox{
                font-family: PingFangSC-Regular, PingFang SC;
                margin-top: 31px;
                margin-right: 30px;
                // display: flex;
                margin-top: 22px;
                span{
                    font-weight: 610;
                    font-size: 20px;
                    color: #FE7E41;
                }
            }
        }
        .cell{
            display: flex;
            justify-content: flex-end;
            font-size: 22px;
            font-weight: 400;
            color: #B0B0B0;
            line-height: 30px;
            letter-spacing: 1px;
            padding-right: 30px;
            .cell-money{
                display: flex;
                margin-left: 16px;
                .money{
                    font-size: 28px;
                    font-weight: 400;
                    color: #FE7E41;
                    line-height: 28px;
                }
            }
        }
    }
    .equipmentBox{
        width: 690px;
        height: 428px;
        background: #fff;
        margin-top: 20px;
        margin-left: 30px;
        margin-bottom: 30px;
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
                // overflow: hidden;
                // white-space: nowrap;
                // text-overflow: ellipsis;
            }
        }
    }
    .moneyBox{
        width: 11px;
        height: 13px;
        margin-right: 5px;
        margin-top: 5px;
    }
}
.button-box{
            color: #222222;
            display:flex;
            justify-content: center;
            align-items:center;
            padding-top: 30px;
            img{
                height:12px ;
            }
        }
</style>
