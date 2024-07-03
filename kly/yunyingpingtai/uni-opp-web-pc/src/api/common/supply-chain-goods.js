const commonParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001006' // 业务线编号
}

const REQUEST_PARAM = {
    // 供应链商品管理-供应链Sku管理-列表
    SUPPLY_CHAIN_GOODS_LIST: {
        ...commonParam,
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台'
    },

    // 设备供应链商品上架审核列表
    EQUIP_GOODS_EXAMINE_LIST: {
        ...commonParam,
        configCode: 'UC53141855873699840',
        name: 'sku审批列表v5',
        source: '商品中台'
    },
    // 设备供应链商品上架审核详情
    EQUIP_GOODS_EXAMINE_DETAIL: {
        ...commonParam,
        configCode: 'UCJH58267215273480192',
        name: 'sku审核详情聚合sku信息',
        source: '商品中台'
    },
    // 供应链商品管理-供应链Sku管理-渠道
    SUPPLY_CHAIN_CHANNEL_LIST: {
        ...commonParam,
        configCode: 'UC65462314014081024',
        name: '查询商品渠道接口',
        source: '商品中台'
    },
    // 供应链商品管理-供应链Sku管理-详情
    SUPPLY_CHAIN_GOODS_DETAIL: {
        ...commonParam,
        configCode: 'UC15115376431964160',
        name: 'sku详情页查询V2',
        source: '商品中台'
    }
}

export default REQUEST_PARAM
