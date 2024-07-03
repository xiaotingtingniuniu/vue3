import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'containerManagement',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '货柜业务管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 26
    },
    children: [
        // {
        //     path: 'opendoorRecord',
        //     name: 'opendoorRecord',
        //     asideVisible: false,
        //     meta: {
        //         title: '开门记录',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'commodity-range',
        //         anchors: 'cabinet-business-open-door-record'
        //     },
        //     component: () => import('@/views/containerManagement/opendoorRecord/index.vue')
        // },
        // {
        //     path: 'opendoorRecord',
        //     redirect: '/website/containerManagement/opendoorRecord',
        //     meta: {
        //         title: '开门记录',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'merchant-settle-list'
        //         // anchors: 'merchant-0'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'opendoorRecordDetail/:recordID',
        //             name: 'opendoorRecordDetail',
        //             props: true,
        //             meta: {
        //                 title: '开门详情',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'settle-in-means'
        //             },
        //             component: () => import('@/views/containerManagement/opendoorRecord/detail.vue')
        //         }
        //     ]
        // },
        {
            path: 'salesOrder',
            name: 'salesOrder',
            asideVisible: false,
            meta: {
                title: '销售订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'salesOrder',
                anchors: 'cabinet-business-sale-order'
            },
            component: () => import('@/views/containerManagement/salesOrder/index.vue')
        },
        {
            path: 'salesOrder',
            redirect: '/website/containerManagement/salesOrder',
            meta: {
                title: '销售订单',
                icon: markRaw(FolderOpened),
                activeMenu: 'salesOrder'
            },
            component: RouterView,
            children: [
                {
                    path: 'salesOrderDetail/:orderID',
                    name: 'salesOrderDetail',
                    props: true,
                    meta: {
                        title: '销售订单详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'salesOrder'
                    },
                    component: () => import('@/views/containerManagement/salesOrder/detail.vue')
                },
                {
                    path: 'opendoorRecordDetail/:recordID',
                    name: 'opendoorRecordDetail',
                    props: true,
                    meta: {
                        title: '开门详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'settle-in-means'
                    },
                    component: () => import('@/views/containerManagement/opendoorRecord/detail.vue')
                },
                {
                    path: 'abnormalOrderDetail',
                    name: 'abnormalOrderDetail',
                    props: true,
                    meta: {
                        title: '异常订单',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'settle-in-means'
                    },
                    component: () => import('@/views/containerManagement/salesOrder/abnormal-order-detail.vue')
                }
            ]
        }
    ]
}

export default routes
