<template>
    <div class="withdrawal-record">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list  v-model:loading="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="getWithdList">
                <div class="cell van-hairline--bottom" v-for="(item,index) in withdList" :key="index">
                    <div class="action">
                        <div class="action-txt" :class="{
                            colour_0: item.statusDesc === '提现中',
                            colour_1: item.statusDesc === '提现成功',
                            colour_2: item.statusDesc === '提现失败',
                        }">{{ item.statusDesc }}</div>
                        <div class="action-date">{{item.gtmModify}}</div>
                    </div>
                    <div class="price"><span>¥</span>{{(item.transAmount/100).toFixed(2)}}</div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { withdrawalList } from '@/api/subsidy'

const props = defineProps(['subAcctId'])

onMounted(async () => {
    await getWithdList()
})
const currentPage = ref(1)
const pageSize = ref(10)
const withdList = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const onRefresh = async () => {
    loading.value = true
    finished.value = false
    currentPage.value = 1
    await getWithdList()
}
const getWithdList = async () => {
    loading.value = true
    const parm = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        subAcctId: props.subAcctId
    }
    const res = await withdrawalList(parm)
    if (res.code === '200') {
        withdList.value = (currentPage.value === 1) ? res.object.withdrawalList : [...withdList.value, ...res.object.withdrawalList]
        if (withdList.value.length >= res.object.totalCount) {
            finished.value = true
        }
        currentPage.value++
        loading.value = false
        if (refreshing.value) refreshing.value = false
    }
}

</script>
<style lang="scss" scoped>
.withdrawal-record{
    margin-top: 20px;
    padding: 0 30px;
    background-color: #fff;
    .cell{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 36px 0;
        .action{
            .action-txt{
                font-size: 30px;
                font-weight: 400;
            }
            .action-date{
                font-size: 26px;
                font-weight: 400;
                color: #A2A7B0;
                margin-top: 12px;
            }
            .colour_0{
                color: #69925A;
            }
            .colour_1{
                color: #333333;
            }
            .colour_2{
                color: #FF2442;
            }
        }
        .price{
            font-size: 38px;
            font-weight: 400;
            color: #191919;
            font-weight: 600;
            span{
                font-size: 28px;
                margin-right: 6px;
                font-weight: 400;
            }
        }
    }
}
</style>
