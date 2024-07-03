// 对于axios函数库进行二次封装
/**
 * 二次封装的目的：
 * 1:利用axios请求、响应拦截器功能
 * 2:请求拦截器，一般可以在请求头中携带公共参数：token
 * 3:响应拦截器，可以简化服务器返回的数据，并且可以处理http网络错误
 */
import axios from 'axios'
import { ElMessage } from 'element-plus'
//引入用户仓库
import useUserStore from '@/store/modules/user'
//利用axios.create方法创建一个axios实例，可以设置基础路径、超时的时间设置
const http = axios.create({
    // baseURL: '/api',//请求的基础路径设置
    baseURL:'/api',
    timeout: 5000,//超时的时间设置，超出5s请求就是失败的
    // headers:{"Accept": "application/json"}
});
//请求拦截器
http.interceptors.request.use((config) => {
    console.log('config',config);
    // 请求拦截器成功的回调
    //config:请求拦截器回调注入的对象（配置对象），配置对象的最重要的是header属性
    //可以通过请求头携带公共参数 -token
    //获取用户仓库
    let userStore = useUserStore();
    const {token} = userStore.userInfor;
    console.log('token',token);
    if(token){
        //如果存在token表示已经登录,需要在请求头中加入
        config.headers.token = token;
    }
    return config;
},error=>{
    ElMessage({
        type:"error",
        message:error.message
    });
    return Promise.reject(new Error(error.message));
});
//响应拦截器
http.interceptors.response.use((response) => {
    console.log('response',response);
    //响应拦截器成功的回调，一般会进行数据简化
    return response.data;
}, (error) => {
    console.log('error', error);
    //响应拦截器失败的回调（返回的状态码不为200的时候），一般处理http网络错误
    let status = error.response.status;
    switch (status) {
        case 400:
            ElMessage({
                type: "error",
                message: "请求错误"
            });
            break;
        case 401:
            ElMessage({
                type: "error",
                message: "未授权，请登录"
            });
            break;
        case 403:
            ElMessage({
                type: "error",
                message: "拒绝访问"
            });
            break;
        case 404:
            //提示错误信息
            ElMessage({
                type: "error",
                message: `请求地址出出错:${error.response.config.url}`
            })
            break;
        case 408:
            ElMessage({
                type: "error",
                message: "请求超时"
            });
            break;
        case 500:
            ElMessage({
                type: "error",
                message: "服务器内部错误"
            });
            break;
        case 501:
            ElMessage({
                type: "error",
                message: "服务未实现"
            });
            break;
        case 502:
            ElMessage({
                type: "error",
                message: "网关错误"
            });
            break;
        case 503:
            ElMessage({
                type: "error",
                message: "服务不可用"
            });
            break;
        case 504:
            ElMessage({
                type: "error",
                message: "网关超时"
            });
            break;
        case 505:
            ElMessage({
                type: "error",
                message: "HTTP版本不受支持"
            });
            break;
        default:
            break;
    }
    return Promise.reject(new Error(error.message));
});
//对外暴露axios
export default http;
