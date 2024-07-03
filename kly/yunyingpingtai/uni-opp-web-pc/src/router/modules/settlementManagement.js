import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'settlementManagement',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '结算管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 16
    },
    children: [
        {
            path: 'brokerage-detail-list',
            name: 'brokerage-detail-list',
            asideVisible: false,
            meta: {
                title: '分佣明细查询',
                icon: markRaw(FolderOpened),
                activeMenu: 'brokerage-detail-list',
                anchors: 'settle-detail'
            },
            component: () => import('@/views/settlementManagement/brokerage-detail-list.vue')
        },
        {
            path: '/ledgerParty',
            name: 'ledgerParty',
            asideVisible: false,
            meta: {
                title: '分账方管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'ledgerParty',
                anchors: 'settle-detail-account-mana'
            },
            component: () => import('@/views/settlementManagement/ledgerParty/index.vue')
        },
        {
            path: '/cabinetOwner',
            name: 'cabinetOwner',
            asideVisible: false,
            meta: {
                title: '柜主分账配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'cabinetOwner',
                anchors: 'settle-detail-cabinet-owner'
            },
            component: () => import('@/views/settlementManagement/cabinetOwner/index.vue')
        },
        {
            path: '/settlementOrder',
            name: 'settlementOrder',
            asideVisible: false,
            meta: {
                title: '货柜业务结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'settlementOrder',
                anchors: 'settle-detail-order'
            },
            component: () => import('@/views/settlementManagement/settlementOrder/index.vue')
        },
        {
            path: '/selfcontainer',
            name: 'selfcontainer',
            asideVisible: false,
            meta: {
                title: '自营货柜结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'selfcontainer',
                anchors: 'settle-self-cabinet-settle-order'
            },
            component: () => import('@/views/settlementManagement/selfContainer/index.vue')
        },
        {
            path: '/selfstore',
            name: 'selfstore',
            asideVisible: false,
            meta: {
                title: '自营门店结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'selfstore',
                anchors: 'settle-self-store-settle-order'
            },
            component: () => import('@/views/settlementManagement/selfStore/index.vue')
        },
        {
            path: '/ledgersetting',
            name: 'ledgersetting',
            asideVisible: false,
            meta: {
                title: '分账配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'ledgersetting',
                anchors: 'settle-self-account-manage'
            },
            component: () => import('@/views/settlementManagement/ledgerSetting/index.vue')
        },
        {
            path: '/ledgerdetail',
            name: 'ledgerdetail',
            asideVisible: false,
            meta: {
                title: '分账详情',
                icon: markRaw(FolderOpened),
                activeMenu: 'ledgerdetail',
                anchors: 'settle-self-account-detail'
            },
            component: () => import('@/views/settlementManagement/ledgerDetail/index.vue')
        },
        {
            path: '/finance-bill',
            name: 'finance-bill',
            asideVisible: false,
            meta: {
                title: '批发商城结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'ledgerdetail',
                anchors: 'settle-self-batch-mall-finance'
            },
            component: () => import('@/views/settlementManagement/finance-bill/index.vue')
        },
        {
            path: '/local-merchant',
            name: 'local-merchant',
            asideVisible: false,
            meta: {
                title: '本地商家结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'loacal-merchant',
                anchors: 'settle-self-local-merchant-order'
            },
            component: () => import('@/views/settlementManagement/local-merchant/index.vue')
        },
        {
            path: '/points-settlement',
            name: 'points-settlement',
            asideVisible: false,
            meta: {
                title: '积分结算账单',
                icon: markRaw(FolderOpened),
                activeMenu: 'points-settlement'
                // anchors: 'settle-detail-order'
            },
            component: () => import('@/views/settlementManagement/points-settlement/index.vue')
        }
    ]
}

export default routes
