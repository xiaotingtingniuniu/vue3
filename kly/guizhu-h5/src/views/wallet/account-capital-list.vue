<template>
    <div class="account-capital-list">
        <div class="cell-group" v-if="waterBillsList.length && loadState">
            <div class="cell" v-for="(item, index) in waterBillsList" :key="index" @click="goDetail(item)">
                <div class="left">
                    <div>{{item.orderFlagDesc}}{{ item.orderFlag === 1 || item.orderFlag === 4 ? '' : item.subOrderNo }}</div>
                    <div>{{item.busiTime}}</div>
                </div>
                <div class="right">
                    <div>{{ Number(item.amount) >= 0 ? `+${Number(item.amount).toFixed(2)}` : Number(item.amount).toFixed(2) }}</div>
                    <div>余额：￥{{ Number(item.balanceAmount).toFixed(2) }}</div>
                </div>
            </div>
        </div>
        <div class="no-data-box" v-else>
            <img class="no-data" src="@/assets/empty@2x.png" />
            <p class="no-data-text">暂无数据</p>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { newPage } from '@/utils/composables'
import { queryWaterBills } from '@/api/wallet'

const waterBillsList = ref([])
const loadState = ref(false)
// 获取账户明细
const getwaterBills = async () => {
    const res = await queryWaterBills({
        acctType: '02'
    })
    loadState.value = true
    if (res.code === '200') {
        waterBillsList.value = res.data
    }
}
getwaterBills()

const goDetail = (item) => {
    // const params = {
    //     amount: Number(info.amount),
    //     busiTime: info.busiTime,
    //     status: info.status,
    //     balanceAmount: info.balanceAmount,
    //     subOrderNo: info.subOrderNo
    // }
    // newPage(`/withdrawal-record-detail?amount=${params.amount}&busiTime=${params.busiTime}&status=${params.status}&balanceAmount=${params.balanceAmount}&subOrderNo=${params.subOrderNo}`, params)
    // orderFlag => 0:订单，1:提现(无详情)，2:租赁还款，3:分期还款，4:充值(无详情)
    newPage(`/entry-record-detail?digest=${item.orderFlagDesc}${item.orderFlag === 1 || item.orderFlag === 4 ? '' : item.subOrderNo}&amount=${Number(item.amount.replace('+', ''))}&busiTime=${item.busiTime || '--'}&balanceAmount=${item.balanceAmount}&subOrderNo=${item.subOrderNo}&settlementUnitNo=${item.settlementUnitNo || '--'}&orderFlag=${item.orderFlag}`, {
        digest: `${item.orderFlagDesc}${item.orderFlag === 1 || item.orderFlag === 4 ? '' : item.subOrderNo}`,
        amount: item.amount,
        busiTime: item.busiTime,
        balanceAmount: item.balanceAmount,
        subOrderNo: item.subOrderNo,
        settlementUnitNo: item.settlementUnitNo || '--',
        orderFlag: item.orderFlag
    })
}
</script>
<style lang="scss" scoped>
.account-capital-list{
    .cell-group{
        margin-top: 20px;
        background: #FFFFFF;
        .cell{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 30px 32px;
            border-bottom: 1px solid #F4F5F5;
            .left{
                div{
                    font-size: 30px;
                    font-weight: 400;
                    color: #191919;
                }
                div:nth-child(2){
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 8px;
                }
            }
            .right{
                text-align: right;
                div{
                    font-size: 30px;
                    font-weight: 500;
                    color: #FF1E19;
                }
                div:nth-child(2){
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                }
            }
        }
    }
    .no-data-box{
        min-height: calc(100vh - 124px);
        background-color: #ffffff;
        .no-data {
            width: 64%;
            display: block;
            margin: 0 auto;
            padding-top: 200px;
        }
        .no-data-text {
            font-size: 24px;
            text-align: center;
            margin-top: 24px;
            color: #666666;
        }
    }
}
</style>
