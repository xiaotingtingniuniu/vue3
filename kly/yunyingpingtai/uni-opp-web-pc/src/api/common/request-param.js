const commonParam = {
    appKey: 'A1001000', // 系统编号
    busiCode: 'A1001002' // 业务线编号
}

export const REQUEST_PARAM = {
    // 标品审核管理列表
    PRODUCT_EXAMINE_MANAGE_LIAS: {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UCJH38716701942571008',
        name: 'SPU申请单列表聚合',
        source: '运营后台'
    },
    // 标品审核管理详情
    PRODUCT_EXAMINE_MANAGE_DETAIL: {
        ...commonParam,
        configCode: 'UC16233507066474496',
        name: 'SPU申请单详情',
        source: '商品中台'
    },
    // 标品审核管理审批
    PRODUCT_EXAMINE_MANAGE_EXAMINE: {
        ...commonParam,
        configCode: 'UC16233348840550400',
        name: 'SPU申请单审批',
        source: '商品中台'
    },
    // 标品审核管理审批V4
    PRODUCT_EXAMINE_MANAGE_EXAMINE_V4: {
        ...commonParam,
        configCode: 'UC38574687313027072',
        name: 'SPU申请单审批V4',
        source: '商品中台'
    },
    // 标品审核管理审批V4聚合接口
    PRODUCT_EXAMINE_MANAGE_EXAMINE_TOFETHER_v4: {
        ...commonParam,
        configCode: 'UCJH64097087878758400',
        name: 'SPU申请单审批V4聚合参数校验',
        source: '运营后台'
    },
    // 标品审核管理审批V5聚合接口
    PRODUCT_EXAMINE_MANAGE_EXAMINE_TOFETHER_V5: {
        ...commonParam,
        configCode: 'UCJH64098237323575296',
        name: 'SPU申请单审批V5聚合参数校验',
        source: '运营后台'
    },
    // 标品审核管理列表
    CONTAINER_GOODS_EXAMINE_MANAGE_LIST: {
        ...commonParam,
        configCode: 'UC16223054756048896',
        name: 'Goods变更申请单列表',
        source: '商品中台'
    },
    // 标品审核管理审核
    CONTAINER_GOODS_EXAMINE_MANAGE_EXAMINE: {
        ...commonParam,
        configCode: 'UC16223209018355712',
        name: '修改Goods修改申请单状态',
        source: '商品中台'
    },
    // 批量添加或更新商品渠道价
    UPDATE_GOODS_PRICES: {
        ...commonParam,
        configCode: 'UC16461781986177024',
        name: '批量添加或更新商品渠道价',
        source: '价格中台'
    },
    // 货柜标品库管理列表
    CONTAINER_PRODUCT_LIBRARY_LIST: {
        ...commonParam,
        configCode: 'UC38581249318412288',
        name: '货柜标品列表',
        source: '商品中台'
    },
    // 货柜标品库管理列表-编辑
    CONTAINER_PRODUCT_LIBRARY_LIST_EDIT: {
        ...commonParam,
        configCode: 'UC38580273312260096',
        name: '货柜名称修改',
        source: '商品中台'
    },
    // 货柜标品详情
    CONTAINER_PRODUCT_DETAIL: {
        ...commonParam,
        configCode: 'UC22757475895386112',
        name: 'spu详情页查询V2',
        source: '商品中台'
    },
    // 属性模版V3
    SPU_TEMPLATE_LIST_V3: {
        ...commonParam,
        appKey: 'A1001000',
        busiCode: 'A1001004',
        configCode: 'UC32050742013108224',
        name: '获取属性模板列表V3',
        source: '商品中台'
    },
    // 标品L3等级同步货柜标品库
    SYNC_PRODUCT_LIBRARY: {
        ...commonParam,
        configCode: 'UC39390425796280320',
        name: '标品L3等级同步货柜标品库',
        source: '商品中台'
    },
    // 财务中心-批发商审核提现列表
    FINANCE_CORE_WHOLESALER_LIST: {
        ...commonParam,
        configCode: 'UCJH43384023921995776',
        name: '批发商提现审核列表聚合',
        source: '运营后台'
    },
    // 财务中心-批发商审核提现-审核
    FINANCE_CORE_WHOLESALER_AUDIT: {
        ...commonParam,
        configCode: 'UCJH48428141397274624',
        name: '账户审批聚合',
        source: '运营后台'
    },
    // 财务中心-批发商审核提现-导出
    FINANCE_CORE_WHOLESALER_EXPORT: {
        ...commonParam,
        configCode: 'UCJH43384023921995776',
        name: '批发商提现审核列表聚合',
        source: '运营后台'
    },
    // 财务中心-账户中心-信息
    FINANCE_CORE_CAPITAL_INFO: {
        ...commonParam,
        configCode: 'UC43655034690904064',
        name: '查询账户中心-财务',
        source: '账户中台'
        // configCode: 'UCJH48867918552375296',
        // name: '查询账户中心-财务聚合',
        // source: '运营后台'
    },
    // 财务中心-账户中心-提现
    FINANCE_CORE_CAPITAL_CASHOUT: {
        ...commonParam,
        configCode: 'UCJH48429309473189888',
        name: '账户提现接口聚合',
        source: '运营后台'
    },
    // 财务中心-账户中心-提现记录-列表
    FINANCE_CORE_CAPITAL_RECORD_LIST: {
        ...commonParam,
        configCode: 'UC15111841346723840',
        name: '查询提现记录',
        source: '账户中台'
    },
    // 财务中心-账户中心-动帐明细-列表
    FINANCE_CORE_CAPITAL_DETAIL_LIST: {
        ...commonParam,
        configCode: 'UC15111841355112448',
        name: '查询动账明细接口',
        source: '账户中台'
    },
    // 财务中心-账户中心-动帐明细-导出
    FINANCE_CORE_CAPITAL_DETAIL_EXPORT: {
        ...commonParam,
        configCode: 'UC15111841355112448',
        name: '查询动账明细接口',
        source: '账户中台'
    },
    // 财务中心-账户中心-绑卡
    FINANCE_CORE_CAPITAL_CARD_BINDING: {
        ...commonParam,
        configCode: 'UCJH48481677334147072',
        name: '商户绑卡聚合',
        source: '运营后台'
    },
    // 结算管理-批发商城财务账单-列表
    SETTLEMENT_MANAGEMENT_FINANCE_BILL_LIST: {
        ...commonParam,
        configCode: 'UC14729272394489856',
        name: '结算账单查询',
        source: '结算中台'
    },
    // 客服工单管理-货柜商品退款工单-列表
    CONTAINER_REFUND_WOEK_LIST: {
        ...commonParam,
        configCode: 'UC53529313090834432',
        name: '货柜工单列表',
        source: '工单中台'
    },
    // 客服工单管理-货柜异常识别工单-列表
    CONTAINER_ABNORMAL_WOEK_LIST: {
        ...commonParam,
        configCode: 'UC21288870351642624',
        name: '根据条件模糊搜索异常工单',
        source: '工单中台'
    },
    // 客服工单管理-货柜商品补退工单-列表
    CONTAINER_ABNORMAL_WOEK_LIST1: {
        ...commonParam,
        cconfigCode: 'UC21288870351642624',
        name: '根据条件模糊搜索异常工单',
        source: '工单中台'
    },
    // sku审批列表v5 商品审核-本地生活商品审核-列表
    LOCAL_LIFE_EXAMINE_MANNAGE_V5: {
        ...commonParam,
        busiCode: 'A1001003',
        configCode: 'UC53141855873699840',
        name: 'sku审批列表v5',
        source: '商品中台'
    },
    // sku审核详情v5-本地生活商品审核-详情
    LOCAL_LIFE_EXAMINE_MANNAGE_V5_DETAIL: {
        ...commonParam,
        busiCode: 'A1001003',
        configCode: 'UC53141650633822208',
        // configCode: 'UCJH59315376087867392',
        name: 'sku审核详情聚合库存原价',
        source: '运营后台'
    },
    // sku审核详情v5-本地生活商品审核-详情
    LOCAL_LIFE_EXAMINE_MANNAGE_V5_DETAIL_v1: {
        ...commonParam,
        busiCode: 'A1001003',
        configCode: 'UCJH59315376087867392',
        name: 'sku审核详情聚合库存原价',
        source: '运营后台'
    },
    // sku审核详情v5-本地生活商品审核-审核
    LOCAL_LIFE_EXAMINE_MANNAGE_AUDIT: {
        ...commonParam,
        busiCode: 'A1001003',
        configCode: 'UC53141236962201600',
        name: 'sku审核v5',
        source: '商品中台'
    },
    // 库存管理-本地生活库存查询列表
    LOCAL_LIFE_GOODS_INVENTORY: {
        appKey: 'A1001000',
        busiCode: 'A1001003',
        configCode: 'UCJH60688307006480384',
        name: '库存查询聚合活动信息',
        source: '运营后台'
    },
    // 库存管理-本地生活库存查看xiangqing
    LOCAL_LIFE_GOODS_INVENTORY_DETAIL: {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台'
    },
    // 库存管理-本地生活库存导出
    LOCAL_LIFE_GOODS_INVENTORY_EXPORT: {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台'
    },
    // 库存管理-本地生活库存编辑
    LOCAL_LIFE_GOODS_INVENTORY_EDIT: {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台'
    },
    // 库存管理-本地生活库存流水查询接口
    LOCAL_LIFE_GOODS_INVENTORY_STA_LIST: {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC16216960704966656',
        name: '库存流水查询',
        source: '库存中台'
    }
}
