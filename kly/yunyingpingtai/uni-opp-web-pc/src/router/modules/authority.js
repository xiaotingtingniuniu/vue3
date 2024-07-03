import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'authority',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '权限配置',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 2
    },
    children: [
        {
            path: 'authority-organization',
            name: 'authority-organization',
            asideVisible: false,
            meta: {
                title: '组织管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-organization',
                anchors: 'permission-1'
            },
            component: () => import('@/views/authority/organization/index.vue')
        },
        {
            path: 'authority-role',
            name: 'authority-role',
            asideVisible: false,
            meta: {
                title: '角色管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-role',
                anchors: 'permission-6'
            },
            component: () => import('@/views/authority/role/index.vue')
        },
        {
            path: 'authority-role-tag',
            redirect: '/website/authority/authority-role',
            meta: {
                title: '角色管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-organization',
                anchors: 'permission-6'
            },
            component: RouterView,
            children: [
                {
                    path: 'authority-role-newly/:type/:id?',
                    name: 'authority-role-newly',
                    props: true,
                    meta: {
                        title: '新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-role'
                    },
                    component: () => import('@/views/authority/role/src/newly')
                }
            ]
        },
        {
            path: 'authority-consumer',
            name: 'authority-consumer',
            asideVisible: false,
            meta: {
                title: '用户管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-consumer',
                anchors: 'permission-15'
            },
            component: () => import('@/views/authority/consumer/index.vue')
        },
        {
            path: 'authority-consumer-tag',
            redirect: '/website/authority/authority-consumer',
            meta: {
                title: '用户管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-consumer',
                anchors: 'permission-15'
            },
            component: RouterView,
            children: [
                {
                    path: 'authority-consumer-newly/:type/:id?',
                    name: 'authority-consumer-newly',
                    props: true,
                    meta: {
                        title: '新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-consumer'
                    },
                    component: () => import('@/views/authority/consumer/newly.vue')
                }
            ]
        },
        {
            path: 'authority-role-template',
            name: 'authority-role-template',
            asideVisible: false,
            meta: {
                title: '角色模版管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-role-template',
                anchors: 'permission-30'
            },
            component: () => import('@/views/authority/role-template/index.vue')
        },
        {
            path: 'authority-role-template-tag',
            redirect: '/website/authority/authority-role-template',
            meta: {
                title: '角色模版管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'authority-role-template',
                anchors: 'permission-30'
            },
            component: RouterView,
            children: [
                {
                    path: 'authority-role-template-newly/:type/:id?',
                    name: 'authority-role-template-newly',
                    props: true,
                    meta: {
                        title: '新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'authority-role-template'
                    },
                    component: () => import('@/views/authority/role-template/newly.vue')
                }
            ]
        }
    ]
}

export default routes
