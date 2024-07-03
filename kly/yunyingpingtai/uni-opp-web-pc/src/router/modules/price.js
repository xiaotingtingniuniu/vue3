// // import { RouterView } from 'vue-router'
// // import { markRaw } from 'vue'
// // import { Box, FolderOpened } from '@element-plus/icons-vue'

// // // 侧边栏显示信息
// // const routes = {
// //     path: 'price-management',
// //     asideVisible: true,
// //     component: RouterView,
// //     meta: {
// //         title: '价格中台',
// //         icon: markRaw(Box),
// //         cannotClick: true
// //     },
// //     children: [
// //         {
// //             path: 'price-merchant',
// //             name: 'price-merchant',
// //             asideVisible: false,
// //             meta: {
// //                 title: '商户列表',
// //                 icon: markRaw(FolderOpened),
// //                 activeMenu: 'price-merchant'
// //             },
// //             component: () =>
// //                 import('@/views/price-management/index.vue')
// //         },
// //         {
// //             path: 'price-detail',
// //             name: 'price-detail',
// //             asideVisible: false,
// //             meta: {
// //                 title: '价格管理',
// //                 icon: markRaw(FolderOpened),
// //                 activeMenu: 'price-detail'
// //             },
// //             component: () =>
// //                 import('@/views/price-management/price-detail.vue')
// //         },
// //         {
// //             path: 'price-detail-tag',
// //             redirect: '/website/price-management/price-detail',
// //             meta: {
// //                 title: '价格管理',
// //                 icon: markRaw(FolderOpened),
// //                 activeMenu: 'price-detail'
// //             },
// //             component: RouterView,
// //             children: [
// //                 {
// //                     path: 'price-adjustment-list/:merchantName/:busiMerchantId/:merchantType/:firstChannelName?/:firstChannelId?',
// //                     name: 'price-adjustment-list',
// //                     asideVisible: false,
// //                     props: true,
// //                     meta: {
// //                         title: '原价管理',
// //                         icon: markRaw(FolderOpened),
// //                         activeMenu: 'price-detail'
// //                     },
// //                     component: () => import('@/views/price-management/price-adjustment.vue')

// //                 },
// //                 {
// //                     path: 'purchase-price-list/:merchantName&/:busiMerchantId&/:merchantType&/:firstChannelName&/:firstChannelId',
// //                     name: 'purchase-price-list',
// //                     asideVisible: false,
// //                     props: true,
// //                     meta: {
// //                         title: '采购价管理',
// //                         icon: markRaw(FolderOpened),
// //                         activeMenu: 'price-detail'
// //                     },
// //                     component: () => import('@/views/price-management/purchase-price.vue')

// // 侧边栏显示信息
// const routes = {
//     path: 'price-management',
//     asideVisible: true,
//     component: RouterView,
//     meta: {
//         title: '价格中台',
//         icon: markRaw(Box),
//         cannotClick: true
//     },
//     children: [
//         {
//             path: 'price-merchant',
//             name: 'price-merchant',
//             asideVisible: false,
//             meta: {
//                 title: '商户列表',
//                 icon: markRaw(FolderOpened),
//                 activeMenu: 'price-merchant'
//             },
//             component: () =>
//                 import('@/views/price-management/index.vue')
//         },
//         {
//             path: 'price-detail',
//             name: 'price-detail',
//             asideVisible: false,
//             meta: {
//                 title: '价格管理',
//                 icon: markRaw(FolderOpened),
//                 activeMenu: 'price-detail'
//             },
//             component: () =>
//                 import('@/views/price-management/price-detail.vue')
//         },
//         {
//             path: 'price-detail-tag',
//             redirect: '/website/price-management/price-detail',
//             meta: {
//                 title: '价格管理',
//                 icon: markRaw(FolderOpened),
//                 activeMenu: 'price-detail'
//             },
//             component: RouterView,
//             children: [
//                 {
//                     path: 'price-adjustment-list/:merchantName/:busiMerchantId/:merchantType/:firstChannelName?/:firstChannelId?',
//                     name: 'price-adjustment-list',
//                     props: true,
//                     meta: {
//                         title: '原价管理',
//                         icon: markRaw(FolderOpened),
//                         activeMenu: 'price-detail'
//                     },
//                     component: () => import('@/views/price-management/price-adjustment.vue')

//                 },
//                 {
//                     path: 'purchase-price-list/:merchantName/:busiMerchantId/:merchantType/:firstChannelName?/:firstChannelId?',
//                     name: 'purchase-price-list',
//                     props: true,
//                     meta: {
//                         title: '采购价管理',
//                         icon: markRaw(FolderOpened),
//                         activeMenu: 'price-detail'
//                     },
//                     component: () => import('@/views/price-management/purchase-price.vue')

// //                 }
// //             ]
// //         }
// //     ]
// // }

// // export default routes
