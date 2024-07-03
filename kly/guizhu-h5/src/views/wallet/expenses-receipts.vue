<template>
    <div class="expenses-receipts-page">
        <div class="main-message">
            <div class="change-month">
                <van-field v-model="selectDate" :clearable='true' readonly @click="shpwPop"/>
                <img src="@/assets/replenishmentImg/triangle@2x.png" alt="" class="chooseImg">
            </div>
            <van-popup
                v-model:show="monthShow"
                position="bottom"
            >
                <van-datetime-picker
                    v-model="currentMonth"
                    type="year-month"
                    title="选择日期"
                    :show-toolbar="true"
                    :min-date="minDate"
                    :max-date="maxDate"
                    :formatter="formatter"
                    @cancel="closeDate()"
                    @confirm='determine()'
                />
            </van-popup>
            <div class="info" v-if="billInfo.incomeInfo || billInfo.payOutInfo || billInfo.unpaidAmountInfo">
                <span class="info-part">
                    <span class="title">收入</span>
                    <span class="count">¥{{(billInfo.incomeAmount / 100).toFixed(2)}}</span>
                </span>
                <span class="info-part">
                    <span class="title">待付金额</span>
                    <span class="count">¥{{(billInfo.unpaidAmount / 100).toFixed(2)}}</span>
                </span>
                <span class="info-part">
                    <span class="title">预估结余</span>
                    <span class="count">¥{{(billInfo.preBalanceAmount / 100).toFixed(2)}}</span>
                    <van-popover placement="bottom-start" v-model:show="showPopover4" teleport=".expenses-receipts-page">
                        <div class="popover">结余=收入-待付金额</div>
                        <template #reference>
                            <img :src="require('@/assets/tip-icon.png')" alt="" />
                        </template>
                    </van-popover>
                </span>
                <span class="preBalance-remark" v-if="billInfo.preBalanceAmount < 0">
                    <span class="title">结余不足，为保证扣款成功请充值</span>
                </span>
            </div>
            <div class="info" v-else>
                <span class="no-bill">
                    账单暂未生成
                </span>
            </div>
        </div>
        <div class="model" v-if="billInfo.incomeInfo">
            <div class="header">
                <div class="cell">
                    <span class="left">
                        收入
                        <van-popover placement="bottom-start" v-model:show="showPopover1" teleport=".expenses-receipts-page">
                            <div class="popover">小恒收款账户月度收入汇总，积分支付订单默认不计入</div>
                            <template #reference>
                                <img :src="require('@/assets/tip-icon.png')" alt="" />
                            </template>
                        </van-popover>
                    </span>
                    <span class="right">{{billInfo.incomeAmount / 100}}</span>
                </div>
            </div>
            <div class="message-box">
                <div class="cell" v-for="(item, index) in billInfo.incomeInfo" :key="index">
                    <span class="left">
                        {{item.entityUserName}}（{{item.settlementChannelDesc}}）
                        <span class="status_noentry" v-if="item.entryCodeDesc === '不入账'">不计入</span>
                    </span>
                    <span class="right">{{item.amount / 100}}</span>
                </div>
            </div>
        </div>
        <div class="model" v-if="billInfo.payOutInfo">
            <div class="header">
                <div class="cell">
                    <span class="left">
                        支出
                        <van-popover placement="bottom-start" v-model:show="showPopover2" teleport=".expenses-receipts-page">
                            <div class="popover">若商家经营期间违反平台规定或被第三方发起投诉、举报等，平台有权冻结商家交易结算款项，商家可联系平台处理。</div>
                            <template #reference>
                                <img :src="require('@/assets/tip-icon.png')" alt="" />
                            </template>
                        </van-popover>
                    </span>
                    <span class="right">{{billInfo.payOutAmount / 100}}</span>
                </div>
            </div>
            <div class="message-box">
                <div class="cell" v-for="(item, index) in billInfo.payOutInfo" :key="index">
                    <span class="left">
                        {{item.feeCodeDesc}}（{{item.settlementChannelDesc}}）
                        <!-- <span class="status_noentry" v-if="item.entryCodeDesc === '不入账'">不计入</span> -->
                        <span class="status_over" v-if="item.payStatusDesc === '支付成功'">已还款</span>
                    </span>
                    <span class="right">{{item.amount / 100}}</span>
                </div>
            </div>
        </div>
        <div class="model" v-if="billInfo.unpaidAmountInfo">
            <div class="header">
                <div class="cell">
                    <span class="left">
                        待付金额
                        <van-popover placement="bottom-start" v-model:show="showPopover3" teleport=".expenses-receipts-page">
                            <div class="popover">积分支付订单产生的算法使用费和平台服务费需要商家缴纳，计入待付金额，会从商家余额中扣除；其他分账人金额需要商家自行处理。</div>
                            <template #reference>
                                <img :src="require('@/assets/tip-icon.png')" alt="" />
                            </template>
                        </van-popover>
                    </span>
                    <span class="right">{{billInfo.unpaidAmount / 100}}</span>
                </div>
            </div>
            <div class="message-box">
                <div class="cell" v-for="(item, index) in billInfo.unpaidAmountInfo" :key="index">
                    <span class="left">
                        {{item.payeeName}}（{{item.settlementChannelDesc}}）
                        <span class="status_noentry" v-if="item.entryCodeDesc === '不入账'">不计入</span>
                    </span>
                    <span class="right">{{item.amount / 100}}</span>
                </div>
            </div>
        </div>
        <!-- <div class="cell-group">
            <van-list v-if="billInfo.length" v-model:loading="loading" @load="getbillInfo" :finished="finished" finished-text="没有更多了" :immediate-check="false">
                <div class="cell" @click="goDetail(item)" v-for="(item, index) in billInfo" :key="index">
                    <div class="left">
                        <div class="digest">{{ item.statusDesc || '--' }}</div>
                        <div>{{ item.busiTime }}</div>
                    </div>
                    <div class="right">
                        <div :class="Number(item.amount) < 0 ? 'color--black' : ''">{{ Number(item.amount) > 0 ? `+${Number(item.amount).toFixed(2)}` : Number(item.amount).toFixed(2) }}</div>
                        <div>余额：￥{{ Number(item.balanceAmount).toFixed(2) }}</div>
                    </div>
                </div>
            </van-list>
        </div> -->
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
// import { newPage } from '@/utils/composables'
import { querySettlementBill } from '@/api/wallet'

const showPopover1 = ref(false)
const showPopover2 = ref(false)
const showPopover3 = ref(false)
const showPopover4 = ref(false)
// 选择月份的弹窗
const monthShow = ref(false)
const billInfo = ref([])
const page = ref(1)
const loading = ref(false)
const finished = ref(false)
const years = ref([])

const _D = new Date()
// 选中日期
const selectDate = ref('')
const currentMonth = ref(new Date())
// 最小时间
const minDate = new Date(2022, 0, 1)
// 最大时间
const maxDate = new Date()
// 格式化
const formatter = (type, val) => {
    if (type === 'year') {
        return `${val}年`
    }
    if (type === 'month') {
        return `${val}月`
    }
    return val
}
// 初始时间-年
const initYear = (startYear = 2022) => {
    // const D = new Date()
    const Y = _D.getFullYear()
    const yearArr = []
    for (let i = startYear; i <= Y; i++) {
        yearArr.push({ text: i + '年', value: i })
    }
    return yearArr
}
// 时间确定按钮
const determine = () => {
    monthShow.value = false
    selectDate.value = timeFormat(currentMonth.value)
    console.log(selectDate.value)
    getbillInfo()
}
const timeFormat = (tiem) => {
    const year = tiem.getFullYear()
    const month = tiem.getMonth() + 1
    return year + '年' + month + '月'
}
// 显示弹窗
const shpwPop = () => {
    monthShow.value = true
}
// 关闭弹窗
const closeDate = () => { // 关闭弹层
    monthShow.value = false
}
const getbillInfo = async (num) => {
    loading.value = true
    if (num) {
        finished.value = false
        page.value = 1
    }
    const D = new Date(currentMonth.value)
    const res = await querySettlementBill({
        billMonth: `${D.getFullYear()}-${(D.getMonth() + 1) > 9 ? (D.getMonth() + 1) : '0' + (D.getMonth() + 1)}`
    })
    billInfo.value = res.data
}
// 进入页面加载
onMounted(() => {
    years.value = initYear()
    selectDate.value = `${_D.getFullYear()}年${_D.getMonth() + 1}月`
    getbillInfo()
})
</script>
<style lang="scss" scoped>
.popover {
    max-width: 400px;
    padding: 18px 28px;
    background-color: #ffe8bc;
    font-size: 26px;
    font-weight: 400;
    color: #9d7b35;
}
:deep(.van-popover__arrow) {
    color: #ffe8bc !important;
}
.expenses-receipts-page{
    .main-message{
        border-bottom: 1px solid #F4F5F5;
        .change-month{
            // background: #F7F7F7;
            // position: relative;
            // // display: flex;
            // // justify-content:space-between;
            .van-cell{
                // width: 230px;
                width: 400px;
                // position: relative;
                background: #F7F7F7;
                margin-left: 10px;
            }
            .chooseImg{
                position: absolute;
                width: 20px;
                height: 13px;
                top:35px;
                left: 215px;
            }
            .chooseUrl{
                position: absolute;
                width: 20px;
                height: 13px;
                top:35px;
                left: 270px;
            }
            .penRight{
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #B0B0B0;
                // margin-left: 244px;
                margin-top: 25px;
                margin-right: 30px;
            }
        }
        .info{
            background-image: url('../../assets/bills-top-bg.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
            padding: 40px 20px 40px 30px;
            .no-bill{
                display: inline-block;
                height: 144px;
                line-height: 144px;
                color: #696969;
                font-size: 36px;
            }
            .info-part{
                display: inline-block;
                width: 50%;
                height: 55px;
                line-height: 55px;
                .title{
                    font-size: 24px;
                    display: inline-block;
                    margin-right: 16px;
                }
                .count{
                    font-size: 36px;
                    font-weight: 500;
                }
                :deep(.van-popover__wrapper) {
                    width: 26px;
                    height: 28px;
                    // display: block;
                    margin-left: 12px;
                    img {
                        width: 26px;
                        height: 28px;
                        vertical-align: middle;
                        margin-bottom: 4px;
                    }
                }
            }
            .preBalance-remark{
                display: block;
                font-size: 24px;
                color: #FF1E19;
            }
        }
    }
    .model{
        padding: 30px;
        background: #fff;
        border-bottom: 1px solid #F4F5F5;
        .header{
            :deep(.van-popover__wrapper) {
                width: 26px;
                height: 28px;
                // display: block;
                margin-left: 12px;
                img {
                    width: 26px;
                    height: 28px;
                    vertical-align: middle;
                    margin-bottom: 4px;
                }
            }
            .cell{
                display: flex;
                align-items: center;
                justify-content: space-between;
                .left{
                    font-size: 30px;
                    font-weight: 500;
                }
                .right{
                    margin-right: 18px;
                    font-size: 30px;
                    font-weight: 500;
                }
            }
        }
        .message-box{
            background: #F9F9F9;
            border-radius: 16px;
            padding: 20px 24px;
            margin-top: 30px;
            .cell{
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 16px;
                .left{
                    font-size: 26px;
                    font-weight: 500;
                    color: #696969;
                    .status_noentry{
                        font-size: 20px;
                        color: #999;
                        border: 2px solid #979797;
                        border-radius: 17px;
                        display: inline-block;
                        padding: 0 10px;
                    }
                    .status_over{
                        font-size: 20px;
                        color: #FE7E41;
                        background: rgba(254, 126, 65, 0.2);
                        border-radius: 17px;
                        display: inline-block;
                        padding: 1px 11px;
                    }
                }
                .right{
                    font-size: 26px;
                    font-weight: 500;
                    color: #191919;
                }
            }
            .cell:last-child{
                padding-bottom: 0;
            }
        }
    }
}
</style>
