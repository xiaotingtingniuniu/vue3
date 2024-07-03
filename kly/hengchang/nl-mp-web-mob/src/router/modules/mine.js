import { RouterView } from 'vue-router'

const routes = {
    path: '/my',
    name: 'my',
    redirect: '/home',
    component: RouterView,
    children: [
        {
            path: '/setting',
            name: 'setting',
            meta: {
                title: '设置',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-setting" */ '@/views/mine/setting/index.vue')
        },
        {
            path: '/personal',
            name: 'personal',
            meta: {
                title: '个人设置',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-personal" */ '@/views/mine/person/index.vue')
        },
        {
            path: '/phone',
            name: 'phone',
            meta: {
                title: '个人设置',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-phone" */ '@/views/mine/phone/index.vue')
        },
        {
            path: '/agreement-privacy',
            name: 'agreement-privacy',
            meta: {
                title: '隐私政策',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-agreement-privacy" */ '@/views/mine/agreement/index.vue')
        },
        {
            path: '/agreement-service',
            name: 'agreement-service',
            meta: {
                title: '服务协议',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-agreement-service" */ '@/views/mine/agreement/service.vue')
        },
        {
            path: '/agreement-jurisdiction',
            name: 'agreement-jurisdiction',
            meta: {
                title: '权限列表',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-agreement-jurisdiction" */ '@/views/mine/agreement/jurisdiction.vue')
        },
        {
            path: '/agreement-sharelist',
            name: 'agreement-sharelist',
            meta: {
                title: '第三方协议列表',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-agreement-sharelist" */ '@/views/mine/agreement/sharelist.vue')
        },
        {
            path: '/setting-phone',
            name: 'setting-phone',
            meta: {
                title: '更改手机号',
                showTitle: true
            },
            component: () => import(/* webpackChunkName: "my-setting-phone" */ '@/views/mine/phone/index.vue')
        },
        {
            path: '/account-cancellation',
            name: 'account-cancellation',
            meta: {
                title: '注销账号'
            },
            component: () => import(/* webpackChunkName: "my-account-cancellation" */ '@/views/mine/setting/account-cancellation/index.vue')
        },
        {
            path: '/cancellation-fail',
            name: 'cancellation-fail',
            meta: {
                title: '注销账号'
            },
            component: () => import(/* webpackChunkName: "my-cancellation-fail" */ '@/views/mine/setting/account-cancellation/cancellation-fail.vue')
        },
        {
            path: '/cancellation-verification',
            name: 'cancellation-verification',
            meta: {
                title: '身份验证'
            },
            component: () => import(/* webpackChunkName: "my-cancellation-verification" */ '@/views/mine/setting/account-cancellation/cancellation-verification.vue')
        },
        {
            path: '/agreement-cancellation',
            name: 'agreement-cancellation',
            meta: {
                title: '用户注销协议'
            },
            component: () => import(/* webpackChunkName: "my-agreement-cancellation" */ '@/views/mine/agreement/cancellation.vue')
        }
    ]
}

export default routes
