import { type } from "os"

//定义医院详情页模块的ts数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//医院详情数据
export interface HospitalDetail {
    bookingRule: {
        cycle: number,
        releaseTime: string,
        stopTime: string,
        quitDay: number,
        quitTime: string,
        rule: [
            string
        ]
    },
    hospital: {
        id: string,
        createTime: string,
        updateTime: string,
        isDeleted: number,
        param: {
            hostypeString: string,
            fullAddress: string
        },
        hoscode: string,
        hosname: string,
        hostype: string,
        provinceCode: string,
        cityCode: string,
        districtCode: string,
        address: string,
        logoData: string,
        intro: string,
        status: number,
        bookingRule: null
    }
}
//医院详情返回数据ts
export interface HospitalDetailData extends ResponseData {
    data: HospitalDetail
}
//医院科室数据
export interface HospitalDepartment {
    depcode: string,
    depname: string,
    children?: HospitalDepartment[]
}
//存储科室数组类型
export type HospitalDepartmentArr = HospitalDepartment[]
//某个医院科室返回数据ts
export interface HospitalDepartmentData extends ResponseData {
    data: HospitalDepartmentArr
}
//获取验证码返回数据
export interface PhoneCodeData extends ResponseData {
    data: string
}
// 挂号数据
export interface bookingScheduleList {
    workDate: string,
    workDateMd: string,
    dayOfWeek: string,
    docCount: number,
    reservedNumber: number,
    availableNumber: number,
    status: number
}
//挂号数组数据
export type bookingScheduleListArr = bookingScheduleList[];
//挂号的医院基本信息类型
export interface baseMap {
    workDateString: string,
    releaseTime: string,
    bigname: string,
    stopTime: string,
    depname: string,
    hosname: string
}
//医院的科室挂号数据ts
export interface HospitalWork {
    total: number,
    bookingScheduleList: bookingScheduleListArr,
    baseMap: baseMap
}
//某医院的某科室的挂号返回的数据ts
export interface HospitalWorkResponseData extends ResponseData {
    data: HospitalWork
}
//排班医生数据ts
export interface Doctor {
    id: string,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
       dayOfWeek: string,
       depname: string,
       hosname: string
    },
    hoscode: string,
    depcode: string,
    title: string,
    docname: string,
    skill: string,
    workDate: string,
    workTime: number,
    reservedNumber: number,
    availableNumber: number,
    amount: number,
    status: number,
    hosScheduleId: string
}
//排班医生数组ts
export type DoctorArr = Doctor[];
//医院医生排班接口返回的数据ts
export interface HospitalWorkDateResponseData extends ResponseData {
    data: DoctorArr
}

//代表的是一个就诊人数据ts类型
export interface User {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "isDeleted": number,
    "param": {
        "certificatesTypeString": string,
        "contactsCertificatesTypeString": string,
        "cityString": null,
        "fullAddress": string,
        "districtString": null,
        "provinceString": null
    },
    "userId": number,
    "name": string,
    "certificatesType": string,
    "certificatesNo": string,
    "sex": number,
    "birthdate": string,
    "phone": string,
    "isMarry": number,
    "provinceCode": null,
    "cityCode": null,
    "districtCode": null,
    "address": string,
    "contactsName": string,
    "contactsCertificatesType": string,
    "contactsCertificatesNo": string,
    "contactsPhone": string,
    "isInsure": number,
    "cardNo": null,
    "status": string
}
export type UserArr = User[];
export interface UserResponseData extends ResponseData {
    data: UserArr
}


//获取某一个挂号医生信息的返回的数据类型
export interface DoctorInforResponseData extends ResponseData {
    data:Doctor
}