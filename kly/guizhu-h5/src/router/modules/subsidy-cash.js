const routes = [
    {
        path: '/subsidy-cash',
        name: 'subsidy-cash',
        meta: {
            title: '补贴提现'
        },
        component: () => import(/* webpackChunkName: "subsidy-cash" */ '@/views/subsidy-cash/index.vue')
    },
    {
        path: '/withdrawal-record/:subAcctId',
        name: 'withdrawal-record',
        props: true,
        meta: {
            title: '提现记录'
        },
        component: () => import(/* webpackChunkName: "withdrawal-record" */ '@/views/subsidy-cash/withdrawal-record.vue')
    },
    {
        path: '/subsidy-record/:subAcctId',
        name: 'subsidy-record',
        props: true,
        meta: {
            title: '补贴记录'
        },
        component: () => import(/* webpackChunkName: "subsidy-record" */ '@/views/subsidy-cash/subsidy-record.vue')
    },
    {
        path: '/surplus-cash',
        name: 'surplus-cash',
        meta: {
            title: '余额提现'
        },
        component: () => import(/* webpackChunkName: "surplus-cash" */ '@/views/surplus-cash/index.vue')
    }
]

export default routes
