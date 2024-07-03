const commonParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001002' // 业务线编号
}

const REQUEST_PARAM = {
    // 商品审核管理-进货商城商品上架审核管理-列表
    MALL_GOODS_EXAMINE_MANAGE_LIST: {
        ...commonParam,
        busiCode: 'A1001005',
        configCode: 'UC53141855873699840',
        name: 'sku审批列表v5',
        source: '商品中台'
    },
    // 商品审核管理-进货商城商品上架审核管理-列表-审核
    MALL_GOODS_EXAMINE_MANAGE_LIST_EXAMINE: {
        ...commonParam,
        busiCode: 'A1001005',
        configCode: 'UC53141236962201600',
        name: 'sku审核v5',
        source: '商品中台'
    },
    // 商品审核管理-进货商城商品上架审核管理-审核-详情
    MALL_GOODS_EXAMINE_MANAGE_EXAMINE_DETAIL: {
        ...commonParam,
        busiCode: 'A1001005',
        configCode: 'UCJH58267215273480192',
        name: 'sku审核详情聚合sku信息',
        source: '运营后台'
    },
    // 商品属性类目管理-商品类型税率表-列表
    GOODS_TAX_LIST: {
        ...commonParam,
        // busiCode: 'A1001005',
        configCode: 'UC64019396150067200',
        name: '税率查询接口',
        source: '商品中台'
    }
}

export default REQUEST_PARAM
