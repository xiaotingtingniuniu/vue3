import router from "./index"
import store from "../store/index"

router.beforeEach((to,from,next) =>{
    if(!store.state.UserToken){
        // 未登录  页面是否需要登录
        if(to.matched.length > 0 && !to.matched.some(record => record.meta.requiresAuth)){
            console.log('不需要访问权限');
            next();
        }else{
            console.log('需要访问权限,先去登录');
            next({
                path:"/login"
            })
        }
    }else{
        console.log('已经登录了');
        to.matched.some((record) => {
            console.log('record',record)
            return record.meta.requiresAuth
        })
        // 用户已经登录  路由的访问权限
        if(!store.state.permission.permissionList){
            store.dispatch("permission/FETCH_PERMISSION").then(() =>{
                next({
                    path:to.path
                })
            })
        }else{
            // store存在权限
            if(to.path !== "/login"){
                next();
            }else{
                next(from.fullPath)
            }
        }
    }
})