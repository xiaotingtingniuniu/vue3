import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'basic-category-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '商品属性类目管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 8
    },
    children: [
        {
            path: 'basic-category',
            name: 'basic-category',
            asideVisible: false,
            meta: {
                title: '属性模型信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'basic-category',
                anchors: 'good-property-1'
            },
            component: () => import('@/views/basic-category/basic-category.vue')
        },
        {
            path: 'basic-category-information-list',
            name: 'basic-category-information-list',
            asideVisible: false,
            meta: {
                title: '基础类目信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'basic-category-information-list',
                anchors: 'good-property-2'
            },
            component: () => import('@/views/basic-category-information/basic-category-information-list.vue')
        },
        {
            path: 'application-administration-list',
            name: 'application-administration-list',
            asideVisible: false,
            meta: {
                title: '应用类目信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'application-administration-list',
                anchors: 'good-property-3'
            },
            component: () => import('@/views/application-administration/application-administration-list.vue')
        },
        {
            path: 'spu-model-training-list',
            name: 'spu-model-training-list',
            asideVisible: false,
            meta: {
                title: 'SPU模型训练表',
                icon: markRaw(FolderOpened),
                activeMenu: 'spu-model-training-list',
                anchors: 'good-property-spu-model-train'
            },
            component: () => import('@/views/spu-management/spu-model-training-list.vue')
        },
        {
            path: 'spu-management-list',
            name: 'spu-management-list',
            asideVisible: false,
            meta: {
                title: 'SPU信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'spu-management-list',
                anchors: 'good-property-4'
            },
            component: () => import('@/views/spu-management/spu-management-list.vue')
        },
        {
            path: 'spu-management-list-tag',
            redirect: '/website/basic-category-management/spu-management-list',
            meta: {
                title: 'SPU信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'spu-management-list',
                anchors: 'good-property-4'
            },
            component: RouterView,
            children: [
                {
                    path: 'spu-management-editor/:type/:spuTemplate/:spuId?',
                    name: 'spu-management-editor',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: 'SPU管理编辑',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'spu-management-list'
                    },
                    component: () => import('@/views/spu-management/spu-management-editor.vue')
                },
                {
                    path: 'apply-detail/:goodsId/:type?',
                    name: 'apply-detail',
                    asideVisible: true,
                    props: true,
                    meta: {
                        title: 'SPU详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'add-new-product'
                    },
                    component: () => import('@/views/spu-management/apply-detail.vue')
                },
                {
                    path: 'model-detail/:goodsId/:type?',
                    name: 'model-detail',
                    asideVisible: true,
                    props: true,
                    meta: {
                        title: 'SPU详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'add-new-product'
                    },
                    component: () => import('@/views/spu-management/model-detail.vue')
                },
                {
                    path: 'apply-detail-pdf',
                    name: 'apply-detail-pdf',
                    props: true,
                    meta: {
                        title: '恒生活货柜商品建模规范',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'add-new-product'
                    },
                    component: () => import('@/views/spu-management/pdf.vue')
                }
            ]
        },
        // {
        //     path: 'commodity-type-table',
        //     name: 'commodity-type-table',
        //     asideVisible: false,
        //     meta: {
        //         title: '商品类型税率表',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'commodity-type-table',
        //         anchors: 'good-property-5'
        //     },
        //     component: () => import('@/views/commodity-type/commodity-type-table.vue')
        // },
        {
            path: 'brand-information-list',
            name: 'brand-information-list',
            asideVisible: false,
            meta: {
                title: '品牌信息列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'brand-information-list',
                anchors: 'good-property-6'
            },
            component: () => import('@/views/commodity-management/brand-information-list.vue')
        },
        {
            path: 'product-level-rules',
            name: 'product-level-rules',
            asideVisible: false,
            meta: {
                title: '标品等级规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-level-rules',
                anchors: 'good-property-spu-level-rule'

            },
            component: () => import('@/views/product-level-management/rules-management.vue')
        },
        {
            name: 'product-level-rules-tag',
            path: 'product-level-rules-tag',
            redirect: '/website/basic-category-management/product-level-rules',
            meta: {
                title: '标品等级规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-level-rules',
                anchors: 'good-property-spu-level-rule'
            },
            component: RouterView,

            children: [
                {
                    path: 'edit-rules/:id?/:address?',
                    name: 'edit-rules',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '标品等级规则编辑',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'product-level-rules'
                    },
                    component: () => import('@/views/product-level-management/edit-rules.vue')

                }

            ]
        },
        {
            path: 'container-product',
            name: 'container-product',
            asideVisible: false,
            meta: {
                title: '货柜标品库',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-product',
                anchors: 'good-property-cabinet-spu'
            },
            component: () => import('@/views/container-product-library/index.vue')
        },
        {
            path: 'container-product-tag',
            redirect: '/website/basic-category-management/container-product',
            meta: {
                title: '货柜标品库',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-product',
                anchors: 'good-property-cabinet-spu'
            },
            component: RouterView,
            children: [
                {
                    path: 'container-product-detail/:spuId?',
                    name: 'container-product-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '货柜标品详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-product-detail'
                    },
                    component: () => import('@/views/container-product-library/detail.vue')
                }
            ]
        },
        {
            path: 'product-converge-rules',
            name: 'product-converge-rules',
            asideVisible: false,
            meta: {
                title: '商品聚合规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-converge-rules',
                anchors: 'good-property-aggre-rule-manage'
            },
            component: () => import('@/views/product-converge-management/list.vue')
        },
        {
            name: 'product-converge-rules-tag',
            path: 'product-converge-rules-tag',
            redirect: '/website/basic-category-management/product-converge-management',
            meta: {
                title: '商品聚合规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-converge-rules'
            },
            component: RouterView,

            children: [
                {
                    path: 'product-converge-rules-add',
                    name: 'product-converge-rules-add',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '商品聚合规则管理新建',
                        icon: markRaw(FolderOpened)
                    },
                    component: () => import('@/views/product-converge-management/add.vue')

                }

                // {
                //     path: 'add/:id?/:address?',
                //     name: 'add',
                //     asideVisible: false,
                //     props: true,
                //     meta: {
                //         title: '商品聚合规则管理新建',
                //         icon: markRaw(FolderOpened)
                //     },
                //     component: () => import('@/views/product-converge-management/add.vue')

                // }

            ]
        },
        {
            path: 'spu-rebinding-list',
            name: 'spu-rebinding-list',
            asideVisible: false,
            meta: {
                title: 'SPU换绑管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'spu-rebinding-list',
                anchors: 'good-property-spu-change-bind'
            },
            component: () => import('@/views/spu-management/spu-rebinding-list.vue')
        },
        {
            path: 'goods-rebinding-list',
            name: 'goods-rebinding-list',
            asideVisible: false,
            meta: {
                title: 'Goods换绑管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'goods-rebinding-list',
                anchors: 'good-property-good-change-bind'
            },
            component: () => import('@/views/spu-management/goods-rebinding-list.vue')
        },
        {
            path: 'sku-rebinding-list',
            name: 'sku-rebinding-list',
            asideVisible: false,
            meta: {
                title: 'Sku换绑管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'sku-rebinding-list',
                anchors: 'good-property-sku-change-bind'
            },
            component: () => import('@/views/spu-management/sku-rebinding-list.vue')
        },
        {
            path: 'goods-tax-list',
            name: 'goods-tax-list',
            asideVisible: false,
            meta: {
                title: '商品类型税率表',
                icon: markRaw(FolderOpened),
                activeMenu: 'goods-tax-list',
                anchors: 'good-property-tax-rate'
            },
            component: () => import('@/views/spu-management/goods-tax-list/index.vue')
        }
    ]
}

export default routes
