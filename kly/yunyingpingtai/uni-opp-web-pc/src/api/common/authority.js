const commonParam = {
    appKey: 'A1001001', // 系统编号
    busiCode: 'A1001001' // 业务线编号
}

const REQUEST_PARAM = {
    // 权限中台-角色模版--同步
    AUTHORITY_ROLE_TEMPLATE_SYNC: {
        ...commonParam,
        configCode: 'UC81028380704686080',
        name: '角色模板同步',
        source: '权限中台'
    }
}

export default REQUEST_PARAM
