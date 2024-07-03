<template>
    <div class="bill-bg">
        <div class="bill">
            <div class="bill-list">
                <div class="bill-item">
                    <div class="bill-item-top">
                        <div class="bill-item-top-content bill-repayment" v-if="amount.orderStatus === 5010">{{ amount.orderStatusDesc }}</div>
                        <div class="bill-item-top-content bill-overdue" v-else-if="amount.orderStatus === 5020">{{ amount.orderStatusDesc }}</div>
                        <!--<div class="bill-item-top-content bill-refund" v-if="fenStatus === '3'">分期已退款</div>-->
                        <!--<div class="bill-item-top-content bill-settle" v-if="fenStatus === '4'">分期已结清</div>-->
                        <div class="bill-item-top-content bill-other" v-else>{{ amount.orderStatusDesc }}</div>
                    </div>
                    <div class="bill-item-main">
                        <div class="bill-content">
                            <div class="text-left">分期金额<span class="bill-fee">￥{{ (amount.balancePayAmount).toFixed(2) }}</span></div>
                            <div class="text-left">含手续费<span class="bill-fee">￥{{ (amount.serviceFee).toFixed(2) }}</span></div>
                            <div class="text-left" @click="goStagDetail">分期商品
                                <van-icon class="bill-icon" color="#B0B0B0" size="18px" name="arrow" />
                                <span class="bill-fee">订单号：{{ amount.orderNo }}</span>
                            </div>
                            <div class="text-left">分期时间<span class="bill-fee">{{ amount.auditTime }}</span></div>
                        </div>
                    </div>
                </div>
                <div class="bill-item">
                    <div class="bill-item-top">
                        <div class="bill-item-top-content bill-detail">还款计划</div>
                    </div>
                    <div class="bill-item-main-detail" v-for="(item, index) in resultdata" :key="index">
                        <div class="bill-content">
                            <div class="text-left">
                                <span class="span-top-left">第{{ item.periods }}/{{ amount.applyTerm }}期</span>
                                <span class="span-top-right service-fee" v-if="(item.overdueFee).toFixed(2) > 0">（含罚息￥{{ (item.overdueFee).toFixed(2) || 0.00 }}）</span>
                                <span class="span-top-right service-fee" v-else>（含手续费￥{{ (item.overdueFee).toFixed(2) || 0.00 }}）</span>
                                <span class="span-top-right rent-fee">￥{{ (item.amount).toFixed(2) }}</span>
                            </div>
                            <div class="text-left">
                                <span class="span-bottom-left">还款日：{{ item.repayDay }}</span>
                                <span class="span-bottom-right bottom-right-red" v-if="item.currStatusDesc === '未结清'">{{ item.currStatusDesc }}</span>
                                <span class="span-bottom-right" v-else>{{ item.currStatusDesc }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="content-height"></div>
            </div>
            <div class="footer-gopay-outline" v-if="showButton">
                <div class="footer-gopay" @click="goToXHPay">
                    立即还款
                </div>
            </div>
        </div>
    </div>
    <van-dialog v-model:show="isshow" width="320px" @confirm="conFirm" confirmButtonText="知道了" confirmButtonColor="#FE7E41">
        <div class="title-confirm">提示</div>
        <div class="content">请打开微信app,搜索<span style="color: #FE7E41;">“小恒买单”</span>小程序操作还款</div>
    </van-dialog>
    <van-dialog v-model:show="goPayIsshow"  width="300px" @confirm="goToXHPay" confirmButtonText="支付尾款" theme='round-button'   confirmButtonColor="#FE7E41">
        <div class="title-confirm">跳转小恒买单支付尾款</div>
    </van-dialog>

</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
// import { goPayment, confirmReveive, stageOrderDetails, stageOrderPay, reportGid } from '@/api/container' // stageOrderDetails
// import { goPayment, confirmReveive, stageBillDetails, reportGid } from '@/api/container'
import { confirmReveive, stageBillDetails } from '@/api/container'
// import { appBridge, registerhandler } from '@/utils/bridge.js'
import { appBridge } from '@/utils/bridge.js'
// import { isApp } from '@/utils'
import { useRouter } from 'vue-router'

const router = useRouter()
const resultdata = ref(null)
const showButton = ref(false) // 支付状态
const props = defineProps(['orderNo'])
const isshow = ref(false)
const currentId = ref('')

const conFirm = async () => {
    const res = await confirmReveive({
        pointId: currentId.value
    })
    if (res.code === '200') {
        location.reload()
    }
}

onMounted(async () => {
    await stageBillDetailsFn()
})

const amount = reactive({
    // 订单状态
    orderStatus: '',
    // 订单状态中文
    orderStatusDesc: '',
    // 订单号
    orderNo: '',
    // 分期金额
    balancePayAmount: 0,
    // 服务费
    serviceFee: 0,
    // 分期时间
    auditTime: '',
    // 总期数
    applyTerm: ''
})
// 订单详情
const stageBillDetailsFn = async () => {
    const res = await stageBillDetails({
        orderNo: props.orderNo
    })
    if (res.code === '200') {
        resultdata.value = res.data.list
        showButton.value = res.data.showButton
        amount.orderStatus = res.data.orderStatus || ''
        amount.orderStatusDesc = res.data.orderStatusDesc || ''
        amount.orderNo = res.data.orderNo || ''
        amount.balancePayAmount = res.data.balancePayAmount || ''
        amount.serviceFee = res.data.serviceFee || 0
        amount.auditTime = res.data.auditTime || ''
        amount.applyTerm = res.data.applyTerm || ''
    }
}
// 支付尾款
const goPayIsshow = ref(false) // 显示弹窗  先获取taskNo  之后再弹窗支
const goToXHPay = () => {
    appBridge('payStagesOrder')
}
const goStagDetail = () => {
    const pathName = '/container/stag/' + amount.orderNo + '/9999'
    router.push({
        path: pathName
    })
}

</script>
<style lang="scss" scoped>
@mixin font-color {
    margin-right: 8px;
    font-size: 22px;
}
.bill-bg{
    height: 100vh;
    background: #f4f5f5;
    box-sizing: border-box;
    padding: 0 30px;
    }
.bill {
    // height: 100vh;
    background: #f4f5f5;
    .bill-list{
        padding-top: 20px;
        .bill-item{
            background-color: #FFFFFF;
            border-radius: 16px;
            margin-bottom: 20px;
        }
        .bill-item-top{
            height: 81px;
            line-height: 81px;
            padding: 0 30px;
            font-size: 25px;
            font-weight: 700;
        }
        .bill-item-top-content{
            width: 100%;
            height: 99%;
        }
        .bill-detail{
            font-size: 26px;
            color: #696969;
        }
        .bill-other{
            font-size: 40px;
            color: #000;
            padding-top: 8px;
        }
        .bill-repayment{
            font-size: 40px;
            color: #FE7E41;
            padding-top: 8px;
        }
        .bill-overdue{
            font-size: 40px;
            color: #FF1E19;
            padding-top: 8px;
        }
        .bill-refund{
            font-size: 40px;
            color: #999999;
        }
        .bill-settle{
            font-size: 40px;
            color: #68BD49;
        }
        .bill-item-main{
            display: flex;
            padding: 24px 30px 14px 30px;
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
        .bill-img{
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
        .bill-content{
            flex: 1;
            font-size: 24px;
            color: #333333;
            .text-left{
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #999999;
                line-height: 36px;
                padding-bottom: 16px;
                .bill-fee{
                    color: #191919;
                    float: right;
                }
                .bill-icon{
                    float: right;
                }
            }
        }
        .bill-item-main-detail{
            display: flex;
            padding: 36px 30px 18px 30px;
            background-color: #FFFFFF;
            .bill-content{
                flex: 1;
                font-size: 24px;
                color: #333333;
                .text-left{
                    font-size: 26px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #999999;
                    line-height: 36px;
                    padding-bottom: 16px;
                    .span-top-left{
                        font-size: 30px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #191919;
                        line-height: 42px;
                    }
                    .span-top-right{
                        color: #191919;
                        float: right;
                    }
                    .rent-fee{
                        font-size: 30px;
                        font-weight: 500;
                        color: #191919;
                    }
                    .service-fee{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                    }
                    .span-bottom-left{
                        font-size: 24px;
                        font-weight: 400;
                        color: #999999;
                    }
                    .span-bottom-right{
                        font-size: 24px;
                        font-weight: 400;
                        color: #696969;
                        float: right;
                    }
                    .bottom-right-red{
                        color: #FF1E19;
                    }
                }
            }
        }
        .content-height{
            height: 130px;
            color: #f4f5f5 !important;
        }
        .bill-pay{
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
}
</style>
