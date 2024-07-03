const routes = [
    {
        path: '/sign-contract/:id/:busi',
        name: 'sign-contract',
        meta: {
            title: '身份验证'
        },
        component: () => import('@/views/sign-contract/index.vue')
    },
    {
        path: '/merchant-msg/:id/:busi/:flag?',
        name: 'merchant-msg',
        meta: {
            title: '信息确认'
        },
        component: () => import('@/views/sign-contract/merchant-msg.vue')
    },
    {
        path: '/agreement-detail/:id/:busi',
        name: 'agreement-detail',
        meta: {
            title: '协议详情'
        },
        component: () => import('@/views/sign-contract/agreement-detail.vue')
    }
]

export default routes
