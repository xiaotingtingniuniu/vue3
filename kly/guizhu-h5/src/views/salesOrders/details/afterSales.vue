<template>
    <div class="afterSalesBox">
        <van-nav-bar fixed placeholder :title="$route.meta.title" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage">
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <!-- 退款进度 -->
        <div class="progressBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    退款进度
                </div>
            </div>
            <div class="transverse"></div>
            <!-- 退款拒绝 -->
            <Steps direction="vertical" :active="0" class="dataTow">
                <Step class="stepBox" v-for="(item,index) in refundList" :key="index">
                    <div class="stepLeft">
                        <div class="stepLeft-left">
                            <h3 class="stepTitle">{{item.nodeName}}</h3>
                            <div class="stepRigthTow">{{item.nodeTime}}</div>
                        </div>

                        <h5 class="stepTitleDesc">{{item.nodeDesc}}</h5>
                    </div>

                </Step>
            </Steps>
            <!-- 退款待处理 -->
            <!-- <Steps direction="vertical" :active="0" v-if="nameDatas === '退款待处理'" class="dataOne">
                <Step class="stepBox">
                    <div class="stepLeft">
                        <h3 class="stepTutle">用户发起退款</h3>
                    </div>
                    <div class="stepRigth">2022-06-16 12:23:33</div>
                </Step>
            </Steps> -->
            <!-- <div class="steps-content">
                <div class="step-left">
                    <img src="@/assets/step-yes.png" alt="" class="step-left-img">
                    <div class="step-title">用户发起退款</div>
                </div>
                <div class="step-right">
                    <div class="step-right-title">2022-06-16 12:23:33</div>
                </div>
            </div> -->
        </div>
        <!-- 退款信息 -->
        <div class="returnInformation">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    退款信息
                </div>
            </div>
            <div class="transverse"></div>
            <div class="orderBox" :class="classOne" v-if="refundDetail.goodsList">
                <div class="orderList" v-for="(item,index) in refundDetail.goodsList.slice(0, showNum)" :key="index">
                    <div class="bottonTop">
                        <div class="order-list-left">
                            <img :src="item.skuImgUrl" alt="" class="orderImg">
                            <div>
                                <div class="orderTitle">{{item.skuName}}</div>
                                <div class="goods-type" v-if="item.storageStyleCode === 'freeze'"></div>
                                <div class="orderPrice">{{(item.salesPrice/100).toFixed(2)}}元</div>
                            </div>
                        </div>
                        <div class="orderQuantity">x{{item.quantity}}</div>
                    </div>
                    <div class="bottonLine" :class="bottonList"></div>
                </div>
            </div>
            <div class="button-box"  v-if="totalList.length > 1">
                <img v-if="showNum === 1" :src="require('@/assets/replenishmentImg/arrowLower.png')" @click="changeShowNum"/>
                <img v-else :src="require('@/assets/replenishmentImg/putAway@2x.png')" @click="changeShowNum"/>
            </div>
            <div class="orderListFoot">
                <div class="common">共{{refundDetail.skuCount}}件</div>
                <div class="commonOne">合计：</div>
                <div class="totalBox">
                    <img src="@/assets/replenishmentImg/Group@2x.png" alt="" class="moneyBox">
                    <span>{{(refundDetail.totalAmount/100).toFixed(2)}}</span>
                </div>
            </div>
            <div class="lintBox"></div>
            <div>
                <div class="typeBox" :class="typeList">
                    <div class="explain">退款类型</div>
                    <div class="deterioration">{{refundDetail.reasonTypeDesc}}</div>
                </div>
                <div class="returnType">
                    <div class="explain">退款说明</div>
                    <div class="deterioration">{{refundDetail.reasonDesc}}</div>
                </div>
                <div class="pictureImg">
                    <div class="explain">补充凭证</div>
                    <div class="picture">
                        <div v-for="(item,index) in refundDetail.applyAttachmentList" :key="index" class="imgData">
                            <img :src="item" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 同意/拒绝退款 -->
        <div class="pending van-safe-area-bottom" v-if="btns !== null">
            <van-button v-for="(item,index) in btns" :key="index" type="default" :class="{
                agreeRefund: item.btnName === '同意退款',
                refuseRefund: item.btnName === '拒绝退款',
            }" @click="refuse(item.btnName)" >{{item.btnName}}</van-button>
        </div>
    </div>
    <!-- 同意弹框 -->
    <van-dialog v-model:show="agreeShow"
                class="agreeDialog"
                show-cancel-button title="确定同意退款？"
                confirmButtonText="确定"
                cancelButtonText="取消"
                @confirm="agreeConfirmn"
                @cancel="agreeCancel">
        <div class="showBox">
            退款金额：
            <van-field v-model="amountMoney" type="number" placeholder="请输入金额" class="amountBox" />
            元
        </div>
    </van-dialog>
    <!-- 确定拒绝退款   @confirm="refuseConfirmn"-->
    <van-dialog v-model:show="refuseShow"
                class="agreeDialog"
                show-cancel-button title="确定拒绝退款？"
                confirmButtonText="确定"
                cancelButtonText="取消"
                :before-close = 'onRefuseConfirmn'
                @confirm="refuseConfirmn"
                @cancel="refuseCancel">
        <div class="showBoxOne">
            <van-field v-model="refuseReason" type="textarea" placeholder="请输入拒绝原因" class="reasonBox" />
        </div>
    </van-dialog>
</template>
<script setup>
import { onMounted, ref } from 'vue'
// import { useRouter } from 'vue-router'
import { Step, Steps, Toast } from 'vant'
import { refundDetailInfo, auditRefund } from '@/api/order.js'
import { closePage } from '@/utils/composables'
import { accMul } from '@/utils'
// import router from '../../../router'
// auditRefund
// const router = useRouter()
const props = defineProps(['orderNoSub', 'refundNo'])
// 返回上一级
// const onClickLeft = () => history.back()
// const orderListData = ref([])
// const nameDatas = router.currentRoute.value.query.value
// 退款金额
const amountMoney = ref(null)
// 拒绝原因
const refuseReason = ref('')
// 同意退款
const agreeShow = ref(false)
// 拒绝退款
const refuseShow = ref(false)
const showNum = ref(1)
const changeShowNum = () => {
    if (showNum.value === 1) return (showNum.value = refundDetail.value.goodsList.length)
    showNum.value = 1
}

// 展开
// const showAll = ref(false)
const classOne = ref('orderBox')
// const putClass = ref('putOne')
const bottonList = ref('bottonLine')
const typeList = ref('typeBox')

// 拒绝退款
const refuse = (name) => {
    if (name === '同意退款') {
        agreeShow.value = true
        amountMoney.value = null
    }
    if (name === '拒绝退款') {
        refuseReason.value = ''
        refuseShow.value = true
    }
}
// 拒绝确定
const onRefuseConfirmn = (action) =>
    new Promise((resolve) => {
        if (action === 'confirm') {
            resolve(false)
        } else {
        // 拦截取消操作
            resolve()
        }
    })
const refuseConfirmn = async () => {
    if (refuseReason.value === '') {
        Toast.fail('请输入拒绝原因。')
        refuseShow.value = true
    } else {
        refuseShow.value = false
        const res = await auditRefund({ orderNo: refundDetail.value.orderNo, refundNo: refundDetail.value.refundNo, auditType: 3, rejectReason: refuseReason.value, refundAmount: 0 })
        if (res.code === '200') {
            Toast({
                message: res.message,
                duration: 2000
            })
            await getRefundDetail()
            // router.push({ name: 'details', params: { orderNoSub: refundDetail.value.orderNoSub } })
            closePage()
        }
    }

    console.log(refuseReason.value)
}
// 拒绝取消
const refuseCancel = () => {
    refuseShow.value = false
    refuseReason.value = ''
}
// 同意退款
// const agree = () => {
//     amountMoney.value = null
//     agreeShow.value = true
// }
// 同意确定
const agreeConfirmn = async () => {
    const money = accMul(amountMoney.value, 100)
    if (money > refundDetail.value.totalAmount) {
        agreeShow.value = true
        Toast.fail('退款金额不能大于实际支付金额')
    } else if (amountMoney.value === '' || amountMoney.value <= 0) {
        agreeShow.value = true
        Toast.fail('请输入比0大的退款金额')
    } else {
        const res = await auditRefund({ orderNo: refundDetail.value.orderNo, refundNo: refundDetail.value.refundNo, auditType: 2, refundAmount: accMul(amountMoney.value, 100) })
        if (res.code === '200') {
            Toast({
                message: res.message,
                duration: 1000
            })
        }
        await getRefundDetail()
        console.log(res)
    }
}
// 同意拒绝
const agreeCancel = () => {
    agreeShow.value = false
    amountMoney.value = null
}
onMounted(() => {
    getRefundDetail()
    // showAdd()
    // orderListData.value = router.currentRoute.value.query.orderListData
    // router.currentRoute.value.query.
})

// 详情
const refundDetail = ref({})
const btns = ref([])
const refundList = ref([])
const totalList = ref([])
const getRefundDetail = async () => {
    const param = {
        orderNoSub: props.orderNoSub,
        refundNo: props.refundNo
    }
    const res = await refundDetailInfo(param)
    if (res.code === '200') {
        console.log()
        Object.assign(refundDetail.value, res.data.refundInfo)
        btns.value = res.data.operateBtn
        refundList.value = res.data.refundProcessList
        totalList.value = res.data.refundInfo.goodsList
    }
}
</script>
<style lang="scss" scoped>
.afterSalesBox{
    width: 100vw;
    height: 100vh;
    overflow:auto;
    padding-top: 20px;
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
    .afterSalesTitle{
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        // margin-top: 56px;
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
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
        color: #191919;
        margin-left: 20px;
    }
    .line{
        width: 10px;
        height: 28px;
        background: #FE7E41;
        display: block;
        margin-top: 5px;
    }
    .transverse{
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #F2F6F9;
        margin-top: 17px;
    }
    .progressBox{
        min-height: 200px;
        width: 690px;
        background: #fff;
        margin-left: 30px;
        border-radius: 8px;
        padding-bottom: 20px;
        .stepBox{
            border-top:  none;
            .stepTutle{
                font-size: 30px;
                font-weight: 500;
                color: #191919;
                margin-top: 10px;
                margin-left: 20px;
            }
            .stepTitle{
                font-size: 30px;
                font-weight: 500;
                color: #191919;
                margin-top: 5px;
            }
            .stepTitleDesc{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
            }
            .stepContent{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
                margin-left: 20px;
            }
            .stepRigth{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
            }
            .stepRigthTow{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
                margin-top: 10px;
            }
            .stepLeft-left{
                display: flex;
                justify-content: space-between;
            }
        }
        .van-step--vertical:not(:last-child):after {
                  border-bottom-width: 0;
            }
        .van-step__title{
            // display: flex;
            // justify-content: space-between;
            border: none !important;
        }
        .van-step__circle{
            width: 16px;
            height: 16px;
            background: #FEC29D;
            // margin-top: 50px;
        }
        .van-step__line{
            background: #FEC29D;
            height: 97%;
            top: 44px;
        }
        .van-step__circle{
            margin-left: 2px;
        }
        .van-step--vertical .van-step__circle-container{
            font-size: 40px;
            vertical-align: middle;

        }
        .van-step__icon--active{
            color: #FE7E41;
        }
        .steps-content{
        padding: 35px 30px 35px 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .step-left{
            display: flex;
            .step-left-img{
                width: 40px;
                height: 40px;
                margin-right: 20px;
            }
            .step-title{
                font-size: 30px;
                font-weight: 500;
                color: #191919;
                line-height: 42px;
            }
        }
        .step-right{
           .step-right-title{
                font-size: 24px;
                font-weight: 400;
                color: #999999;
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
        margin-top: -30px;
        margin-right: 20px;
    }
    .putOne{
        display: flex;
        justify-content: flex-end;
        height: 96px;
        margin-top: -35px;
        margin-right: 20px;
    }
    .returnInformation{
        width: 690px;
        // min-height: 798px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        padding-bottom: 20px;
        margin-bottom: 100px;
    .orderList{
            margin-left: 30px;
            margin-right: 30px;
            .bottonTop{
                padding-top: 26px;
                padding-bottom: 30px;
                display: flex;
                justify-content: space-between;
                .order-list-left{
                    display: flex;
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
                margin-right: 16px;
            }
            .orderTitle{
                font-size: 26px;
                font-weight: 500;
                color: #191919;
                margin-left: 16px;
            }
            .goods-type {
                width: 116px;
                height: 32px;
                background: url('../../../assets/freeze-icon.png') no-repeat 100% 100%;
            }
            .orderPrice{
                font-size: 22px;
                font-weight: 400;
                color: #B0B0B0;
                margin-left: 16px;
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
                margin-top: 22px;
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
        .lintBox{
            float: left;
            width: 631px;
            height: 2px;
            background: #F2F6F9;
            margin-bottom: 20px;
            margin-left: 30px;
        }
        .orderListFoot{
            display: flex;
            justify-content: flex-end;
            height: 86px;
            letter-spacing: 1px;
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
                margin-top: 22px;
                span{
                    font-weight: 610;
                    font-size: 28px;
                    color: #FE7E41;
                }
            }
        }
        .pictureImg{
            .explain{
                font-size: 26px;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
                margin-top: 20px;
            }
        }
        .returnType{
            display: flex;
            justify-content: space-between;
            .explain{
                flex: 1;
                font-size: 26px;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
                margin-top: 20px;
            }
            .deterioration{
                width: 400px;
                margin-left: 108px;
                font-size: 26px;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
                margin-top: 20px;
                text-align: right;
            }
        }
        .typeBox{
            display: flex;
            justify-content: space-between;
            width: 690px;
            margin-top: 30px;
            .explain{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
            }
            .deterioration{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
            }
        }
        .typeTow{
            display: flex;
            justify-content: space-between;
            width: 690px;
            margin-top: 80px;
            .explain{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                margin-left: 30px;
            }
            .deterioration{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #191919;
                margin-right: 30px;
            }
        }
        .picture{
            margin-top: 20px;
            display: flex;
            // overflow-x: scroll;
            flex-wrap: wrap
        }
        .imgData{
            margin-left: 15px;
            width: 200px;
            height: 200px;
            img{
                width: 200px;
                height: 190px;
                margin-left: 15px;
            }
        }
    }
    .pending{
        height: 98px;
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
            .van-button{
                flex: 1;
                &.refuseRefund{
                font-size: 30px;
                font-weight: 400;
               color: #FE7E41;
                background: #F4F5F5;
            }
             &.agreeRefund{
                background: #FE7E41;
                font-size: 30px;
                font-weight: 400;
                color: #FFFFFF
            }
            // .agreeRefund{
            //     background: #FE7E41;
            //     font-size: 30px;
            //     font-weight: 400;
            //     color: #FFFFFF;
            //     margin-top: 1px;
            // }
            // .refuseRefund{
            //     background: #FFFFFF;
            //     font-size: 30px;
            //     font-weight: 400;
            //     color: #FE7E41;
            // }
        }

    }
    .moneyBox{
        width: 11px;
        height: 13px;
        margin-right: 5px;
        margin-top: 5px;
    }
    .dataOne{
        padding-top: 25px;
    }
    .dataTow{
        padding-top: 15px;
        // padding-right: 25px;
    }
    // .van-step__circle-container{
    //     left: -20px;
    // }
}
.agreeDialog{
    .van-dialog__header{
        line-height: 10px !important;
    }
    .van-dialog__confirm{
        color: #FE7E41;
    }
    .showBox{
        height: 270px;
        line-height: 270px;
        text-align: center;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        display: flex;
        margin-left: 80px;
    }
    .showBoxOne{
        height: 270px;
        line-height: 270px;
        text-align: center;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #000000;
        display: flex;
        margin-left: 30px;
    }
    .amountBox{
        width: 240px !important;
        height:70px;
        margin-top: 104px;
        // border: 1px solid #999999;
        line-height: 30px;
        margin-right: 20px;
    }
    .reasonBox{
        margin-top: 50px;
        text-align: center;
    }
    .van-field__control--min-height{
        text-align: left;
        height: 150px;
    }
    // .van-steps--vertical{
    //     padding-top: 8px 0 0 0 !important;
    // }

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
.van-toast{
    width: 300px !important;
}
</style>
