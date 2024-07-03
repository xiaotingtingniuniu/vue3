import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'wholesaleMall',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '批发商城管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 12
    },
    children: [
        {
            path: 'wholesaleMall-Goods-list',
            name: 'wholesaleMall-Goods-list',
            asideVisible: false,
            meta: {
                title: 'Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'wholesaleMall-Goods-list',
                anchors: 'batch-mall-goods'
            },
            component: () => import('@/views/wholesaleMall/wholesaleMall-goods-management/index.vue')
        },
        {
            path: 'wholesaleMall-Goods-list-tag',
            redirect: '/website/wholesaleMall/wholesaleMall-Goods-list',
            meta: {
                title: 'Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'wholesaleMall-Goods-list',
                anchors: 'batch-mall-goods'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-wholesaleMall-goods/:merchantCode?/:goodsId/:type',
                    name: 'add-wholesaleMall-goods',
                    props: true,
                    meta: {
                        title: '商品信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'wholesaleMall-Goods-list'
                    },
                    component: () => import('@/views/wholesaleMall/wholesaleMall-goods-management/add-wholesaleMall-goods.vue')
                }
            ]
        },
        {
            path: 'wholesaleMall-sku-list',
            name: 'wholesaleMall-sku-list',
            asideVisible: false,
            meta: {
                title: 'sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'wholesaleMall-sku-list',
                anchors: 'batch-mall-skus'
            },
            component: () => import('@/views/wholesaleMall/wholesaleMall-sku/index.vue')
        },
        {
            path: 'wholesaleMall-sku-list-tag',
            redirect: '/website/wholesaleMall/wholesaleMall-sku-list',
            meta: {
                title: 'sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'wholesaleMall-sku-list',
                anchors: 'batch-mall-skus'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-wholesaleMall-sku/:skuId?/:merchantCode?',
                    name: 'add-wholesaleMall-sku',
                    props: true,
                    meta: {
                        title: 'sku新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'wholesaleMall-sku-list'
                    },
                    component: () => import('@/views/wholesaleMall/wholesaleMall-sku/add-wholesaleMall-sku.vue')
                },
                {
                    path: 'apply-sku',
                    name: 'apply-sku',
                    props: true,
                    meta: {
                        title: 'sku审核',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'wholesaleMall-sku-list'
                    },
                    component: () => import('@/views/wholesaleMall/wholesaleMall-sku/apply-sku.vue')
                }
            ]
        }
    ]
}

export default routes
