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
                        设备信息
                    </div>
                </div>
                <div class="transverse"></div>
                <div class="order">
                    <div class="orderLeft">
                        设备编号
                    </div>
                    <div class="orderRight">
                        {{equipmentDetail.deviceNo}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        设备名称
                    </div>
                    <div class="orderNum">
                        {{equipmentDetail.deviceName}}
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        设备类型
                    </div>
                    <div class="orderRights">
                        {{equipmentDetail.deviceModel}}
                    </div>
                </div>
                <div class="bottom-border">
                    <div class="order">
                        <div class="orderLeft">
                            设备厂商
                        </div>
                        <div class="orderRight">
                            {{equipmentDetail.manufacturerName}}
                        </div>
                    </div>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        设备地址
                    </div>
                    <div class="orderRights">
                        {{equipmentDetail.address}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
// import { getSaleOrderDetail } from '@/api/order.js'
import { getSaleOrderDetailV10 } from '@/api/order.js'
const props = defineProps(['orderNoSub', 'applyCode'])
const route = useRoute()
// 消息列表进入页面
const msgId = route.query.msgId
console.log('msgId: ' + msgId)
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
const equipmentDetail = ref({})
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
        equipmentDetail.value = res.data.orderInfo.deviceDto
    }
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
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                display: flex;
                .van-button--normal{
                    padding: 0px !important;
                }
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

}
.button-box{
    text-align: center;
    .button-boxs{
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        margin:40px auto;
        // position: fixed;
        // left:60px;
        // bottom:41px;
        text-align:center;
        font-size: 30px;
        font-weight: 600;
        color: #FFFFFF;

    }
}

</style>
