import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'marketing',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '营销中台',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 1
    },
    children: [
        {
            path: 'marketing-home',
            name: 'marketing-home',
            asideVisible: false,
            meta: {
                title: '营销工具',
                icon: markRaw(FolderOpened),
                activeMenu: 'marketing-home',
                anchors: 'marketing-tools'
            },
            component: () => import('@/views/marketing/index.vue')
        },
        {
            path: 'coupon-batch-list',
            name: 'coupon-batch-list',
            asideVisible: false,
            meta: {
                title: '优惠券批次列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'coupon-batch-list',
                anchors: 'marketing-0'
            },
            component: () => import('@/views/marketing/coupon-batch/coupon-batch-list.vue')
        },
        {
            path: 'coupon-batch-list-tag',
            redirect: '/website/marketing/coupon-batch-list',
            meta: {
                title: '优惠券批次列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'coupon-batch-list',
                anchors: 'marketing-0'
            },
            component: RouterView,
            children: [
                {
                    path: 'coupon-batch-handle/:handleType/:groupCode?/:subCode?',
                    name: 'coupon-batch-handle',
                    props: true,
                    meta: {
                        title: '优惠券申请',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'coupon-batch-list'
                    },
                    component: () => import('@/views/marketing/coupon-batch/components/coupon-batch-handle.vue')
                },
                {
                    path: 'coupon-batch-config',
                    name: 'coupon-batch-config',
                    props: true,
                    meta: {
                        title: '券详情',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'coupon-batch-list'
                    },
                    component: () => import('@/views/marketing/coupon-batch/components/coupon-config.vue')
                }
            ]
        },
        {
            path: 'active-list',
            name: 'active-list',
            asideVisible: false,
            meta: {
                title: '营销活动列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'active-list',
                anchors: 'marketing-activity-list'
            },
            component: () => import('@/views/marketing/marketing-active/active-list.vue')
        },
        {
            path: 'active-list-tag',
            redirect: '/website/marketing/active-list',
            meta: {
                title: '营销活动列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'active-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'apply-active/:handleType/:applyCode?',
                    name: 'apply-active',
                    props: true,
                    meta: {
                        title: '活动申请',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'apply-active'
                    },
                    component: () => import('@/views/marketing/marketing-active/apply-active.vue')
                }, {
                    path: 'active-coupon-list',
                    name: 'active-coupon-list',
                    props: true,
                    meta: {
                        title: '优惠券批次关联列表',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'active-coupon-list'
                    },
                    component: () => import('@/views/marketing/marketing-active/active-coupon-list.vue')
                }, {
                    path: 'apply-active-seckill/:handleType/:applyCode?',
                    name: 'apply-active-seckill',
                    props: true,
                    meta: {
                        title: '活动申请',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'apply-active-seckill'
                    },
                    component: () => import('@/views/marketing/marketing-active/apply-active-seckill.vue')
                }
            ]
        },
        {
            path: 'account',
            asideVisible: true,
            component: RouterView,
            meta: {
                title: '营销成本账户',
                icon: markRaw(Box),
                cannotClick: true,
                anchors: 'marketing-11'
            },
            children: [
                {
                    path: 'marketing-cost-account-list',
                    name: 'marketing-cost-account-list',
                    meta: {
                        title: '账户列表',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'marketing-cost-account-list',
                        anchors: 'marketing-12'
                    },
                    component: () => import('@/views/marketing/marketing-cost-account/account-list.vue')

                },
                {
                    path: 'recharge-record-list',
                    name: 'recharge-record-list',
                    meta: {
                        title: '充值记录查询',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'recharge-record-list',
                        anchors: 'marketing-16'
                    },
                    component: () => import('@/views/marketing/marketing-cost-account/recharge-record.vue')
                },
                {
                    path: 'flow-record-list',
                    name: 'flow-record-list',
                    meta: {
                        title: '流水查询',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'flow-record-list',
                        anchors: 'marketing-20'
                    },
                    component: () => import('@/views/marketing/marketing-cost-account/flow-record.vue')
                }
            ]
        },
        {
            path: 'management-activities',
            name: 'management-activities',
            asideVisible: false,
            meta: {
                title: '活动页管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'management-activities',
                anchors: 'marketing-activity-page'
            },
            component: () => import('@/views/marketing/management-activities/index.vue')
        }
    ]
}

export default routes
