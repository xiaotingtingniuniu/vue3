import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'spu-list',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: 'SPU管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 8
    },
    children: [
        {
            path: 'spu-model-training-list',
            name: 'spu-model-training-list',
            asideVisible: false,
            meta: {
                title: 'SPU模型训练表',
                icon: markRaw(FolderOpened),
                activeMenu: 'spu-model-training-list',
                anchors: 'good-property-1'
            },
            component: () => import('@/views/spu-management/spu-model-training-list.vue')
        }
    ]
}

export default routes
