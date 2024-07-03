import client from '@/utils/request'

// 商户统一接口
export async function getMerchantList (params) {
    const { data, code, count } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 商户统一接口
export function publicRequest (params) {
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 商户统一接口
export async function getenMerchantList (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}
// 商户统一接口 不解构
export async function getMerchantListCode (params) {
    const data = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 库存查询
export async function getInventoryList (params) {
    const { data } = await client.post('api/stock/channel/admin/v2/list', params)
    return data
}

// 价格列表
export async function getPriceList (params) {
    const { data } = await client.post('/api/api/product/price/v1/merchant/list', params)
    return data
}

// 原价管理

export async function getoriginalpriceList (params) {
    const { data } = await client.post('/api/api/product/price/v1/product/list', params)
    return data
}

export async function getAllMerchantList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}
// 上传图片
export async function update (params) {
    const { data } = await client.post('/api/api/common/file', params)
    return data
}

// 上传excel
export async function getupdate (params) {
    const res = await client.post('/api/api/uniter/v1/common/file/upload', params)
    return res
}

// 导出
// export async function exportCommon (params) {
//     const res = await client.post('/api/api/uniter/v1/common/export', params)
//     return res
// }

export function exportCommon (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}

// sku详情页
export async function skuDetails (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// sku修改详情页
export async function skuModify (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// sku创建页面
export async function skuCreate (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 地图请求
export async function skuMap (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 上下架接口请求
export async function skuUpDown (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 一级渠道查询
export async function oneLevel (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 二级渠道查询
export async function twoLevel (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 统一请求
export async function getAllList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}
// 盘点列表查询
export const checkAllList = (param) => {
    // const params = Object.assign({
    //     appKey: 'A1001000', // 系统编号
    //     busiCode: 'A1001000', // 业务线编号
    //     configCode: 'UC18271078377451520',
    //     name: '查询盘点单列表',
    //     source: '运单中台',
    //     body: param
    // })
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UCJH72357153968529408',
        name: '盘点列表聚合设备信息',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 盘点列表详情
export const checkDetail = (param) => {
    // const params = Object.assign({
    //     appKey: 'A1001000', // 系统编号
    //     busiCode: 'A1001000', // 业务线编号
    //     configCode: 'UC18271769800077312',
    //     name: '盘点单详情',
    //     source: '运单中台',
    //     body: param
    // })
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UCJH72359386693017600',
        name: '盘点单详情聚合设备和商品',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 盘点导出
export function checkExport (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 补货列表详情(补货单确认)（四期）
export const replenishmentDetailc = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32416946351415296',
        name: '补货单详情',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货单取消（四期）
// export const replenishmentCancel = (param) => {
//     const params = Object.assign({
//         appKey: 'A1001000', // 系统编号
//         busiCode: 'A1001000', // 业务线编号
//         configCode: 'UC32116942164369408',
//         name: '补货单取消',
//         source: '运单中台',
//         body: param
//     })
//     return client.post('/api/api/uniter/v1/url/request', params)
// }
// 补货单确认（四期）
export const replenishmentConfirm = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32116663868104704',
        name: '补货单确认',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

export function exportDetails (data) {
    return client({
        url: '/api/api/uniter/v1/url/request',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 中台上传
export async function uploadFile (params) {
    const res = await client.post('/zt-upload/goods/file/upload/v2', params)
    return res
}
// 补货规则配置-补货规则列表（四期）
export const repRuleList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126320879771648',
        name: '补货规则列表',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-新增补货规则（四期）
export const repRuleAdd = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126415260000256',
        name: '新增补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-删除补货规则（四期）
export const repRuleDelete = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126516929929216',
        name: '删除补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-查询补货规则（四期）
export const repRuleQueryById = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126747381768192',
        name: '查询补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-编辑补货规则（四期）
export const repRuleSave = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126829887922176',
        name: '编辑补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-生效/作废补货规则（四期）
export const repRuleValid = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32126905997762560',
        name: '生效/作废补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-查询柜主（模糊查询）（四期）
export const repRuleQueryGuizhu = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127002689052672',
        name: '查询柜主(模糊查询)',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 补货规则配置-查询设备（模糊查询）（四期）
export const repRuleQueryEquipment = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127169202921472',
        name: '查询设备（模糊查询）',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 货柜补货规则-货柜补货规则列表（四期）
export const repRuleDetailList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127292372852736',
        name: '货柜补货规则列表',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 货柜补货规则-货柜补货规则删除（四期）
export const repRuleDetailDelete = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127412506107904',
        name: '货柜补货规则删除',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 货柜补货规则-查询货柜补货规则（四期）
export const repRuleDetailQueryById = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127596162097152',
        name: '查询货柜补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 货柜补货规则-编辑货柜补货规则（四期）
export const repRuleDetailSave = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC32127727137628160',
        name: '编辑货柜补货规则',
        source: '运单中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 货柜标品列表（五期）
export const containerScantling = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC38578188684451840',
        name: '标品等级查询V4',
        source: '商品中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 柜主合作意向列表（六期）
export const merchantIntention = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC41591061362483200',
        name: '分页查询柜主合作意愿',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 柜主合作意向导出（六期）
// export const merchantIntentionExport = (param) => {
//     const params = Object.assign({
//         appKey: 'A1001000', // 系统编号
//         busiCode: 'A1001000', // 业务线编号
//         configCode: 'UC41591303315103744',
//         name: '导出柜主合作意愿',
//         source: '商户中台',
//         body: param
//     })
//     return client.post('/api/api/uniter/v1/url/request', params)
// }
export function merchantIntentionExport (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 七期spu换绑列表
export const spurebindinglist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UCJH45942450409914368',
        name: 'SPU信息列表聚合',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 七期sku换绑列表
export const skurebindinglist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 七期goods换绑列表
export const goodsrebindinglist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC15115376406798336',
        name: 'goods查询通用接口V2',
        source: '商品中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 七期spu换绑接口
export const spurebinding = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UCJH50590828122447872',
        name: 'spu换绑接口聚合',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 七期检索标品库
export const goodslist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC18418810257797120',
        name: 'SPU通用查询接口',
        source: '商品中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 七期详情接口
export const detaillist = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC45945598742577152',
        name: 'spu换绑详情',
        source: '商品中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 标签管理列表（1215三合一项目）
export const getLabelList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53143627195387904',
        name: '业务线标签管理-列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-新增（1215三合一项目）
export const addLabel = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53143793537290240',
        name: '业务线标签管理-新增',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 标签管理页面-详情（1215三合一项目）
export const getLabelDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53144119338242048',
        name: '业务线标签管理-详情',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-更新（1215三合一项目）
export const updateLabel = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53143956578275328',
        name: '业务线标签管理-更新',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-删除（1215三合一项目）
export const delLabel = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC53144268831625216',
        name: '业务线标签管理-删除',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 标签管理页面-标签名称（1215三合一项目）
export const getLabelName = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54211594947317760',
        name: '标签名称列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 获取全部业务线（1215三合一项目）
export const getAllBusiCode = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: param.busiCode, // 业务线编号
        configCode: 'UC53772472084463616',
        name: '查询所有业务线',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 店铺审核管理列表（1215三合一项目）
export const getShopCheckList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54267758447333376',
        name: '店铺审核列表',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 店铺审核管理列表-审核通过/驳回（1215三合一项目）
export const checkHandle = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC54265714105815040',
        name: '店铺审核接口v2',
        source: '商户中台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// -------------------------------------------
// 分页查询采购类单据（20230117三合一项目）
export const replenishmentAllList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61838780881551360',
        name: '分页查询采购类单据',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 采购类单据生效（20230117三合一项目）
export const replenishmentTakeEffect = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC64352840127893504',
        name: '采购类单据生效',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 采购类单据取消（20230117三合一项目）
export const replenishmentCancel = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC64353159222153216',
        name: '采购类单据取消',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 采购类单据导出（20230117三合一项目）
export function replenishmentExport (data) {
    return client({
        url: '/api/api/uniter/v1/common/export',
        method: 'post',
        data,
        responseType: 'blob'
    })
}
// 查询采购类单据详情（20230117三合一项目）
export const replenishmentkDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61840332467847168',
        name: '查询采购类单据详情',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询采购类单据-虚拟收货确认（20230117三合一项目）
export const replenishmentkConfirm = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61856156863807488',
        name: '虚拟收货确认',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 销售类型单据信息查询接口（20230117三合一项目）
export const billAllList = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61857072526508032',
        name: '销售类型单据信息查询接口',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询发货确认信息接口详情（20230117三合一项目）
export const billDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61857507706519552',
        name: '查询发货确认信息接口',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 查询采购类单据-虚拟收货确认（20230117三合一项目）
export const billConfirm = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC61857686396452864',
        name: '虚拟发货确认接口',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
// 销售类单据生效（20230117三合一项目）
export const billTakeEffect = (param) => {
    const params = Object.assign({
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC64352302057410560',
        name: '修改订单状态接口',
        source: 'OMS系统',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
