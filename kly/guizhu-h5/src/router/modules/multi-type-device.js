import { RouterView } from 'vue-router'

export default [
    {
        path: '/multi-type-device',
        name: 'multi-type-device',
        component: RouterView,
        children: [
            {
                path: 'device-dispatch',
                name: 'device-dispatch',
                meta: {
                    title: ''
                },
                component: () => import('@/views/multi-type-device/device-dispatch.vue')
            },
            {
                path: 'select-device-door',
                name: 'select-device-door',
                meta: {
                    title: '选择货柜门'
                },
                component: () => import('@/views/multi-type-device/select-device-door.vue')
            }
        ]
    }
]
