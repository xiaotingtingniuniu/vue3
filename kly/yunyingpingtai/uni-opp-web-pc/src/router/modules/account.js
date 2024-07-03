import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'account',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '账户管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 27
    },
    children: [
        {
            path: 'account-select',
            name: 'account-select',
            asideVisible: false,
            meta: {
                title: '业务线账户管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'account-select',
                anchors: 'account-manage-busi-account'
            },
            component: () => import('@/views/accountManagement/accountSelect/index.vue')
        },
        {
            path: 'account-water',
            name: 'account-water',
            asideVisible: false,
            meta: {
                title: '动账流水下载',
                icon: markRaw(FolderOpened),
                activeMenu: 'account-water',
                anchors: 'account-manage-flow-download'
            },
            component: () => import('@/views/accountManagement/accountWater/index.vue')
        },
        {
            path: 'business-account',
            name: 'business-account',
            asideVisible: false,
            meta: {
                title: '业务线账户管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'business-account',
                anchors: 'account-manage-flow-download'
            },
            component: () => import('@/views/accountManagement/businessaccount/index.vue')
        },
        {
            path: 'business-accountwater',
            name: 'business-accountwater',
            asideVisible: false,
            meta: {
                title: '业务线动账流水下载',
                icon: markRaw(FolderOpened),
                activeMenu: 'business-accountwater',
                anchors: 'account-manage-busi-account-download'
            },
            component: () => import('@/views/accountManagement/busmovaccountwater/index.vue')
        },
        {
            path: 'platform-account',
            name: 'platform-account',
            asideVisible: false,
            meta: {
                title: '平台账户管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'platform-account',
                anchors: 'account-manage-pm-account'
            },
            component: () => import('@/views/accountManagement/platformaccount/index.vue')
        },
        {
            path: 'platform-accountwater',
            name: 'platform-accountwater',
            asideVisible: false,
            meta: {
                title: '平台动账流水下载',
                icon: markRaw(FolderOpened),
                activeMenu: 'platform-accountwater',
                anchors: 'account-manage-pm-account-download'
            },
            component: () => import('@/views/accountManagement/platmovaccoutwater/index.vue')
        }
    ]
}

export default routes
