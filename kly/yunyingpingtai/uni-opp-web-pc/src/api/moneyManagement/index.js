
import client from '@/utils/request'

// 获取资金管理列表
export const brokerageList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC10410435541880832',
        name: '提现结转管理查询',
        source: '分销系统',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 导出excel
export function exportDetails (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 导入Excel
export const getupdate = async (param) => {
    const res = await client.post('/api/api/uniter/v1/common/import', param)
    return res
}
