import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'promocode-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '推广码管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 29
    },
    children: [
        {
            path: 'organization-management-list',
            name: 'organization-management-list',
            asideVisible: false,
            meta: {
                title: '组织管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'organization-management-list',
                anchors: 'promo_code-organization'
            },
            component: () => import('@/views/promocode-Management/organization-management-list.vue')
        },
        {
            path: 'product-management-list',
            name: 'product-management-list',
            asideVisible: false,
            meta: {
                title: '推广产品管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'product-management-list',
                anchors: 'promo_code-product'
            },
            component: () => import('@/views/promocode-Management/product-management-list.vue')
        },
        {
            path: 'rule-management-list',
            name: 'rule-management-list',
            asideVisible: false,
            meta: {
                title: '推广规则管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'rule-management-list',
                anchors: 'promo_code-rule'
            },
            component: () => import('@/views/promocode-Management/rule-management-list.vue')
        },
        {
            path: 'team-management',
            name: 'team-management',
            asideVisible: true,
            component: RouterView,
            meta: {
                title: '团队管理',
                icon: markRaw(Box),
                cannotClick: true,
                serverId: 29,
                anchors: 'promo_code-team'

            },
            children: [
                {
                    path: 'team-process-list',
                    name: 'team-process-list',
                    meta: {
                        title: '团队审核',
                        icon: markRaw(FolderOpened),
                        anchors: 'promo_code-team-audit'
                    },
                    component: () => import('@/views/promocode-Management/team-management/team-process.vue')
                },
                {
                    path: 'team-list',
                    name: 'team-list',
                    props: true,
                    meta: {
                        title: '团队列表',
                        icon: markRaw(FolderOpened),
                        anchors: 'promo_code-team-list'
                    },
                    component: () => import('@/views/promocode-Management/team-management/team-list.vue')
                }
            ]
        },
        {
            path: 'promotion-personnel-list',
            name: 'promotion-personnel-list',
            asideVisible: false,
            meta: {
                title: '推广人员管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'promotion-personnel-list',
                anchors: 'promo_code-person'
            },
            component: () => import('@/views/promocode-Management/promotion-personnel-list.vue')
        },
        {
            path: 'promotion-data-management',
            name: 'promotion-data-management',
            asideVisible: true,
            component: RouterView,
            meta: {
                title: '推广数据管理',
                icon: markRaw(Box),
                cannotClick: true,
                serverId: 29,
                anchors: 'promo_code-data'

            },
            children: [
                {
                    path: 'local-merchants',
                    name: 'local-merchants',
                    meta: {
                        title: '本地商家推广数据',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'local-merchants',
                        anchors: 'promo_code-data-local-merchant'

                    },
                    component: () => import('@/views/promocode-Management/promotion-data-management/local-merchants.vue')
                },
                {
                    path: 'guizhu-merchants',
                    name: 'guizhu-merchants',
                    props: true,
                    meta: {
                        title: '恒生活app推广数据',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'guizhu-merchants',
                        anchors: 'promo_code-data-hsh-app'

                    },
                    component: () => import('@/views/promocode-Management/promotion-data-management/guizhu-merchants.vue')
                },
                {
                    path: 'container-staging',
                    name: 'container-staging',
                    props: true,
                    meta: {
                        title: ' 货柜分期推广数据',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'container-staging',
                        anchors: 'promo_code-data-cabinet-n-period'

                    },
                    component: () => import('@/views/promocode-Management/promotion-data-management/container-staging.vue')
                },
                {
                    path: 'payment-container',
                    name: 'payment-container',
                    props: true,
                    meta: {
                        title: '全款货柜推广数据',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'payment-container',
                        anchors: 'promo_code-data-cabinet-full_pay'
                    },
                    component: () => import('@/views/promocode-Management/promotion-data-management/payment-container.vue')
                }
            ]
        }
    ]
}

export default routes
