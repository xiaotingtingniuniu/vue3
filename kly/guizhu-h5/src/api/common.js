import client from '@/api/axios'

// 上传文件
export const uploaderFile = param => {
    return client({
        url: '/hzgApi/file/upload',
        method: 'POST',
        data: param
    })
}

// 对私银行列表：http://localhost:8080/hsh-guizhu-api/receipts/setting/personalBank
// 获取分行列表：http://localhost:8080/hsh-guizhu-api/receipts/setting/branchBank
// 获取省 列表：http://localhost:8080/hsh-guizhu-api/receipts/setting/provinces
// 获取省下城市 列表：http://localhost:8080/hsh-guizhu-api/receipts/setting/provinceCitys
// http://localhost:8080/hsh-guizhu-api/receipts/setting/bankList?bankType=2

// 获取银行列表
export const getBankList = param => {
    const params = Object.assign({
        bankType: 2 // 1对公，2对私
    }, param)
    return client({
        url: '/hzgApi/receipts/setting/bankList',
        method: 'get',
        params: params
    })
}

// 获取省份
export const getProvincesList = () => {
    return client({
        url: '/hzgApi/receipts/setting/provinces',
        method: 'get'
    })
}

// 获取城市
export const getProvincesCityList = (param) => {
    const params = Object.assign({
        provinceCode: '' // 省份编码
    }, param)
    return client({
        url: '/hzgApi/receipts/setting/provinceCitys',
        method: 'get',
        params: params
    })
}

// 获取银行分行
export const getBranchBankList = (param) => {
    const params = Object.assign({
        bankAliasCode: '', // 银行编码
        cityCode: '' // 地区编码
    }, param)
    return client({
        url: '/hzgApi/receipts/setting/branchBank',
        method: 'get',
        params: params
    })
}
// bankAliasCode cityCode
