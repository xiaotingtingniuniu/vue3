//路由鉴权：就是路由能不能被访问到权限设置==>通过全局守卫完成
//引入路由器
import router from './ruoter'
//引入进度条
import NProgress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
import useUserStore from './store/modules/user';
//引入pinia仓库
import pinia from "@/store"
const userStore = useUserStore(pinia);
//存储用户未登录可以访问路由的路径
const whiteList = ['/home','/hospital/register','/hospital/detail','/hospital/notice','/hospital/close','/hospital/search'];
//不展示进度条的加载小圆球
NProgress.configure({ showSpinner: false });
//添加相应的全局守卫
//前置守卫
router.beforeEach((to,from,next)=>{
    //访问路由组件之前，进度条开始动
    NProgress.start();
    console.log('to',to);
    //动态设置网页左上角的标题
    document.title =  `尚医通-${to.meta.title}`
    //根据token判断用户是否登录
    const token = userStore.userInfor.token;
    if(token){
        //登录了
        next();
    }else{
        //没登录
        if(whiteList.includes(to.path)){
            //无需登录就可以访问
            next();
        }else{
            //登录组件显示出来 需要先登录
            userStore.dialogFormVisible = true;
            next({path:'/home',query:{redirect:to.fullPath}});
        }
    }
});
//后置守卫
router.afterEach((to,from)=>{
    //访问路由组件成功，进度条消失
    NProgress.done()

})