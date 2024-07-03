const commonParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001002' // 业务线编号
}

const REQUEST_PARAM = {
    // 平台商户管理-商户子账号管理--列表
    OPERATE_MERCHANT_SUBACCOUNT_LIST: {
        ...commonParam,
        configCode: 'UCJH80729523391348736',
        name: '子账号管理列表',
        source: '商户中台'
    },
    // 平台商户管理-商户子账号管理--列表-启用
    OPERATE_MERCHANT_SUBACCOUNT_LIST_ENABLE: {
        ...commonParam,
        configCode: 'UCJH80707579656847360',
        name: '子账号启用',
        source: '商户中台'
    },
    // 平台商户管理-商户子账号管理--列表-停用
    OPERATE_MERCHANT_SUBACCOUNT_LIST_DEACTIVATE: {
        ...commonParam,
        configCode: 'UC79939710211899392',
        name: '子账号停用',
        source: '商户中台'
    }
}

export default REQUEST_PARAM
