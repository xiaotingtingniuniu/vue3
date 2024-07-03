import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
// import About from '../components/About.vue'
import Home from '../views/Home.vue'
import News from '../views/News.vue'
import Detail from '../views/NewsContent.vue'
import About from '../views/About.vue'
//创建路由器
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),//路由器history模式（不带#）
  // history:createWebHashHistory(import.meta.env.BASE_URL),//路由器hash模式（带#）
  //设置路由规则：key：value
  routes: [
    {
      path: '/home',
      name: 'shouye',
      component: Home
    },
    {
      path: '/about',
      name: 'guanyu',
      component: About
    },
    {
      path: '/news',
      name: 'xinwen',
      component: News,
      children:[
        //1.query写法
        // {
        //   path:'detail',
        //   component:Detail
        // }

        
        //2.params写法
        // {
        //   path:'detail/:id/:title/:content?',//?表示该参数可传可不传
        //   name:'xiang',
        //   component:Detail
        // }//但是params是不能传数组和对象的


        // 3.路由配置的props写法
        {
          path:'detail/:id/:title/:content?',
          name:'xiang',
          component:Detail,
          //props 第一种写法：将路由收到的所有params参数作为props传给路由组件 （注意配合params使用）
          props:true
        }
        // {
        //   path:'detail',
        //   name:'xiang',
        //   component:Detail,
        //   //props 第二种写法：函数写法，自己决定将什么作为props传给路由组件  （注意配合query使用）
        //   props(route){
        //     return route.query
        //   }
        // }
        // {
        //   path:'detail/:id/:title/:content?',
        //   name:'xiang',
        //   component:Detail,
        //   //props 第三种写法：对象写法,自己决定将什么作props传给路由组件 (注意用的少并且配合query使用)
        //   props:{
        //     a:100,
        //     b:200,
        //     c:300
        //   }
        // }
      ]
    },
    {
      path:'/',
      redirect:'/home'
    }
  ]
})
//将路由器暴露出去
export default router
