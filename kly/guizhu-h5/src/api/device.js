import client from '@/api/axios'
// 设备列表
export const getDeviceList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/list',
        method: 'post',
        data
    })
}

// 设备详情
export const getDeviceDetail = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/info',
        method: 'post',
        data
    })
}

// 安装位置列表
export const getDeviceSeat = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/seat/v1/list',
        method: 'post',
        data
    })
}
// 安装位置新增接口
export const getDeviceAddSeat = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/addSeat',
        method: 'post',
        data
    })
}

// 场所类型字典接口
export const getDevicePlaceType = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/placeType',
        method: 'post',
        data
    })
}

// 远程锁定
export const getDeviceLock = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/lock',
        method: 'post',
        data
    })
}

// 重启设备
export const getDeviceRestart = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/restart',
        method: 'post',
        data
    })
}

// 远程开门
export const getDeviceOpen = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/open',
        method: 'post',
        data
    })
}

// 设备提锁
export const getDeviceLiftingLock = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/liftingLock',
        method: 'post',
        data
    })
}

// 设备解绑
export const getDeviceUnBind = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/unbind',
        method: 'post',
        data
    })
}
// 激活设备
export const getDeviceBind = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/bind',
        method: 'post',
        data
    })
}
// 远程拍摄
export const getRemoteShot = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/remoteShot',
        method: 'post',
        data
    })
}
// 查询省市区
export const getAreaList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/areaList',
        method: 'post',
        data
    })
}

// 设备审批单列表
export const getApproveList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/approveList',
        method: 'post',
        data
    })
}

// 设备审批单详情
export const getApproveDetail = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/approveDetail',
        method: 'post',
        data
    })
}

// 柜主列表
export const getMerchantList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/getMerchantList',
        method: 'post',
        data
    })
}

// 厂商列表
export const getFirmList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/firmList',
        method: 'post',
        data
    })
}

// 厂商端录入设备
export const getMerchantInput = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/input',
        method: 'post',
        data
    })
}

// 合同编号列表
export const getAgreementList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/agreementList',
        method: 'post',
        data
    })
}

// 点位编号列表
export const getPointList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/pointList',
        method: 'post',
        data
    })
}

// 扫一扫
export const getScanCodeInfo = (params) => {
    return client({
        url: '/hzgApi/scan/getScanCodeInfo',
        method: 'get',
        params
    })
}

//  安装位置修改
export const updateSeat = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/updateSeat',
        method: 'post',
        data
    })
}

//  制冷控制
export const getPowerMode = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/powerMode',
        method: 'post',
        data
    })
}

//  历史信号
export const getSingle = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/history',
        method: 'post',
        data
    })
}

//  设备信息修改
export const equiUpdate = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/update',
        method: 'post',
        data
    })
}

//  音量调节
export const volumeCtrl = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/volumeCtrl',
        method: 'post',
        data
    })
}

// 获取设备信息  code和name
export const getDeviceInfos = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/base',
        method: 'post',
        data
    })
}

// 扫码控制柜主查看权限
export const getCabinetDevice = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/getCabinetDevice',
        method: 'post',
        data
    })
}

// 工单详情-远程拍照异常
export const getWorkOrderShoot = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/workOrder/shoot',
        method: 'post',
        data
    })
}

// 工单详情-设备离线异常
export const getWorkOrderOffLine = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/workOrder/offLine',
        method: 'post',
        data
    })
}

// 工单详情-位置变更异常
export const getPositionChange = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/workOrder/positionChange',
        method: 'post',
        data
    })
}

// 工单详情-位置变更异常
export const getDeviceStates = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/states',
        method: 'post',
        data
    })
}

// 根究跟某deviceco查询安装位置
export const getDeviceCodeSeat = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/state',
        method: 'post',
        data
    })
}

// 获取合同列表
export const getContractList = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v2/contractList',
        method: 'post',
        data
    })
}

// 获取点位列表
export const getPointListNew = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v2/pointList',
        method: 'post',
        data
    })
}
// 设备详情-> 温度制冷控制查询接口
export const getPowerModeConfig = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/powerModeConfig',
        method: 'post',
        data
    })
}
// 工单详情-温度
export const getTemperatureStatus = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/queryTemperatureStatus',
        method: 'post',
        data
    })
}

// 工单详情-获取设备最新状态-刷新
export const getRefreshEquipmentStatus = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/refreshEquipmentStatus',
        method: 'post',
        data
    })
}

// 工单详情-门锁状态
export const getDoorLockStatus = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/queryDoorLockStatus',
        method: 'post',
        data
    })
}

// 工单详情-摄像头状态
export const getCameraWorkOrderStatus = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/queryCameraWorkOrderStatus',
        method: 'post',
        data
    })
}
// 远程开门前判断用户身份接口
export const openCheck = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/openCheck',
        method: 'post',
        data
    })
}
// 发送手机验证码接口接口
export const sendSmsEquipment = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/sendSmsEquipment',
        method: 'post',
        data
    })
}
// 验证 验证码是否正确接口
export const checkSmsCode = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/verifyCodeEquipment',
        method: 'post',
        data
    })
}

// 设备列表- 货柜筛选项统计信息列表查询
export const getStatisticsOptions = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/queryStatisticsOptions',
        method: 'post',
        data
    })
}

// 恒掌柜设备数量统计
export const getDeviceStatics = (data) => {
    return client({
        url: '/hzgApi/v1/merchant/equipment/v1/statistics',
        method: 'post',
        data
    })
}
