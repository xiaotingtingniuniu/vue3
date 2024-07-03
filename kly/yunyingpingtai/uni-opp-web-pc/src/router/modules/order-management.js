import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'order-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '订单管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 13
    },
    children: [
        // {
        //     path: 'order-list-list',
        //     name: 'order-list-list',
        //     asideVisible: false,
        //     meta: {
        //         title: '订单列表',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'order-list-list',
        //         anchors: 'order-1'

        //     },
        //     component: () => import('@/views/order-management/order-list.vue')
        // },
        {
            path: 'order-list-list-tag',
            redirect: '/website/order-management/order-list-list',
            meta: {
                title: '订单列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-list-list',
                anchors: 'order-1'
            },
            component: RouterView,
            children: [
                {
                    path: 'form-information-list/:orderNoSub',
                    name: 'form-information-list',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '表单信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'form-information-list'
                    },
                    component: () => import('@/views/order-management/form-information.vue')
                }
            ]
        },
        {
            path: 'online-retailers-list',
            name: 'online-retailers-list',
            asideVisible: false,
            meta: {
                title: '电商订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-1',
                anchors: 'order-1'

            },
            component: () => import('@/views/order-management/e-commerce/index.vue')
        },
        {
            path: 'online-retailers-list-tag',
            redirect: '/website/order-management/online-retailers-list',
            meta: {
                title: '电商订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-1',
                anchors: 'order-1'
            },
            component: RouterView,
            children: [
                {
                    path: 'online-retailers-detail/:orderNoSub',
                    name: 'online-retailers-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '订单详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'online-retailers-list'
                    },
                    component: () => import('@/views/order-management/e-commerce/detail.vue')
                }
            ]
        },
        {
            path: 'container-order-list',
            name: 'container-order-list',
            asideVisible: false,
            meta: {
                title: '货柜订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-cabinet',
                anchors: 'order-cabinet'

            },
            component: () => import('@/views/order-management/container/index.vue')
        },
        {
            path: 'container-order-list-tag',
            redirect: '/website/order-management/container-order-list',
            meta: {
                title: '货柜订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-cabinet',
                anchors: 'order-cabinet'
            },
            component: RouterView,
            children: [
                {
                    path: 'container-order-detail/:orderNoSub',
                    name: 'container-order-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '订单详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-order-list'
                    },
                    component: () => import('@/views/order-management/container/detail.vue')
                }
            ]
        },
        {
            path: 'wholesale-order-list',
            name: 'wholesale-order-list',
            asideVisible: false,
            meta: {
                title: '批发订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-batch',
                anchors: 'order-batch'

            },
            component: () => import('@/views/order-management/wholesale/index.vue')
        },
        {
            path: 'wholesale-order-list-tag',
            redirect: '/website/order-management/wholesale-order-list',
            meta: {
                title: '批发订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-batch',
                anchors: 'order-batch'
            },
            component: RouterView,
            children: [
                {
                    path: 'wholesale-order-detail/:orderNoSub',
                    name: 'wholesale-order-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '订单详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'wholesale-order-list'
                    },
                    component: () => import('@/views/order-management/wholesale/detail.vue')
                }
            ]
        },
        {
            path: 'loc-life-order',
            name: 'loc-life-order',
            asideVisible: false,
            meta: {
                title: '本地生活订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-local-life',
                anchors: 'order-local-life'

            },
            component: () => import('@/views/order-management/loc-life-order/index.vue')
        },
        {
            path: 'loc-life-order',
            redirect: '/website/order-management/loc-life-order',
            meta: {
                title: '本地生活订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'loc-life-order'
            },
            component: RouterView,
            children: [
                {
                    path: 'loc-life-order-detail/:orderNoSub',
                    name: 'loc-life-order-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '订单详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'loc-life-order'
                    },
                    component: () => import('@/views/order-management/loc-life-order/detail.vue')
                }
            ]
        }
    ]
}

export default routes
