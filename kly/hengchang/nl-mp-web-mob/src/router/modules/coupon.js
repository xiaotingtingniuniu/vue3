import { RouterView } from 'vue-router'

const routes = {
    path: '/coupon',
    name: 'coupon',
    redirect: '/mine',
    component: RouterView,
    children: [
        {
            path: 'mine-coupon',
            name: 'mine-coupon',
            meta: {
                title: '我的优惠券',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "coupon-mine-coupon" */ '@/views/coupon/index.vue')
        },
        {
            path: 'draw-coupon/:storeId/:goodsId',
            name: 'draw-coupon',
            props: true,
            meta: {
                title: '领取优惠券',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "coupon-draw-coupon" */ '@/views/coupon/draw-coupon.vue')
        },
        {
            path: 'select-coupon',
            name: 'select-coupon',
            meta: {
                title: '选择优惠券',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "coupon-select-coupon" */ '@/views/coupon/select-coupon.vue')
        },
        {
            path: 'app-select-coupon',
            name: 'app-select-coupon',
            meta: {
                title: '选择优惠券',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "coupon-app-select-coupon" */ '@/views/coupon/app-select-coupon.vue')
        },
        {
            path: 'redeem-coupon',
            name: 'redeem-coupon',
            meta: {
                title: '兑换优惠券',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "coupon-redeem-coupon" */ '@/views/coupon/redeem-coupon.vue')
        }
    ]
}

export default routes
