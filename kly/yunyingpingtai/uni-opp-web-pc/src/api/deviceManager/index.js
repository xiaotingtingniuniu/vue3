
import client from '@/utils/request'
const url = '/api/api/uniter/v1/url/request'
//  远程拍照
const remotePhotoUrl = '/api/api/device/v2/remote-photo'
// 获取设备异常状态
const abnormalStatesUrl = '/api/device/v2/abnormal-states'

export const keyCode = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001022' // 业务线编号
}
// 设备列表
export const devicetList = async (param, val) => {
    console.log(val)
    const params = {
        ...keyCode,
        ...val,
        body: param
    }
    return await client.post(url, params)
}

// 远程拍照

export const deviceRemotePhoto = async (params) => {
    const { data } = await client.post('/api/api/device/v2/remote-photo', params)
    return data
}
// 获取设备异常状态
export const deviceAbnormalStates = async (param, val) => {
    console.log(val)
    const params = {
        ...keyCode,
        ...val,
        body: param
    }
    return await client.post(abnormalStatesUrl, params)
}
