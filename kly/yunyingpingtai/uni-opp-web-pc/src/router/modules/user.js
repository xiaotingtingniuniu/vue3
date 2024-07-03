import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'register-user',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '用户数据管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 14
    },
    children: [
        {
            path: 'register-user-list',
            name: 'register-user-list',
            asideVisible: false,
            meta: {
                title: '用户数据列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'register-user-list',
                anchors: 'user-manager-1'
            },
            component: () => import('@/views/user/register-user-list.vue')
        },
        {
            path: 'userDistribution',
            name: 'userDistribution',
            asideVisible: false,
            meta: {
                title: '分销记录表',
                icon: markRaw(FolderOpened),
                activeMenu: 'userDistribution',
                anchors: 'user-manager-2'
            },
            component: () => import('@/views/user/userDistribution.vue')
        }
    ]
}

export default routes
