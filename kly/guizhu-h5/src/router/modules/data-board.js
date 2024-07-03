const routes = [
    {
        path: '/data-board',
        name: 'data-board',
        meta: {
            title: '数据统计'
        },
        component: () => import(/* webpackChunkName: "data-board" */ '@/views/data-board/index.vue')
    },
    {
        path: '/device-sale-detail',
        name: 'device-sale-detail',
        meta: {
            title: '设备销售详情'
        },
        component: () => import(/* webpackChunkName: "data-board" */ '@/views/data-board/device-sale-detail.vue')
    }
]

export default routes
