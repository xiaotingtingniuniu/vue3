//定义首页模块的ts数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}
//代表已有医院数据的ts类型
export interface Hospital {
    id: string,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {
        fullAddress: string,
        hostypeString: string,
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
    route: string,
    status: number,
    bookingRule: {
        cycle: number,
        quitDay: number,
        quitTime: string,
        releaseTime: string,
        rule: string[],
        stopTime: string
    }
}
//存储全部已有医院的数组类型
export type Content = Hospital[];
//获取已有医院接口返回的数据ts类型
export interface HospitalResponseData extends ResponseData {
    data: {
        content: Content,
        pageable: {
            sort: {
                sorted: boolean,
                unsorted: boolean,
                empty: boolean
            },
            pageNumber: number,
            pageSize: number,
            offset: number,
            paged: boolean,
            unpaged: boolean
        },
        totalPages: number,
        totalElements: number,
        last: boolean,
        first: boolean,
        sort: {
            sorted: boolean,
            unsorted: boolean,
            empty: boolean,
        },
        numberOfElements: number,
        size: number,
        number: number,
        empty: boolean,
    }
}
//医院等级或地区数据的ts类型
export interface HospitalLevelAndRegion {
    id: number,
    createTime: string,
    updateTime: string,
    isDeleted: number,
    param: {},
    parentId: number,
    name: string,
    value: string,
    dictCode: string,
    hasChildren: boolean
}
//医院等级或地区数据的数组ts类型
export type HospitalLevelAndRegionArr =HospitalLevelAndRegion[]; 
//获取等级或者医院地址接口返回的数据类型
export interface HospitalLevelAndRegionResponseData extends ResponseData{
    data:HospitalLevelAndRegionArr;
}
//定义接口返回的医院名字获取数据的类型
export interface HospitalInforData extends ResponseData {
    data:Content
}