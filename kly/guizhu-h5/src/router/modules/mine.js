import { RouterView } from 'vue-router'

export default [
    {
        path: '/mine',
        name: 'mine',
        component: RouterView,
        children: [
            // {
            //     path: 'collect-money-setting',
            //     name: 'collect-money-setting',
            //     meta: {
            //         title: '收款设置'
            //     },
            //     component: () => import(/* webpackChunkName: "collect-money-setting" */ '@/views/collect-money-setting/index.vue')
            // },
            {
                path: 'open-pay/:status?',
                name: 'open-pay',
                meta: {
                    title: '开通支付'
                },
                component: () => import(/* webpackChunkName: "open-pay" */ '@/views/collect-money-setting/src/open-pay/index.vue')
            },
            {
                path: 'add-proportion/:configId?/:subLedgerId?',
                name: 'add-proportion',
                meta: {
                    title: '添加比例'
                },
                component: () => import(/* webpackChunkName: "add-proportion" */ '@/views/collect-money-setting/src/add-proportion/index.vue')
            },
            {
                path: 'add-routing-person',
                name: 'add-routing-person',
                meta: {
                    title: '添加分账人'
                },
                component: () => import(/* webpackChunkName: "add-routing-person" */ '@/views/collect-money-setting/src/add-routing-person/index.vue')
            },
            {
                path: 'register-payee/:subLedgerId',
                name: 'register-payee',
                meta: {
                    title: '注册收款人'
                },
                component: () => import(/* webpackChunkName: "register-payee" */ '@/views/collect-money-setting/src/register-payee/index.vue')
            },
            {
                path: 'open-steps/:status',
                name: 'open-steps',
                meta: {
                    title: '开户进度'
                },
                component: () => import(/* webpackChunkName: "open-steps" */ '@/views/collect-money-setting/src/open-steps/index.vue')
            },
            {
                path: 'collect-money-setting',
                name: 'collect-money-setting',
                meta: {
                    title: '收款设置'
                },
                component: () => import(/* webpackChunkName: "collect-money-setting" */ '@/views/collect-money-setting-phase/index.vue')
            },
            {
                path: 'collect-money-detail/:subLedgerId',
                name: 'collect-money-detail',
                props: true,
                meta: {
                    title: '收款设置'
                },
                component: () => import(/* webpackChunkName: "collect-money-detail" */ '@/views/collect-money-setting-phase/detail.vue')
            },
            {
                path: '/add-routing-person-phase',
                name: 'add-routing-person-phase',
                meta: {
                    title: '添加分账人'
                },
                component: () => import(/* webpackChunkName: "add-routing-person" */ '@/views/collect-money-setting-phase/src/add-routing-person/index.vue')
            },
            {
                path: 'edit-routing-person/:subLedgerId?',
                name: 'edit-routing-person',
                meta: {
                    title: '添加分账人'
                },
                component: () => import(/* webpackChunkName: "add-routing-person" */ '@/views/collect-money-setting-phase/src/edit-routing-person/index.vue')
            },
            {
                path: '/change-account',
                name: 'change-account',
                meta: {
                    title: '更换绑定'
                },
                component: () => import(/* webpackChunkName: "add-routing-person" */ '@/views/collect-money-setting-phase/src/change-account/index.vue')
            }
        ]
    }
]
