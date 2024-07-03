import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'finance-core',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '财务中心',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 28
    },
    children: [
        {
            path: 'wholesaler-examine',
            name: 'wholesaler-examine',
            asideVisible: false,
            meta: {
                title: '批发商审核提现',
                icon: markRaw(FolderOpened),
                activeMenu: 'account-select',
                anchors: 'finance-center-mall-audit'
            },
            component: () => import('@/views/finance-core/wholesaler-examine/index.vue')
        },
        {
            path: 'capital',
            name: 'capital',
            asideVisible: false,
            meta: {
                title: '账户中心',
                icon: markRaw(FolderOpened),
                activeMenu: 'account-select',
                anchors: 'finance-center-account-center'
            },
            component: () => import('@/views/finance-core/capital/index.vue')
        },
        {
            path: 'capital-tag',
            redirect: '/website/finance-core/capital',
            meta: {
                title: '账户中心',
                icon: markRaw(FolderOpened),
                activeMenu: 'container-sku-list',
                anchors: 'finance-center-account-center'
            },
            component: RouterView,
            children: [
                {
                    path: 'capital-detail/:id',
                    name: 'capital-detail',
                    props: true,
                    meta: {
                        title: '动账明细',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'capital-detail'
                    },
                    component: () => import('@/views/finance-core/capital/model/capital-detail.vue')
                },
                {
                    path: 'capital-record/:id',
                    name: 'capital-record',
                    props: true,
                    meta: {
                        title: '提现记录',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'capital-record'
                    },
                    component: () => import('@/views/finance-core/capital/model/capital-record.vue')
                },
                {
                    path: 'capital-card/:id',
                    name: 'capital-card',
                    props: true,
                    meta: {
                        title: '账户绑卡',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'capital-card'
                    },
                    component: () => import('@/views/finance-core/capital/model/capital-card.vue')
                }
            ]
        },
        {
            path: 'channel',
            name: 'channel',
            asideVisible: false,
            meta: {
                title: '通道结算',
                icon: markRaw(FolderOpened),
                activeMenu: 'account-select',
                anchors: 'finance-center-settle-channel'
            },
            component: () => import('@/views/finance-core/channel/index.vue')
        }
    ]
}

export default routes
