import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'paymentManagement',
    component: RouterView,
    asideVisible: true,
    meta: {
        title: '支付管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 21
    },
    children: [
        {
            path: 'wechat-administration',
            name: 'wechat-administration',
            asideVisible: false,
            meta: {
                title: '微信分管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'wechat-administration',
                anchors: 'pay-manage-wx-score'
            },
            component: () => import('@/views/paymentManagement/wechat-administration/index.vue')
        },
        {
            path: 'subaccount-piece',
            name: 'subaccount-piece',
            asideVisible: false,
            meta: {
                title: '进件管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'subaccount-piece',
                anchors: 'pay-manage-income'
            },
            component: () => import('@/views/paymentManagement/subaccount-piece/index.vue')
        },
        {
            path: 'payment-record',
            name: 'payment-record',
            asideVisible: false,
            meta: {
                title: '支付记录',
                icon: markRaw(FolderOpened),
                activeMenu: 'payment-record',
                anchors: 'pay-manage-pay-record'
            },
            component: () => import('@/views/paymentManagement/payment-record/index.vue')
        },
        {
            path: 'refund-record',
            name: 'refund-record',
            asideVisible: false,
            component: () => import('@/views/paymentManagement/refund-record/index.vue'),
            meta: {
                title: '退款记录',
                icon: markRaw(FolderOpened),
                activeMenu: 'refund-record',
                anchors: 'pay-manage-refundment'
            }
        },
        {
            path: 'balance-withdrawal',
            name: 'balance-withdrawal',
            asideVisible: false,
            component: () => import('@/views/paymentManagement/balance-withdrawal/index.vue'),
            meta: {
                title: '余额提现',
                icon: markRaw(FolderOpened),
                activeMenu: 'balance-withdrawal',
                anchors: 'pay-manage-balance-take'
            }
        },
        {
            path: 'coupon-withdrawal',
            name: 'coupon-withdrawal',
            asideVisible: false,
            component: () => import('@/views/paymentManagement/coupon-withdrawal/index.vue'),
            meta: {
                title: '补差提现',
                icon: markRaw(FolderOpened),
                activeMenu: 'coupon-withdrawal',
                anchors: 'pay-manage-diff-take'
            }
        },
        {
            path: 'white-list',
            name: 'white-list',
            asideVisible: false,
            meta: {
                title: '白名单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'white-list',
                anchors: 'pay-manage-white'
            },
            component: () => import('@/views/payment-management/white-list.vue')
        },
        {
            path: 'white-list-tag',
            redirect: '/website/payment-management/white-list',
            meta: {
                title: '白名单管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'white-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-white/:type?',
                    name: 'add-white',
                    props: true,
                    meta: {
                        title: '添加白名单',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'white-list'
                    },
                    component: () => import('@/views/payment-management/comments/add-white.vue')
                }
            ]
        },
        {
            path: 'payment-facescan',
            name: 'payment-facescan',
            asideVisible: false,
            component: () => import('@/views/paymentManagement/payment-facescan/index.vue'),
            meta: {
                title: '刷脸支付管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'payment-facescan',
                anchors: 'pay-manage-flush-face'
            }
        }
    ]
}

export default routes
