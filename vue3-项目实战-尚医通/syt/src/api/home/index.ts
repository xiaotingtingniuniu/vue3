//统一管理首页模块接口
import http from "@/utils/http";
// 引入ts类型
import type { HospitalResponseData,HospitalLevelAndRegionResponseData,HospitalInforData } from "./type";
//通过枚举管理首页模块的地址
enum API {
    //获取已有的医院的数据接口地址
    HOSPITAL_URL = "/hosp/hospital/",
    //获取医院的等级与地区接口
    HOSPITALLEVELANDREGION_URL = "/cmn/dict/findByDictCode/",
    //根据医院的名字获取数据
    HSOPITALINFO_URL = "/hosp/hospital/findByHosname/"
}
//获取医院的数据
export const reqHospital=(page:number,limit:number,hostype:string='',districtCode:string='')=>http.get<any,HospitalResponseData>(`${API.HOSPITAL_URL}${page}/${limit}?hostype=${hostype}&districtCode=${districtCode}`);
//获取医院的等级或地区的数据
export const reqHospitalLevelAndRegion = (dictCode:string)=>http.get<any,HospitalLevelAndRegionResponseData>(`${API.HOSPITALLEVELANDREGION_URL}${dictCode}`);
//根据医院名字获取数据进行展示
export const reqHospitalInfor = (hosname:string) =>http.get<any,HospitalInforData>(`${API.HSOPITALINFO_URL}${hosname}`);