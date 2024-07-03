import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'resource-bit',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '资源位管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 11
    },
    children: [
        {
            path: 'banner-manage',
            name: 'banner-manage',
            asideVisible: false,
            meta: {
                title: 'banner管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'banner-manage',
                anchors: 'resource-postition-1'
            },
            component: () => import('@/views/resource-bit-manage/banner-manage/index.vue')
        },
        {
            path: 'commodity-category-manage',
            name: 'commodity-category-manage',
            asideVisible: false,
            meta: {
                title: '商品应用类目管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'commodity-category-manage',
                anchors: 'resource-postition-2'
            },
            component: () => import('@/views/resource-bit-manage/commodity-category-manage/index.vue')
        },
        {
            path: 'commodity-category-manage-tag',
            redirect: '/website/resource-bit/commodity-category-manage',
            meta: {
                title: '商品应用类目管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'commodity-category-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'commodity-category-manage-newly',
                    name: 'commodity-category-manage-newly',
                    meta: {
                        title: '新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'commodity-category-manage'
                    },
                    component: () => import('@/views/resource-bit-manage/commodity-category-manage/src/newly/index.vue')
                },
                {
                    path: 'commodity-category-manage-modify/:targetId?/:id?',
                    name: 'commodity-category-manage-modify',
                    props: true,
                    meta: {
                        title: '修改',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'commodity-category-manage'
                    },
                    component: () => import('@/views/resource-bit-manage/commodity-category-manage/src/modify/index.vue')
                }
            ]
        },
        {
            path: 'hot-commodity-manage',
            name: 'hot-commodity-manage',
            asideVisible: false,
            meta: {
                title: '热销商品管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'hot-commodity-manage',
                anchors: 'resource-postition-3'
            },
            component: () => import('@/views/resource-bit-manage/hot-commodity-manage/index.vue')
        },
        {
            path: 'new-commodity-manage',
            name: 'new-commodity-manage',
            asideVisible: false,
            meta: {
                title: '最新上架管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'new-commodity-manage',
                anchors: 'resource-postition-4'
            },
            component: () => import('@/views/resource-bit-manage/new-commodity-manage/index.vue')
        },
        {
            path: 'recommend-commodity-manage',
            name: 'recommend-commodity-manage',
            asideVisible: false,
            meta: {
                title: '为你推荐管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'recommend-commodity-manage',
                anchors: 'resource-postition-5'
            },
            component: () => import('@/views/resource-bit-manage/recommend-commodity-manage/index.vue')
        }
    ]
}

export default routes
