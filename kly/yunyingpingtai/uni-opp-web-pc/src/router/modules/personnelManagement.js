import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'personnelManagement',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '平台运营人员管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 7
    },
    children: [
        {
            path: 'container-operation',
            name: 'container-operation',
            asideVisible: false,
            meta: {
                title: '货柜运营人员管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-operation',
                anchors: 'goods-1'
            },
            component: () => import('@/views/goods/goods-management/index.vue')
        }

    ]
}

export default routes
