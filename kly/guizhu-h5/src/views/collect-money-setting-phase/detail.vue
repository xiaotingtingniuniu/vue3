<template>
    <div class="collect-money-detail">
        <div class="card">
            <div class="title"><span>{{ $route.query.name }}</span>{{ $route.query.mobileScret }}</div>
            <div class="cell-box">
                <div class="cell" v-for="item in data" :key="item.channel">
                    <van-image :src="imgObj[item.channel]"/>
                    <div class="channel-desc">{{ item.channelDesc }}</div>
                    <div class="status-desc" :class="`type${item.status}`">{{ item.statusDesc }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onBeforeMount, ref } from 'vue'
import { getSubLedgerPaymentMethodList } from '@/api/wallet'
import wxIcon from '@/assets/wx_logo.png'
import xhIcon from '@/assets/xh_logo.png'

const props = defineProps(['subLedgerId'])
const imgObj = {
    1: wxIcon,
    3: xhIcon
}

onBeforeMount(() => {
    getData()
})

const data = ref()
const getData = async () => {
    const res = await getSubLedgerPaymentMethodList({
        subLedgerId: props.subLedgerId
    })
    data.value = res.data
}

</script>
<style lang="scss" scoped>
.collect-money-detail{
    padding-top: 20px;
    .card{
        margin: 0 30px;
        background: #FFFFFF;
        border-radius: 8px;
        padding: 30px;
        .title{
            display: flex;
            align-items: center;
            font-size: 24px;
            font-weight: 400;
            color: #A2A7B0;
            span{
                font-size: 28px;
                font-weight: 500;
                color: #191919;
                margin-right: 16px;
            }
        }
        .cell-box{
            margin-top: 14px;
            .cell{
                margin: 20px 6px 0;
                background: #F4F5F5;
                border-radius: 8px;
                display: flex;
                align-items: center;
                padding: 42px 48px;
                .van-image{
                    width: 48px;
                    height: 48px;
                    margin-right: 16px;
                }
                .channel-desc{
                    width: 0;
                    flex: 1;
                }
                .status-desc{
                    font-size: 24px;
                    font-weight: 400;
                    color: #FE7E41;
                }
                .type0{
                    color: #999999 !important;
                }
            }
        }
    }
}
</style>
