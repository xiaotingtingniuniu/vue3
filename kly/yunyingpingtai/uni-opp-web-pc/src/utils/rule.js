const regCheck = reg => txt => reg.test(txt)

// 手机号
export const phoneNoValidator = regCheck(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)

// 身份证号正则
export const idCard = regCheck(/^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/)

// 数字
export const regNumber = regCheck(/^[0-9]*$/)
// 汉字
export const regChinese = regCheck(/^[\u4e00-\u9fa50-9]{0,10}$/)

// 数字，字母，下划线 5-20
export const regAccount = regCheck(/^[0-9A-Za-z_]*$/)
// 数字，字母，汉字
export const regAccountC = regCheck(/^[\u4E00-\u9FA5A-Za-z0-9]+$/)
