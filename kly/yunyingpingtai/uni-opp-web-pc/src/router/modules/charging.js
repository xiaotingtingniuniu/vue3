import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'charging',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '计费配置',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 23
    },
    children: [
        {
            path: 'billing-item',
            name: 'billing-item',
            asideVisible: false,
            meta: {
                title: '计费项费率',
                icon: markRaw(FolderOpened),
                activeMenu: 'billing-item',
                anchors: 'charge-rate'
            },
            component: () => import('@/views/charging/billing-item')
        },
        {
            path: 'billing-item-tag',
            redirect: '/website/charging/billing-item',
            meta: {
                title: '计费项费率',
                icon: markRaw(FolderOpened),
                activeMenu: 'billing-item'
                // anchors: 'permission-6'
            },
            component: RouterView,
            children: [
                {
                    path: 'billing-item-add',
                    name: 'billing-item-add',
                    props: true,
                    meta: {
                        title: '新增计费项费率',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-role'
                    },
                    component: () => import('@/views/charging/billing-item/add.vue')
                },
                {
                    path: 'billing-item-edit/:id?',
                    name: 'billing-item-edit',
                    props: true,
                    meta: {
                        title: '编辑计费项费率',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-role'
                    },
                    component: () => import('@/views/charging/billing-item/edit.vue')
                }
            ]
        },
        {
            path: 'accounting-strategy',
            name: 'accounting-strategy',
            asideVisible: false,
            meta: {
                title: '计费策略',
                icon: markRaw(FolderOpened),
                activeMenu: 'accounting-strategy',
                anchors: 'charge-strategy'
            },
            component: () => import('@/views/charging/accounting-strategy')
        },
        {
            path: 'accounting-strategy-tag',
            redirect: '/website/charging/accounting-strategy',
            meta: {
                title: '计费策略',
                icon: markRaw(FolderOpened),
                activeMenu: 'accounting-strategy'
                // anchors: 'permission-6'
            },
            component: RouterView,
            children: [
                {
                    path: 'accounting-strategy-add',
                    name: 'accounting-strategy-add',
                    props: true,
                    meta: {
                        title: '新增策略',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-role'
                    },
                    component: () => import('@/views/charging/accounting-strategy/add.vue')
                }
            ]
        },
        {
            path: 'algorithm-bill',
            name: 'algorithm-bill',
            asideVisible: false,
            meta: {
                title: '算法服务费账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'algorithm-bill',
                anchors: 'charge-algorithm-bill'
            },
            component: () => import('@/views/charging/algorithm/algorithm-bill.vue')
        },
        {
            path: 'category-rate',
            name: 'category-rate',
            asideVisible: false,
            meta: {
                title: '类目费率',
                icon: markRaw(FolderOpened),
                activeMenu: 'category-rate',
                anchors: 'charge-category-rate'
            },
            component: () => import('@/views/charging/categoryrate/index.vue')
        }
    ]
}

export default routes
