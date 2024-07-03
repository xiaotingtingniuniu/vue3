import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'distributionManagement',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '分销管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 17
    },
    children: [
        {
            path: 'distribution-ratio-config',
            name: 'distribution-ratio-config',
            asideVisible: false,
            meta: {
                title: '分销比例配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'distribution-ratio-config',
                anchors: 'distri-ratio'
            },
            component: () => import('@/views/distributionManagement/distribution-ratio-config.vue')
        },
        {
            path: 'category-distribution-rate-config',
            name: 'category-distribution-rate-config',
            asideVisible: false,
            meta: {
                title: '类目分销费率配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'category-distribution-rate-config',
                anchors: 'distri-cate-rate'
            },
            component: () => import('@/views/distributionManagement/category-distribution-rate-config.vue')
        }
    ]
}

export default routes
