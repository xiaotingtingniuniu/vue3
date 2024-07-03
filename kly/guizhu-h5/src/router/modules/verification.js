const routes = [
    {
        path: '/verificationlist',
        name: 'verificationlist',
        meta: {
            title: '团购券核销记录',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "open" */ '@/views/verification/index.vue')
    },
    {
        path: '/verification',
        name: 'verification',
        meta: {
            title: '团购券核销',
            keepAlive: true
        },
        component: () => import(/* webpackChunkName: "scanningFailed" */ '@/views/verification/verification.vue')
    }
]

export default routes
