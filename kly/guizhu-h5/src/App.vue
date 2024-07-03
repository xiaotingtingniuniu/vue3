<template>
    <loading v-show="loadState" />
    <div class="root">
        <!-- 可能是vant源码错误 后续可以看看vant升级记录有没有解决 -->
        <div class="van-nav-bar" style="display: none"></div>
        <Loading v-show="$store.state.loading" />
        <router-view v-slot="{ Component }">
            <van-config-provider :theme-vars="themeVars">
                <keep-alive>
                    <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path" />
                </keep-alive>
                <component :is="Component" v-if="!$route.meta.keepAlive" />
            </van-config-provider>
        </router-view>
    </div>
</template>
<script setup>
import store from '@/store'
import { reactive, onMounted, computed } from 'vue'
import { isApp } from '@/utils'
import { appBridge } from '@/utils/bridge'
import Loading from '@/components/Loading/index'

const loadState = computed(() => store.state.loading)
store.commit('setlocationOrigin', window.location.origin)
const themeVars = reactive({ StatusBarHeight: '0px' })
if (isApp) {
    try {
        appBridge('getStatusBarHeight', null, (res = 0) => {
            themeVars.StatusBarHeight = res + 'px'
        })
    } catch (error) {}
}

onMounted(() => {
    store.commit('setlocationOrigin', window.location.origin)
})
</script>

<style lang="scss">
html,
body {
    height: 100%;
    background: #f5f5f5;
}
.root {
    width: 100%;
    height: 100%;
    font-family: 'PingFang SC', 'Helvetica Neue', Helvetica, 'Nimbus Sans L', Arial, 'Liberation Sans', 'Hiragino Sans GB', 'Source Han Sans CN Normal', 'Microsoft YaHei', 'Wenquanyi Micro Hei', 'WenQuanYi Zen Hei', 'ST Heiti', SimHei, 'WenQuanYi Zen Hei Sharp', sans-serif;
}
* {
    padding: 0;
    margin: 0;
}
#head {
    width: 750px;
    height: 88px;
    background: #ffffff;
    img {
        height: 35px;
        margin-left: 22px;
        margin-top: 30px;
    }
    span {
        display: inline-block;
        width: 670px;
        text-align: center;
        height: 48px;
        font-size: 34px;
        font-weight: 600;
        color: #000000;
        line-height: 48px;
    }
}
</style>
