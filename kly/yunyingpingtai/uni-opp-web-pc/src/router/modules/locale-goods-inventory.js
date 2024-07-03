import { RouterView } from 'vue-router'
import { markRaw } from 'vue'

import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'inventory',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '本地生活库存管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 31
    },
    children: [
        {
            path: 'inventory-management-local-list',
            name: 'inventory-management-local-list',
            asideVisible: false,

            meta: {
                title: '库存查询',
                icon: markRaw(FolderOpened),
                cannotClick: true,
                activeMenu: 'inventory-management-local-list',
                anchors: 'stock-manage-local-life-query'
            },
            component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-query.vue')

        },
        {
            path: 'inventory-management-local-list-tag',
            name: 'inventory-management-local-list-tag',
            redirect: '/website/inventory/inventory-management-local-list',

            meta: {
                title: '库存查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-management-local-list',
                anchors: 'stock-manage-local-life-query '

                // anchors: 'mer-stock-1'
            },
            component: RouterView,
            children: [
                {
                    path: 'inventory-management-local-detail/:id?',
                    name: 'inventory-management-local-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '查看详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'inventory-management-local-list'
                    },
                    component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-management-local-detail.vue')
                },
                {
                    path: 'inventory-edit/:id?',
                    name: 'inventory-edit',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '库存流水编辑',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'inventory-management-local-list'
                        // anchors: 'mer-stock-1'
                    },
                    component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-edit.vue')
                }

            ]

            // component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-query.vue')

        },
        {
            path: 'inventory-management-statement',
            name: 'inventory-management-statement',
            asideVisible: false,
            meta: {
                title: '库存流水查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-management-statement',
                anchors: 'stock-manage-local-life-flow-query'
            },
            component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-statement.vue')
        }

    ]
    // children: [

    // {
    //     path: 'inventory-management',
    //     name: 'inventory-management',
    //     asideVisible: true,
    //     component: RouterView,
    //     meta: {
    //         title: '本地生活库存管理',
    //         icon: markRaw(Box),
    //         // serverId: 29,
    //         cannotClick: true
    //         // anchors: 'good-auduit-spu-add'
    //     },

    // }
    // {
    //     path: 'inventory-management-local-list-tag',
    //     name: 'inventory-management-local-list-tag',
    //     redirect: '/website/inventory-management-local/inventory-management-local-list',

    //     meta: {
    //         title: '库存查询',
    //         icon: markRaw(FolderOpened),
    //         activeMenu: 'inventory-management-local'
    //         // anchors: 'mer-stock-1'
    //     },
    //     component: RouterView,
    //     children: [
    //         // {
    //         //     path: 'inventory-management-local-detail',
    //         //     name: 'inventory-management-local-detail',
    //         //     asideVisible: false,
    //         //     meta: {
    //         //         title: '查看详情',
    //         //         icon: markRaw(FolderOpened),
    //         //         activeMenu: 'inventory-management-local-detail'
    //         //     },
    //         //     component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-management-local-detail.vue')
    //         // }
    //         // {
    //         //     path: 'inventory-edit/:id?',
    //         //     name: 'inventory-edit',
    //         //     asideVisible: false,
    //         //     meta: {
    //         //         title: '库存流水编辑',
    //         //         icon: markRaw(FolderOpened),
    //         //         activeMenu: 'inventory-edit'
    //         //         // anchors: 'mer-stock-1'
    //         //     },
    //         //     component: () => import('@/views/locale-goods-inventory/products-inventory/inventory-edit.vue')
    //         // }
    //     ]
    // }

    // ]
}

export default routes
