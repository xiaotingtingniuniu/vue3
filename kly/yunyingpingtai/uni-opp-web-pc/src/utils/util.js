// 金额转化
export const conversion = (num) => {
    const str = (num / 100).toFixed(2) + ''
    const intSum = str.substring(0, str.indexOf('.')).replace(/\B(?=(?:\d{3})+$)/g, ',') // 取到整数部分
    const dot = str.substring(str.length, str.indexOf('.')) // 取到小数部分搜索
    const ret = intSum + dot
    return ret
}
