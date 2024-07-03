
// 分账比例
export const validatorRatio = (val) => {
    const str = val
    if (str.toString().indexOf('.') !== -1) {
        return '请输入整数'
    }
    if (val < 0 || val > 100) {
        return '请输入0-100之间的数字'
    }
}

// 结算周期
export const validatorSettlement = (val) => {
    const str = val
    if (str.toString().indexOf('.') !== -1) {
        return '请输入整数'
    }
    if (val < 0 || val > 180) {
        return '请输入0-30之间的数字'
    }
}

// 小数点后两位数字
export const validatorNum2 = (val) => {
    const str = val
    const reg = /^[0-9]*(\.[0-9]{0,2})?$/
    if (!Number(val)) {
        return '商品价格要大于0元'
    } else if (!isNaN(str) && reg.test(str)) {
        return true
    } else {
        return '仅限输入数字，支持小数点后两位'
    }
}

// 身份证号检验
export const idValidatorMessage = (val) => {
    if (!val) return '请输入身份证号'
    if (!/^\d{17}[0-9xX]/.test(val)) return '身份证号输入不合法，请重新输入'
}

// 银行账号检验
export const bankNoValidatorMessage = (val) => {
    if (!val) return '请输入银行账号'
    if (!/^[1-9]\d{1,29}$/.test(val)) return '银行账号输入不合法，请重新输入'
}
