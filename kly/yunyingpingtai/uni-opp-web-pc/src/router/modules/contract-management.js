import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'contract-management',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '平台合同管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 30
    },
    children: [
        {
            path: 'contract-master-list',
            name: 'contract-master-list',
            asideVisible: false,
            meta: {
                title: '合同模板管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'contract-master-list',
                anchors: 'contract-template-manage'
            },
            component: () => import('@/views/contract-management/contract-master-list/list.vue')
        },
        {
            path: 'contract-master-list',
            redirect: '/website/contract-management/contract-master-list',
            meta: {
                title: '合同模板管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'contract-master-list'
            },
            component: RouterView,
            children: [
                {
                    path: 'contract-master-add',
                    name: 'contract-master-add',
                    asideVisible: false,
                    meta: {
                        title: '新增',
                        icon: markRaw(FolderOpened),
                        activeMenu: 'contract-master-add',
                        anchors: 'carbinet-good-stock-query'
                    },
                    component: () => import('@/views/contract-management/contract-master-list/add.vue')
                }
            ]
        },
        {
            path: 'merchants-contract-list',
            name: 'merchants-contract-list',
            asideVisible: false,
            meta: {
                title: '商户合同列表',
                icon: markRaw(FolderOpened),
                activeMenu: 'merchants-contract-list',
                anchors: 'carbinet-good-stock-flow'
            },
            component: () => import('@/views/contract-management/merchants-contract-list/list.vue')
        },
        {
            path: 'business-qualification',
            name: 'business-qualification',
            asideVisible: false,
            meta: {
                title: '经营资质配置',
                icon: markRaw(FolderOpened),
                activeMenu: 'business-qualification',
                anchors: 'contract-sale-cert'
            },
            component: () => import('@/views/contract-management/business-qualification/index.vue')
        }
    ]
}

export default routes
