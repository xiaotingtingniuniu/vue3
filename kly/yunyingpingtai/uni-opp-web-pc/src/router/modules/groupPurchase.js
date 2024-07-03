import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'group-purchase-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '团购管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 32
    },
    children: [
        {
            path: 'group-purchase-active-management',
            name: 'group-purchase-active-management',
            asideVisible: false,
            meta: {
                title: '团购活动管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'group-purchase-active-management',
                anchors: 'purchase-manage-activity'
            },
            component: () => import('@/views/group-purchase-management/active-manage.vue')
        },
        {
            path: 'group-purchase-management-tag',
            redirect: '/website/group-purchase-management/group-purchase-active-management',
            meta: {
                title: '团购活动管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'group-purchase-active-management',
                anchors: 'purchase-manage-activity'
            },
            component: RouterView,
            children: [
                {
                    path: 'group-purchase-active-list/:skuId?',
                    name: 'group-purchase-active-list',
                    asideVisible: false,
                    meta: {
                        title: '团购活动',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'group-purchase-active-list'
                    },
                    component: () => import('@/views/group-purchase-management/active-list.vue')
                },
                {
                    path: 'coupon-detail-List/:skuId?/:batchCode?',
                    name: 'coupon-detail-List',
                    asideVisible: false,
                    meta: {
                        title: '券详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'coupon-detail-List'
                    },
                    component: () => import('@/views/group-purchase-management/coupon-detail-List.vue')
                },
                {
                    path: 'group-purchase-active-config/:type/:skuId?/:batchCode?',
                    name: 'group-purchase-active-config',
                    asideVisible: false,
                    meta: {
                        title: '配置团购活动',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'group-purchase-active-config'
                    },
                    component: () => import('@/views/group-purchase-management/active-config.vue')
                }
            ]
        }
    ]
}

export default routes
