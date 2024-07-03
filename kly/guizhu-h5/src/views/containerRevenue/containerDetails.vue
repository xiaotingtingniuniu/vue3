<template>
    <div class="containerDetails">
        <!-- <div class="addItemTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">收入详情</span>
        </div> -->
        <!-- 分账信息 -->
        <div class="ledgerBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    分账信息
                </div>
            </div>
            <div class="transverse"></div>
            <div class="order">
                <div class="orderLeft">
                    订单金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.totalAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="containerInfo.incomeInfo.settlementType === 2">
                <div class="orderLeft">
                    结算前退款金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.refundAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="containerInfo.kaType === 1">
                <div class="orderLeft">
                    积分抵扣
                </div>
                <div class="orderRight">
                    {{containerInfo.incomeInfo.pointsNumber}}中邮学分
                </div>
            </div>
            <div class="order" v-if="roleName === '分账人'">
                <div class="orderLeft">
                    清分金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.unsplitAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName === '分账人'">
                <div class="orderLeft">
                    分账比例
                </div>
                <div class="orderRight">
                    {{containerInfo.incomeInfo.rate}}%
                </div>
            </div>
            <div class="order" v-if="containerInfo.incomeInfo.refundNode === 1">
                <div class="orderLeft">
                    结算前退款金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.refundAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName!== '分账人'">
                <div class="orderLeft">
                    平台服务费
                </div>
                <div class="orderRight">
                    {{((containerInfo.incomeInfo.platServiceFee) / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName!== '分账人' && busiCode !== 'A1001003'">
                <div class="orderLeft">
                    算法使用费
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.algorithmFeeAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName!== '分账人'">
                <div class="orderLeft">
                    微信支付结算费
                </div>
                <div class="orderRight">
                    {{containerInfo.incomeInfo.refundNode === 2 ? '+' : ''}}{{(containerInfo.incomeInfo.wechatServiceFee / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName!== '分账人' && containerInfo.incomeInfo.existSubledgers === 1">
                <div class="orderLeft">
                    分账人金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.otherSubAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName!== '分账人'">
                <div class="orderLeft">
                    商户收入
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.recordedAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="order" v-if="roleName === '分账人'">
                <div class="orderLeft">
                    入账总金额
                </div>
                <div class="orderRight">
                    {{(containerInfo.incomeInfo.recordedAmount / 100).toFixed(2)}}元
                </div>
            </div>
            <div class="recordedAmountInfo">
                <div class="order">
                    <div class="orderLeft">
                        分账金额
                        <img class="remarkIcon" src="../../assets/question.png" @click="showRemark1">
                    </div>
                    <div class="orderRight">
                        <template v-if="containerInfo.incomeInfo.refundNode === 2">
                            {{(containerInfo.incomeInfo.refundAmount / 100).toFixed(2)}}元
                        </template>
                        <template v-else>
                            {{(containerInfo.incomeInfo.merchantAmount / 100).toFixed(2)}}元
                        </template>
                    </div>
                </div>
                <div class="remarkText" v-if="amountRemark1">
                    <span>
                        该款项结算至收款人账户
                    </span>
                </div>
                <div class="order">
                    <div class="orderLeft">
                        优惠券补贴
                        <img class="remarkIcon" src="../../assets/question.png" @click="showRemark2">
                    </div>
                    <div class="orderRight">
                        <template v-if="containerInfo.incomeInfo.refundNode === 2">
                            {{(containerInfo.incomeInfo.platSubsidyBack / 100).toFixed(2)}}元
                        </template>
                        <template v-else>
                            {{(containerInfo.incomeInfo.merchantDisctAmount / 100).toFixed(2)}}元
                        </template>
                    </div>
                </div>
                <div class="remarkText" v-if="amountRemark2">
                    <span>
                        该款项请至“财务管理-补贴提现”查询并提现
                    </span>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    收款方
                </div>
                <div class="orderRight">
                    {{containerInfo.incomeInfo.payee}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    结算状态
                </div>
                <div class="orderRight">
                    <template v-if="containerInfo.incomeInfo.settlementType === 2">
                        <span>退款成功</span>
                    </template>
                    <template v-else>
                        <span v-if="containerInfo.incomeInfo.settlementStatus === 0">待结算</span>
                        <span v-if="containerInfo.incomeInfo.settlementStatus === 1">结算中</span>
                        <span v-if="containerInfo.incomeInfo.settlementStatus === 2">结算成功</span>
                    </template>
                </div>
            </div>
            <div class="order" v-if="containerInfo?.incomeInfo?.skuName">
                <div class="orderLeft">
                    商品名称
                </div>
                <div class="orderRight">
                    {{ containerInfo.incomeInfo.skuName }}
                </div>
            </div>
            <div class="order" v-if="containerInfo.incomeInfo.settlementAccountDesc && busiCode !== 'A1001003'">
                <div class="orderLeft">
                    结算账户
                </div>
                <div class="orderRight">
                    {{ containerInfo.incomeInfo.settlementAccountDesc }}
                </div>
            </div>
            <div class="orderBox">
                <div class="orderLeft">
                    结算时间
                </div>
                <div class="orderRight">
                    {{containerInfo.incomeInfo.settlementTime.replace('T', ' ')}}
                </div>
            </div>
        </div>
        <!-- 订单信息 -->
        <div class="information">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    订单信息
                </div>
                <!-- 当订单为手动创建的补扣订单时，显示查看原订单 -->
                <!-- <span class="originalBox" @click="viewDetails">查看详情</span>
                <img src="../../assets/replenishmentImg/arrow@2x.png" alt="" class="originalImg" @click="viewDetails"> -->
            </div>
            <div class="transverse"></div>
            <div class="order">
                <div class="orderLeft">
                    订单编号
                </div>
                <div class="orderRight">
                    <van-button class="copyBox" @click="copyCode(containerInfo.orderInfo.subOrderNo)">复制</van-button>
                    <div @click="jump(containerInfo.orderInfo.subOrderNo, '已完成')">
                        {{containerInfo.orderInfo.subOrderNo}}
                        <img v-if="busiCode!=='A1001003'" src="@/assets/replenishmentImg/right@2x.png" alt="" class="rightBox">
                    </div>
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    支付时间
                </div>
                <div class="orderRight">
                    {{containerInfo.orderInfo.payTime}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    支付类型
                </div>
                <div class="orderRight">
                    {{containerInfo.orderInfo.payTypeDesc}}
                </div>
            </div>
            <div class="order" v-if="containerInfo.kaType === 1">
                <div class="orderLeft">
                    订单来源
                </div>
                <div class="orderRight">
                    {{containerInfo.orderInfo.platformDesc}}
                </div>
            </div>
            <div class="order" v-if="busiCode === 'A1001003'">
                <div class="orderLeft">
                    券码ID
                </div>
                <div class="orderRight">
                    {{containerInfo.orderInfo.settlementUnitNo}}
                </div>
            </div>
        </div>
        <!-- 设备信息 -->
        <div class="equipmentBox">
            <div class="informationBox">
                <span class="line"></span>
                <div class="informationTitle">
                    {{ busiCode !== 'A1001003' ? '设备信息' : '店铺信息'}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{ busiCode !== 'A1001003' ? '设备编号' : '店铺ID'}}
                </div>
                <div class="orderRight">
                    {{containerInfo.deviceInfo.deviceNo}}
                </div>
            </div>
            <div class="order">
                <div class="orderLeft">
                    {{ busiCode !== 'A1001003' ? '设备名称' : '店铺名称'}}
                </div>
                <div class="orderRight">
                    {{containerInfo.deviceInfo.deviceName}}
                </div>
            </div>
            <div class="order" v-if="roleName !== '分账人' && busiCode !== 'A1001003'">
                <div class="orderLeft">
                    设备地址
                </div>
                <div class="withinRight">
                    {{containerInfo.deviceInfo.address}}
                </div>
            </div>
            <div class="order" v-if="busiCode !== 'A1001003'">
                <div class="orderLeft">
                    设备类型
                </div>
                <div class="withinRight">
                    {{containerInfo.deviceInfo.deviceTypeDesc}}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { incomeDetail } from '@/api/container.js'
import { useRoute } from 'vue-router'
import Clipboard from 'clipboard'
import { Toast } from 'vant'
import { newPage } from '@/utils/composables'
import store from '@/store'

const route = useRoute()
const roleName = computed(() => store.state.roleName)
const busiCode = computed(() => store.state.busiCode)

const amountRemark1 = ref(false)
const amountRemark2 = ref(false)
const containerInfo = ref({

    deviceInfo: {
        deviceNo: '',
        deviceName: '',
        address: ''
    },
    incomeInfo: {
        refundNode: 0,
        totalAmount: 0,
        algorithmFeeAmount: 0,
        platServiceFee: 0,
        subledgerAmount: 0,
        recordedAmount: 0,
        wechatServiceFee: 0,
        payee: '',
        settlementStatus: 0,
        settlementTime: '',
        refundAmount: 0,
        merchantAmount: 0,
        platSubsidyBack: 0,
        merchantDisctAmount: 0
    },
    orderInfo: {
        subOrderNo: '',
        orderNo: '',
        payTime: '',
        payType: ''
    }
})

const showRemark1 = () => {
    amountRemark1.value = !amountRemark1.value
}
const showRemark2 = () => {
    amountRemark2.value = !amountRemark2.value
}

const init = async () => {
    const params = {
        billNo: route.params.billNo
    }
    if (route.query.roleBillCode) {
        params.roleBillCode = route.query.roleBillCode
        params.settlementUnitNo = route.params.billNo
        params.billNo = null
    }
    const res = await incomeDetail(params)
    if (res.code === '200') {
        containerInfo.value = res.data
    }
}
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
// 点击按钮跳转到订单详情
const jump = (val, orderStatus) => {
    // 本地生活订单详情未开发 暂不跳转
    if (busiCode.value === 'A1001003') return false
    newPage(`/details/${val}/${orderStatus}?showNavbar=${0}`)
}
init()
</script>
<style lang="scss">
.containerDetails{
    overflow: auto;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    .addItemTitle {
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
    .ledgerBox{
        width: 690px;
        min-height: 497px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
    }
    .information{
        width: 690px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        margin-left: 30px;
        padding-bottom: 30px;
        .originalBox{
            font-size: 26px;
            font-weight: 400;
            color: #FE7E41;
            margin-left: 372px;
            margin-top: 5px;
        }
        .originalImg{
            width: 24px;
            height: 24px;
            margin-left: 10px;
            margin-top: 10px;
        }
    }
    .equipmentBox{
        width: 690px;
        // height: 322px;
        background: #FFFFFF;
        border-radius: 8px;
        margin-top: 20px;
        padding-bottom: 40px;
        margin-left: 30px;
        .withinRight{
            width: 470px;
            color: #191919;
            margin-right: 30px;
            text-align: right;
            font-size: 26px;
        }
    }
    .informationBox{
        display: flex;
        padding-top: 26px;
    }
    .line{
        width: 10px;
        height: 28px;
        background: #FE7E41;
        display: block;
        margin-top: 6px;
    }
    .informationTitle{
        font-size: 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #191919;
        margin-left: 20px;
    }
    .transverse{
        width: 631px;
        height: 2px;
        margin-left: 30px;
        background: #F2F6F9;
        margin-top: 17px;
    }
    .order{
        display: flex;
        justify-content:space-between;
        margin-top: 25px;
    }
    .orderBox{
        display: flex;
        justify-content:space-between;
        margin-top: 25px;
        padding-bottom: 25px;
    }
    .recordedAmountInfo{
        background: #F9F9F9;
        border-radius: 4px;
        margin: 0 30px;
        margin-top: 25px;
        padding-bottom: 25px;
        border: 1px solid #F9F9F9;
        .orderLeft{
            margin-left: 24px;
        }
        .remarkIcon{
            display: inline-block;
            width: 26px;
            height: 26px;
            line-height: 26px;
        }
        .remarkText{
            font-size: 22px;
            color: #FF1E19;
            padding-left: 24px;
        }
    }
    .orderLeft{
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;
        margin-left: 30px;
        margin-right: 30px;
        word-break: keep-all;
    }
    .orderRight{
        font-size: 26px;
        font-weight: 400;
        color: #191919;
        margin-right: 30px;
        display: flex;
        align-items: center;
        .copyBox{
            // width: 70px;
            height: 34px;
            background: #FFF5F0;
            border-radius: 17px;
            font-size: 24px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FE7E41;
            margin-left: 10px;
            padding: 0 16px;
        }
        .rightBox{
            width: 12px;
            height: 22px;
            margin-left: 16px;
            margin-top: 9px;
        }
    }
}
</style>
