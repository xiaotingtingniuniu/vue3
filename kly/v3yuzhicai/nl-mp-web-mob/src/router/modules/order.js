// import { RouterView } from 'vue-router'

const routes = [{
    path: '/order-list/:active?',
    name: 'order-list',
    props: true,
    meta: {
        title: '订单列表',
        keepAlive: true
    },
    component: () => import(/* webpackChunkName: "order-list" */ '@/views/order/index.vue')
},
{
    path: '/order-detail/:id/:goMine?',
    name: 'order-detail',
    props: true,
    meta: {
        title: '订单详情'
    },
    component: () => import(/* webpackChunkName: "order-detail" */ '@/views/order/detail.vue')
},
{
    path: '/order-confirm',
    name: 'order-confirm',
    meta: {
        title: '订单确认'
    },
    component: () => import(/* webpackChunkName: "settlement-order-confirm" */ '@/views/order/settlement/order-confirm.vue')
},
{
    path: '/pay-result/:orderNumber',
    name: 'pay-result',
    props: true,
    meta: {
        title: '支付'
    },
    component: () => import(/* webpackChunkName: "settlement-pay-result" */ '@/views/order/settlement/pay/result.vue')
},
{
    path: '/pay-result-new/:orderNumber',
    name: 'pay-result-new',
    props: true,
    meta: {
        title: '支付'
    },
    component: () => import(/* webpackChunkName: "settlement-pay-result-new" */ '@/views/order/settlement/pay/result-new.vue')
}]

export default routes
