import client from '@/utils/request'
const urlParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}
export const getApplyList = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC1657597160608QIs5K',
        name: '获取店铺列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
export const shopApply = (param) => {
    const params = Object.assign({
        ...urlParam,
        configCode: 'UC23709838932754432',
        name: '店铺审核接口',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺管理页面-详情（1215三合一项目）
export const getshopDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC16575970133921nUrY',
        name: '获取店铺详情',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺审核页面-详情（1215三合一项目）
export const getprocessDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54265264392540160',
        name: '查看店铺申请记录详情',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺品类（1215三合一项目）
export const getstoreDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54699359155163136',
        name: '店铺可用品类',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺标签-详情（1215三合一项目）
export const getstoretypeDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54699359155163136',
        name: '店铺可用品类',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺管理页面-变更记录（1215三合一项目）
export const getRecordList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54266790301306880',
        name: '查看店铺变更记录',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 店铺管理页面-店铺更新标签名称（1215三合一项目）
export const shopUpdateLabel = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54265924307554304',
        name: '修改店铺标签',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺管理页面-店铺查询商户列表（1215三合一项目）
export const getMerList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC1657588823142wNsGY',
        name: '获取商户信息列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 店铺管理页面-新增店铺信息（1215三合一项目）
export const addStoreInfo = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54146133458972672',
        name: '创建店铺v3',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺管理页面-更新店铺信息（1215三合一项目）
export const updateStoreInfo = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54146437701201920',
        name: '更新店铺信息接口v2',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 店铺管理页面-详情店铺可用品类（1215三合一项目）
export const storeCategoryInfo = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54699359155163136',
        name: '店铺可用品类',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 地址解析
export async function getAddresss (params) {
    const res = await client.get('/ws/geocoder/v1', { params })
    return res
}
// 店铺管理页面-店铺是否可编辑（1215三合一项目）
export const shopCanEdit = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC58217586200760320',
        name: '是否可以编辑店铺',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺管理页面-店铺是否可编辑（1215三合一项目）
export const startStopStore = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UC23710343771766784',
        name: '停/启用店铺接口',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 统一接口post
export const unifiedGatewayPost = (param) => {
    return client.post('/api/api/uniter/v1/url/request', param)
}
// 统一接口get
export const unifiedGatewayGet = (param) => {
    return client.get('/api/api/uniter/v1/url/request', { param })
}
