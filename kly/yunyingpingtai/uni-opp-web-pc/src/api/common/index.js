
import client from '@/utils/request'
import { REQUEST_PARAM } from './request-param'
import SPU from './spu'
import SUPPLY_CHAIN_GOODS from './supply-chain-goods'
import OPREATE from './operate'
import AUTHORITY from './authority'

const PARAMMODULE = {
    REQUEST_PARAM,
    SPU,
    SUPPLY_CHAIN_GOODS,
    OPREATE,
    AUTHORITY
}

// 公共请求接口
export const publicRequest = async (param) => {
    param = Object.assign({
        module: 'REQUEST_PARAM'
    }, param)
    const params = {
        appKey: PARAMMODULE[param.module][param.key].appKey || 'A1001000', // 系统编号
        busiCode: PARAMMODULE[param.module][param.key].busiCode || 'A1001000', // 业务线编号
        configCode: PARAMMODULE[param.module][param.key].configCode,
        name: PARAMMODULE[param.module][param.key].name,
        source: PARAMMODULE[param.module][param.key].source,
        body: Object.assign({
            appKey: PARAMMODULE[param.module][param.key].appKey, // 系统编号
            busiCode: PARAMMODULE[param.module][param.key].busiCode // 业务线编号
        }, param.body)
    }
    return client.post('/api/api/uniter/v1/url/request', params)
}
// spu申请单审批
export const spuApplyApprove = async (param) => {
    const params = {
        appKey: REQUEST_PARAM[param.key].appKey || 'A1001000', // 系统编号
        busiCode: REQUEST_PARAM[param.key].busiCode || 'A1001000', // 业务线编号
        configCode: REQUEST_PARAM[param.key].configCode,
        name: REQUEST_PARAM[param.key].name,
        source: REQUEST_PARAM[param.key].source,
        body: Object.assign({
            appKey: REQUEST_PARAM[param.key].appKey, // 系统编号
            busiCode: REQUEST_PARAM[param.key].busiCode // 业务线编号
        }, param.body)
    }
    return client.post('/api/goods/approval/spu/state/v4', params)
}

// 公共导出接口
export const publicExport = async (param) => {
    param = Object.assign({
        module: 'REQUEST_PARAM'
    }, param)
    const params = {
        appKey: PARAMMODULE[param.module][param.key].appKey || 'A1001000', // 系统编号
        busiCode: PARAMMODULE[param.module][param.key].busiCode || 'A1001000', // 业务线编号
        configCode: PARAMMODULE[param.module][param.key].configCode,
        name: PARAMMODULE[param.module][param.key].name,
        source: PARAMMODULE[param.module][param.key].source,
        exportType: 7,
        exportName: param.exportName || '',
        body: Object.assign({
            appKey: PARAMMODULE[param.module][param.key].appKey, // 系统编号
            busiCode: PARAMMODULE[param.module][param.key].busiCode // 业务线编号
        }, param.body)
    }
    // return client.post('/api/api/uniter/v1/common/export', params)
    const res = await client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data: params,
        responseType: 'blob'
    })
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}
