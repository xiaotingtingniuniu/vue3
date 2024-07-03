import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '@/utils/composables'
import mine from './modules/mine'
import replenishment from './modules/replenishment'
import replenishmentOrder from './modules/replenishmentOrder'
import operation from './modules/operation'
import containerInterface from './modules/containerInterface'
import goodsLibrary from './modules/goods-library'
import subsidyCash from './modules/subsidy-cash'
import device from './modules/device'
import multiTypeDevice from './modules/multi-type-device'
import { loginByCode } from '@/api/login'
import replenish from './modules/replenish' // 操作记录
import dataBoard from './modules/data-board' // 操作记录
import signContract from './modules/sign-contract' // 签约
import wallet from './modules/wallet' // 操作记录
import verification from './modules/verification'
// import { appBridge } from '@/utils/bridge.js'

import store from '@/store'
import { isWx } from '@/utils'

const appId = process.env.VUE_APP_WX_APPID // appId
const redirectUri = window.location.href // 授权后回跳地址

const routes = [
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    },
    {
        path: '/health',
        name: 'health',
        meta: {
            title: '检测'
        },
        component: () => import(/* webpackChunkName: "health" */ '../views/health/health')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import(/* webpackChunkNam` e: "login" */ '../views/login/index')
    },
    {
        path: '/college',
        name: 'college',
        meta: {
            title: '柜主学堂'
        },
        component: () => import(/* webpackChunkName: "college/index" */ '../views/college/index')
    },
    {
        path: '/college/list',
        name: 'college-list',
        meta: {
            title: ' '
        },
        component: () => import(/* webpackChunkName: "college/list" */ '../views/college/list')
    },
    {
        path: '/college/detail',
        name: 'college-detail',
        meta: {
            title: '学堂详情'
        },
        component: () => import(/* webpackChunkName: "college/detail" */ '../views/college/detail')
    },
    {
        path: '/container/list',
        name: 'container-list',
        meta: {
            title: '智能货柜'
        },
        component: () => import(/* webpackChunkName: "container/list" */ '@/views/intelligent-container/container-list/index.vue')
    },
    {
        path: '/container/detail',
        name: 'container-detail',
        meta: {
            title: '智能货柜'
        },
        component: () => import(/* webpackChunkName: "container/detail" */ '@/views/intelligent-container/container-detail/index.vue')
    },
    {
        path: '/setting',
        name: 'setting',
        meta: {
            title: '账户设置'
        },
        component: () => import(/* webpackChunkName: "setting/index" */ '@/views/setting/index.vue')
    },
    {
        path: '/setting/cancellation',
        name: 'setting-cancellation',
        meta: {
            title: '注销账号'
        },
        component: () => import(/* webpackChunkName: "setting/cancellation" */ '@/views/setting/cancellation.vue')
    },
    {
        path: '/setting/agreement',
        name: 'setting-agreement',
        meta: {
            title: '用户协议'
        },
        component: () => import(/* webpackChunkName: "setting/agreement" */ '@/views/setting/agreement.vue')
    },
    {
        path: '/setting/agreement1',
        name: 'setting-agreement1',
        meta: {
            title: '恒掌柜用户服务协议'
        },
        component: () => import(/* webpackChunkName: "setting/agreement1" */ '@/views/setting/agreement1.vue')
    },
    {
        path: '/setting/agreement2',
        name: 'setting-agreement2',
        meta: {
            title: '恒掌柜隐私政策'
        },
        component: () => import(/* webpackChunkName: "setting/agreement2" */ '@/views/setting/agreement2.vue')
    },
    {
        path: '/agreement/ledger',
        name: 'agreement-ledger',
        meta: {
            title: '分账人协议'
        },
        component: () => import(/* webpackChunkName: "ledger" */ '@/views/agreement/ledger.vue')
    },
    {
        path: '/setting/identity',
        name: 'setting-identity',
        meta: {
            title: ''
        },
        component: () => import(/* webpackChunkName: "setting/identity" */ '@/views/setting/identity.vue')
    },
    {
        path: '/container/my-container',
        name: 'my-container',
        meta: {
            title: '我的货柜'
        },
        component: () => import(/* webpackChunkName: "my-container" */ '@/views/container/my-container/index.vue')
    },
    {
        path: '/feedback',
        name: 'feedback',
        meta: {
            title: '我的反馈'
        },
        component: () => import(/* webpackChunkName: "feedback" */ '@/views/feedback')
    },
    {
        path: '/container/lease/:orderNo/:orderStatus',
        name: 'lease',
        props: true,
        meta: {
            title: '订单详情'
        },
        component: () => import(/* webpackChunkName: "lease" */ '@/views/container/lease/detail.vue')
    },
    {
        // path: '/container/stag/:orderNo/:orderStatus',
        path: '/container/stag/:orderNo/:orderStatus',
        name: 'stag',
        props: true,
        meta: {
            title: '订单详情'
        },
        component: () => import(/* webpackChunkName: "stag" */ '@/views/container/stag/detail.vue')
    },
    {
        path: '/container/audit/:orderNo/:orderStatus',
        name: 'audit',
        props: true,
        meta: {
            title: '订单审核'
        },
        component: () => import(/* webpackChunkName: "audit" */ '@/views/container/stag/audit.vue')
    },
    {
        path: '/container/verifyresult',
        name: 'verifyresult',
        meta: {
            title: '提交结果'
        },
        component: () => import(/* webpackChunkName: "verifyresult" */ '@/views/container/stag/verifyResult.vue')
    },
    {
        path: '/container/payresult/:prePayNo/:orderNo/:orderStatus/:num',
        name: 'payresult',
        props: true,
        meta: {
            title: '支付结果'
        },
        component: () => import(/* webpackChunkName: "payresult" */ '@/views/container/lease/payResult.vue')
    },
    {
        path: '/container/stag/bill/:orderNo',
        // path: '/container/stag/bill',
        name: 'stabill',
        props: true,
        meta: {
            title: '分期明细详情'
        },
        component: () => import(/* webpackChunkName: "stabill" */ '@/views/container/stag/billDetail.vue')
    },
    {
        path: '/container/stag/pay/:orderNo',
        // 钱包2.6期 分期账单分账明细
        name: 'paybill',
        props: true,
        meta: {
            title: '分期明细详情'
        },
        component: () => import(/* webpackChunkName: "paybill" */ '@/views/container/stag/payDetail.vue')
    },
    {
        path: '/guida-per-principianti',
        name: 'guida-per-principianti',
        meta: {
            title: '新手指南'
        },
        component: () => import(/* webpackChunkName: "payresult" */ '@/views/guide/guida-per-principianti.vue')
    },
    {
        path: '/app-pdf',
        name: 'app-pdf',
        meta: {
            title: '文件预览'
        },
        component: () => import(/* webpackChunkName: "app-pdf" */ '@/views/app-pdf/index.vue')
    },
    {
        path: '/merchant-income',
        name: 'merchant-income',
        meta: {
            title: '商家收入'
        },
        component: () => import(/* webpackChunkName: "merchant-income" */ '@/views/merchant-income/index.vue')
    },
    ...mine,
    ...replenishment,
    ...replenishmentOrder,
    ...operation,
    ...containerInterface,
    ...goodsLibrary,
    ...subsidyCash,
    ...device,
    ...multiTypeDevice,
    ...replenish,
    ...dataBoard,
    ...signContract,
    ...wallet,
    ...verification
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    const { code } = to.query
    if (isWx && to.name === 'register-payee') {
        if (code) {
            delete to.query.code
            store.commit('setWxCode', code)
            return next()
        } else {
            return window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${encodeURI(redirectUri)}&response_type=code&scope=snsapi_base&connect_redirect=1#wechat_redirect`)
        }
    }
    document.documentElement.scrollTop = 0
    if (to.meta.title) {
        document.title = to.meta.title
    } else {
        document.title = ''
    }
    if (to.query.code) {
        const res = await loginByCode({ code: to.query.code })
        sessionStorage.setItem('token', res.data.token)
        sessionStorage.setItem('userInfo', JSON.stringify(res.data))
        store.commit('setToken', res.data.token)
        await store.dispatch('initPublicData')
    }
    if (process.env.VUE_APP_NOLOGIN_PAGE && process.env.VUE_APP_NOLOGIN_PAGE.indexOf(to.name) !== -1) return next()
    if (!store.state.token) await getToken()
    if (to.query.code) {
        delete to.query.code
        next(to)
    } else {
        next()
    }
})

export default router
