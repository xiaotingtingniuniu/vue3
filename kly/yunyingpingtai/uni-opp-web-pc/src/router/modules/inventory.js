import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'inventory-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '库存中台',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 9
    },
    children: [
        {
            path: 'inventory-management-list',
            name: 'inventory-management-list',
            asideVisible: false,
            meta: {
                title: '库存查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-management-list',
                anchors: 'stock-1'
            },
            component: () => import('@/views/inventory-management/inventory-query.vue')
        },
        {
            path: 'inventory-management-list-tag',
            redirect: '/website/inventory-management/inventory-query-list',
            meta: {
                title: '库存查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-management-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'inventory-add-list',
                    name: 'inventory-add-list',
                    asideVisible: false,
                    meta: {
                        title: '库存增加',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'inventory-management-list'
                    },
                    component: () => import('@/views/inventory-management/inventory-add.vue')
                },
                {
                    path: 'inventory-editor-list',
                    name: 'inventory-editor-list',
                    asideVisible: false,
                    meta: {
                        title: '库存编辑',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'inventory-management-list'
                    },
                    component: () => import('@/views/inventory-management/inventory-editor.vue')
                }
            ]
        },
        {
            path: 'inventory-water-list',
            name: 'inventory-water-list',
            asideVisible: false,
            meta: {
                title: '库存流水',
                icon: markRaw(FolderOpened),
                activeMenu: 'inventory-water-list',
                anchors: 'stock-2'
            },
            component: () => import('@/views/inventory-management/inventory-water.vue')
        }
    ]
}

export default routes
