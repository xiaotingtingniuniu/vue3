
import client from '@/utils/request'

// banner列表
export const bannerRequestList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658230071550P5ItC',
        name: 'banner列表',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    console.log(res)
    return res
}

// 添加banner
export const bannerAddList = (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658224162218h8MYw',
        name: '添加banner',
        source: '资源位中台',
        body: param
    }
    return client.post('/api/api/uniter/v1/url/request', params)
}

// 更新banner
export const bannerUpdate = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658224162228lHnsZ',
        name: '更新banner',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 查询资源位信息列表
export const resourceBitList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658220433169kEgQM',
        name: '查询资源位信息列表',
        source: '资源位中台',
        body: param
    }
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 修改资源位
export const resourceBitModify = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658220470341OIhXK',
        name: '修改资源信息',
        source: '资源位中台',
        body: param
    }
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

// 添加资源位
export const resourceBitAdd = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658220501543iIw9c',
        name: '添加资源位',
        source: '资源位中台',
        body: param
    }
    const { data } = await client.post('/api/api/uniter/v1/url/request', params)
    return data
}

//  应用类目分页查询接口
export const busiCateList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1657693292120raieD',
        name: '应用类目分页查询接口',
        source: '商品中台',
        body: param
    }
    const res = await client.post('/api/api/resource/v1/category/list', params)
    return res
}

//  分类列表
export const aggregateList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658230071560DbuYI',
        name: '分类列表',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 添加首页分类金刚位
export const aggregateIndexAdd = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658230071565EeCPd',
        name: '添加首页分类金刚位',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 更新首页分类金刚位
export const aggregateIndexUpdate = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC16582300715693ghUz',
        name: '更新首页分类金刚位',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

// 分类列表二级列表
export const aggregateSenList = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1657693343935QOjJ0',
        name: '应用类目层级查询',
        source: '商品中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}

export async function postUpload (params) {
    const res = await client.post('/api/api/common/file', params)
    return res
}

export const detailEdit = async (param) => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001004', // 业务线编号
        configCode: 'UC1658460126616TwpWu',
        name: '资源位详情',
        source: '资源位中台',
        body: param
    }
    const res = await client.post('/api/api/uniter/v1/url/request', params)
    return res
}
