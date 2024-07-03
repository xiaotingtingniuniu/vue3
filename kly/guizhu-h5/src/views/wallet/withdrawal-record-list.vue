<template>
    <div class="withdrawal-record-list-page">
        <div class="cell-group">
            <van-list v-if="withdrawaList.length" v-model:loading="loading" @load="getWithdrawaList" :finished="finished" finished-text="没有更多了" :immediate-check="false">
                <div class="cell" @click="goDetail(item)" v-for="(item, index) in withdrawaList" :key="index">
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
            <div class="no-data-box" v-else>
                <img class="no-data" src="@/assets/empty@2x.png" />
                <p class="no-data-text">暂无数据</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { newPage } from '@/utils/composables'
import { queryWithdrawaList } from '@/api/wallet'

onBeforeMount(() => {
    getWithdrawaList(1)
})

const goDetail = (item) => {
    newPage(`/withdrawal-record-detail?amount=${Number(item.amount)}&busiTime=${item.busiTime}&serialNo=${item.serialNo}&balanceAmount=${item.balanceAmount}&status=${item.status}&digest=${item.digest}`, {
        amount: Number(item.amount),
        busiTime: item.busiTime,
        serialNo: item.serialNo,
        balanceAmount: item.balanceAmount,
        status: item.status,
        digest: item.digest
    })
}

const withdrawaList = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)
const getWithdrawaList = async (num) => {
    loading.value = true
    if (num) {
        finished.value = false
        page.value = 1
    }
    const res = await queryWithdrawaList({
        acctType: '01',
        page: page.value,
        pageSize
    })
    if (res.data.length < pageSize) (finished.value = true)
    if (page.value === 1) {
        withdrawaList.value = res.data || []
    } else {
        withdrawaList.value = [...withdrawaList.value, ...res.data || []]
    }
    loading.value = false
    page.value++
}
</script>
<style lang="scss" scoped>
.withdrawal-record-list-page{
    .cell-group{
        margin-top: 20px;
        .cell{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 36px 30px 32px;
            background: #FFFFFF;
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
                .digest{
                    width: 400px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
            .right{
                text-align: right;
                .color--black{
                    color: black;
                }
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
