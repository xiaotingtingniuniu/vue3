import type {HospitalDetail,HospitalDepartmentArr} from '@/api/ hospital/type'
import type { UserInfor } from '@/api/login/type'
//定义仓库内部存储数据state的ts类型
//医院详情的state数据类型
export interface DetailState{
    hospitalInfo:HospitalDetail,
    hospitalDepartment:HospitalDepartmentArr
}
//用户的state数据类型
export interface UserState{
    dialogFormVisible:boolean,//用于控制dialog的显示与隐藏
    code:string,//存储用户获取到的验证码
    userInfor:UserInfor,//存储用户信息
}