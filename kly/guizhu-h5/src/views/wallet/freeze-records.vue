<template>
    <div class="freeze-records-page">
        <div class="cascader-box">
            <div class="cascader-bar" @click="datePicker=true">
                <div>{{ startDate }} ~ {{ endDate }}</div>
                <img :src="require('@/assets/replenishmentImg/triangle@2x.png')" alt="" />
            </div>
        </div>
        <div class="cell-group">
            <van-list v-if="list.length" v-model:loading="loading" @load="getList" :finished="finished" finished-text="没有更多了" :immediate-check="false">
                <div class="cell" v-for="(item, index) in list" :key="index">
                    <div class="left">
                        <div>{{ item.digest || '--' }}</div>
                        <div>{{ item.busiTime || '--' }}</div>
                    </div>
                    <div class="right">
                        <div>{{ Number(item.amount).toFixed(2) }}</div>
                        <div></div>
                    </div>
                </div>
            </van-list>
            <div class="no-data-box" v-else>
                <img class="no-data" src="@/assets/empty@2x.png" />
                <p class="no-data-text">暂无数据</p>
            </div>
        </div>
        <van-calendar v-model:show="datePicker" color="#FE7E41" :max-range="180" :default-date="[new Date(startDate), new Date(endDate)]" type="range" @confirm="onConfirm" :min-date="new Date('2019/01/01')" :max-date="new Date()" />
    </div>
</template>
<script setup>
import { ref, onBeforeMount } from 'vue'
import { frozenList } from '@/api/wallet.js'
import { getDate, funDate } from '@/utils'

onBeforeMount(() => {
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
    if (num) {
        finished.value = false
        page.value = 1
    }
    const params = {
        acctType: '07',
        startDate: startDate.value,
        endDate: endDate.value,
        page: page.value,
        pageSize
    }
    const res = await frozenList(params)
    if (res.data.length < pageSize) (finished.value = true)
    if (page.value === 1) {
        list.value = res.data || []
    } else {
        list.value = [...list.value, ...res.data || []]
    }
    loading.value = false
    page.value++
}

</script>
<style lang="scss" scoped>
.freeze-records-page {
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
    .cell-group {
        margin-top: 20px;
        .cell {
            display: flex;
            background: #ffffff;
            align-items: center;
            justify-content: space-between;
            padding: 36px 30px 32px;
            border-bottom: 1px solid #f4f5f5;
            .left {
                div {
                    font-size: 30px;
                    font-weight: 400;
                    color: #191919;
                }
                div:nth-child(2) {
                    font-size: 26px;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 8px;
                }
            }
            .right {
                text-align: right;
                div {
                    font-size: 30px;
                    font-weight: 500;
                }
                div:nth-child(2) {
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
