import { RouterView } from 'vue-router'

const routes = {
    path: '/register',
    name: 'register',
    redirect: '/home',
    component: RouterView,
    children: [
        {
            path: 'login',
            name: 'login',
            meta: {
                title: '登录'
            },
            component: () => import(/* webpackChunkName: "register-login" */ '@/views/login/index.vue')
        },
        {
            path: 'login-msg',
            name: 'login-msg',
            props: true,
            meta: {
                title: '验证码'
            },
            component: () => import(/* webpackChunkName: "register-login-msg" */ '@/views/login/msg/index.vue')
        }
    ]
}

export default routes
