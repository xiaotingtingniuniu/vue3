<template>
    <loading v-show="loadState" />
    <div class="van-nav-bar" style="display: none;"></div>
    <van-config-provider :theme-vars="themeVars">
        <div class="layout" v-if="(isApp && themeVars.StatusBarHeight) || !isApp">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component v-if="$route.meta.keepAlive" :key="$route.name" :is="Component" />
                </keep-alive>
            </router-view>
            <router-view v-if="!$route.meta.keepAlive" :key="$route.name" />
            <layout v-if="$route.meta.layout && !isApp"></layout>
        </div>
    </van-config-provider>
</template>
<script setup>
import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
import layout from '@/layout'
import Loading from '@/components/Loading'
const store = useStore()
const loadState = computed(() => store.state.loading)
const userInfo = computed(() => store.state.userInfo)
const storeInfo = computed(() => store.state.storeInfo)
const themeVars = reactive({ StatusBarHeight: 0 })

if (isApp) {
    appBridge('getStatusBarHeight', {}, (res) => {
        themeVars.StatusBarHeight = res + 'px'
    })
}

onMounted(async () => {
    if (userInfo.value && storeInfo.value) store.dispatch('updateCartNum')
    watch([userInfo, storeInfo], () => {
        if (!userInfo.value || !storeInfo.value) return store.commit('setCartNum', 0)
        store.dispatch('updateCartNum')
    })
})
</script>

<style lang="scss" scoped>
.layout{
    min-height: calc(100vh);
    background-color: #F7F7F7;
}
</style>
