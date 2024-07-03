import { RouterView } from 'vue-router'
import { markRaw } from 'vue'
import { Box, FolderOpened } from '@element-plus/icons-vue'

const routes = {
    path: 'moneyManagement',
    asideVisible: true,
    component: RouterView,
    meta: {
        title: '资金管理',
        icon: markRaw(Box),
        cannotClick: true,
        serverId: 18
    },
    children: [
        {
            path: 'withdraw-carrydown-list',
            name: 'withdraw-carrydown-list',
            asideVisible: false,
            meta: {
                title: '提现结转管理',
                icon: markRaw(FolderOpened),
                activeMenu: 'withdraw-carrydown-list',
                anchors: 'money-withdraw'
            },
            component: () => import('@/views/moneyManagement/withdraw-carrydown-list.vue')
        }
    ]
}

export default routes
