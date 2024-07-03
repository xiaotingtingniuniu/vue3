<template>
    <div class="collect-money-setting">
        <van-tabs class="select-tabs" v-model:active="active" swipeable color="#FE7E41" @change="tabChange">
            <van-tab v-for="(item, index) in tabs" :key="index" :title="item.label" :name="item.name">
                <pay-type v-if="item.name === 'pay-type'" :wxInfo="wxInfo"></pay-type>
                <ledger-pproportion v-if="item.name === 'ledger-pproportion'"></ledger-pproportion>
                <ledger-manage v-if="item.name === 'ledger-manage'"></ledger-manage>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import PayType from './src/pay-type'
import LedgerPproportion from './src/ledger-proportion'
import LedgerManage from './src/ledger-manage'
import { merchantContractQuery } from '@/api/collect-money-setting.js'

const active = ref('pay-type')
const tabs = [
    { label: '支付方式', name: 'pay-type' },
    { label: '分账管理', name: 'ledger-manage' },
    { label: '分账比例', name: 'ledger-pproportion' }
]
const wxInfo = ref()
const applyStatus = {
    1: '初始化',
    2: '审核中',
    3: '查看详情',
    4: '签约失败',
    5: '待签约'
}
const init = async () => {
    const res = await merchantContractQuery()
    if (res.code === '200') {
        wxInfo.value = res.data.find(el => el.payChannelCode === '1')
        console.log(wxInfo.value, 'wx', applyStatus)
    }
    console.log(res.data, 'res')
}
init()
const tabChange = (name, title) => {
    console.log(name, title)
}
</script>
<style lang="scss">
.van-tabs__content--animated {
    width: 100%;
    min-height: 100vh;
}
</style>
<style lang="scss" scoped>
.collect-money-setting {
    min-height: 100vh;
    background: #F4F5F5;;
    .van-tabs, .van-tabs__content--animated {
        min-height: 100vh;
        width: 100%;
        height: 82px;
    }
    .el-tabs__content{
        height: calc(100vh - 110px);
        overflow-y: auto;
    }
}
</style>
