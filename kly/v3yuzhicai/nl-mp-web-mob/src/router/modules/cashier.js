const routes = [{
    path: '/cashier/:orderNumber/:checkOrder?',
    name: 'cashier',
    props: true,
    meta: {
        title: '收银台'
    },
    component: () => import(/* webpackChunkName: "cashier" */ '@/views/cashier/index.vue')
}, {
    path: '/scene-pay-cashier/:orderNumber/:checkOrder?',
    name: 'scene-pay-cashier',
    props: true,
    meta: {
        title: '收银台'
    },
    component: () => import(/* webpackChunkName: "scene-pay-cashier" */ '@/views/cashier/scene-pay.vue')
}, {
    path: '/container-pay-cashier/:appKey/:busiCode/:orderNo/:payAmount/:checkOrder?',
    name: 'container-pay-cashier',
    props: true,
    meta: {
        title: '收银台'
    },
    component: () => import(/* webpackChunkName: "container-pay-cashier" */ '@/views/cashier/container-pay.vue')
}]

export default routes
