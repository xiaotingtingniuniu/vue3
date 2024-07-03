const routes = [
    {
        path: '/replenishment-order-detail',
        name: 'replenishment-order-detail',
        meta: {
            title: '补货单详情'
        },
        component: () => import(/* webpackChunkName: "replenishment-order-detail" */ '@/views/replenishmentOrder/orderDetails.vue')
    },
    {
        path: '/orderDetails',
        name: 'orderDetails',
        meta: {
            title: '补货单'
        },
        component: () => import(/* webpackChunkName: "orderDetails" */ '@/views/replenishmentOrder/replenishmentOrder.vue')
    },
    {
        path: '/open-door',
        name: 'open-door',
        meta: {
            title: '扫码开门'
        },
        component: () => import(/* webpackChunkName: "openDoor" */ '@/views/replenishmentOrder/openDoor.vue')
    },
    {
        path: '/replenishment-list',
        name: 'replenishment-list',
        meta: {
            title: '补货'
        },
        component: () => import(/* webpackChunkName: "replenishmentOredrList" */ '@/views/replenishmentOrder/replenishmentOredrList.vue')
    },
    {
        path: '/orderAddItem',
        name: 'orderAddItem',
        meta: {
            title: '添加商品'
        },
        component: () => import(/* webpackChunkName: "orderAddItem" */ '@/views/replenishmentOrder/orderAddItem.vue')
    }
]

export default routes
