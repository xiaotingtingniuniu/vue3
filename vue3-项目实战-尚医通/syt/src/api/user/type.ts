export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//创建订单返回的数据类型
export interface SubmitOrderResponseData extends ResponseData {
    data: number
}
//新增与修改已有的就诊人参数的数据ts类型
export interface AddOrUpdateUser {
    id?: string,
    name: string,
    certificatesType: string,
    certificatesNo: string,
    sex: number,
    birthdate: string,
    phone: string,
    isMarry: number,
    isInsure: number,
    addressSelected: string[],
    address: string,
    contactsName: string,
    contactsCertificatesType: string,
    contactsCertificatesNo: string,
    contactsPhone: string
}
//获取订单详情数据类型
export interface GetOrderInfor {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        orderStatusString: string
    },
    userId: number,
    outTradeNo: string,
    hoscode: string,
    hosname: string,
    depcode: string,
    depname: string,
    scheduleId: string,
    title: string,
    reserveDate: string,
    reserveTime: number,
    patientId: number,
    patientName: string,
    patientPhone: string,
    hosRecordId: string,
    number: number,
    fetchTime: string,
    fetchAddress: string,
    amount: number,
    quitTime: string,
    orderStatus: number
}
//获取订单详情接口返回的数据类型
export interface GetOrderInforResponseData extends ResponseData {
    data: GetOrderInfor
}
//取消订单接口返回数据类型
export interface CancelOrderResponseData extends ResponseData {
    data: boolean
}
//获取支付二维码接口数据类型
export interface Qrcode {
    codeUrl: string,
    orderId: number,
    totalFee: number,
    resultCode: string
}
//获取支付二维码接口返回数据类型
export interface QrcodeResponseData extends ResponseData {
    data: Qrcode
}
//查询支付状态接口返回数据类型
export interface QueryPayStatusResponseData extends ResponseData {
    data: boolean
}
//获取会员信息数据类型
export interface GetUserInfo {
    id: string,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {},
    openid: null,
    nickName: null,
    phone: string,
    name: string,
    certificatesType: string,
    certificatesNo: string,
    certificatesUrl: null,
    authStatus: number,
    status: number
}
//获取会员信息接口返回的数据类型
export interface GetUserInfoResponseData extends ResponseData {
    data: GetUserInfo
}
//会员认证需要携带的参数类型
export interface UserParam {
    certificatesNo: string,
    certificatesType: string,
    certificatesUrl: string,
    name: string
}

//订单列表数据类型
export interface UserOrderInfor {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        orderStatusString: string
    },
    userId: number,
    outTradeNo: string,
    hoscode: string,
    hosname: string,
    depcode: string,
    depname: string,
    scheduleId: null,
    title: string,
    reserveDate: string,
    reserveTime: number,
    patientId: number,
    patientName: string,
    patientPhone: string,
    hosRecordId: string,
    number: number,
    fetchTime: string,
    fetchAddress: string,
    amount: number,
    quitTime: string,
    orderStatus: number
}
//订单列表数据类型数组
export type UserOrderInforArr = UserOrderInfor[];
//订单列表返回的数据类型
export interface GetUserOrderInforResponseData extends ResponseData {
    data: {
        records: UserOrderInforArr,
        total: number,
        size: number,
        current: number,
        orders: [],
        hitCount: boolean,
        searchCount: boolean,
        pages: number
    }
}
//就诊人ts类型
export interface Patient {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        certificatesTypeString: string,
        contactsCertificatesTypeString: string,
        cityString: null,
        fullAddress: string,
        districtString: null,
        provinceString: null
    },
    userId: number,
    name: string,
    certificatesType: string,
    certificatesNo: string,
    sex: number,
    birthdate: string,
    phone: string,
    isMarry: number,
    provinceCode: null,
    cityCode: null,
    districtCode: null,
    address: string,
    contactsName: string,
    contactsCertificatesType: string,
    contactsCertificatesNo: string,
    contactsPhone: string,
    isInsure: number,
    cardNo: null,
    status: string
}
//全部就诊人数组的ts类型
export type AllPatient = Patient[];
//获取就诊人信息接口返回的数据类型
export interface AllPatientResponseData extends ResponseData {
    data: AllPatient
}
//订单状态的数据类型
export interface OrderStatus {
    comment: string,
    status: number
}
//订单状态的数组
export type OrderStatusArr = OrderStatus[];
//订单状态接口返回的数据类型
export interface OrderStatusResponseData extends ResponseData {
    data: OrderStatusArr
}
//代表证件类型的数据ts
export interface CertationType {
    "id": number,
    "createTime": string,
    "updateTime": string,
    "isDeleted": number,
    "param": {

    },
    "parentId": number,
    "name": string,
    "value": string,
    "dictCode": string,
    "hasChildren": boolean
}
//证件类型的数组
export type CertationArr = CertationType[];
//获取证件类型接口返回数据的类型
export interface CertationTypeResponseData extends ResponseData {
    data: CertationArr
}
//城市信息的数据类型
export interface CityInfor {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {},
    parentId: number,
    name: string,
    value: string,
    dictCode: null,
    hasChildren: boolean
}
//城市信息数组
export type CityArr = CityInfor[]
//获取城市信息数据接口返回的数据类型
export interface CityInforResponseData extends ResponseData {
    data: CityArr
}
//新增与修改已有的就诊人参数的数据类型
export interface AddOrUpdatePatient {
    id?: string,
    name: string,
    certificatesType: string,
    certificatesNo: string,
    sex: number,
    birthdate: string,
    phone: string,
    isMarry: number,
    isInsure: number,
    addressSelected:string[],
    address: string,
    contactsName: string,
    contactsCertificatesType: string,
    contactsCertificatesNo: string,
    contactsPhone: string
}