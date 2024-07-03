import { RouterView } from 'vue-router'
import { markRaw } from 'vue'

import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'goods-examine-mannage',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '商品审核管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 20
    },
    children: [
        {
            path: 'product-examine-mannage',
            name: 'product-examine-mannage',
            asideVisible: false,
            meta: {
                title: '新增标品审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-examine-mannage',
                anchors: 'good-auduit-spu-add'
            },
            component: () => import('@/views/goods-examine-manage/product-examine-manage/index.vue')
        },
        {
            path: 'product-examine-mannage-tag',
            redirect: '/website/goods-examine-mannage/product-examine-mannage',
            meta: {
                title: '新增标品审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-examine-mannage'
            },
            component: RouterView,
            children: [
                {
                    path: 'product-examine-mannage-detail/:approvalCode/:examine?',
                    name: 'product-examine-mannage-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '标品审核详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'product-examine-mannage'
                    },
                    component: () => import('@/views/goods-examine-manage/product-examine-manage/detail.vue')
                },
                {
                    path: 'product-examine-mannage-detail-container/:approvalCode/:examine?',
                    name: 'product-examine-mannage-detail-container',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '标品审核详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'product-examine-mannage'
                    },
                    component: () => import('@/views/goods-examine-manage/product-examine-manage/detail-container.vue')
                }
            ]
        },
        {
            path: 'container-goods-examine-mannage',
            name: 'container-goods-examine-mannage',
            asideVisible: false,
            meta: {
                title: '货柜商品审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-goods-examine-mannage',
                anchors: 'good-auduit-cabinet'
            },
            component: () => import('@/views/goods-examine-manage/container-goods-examine-manage/index.vue')
        },
        {
            path: 'mall-goods-examine-manage',
            name: 'mall-goods-examine-manage',
            asideVisible: false,
            meta: {
                title: '进货商城商品上架审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'mall-goods-examine-manage',
                anchors: 'good-auduit-purchase-mall'
            },
            component: () => import('@/views/goods-examine-manage/mall-goods-examine-manage/index.vue')
        },
        {
            path: 'mall-goods-examine-manage-tag',
            redirect: '/website/goods-examine-mannage/mall-goods-examine-manage',
            meta: {
                title: '进货商城商品上架审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'mall-goods-examine-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'mall-goods-examine-manage-detail/:approvalCode/:examine?',
                    name: 'mall-goods-examine-manage-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '进货商城商品上架审核管理详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'mall-goods-examine-manage'
                    },
                    component: () => import('@/views/goods-examine-manage/mall-goods-examine-manage/detail.vue')
                }
            ]
        },
        {
            path: 'equip-goods-examine-manage',
            name: 'equip-goods-examine-manage',
            asideVisible: false,
            meta: {
                title: '设备供应链商品上架审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'equip-goods-examine-manage',
                anchors: 'good-auduit-supply-chain-audit'
            },
            component: () => import('@/views/goods-examine-manage/equip-goods-examine-manage/index.vue')
        },
        {
            path: 'equip-goods-examine-manage',
            redirect: '/website/goods-examine-mannage/equip-goods-examine-manage',
            meta: {
                title: '设备供应链商品上架审核管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'equip-goods-examine-manage'
            },
            component: RouterView,
            children: [
                {
                    path: 'equip-goods-examine-manage-detail/:approvalCode/:examine?',
                    name: 'equip-goods-examine-manage-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '设备供应链商品上架审核管理详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'equip-goods-examine-manage'
                    },
                    component: () => import('@/views/goods-examine-manage/equip-goods-examine-manage/detail.vue')
                }
            ]
        },
        {
            path: 'local-life-examine-mannage',
            name: 'local-life-examine-mannage',
            asideVisible: false,
            meta: {
                title: '本地生活商品审核',
                icon: markRaw(FolderOpened),
                activeMenu: 'local-life-examine-mannage',
                anchors: 'good-auduit-local-life'
            },
            component: () => import('@/views/goods-examine-manage/local-life-examine-mannage/index.vue')
        },
        {
            path: 'local-life-examine-mannage-tag',
            redirect: '/website/goods-examine-mannage/local-life-examine-mannage',
            meta: {
                title: '本地生活商品审核',
                icon: markRaw(FolderOpened),
                activeMenu: 'local-life-examine-mannage'
            },
            component: RouterView,
            children: [
                {
                    path: 'local-life-examine-mannage-detail/:id?/:address?',
                    name: 'local-life-examine-mannage-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '新增标品审核列表',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'local-life-examine-mannage'
                    },
                    component: () => import('@/views/goods-examine-manage/local-life-examine-mannage/detail.vue')
                }
            ]
        }
    ]
}

export default routes
