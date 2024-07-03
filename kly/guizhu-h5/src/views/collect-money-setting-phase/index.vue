<template>
    <div class="mine-content" ref="mineRef">
        <van-nav-bar title="收款设置" fixed placeholder left-arrow  @click-left="closePage" />
        <div class="divider"></div>
        <van-tabs
            class="select-tabs"
            v-model:active="active"
            color="#FE7E41"
            @change="tabChange"
            v-if="authorized.check('take-money-setting-acc-manage') && authorized.check('take-money-setting-acc-rate')"
        >
            <van-tab title="分账管理" name="ledger-manage" :sticky="true">
                <ledger-manage  :tabName="active" ref="ledgerManageRef"></ledger-manage>
            </van-tab>
            <van-tab title="分账比例" name="ledger-pproportion" :sticky="true">
                <ledger-pproportion :tabName="active" ref="ledgerRulesRef"></ledger-pproportion>
            </van-tab>
        </van-tabs>
        <div v-else>
            <ledger-manage  :tabName="active" ref="ledgerManageRef"></ledger-manage>
        </div>
        <div class="footer">
            <van-button
                type="primary"
                round
                :icon="require('@/assets/add2.png')"
                text="添加收款账户" color="#FE7E41"
                @click="ledgerManageAdd"
                v-if="active === 'ledger-manage' && authorized.check('take-money-setting-acc-manage-add')"
            >
            </van-button>
            <van-button
                type="primary"
                round
                :icon="require('@/assets/add2.png')"
                text="添加分账规则"
                color="#FE7E41"
                @click="ledgerRulesAdd"
                v-if="active === 'ledger-pproportion' && authorized.check('take-money-setting-acc-rate-add')"
            >
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { merchantSource } from '@/api/goods-transfer'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import LedgerPproportion from './src/ledger-proportion'
import LedgerManage from './src/ledger-manage'
import { closePage } from '@/utils/composables'
import authorized from '@/utils/authorized'

const store = useStore()
const route = useRoute()
const router = useRouter()
// const roleName = route.query.roleName
const merchantId = computed(() => store.state.userInfo.merchantId)

onBeforeMount(async () => {
    if (merchantId.value) {
        const res = await merchantSource({
            appKey: 'A1001002',
            busiCode: 'A1001002',
            busiMerchantIdList: [merchantId.value]
        })
        if (res.code !== '200') return false
        if (res.list[0].merchantSource === 8 || res.list[0].merchantSource === 9) {
            router.replace({
                path: '/boot-upgrade',
                query: {
                    showNavbar: 1,
                    merchantSource: res.list[0].merchantSource,
                    rName: route.name
                }
            })
        }
    }
})

const active = ref('ledger-manage')
const mineRef = ref(null)
const ledgerManageRef = ref(null)
const ledgerRulesRef = ref(null)
// 刷新接口
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        document.documentElement.scrollTo(0, 0)
        if (active.value === 'ledger-manage' && !ledgerManageRef.value?.loading) {
            ledgerManageRef.value.onRefresh()
        } else if (active.value === 'ledger-pproportion' && !ledgerRulesRef.value?.loading) {
            ledgerRulesRef.value.onRefresh()
        }
    }
})

const tabChange = (name, title) => {
    if (name === 'ledger-pproportion') {
        // hasOnRef.value.reload()
    } else if (name === 'ledger-manage') {
        // notOnRef.value.reload()
    }
}

// 分账管理添加
const ledgerManageAdd = () => {
    ledgerManageRef.value.addPersonPhase()
}
// 分账管理添加分账规则
const ledgerRulesAdd = () => {
    ledgerRulesRef.value.addRules()
}
</script>
<style>
.mine-content .van-tabs__wrap {
    position: sticky;
    top: 92px;
    z-index: 9;
    background: #fff;

}
</style>
<style lang="scss" scoped>
.mine-content{
    --van-nav-bar-icon-color: #000;
    --van-nav-bar-arrow-size: 35px;
    --van-nav-bar-text-color: #FE7E41;
    --van-nav-bar-title-font-size: 34px;
    background-size: 100% auto;
    background-repeat: no-repeat;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            z-index: 9999;
        }
        .van-hairline--bottom:after{
            border-bottom-width: 0;
        }
    }
    .footer{
        position: fixed;
        padding: 0 60px;
        width: calc(100vw - 120px);
        bottom: 20px;
        bottom: calc(20px + constant(safe-area-inset-bottom));
        bottom: calc(20px + env(safe-area-inset-bottom));
        .van-button{
            width: 630px;
            height: 92px;
            margin-top:75px;
        }
    }
}
</style>
