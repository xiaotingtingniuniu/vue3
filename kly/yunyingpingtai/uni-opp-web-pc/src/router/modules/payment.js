import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'payment-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '支付管理',
        icon: markRaw(Box),
        cannotClick: true
    },
    children: [
        {
            path: 'white-list',
            name: 'white-list',
            asideVisible: false,
            meta: {
                title: '白名单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'white-list'
            },
            component: () => import('@/views/payment-management/white-list.vue')
        },
        {
            path: 'white-list-tag',
            redirect: '/website/payment-management/white-list',
            meta: {
                title: '白名单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'white-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-white/:type?',
                    name: 'add-white',
                    props: true,
                    meta: {
                        title: '添加白名单',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'white-list'
                    },
                    component: () => import('@/views/payment-management/comments/add-white.vue')
                }
            ]
        }
    ]
}

export default routes
