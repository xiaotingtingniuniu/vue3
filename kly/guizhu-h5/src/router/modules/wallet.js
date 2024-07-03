const routes = [
    {
        path: '/payment-method',
        name: 'payment-method',
        props: true,
        meta: {
            title: '收款账户'
        },
        component: () => import(/* webpackChunkName: "payment-method" */ '@/views/wallet/payment-method.vue')
    },
    {
        path: '/property',
        name: 'property',
        meta: {
            title: '资产'
        },
        component: () => import(/* webpackChunkName: "property" */ '@/views/wallet/property.vue')
    },
    {
        path: '/my-income',
        name: 'my-income',
        meta: {
            title: '我的收入'
        },
        component: () => import(/* webpackChunkName: "my-income" */ '@/views/wallet/my-income.vue')
    },
    {
        path: '/butler-account',
        name: 'butler-account',
        meta: {
            title: '管家账户'
        },
        component: () => import(/* webpackChunkName: "butler-account" */ '@/views/wallet/butler-account.vue')
    },
    {
        path: '/withdrawal-apply/:acctType?',
        name: 'withdrawal-apply',
        meta: {
            title: '提现'
        },
        component: () => import(/* webpackChunkName: "withdrawal-apply" */ '@/views/wallet/withdrawal-apply.vue')
    },
    {
        path: '/account-capital-list',
        name: 'account-capital-list',
        meta: {
            title: '账户明细'
        },
        component: () => import(/* webpackChunkName: "account-capital-list" */ '@/views/wallet/account-capital-list.vue')
    },
    {
        path: '/withdrawal-record-list',
        name: 'withdrawal-record-list',
        meta: {
            title: '提现记录'
        },
        component: () => import(/* webpackChunkName: "withdrawal-record-list" */ '@/views/wallet/withdrawal-record-list.vue')
    },
    {
        path: '/expenses-receipts',
        name: 'expenses-receipts',
        meta: {
            title: '收支'
        },
        component: () => import(/* webpackChunkName: "withdrawal-record-list" */ '@/views/wallet/expenses-receipts.vue')
    },
    {
        path: '/withdrawal-record-detail',
        name: 'withdrawal-record-detail',
        meta: {
            title: '提现记录'
        },
        component: () => import(/* webpackChunkName: "withdrawal-record-detail" */ '@/views/wallet/withdrawal-record-detail.vue')
    },
    {
        path: '/entry-record-list',
        name: 'entry-record-list',
        meta: {
            title: '资金明细'
        },
        component: () => import(/* webpackChunkName: "entry-record-list" */ '@/views/wallet/entry-record-list.vue')
    },
    {
        path: '/entry-record-detail',
        name: 'entry-record-detail',
        meta: {
            title: '资金明细'
        },
        component: () => import(/* webpackChunkName: "entry-record-detail" */ '@/views/wallet/entry-record-detail.vue')
    },
    {
        path: '/freeze-records',
        name: 'freeze-records',
        meta: {
            title: '冻结记录'
        },
        component: () => import(/* webpackChunkName: "freeze-records" */ '@/views/wallet/freeze-records.vue')
    }, {
        path: '/wallet-agreement1',
        name: 'wallet-agreement1',
        meta: {
            title: 'CFCA数字证书服务协议'
        },
        component: () => import(/* webpackChunkName: "wallet-agreement1" */ '@/views/agreement/wallet-agreement1.vue')
    }, {
        path: '/wallet-agreement2',
        name: 'wallet-agreement2',
        meta: {
            title: '委托划款授权书'
        },
        component: () => import(/* webpackChunkName: "wallet-agreement2" */ '@/views/agreement/wallet-agreement2.vue')
    }, {
        path: '/wallet-agreement3',
        name: 'wallet-agreement3',
        meta: {
            title: '钱包隐私政策'
        },
        component: () => import(/* webpackChunkName: "wallet-agreement3" */ '@/views/agreement/wallet-agreement3.vue')
    }
]
export default routes
