import { RouterView } from 'vue-router'

const routes = {
    path: '/shops-goods',
    name: 'shops-goods',
    redirect: '/home',
    component: RouterView,
    children: [
        {
            path: 'goods-detail/:id',
            name: 'goods-detail',
            props: true,
            meta: {
                title: '商品详情'
            },
            component: () => import(/* webpackChunkName: "goods-detail" */ '@/views/shops-goods/goods-detail.vue')
        },
        {
            path: 'shops-detail/:id',
            name: 'shops-detail',
            props: true,
            meta: {
                title: '店铺详情'
            },
            component: () => import(/* webpackChunkName: "shops-detail" */ '@/views/shops-goods/shops-detail.vue')
        }
    ]
}

export default routes
