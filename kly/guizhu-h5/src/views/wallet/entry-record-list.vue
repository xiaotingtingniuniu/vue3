<template>
    <div class="entry-record-list-page">
        <div class="cascader-box">
            <div class="cascader-bar" @click="datePicker=true">
                <div>{{ startDate }} ~ {{ endDate }}</div>
                <img :src="require('@/assets/replenishmentImg/triangle@2x.png')" alt="" />
            </div>
        </div>
        <div class="data-group">
            <van-tabs v-model:active="active" color="#FD7E41" @change="getList(1)" title-active-color="#FD7E41" title-inactive-color="#191919">
                <van-tab v-if="$route.query.payMethodListLength==='2'" name="07" title="微信"></van-tab>
                <van-tab name="01" title="小恒收款"></van-tab>
            </van-tabs>
            <div class="data-list" v-if="active==='07'">
                <div class="tips">货款结算至微信账户，请登录微信操作提现</div>
                <template v-if="wxList.length">
                    <div class="cell" v-for="(item, index) in wxList" :key="index" @click="goDetail(item)">
                        <div class="cell-top">
                            <div>{{ `订单${item.subOrderNo}` }}</div>
                            <div>{{ Number(item.incomAmount) >= 0 ? `+${Number(item.incomAmount).toFixed(2)}` : Number(item.incomAmount).toFixed(2) }}</div>
                        </div>
                        <div class="cell-bottom">
                            <div>{{ item.settleEndTime.replace('T', ' ') }}</div>
                            <div></div>
                        </div>
                    </div>
                </template>
                <div class="no-data-box" v-else>
                    <img class="no-data" src="@/assets/empty@2x.png" />
                    <p class="no-data-text">暂无数据</p>
                </div>
            </div>
            <div class="data-list" v-if="active==='01'">
                <div class="tips">货款结算至小恒收款账户，请至我的收入操作提现</div>
                <van-list v-if="list.length" v-model:loading="loading" @load="getList" :finished="finished" finished-text="没有更多了" :immediate-check="false" offset="50">
                    <div class="cell" v-for="(item, index) in list" :key="index" @click="goDetail(item)">
                        <div class="cell-top">
                            <div>{{ item.orderFlagDesc }}{{ item.subOrderNo }}</div>
                            <div>{{ Number(item.amount.replace('+', "")) >= 0 ? `+${Number(item.amount.replace('+', "")).toFixed(2)}` : Number(item.amount.replace('+', "")).toFixed(2) }}</div>
                        </div>
                        <div class="cell-bottom">
                            <div>{{ item.busiTime }}</div>
                            <div v-if="active==='07'"></div>
                            <div v-else>余额：{{ Number(item.balanceAmount).toFixed(2) }}</div>
                        </div>
                    </div>
                </van-list>
                <div class="no-data-box" v-else>
                    <img class="no-data" src="@/assets/empty@2x.png" />
                    <p class="no-data-text">暂无数据</p>
                </div>
            </div>
        </div>
        <van-calendar v-model:show="datePicker" color="#FE7E41" :default-date="[new Date(startDate), new Date(endDate)]" type="range" :max-range="180" @confirm="onConfirm" :min-date="new Date('2019/01/01')" :max-date="new Date()" />
    </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { newPage } from '@/utils/composables'
import { incomeList, subledgerList } from '@/api/wallet.js'
import { getDate, funDate } from '@/utils'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const route = useRoute()
const active = ref(null)
onBeforeMount(() => {
    if (route.query.payMethodListLength === '2') {
        active.value = '07'
    } else {
        active.value = '01'
    }
    getList(1)
})

// 开始日期/结束日期
const startDate = ref(funDate(-29))
const endDate = ref(getDate(new Date()))
// 日期插件
const datePicker = ref(false)
const onConfirm = (values) => {
    const [start, end] = values
    datePicker.value = false
    startDate.value = getDate(start)
    endDate.value = getDate(end)
    getList(1)
}

const list = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const finished = ref(false)
const getList = async (num) => {
    loading.value = true
    if (num) {
        if (active.value === '07') {
            return getWxList()
        }
        finished.value = false
        page.value = 1
    }
    const params = {
        acctType: active.value,
        startDate: startDate.value,
        endDate: endDate.value,
        page: page.value,
        pageSize
    }
    const res = await incomeList(params)
    if (res.data.length < pageSize) (finished.value = true)
    if (page.value === 1) {
        list.value = res.data || []
    } else {
        list.value = [...list.value, ...res.data || []]
    }
    page.value++
    loading.value = false
}

const wxList = ref([])
const getWxList = async () => {
    const res = await subledgerList({
        merchantNo: userInfo.value.merchantId,
        startDate: startDate.value,
        endDate: endDate.value
    })
    if (res.code === '200') {
        wxList.value = res.data
    }
}

// orderFlag => 0:订单，1:提现(无详情)，2:租赁还款，3:分期还款，4:充值(无详情)
const goDetail = (item) => {
    if (active.value === '07') {
        newPage(`/entry-record-detail?digest=订单${item.subOrderNo}&amount=${Number(item.incomAmount)}&busiTime=${item.settleEndTime.replace('T', ' ') || '--'}&balanceAmount=-&subOrderNo=${item.subOrderNo}&settlementUnitNo=${item.settlementUnitNo || '--'}&orderFlag=0`, {
            digest: `订单${item.subOrderNo}`,
            amount: Number(item.incomAmount),
            busiTime: item.settleEndTime.replace('T', ' '),
            balanceAmount: '-',
            subOrderNo: item.subOrderNo,
            settlementUnitNo: item.settlementUnitNo || '--',
            orderFlag: 0
        })
    } else {
        newPage(`/entry-record-detail?digest=${item.orderFlagDesc}${item.subOrderNo}&amount=${Number(item.amount.replace('+', ''))}&busiTime=${item.busiTime || '--'}&balanceAmount=${item.balanceAmount}&subOrderNo=${item.subOrderNo}&settlementUnitNo=${item.settlementUnitNo || '--'}&orderFlag=${item.orderFlag}`, {
            digest: `${item.orderFlagDesc}${item.subOrderNo}`,
            amount: item.amount,
            busiTime: item.busiTime,
            balanceAmount: item.balanceAmount,
            subOrderNo: item.subOrderNo,
            settlementUnitNo: item.settlementUnitNo || '--',
            orderFlag: item.orderFlag
        })
    }
}

</script>
<style lang="scss" scoped>
.entry-record-list-page {
    .cascader-box {
        background: #ffffff;
        padding: 20px 30px;
        .cascader-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #f3f5f6;
            border-radius: 32px;
            padding: 12px 40px 10px;
            div {
                width: 0;
                flex: 1;
                text-align: center;
                font-size: 30px;
                font-weight: 400;
                color: #191919;
            }
            img {
                width: 20px;
                height: 12px;
            }
        }
    }
    .data-group {
        margin-top: 20px;
        .data-list {
            .tips {
                font-size: 26px;
                font-weight: 400;
                color: #a3773e;
                padding: 22px 54px;
                background: linear-gradient(270deg, #fffcf0 0%, #fff8dd 100%);
            }
            .cell:last-child {
                border-bottom: initial;
            }
            .cell {
                padding: 36px 30px 32px;
                border-bottom: 1px solid #f4f5f5;
                background: #ffffff;
                .cell-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 30px;
                    font-weight: 400;
                    color: #191919;
                    div:nth-child(2) {
                        font-size: 30px;
                        font-weight: 500;
                        color: #ff1e19;
                    }
                }
                .cell-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 8px;
                    div:nth-child(2) {
                        font-size: 26px;
                        font-weight: 400;
                        color: #999999;
                    }
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
