import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import KeepView from '../views/KeepView.vue'
import WatchView from '../views/WatchView.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/keep',
    name: 'keep',
    component: KeepView
  },  
  {
    path: '/watch',
    name: 'watch',
    component: WatchView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
