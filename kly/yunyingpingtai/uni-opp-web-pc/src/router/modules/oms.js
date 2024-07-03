import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'OMS',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: 'OMS',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 306
    },
    children: [
        {
            path: 'purchase-replenishment-list',
            name: 'purchase-replenishment-list',
            asideVisible: false,
            meta: {
                title: '采购补货类单据管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-replenishment-list',
                anchors: 'oms-purchase-replenish-invoice-manage'
            },
            component: () => import('@/views/oms/purchase-replenishment/index.vue')
        },
        {
            path: 'purchase-replenishment-list-tag',
            redirect: '/website/OMS/purchase-replenishment-list',
            meta: {
                title: '采购补货类单据管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-replenishment-list',
                anchors: 'oms-purchase-replenish-invoice-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'purchase-replenishment-detail/:id?',
                    name: 'purchase-replenishment-detail',
                    props: true,
                    meta: {
                        title: '单据详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'purchase-replenishment-list'
                    },
                    component: () => import('@/views/oms/purchase-replenishment/detail.vue')
                },
                {
                    path: 'purchase-replenishment-edit/:id?',
                    name: 'purchase-replenishment-edit',
                    props: true,
                    meta: {
                        title: '虚拟出入库确认',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'purchase-replenishment-list'
                    },
                    component: () => import('@/views/oms/purchase-replenishment/edit.vue')
                }
            ]
        },
        {
            path: 'sale-bill-list',
            name: 'sale-bill-list',
            asideVisible: false,
            meta: {
                title: '销售类单据管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'sale-bill-list',
                anchors: 'oms-sale-invoice-manage'
            },
            component: () => import('@/views/oms/sale-bill/index.vue')
        },
        {
            path: 'sale-bill-list-tag',
            redirect: '/website/OMS/sale-bill-list',
            meta: {
                title: '销售类单据管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'sale-bill-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'sale-bill-detail/:id?',
                    name: 'sale-bill-detail',
                    props: true,
                    meta: {
                        title: '单据详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'sale-bill-list'
                    },
                    component: () => import('@/views/oms/sale-bill/detail.vue')
                },
                {
                    path: 'sale-bill-edit/:id?',
                    name: 'sale-bill-edit',
                    props: true,
                    meta: {
                        title: '虚拟发货确认',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'sale-bill-list'
                    },
                    component: () => import('@/views/oms/sale-bill/edit.vue')
                }
            ]
        }
    ]
}

export default routes
