import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'container-inventory-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '货柜商品库存',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 19
    },
    children: [
        {
            path: 'container-inventory-management-list',
            name: 'container-inventory-management-list',
            asideVisible: false,
            meta: {
                title: 'SKU库存查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-inventory-management-list',
                anchors: 'carbinet-good-stock-query'
            },
            component: () => import('@/views/container-inventory-management/inventory-query.vue')
        },
        {
            path: 'container-inventory-water-list',
            name: 'container-inventory-water-list',
            asideVisible: false,
            meta: {
                title: 'SKU库存流水',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-inventory-water-list',
                anchors: 'carbinet-good-stock-flow'
            },
            component: () => import('@/views/container-inventory-management/inventory-water.vue')
        },
        {
            path: 'inventory-stockList-list',
            name: 'inventory-stockList-list',
            asideVisible: false,
            meta: {
                title: '补货单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-stockList-list',
                anchors: 'carbinet-good-stock-supply'
            },
            component: () => import('@/views/container-inventory-management/inventory-stockList.vue')
        },
        {
            path: 'rule-configuration-list',
            name: 'rule-configuration-list',
            asideVisible: false,
            meta: {
                title: '补货规则配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'rule-configuration-list',
                anchors: 'carbinet-good-replenishment-config'
            },
            component: () => import('@/views/container-inventory-management/rule-configuration.vue')
        },
        {
            path: 'replenishment-rule-list',
            name: 'replenishment-rule-list',
            asideVisible: false,
            meta: {
                title: '货柜补货规则查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'replenishment-rule-list',
                anchors: 'carbinet-good-replenishment-rule'
            },
            component: () => import('@/views/container-inventory-management/replenishment-rule.vue')
        },
        {
            path: 'check-stockList-list',
            name: 'check-stockList-list',
            asideVisible: false,
            meta: {
                title: '盘点单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'check-stockList-list',
                anchors: 'carbinet-good-stock-check'
            },
            component: () => import('@/views/container-inventory-management/check-stockList.vue')
        }
    ]
}

export default routes
