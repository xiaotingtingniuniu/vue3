export const isIos = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
export const isSafari = !!navigator.userAgent.match('Safari')
export const isApp = process.env.NODE_ENV === 'production' ? true : !!navigator.userAgent.includes('com.credithc.guizhu')
// export const isApp = !!navigator.userAgent.includes('com.credithc.guizhu')
export const isWxWork = !!navigator.userAgent.toLowerCase().includes('wxwork')
export const isWxMini = !!navigator.userAgent.toLowerCase().includes('miniprogram')
export const isWx = !!navigator.userAgent.toLowerCase().includes('micromessenger') && !isWxWork && !isWxMini

export const getQueryVariable = (variable, url) => {
    const str = url || window.location.href
    const query = str.split('?')[1]
    if (!query) return false
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
            return pair[1]
        }
    }
    return false
}

export const getTime = () => {
    const date = new Date()
    const Y = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const HH = date.getHours()
    const mm = date.getMinutes()
    const ss = date.getSeconds()

    return `${Y}-${M > 9 ? M : '0' + M}-${D > 9 ? D : '0' + D} ${HH > 9 ? HH : '0' + HH}:${mm > 9 ? mm : '0' + mm}:${ss > 9 ? ss : '0' + ss}`
}

const patch0 = (num) => (num > 9 ? num : '0' + num)

export const getDate = (dateStr, formatter = 'YYYY-MM-DD') => {
    const date = new Date(dateStr)
    const YYYY = date.getFullYear()
    const MM = date.getMonth() + 1
    const DD = date.getDate()
    const hh = date.getHours()
    const mm = date.getMinutes()
    const ss = date.getSeconds()
    return formatter.replace('YYYY', YYYY).replace('MM', patch0(MM)).replace('DD', patch0(DD)).replace('hh', patch0(hh)).replace('mm', patch0(mm)).replace('ss', patch0(ss))
}

// 判断是否手机号
export const isMobile = phone => {
    if (!phone) return
    const regExp = new RegExp('^1[3456789]\\d{9}$')
    return regExp.test(phone)
}

// 验证手机号
export const verifyPhone = phone => {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    return reg.test(phone)
}

// 腾讯/高德地图经纬度转换成百度经纬度
export const qqMapTransBMap = (lng, lat) => {
    const pi = 3.14159265358979324 * 3000.0 / 180.0
    const x = lng
    const y = lat
    const z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * pi)
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * pi)
    const lngs = z * Math.cos(theta) + 0.0065
    const lats = z * Math.sin(theta) + 0.006

    return {
        lng: lngs,
        lat: lats
    }
}

// 获取标品图片 根据 mediaType 获取
export const getPicByMediaType = (goodsMediaList, type) => {
    if (!goodsMediaList) return ''
    const tempItem = goodsMediaList.find(item => Number(item.mediaType) === type)
    return tempItem?.mediaUrl || ''
}

export const toThousands = (num) => {
    if (isNaN(num)) return 0
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

// 获取开始日期 结束日期之间的 日期数组
export const getDiffDate = (stime, etime) => {
    var diffdate = []
    var i = 0
    while (stime <= etime) {
        diffdate[i] = stime
        var stimeTs = new Date(stime).getTime()
        var nextDate = stimeTs + (24 * 60 * 60 * 1000)
        var nextDatesY = new Date(nextDate).getFullYear() + '-'
        var nextDatesYM = (new Date(nextDate).getMonth() + 1 < 10) ? '0' + (new Date(nextDate).getMonth() + 1) + '-' : (new Date(nextDate).getMonth() + 1) + '-'
        var nextDatesYD = (new Date(nextDate).getDate() < 10) ? '0' + new Date(nextDate).getDate() : new Date(nextDate).getDate()
        stime = nextDatesY + nextDatesYM + nextDatesYD
        i++
    }
    return diffdate
}

// 获取当前日期 到指定天数之前的日期
export const funDate = (aa) => {
    var date1 = new Date()
    var date2 = new Date(date1)
    date2.setDate(date1.getDate() + aa)
    return `${date2.getFullYear()}-${(date2.getMonth() + 1) > 9 ? (date2.getMonth() + 1) : ('0' + (date2.getMonth() + 1))}-${(date2.getDate() > 9 ? date2.getDate() : ('0' + date2.getDate()))}`
}

// 前端精度乘法计算
export const accMul = (arg1 = 0, arg2 = 100) => {
    console.log(arg1, arg2, 'arg')
    if (arg1 === 0) return 0
    var m = 0; var s1 = arg1.toString(); var s2 = Number(arg2).toString()
    try { m += s1.split('.')[1].length } catch (e) {}
    try { m += s2.split('.')[1].length } catch (e) {}
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
}
