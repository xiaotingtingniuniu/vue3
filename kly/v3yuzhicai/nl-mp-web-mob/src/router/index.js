import { createRouter, createWebHistory } from 'vue-router'
import { wxJsSignatureFn } from '@/utils/wx'
import { getCurrenLocation } from '@/utils/location'
import { isWx, isIos, isApp } from '@/utils'
import store from '@/store'
import homeMap from './modules/home-map'
import login from './modules/login'
import mine from './modules/mine'
import shopsGoods from './modules/shops-goods'
import order from './modules/order'
import coupon from './modules/coupon'
import cashier from './modules/cashier'
import containerShopping from './modules/container-shopping'

import { nextTick } from 'vue'
import { pageBack, pageGo, goMinePage } from '@/utils/composables'

const appId = process.env.VUE_APP_APPID // appId
const redirectUri = window.location.href // 授权后回跳地址

var dynamicLoading = {
    css: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !')
        }
        var head = document.getElementsByTagName('head')[0]
        var link = document.createElement('link')
        link.href = path
        link.rel = 'stylesheet'
        link.type = 'text/css'
        head.appendChild(link)
    },
    js: function (path) {
        if (!path || path.length === 0) {
            throw new Error('argument "path" is required !')
        }
        var head = document.getElementsByTagName('head')[0]
        var script = document.createElement('script')
        script.src = path
        script.type = 'text/javascript'
        head.appendChild(script)
    }
}

let notUseLocationList = process.env.VUE_APP_NOT_LOCATIONS_LIST // 不需要定位的页面
if (isApp) {
    notUseLocationList = notUseLocationList.concat(['menu', 'shopping-cart'])
} else {
    dynamicLoading.js('https://mapapi.qq.com/web/mapComponents/geoLocation/v/geolocation.min.js')
    dynamicLoading.js('https://map.qq.com/api/gljs?v=1.exp&key=O7MBZ-I5ECJ-FDUFB-KOEOK-M2GPS-DEFRB')
}

const routes = [
    {
        path: '/:pathMatch(.*)*',
        redirect: '/home'
    },
    {
        path: '/redirect',
        name: 'redirect',
        meta: {
            title: ''
        },
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/app-redirect/index.vue')
    },
    {
        path: '/health',
        name: 'health',
        meta: {
            title: '健康'
        },
        component: () => import(/* webpackChunkName: "health" */ '@/views/health/index.vue')
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '恒生活美食工坊',
            layout: true
        },
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue')
    },
    {
        path: '/menu',
        name: 'menu',
        meta: {
            title: '菜单',
            keepAlive: true,
            goBack: false,
            layout: true
        },
        component: () => import(/* webpackChunkName: "menu" */ '@/views/menu/index.vue')
    },
    {
        path: '/menu-pop',
        name: 'menu-pop',
        meta: {
            title: '搜索',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "searchPop" */ '@/views/menu/components/searchPop.vue')
    },
    {
        path: '/menu-result',
        name: 'menu-result',
        meta: {
            title: '搜索结果',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "searchResult" */ '@/views/menu/components/searchResult.vue')
    },
    {
        path: '/shopping-cart',
        name: 'shopping-cart',
        meta: {
            title: '购物车',
            layout: true
        },
        component: () => import(/* webpackChunkName: "shopping-cart" */ '@/views/shopping-cart/index.vue')
    },
    {
        path: '/mine',
        name: 'mine',
        meta: {
            title: '我的',
            layout: true
        },
        component: () => import(/* webpackChunkName: "mine" */ '@/views/mine/index.vue')
    },
    {
        path: '/guide',
        name: 'guide',
        meta: {
            title: '恒生活',
            layout: false
        },
        component: () => import(/* webpackChunkName: "guide" */ '@/views/guide/index.vue')
    },
    {
        path: '/store-pay',
        name: 'store-pay',
        meta: {
            title: '到店支付',
            layout: false
        },
        component: () => import(/* webpackChunkName: "store-pay" */ '@/views/store-pay/index.vue')
    },
    {
        path: '/receive-result',
        name: 'receive-result',
        meta: {
            title: '领取结果',
            layout: false
        },
        component: () => import(/* webpackChunkName: "pay-result" */ '@/views/store-pay/receive-result.vue')
    },
    login,
    mine,
    homeMap,
    shopsGoods,
    ...order,
    coupon,
    ...cashier,
    ...containerShopping
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

nextTick(() => store.dispatch('dataInit'))
router.beforeEach(async (to, from, next) => {
    store.commit('setAppDialog', { visible: false })
    document.title = to.meta.title
    const { code } = to.query
    if (isWx && to.name === 'guide') return next()
    if (!store.state.wxCode) store.commit('setWxCode', code)
    // 微信&&未授权
    if (isWx && !store.state.wxCode && !code) return (window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURI(redirectUri)}&response_type=code&scope=snsapi_userinfo&connect_redirect=1#wechat_redire`))
    // 微信&&已授权 => 微信内
    if (isWx && code && !store.state.openId) await store.dispatch('getOpenId', code)
    if (store.state.locationStamp === '' && notUseLocationList.indexOf(to.name) === -1 && isIos && !isApp) {
        if (isWx) await wxJsSignatureFn()
        await getCurrenLocation()
    }
    // 一些业务处理
    if ((to.name === 'order-confirm' && (from.name === 'shopping-cart' || from.name === 'goods-detail'))) {
        store.commit('setCurrentActiveCoupon', null)
    }
    if (to.name === 'container-order-confirm' && from.name !== 'select-coupon') {
        store.commit('setCurrentActiveCoupon', null)
    }
    if (to.name === 'redirect' && from.name === 'pay-result' && isApp) return pageBack()
    if (to.name === 'order-confirm' && from.name === 'order-confirm' && isApp) return pageBack()
    if (to.name === 'menu' && (from.name !== 'menu-result' && from.name !== 'goods-detail')) {
        to.meta.goBack = false
    } else if (to.name === 'menu' && (from.name === 'menu-result' || from.name === 'goods-detail')) {
        to.meta.goBack = true
    }
    if (to.name === 'login' && from.name !== 'login' && from.name !== 'login-msg' && !to.query.pageName) {
        return next({
            name: 'login',
            query: { pageName: from.name || 'home' }
        })
    }
    if (from.name === 'cashier' && (to.name === 'order-list' || to.name === 'cashier' || to.name === 'order-confirm' || (to.name === 'order-detail' && !to.params.goMine))) {
        if (isApp) {
            return pageGo(`/order-detail/${from.params.orderNumber}/1`)
        } else {
            return next({
                name: 'order-detail',
                params: { id: from.params.orderNumber, goMine: 1 }
            })
        }
    }
    if (from.name === 'order-detail' && from.params.goMine && to.name !== 'mine' && to.name !== 'login' && (to.name !== 'cashier' || (to.name === 'cashier' && !to.query.forward))) {
        if (isApp) {
            return goMinePage()
        } else {
            return next({
                name: 'mine'
            })
        }
    }
    // 非微信&&未授权 => 浏览器
    if (!code) return next()
    delete to.query.code
    delete to.query.state
    next(to)
})
router.afterEach(async (to, from) => {
    // 微信内&&浏览器 都要定位
    if (store.state.locationStamp === '' && notUseLocationList.indexOf(to.name) === -1 && !isIos && !isApp) {
        if (isWx) await wxJsSignatureFn()
        await getCurrenLocation()
    }
})

export default router
