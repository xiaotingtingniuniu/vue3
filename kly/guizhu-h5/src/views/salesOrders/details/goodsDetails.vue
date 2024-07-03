<template>
    <div class="goodsDetailsBox">
        <!-- <div class="orderDetailsTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">订单详情</span>
        </div> -->
        <!--退款拒绝  -->
        <div class="returnDoods" v-if="nameDatas === '退款拒绝'">
            <img src="@/assets/replenishmentImg/refund@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款拒绝</div>
                <div class="refuseBottun">退款申请已拒绝</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(nameDatas)">退款详情</van-button>
        </div>
        <!-- 退款待处理 -->
        <div class="returnDoods" v-if="nameDatas === '退款待处理'">
            <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款待处理</div>
                <div class="refuseBottun">用户发起退款申请，请尽快处理</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(nameDatas)">去处理</van-button>
        </div>
        <!-- 退款完成 -->
        <div class="returnDoods" v-if="nameDatas === '退款完成'">
            <img src="@/assets/replenishmentImg/complete@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款完成</div>
                <div class="refuseBottun">退款申请已同意，系统已退款给用户</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(nameDatas)">退款详情</van-button>
        </div>
        <!-- 退款处理中 -->
        <div class="returnDoods" v-if="nameDatas === '退款处理中'">
            <img src="@/assets/replenishmentImg/waitFor@2x.png" alt="" class="refundImg">
            <div class="refundTitle">
                <div class="refuseTop">退款处理中</div>
                <div class="refuseBottun">退款申请已同意，等待系统退款给用户</div>
            </div>
            <van-button type="default" class="refundBut" @click="afterSales(nameDatas)">退款详情</van-button>
        </div>
        <!-- 订单信息 -->
        <div class="orderDetailsTop">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    订单信息
                </div>
            </div>
            <div class="transverse"></div>
            <div class="order">
                <div class="orderLeft">
                    订单状态
                </div>
                <div class="orderRightNew">
                    待支付（补扣）
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    订单号
                </div>
                <div class="orderNum">
                    <span>133344556677888888</span>
                    <van-button class="copyBox" @click="copy('133344556677888888')">复制</van-button>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    下单时间
                </div>
                <div class="orderRight">
                    2000-06-16 12:23:33
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    成交额
                </div>
                <div class="orderRight">
                    48.00元
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    销售额
                </div>
                <div class="orderRight">
                    48.00元
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    支付类型
                </div>
                <div class="orderRight">
                    微信支付
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    用户手机号
                </div>
                <div class="orderRight">
                    {{test.replace(test.substring(3,7),'****')}}
                    <!-- {{test ? test.replace(/(\d{3})(\d{4})(\d{4})/,"$1****$3")}} -->
                </div>
            </div>
            <div class="video">
                购物视频
            </div>
            <div class="videoContent">
                <div class="shoppingVideo">
                    <video ref="movie" class="videxBox" src="" controls="controls"></video>
                    <img v-show="isPlay"  src="@/assets/applaer.png" alt="" @click="handlePlay" class="img-icon">
                </div>
                <div class="shoppingVideo">
                    <video class="videxBox" src="" controls='controls'></video>
                </div>
            </div>
        </div>
        <!-- 订单明细 -->
        <div class="orderDetailsMiddle">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    订单明细
                </div>
            </div>
            <div class="transverse"></div>
            <div class="orderBox" :class="classOne">
                <div class="orderList" v-for="(item,index) in showList" :key="index">
                    <div class="bottonTop">
                        <img :src="item.img" alt="" class="orderImg">
                        <div>
                            <div class="orderTitle">{{item.title}}</div>
                            <div class="orderPrice">{{item.price}}元</div>
                        </div>
                        <div class="orderQuantity">x{{item.quantity}}</div>
                    </div>

                    <div class="bottonLine" :class="bottonList"></div>
                </div>
            </div>
            <!-- 展开 -->
            <div class="putBox" v-if="orderListData.length>1?!showAll:showAll">
                <img src="@/assets/replenishmentImg/arrowLower.png" alt="" class="putAway" @click="open">
            </div>
            <!-- <div class="bottonBox" v-if="orderListData.length>1?!showAll:showAll"></div> -->
            <!-- 收起 -->
            <div class="putAwayBox" v-if="orderListData.length>1?showAll:orderListData.length==1?showAll:!showAll">
                <img src="@/assets/replenishmentImg/putAway@2x.png" alt="" class="putAway" @click="putAwayBtn">
            </div>
            <div class="orderListFoot" :class="putClass">
                <div class="common">共{{orderListData.length}}件</div>
                <div class="commonOne">合计：</div>
                <div class="totalBox">
                    <img src="@/assets/replenishmentImg/Group@2x.png" alt="" class="moneyBox">
                    <span>{{totalNum}}</span>
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
                <div class="withinRight">10034</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备类型</div>
                <div class="withinRight">XC_436</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备名称</div>
                <div class="withinRight">华腾世纪E1</div>
            </div>
            <div class="outside">
                <div class="withinLeft">设备地址</div>
                <div class="withinRight">中国广东省深圳市南山区粤海街道高新南一街</div>
            </div>
            <div class="outside">
                <div class="withinLeft">厂商设备ID</div>
                <div class="withinRight">345666777777</div>
            </div>
        </div>

        <!-- <AfterSales :afterAll='afterAll'></AfterSales> -->
    </div>
</template>

<script setup>
// import AfterSales from './afterSales.vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Toast } from 'vant'
import useClipboard from 'vue-clipboard3'
const router = useRouter()
// 返回上一级
// const onClickLeft = () => history.back()
const test = ref('1759874563')
const isPlay = ref(true)
const movie = ref(null)
const orderListData = reactive([
    {
        // img: require('@/assets/replenishment/img/img.jpg'),
        title: '元气森林苏打气泡水480ml/瓶哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
        price: 10,
        quantity: 3,
        showmore: false
    },
    {
        // img: require('@/assets/replenishment/img/img.jpg'),
        title: '元气森林苏打气泡水480ml/瓶',
        price: 6,
        quantity: 5,
        showmore: false
    },
    {
        // img: require('@/assets/replenishment/img/img.jpg'),
        title: '元气森林苏打气泡水480ml/瓶',
        price: 5,
        quantity: 6,
        showmore: false
    }
])
// 合计
// const totalNum = ref(Number)
const totalNum = computed(() => {
    let sum = 0
    for (var i = 0; i < orderListData.length; i++) {
        sum += orderListData[i].price * orderListData[i].quantity
    }
    return sum
})
// 展开
const showAll = ref(false)
const classOne = ref('orderBox')
const putClass = ref('putOne')
const bottonList = ref('bottonLine')
const open = () => {
    // classOne.value = 'classTow'
    putClass.value = 'putTow'
    bottonList.value = 'bottonLine'
    showAll.value = true
}
// 收起
const putAwayBtn = () => {
    // classOne.value = 'orderBox'
    putClass.value = 'putOne'
    bottonList.value = 'bottonModify'
    showAll.value = false
}
// 展开收起
const showList = computed(() => {
    // console.log(orderListData)
    if (showAll.value === false) {
        var showDta = ref([])
        if (orderListData.length > 1) {
            for (var i = 0; i < 1; i++) {
                showDta.value.push(orderListData[i])
            }
        } else {
            showDta.value = orderListData
        }
        return showDta.value
    } else {
        return orderListData
    }
})
// 退款/售后详情
const nameDatas = router.currentRoute.value.query.value
const afterAll = ref([])
const afterSales = (val) => {
    // console.log(val)
    afterAll.value = orderListData
    router.push({
        path: '/afterDetails',
        query: {
            value: val,
            afterAll: afterAll
        }
    })
}
// 复制
const { toClipboard } = useClipboard()
const copy = async (val) => {
    try {
        await toClipboard(val)
        Toast.success('复制成功')
    } catch (e) {
        // Toast.fail(e)
    }
}
onMounted(() => {
    // showAdd()
    // location.assign(location)
    console.log(movie.value)
    // movie.value.addEventListener('play', handlePlay)
})
const handlePlay = async () => {
    console.log('10878')
    movie.value.play()
    isPlay.value = false
}
</script>
<style lang="scss" scoped>
.goodsDetailsBox{
    overflow:auto;
    .orderDetailsTitle{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: linear-gradient(#FE7E41 0%, #FF5C0E 100%);
        font-size: 34px;
        text-align: center;
        line-height: 140px;
        .equipment{
        // float: left;
            font-weight: 600;
            color: #fff;
            width: 136px;
            height: 48px;
        }
        .back{
            color: #fff;
            float: left;
            margin-left:20px;
            margin-top: 50px;
        }
    }
    .returnDoods{
        height: 165px;
        background: linear-gradient(#FE7E41 0%, #FF5C0E 100%);
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
            width: 442px;
            .refuseTop{
                font-size: 36px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
            }
            .refuseBottun{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                margin-top: 8px;
                width: 440px I !important;
            }
        }
        .refundBut{
            // width: 165px;
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
    .orderDetailsTop{
        width: 690px;
        height: 910px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
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
            }
            .orderRightNew{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                color: #FE7E41;
            }
            .orderNum{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                display: flex;
                .copyBox{
                    width: 88px;
                    height: 34px;
                    font-size: 24px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #FE7E41;
                    line-height: 33px;
                    margin-left: 10px;
                    background: #FFF5F0;
                    border-radius: 17px;
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
                margin-left: 30px;
                margin-top: 20px;
                .videxBox{
                    width: 600px;
                    height: 300px;
                    object-fit: fill;
                }
              img{
                    position: absolute;
                    transform: translate(-50%, -50%);
                    left: 50%;
                    top: 48%;
                    cursor: pointer;
                    width:97px;
                    height:96px;
                    &:hover{
                        .img-icon{
                            opacity:0.85
                        }
                    }
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
            }
        }
    }
    .orderBox{
        // height: 160px;
        // overflow-y: hidden;
        // margin-bottom: -10px;
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
        // float: right;
    }
    .orderDetailsMiddle{
        width: 690px;
        // min-height: 365px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        .orderList{
            width: 631px;
            // height: 152px;
            // border-bottom: 1px solid #F2F6F9;
            margin-left: 30px;
            .bottonTop{
                float: left;
                display: flex;
            }
            .bottonLine{
                width: 631px;
                height: 2px;
                background: #F2F6F9;
                float: left;
                margin-top: 20px;
            }
            .bottonModify{
                width: 631px;
                height: 2px;
                background: #F2F6F9;
                float: left;
                margin-top: 20px;
            }
            .orderImg{
                width: 100px;
                height: 100px;
                margin-top: 26px;
            }
            .orderTitle{
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #191919;
                margin-left: 16px;
                margin-top: 26px;
                width: 420px;
            }
            .orderPrice{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-left: 16px;
                margin-top: 10px;
            }
            .orderQuantity{
                font-size: 27px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #494849;
                margin-left: 60px;
                margin-top: 57px;
            }
        }
        .putBox{
            .putAway{
                width: 22px;
                height: 12px;
                margin-left: 334px;
                margin-top: 24px;
                // border: 1px solid #000;
            }
        }
        .bottonBox{
            width: 631px;
            height: 2px;
            background: #F2F6F9;
            margin-top: -50px;
            margin-left: 30px;
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
            height: 96px;
            // float: right;
            .common{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                margin-top: 31px;
                margin-right: 16px;
            }
            .commonOne{
                font-size: 22px;
                font-family: PingFangSC-Regular, PingFang SC;
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
                    font-size: 20px;
                    font-weight: 610;
                    color: #FE7E41;
                }
            }
        }
    }
    .moneyBox{
        width: 11px;
        height: 13px;
        margin-right: 5px;
        // margin-top: 5px;
    }
}
</style>
