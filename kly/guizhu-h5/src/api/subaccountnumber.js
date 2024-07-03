import client from '@/api/axios'

// 上传图片
export async function uploadImage (formData) {
    const data = await client.post('/hzgApi/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        noLoading: -1
    })
    return data
}
// 子账号管理列表
export async function subLevelList (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/list', params)
    return data
}
// 子账号详情
export async function subLevelListDetails (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/info', params)
    return data
}
// 创建子账号
export async function addSubLevel (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/save', params)
    return data
}
// 修改子账号
export async function editSubLevel (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/update', params)
    return data
}
// 停用子账号
export async function endisable (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/disable', params, { noLoading: -1 })
    return data
}
// 获取子账号已绑定设备列表
export async function getBindDeviceList (params) {
    const data = await client.get('/hzgApi/v1/merchant/sub/v1/getBindDeviceList', { params })
    return data
}
// 获取柜主下未绑定的设备列表
export async function getUnbindDeviceList (params) {
    const data = await client.get('/hzgApi/v1/merchant/sub/v1/getUnbindDeviceList', { params })
    return data
}

// 获取柜主是否有收款能力
export async function getMerchantCollectAbility (params) {
    const data = await client.get('/hzgApi/v1/merchant/sub/v1/getMerchantCollectAbility', { params })
    return data
}
// 获取柜主下有收款能力运营商列表接口
export async function haveCollectOperator (params) {
    const data = await client.get('/hzgApi/v1/merchant/sub/v1/haveCollectOperator', { params })
    return data
}
// 解绑设备操作接口
export async function unbindDevice (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/unbindDevice', params)
    return data
}
// 解绑设备申请操作接口
export async function unbindDeviceApply (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/unbindDeviceApply', params)
    return data
}
// 绑定设备与运营商操作接口
export async function bindDeviceMerchant (params) {
    const data = await client.get('/hzgApi/v1/merchant/sub/v1/bindDeviceMerchant', { params })
    return data
}
// 审核设备解绑申请操作接口 >>>--------- 单独页面
export async function auditUnbindApply (params) {
    const data = await client.post('/hzgApi/v1/merchant/sub/v1/auditUnbindApply', params)
    return data
}
// 同意详情
export async function detailMsg (params) {
    const data = await client.post('/hzgApi/message/detail', params)
    return data
}

// 获取代运营商和合同货柜关系
export async function agentContractQuery (params) {
    const data = await client.post('/hzgApi/v1/merchant/equipment/v1/agentContract/query', params)
    return data
}

// 获取代运营商和合同货柜列表
export async function agentContractPointList (params) {
    const data = await client.post('/hzgApi/v1/merchant/equipment/v1/agentContractPointList', params)
    return data
}

// 添加代运营商和合同货柜关系
export async function addAgentContract (params) {
    const data = await client.post('/hzgApi/v1/merchant/equipment/v1/agentContract/add', params)
    return data
}
