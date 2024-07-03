import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'ka-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: 'KA管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 34
    },
    children: [
        {
            path: 'ka-definition-list',
            name: 'ka-definition-list',
            asideVisible: false,
            meta: {
                title: 'KA定义',
                icon: markRaw(FolderOpened),
                activeMenu: 'ka-definition-list',
                anchors: 'ka-definition-list'
            },
            component: () => import('@/views/ka-management/ka-definition/index.vue')
        },
        {
            path: 'ka-merchant-list',
            name: 'ka-merchant-list',
            asideVisible: false,
            meta: {
                title: 'KA商户配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'ka-merchant-list',
                anchors: 'ka-merchant-list'
            },
            component: () => import('@/views/ka-management/ka-merchant/index.vue')
        }

    ]
}

export default routes
