const routes = [
    {
        path: '/containerDetails/:billNo',
        name: 'containerDetails',
        meta: {
            title: '收入详情'
        },
        component: () => import(/* webpackChunkName: "containerDetails" */ '@/views/containerRevenue/containerDetails.vue')
    },
    {
        path: '/containerIncome',
        name: 'containerIncome',
        meta: {
            title: '货柜收入'
        },
        component: () => import(/* webpackChunkName: "containerIncome" */ '@/views/containerRevenue/containerIncome.vue')
    }
]

export default routes
