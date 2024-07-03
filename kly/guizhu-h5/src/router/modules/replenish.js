
const routes = [
    {
        path: '/operation-log/:deviceId?',
        name: 'operation-log',
        props: true,
        meta: {
            title: '操作记录'
        },
        component: () => import(/* webpackChunkName: "operation-log" */ '@/views/replenish/operation-log.vue')
    },
    {
        path: '/price-change',
        name: 'price-change',
        meta: {
            title: '改价'
        },
        component: () => import(/* webpackChunkName: "price-change" */ '@/views/price-change/index.vue')
    },
    {
        path: '/price-change-result',
        name: 'price-change-result',
        meta: {
            title: '改价结果'
        },
        component: () => import(/* webpackChunkName: "price-change-result" */ '@/views/price-change/result.vue')
    },
    {
        path: '/replenish-detail/:id',
        name: 'replenish-detail',
        props: true,
        meta: {
            title: '补货记录详情'
        },
        component: () => import(/* webpackChunkName: "replenish-detail" */ '@/views/replenish/replenish-detail.vue')
    },
    {
        path: '/price-change-detail/:id',
        name: 'price-change-detail',
        props: true,
        meta: {
            title: '改价记录详情'
        },
        component: () => import(/* webpackChunkName: "price-change-detail" */ '@/views/replenish/price-change.vue')
    },
    {
        path: '/inventory-detail/:id',
        name: 'inventory-detail',
        props: true,
        meta: {
            title: '盘货记录详情'
        },
        component: () => import(/* webpackChunkName: "inventory-detail" */ '@/views/replenish/inventory-detail.vue')
    }
]

export default routes
