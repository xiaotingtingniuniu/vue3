//定义用户相关的仓库
import { defineStore } from "pinia";
//引入获取验证码axious的方法
import {reqCode} from '@/api/ hospital/index'
//引入登录的axios方法
import { reqUserLogin } from "@/api/login";
//引入用户登录的数据类型
import type { UserLoginParamsData,UserLoginData, UserInfor } from '@/api/login/type'
//引入用户state的数据类型
import type {UserState} from '@/store/modules/interface/index'
//引入存储和获取、清空持久化用户信息的方法(localStorage)
import { GET_USERINFOR, SET_USERINFOR, REMOVE_USERINFOR } from "@/utils/user";
const useUserStore = defineStore('User',{
    state:():UserState => {
        return{
            dialogFormVisible:false,//用于控制dialog的显示与隐藏
            code:'',//存储用户获取到的验证码
            userInfor:(JSON.parse(GET_USERINFOR() as string)||{}) as UserInfor,//存储用户信息
        } 
    },
    actions:{
        //获取验证码的方法
        async getCode(phone:string){
            const result = await reqCode(phone);
            console.log('result',result);
            if(result.code === 200){
                this.code = result.data;
                return 'ok'
            }else{
                return Promise.reject(new Error(result.message));
            }
        },
        //用户手机号码登录的方法
        async userLogin(paramsData:UserLoginParamsData){
            const result:UserLoginData = await reqUserLogin(paramsData);
            console.log('result',result);
            if(result.code===200){
                this.userInfor = result.data;
                //本地存储持久化存储用户信息
                SET_USERINFOR(JSON.stringify(this.userInfor));
                //返回一个成功的Promise
                return 'ok';
            }else{
                return Promise.reject(new Error(result.message));
            }
        },
        //退出登录的方法
        async logOut(){
            //清除仓库存储的用户信息
            this.userInfor = {name:'',token:''};
            //清除本地存储的用户信息
            REMOVE_USERINFOR();
        },
        //查寻微信扫码接口（看本地是否存储数据）
        queryState(){
            //开启定时器，每隔一段时间问本地是否存储用户信息
            const timer = setInterval(()=>{
                if(GET_USERINFOR()){
                    //本地存储有数据：扫码成功
                    //关闭对话框
                    this.dialogFormVisible=false;
                    //将本地存储的数据存储到store中
                    this.userInfor = JSON.parse(GET_USERINFOR() as string);
                    //清除定时器
                    clearInterval(timer);
                }
            },1000)
            console.log('查询微信扫码登录是否存储了本地用户信息');
        }
    },
    getters:{

    }
});
//将仓库对外暴露
export default useUserStore;