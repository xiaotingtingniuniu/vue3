<template>
    <div class="subsidy-record">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list  v-model:loading="loading"
                       :finished="finished"
                       finished-text="没有更多了"
                       @load="getSubsidyList">
                <div class="cell van-hairline--bottom" v-for="(item,index) in couponSubsidy" :key="index">
                    <div class="action">
                        <div class="action-txt">订单编号：{{item.orderNoSub}}</div>
                        <div class="action-date">{{item.transTime}}</div>
                    </div>
                    <div class="price colour"><span>¥</span>{{(item.transAmount/100).toFixed(2)}}</div>
                </div>
            </van-list>
        </van-pull-refresh>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { subsidyList } from '@/api/subsidy'

const props = defineProps(['subAcctId'])
const currentPage = ref(1)
const pageSize = ref(10)
const couponSubsidy = ref([])
const refreshing = ref(false)
const loading = ref(false)
const finished = ref(false)

const onRefresh = async () => {
    loading.value = true
    finished.value = false
    currentPage.value = 1
    await getSubsidyList()
}
const getSubsidyList = async () => {
    loading.value = true
    const parm = {
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        subAcctId: props.subAcctId
    }
    const res = await subsidyList(parm)
    if (res.code === '200') {
        const tempList = (currentPage.value === 1) ? res.object.couponSubsidyList : [...couponSubsidy.value, ...res.object.couponSubsidyList]
        couponSubsidy.value = tempList
        if (tempList.length >= res.object.totalCount) {
            finished.value = true
        }
        currentPage.value++
        loading.value = false
        if (refreshing.value) refreshing.value = false
    }
}
onMounted(() => {
    getSubsidyList()
})

</script>
<style lang="scss" scoped>
.subsidy-record{
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
                color: #333333;
            }
            .action-date{
                font-size: 26px;
                font-weight: 400;
                color: #A2A7B0;
                margin-top: 12px;
            }
        }
        .price.colour{
            color: #FE7E41;
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
