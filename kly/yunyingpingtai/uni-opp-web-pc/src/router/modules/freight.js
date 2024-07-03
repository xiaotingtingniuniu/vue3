import { RouterView } from 'vue-router'
import { markRaw } from 'vue'

import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'quotation',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '运单管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 10
    },
    children: [
        {
            path: 'quotation-list',
            name: 'quotation-list',
            asideVisible: false,
            meta: {
                title: '报价管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'quotation-list',
                anchors: 'quoted-price-1'
            },
            component: () => import('@/views/quotation/index.vue')
        },
        {
            path: 'quotation-list-tag',
            redirect: '/website/quotation/quotation-list',
            meta: {
                title: '运费服务',
                icon: markRaw(FolderOpened),
                activeMenu: 'quotation-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'quotation-establish',
                    name: 'quotation-establish',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '报价单创建',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'quotation-list'
                    },
                    component: () => import('@/views/quotation/quotation-establish.vue')
                },
                {
                    path: 'detailed-establish',
                    name: 'detailed-establish',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '维护报价明细',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'quotation-list'
                    },
                    component: () => import('@/views/quotation/detailed-establish.vue')
                },
                {
                    path: 'quotation-details/:title/:id/:feeNo',
                    name: 'quotation-details',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '报价单明细修改',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'quotation-list'
                    },
                    component: () => import('@/views/quotation/quotation-details.vue')
                }
            ]
        },
        {
            path: 'leveladdress',
            name: 'leveladdress',
            asideVisible: false,
            meta: {
                title: '四级地址管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'leveladdress',
                anchors: 'quoted-four-level-address'
            },
            component: () => import('@/views/leveladdress/index.vue')
        },
        {
            path: 'leveladdress-tag',
            redirect: '/website/quotation/leveladdress',
            meta: {
                title: '四级地址管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'leveladdress'
            },
            component: RouterView,
            children: [
                {
                    path: 'leveladdress-operation/:title/:countyCode/:townCode?',
                    name: 'leveladdress-operation',
                    asideVisible: false,
                    props: true,
                    meta: {
                        title: '四级地址',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'leveladdress'
                    },
                    component: () => import('@/views/leveladdress/leveladdress-operation.vue'),
                    beforeEnter: (to, form, next) => {
                        if (to.params.title === 'modify') {
                            to.meta.title = '四级地址修改'
                        } else {
                            to.meta.title = '四级地址新增'
                        }
                        next()
                    }
                }
            ]
        }
        // {
        //     path: 'leveladdress',
        //     name: 'leveladdress',
        //     asideVisible: false,
        //     meta: {
        //         title: '四级地址管理',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'leveladdress',
        //         anchors: 'marketing-0'
        //     },
        //     component: () => import('@/views/leveladdress/index.vue')
        // },
        // {
        //     path: 'leveladdress-tag',
        //     redirect: '/website/quotation/leveladdress',
        //     meta: {
        //         title: '四级地址管理',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'leveladdress'
        //     },
        //     component: RouterView,
        //     children: [
        //         {
        //             path: 'leveladdress-operation/:title?',
        //             name: 'leveladdress-operation',
        //             asideVisible: false,
        //             props: true,
        //             meta: {
        //                 title: '四级地址',
        //                 icon: markRaw(FolderOpened),
        //                 activeMenu: 'leveladdress'
        //             },
        //             component: () => import('@/views/leveladdress/leveladdress-operation.vue')
        //         }
        //     ]
        // }
    ]
}

export default routes
