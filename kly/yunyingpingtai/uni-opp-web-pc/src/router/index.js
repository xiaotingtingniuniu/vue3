import store from '@/store'
import { markRaw, nextTick } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'
import NProgress from 'nprogress'

import Layout from '@/layout/index.vue'
import marketing from './modules/marketing'
import user from './modules/user'
import account from './modules/account'
import headManagement from './modules/head-management'
import system from './modules/system'
import authority from './modules/authority'
import customerservice from './modules/customer-service'
import paymentManagement from './modules/paymentManagement'
import moneyManagement from './modules/moneyManagement'
import settlementManagement from './modules/settlementManagement'
import distributionManagement from './modules/distributionManagement'
import resourceBitManage from './modules/resource-bit-manage'
import operate from './modules/operate'
import kaManagement from './modules/ka-management'
import goods from './modules/goods'
import freight from './modules/freight'
// import tfreight from '@/router/modules/tfreight'
import inventory from './modules/inventory'
// import price from './modules/price'
import containerGoodsInventory from './modules/containerGoodsInventory'
import deviceManager from './modules/deviceManager'
import price from './modules/price'
import orderManagement from './modules/order-management.js'
import wholesaleMall from './modules/wholesaleMall.js' // 批发商城管理
// 商品属性模型管理 s
import basicCategoryManagement from './modules/basic-category-management'
// 商家售卖范围管理
import commodityrange from './modules/commodityrange'
import containerManagement from './modules/container-management'
import goodsExamineManage from './modules/goods-examine-manage'
import charging from './modules/charging'
import platformOperation from './modules/platform-operation'
import containerProductManage from './modules/container-product-manage'
import financeCore from './modules/finance-core'
import promocodeManagement from './modules/promocode-management'
import purchase from './modules/purchase' // 采销
import oms from './modules/oms'

import contractManagement from './modules/contract-management'
import groupPurchase from './modules/groupPurchase'
import supplyChainGoodsManage from './modules/supply-chain-goods-manage'

import localeGoodsInventory from './modules/locale-goods-inventory'

nextTick(() => store.commit('init'))

const routes = [
    {
        path: '/',
        redirect: '/acpable-app'
    },
    {
        path: '/health',
        name: 'health',
        meta: {
            title: '检测'
        },
        component: () => import('@/views/health/health-page.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/login/login')
    },
    {
        path: '/acpable-app',
        name: 'acpable-app',
        meta: {
            title: '恒生活核心能力中台'
        },
        component: () => import('@/views/login/acpable-app.vue')
    },
    {
        path: '/website',
        redirect: '/website/home',
        component: Layout,
        children: [
            {
                path: 'home',
                name: 'home',
                asideVisible: false, // true=>当前有还有下一级, false=>当前有没有下一级 undefinde=>当前无
                meta: {
                    title: '首页',
                    icon: markRaw(HomeFilled),
                    // 菜单高亮 对应path
                    activeMenu: 'home'
                },
                component: () => import('@/views/home/home-page.vue')
            },
            containerManagement,
            user,
            headManagement,
            marketing,
            account,
            paymentManagement,
            customerservice,
            system,
            authority,
            operate, // 商户入驻
            kaManagement, // KA
            contractManagement, // 平台合同管理
            commodityrange,
            goods, // 商品管理
            basicCategoryManagement, // 商品属性
            inventory, // 库存
            // tfreight, // 原 报价管理
            freight, // 报价单
            resourceBitManage, // 资源位
            // order,
            // // order,
            // price, // 价格
            orderManagement, // 订单
            moneyManagement, // 资金管理
            settlementManagement, // 结算管理
            // payment,
            distributionManagement, // 分销管理
            purchase, // 采销管理
            containerGoodsInventory, // 货柜商品后台
            deviceManager, // 设备管理
            wholesaleMall, // 批发商城管理
            goodsExamineManage, // 商品审核管理
            localeGoodsInventory, // 本地库存管理
            charging, // 计费项费率
            platformOperation, // 平台运营人员管理
            containerProductManage, // 货柜商品管理
            financeCore, // 财务中心
            promocodeManagement,
            groupPurchase,
            oms,
            supplyChainGoodsManage // 供应链商品管理
        ]
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    console.log(to, 'tp')
    if (to.name === 'add-subaccount') {
        if (to.params.type === 'approval') {
            to.meta.title = '审核'
        }
    }
    if (to.name === 'authority-role-newly' || to.name === 'authority-consumer-newly' || to.name === 'authority-organization-newly') {
        if (to.params.type === 'add') {
            to.meta.title = '新增'
        } else if (to.params.type === 'edit') {
            to.meta.title = '编辑'
        } else {
            to.meta.title = '详情'
        }
    }
    if (to.name === 'coupon-batch-handle') {
        if (to.params.handleType === 'add') {
            to.meta.title = '优惠券申请'
        } else if (to.params.handleType === 'edit') {
            to.meta.title = '优惠券编辑'
        } else {
            to.meta.title = '优惠券审批'
        }
    }
    if (to.name === 'apply-active') {
        if (to.params.handleType === 'add') {
            to.meta.title = '活动申请'
        } else if (to.params.handleType === 'edit') {
            to.meta.title = '活动编辑'
        } else if (to.params.handleType === 'approval') {
            to.meta.title = '活动审批'
        } else {
            to.meta.title = '活动详情'
        }
    }
    if (to.name === 'settle-in-means') {
        if (to.params.handleType === 'add') {
            to.meta.title = '新增商户'
        } else if (to.params.handleType === 'edit') {
            to.meta.title = '编辑商户'
        } else {
            to.meta.title = '商户详情'
        }
    }
    if (to.name === 'shop-detail') {
        if (to.params.handleType === 'edit') {
            to.meta.title = '店铺编辑'
        } else {
            to.meta.title = '店铺详情'
        }
    }
    if (to.name === 'add-similarity') {
        if (to.params.type === 'add') {
            to.meta.title = '创建货柜相似品组合'
        } else if (to.params.type === 'edit') {
            to.meta.title = '编辑货柜相似品组合'
        }
    }
    document.title = to.meta.title
    NProgress.start()
    const token = store.state.token
    if (to.name === 'health') next()
    if (to.name === 'login' && to.query.action === 'logout') await store.dispatch('logoutFn')
    if (to.name === 'login' && token) return next({ name: 'acpable-app' })
    // 优惠券审批页面 是审批状态打开的 且 未登录
    if (to.name === 'coupon-batch-handle' && to.params.handleType === 'approval' && !token) {
        return next({ name: 'login', query: { returnUrl: to.fullPath } })
    }
    // 活动审批页面 是审批状态打开的 且 未登录
    if (to.name === 'apply-active' && to.params.handleType === 'approval' && !token) {
        return next({ name: 'login', query: { returnUrl: to.fullPath } })
    }
    if (to.name !== 'login' && !token) return next({ name: 'login' })
    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router
