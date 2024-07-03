import { RouterView } from 'vue-router'

export default [
    {
        path: '/operation',
        name: 'operation',
        component: RouterView,
        children: [
            {
                path: 'operation-list',
                name: 'operation-list',
                meta: {
                    title: '代运营商子账户'
                },
                component: () => import(/* webpackChunkName: "operation-list" */ '@/views/operation/list.vue')
            },
            {
                path: 'operation-add/:sonType?',
                name: 'operation-add',
                meta: {
                    title: '创建代运营商子账户'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-add" */ '@/views/operation/add.vue')
            },
            {
                path: 'operation-form/:busiMerchantId?/:merchantSubId?/:merchantSubType?',
                name: 'operation-form',
                meta: {
                    title: '创建代运营商子账户表单'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-add" */ '@/views/operation/components/operation-form.vue')
            },
            {
                path: 'operation-edit/:busiMerchantId/:merchantSubId/:merchantSubType?',
                name: 'operation-edit',
                meta: {
                    title: '编辑代运营商子账户'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-edit" */ '@/views/operation/edit.vue')
            },
            {
                path: 'operation-detail/:busiMerchantId/:merchantSubId/:merchantSubType?',
                name: 'operation-detail',
                meta: {
                    title: '代运营商子账户详情'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-detail" */ '@/views/operation/detail.vue')
            },
            {
                path: 'operation-account/:merchantSubId/:merchantSubType/:realRight/:merchantSubName/:phoneMobile?/:canAdd',
                name: 'operation-account',
                meta: {
                    title: '子账号设备管理'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-detail" */ '@/views/operation/subaccount.vue')
            },
            {
                path: 'operation-account-add/:merchantSubId/:merchantSubType?',
                name: 'operation-account-add',
                meta: {
                    title: '子账号设备管理'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-detail" */ '@/views/operation/subaccount-add.vue')
            },
            {
                path: 'agentoperator-list/:merchantSubId/:deviceNo?',
                name: 'agentoperator-list',
                meta: {
                    title: '选择代运营商'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-detail" */ '@/views/operation/agentoperator-list.vue')
            },
            {
                path: 'msgcenter',
                name: 'msgcenter',
                meta: {
                    title: '待处理'
                },
                props: true,
                component: () => import(/* webpackChunkName: "operation-detail" */ '@/views/operation/msgcenter.vue')
            },
            {
                path: 'active-range-list',
                name: 'active-range-list',
                meta: {
                    title: '允许激活合同货柜范围'
                },
                props: true,
                component: () => import(/* webpackChunkName: "active-range-list" */ '@/views/operation/active-range-list.vue')
            },
            {
                path: 'active-range',
                name: 'active-range',
                meta: {
                    title: '允许激活合同货柜范围'
                },
                props: true,
                component: () => import(/* webpackChunkName: "active-range" */ '@/views/operation/active-range.vue')
            }
        ]
    }
]
