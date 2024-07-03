import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'container-product-manage',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '货柜商品管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 25
    },
    children: [
        {
            path: 'goods-distinguish',
            name: 'goods-distinguish',
            asideVisible: false,
            meta: {
                title: '商品识别结果',
                icon: markRaw(FolderOpened),
                activeMenu: 'goods-distinguish',
                anchors: 'cabinet-good-identify-result'
            },
            component: () => import('@/views/container-product-manage/goods-distinguish/index.vue'),
            children: [
                {
                    path: 'public-goods-detail',
                    name: 'public-goods-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '商品详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'public-goods'
                    },
                    component: () => import('@/views/container-product-manage/publicGoods/detail.vue')

                }
            ]
        },
        {
            path: 'public-goods',
            name: 'public-goods',
            asideVisible: false,
            meta: {
                title: '公共商品库',
                icon: markRaw(FolderOpened),
                activeMenu: 'public-goods',
                anchors: 'cabinet-good-common-stock-manage'
            },
            component: () => import('@/views/container-product-manage/publicGoods/index.vue'),
            children: [
                {
                    path: 'public-goods-detail',
                    name: 'public-goods-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '商品详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'public-goods'
                    },
                    component: () => import('@/views/container-product-manage/publicGoods/detail.vue')

                }
            ]
        },
        {
            path: 'container-sku-list',
            name: 'container-sku-list',
            asideVisible: false,
            meta: {
                title: '货柜-sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-sku-list',
                anchors: 'cabinet-good-sku-manage'
            },
            component: () => import('@/views/container-product-manage/container-sku/index.vue')
        },
        {
            path: 'container-sku-list-tag',
            redirect: '/website/container-product-manage/container-sku-list',
            meta: {
                title: '货柜-sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-sku-list',
                anchors: 'cabinet-good-sku-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'container-add-sku/:skuId?/:merchantCode?',
                    name: 'container-add-sku',
                    props: true,
                    meta: {
                        title: '货柜-sku新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-sku-list'
                    },
                    component: () => import('@/views/container-product-manage/container-sku/add-sku.vue')
                },
                {
                    path: 'container-apply-sku',
                    name: 'container-apply-sku',
                    props: true,
                    meta: {
                        title: '货柜sku审核',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-sku-list'
                    },
                    component: () => import('@/views/container-product-manage/container-sku/apply-sku.vue')
                }
            ]
        },
        {
            path: 'data-migration',
            name: 'data-migration',
            asideVisible: false,
            meta: {
                title: '商品数据迁移管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'data-migration',
                anchors: 'cabinet-good-migrate-manager'
            },
            component: () => import('@/views/container-product-manage/container-goods/data-migration.vue')
        },
        {
            path: 'container-commodity-management',
            name: 'container-commodity-management',
            asideVisible: false,
            meta: {
                title: '货柜聚合商品列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-commodity-management',
                anchors: 'cabinet-good-aggre-goods-list'

            },
            component: () => import('@/views/container-commodity-management/list.vue')
        },
        {
            path: 'container-similarity',
            name: 'container-similarity',
            asideVisible: false,
            meta: {
                title: '货柜相似品管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-similarity',
                anchors: 'cabinet-good-alike-good'
            },
            component: () => import('@/views/container-product-manage/container-similarity/index.vue')
        },
        {
            path: 'container-similarity-tag',
            redirect: '/website/container-product-manage/container-similarity',
            meta: {
                title: '货柜相似品管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-similarity'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-similarity/:type?/:ruleCode?',
                    name: 'add-similarity',
                    props: true,
                    meta: {
                        title: '创建货柜相似品组合',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-similarity'
                    },
                    component: () => import('@/views/container-product-manage/container-similarity/add-similarity.vue')
                }
            ]
        }
    ]
}

export default routes
