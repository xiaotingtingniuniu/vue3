import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'head-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '团长管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 15
    },
    children: [
        {
            path: 'head-management-list',
            name: 'head-management-list',
            asideVisible: false,
            meta: {
                title: '团长列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'head-management-list',
                anchors: 'gleader-list'
            },
            component: () => import('@/views/head-management/head-management-list.vue')
        },
        {
            path: 'head-application',
            name: 'head-application',
            asideVisible: false,
            meta: {
                title: '团长申请审批表',
                icon: markRaw(FolderOpened),
                activeMenu: 'head-application',
                anchors: 'gleader-audit'
            },
            component: () => import('@/views/head-management/head-application.vue')
        }
    ]
}

export default routes
