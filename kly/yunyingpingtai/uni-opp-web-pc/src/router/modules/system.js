import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'system-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '系统管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 4
    },
    children: [
        {
            path: 'dict-config',
            name: 'dict-config',
            asideVisible: false,
            meta: {
                title: '字典配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'dict-config',
                anchors: 'system-1'
            },
            component: () => import('@/views/system-management/dict-config.vue')
        },
        {
            path: 'dict-config-tag',
            redirect: '/website/system-management/dict-config',
            meta: {
                title: '字典配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'dict-config'
            },
            component: RouterView,
            children: [
                {
                    path: 'dictconfig-handle',
                    name: 'dictconfig-handle',
                    props: true,
                    meta: {
                        title: '字典配置项',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'dictconfig-handle'
                    },
                    component: () => import('@/views/system-management/components/dictconfig-handle.vue')
                }
            ]
        },
        {
            path: 'url-config',
            name: 'url-config',
            asideVisible: false,
            meta: {
                title: '接口配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'url-config',
                anchors: 'system-interface-config'
            },
            component: () => import('@/views/system-management/url-config.vue')
        },
        {
            path: 'url-config-tag',
            redirect: '/website/system-management/url-config',
            meta: {
                title: '接口配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'url-config'
            },
            component: RouterView,
            children: [
                {
                    path: 'urlconfig-handle',
                    name: 'urlconfig-handle',
                    props: true,
                    meta: {
                        title: '接口配置项',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'urlconfig-handle'
                    },
                    component: () => import('@/views/system-management/components/urlconfig-handle.vue')
                },
                {
                    path: 'guizhu-urlconfig-handle',
                    name: 'guizhu-urlconfig-handle',
                    props: true,
                    meta: {
                        title: '接口配置项',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'guizhu-urlconfig-handle'
                    },
                    component: () => import('@/views/system-management/components/guizhu-urlconfig-handle.vue')
                }
            ]
        }
    ]
}

export default routes
