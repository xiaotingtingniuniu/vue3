import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'goods',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '商品管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 7
    },
    children: [
        {
            path: 'goods-list',
            name: 'goods-list',
            asideVisible: false,
            meta: {
                title: '到家-Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'goods-list',
                anchors: 'goods-1'
            },
            component: () => import('@/views/goods/goods-management/index.vue')
        },
        {
            path: 'goods-list-tag',
            redirect: '/website/goods/goods-list',
            meta: {
                title: '到家-Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'goods-list',
                anchors: 'goods-1'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-goods/:merchantCode?/:goodsId',
                    name: 'add-goods',
                    props: true,
                    meta: {
                        title: '商品信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'goods-list'
                    },
                    component: () => import('@/views/goods/goods-management/add-goods.vue')
                }
            ]
        },
        {
            path: 'container-goods-list',
            name: 'container-goods-list',
            asideVisible: false,
            meta: {
                title: '货柜-Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-goods-list',
                anchors: 'goods-cabinet-manage'
            },
            component: () => import('@/views/goods/container-goods/index.vue')
        },
        {
            path: 'container-goods-list-tag',
            redirect: '/website/goods/container-goods-list',
            meta: {
                title: '货柜-Goods库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-goods-list',
                anchors: 'goods-cabinet-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'container-add-goods/:merchantCode?/:goodsId',
                    name: 'container-add-goods',
                    props: true,
                    meta: {
                        title: '商品信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-goods-list'
                    },
                    component: () => import('@/views/goods/container-goods/container-add-goods.vue')
                }
            ]
        },
        {
            path: 'sku-list',
            name: 'sku-list',
            asideVisible: false,
            meta: {
                title: '到家-sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'sku-list',
                anchors: 'goods-2'
            },
            component: () => import('@/views/goods/sku/index.vue')
        },
        {
            path: 'sku-list-tag',
            redirect: '/website/goods/sku-list',
            meta: {
                title: 'sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'sku-list',
                anchors: 'goods-2'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-sku/:skuId?/:merchantCode?',
                    name: 'add-sku',
                    props: true,
                    meta: {
                        title: 'sku新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'sku-list'
                    },
                    component: () => import('@/views/goods/sku/add-sku.vue')
                },
                {
                    path: 'apply-sku',
                    name: 'apply-sku',
                    props: true,
                    meta: {
                        title: 'sku审核',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'sku-list'
                    },
                    component: () => import('@/views/goods/sku/apply-sku.vue')
                }
            ]
        },
        // {
        //     path: 'container-sku-list',
        //     name: 'container-sku-list',
        //     asideVisible: false,
        //     meta: {
        //         title: '货柜-sku管理',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'container-sku-list',
        //         anchors: 'goods-cabinet-sku-manage'
        //     },
        //     component: () => import('@/views/goods/container-sku/index.vue')
        // },
        // {
        //     path: 'container-sku-list-tag',
        //     redirect: '/website/goods/container-sku-list',
        //     meta: {
        //         title: '货柜-sku管理',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'container-sku-list',
        //         anchors: 'goods-cabinet-sku-manage'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'container-add-sku/:skuId?/:merchantCode?',
        //             name: 'container-add-sku',
        //             props: true,
        //             meta: {
        //                 title: '货柜-sku新增',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'container-sku-list'
        //             },
        //             component: () => import('@/views/goods/container-sku/add-sku.vue')
        //         },
        //         {
        //             path: 'container-apply-sku',
        //             name: 'container-apply-sku',
        //             props: true,
        //             meta: {
        //                 title: '货柜sku审核',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'container-sku-list'
        //             },
        //             component: () => import('@/views/goods/container-sku/apply-sku.vue')
        //         }
        //     ]
        // },
        {
            path: 'price-detail',
            name: 'price-detail',
            asideVisible: false,
            meta: {
                title: '价格管理', // -支持智能货柜
                icon: markRaw(FolderOpened),
                activeMenu: 'price-detail',
                anchors: 'goods-3'
            },
            component: () => import('@/views/price-management/price-detail.vue')
        },
        {
            path: 'price-detail-tag',
            redirect: '/website/goods/price-detail',
            meta: {
                title: '价格管理', // -支持智能货柜
                icon: markRaw(FolderOpened),
                activeMenu: 'price-detail'
            },
            component: RouterView,
            children: [
                {
                    path: 'price-adjustment-list/:merchantName/:busiMerchantId/:merchantType/:firstChannelName?/:firstChannelId?',
                    name: 'price-adjustment-list',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '原价管理',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'price-detail'
                    },
                    component: () => import('@/views/price-management/price-adjustment.vue')

                },
                {
                    path: 'purchase-price-list/:merchantName/:busiMerchantId/:merchantType/:firstChannelName?/:firstChannelId?/:secondChannelId?',
                    name: 'purchase-price-list',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '采购价管理',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'price-detail'
                    },
                    component: () => import('@/views/price-management/purchase-price.vue')

                }
            ]
        }
        // {
        //     path: 'public-goods',
        //     name: 'public-goods',
        //     asideVisible: false,
        //     meta: {
        //         title: '公共商品库',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'public-goods',
        //         anchors: 'common-goods-stock-manage'
        //     },
        //     component: () => import('@/views/goods/publicGoods/index.vue'),
        //     children: [
        //         {
        //             path: 'public-goods-detail',
        //             name: 'public-goods-detail',
        //             asideVisible: false,
        //             props: true,
        //             meta: {
        //                 title: '商品详情',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'public-goods'
        //             },
        //             component: () => import('@/views/goods/publicGoods/detail.vue')

        //         }
        //     ]
        // }
    ]
}

export default routes
