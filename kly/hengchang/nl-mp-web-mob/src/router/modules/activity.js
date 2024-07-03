import { RouterView } from 'vue-router'

const routes = {
    path: '/fission',
    name: 'fission',
    component: RouterView,
    children: [
        {
            path: 'invite-friends',
            name: 'invite-friends',
            meta: {
                title: '邀请好友得奖励'
            },
            component: () => import(/* webpackChunkName: "fission-invite-friends" */ '@/views/activity/fission/invite-friends/index.vue')
        },
        {
            path: 'invite-register/:code',
            name: 'invite-register',
            props: true,
            meta: {
                title: '注册'
            },
            component: () => import(/* webpackChunkName: "fission-invite-register" */ '@/views/activity/fission/register')
        },
        {
            path: 'invite-receive-result/:code',
            name: 'invite-receive-result',
            meta: {
                title: '领取结果'
            },
            component: () => import(/* webpackChunkName: "fission-invite-receive-result" */ '@/views/activity/fission/receive-result')
        },
        {
            path: 'explain-invite',
            name: 'explain-invite',
            meta: {
                title: '邀请方活动说明'
            },
            component: () => import(/* webpackChunkName: "fission-explain-invite" */ '@/views/activity/fission/explain/invite.vue')
        },
        {
            path: 'explain-invited',
            name: 'explain-invited',
            meta: {
                title: '被邀请方活动说明'
            },
            component: () => import(/* webpackChunkName: "fission-explain-invited" */ '@/views/activity/fission/explain/invited.vue')
        }
    ]
}

export default routes
