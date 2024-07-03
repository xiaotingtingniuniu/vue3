//引入二次封装的axios
import http from "@/utils/http"
import type {AddOrUpdateUser,SubmitOrderResponseData,GetOrderInforResponseData,CancelOrderResponseData,QrcodeResponseData,QueryPayStatusResponseData,GetUserInfoResponseData,UserParam,GetUserOrderInforResponseData,AllPatientResponseData,OrderStatusResponseData,CertationTypeResponseData,AddOrUpdatePatient} from '@/api/user/type'
import { id } from "element-plus/es/locale/index.js";
//枚举请求地址
enum API {
    //新增就诊人接口
    ADDUSER_URL="/user/patient/auth/save",
    //更新就诊人接口
    UPDATEUSER_URL="/user/patient/auth/update",
    //创建订单接口
    SUBMITORDER_URL="/order/orderInfo/auth/submitOrder/",
    //获取订单详情
    GETORDERINFOR_URL="/order/orderInfo/auth/getOrderInfo/",
    //取消订单详情
    CANCELORDER_URL="/order/orderInfo/auth/cancelOrder/",
    //获取订单支付二维码接口
    QRCODE_URL="/order/weixin/createNative/",
    //查询支付状态接口
    QUERYPAYSTATUS_URL="/order/weixin/queryPayStatus/",
    //获取会员信息接口
    GETUSERINFO_URL="/user/auth/getUserInfo",
    //会员认证的接口
    USERCERTATION_RUL="/user/auth/userAuah",
    //获取分页列表(订单列表数据)
    USERORDERINFOR_URL="/order/orderInfo/auth/",
    //获取所有就诊人接口
    ALLPATIENT_URL="/user/patient/auth/findAll",
    //获取订单状态接口
    OREDERSTATUS_URL="/order/orderInfo/auth/getStatusList",
    //获取证件的类型的接口地址
    CERTIFICATIONTYPE_URL = '/cmn/dict/findByDictCode/',
    //获取城市的接口
    CITY_URL = '/cmn/dict/findByParentId/',
    //新增就诊人接口
    ADDPATIENT_URL="/user/patient/auth/save",
    //修改就诊人接口
    UPDATEPATIENT_URL="/user/patient/auth/update",
    //删除就诊人接口
    REMOVEPATIENT_URL="/user/patient/auth/remove/"
}
//新增或修改已有的就诊人接口
export const reqAddVisitor = (data:AddOrUpdateUser) => {
    if(data.id){
        //更新就诊人
        return http.put<any,any>(API.UPDATEUSER_URL,data);
    }else{
        //新增就诊人
        return http.post<any,any>(API.ADDUSER_URL,data);
    }
};
//创建订单接口
export const reqSubmitOrder = (hoscode:string,scheduleId:string,patientId:number) => http.post<any,SubmitOrderResponseData>(`${API.SUBMITORDER_URL}${hoscode}/${scheduleId}/${patientId}`);
//获取订单详情接口
export const reqGetOrderInfor = (id:string)=>http.get<any,GetOrderInforResponseData>(`${API.GETORDERINFOR_URL}${id}`);
//取消订单接口
export const reqCancelOrder = (orderId:string)=>http.get<any,CancelOrderResponseData>(`${API.CANCELORDER_URL}${orderId}`);
//获取支付二维码接口
export const reqQrCode = (orderId:string)=>http.get<any,QrcodeResponseData>(`${API.QRCODE_URL}${orderId}`)
//查询支付状态接口
export const reqQueryPayStatus = (orderId:string)=>http.get<any,QueryPayStatusResponseData>(`${API.QUERYPAYSTATUS_URL}${orderId}`);
//获取会员信息接口
export const reqGetUserInfo = ()=>http.get<any,GetUserInfoResponseData>(`${API.GETUSERINFO_URL}`);
//会员认证接口
export const reqUserCertation =(data:UserParam)=>http.post<any,any>(`${API.USERCERTATION_RUL}`,data);
//获取订单分页列表数据接口
export const reqGetUserOrderInfor=(page:number,limit:number,patientId?:string,orderStatus?:string)=>http.get<any,GetUserOrderInforResponseData>(`${API.USERORDERINFOR_URL}${page}/${limit}?patientId=${patientId}&orderStatus=${orderStatus}`);
//获取所有就诊人接口
export const reqAllPatient=()=>http.get<any,AllPatientResponseData>(API.ALLPATIENT_URL);
//获取订单状态接口
export const reqOrderStatus=()=>http.get<any,OrderStatusResponseData>(API.OREDERSTATUS_URL);
//获取证件类型的方法
export const reqCertationType = (CertificatesType = 'CertificatesType') => http.get<any, CertationTypeResponseData>(`${API.CERTIFICATIONTYPE_URL}${CertificatesType}`);
//获取城市的数据的接口
export const reqCity = (parentId:string)=>http.get<any,any>(`${API.CITY_URL}${parentId}`);
//新增或更新就诊人接口
export const reqAddOrUpdatePatient = (data:AddOrUpdatePatient)=>{
    if(data.id){
        //更新就诊人接口
        return http.put<any,any>(API.UPDATEPATIENT_URL,data)
    }else{
        //新增就诊人接口
        return http.post<any,any>(API.ADDPATIENT_URL,data)
    }
}
//删除就诊人接口
export const reqRemovePatient = (id:number)=>http.delete<any,any>(`${API.REMOVEPATIENT_URL}${id}`)