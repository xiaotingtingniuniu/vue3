import client from '@/utils/request'

// 活动列表删除
export async function deletePromoApply (params) {
    const { code } = await client.delete('/api/api/marketing/v1/promo/apply', { data: params })
    return code
}

// 活动列表停止
export async function deletePromoStatus (params) {
    const { code } = await client.put('/api/api/marketing/v1/promo/apply/status', params)
    return code
}

// 活动列表
export async function getPromoList (params) {
    const res = await client.get('/api/api/marketing/v1/promo/apply/list', { params })
    return res
}

// 活动列表-申请新增
export async function applyPromoList (params) {
    const res = await client.post('/api/api/marketing/v1/promo/apply', params)
    return res
}

// 活动列表-修改
export async function applyEdit (params) {
    const res = await client.put('/api/api/marketing/v1/promo/apply', params)
    return res
}

// 活动列表-详情
export async function applyDetail (params) {
    const res = await client.get('/api/api/marketing/v1/promo/apply/detail', { params })
    return res
}

// 活动列表-审批
export async function applySubmit (params) {
    const { code } = await client.put('/api/api/marketing/v1/promo/apply/submit', params)
    return code
}
// 秒杀活动-获取商品列表
export async function getGoodsList (params) {
    const res = await client.post('/api/api/seckill/v1/product/list', params)
    return res
}
// 秒杀活动-获取商品列表
export async function getBusiCate (params) {
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 秒杀活动-获取商品列表
export async function getV2SkuList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 活动列表-进货商场落地页
export async function getManagementList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 新增活动-进货商场落地页
export async function addManagementList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 编辑活动-进货商场落地页
export async function editManagementList (params) {
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 补货列表详情(补货单确认)（四期）
export const getManagementDetail = (param) => {
    const params = Object.assign({
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001', // 业务线编号
        configCode: 'UCJH76329848952877056',
        name: '进货商城活动详情聚合',
        source: '运营后台',
        body: param
    })
    return client.post('/api/api/uniter/v1/url/request', params)
}
