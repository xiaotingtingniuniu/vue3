import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'purchase',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '采销系统管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 305
    },
    children: [
        {
            path: 'storehouse-owner-list',
            name: 'storehouse-owner-list',
            asideVisible: false,
            meta: {
                title: '库房主数据管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'storehouse-owner-list',
                anchors: 'purchase-manage-warehouse'
            },
            component: () => import('@/views/purchase/storehouse-owner/index.vue')
        },
        {
            path: 'bin-coverage-list',
            name: 'bin-coverage-list',
            asideVisible: false,
            meta: {
                title: '仓覆盖范围管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'bin-coverage-list',
                anchors: 'purchase-manage-store-cover'
            },
            component: () => import('@/views/purchase/bin-coverage/index.vue')
        },
        {
            path: 'purchase-order-goods-list',
            name: 'purchase-order-goods-list',
            asideVisible: false,
            meta: {
                title: '采购单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-order-goods-list',
                anchors: 'purchase-manage-purchase-invoice'
            },
            component: () => import('@/views/purchase/purchase-order-goods/index.vue')
        },
        {
            path: 'purchase-order-goods-list-tag',
            redirect: '/website/purchase/purchase-order-goods-list',
            meta: {
                title: '采购单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-order-goods-list',
                anchors: 'purchase-manage-purchase-invoice'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-purchase-order-goods/:type/:purchaseNo?',
                    name: 'add-purchase-order-goods',
                    props: true,
                    meta: {
                        title: '采购单新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'purchase-order-goods-list'
                    },
                    component: () => import('@/views/purchase/purchase-order-goods/add-goods.vue')
                }
            ]
        },
        {
            path: 'purchase-stock-list',
            name: 'purchase-stock-list',
            asideVisible: false,
            meta: {
                title: '采购单入库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-stock-list',
                anchors: 'purchase-manage-purchase-invoice-storage'
            },
            component: () => import('@/views/purchase/purchase-stock/index.vue')
        },
        {
            path: 'purchase-stock-list-tag',
            redirect: '/website/purchase/purchase-stock-list',
            meta: {
                title: '采购单入库管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'purchase-stock-list',
                anchors: 'purchase-manage-purchase-invoice-storage'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-purchase-stock/:type/:warehousingNo?',
                    name: 'add-purchase-stock',
                    props: true,
                    meta: {
                        title: '采购单入库新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'purchase-stock-list'
                    },
                    component: () => import('@/views/purchase/purchase-stock/add-purchase-stock.vue')
                }
            ]
        },
        // {
        //     path: 'fictitious-stock',
        //     name: 'fictitious-stock',
        //     asideVisible: false,
        //     meta: {
        //         title: '供应链库存（虚拟商品）',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'fictitious-stock'
        //     },
        //     component: () => import('@/views/purchase/fictitious-stock/index.vue')
        // },
        {
            path: 'equipment-stock',
            name: 'equipment-stock',
            asideVisible: false,
            meta: {
                title: '供应链库存',
                icon: markRaw(FolderOpened),
                activeMenu: 'equipment-stock',
                anchors: 'purchase-manage-supply-stock'
            },
            component: () => import('@/views/purchase/equipment-stock/index.vue')
        },
        {
            path: 'channel-stock',
            name: 'channel-stock',
            asideVisible: false,
            meta: {
                title: '渠道库存',
                icon: markRaw(FolderOpened),
                activeMenu: 'channel-stock',
                anchors: 'purchase-manage-channel-stock'
            },
            component: () => import('@/views/purchase/channel-stock/index.vue')
        },
        {
            path: 'payment-application-list',
            name: 'payment-application-list',
            asideVisible: false,
            meta: {
                title: '付款申请明细列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'payment-application-list',
                anchors: 'purchase-manage-payment-request-list'
            },
            component: () => import('@/views/purchase/cash-transaction/payment-application-list.vue')
        },
        {
            path: 'payment-application-list-tag',
            redirect: '/website/purchase/payment-application-list',
            meta: {
                title: '付款申请明细列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'payment-application-list',
                anchors: 'purchase-manage-payment-request-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'payment-application-detail/:billNo?/:type?',
                    name: 'payment-application-detail',
                    props: true,
                    meta: {
                        title: '付款申请单',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'payment-application-list'
                    },
                    component: () => import('@/views/purchase/cash-transaction/payment-application-detail.vue')
                }
            ]
        },
        {
            path: 'payment-doc-list',
            name: 'payment-doc-list',
            asideVisible: false,
            meta: {
                title: '付款单结算明细列表',
                icon: markRaw(FolderOpened),
                // anchors: 'promo_code-team-audit',
                anchors: 'purchase-manage-payment-settle-list'
            },
            component: () => import('@/views/purchase/cash-transaction/payment-doc-list.vue')
        },
        {
            path: 'payment-doc-list-tag',
            redirect: '/website/purchase/payment-doc-list',
            meta: {
                title: '付款单结算明细列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'payment-doc-list',
                anchors: 'promo_code-team-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'payment-doc-detail/:billNo?',
                    name: 'payment-doc-detail',
                    props: true,
                    meta: {
                        title: '付款单',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'payment-doc-list'
                    },
                    component: () => import('@/views/purchase/cash-transaction/payment-doc-detail.vue')
                },
                {
                    path: 'certificate/:billNo?',
                    name: 'certificate',
                    props: true,
                    meta: {
                        title: '凭证情况',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'certificate'
                    },
                    component: () => import('@/views/purchase/cash-transaction/certificate.vue')
                }
            ]
        },
        {
            path: 'purchase-invoice-list',
            name: 'purchase-invoice-list',
            asideVisible: false,
            meta: {
                title: '采购发票列表',
                icon: markRaw(FolderOpened),
                // anchors: 'promo_code-team-audit'
                anchors: 'purchase-manage-purchase-bill-list'
            },
            component: () => import('@/views/purchase/cash-transaction/purchase-invoice-list.vue')
        },
        {
            path: 'purchase-invoice-detail/:taxNo?',
            name: 'purchase-invoice-detail',
            props: true,
            asideVisible: false,
            meta: {
                title: '采购发票',
                icon: markRaw(FolderOpened),
                // anchors: 'promo_code-team-audit'
                anchors: 'purchase-manage-purchase-bill-list'
            },
            component: () => import('@/views/purchase/cash-transaction/purchase-invoice-detail.vue')
        }
        // {
        //     path: 'purchase-invoice-list-tag',
        //     redirect: '/website/purchase/purchase-invoice-list',
        //     meta: {
        //         title: '采购发票列表',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'purchase-invoice-list',
        //         anchors: 'promo_code-team-list'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'purchase-invoice-detail/:taxNo?',
        //             name: 'purchase-invoice-detail',
        //             props: true,
        //             meta: {
        //                 title: '采购发票',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'purchase-invoice-detail'
        //             },
        //             component: () => import('@/views/purchase/cash-transaction/purchase-invoice-detail.vue')
        //         }
        //     ]
        // }
        // {
        //     path: 'cash-transaction',
        //     name: 'cash-transaction',
        //     asideVisible: true,
        //     component: RouterView,
        //     meta: {
        //         title: '往来现金',
        //         icon: markRaw(Box),
        //         cannotClick: true,
        //         anchors: 'promo_code-team'

        //     },
        //     children: [
        //         {
        //             path: 'payment-application-list',
        //             name: 'payment-application-list',
        //             asideVisible: false,
        //             meta: {
        //                 title: '付款申请明细列表',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'payment-application-list',
        //                 anchors: 'promo_code-team-list'
        //             },
        //             component: () => import('@/views/purchase/cash-transaction/payment-application-list.vue')
        //         },
        //         {
        //             path: 'payment-application-list-tag',
        //             redirect: '/website/purchase/payment-application-list',
        //             meta: {
        //                 title: '付款申请明细列表',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'payment-application-list',
        //                 anchors: 'promo_code-team-list'
        //             },
        //             component: RouterView,
        //             children: [
        //                 {
        //                     path: 'payment-application-detail',
        //                     name: 'payment-application-detail',
        //                     props: true,
        //                     meta: {
        //                         title: '付款申请单',
        //                         icon: markRaw(FolderOpened),
        //                         activeMenu: 'payment-application-list'
        //                     },
        //                     component: () => import('@/views/purchase/cash-transaction/payment-application-detail.vue')
        //                 }
        //             ]
        //         },
        //         {
        //             path: 'payment-doc-list',
        //             name: 'payment-doc-list',
        //             meta: {
        //                 title: '付款单结算明细列表',
        //                 icon: markRaw(FolderOpened),
        //                 anchors: 'promo_code-team-audit'
        //             },
        //             component: () => import('@/views/purchase/cash-transaction/payment-doc-list.vue')
        //         }
        //     ]
        // }
    ]
}

export default routes
