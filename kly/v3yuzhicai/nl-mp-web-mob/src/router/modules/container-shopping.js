const routes = [{
    path: '/container-finish-pay/:appKey/:busiCode/:orderNo',
    name: 'container-finish-pay',
    props: true,
    meta: {
        title: '支付完成'
    },
    component: () => import(/* webpackChunkName: "container-finish-pay" */ '@/views/container-shopping/pay/finish.vue')
}, {
    path: '/container-order-detail/:appKey/:busiCode/:orderNo/:goMine?',
    name: 'container-order-detail',
    props: true,
    meta: {
        title: '订单详情'
    },
    component: () => import(/* webpackChunkName: "container-order-detail" */ '@/views/container-shopping/order/detail.vue')
}, {
    path: '/container-order-confirm/:appKey/:busiCode/:orderNo',
    name: 'container-order-confirm',
    props: true,
    meta: {
        title: '确认订单'
    },
    component: () => import(/* webpackChunkName: "container-order-confirm" */ '@/views/container-shopping/order/confirm.vue')
}, {
    path: '/container-payment-guide',
    name: 'container-payment-guide',
    props: true,
    meta: {
        title: '交易引导页'
    },
    component: () => import(/* webpackChunkName: "container-payment-guide" */ '@/views/guide/payment-guide.vue')
}, {
    path: '/container-behavior-detail/:status', // status: 1-> 识别中; 2-> 异常订单
    name: '/container-behavior-detail',
    props: true,
    meta: {
        title: '开门记录详情'
    },
    component: () => import(/* webpackChunkName: "/container-behavior-detail" */ '@/views/container-shopping/behavior/detail.vue')
}]

export default routes
