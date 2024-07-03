import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'tquotation',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '运费服务管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 10
    },
    children: [
        {
            path: 'tquotation-list',
            name: 'tquotation-list',
            asideVisible: false,
            meta: {
                title: '运费服务管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'tquotation-list',
                anchors: 'quoted-price-1'
            },
            component: () => import('@/views/tquotation/index.vue')
        }
        // {
        //     path: 'quotation-list-tag',
        //     redirect: '/website/quotation/quotation-list',
        //     meta: {
        //         title: '运费服务',
        //         icon: markRaw(FolderOpened),
        //         activeMenu: 'quotation-list'
        //     },
        //     component: RouterView,
        // children: [
        //     {
        //         path: 'quotation-establish',
        //         name: 'quotation-establish',
        //         asideVisible: false,
        //         props: true,
        //         meta: {
        //             title: '报价单创建',
        //             icon: markRaw(FolderOpened),
        //             activeMenu: 'quotation-list'
        //         },
        //         component: () => import('@/views/quotation/quotation-establish.vue')
        //     },
        //     {
        //         path: 'detailed-establish/:feeNo?',
        //         name: 'detailed-establish',
        //         asideVisible: false,
        //         props: true,
        //         meta: {
        //             title: '报价单明细创建',
        //             icon: markRaw(FolderOpened),
        //             activeMenu: 'quotation-list'
        //         },
        //         component: () => import('@/views/quotation/detailed-establish.vue')
        //     },
        //     {
        //         path: 'quotation-details/:title/:feeNo/:feeName/:srcProvinceName/:srcCityName/:srcCountyName/:targetProvinceName/:targetCityName/:targetCountyName/:firstWeightStr/:firstWeightPriceStr/:otherWeightStr/:otherWeightPriceStr?',
        //         name: 'quotation-details',
        //         asideVisible: false,
        //         props: true,
        //         meta: {
        //             title: '报价单明细',
        //             icon: markRaw(FolderOpened),
        //             activeMenu: 'quotation-list'
        //         },
        //         component: () => import('@/views/quotation/quotation-details.vue'),
        //         beforeEnter: (to, form, next) => {
        //             if (to.params.title === 'modify') {
        //                 to.meta.title = '报价单明细修改'
        //             } else if (to.params.title === 'toexamine') {
        //                 to.meta.title = '报价单明细审核'
        //             } else if (to.params.title === 'deactivate') {
        //                 to.meta.title = '报价单明细停用'
        //             } else if (to.params.title === 'enable') {
        //                 to.meta.title = '报价单明细启用'
        //             } else {
        //                 to.meta.title = '报价单明细'
        //             }
        //             next()
        //         }
        //     }
        // ]
        // }
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
