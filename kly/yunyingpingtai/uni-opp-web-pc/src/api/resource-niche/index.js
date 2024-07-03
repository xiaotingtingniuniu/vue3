import client from '@/utils/request'

const proxyUrl = '/api'
const urlParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001004' // 业务线编号
}
export const hotGoodsSelect = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC1658220433169kEgQM',
        name: '查询资源位信息列表',
        source: '资源位中台',
        body: param
    })
    return client.post(`${proxyUrl}/api/uniter/v1/url/request`, params)
}

export const hotGoodsUpdata = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC1658220470341OIhXK',
        name: '修改资源信息',
        source: '资源位中台',
        body: param
    })
    return client.post(`${proxyUrl}/api/uniter/v1/url/request`, params)
}

export const hotGoodsAdd = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC1658220501543iIw9c',
        name: '添加资源位',
        source: '资源位中台',
        body: param
    })
    return client.post(`${proxyUrl}/api/uniter/v1/url/request`, params)
}
export const sukListSelect = (param) => {
    const params = Object.assign({
        appKey: 'A1001001',
        busiCode: 'A1001004',
        configCode: 'UC1657960236366FewPG',
        name: 'sku简单信息列表',
        source: '商品中台',
        body: param
    })
    return client.post(`${proxyUrl}/api/hot/sell/v1/product/list`, params)
}
