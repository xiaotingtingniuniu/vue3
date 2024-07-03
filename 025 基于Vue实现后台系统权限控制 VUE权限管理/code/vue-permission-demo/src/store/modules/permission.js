import { fetchPermission } from "../../api/index"
import router,{ DynamicRoutes } from "../../router/index" //准备动态加载的路由（根路由）
import dynamicRouter from "../../router/dynamic-router"//后端请求来的需要判断权限的路由
import { recursionRouter,setDefaultRoute } from "../../utils/recursion-router"//两个筛选路由的方法

export default {
    namespaced:true,
    state:{
        permissionList:null,
        sidebarMenu:[],// 导航菜单
        currentMenu:'' // 高亮
    },
    getters:{},
    mutations:{
        SET_PERMISSION(state,routes){
            console.log("state",state);
            console.log('routes',routes);
            state.permissionList = routes;
        },
        CLEAR_PERMSSION(state){
            state.permissionList = null;
        },
        SET_MENU(state,menu){
            state.sidebarMenu = menu;
        },
        CLEAR_MENU(state){
            state.sidebarMenu = []
        }
    },
    // 异步访问
    actions:{
        async FETCH_PERMISSION({ commit,state }){
            let permissionList = await fetchPermission();
            // 筛选数组的方法：recursionRouter 接口获取到的数据:permissionList 本地路由：dynamicRouter
            let routes = recursionRouter(permissionList,dynamicRouter);
            let MainContainer = DynamicRoutes.find(v => v.path === "/");
            console.log('MainContainer',MainContainer);
            let children = MainContainer.children;
            children.push(...routes);
            console.log('MainContainer',MainContainer);

            // 生成菜单
            commit("SET_MENU",children);

            // 设置默认路由
            setDefaultRoute([MainContainer]);
            // 初始化路由
            let initialRoutes = router.options.routes;
            console.log("DynamicRoutes",DynamicRoutes);
            router.addRoutes(DynamicRoutes);
            commit("SET_PERMISSION",[ ...initialRoutes , ...DynamicRoutes])
        }
    }
}