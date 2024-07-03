import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'device-manager',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '设备管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 22
    },

    children: [

        // {
        //     path: 'device-application-form',
        //     name: 'device-application-form',
        //     asideVisible: false,
        //     meta: {
        //         title: '设备申请列表',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'device-application-form'
        //     },
        //     component: () => import('@/views/deviceManager/device-application-form.vue')
        // },
        {
            path: 'device-active-application',
            name: 'device-active-application',
            asideVisible: false,
            meta: {
                title: '设备激活申请',
                icon: markRaw(FolderOpened),
                activeMenu: 'device-active-application',
                anchors: 'device-active'
            },
            component: () => import('@/views/deviceManager/device-active-application.vue')
        },
        {
            path: 'device-list',
            name: 'device-list',
            asideVisible: false,
            meta: {
                title: '设备列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'device-list',
                anchors: 'device-list'
            },
            component: () => import('@/views/deviceManager/device-list.vue')
        },
        {
            path: 'abnormal-warning',
            name: 'abnormal-warning',
            asideVisible: false,
            meta: {
                title: '设备预警',
                icon: markRaw(FolderOpened),
                activeMenu: 'device-warning',
                anchors: 'device-warning'
            },
            component: () => import('@/views/deviceManager/abnormal-warning.vue')
        },

        // {
        //     path: 'team-management',
        //     name: 'team-management',
        //     asideVisible: true,
        //     component: RouterView,
        //     meta: {
        //         title: '团队管理',
        //         icon: markRaw(Box),
        //         cannotClick: true,
        //         serverId: 29,
        //         anchors: 'promo_code-team'

        //     },
        //     children: [
        //         {
        //             path: 'team-process-list',
        //             name: 'team-process-list',
        //             meta: {
        //                 title: '团队审核',
        //                 icon: markRaw(FolderOpened),
        //                 anchors: 'promo_code-team-audit'
        //             },
        //             component: () => import('@/views/promocode-Management/team-management/team-process.vue')
        //         },
        //         {
        //             path: 'team-list',
        //             name: 'team-list',
        //             props: true,
        //             meta: {
        //                 title: '团队列表',
        //                 icon: markRaw(FolderOpened),
        //                 anchors: 'promo_code-team-list'
        //             },
        //             component: () => import('@/views/promocode-Management/team-management/team-list.vue')
        //         }
        //     ]
        // },
        {
            path: 'equipment-basic-configuration',
            name: 'equipment-basic-configuration',
            asideVisible: true,
            component: RouterView,
            meta: {
                title: '设备基础配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'equipment-basic-configuration',
                cannotClick: true,
                serverId: 22,
                anchors: 'device-base-config'
            },
            children: [

                {
                    path: 'basic-property',
                    name: 'basic-property',
                    asideVisible: false,
                    meta: {
                        title: '基础属性配置',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'basic-property',
                        anchors: 'device-base-config-properties'
                    },
                    component: () => import('@/views/deviceManager/basic-property.vue')
                },

                {
                    path: 'poduct-category',
                    name: 'poduct-category',
                    asideVisible: false,
                    meta: {
                        title: '产品类别能力配置',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'poduct-category',
                        anchors: 'device-base-config-product-class'
                    },
                    component: () => import('@/views/deviceManager/poduct-category.vue')
                },
                {
                    path: 'model-capability',
                    name: 'model-capability',
                    asideVisible: false,
                    // props: true,
                    meta: {
                        title: '型号能力配置',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'model-capability',
                        anchors: 'device-base-config-model'

                    },
                    component: () => import('@/views/deviceManager/model-capability.vue')

                }
                // {
                //     path: 'model-capability-tag',
                //     redirect: '/website/device-manager/model-capability/model-capability',
                //     meta: {
                //         title: '型号能力配置',
                //         icon: markRaw(FolderOpened),
                //         activeMenu: 'model-capability'
                //     },
                //     component: RouterView,
                //     children: [{
                //         path: 'model-capability-tag/:productCateName?/:deviceTypeName?/:deviceModeCode?/:deviceModeName?',
                //         name: 'model-capability-tag',
                //         props: true,
                //         asideVisible: false,
                //         meta: {
                //             title: '查看信息',
                //             icon: markRaw(FolderOpened),
                //             activeMenu: 'model-capability'
                //         },
                //         component: () => import('@/views/deviceManager/poduct-category-publish.vue')
                //     }]

                // }
                // {
                //     path: 'model-capability',
                //     redirect: '/website/device-manager/equipment-basic-configuration/model-capability',

                //     // name: 'model-capability',
                //     // props: true,
                //     meta: {
                //         title: '型号能力配置',
                //         icon: markRaw(FolderOpened),
                //         activeMenu: 'model-capability'
                //         // anchors: 'goods-2'
                //     },
                //     component: RouterView,
                //     children: [{
                //         path: 'add-sku/:skuId?/:merchantCode?',
                //         name: 'add-sku',
                //         props: true,
                //         meta: {
                //             title: 'sku新增',
                //             icon: markRaw(FolderOpened),
                //             activeMenu: 'sku-list'
                //         },
                //         component: () => import('@/views/deviceManager/model-capability.vue')
                //     }]

                //     // component: () => import('@/views/deviceManager/model-capability.vue')
                // }
            ]

            // component: () => import('@/views/deviceManager/equipment-config.vue')
        }
    ]
}

export default routes
