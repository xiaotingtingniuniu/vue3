import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'platform-operation',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '平台运营人员管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 24
    },
    children: [
        {
            path: 'container-operation-list',
            name: 'container-operation-list',
            asideVisible: false,
            meta: {
                title: '货柜运营人员管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-operation-list',
                anchors: 'cabinet-operate-manage'
            },
            component: () => import('@/views/platform-operation/container-operation-list.vue')
        }
    ]
}

export default routes
