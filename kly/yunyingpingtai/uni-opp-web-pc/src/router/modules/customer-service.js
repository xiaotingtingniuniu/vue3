import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'customerservice',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '客服工单管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 3
    },
    children: [
        {
            path: 'work-order-list',
            name: 'work-order-list',
            asideVisible: false,
            meta: {
                title: '工单列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'work-order-list',
                anchors: 'custom-1'
            },
            component: () => import('@/views/customerservice/work-order-list.vue')
        },
        {
            path: 'wechart-off-list',
            name: 'wechart-off-list',
            asideVisible: false,
            meta: {
                title: '关闭微信支付分',
                icon: markRaw(FolderOpened),
                activeMenu: 'wechart-off-list',
                anchors: 'custom-2'
            },
            component: () => import('@/views/customerservice/wechart-off-list.vue')
        },
        {
            path: 'work-order-list-tag',
            redirect: '/website/customerservice/work-order-list',
            meta: {
                title: '工单列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'work-order-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'work-order-detail/:orderNo',
                    name: 'work-order-detail',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'work-order-detail'
                    },
                    component: () => import('@/views/customerservice/work-order-detail.vue')
                }
            ]
        },
        {
            path: 'compensation-coupon-list',
            name: 'compensation-coupon-list',
            asideVisible: false,
            meta: {
                title: '体验补偿优惠券',
                icon: markRaw(FolderOpened),
                activeMenu: 'compensation-coupon-list',
                anchors: 'custom-3'
            },
            component: () => import('@/views/customerservice/compensation-coupon.vue')
        },
        {
            path: 'send-coupon-list',
            name: 'send-coupon-list',
            asideVisible: false,
            meta: {
                title: '发送优惠券操作记录',
                icon: markRaw(FolderOpened),
                activeMenu: 'send-coupon-list',
                anchors: 'custom-4'
            },
            component: () => import('@/views/customerservice/send-coupon.vue')
        },
        {
            path: 'container-list',
            name: 'container-list',
            asideVisible: false,
            meta: {
                title: '货柜商品退款工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-list',
                anchors: 'custom-cabinet-order'
            },
            component: () => import('@/views/customerservice/container-order-list.vue')
        },
        {
            path: 'container-list-tag',
            redirect: '/website/customerservice/container-list',
            meta: {
                title: '货柜商品退款工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'order-detail/:orderNo/:iscon',
                    name: 'container-order-details',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'order-detail'
                    },
                    component: () => import('@/views/customerservice/order-detail.vue')
                }
            ]
        },
        {
            path: 'online-order-list',
            name: 'online-order-list',
            asideVisible: false,
            meta: {
                title: '电商工单列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'online-order-list',
                anchors: 'custom-ecommerce-order'
            },
            component: () => import('@/views/customerservice/online-order-list.vue')
        },
        {
            path: 'online-order-list-tag',
            redirect: '/website/customerservice/online-order-list',
            meta: {
                title: '电商工单列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'online-order-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'order-detail/:orderNo/:iscon',
                    name: 'online-order-detail',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'order-detail'
                    },
                    component: () => import('@/views/customerservice/order-detail.vue')
                }
            ]
        },
        {
            path: 'abnormal-order-list',
            name: 'abnormal-order-list',
            asideVisible: false,
            meta: {
                title: '货柜异常识别工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'abnormal-order-list',
                anchors: 'custom-exception-order'
            },
            component: () => import('@/views/customerservice/abnormal-order-list.vue')
        },
        {
            path: 'abnormal-order-list-tag',
            redirect: '/website/customerservice/abnormal-order-list',
            meta: {
                title: '货柜异常识别工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'abnormal-order-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'abnormal-order-detail/:orderNo/:iscon',
                    name: 'abnormal-order-detail',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'abnormal-order-detail'
                    },
                    component: () => import('@/views/customerservice/abnormal-order-detail.vue')
                }
            ]
        },
        {
            path: 'wechart-complaint-list',
            name: 'wechart-complaint-list',
            asideVisible: false,
            meta: {
                title: '微信投诉工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'wechart-complaint-list',
                anchors: 'custom-vx-order'
            },
            component: () => import('@/views/customerservice/wechart-complaint-list.vue')
        },
        {
            path: 'order-search-tool',
            name: 'order-search-tool',
            asideVisible: false,
            meta: {
                title: '货柜商品补退工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-search-tool',
                anchors: 'custom-order-tools'
            },
            component: () => import('@/views/customerservice/order-search-tool.vue')
        },
        {
            path: 'order-search-tool-tag',
            redirect: '/website/customerservice/order-search-tool',
            meta: {
                title: '货柜商品补退工单',
                icon: markRaw(FolderOpened),
                activeMenu: 'order-search-tool'
            },
            component: RouterView,
            children: [
                {
                    path: 'abnormal-order-detail/:orderNo/:iscon',
                    name: 'makeup-order-detail',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'abnormal-order-detail'
                    },
                    component: () => import('@/views/customerservice/abnormal-order-detail.vue')
                }
            ]
        },
        // {
        //     path: 'coupon-tool',
        //     name: 'coupon-tool',
        //     asideVisible: false,
        //     meta: {
        //         title: '优惠券核销工具',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'coupon-tool'
        //     },
        //     component: () => import('@/views/customerservice/coupon-tool.vue')
        // },
        {
            path: 'coupon-tool',
            name: 'coupon-tool',
            asideVisible: false,
            meta: {
                title: '优惠券核销工具',
                icon: markRaw(FolderOpened),
                activeMenu: 'coupon-tool',
                anchors: 'custom-coupon-tools'
            },
            component: () => import('@/views/customerservice/coupon-tool.vue')
        },
        {
            path: 'coupon-tool-tag',
            redirect: '/website/customerservice/coupon-tool',
            meta: {
                title: '优惠券核销工具',
                icon: markRaw(FolderOpened),
                activeMenu: 'coupon-tool'
            },
            component: RouterView,
            children: [
                {
                    path: 'coupon-detail/:handleType/:groupCode?/:subCode?',
                    name: 'coupon-details',
                    props: true,
                    meta: {
                        title: '详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'coupon-detail'
                    },
                    component: () => import('@/views/customerservice/coupon-detail.vue')
                }
            ]
        }
        // {
        //     path: 'order-tool',
        //     name: 'order-tool',
        //     asideVisible: false,
        //     meta: {
        //         title: '订单查询工具',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'order-tool'
        //     },
        //     component: () => import('@/views/customerservice/order-tool.vue')
        // },
        // {
        //     path: 'order-tool-tag',
        //     redirect: '/website/customerservice/order-tool',
        //     meta: {
        //         title: '订单查询工具',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'order-tool'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'order-tool-detail/:handleType',
        //             name: 'order-tool-detail',
        //             props: true,
        //             meta: {
        //                 title: '详情',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'order-tool-detail'
        //             },
        //             component: () => import('@/views/customerservice/order-tool-detail.vue')
        //         }
        //     ]
        // }

    ]
}

export default routes
