import { RouterView } from 'vue-router'

const routes = {
    path: '/home-map',
    name: 'home-map',
    redirect: '/home',
    component: RouterView,
    children: [
        {
            path: 'counter-map-index',
            name: 'counter-map-index',
            meta: {
                title: '选择自提柜',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "counter-map-index" */ '@/views/home/counter-map/index.vue')
        },
        {
            path: 'store-map-index',
            name: 'store-map-index',
            meta: {
                title: '选择门店'
            },
            component: () => import(/* webpackChunkName: "store-map-index" */ '@/views/home/store-map/index.vue')
        }
    ]
}

export default routes
