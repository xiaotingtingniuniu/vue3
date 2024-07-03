import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'commodityrange',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '商家售卖范围管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 6
    },
    children: [
        {
            path: 'commodity-range',
            name: 'commodity-range',
            asideVisible: false,
            meta: {
                title: '商家售卖范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'commodity-range',
                anchors: 'merchant-sale-1'
            },
            component: () => import('@/views/commodityrange/commodity-range.vue')
        },
        {
            path: 'commodity-range-tag',
            redirect: '/website/commodityrange/ommodity-range',
            meta: {
                title: '商家售卖范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'commodity-range'
            },
            component: RouterView,
            children: [
                {
                    path: 'sope-list/:id/:handleType/:merchantStatus?',
                    name: 'sope-list',
                    props: true,
                    meta: {
                        title: '商家售卖范围管理',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'commodity-range'
                    },
                    component: () => import('@/views/commodityrange/model/application-scope.vue')
                }
            ]
        },
        {
            path: 'commodity-admin',
            name: 'commodity-admin',
            asideVisible: false,
            meta: {
                title: '商品渠道库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'commodity-admin',
                anchors: 'merchant-sale-2'
            },
            component: () => import('@/views/commodityrange/commodity-admin.vue')
        },
        {
            path: 'merchant-admin',
            name: 'merchant-admin',
            asideVisible: false,
            meta: {
                title: '商户品牌范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-admin',
                anchors: 'merchant-sale-3'
            },
            component: () => import('@/views/commodityrange/merchant-admin.vue')
        },
        {
            path: 'merchant-category',
            name: 'merchant-category',
            asideVisible: false,
            meta: {
                title: '商户类目范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-category',
                anchors: 'merchant-sale-4'
            },
            component: () => import('@/views/commodityrange/merchant-category.vue')
        },
        {
            path: 'merchant-channel',
            name: 'merchant-channel',
            asideVisible: false,
            meta: {
                title: '商户渠道范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-channel',
                anchors: 'merchant-sale-5'
            },
            component: () => import('@/views/commodityrange/merchant-channel.vue')
        }
    ]
}

export default routes
