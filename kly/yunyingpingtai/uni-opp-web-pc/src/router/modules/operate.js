import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'operate',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '平台商户管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 5
    },
    children: [
        {
            path: 'merchant-settle-list',
            name: 'merchant-settle-list',
            asideVisible: false,
            meta: {
                title: '商户入驻管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-settle-list',
                anchors: 'platform-merchant-1'
            },
            component: () => import('@/views/operate/merchant-settle/index.vue')
        },
        {
            path: 'merchant-settle-list',
            redirect: '/website/operate/merchant-settle-list',
            meta: {
                title: '商户入驻管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-settle-list',
                anchors: 'platform-merchant-1'
                // anchors: 'merchant-0'
            },
            component: RouterView,
            children: [
                // {
                //     path: 'settle-in-means/:handleType/:busiMerchantId?',
                //     name: 'settle-in-means',
                //     props: true,
                //     meta: {
                //         title: '新增商户',
                //         icon: markRaw(FolderOpened),
                //         activeMenu: 'settle-in-means'
                //     },
                //     component: () => import('@/views/operate/merchant-settle/settle-in-means.vue')
                // },
                {
                    path: 'settle-apply/:handleType/:handleType/:busiMerchantId?',
                    name: 'settle-apply',
                    props: true,
                    meta: {
                        title: '业务线信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'settle-apply'
                    },
                    component: () => import('@/views/operate/merchant-settle/settle-apply.vue')
                },
                {
                    path: 'settle-apply-person/:handleType/:busiMerchantId?',
                    name: 'settle-apply-person',
                    props: true,
                    meta: {
                        title: '认证信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'settle-apply-person',
                        anchors: 'settle-apply-person'
                    },
                    component: () => import('@/views/operate/merchant-settle/settle-apply-person.vue')
                },
                {
                    path: 'business-line-information/:handleType/:busiMerchantId?',
                    name: 'business-line-information',
                    props: true,
                    meta: {
                        title: '业务线信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'business-line-information'
                    },
                    component: () => import('@/views/operate/merchant-settle/business-line-information.vue')
                },
                {
                    path: 'business-line-information-tab/:handleType/:busiMerchantId?',
                    name: 'business-line-information-tab',
                    props: true,
                    meta: {
                        title: '业务线信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'business-line-information-tab'
                    },
                    component: () => import('@/views/operate/merchant-settle/business-line-information-tab.vue')
                },
                {
                    path: 'submit-apply/:handleType/:busiMerchantId?',
                    name: 'submit-apply',
                    props: true,
                    meta: {
                        title: '提交申请',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'submit-apply'
                    },
                    component: () => import('@/views/operate/merchant-settle/submit-apply.vue')
                },
                {
                    path: 'merchant-settle-result/:result?',
                    name: 'merchant-settle-result',
                    props: true,
                    meta: {
                        title: '审核结果',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'merchant-settle-result'
                    },
                    component: () => import('@/views/operate/merchant-settle/merchant-settle-result.vue')
                },
                {
                    path: 'edit-merchant-settle',
                    name: 'edit-merchant-settle',
                    asideVisible: false,
                    meta: {
                        title: '商户编辑',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'edit-merchant-settle'
                    },
                    component: () => import('../../views/operate/merchant-settle/edit-merchant-settle.vue')
                }
            ]
        },
        {
            path: 'shopApply',
            name: 'shopApply',
            asideVisible: false,
            meta: {
                title: '店铺管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'shopApply',
                anchors: 'platform-merchant-store-mana'
            },
            component: () => import('../../views/marketing/marketing-business/shopApply-list.vue')
        },
        {
            path: 'shopApply-tag',
            redirect: '/website/operate/shopApply',
            meta: {
                title: '店铺管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'shopApply',
                anchors: 'platform-merchant-store-mana'
            },
            component: RouterView,
            children: [
                {
                    path: 'shop-detail/:handleType/:busiMerchantId/:type?/:storeCode?',
                    name: 'shop-detail',
                    props: true,
                    meta: {
                        title: '店铺信息',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'shop-detail'
                    },
                    component: () => import('@/views/marketing/marketing-business/shopApply-detail.vue')
                }
            ]
        },
        {
            path: 'shop-check',
            name: 'shop-check',
            asideVisible: false,
            meta: {
                title: '店铺审核',
                icon: markRaw(FolderOpened),
                activeMenu: 'shop-check',
                anchors: 'platform-merchant-shop-audit'
            },
            component: () => import('@/views/operate/shop-check/index.vue')
        },
        {
            path: 'recodeApplication',
            name: 'recodeApplication',
            asideVisible: false,
            meta: {
                title: '商户申请记录',
                icon: markRaw(FolderOpened),
                activeMenu: 'platform-merchant-apply-record',
                anchors: 'platform-merchant-apply-record'
            },
            component: () => import('../../views/marketing/recodeApplication-list/list.vue')
        },
        {
            path: 'merchant-subaccount-unbind-list',
            name: 'merchant-subaccount-unbind-list',
            asideVisible: false,
            meta: {
                title: '商户子账号管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'platform-merchant-sub-account'
            },
            component: () => import('@/views/operate/merchant-subaccount/index.vue')
        },
        // {
        //     path: 'merchant-subaccount-list',
        //     name: 'merchant-subaccount-list',
        //     asideVisible: false,
        //     meta: {
        //         title: '用户设备解绑',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'merchant-subaccount-list'
        //     },
        //     component: () => import('@/views/operate/merchant-subaccount/unbind.vue')
        // },
        {
            path: 'merchant-subaccount-list-tag',
            redirect: '/website/operate/merchant-subaccount-unbind-list',
            meta: {
                title: '商户子账号管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'subaccount-management-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'add-subaccount/:type/:merchantSubType?/:merchantSubId?/:busiMerchantId?/:status?/:code?',
                    name: 'add-subaccount',
                    props: true,
                    meta: {
                        title: '查看用户',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'add-subaccount'
                    },
                    component: () => import('@/views/operate/merchant-subaccount/add-subaccount.vue')
                }
            ]
        },
        // {
        //     path: 'merchant-list',
        //     name: 'merchant-list',
        //     asideVisible: false,
        //     meta: {
        //         title: '商户列表',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'merchant-list',
        //         anchors: 'marketing-0'
        //     },
        //     component: () => import('@/views/operate/merchant/index.vue')
        // },
        // {
        //     path: 'merchant-change-list',
        //     name: 'merchant-change-list',
        //     asideVisible: false,
        //     meta: {
        //         title: '商户变更',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'merchant-change-list',
        //         anchors: 'marketing-0'
        //     },
        //     component: () => import('@/views/operate/merchant-change/index.vue')
        // },
        // {
        //     path: 'merchant-change-list',
        //     redirect: '/website/operate/merchant-change-list',
        //     meta: {
        //         title: '商户变更',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'merchant-change-list',
        //         anchors: 'marketing-0'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'edit-merchang',
        //             name: 'edit-merchang',
        //             props: true,
        //             meta: {
        //                 title: '变更编辑',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'edit-merchang'
        //             },
        //             component: () => import('@/views/operate/merchant-change/edit-merchang.vue')
        //         }
        //     ]
        // },
        {
            path: 'business-rule',
            name: 'business-rule',
            asideVisible: false,
            meta: {
                title: '业务规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'business-rule',
                anchors: 'platform-merchant-2'
            },
            component: () => import('@/views/operate/business-rule/index.vue')
        },
        {
            path: 'merchant-intention',
            name: 'merchant-intention',
            asideVisible: false,
            meta: {
                title: '商户意向管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchant-intention',
                anchors: 'platform-merchant-purpose-manage'
            },
            component: () => import('@/views/operate/merchant-intention/index.vue')
        },
        {
            path: 'label',
            name: 'label',
            asideVisible: false,
            meta: {
                title: '标签管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'label',
                anchors: 'platform-merchant-lablel-mana'
            },
            component: () => import('@/views/operate/label/index.vue')
        }
    ]
}

export default routes
