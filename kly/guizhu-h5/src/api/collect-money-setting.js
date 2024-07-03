import client from '@/api/axios'

// 分账资料提交保存
export const merchantSave = param => {
    return client({
        url: '/hzgApi/receipts/setting/merchantSignedAudit',
        method: 'POST',
        data: param
    })
}

// 查询签约状态
export const merchantContractQuery = param => {
    return client({
        url: '/hzgApi/receipts/setting/merchantContractQuery',
        method: 'get'
    })
}

// 查询申请状态
export const queryMerchantInfoStatus = param => {
    const params = Object.assign({
        merchantId: '011658979867900RX6',
        subProductCode: 'A1001002001',
        payChannelCode: '1' // 1 微信 2 支付宝
    })
    return client({
        url: '/hzgApi/receipts/setting/queryMerchantInfoStatus',
        method: 'post',
        data: params
    })
}

// 申请资料查询
export const queryMerchantInfoDetail = () => {
    return client({
        url: '/hzgApi/receipts/setting/queryMerchantInfoDetail',
        method: 'get'
    })
}

// 提交资料查询
export const merchantSettlementInfo = () => {
    const param = {
        payChannelCode: '1'
    }
    return client({
        url: '/hzgApi/receipts/setting/merchantSettlementInfo',
        method: 'post',
        data: param
    })
}

// 查询签约状态
export const selectBankAddress = param => {
    const params = Object.assign({
        account_number: '1231212112312121'
    }, param)
    return client({
        url: '/hzgApi/receipts/setting/capitallhh/banks',
        method: 'get',
        params: params
    })
}

// 分账管理列表
export const subledgerList = param => {
    const params = Object.assign({
        mobileOrName: '', // 手机号活姓名
        page: 1,
        pageSize: 10
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/list',
        method: 'post',
        data: params
    })
}
// 获取分账人列表
export const getAcountList = param => {
    return client({
        url: '/hzgApi/settlement/subledger/merchantSubList',
        method: 'get',
        data: param
    })
}
// 获取分账人列表2
export const getAcountList2 = param => {
    return client({
        url: '/hzgApi/settlement/subledger/v2/merchantSubListPayee',
        method: 'get',
        data: param
    })
}
// 获取分账人-已生效 列表
export const getAcountListEffective = param => {
    return client({
        url: '/hzgApi/v1/merchant/sub/v1/haveCollectOperator',
        method: 'get',
        params: param
    })
}
// 添加分账人
export const subledgerSave = param => {
    const params = Object.assign({
        openId: '',
        merchantId: '', // 商户扫描二维码后的id
        collectionUserId: '', // 分账人id
        type: 0, // 类型：0：个人，1：企业
        mobile: '', // 手机号码
        accountNo: '',
        name: '', // 名称
        bankCard: '', // 银行卡号
        bankName: '' // 银行名称
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/save',
        method: 'post',
        data: params
    })
}
// 更新分账人
export const subledgerUpdate = param => {
    const params = Object.assign({
        openId: '',
        merchantId: '', // 商户扫描二维码后的id
        collectionUserId: '', // 分账人id
        type: 0, // 类型：0：个人，1：企业
        mobile: '', // 手机号码
        accountNo: '',
        name: '', // 名称
        bankCard: '', // 银行卡号
        bankName: '' // 银行名称
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/modify-payee',
        method: 'post',
        data: params
    })
}

// 注册分账人
export const subledgerRegister = param => {
    const params = Object.assign({
        openId: '', // 微信获取
        type: '', // 类型：0：个人，1：企业
        mobile: '', // 手机号码
        accountNo: '', // 商户号，身份证号
        name: '' // 企业名称，身份证号
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/register',
        method: 'post',
        data: params
    })
}

// 分账比例列表
export const subledgerRateList = param => {
    const params = Object.assign({
        mobileOrName: '', // 手机号活姓名
        page: 1,
        pageSize: 10
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/rateList',
        method: 'post',
        data: params
    })
}

// /settlement/subledger/createRate
// 分账比例新增
export const subledgerCreateRate = param => {
    const params = Object.assign({
        subLedgerId: '',
        deviceInfo: [], // 设备信息
        // deviceNo: '', // 设备编号
        // deviceName: '', // 设备名称
        // pointName: '点位名称', // 点位名称
        // pointId: '点位id', // 点位id
        // address: '位置' // 位置
        period: '', // 结算周期
        rate: '', // 结算比例
        startTime: '', // 开始时间
        endTime: '' // 结束时间
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/createRate',
        method: 'post',
        data: params
    })
}

// 分账比例编辑
export const subledgerEditRate = param => {
    const params = Object.assign({
        ruleConfigId: '',
        subLedgerId: '',
        deviceInfo: [], // 设备信息
        subsidyFlag: '',
        channel: '' // 开始时间
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/updateRate',
        method: 'post',
        data: params
    })
}
// 注册微信收款人
export const querySubledgerPayee = param => {
    const params = Object.assign({
        subLedgerId: '',
        openId: '',
        name: '',
        mobile: '',
        accountNo: '',
        functionType: 0
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/register',
        method: 'post',
        data: params
    })
}
// 查询分账人信息
export const querySubledgerUserInfo = param => {
    const params = Object.assign({
        subLedgerId: '', // （分账人ID）
        functionType: 0
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/userInfo',
        method: 'get',
        params
    })
}
// 邀请成为收款人
export const queryInvite = param => {
    const params = Object.assign({
        entityUserId: '',
        subLedgerId: ''
    }, param)
    return client({
        url: '/hzgApi/settlement/subledger/invite-to-payee',
        method: 'post',
        data: params
    })
}
