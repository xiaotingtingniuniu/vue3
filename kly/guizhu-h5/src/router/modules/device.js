import { RouterView } from 'vue-router'

export default [
    {
        path: '/device',
        name: 'device',
        component: RouterView,
        children: [
            {
                path: 'device-list',
                name: 'device-list',
                meta: {
                    title: '设备管理'
                },
                component: () => import('@/views/device/list.vue')
            },
            {
                path: 'merchant-list',
                name: 'merchant-list',
                meta: {
                    title: '我的设备'
                },
                component: () => import('@/views/device/merchant-list.vue')
            },
            {
                path: 'device-detail/:locationName?/:address?',
                name: 'device-detail',
                meta: {
                    title: '设备详请'
                },
                component: () => import('@/views/device/device-details.vue')
            },
            {
                path: 'device-seat',
                name: 'device-seat',
                meta: {
                    title: '安装位置'
                },
                component: () => import('@/views/device/device-seart.vue')
            },
            {
                path: 'device-activation',
                name: 'device-activation',
                meta: {
                    title: '设备激活'
                },
                component: () => import('@/views/device/activation.vue')
            },
            {
                path: 'approval-details',
                name: 'approval-details',
                meta: {
                    title: '审批详情'
                },
                component: () => import('@/views/device/approval-details.vue')
            },
            {
                path: '/history-signal',
                name: 'history-signal',
                meta: {
                    title: '历史信号'
                },
                component: () => import('@/views/device/history-signal.vue')
            },
            {
                path: 'device-offline',
                name: 'device-offline',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/device-offline.vue')
            },
            // 远程拍照工单
            {
                path: 'camera-abnormal',
                name: 'camera-abnormal',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/camera-abnormall.vue')
            },
            {
                path: 'abnormal-position',
                name: 'abnormal-position',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/abnormal-position.vue')
            },
            {
                path: 'device-contract',
                name: 'device-contract',
                meta: {
                    title: '选择合同'
                },
                component: () => import('@/views/device/device-contract.vue')
            },
            {
                path: 'device-point',
                name: 'device-point',
                meta: {
                    title: '选择合同货柜编号'
                },
                component: () => import('@/views/device/device-point.vue')
            },
            {
                path: 'abnormal-temperature',
                name: 'abnormal-temperature',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/abnormal/temperature.vue')
            },
            {
                path: 'abnormal-camera',
                name: 'abnormal-camera',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/abnormal/camera.vue')
            },
            {
                path: 'abnormal-door-lock',
                name: 'abnormal-door-lock',
                meta: {
                    title: '工单详情'
                },
                component: () => import('@/views/device/abnormal/door-lock.vue')
            }
        ]
    }
]
