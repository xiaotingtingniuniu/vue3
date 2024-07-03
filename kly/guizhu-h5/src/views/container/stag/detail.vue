<template>
    <div class="bg">
        <div class="container">
            <div class="container-list">
                <div class="container-item" v-for="(item, index) in resultdata" :key="index">
                    <div class="container-item-top">
                        <div class="container-item-top-content">设备编号：{{item.equipmentNo === '' ? '—' : item.equipmentNo}}</div>
                    </div>
                    <div class="container-item-main">
                        <div class="container-img">
                            <div class="img">
                                <van-image
                                    class="image"
                                    fit="cover"
                                    :src="require(('@/assets/my-container.png'))"
                                />
                            </div>
                        </div>
                        <div class="container-content">
                            <div class="text">货柜型号：{{item.equipmentModel}}</div>
                            <div class="text">货柜价格：￥{{item.deviceCost}}/台</div>
                            <div class="text">货柜台数：{{item.equipmentNums}}台</div>
                            <div class="text">分期期数：{{item.applyTerm}}期</div>
                            <div v-if="payStatus === 2 || item.squareStatus === 21 || item.squareStatus === 31 || item.squareStatus === 41 || item.squareStatus === 51 && item.currSquareStatus !== null" class="text">
                                当期状态：{{item.currSquareStatus === 0 ? '还款中' : item.currSquareStatus === 1 ? '结清中' : item.currSquareStatus === 2 ? '已结清' : item.currSquareStatus === 3 ? '已退款' : item.currSquareStatus === 4 ? '退款中' : '已逾期' }}
                            </div>
                            <div class="text">首付金额：￥{{item.deposit}}/台</div>
                            <div class="text">物流费用：￥{{item.logisticFee}}/台</div>
                            <div class="text">流量卡费：￥{{item.flowCardFee}}/台/年</div>
                            <div class="text">整月还款金额：￥{{item.monthlyRent}}/台</div>
                            <div class="text">收货地址：{{item.receiveAddress === '' ? '--' : item.receiveAddress}}</div>
                        </div>
                    </div>
                    <div class="confirm-button" v-if="squareStatus === 10 || squareStatus === 21 || squareStatus === 31 || squareStatus === 41 || squareStatus === 32">
                        <div class="noreceived-button" v-if="item.receiveStatus === 1">已收货</div>
                        <div v-if="item.receiveStatus !== 1" @click="confirmReceipt(item.pointId)">确认收货</div>
                    </div>
                    <div class="container-pay" v-if="item.squareStatus === 10">
                        <div class="pay-text">
                            <div class="total">合计：<span>￥{{amount.totalAmount}}</span></div>
                            <div class="detail">首金￥{{amount.downPayAmount}}，运费￥{{amount.logisticFee}}，流量卡费￥{{amount.flowCardFee}}</div>
                        </div>
                        <div class="pay-button" v-if="totalAmount !== '0.00'">
                            <van-button class="bottom-btn" @click="goPay" round color="#FE7E41" text="30">去支付</van-button>
                        </div>
                        <div class="pay-button" v-else>
                            <van-button class="bottom-btn" round color="#FE7E41" disabled text="30">去支付</van-button>
                        </div>
                    </div>
                </div>
                <div class="content-height"></div>
            </div>
            <div class="footer-gopay-outline" v-if="props.orderStatus !== '9999' && (squareStatus === 14 || squareStatus === 31 || squareStatus === 32) ">
                <div class="footer-gopay" v-if="squareStatus === 14" @click="goConfirmOrder">
                    确认订单
                </div>
                <div class="footer-gopay" v-if=" (squareStatus === 31 || squareStatus === 32) && !accountOpen " @click="goHxPay">
                    去还款
                </div>
                <div class="footer-gopay footer-gopay-other" v-if=" (squareStatus === 31 || squareStatus === 32) && accountOpen ">
                    <div class="footer-btn btn-left" @click="goHxPay">
                        小恒买单还款
                    </div>
                    <div class="footer-btn btn-right" @click="goFzPay">
                        小恒钱包还款
                    </div>
                </div>
            </div>
        </div>
    </div>
    <van-dialog v-model:show="isshow" show-cancel-button width="320px" @confirm="conFirm" confirmButtonText="确认收货" confirmButtonColor="#FE7E41">
        <div class="title-confirm">提示</div>
        <div class="content">请确认货柜型号、数量、外观无破损、无质量问题后，确认收货。</div>
    </van-dialog>
    <!--<van-dialog v-model:show="goPayIsshow"  width="300px" @confirm="goToXHPay" confirmButtonText="支付尾款" theme='round-button'   confirmButtonColor="#FE7E41">
        <div class="title-confirm">跳转小恒买单支付尾款</div>
    </van-dialog>-->

</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
// import { goPayment, confirmReveive, stageOrderDetails, stageOrderPay, reportGid } from '@/api/container' // stageOrderDetails
import { confirmReveive, stageOrderDetails, stageOrderPay } from '@/api/container' // stageOrderDetails
// import { appBridge, registerhandler } from '@/utils/bridge.js'
import { appBridge } from '@/utils/bridge.js'
import { isApp, isIos } from '@/utils'
import { getUserInfo } from '@/utils/composables'
import { useRouter } from 'vue-router'

const router = useRouter()
const resultdata = ref(null)
// const taskNo = ref(null)
const payStatus = ref(null) // 支付状态
const squareStatus = ref(null)
const props = defineProps(['orderNo', 'orderStatus'])
const totalAmount = ref(null) // 总金额
const isshow = ref(false)
const currentId = ref('')
const userInfo = ref(null)
const accountOpen = ref(false) // 是否开通钱包

// 确认收获
const confirmReceipt = async (Id) => {
    isshow.value = true
    currentId.value = Id
}
const conFirm = async () => {
    const res = await confirmReveive({
        pointId: currentId.value,
        userId: userInfo.value.userId
    })
    if (res.code === '200') {
        location.reload()
    }
}
const getUserInfoFn = async () => {
    const data = await getUserInfo()
    userInfo.value = JSON.parse(data)
}

onMounted(async () => {
    await stageOrderDetailsFn()
    await getUserInfoFn()
})

const amount = reactive({
    downPayAmount: null,
    logisticFee: null,
    flowCardFee: null,
    totalAmount: null
})
// 订单详情
const stageOrderDetailsFn = async () => {
    const res = await stageOrderDetails({
        orderNo: props.orderNo
    })
    if (res.code === '200') {
        resultdata.value = res.data.list
        accountOpen.value = res.data.accountOpen
        // payStatus.value = res.data.payStatus
        squareStatus.value = res.data.list[0].squareStatus
        amount.downPayAmount = res.data.amount?.downPayAmount
        amount.logisticFee = res.data.amount?.logisticFee
        amount.flowCardFee = res.data.amount?.flowCardFee
        amount.totalAmount = res.data.amount?.totalAmount
    }
}
// 支付尾款
// const goPayIsshow = ref(false) // 显示弹窗  先获取taskNo  之后再弹窗支
// const goPayBp = async () => {
//     await appBridge('doBrEvent', {
//         event: 3
//     })
//     await registerhandler('onBrCallback', async (val) => {
//         const { gid } = val
//         const params = Object.assign({
//             orderNo: props.orderNo,
//             gid

//         })
//         const res = await reportGid(val)
//         if (res.code === '200') {
//             const { data } = await goPayment(params) // taskNo
//             taskNo.value = data.taskNo
//             if (data.taskNo) {
//                 goPayIsshow.value = true
//             }
//         }
//     })
// }
// 去还款
// const goPayHk = async () => {
//     await appBridge('doBrEvent', {
//         event: 3
//     })
//     await registerhandler('onBrCallback', async (val) => {
//         const { gid } = val
//         const params = Object.assign({
//             orderNo: props.orderNo,
//             gid

//         })
//         const res = await reportGid(val)
//         if (res.code === '200') {
//             const { data } = await goPayment(params) // taskNo
//             taskNo.value = data.taskNo
//             if (taskNo.value) {
//                 goToXHPay()
//             }
//         }
//     })
// }
// 二期-确定订单
const goConfirmOrder = () => {
    appBridge('confirmStagesOrder', { orderNo: props.orderNo })
}

// 二期-去小恒买单
const goHxPay = () => {
    appBridge('payStagesOrder')
}

// 钱包2.6期去分期明细支付
const goFzPay = () => {
    const pathName = '/container/stag/pay/' + props.orderNo
    router.push({
        path: pathName
    })
}

// 订单支付
const goPay = async () => {
    const res = await stageOrderPay({
        orderNo: props.orderNo,
        totalAmount: amount.totalAmount
    })
    res.data.businessUniqueCode = 'A100200200111'
    const num = '1'
    if (isApp) {
        if (isIos) {
            appBridge('checkout', { payurl: `${process.env.VUE_APP_LAYOUT_BASEURL_SYT}/${res.data.businessUniqueCode}/${res.data.prePayNo}?showNavbar=0&env=App&hideTitle=0&successUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.data.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}&overtimeUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.data.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}` })
        } else {
            appBridge('checkout', { payurl: `${process.env.VUE_APP_LAYOUT_BASEURL_SYT}/${res.data.businessUniqueCode}/${res.data.prePayNo}?showNavbar=0&env=App&hideTitle=0&successUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.data.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}&backUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.data.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}&overtimeUrl=${encodeURIComponent(location.origin + `/container/payresult/${res.data.prePayNo}/${props.orderNo}/${props.orderStatus}/${num}`)}` })
        }
    }
}

</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.bg{
    height: 100vh;
    background: #f4f5f5;
    box-sizing: border-box;
    padding: 0 15px;
    }
.container {
    // height: 100vh;
    background: #f4f5f5;
    .container-list{
        // background-color: #ffffff;
        padding-top: 20px;
        // padding-bottom: 180px;
        // margin-bottom: 100px{};
        .container-item{
            background-color: #FFFFFF;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .container-item-top{
            height: 81px;
            line-height: 81px;
            padding: 0 30px;
            font-size: 25px;
            font-weight: 700;
        }
        .container-item-top-content{
            width: 100%;
            height: 99%;
            border-bottom: 1px solid #EDEDED;
        }
        .container-item-main{
            display: flex;
            padding: 30px 30px 30px 30px;
            background-color: #FFFFFF;
            margin-bottom: 20px;
        }
        .confirm-button{
            width: 100%;
            height: 120px;
            line-height: 120px;
            background-color: #fff;
            text-align: center;
            color:#FE7E41;
            border-top: 1px solid #EDEDED;
        }
        .container-img{
            width: 234px;
            .img{
                width: 210px;
                height: 210px;
                .image{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .container-content{
            flex: 1;
            font-size: 24px;
            color: #333333;
            .text{
                padding-bottom: 10px;
                span{
                    color: #FE7E41;
                }
            }
        }
        .content-height{
            height: 130px;
            color: #f4f5f5 !important;
        }
        .container-pay{
            background: #ffffff;
            position: fixed;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            // padding: 19px 30px;
            padding: 19px 30px 30px 30px;
            justify-content: space-between;
            .pay-text{
                .total{
                    font-size: 26px;
                    color: #191919;
                    span{
                        font-size: 32px;
                        color: #FE7E41;
                    }
                }
                .detail{
                    font-size: 20px;
                    color: #A3A3B2;
                }
            }
            .pay-button{
                .bottom-btn{
                    width: 200px;
                    height: 70px;
                }
            }
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
        .nopay-content{
            margin: 30px 58px 15px 51px;
            border-bottom: 1px solid #F2F6F9;
            display: flex;
            .van-checkbox{
                width: 100%;
                align-items: flex-start;
                :deep(.van-checkbox__label){
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .img-icon{
                    width: 36px;
                    height: 36px;
                }
            }
            .pay-list{
                flex: 1;
                padding-bottom: 15px;
                .list{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #A3A3B2;
                    font-size: 26px;
                    margin-bottom: 10px;
                }
            }
        }
        .pay-content{
            // height: 237px;
            margin: 30px 58px 15px 51px;
            border-bottom: 1px solid #F2F6F9;
            display: flex;
            .van-checkbox{
                width: 100%;
                align-items: flex-start;
                :deep(.van-checkbox__label){
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                .img-icon{
                    width: 36px;
                    height: 36px;
                }
            }
            .pay-list{
                flex: 1;
                padding-bottom: 15px;
                .list{
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: #191919;
                    font-size: 26px;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
.title-confirm{
    font-size: 36px;
    color: #000000;
    text-align: center;
    padding: 40px 0px 0px 0px;
    margin-bottom: 40px;
    margin-top: 10px;
}
.content{
    font-size: 30px;
    color: #888888;
    padding: 10px 50px 40px 50px;
}
.noreceived-button{
    color:#ccc
}
.van-dialog{
    border-radius: 18px;
}
.footer-gopay-outline{
    width: 100%;
    height: 115px;
    display: flex;
    justify-content: center;
    align-items: center;
    .footer-gopay{
        width: 90%;
        height: 90px;
        font-size: 35px;
        color:#fff;
        background: #FE7E41;
        text-align: center;
        line-height: 90px;
        border-radius: 55px;
        // margin: 0 auto;
        position: fixed;
        bottom: 80px;
    }
    .footer-gopay-other {
        background: none;
        .footer-btn {
            width: 44%;
            display: inline-block;
        }
        .btn-left {
            background: #FFFFFF;
            border-radius: 45px;
            border: 1px solid #FE7E41;
            color: #FE7E41;
        }
        .btn-right {
            background: #FE7E41;
            border-radius: 45px;
            color: #FFFFFF;
            margin-left: 2%
        }
    }
}
</style>
