<template>
    <div class="mine-content" ref="mineRef">
        <van-nav-bar title="我的商品库" fixed placeholder left-arrow right-text="添加商品" @click-left="closePage" @click-right="newPage('/publicGoods?showNavbar=0')" />
        <div class="divider"></div>
        <van-tabs class="select-tabs" v-model:active="active" sticky color="#FE7E41" @change="tabChange">
            <van-tab title="已上架" name="has-been-on">
                <has-been-on :tabName="active" ref="hasOnRef"/>
            </van-tab>
            <van-tab title="未上架" name="not-on">
                <not-on :tabName="active" ref="notOnRef"/>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import HasBeenOn from './has-been-on'
import NotOn from './not-on'
import { newPage, closePage } from '@/utils/composables'
import { merchantSource } from '@/api/goods-transfer'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()
const router = useRouter()
const merchantId = computed(() => store.state.userInfo.merchantId)

onBeforeMount(async () => {
    active.value = route.params.active || 'has-been-on'
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

const active = ref('has-been-on')
const hasOnRef = ref(null)
const notOnRef = ref(null)

const mineRef = ref(null)
document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        document.documentElement.scrollTo(0, 0)
        if (active.value === 'has-been-on' && !hasOnRef.value?.loading) {
            hasOnRef.value.reload()
        } else if (active.value === 'not-on' && !notOnRef.value?.loading) {
            notOnRef.value.reload()
        }
    }
})

const tabChange = (name, title) => {
    if (name === 'has-been-on') {
        hasOnRef.value.reload()
    } else if (name === 'not-on' && notOnRef.value) {
        notOnRef.value.reload()
    }
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
    :deep(.van-sticky){
        top: calc(88px + var(--van-status-bar-height)) !important;
    }
}
</style>
