<template>
    <div class="orderDetailsBox">
        <!-- <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar> -->
        <div class="box">
            <div class="orderDetailsBottom">
                <div class="informationBox">
                    <span class="line"></span>
                    <div class="informationTitle">
                        售后信息
                    </div>
                </div>
                <div class="transverse"></div>
                <div class="order">
                    <div class="orderLeft">
                        工单ID
                    </div>
                    <div class="orderNum">
                        <div id="form-tone" class="copy-left">{{workDetail?.workNumber}}</div>
                        <van-button v-if="workDetail?.workNumber" class="copyBox copy-bader"  @click="copyCode(workDetail.workNumber)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        审核结果
                    </div>
                    <div class="orderNum ordertext">
                        {{workstatusValue[workDetail.workStatus]}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        审核人
                    </div>
                    <div class="orderRights">
                        {{workDetail.dealName}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        发起时间
                    </div>
                    <div class="orderRight">
                        {{workDetail.workStartTime}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        补扣订单编号
                    </div>
                    <div class="orderNum">
                        <div id="form-tone" class="copy-left">{{workDetail.orderNo}}</div>
                        <van-button class="copyBox copy-bader" v-if="workDetail?.orderNo" @click="copyCode(workDetail.orderNo)" data-clipboard-target="#form-tone" data-clipboard-action="copy">复制</van-button>
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        订单状态
                    </div>
                    <div class="orderRights">
                        {{orderStatus[workDetail.orderStatus]}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        订单应付金额
                    </div>
                    <div class="orderRights" v-if="workDetail?.totalAmount">
                        ¥{{workDetail.totalAmount}}
                    </div>
                    <div v-else class="orderRights">¥0.00</div>
                </div>
            </div>
        </div>
        <div class="empty"></div>
        <template v-if="workDetail && workDetail.orderNo !== null">
            <div class="bottom-button">
                <van-button @click="detail" type="warning">查看补扣订单</van-button>
            </div>
        </template>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Toast } from 'vant'
import Clipboard from 'clipboard'
// import { getSaleOrderDetail } from '@/api/order.js'
import { getSaleOrderDetailV10 } from '@/api/order.js'
import { newPage } from '@/utils/composables'
const route = useRoute()
// 消息列表进入页面
const props = defineProps(['orderNoSub', 'applyCode'])
const msgId = route.query.msgId
console.log('props.workOrderNo: ' + route.query.workOrderNo)
console.log('msgId: ' + msgId)
// 工单状态 0待处理,1已完成,2已取消
const workstatusValue = ref({ 0: '待处理', 1: '已完成', 2: '已完成' })
const orderStatus = { 100: '待付款', 200: '备餐中', 300: '待配送', 400: '待入柜', 500: '待取货', 600: '已完成', 700: '退款成功', 701: '退款处理中', 70: '取消', 900: '异常订单' }
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
    getOrderDetail()
})
const orderInfo = ref({
    opendoorInfo: {
        applyCode: '', // 开门记录
        userMobile: '', // 用户手机号
        startTime: '', // 申请开门时间
        openTime: '', // 货柜开门时间
        endTime: '' // 购物结束时间
    }
})
const orderDetail = ref({})
const orderState = ref('')
const workDetail = ref('')
const applycode = ref('')
const ordernosub = ref('')
const getOrderDetail = async (order) => {
    const param = {
        orderNoSub: props.orderNoSub === 'null' ? '' : props.orderNoSub,
        applyCode: props.applyCode
    }
    const res = await getSaleOrderDetailV10(param)
    if (res.code === '200') {
        orderInfo.value = res.data
        Object.assign(orderDetail.value, res.data)
        orderState.value = res.data.orderInfo.orderStatus
        workDetail.value = res.data.exceptionInfo ? res.data.exceptionInfo : ''
        applycode.value = res.data.opendoorInfo?.applyCode
        ordernosub.value = res.data.orderInfo?.ordernosub
    }
}
const detail = () => {
    newPage(`/salesOrders/detail/${workDetail.value.orderNo}/${applycode.value}?showNavbar=0`)
}
</script>
<style lang="scss" scoped>
.orderDetailsBox{
    width: 100vw;
    height: 100vh;
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
    .box{
        padding: 20px 30px;
        .orderDetailsTop{
        background: #FFFFFF;
        border-radius: 8px;
        padding-bottom: 30px;
        .informationTitle{
            font-size: 30px;
            font-weight: 500;
            color: #191919;
            // margin-left: 20px;
        }
        .order{
            display: flex;
            justify-content:space-between;
            margin-top: 25px;
            padding: 0 30px;
            .orderLeft{
                font-size: 26px;
                font-weight: 400;
                color: #999999;
            }
            .orderRight{
                font-size: 26px;
                font-weight: 400;
                color: #191919;
                text-align:right;
            }
            .orderNum{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                display: flex;
                .copyBox{
                    width: 70px;
                    height: 34px;
                    background: #FFF5F0;
                    border-radius: 17px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                    margin-left: 10px;
                }
                .van-button--normal{
                    padding: 0px !important;
                }
            }
        }
        .video{
            font-size: 26px;
            font-family: PingFangSC-Regular, PingFang SC;
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
                // border: 1px solid #000;
                margin-left: 30px;
                margin-top: 20px;
                .videxBox{
                    width: 600px;
                    height: 300px;
                    object-fit: fill;
                }
            }
        }
    }
    .orderDetailsMiddle{
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        padding-bottom: 30px;
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
    .orderDetailsBottom{
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        padding-bottom: 30px;
        .informationTitle{
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #191919;
            margin-left: 20px;
        }
        .order{
            display: flex;
            justify-content:space-between;
            margin-top: 25px;
            .orderLeft{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
            }
            .orderRight{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                text-align:right;
            }
            .orderRights{
                width: 418px;
                // height: 74px;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                text-align:right;
            }
            .orderNum{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                display: flex;
                margin-right: 30px;
                .copyBox{
                    width: 70px;
                    height: 34px;
                    background: #FFF5F0;
                    border-radius: 4px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                    margin-left: 10px;
                }
                .van-button--normal{
                    padding: 0px !important;
                }
            }
            .ordertext{
                color: #FF2442;
            }
        }
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
        .equipment{
            width: 204px;
            height: 48px;
            font-size: 34px;
            font-weight: 600;
            color: #000000;
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
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
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
        font-family: PingFangSC-Regular, PingFang SC;
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
    .empty {
        height: 180px;
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

}
// .button-box{
//     text-align: center;
//     .button-boxs{
//         width: 630px;
//         height: 92px;
//         background: #FE7E41;
//         border-radius: 46px;
//         margin:40px auto;
//         // position: fixed;
//         // left:60px;
//         // bottom:41px;
//         text-align:center;
//         font-size: 30px;
//         font-weight: 600;
//         color: #FFFFFF;

//     }
// }

</style>
