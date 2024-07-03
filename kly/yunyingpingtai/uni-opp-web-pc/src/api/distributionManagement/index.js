
import client from '@/utils/request'
const questUrl = '/api/api/uniter/v1/url/request'

// 类目费率配置列表
export const distributionRatioList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126422036480',
        name: '分佣费率列表查询接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}
// 类目费率列表新增接口
export const updateList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126359121920',
        name: '分佣费率新增接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}
// 类目费率列表修改接口
export const saveList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126405259264',
        name: '分佣费率修改接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}

// 类目费率列表导出接口
export function exportDetails (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}

// 分佣比例查询接口--列表
export const proportionList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126484951040',
        name: '团长分佣列表查询接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}
// 分佣比例配置接口--新增
export const proportionConfig = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126451396608',
        name: '团长分佣比例配置接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}

// 分佣比例修改接口--修改
export const proportionConfigModif = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10018126463979520',
        name: '团长分佣比例修改接口',
        source: '分销系统',
        body: param
    }
    const res = await client.post(questUrl, params)
    return res
}
