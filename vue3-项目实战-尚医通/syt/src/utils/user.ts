//本地存储操作用户信息的方法
export const SET_USERINFOR = (userInfor:string) => {
    return localStorage.setItem('UserInfor',userInfor);
}
export const GET_USERINFOR = () => {
    return localStorage.getItem('UserInfor');
}
//清除本地存储用户的相关信息
export const REMOVE_USERINFOR = () => {
    return localStorage.removeItem('UserInfor');
}