//统一管理登录接口
//引入二次封装的axios
import http from '@/utils/http'
//引入ts类型
import type {UserLoginParamsData,UserLoginData,WxLoginResponseData} from '@/api/login/type'
//枚举接口地址
enum API {
    USERLOGIN_URL = '/user/login',//用户登录接口
    WXLOGIN_URl = '/user/weixin/getLoginParam',//获取微信扫码登录需要的参数接口
}
//用户登录接口
export const reqUserLogin = (data:UserLoginParamsData)=>http.post<any,UserLoginData>(API.USERLOGIN_URL,data);
//获取微信扫码登录生成二维码需要参数接口
export const reqWeLogin = (wxRedirectUri:string) => http.get<any,WxLoginResponseData>(`${API.WXLOGIN_URl}?wxRedirectUri=${wxRedirectUri}`);
