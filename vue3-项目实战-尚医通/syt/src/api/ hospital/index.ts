//统一管理医院详情页接口
//引入二次封装的axios
import http from '@/utils/http.ts'
//引入ts类型
import type {HospitalDetailData,HospitalDepartmentData,PhoneCodeData,HospitalWorkResponseData,HospitalWorkDateResponseData,UserResponseData,DoctorInforResponseData} from './type'
//枚举请求的地址
enum API {
    //获取医院详情地址
    HOSPITALDETAIL_URL="/hosp/hospital/",
    //获取某个医院科室的地址
    HOSPITALDEPARTMENT_URL="/hosp/hospital/department/",
    //获取验证码接口地址
    GETUSERCODE_URL='/sms/send/',
    //获取某一个医院的某一个科室的挂号数据
    HOSPITALWORK_URL='/hosp/hospital/auth/getBookingScheduleRule/',
    //获取医院医生排班接口地址
    HOSPITALWORKDATE_URL='/hosp/hospital/auth/findScheduleList/',
    //获取某一账号下就诊人的信息列表
    GETUSER_URL = '/user/patient/auth/findAll',
    //获取排班医生的信息
    GETDOCTOR_URL = '/hosp/hospital/getSchedule/',
}
//获取医院详情的接口
export const reqHospitalDetail = (hoscode:string)=>http.get<any,HospitalDetailData>(`${API.HOSPITALDETAIL_URL}${hoscode}`);
//获取某个医院科室的接口
export const reqHospitalDepartment = (hoscode:string)=>http.get<any,HospitalDepartmentData>(`${API.HOSPITALDEPARTMENT_URL}${hoscode}`)
//获取验证码的接口
export const reqCode = (phone:string)=>http.get<any,PhoneCodeData>(`${API.GETUSERCODE_URL}${phone}`)
//获取某个医院的某一个科室的挂号数据接口
export const reqHospitalWork = (page:number,limit:number,hoscode:string,depcode:string)=>http.get<any,HospitalWorkResponseData>(`${API.HOSPITALWORK_URL}${page}/${limit}/${hoscode}/${depcode}`)
//获取医院医生排班接口
export const reqHospitalWorkDate = (hoscode:string,depcode:string,workDate:string)=>http.get<any,HospitalWorkDateResponseData>(`${API.HOSPITALWORKDATE_URL}${hoscode}/${depcode}/${workDate}`)
//获取某一个账号下就诊人的信息列表接口
export const reqGetUser = ()=>http.get<any,UserResponseData>(API.GETUSER_URL);
//获取挂号医生信息
export const reqGetDoctorInfor = (scheduleId:string)=>http.get<any,DoctorInforResponseData>(`${API.GETDOCTOR_URL}${scheduleId}`);