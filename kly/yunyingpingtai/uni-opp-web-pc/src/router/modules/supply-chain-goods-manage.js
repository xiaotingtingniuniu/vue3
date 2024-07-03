import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'supply-chain-goods-manage',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '供应链商品管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 33
    },
    children: [
        {
            path: 'supply-chain-goods-list',
            name: 'supply-chain-goods-list',
            asideVisible: false,
            meta: {
                title: '供应链Sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'supply-chain-goods-list',
                anchors: 'supply-chain-good-sku'
            },
            component: () => import('@/views/supply-chain-goods-manage/sku-manage/index.vue')
        },
        {
            path: 'supply-chain-goods-list-tag',
            redirect: '/website/supply-chain-goods-manage/supply-chain-goods-list',
            meta: {
                title: '供应链Sku管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'supply-chain-goods-list',
                anchors: 'supply-chain-good-sku'
            },
            component: RouterView,
            children: [
                {
                    path: 'supply-chain-goods-detail/:skuId',
                    name: 'supply-chain-goods-detail',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '供应链Sku管理详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'supply-chain-goods-list'
                    },
                    component: () => import('@/views/supply-chain-goods-manage/sku-manage/detail.vue')
                }
            ]
        }
    ]
}

export default routes
