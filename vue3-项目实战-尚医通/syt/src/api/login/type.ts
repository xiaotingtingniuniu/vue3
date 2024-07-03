// 定义login模块的ts数据类型
export interface ResponseData{
    code: number,
    message: string,
    ok: boolean
}
//用户登录接口需要携带参数类型
export interface UserLoginParamsData{
    phone:string,
    code:string
}
//登录接口返回的用户信息的数据类型
export interface UserInfor{
    name:string,
    token:string
}
//定义用户登录接口的返回数据类型
export interface UserLoginData extends ResponseData{
    data:UserInfor
}
//定义微信登录所需的数据类型
export interface WxLogin {
    redirectUri: string,
    appid: string,
    scope: string,
    state: string
}
//定义微信扫码接口返回的数据类型
export interface WxLoginResponseData extends ResponseData{
    data: WxLogin
}