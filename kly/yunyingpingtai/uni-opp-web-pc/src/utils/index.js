import store from '@/store'
import { getMerchantList } from '@/api/operate/index'

// 获取标品图片 根据 mediaType 获取
export const getPicByMediaType = (goodsMediaList, type) => {
    if (!goodsMediaList) return ''
    const tempItem = goodsMediaList.find(item => Number(item.mediaType) === type)
    return tempItem?.mediaUrl || ''
}

export const checkRole = (roleId) => {
    if (!roleId) return true
    const roleTree = store.state.userResourceTree
    if (!roleTree) return true
    for (let i = 0; i < roleTree.length; i++) {
        if (roleTree[i].anchors.includes(roleId)) {
            return true
        }
    }
    return false
}

export const goApp = (link) => {
    window.open(link, '_blank')
}

// 获取 url 参数
export const getQueryVariable = variable => {
    const str = window.location.href.split('?')
    const query = str[1]
    if (!query) return false
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=')
        if (pair[0] === variable) {
            return pair[1]
        }
    }
    return (false)
}

// 删除 url 参数
export const delParam = paramKey => {
    let url = window.location.href // 页面url
    const urlParam = window.location.search.substr(1) // 页面参数
    const beforeUrl = url.substr(0, url.indexOf('?')) // 页面主地址（参数之前地址）
    let nextUrl = ''

    const arr = []
    if (urlParam !== '') {
        const urlParamArr = urlParam.split('&') // 将参数按照&符分成数组
        for (let i = 0; i < urlParamArr.length; i++) {
            const paramArr = urlParamArr[i].split('=') // 将参数键，值拆开
            // 如果键雨要删除的不一致，则加入到参数中
            if (paramArr[0] !== paramKey) {
                arr.push(urlParamArr[i])
            }
        }
    }
    if (arr.length > 0) {
        nextUrl = '?' + arr.join('&')
    }
    url = beforeUrl + nextUrl
    return url
}

// 获取时间戳
export const getTimer = () => {
    const today = new Date()
    let month = today.getMonth() + 1
    month = month < 10 ? '0' + month : month
    const day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate()
    const hours = today.getHours() < 10 ? '0' + today.getHours() : today.getHours()
    const mins = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()
    const secs = today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds()
    const now1 = today.getFullYear() + '' + month + '' + day + '' + hours + '' + mins + '' + secs
    return now1
}

// 格式化时间
export const getTime = (dataStr) => {
    const date = new Date(dataStr)
    const y = date.getFullYear()

    let m = date.getMonth() + 1
    m = m < 10 ? ('0' + m) : m

    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d

    let h = date.getHours()
    h = h < 10 ? ('0' + h) : h
    // 获得分
    let mm = date.getMinutes()
    mm = mm < 10 ? ('0' + mm) : mm

    let dd = date.getSeconds()
    dd = dd < 10 ? ('0' + dd) : dd
    return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + dd
}

// 下载excel
export const InstallEXCEL = (blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = getTimer()
    document.body.appendChild(link)
    link.click()
    window.setTimeout(function () {
        URL.revokeObjectURL(blob)
        document.body.removeChild(link)
    }, 0)
}
// url下载文件
export const downloadFile = (url, fileName = '合同模版') => {
    fetch(url).then(res => res.blob()).then(blob => { // 将链接地址字符内容转变成blob地址
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = fileName// 下载文件的名字
        document.body.appendChild(a)
        a.click()
    })
}
// 查询基础类目层级

export const queryCategory = async (level, code) => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001004',
            level: level,
            code: code
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693233153UhCbX',
        name: '基础类目层级查询',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }

    const data = await getMerchantList(param)
    return data
}

// 查询设备型号基础类目
export const queryCategoryDevice = async (type, pid) => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001004'
            // dictType: type, // 字典类型
            // parentId: pid // 父亲pid
        },
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001001',
        name: '设备型号级联查询',
        configCode: 'UCJH78850296995135488',
        source: '运营后台'
    }

    const data = await getMerchantList(param)
    return data
}

// 根据业务线查询基础类目层级
export const queryCategoryByBusiCode = async (level, code, busiCode) => {
    if (busiCode === 'A1001001') {
        busiCode = 'A1001004'
    }
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: busiCode || 'A1001004',
            level: level,
            cateCode: code
        },
        appKey: 'A1001001',
        busiCode: 'A1001004',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693343935QOjJ0',
        name: '应用类目层级查询',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }

    const data = await getMerchantList(param)
    return data
}

// 查询应用类目层级
export const yingyongQueryCategory = async (level, code, busiCode = 'A1001004') => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: busiCode,
            level: level,
            cateCode: code
        },
        appKey: 'A1001001',
        busiCode: busiCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693343935QOjJ0',
        name: '应用类目层级查询',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }

    const data = await getMerchantList(param)
    return data
}
// 批发商城
export const yingyongQueryCategoryPF = async (level, code, busiCode = 'A1001005') => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: busiCode,
            level: level,
            cateCode: code
        },
        appKey: 'A1001001',
        busiCode: busiCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657693343935QOjJ0',
        name: '应用类目层级查询',
        source: '商品中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }

    const data = await getMerchantList(param)
    return data
}
// 查询生效城市层级
export const cityQueryCategory = async (level, code) => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001000',
            busiCode: 'waybill',
            ql: level,
            code: code
        },
        appKey: 'A1001000',
        busiCode: 'waybill',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1658391004384SvOqm',
        name: '查询四级地址库信息',
        source: '运单中台',
        modifierId: store.state.userInfo.account,
        operatorId: store.state.userInfo.account,
        operatorName: store.state.userInfo.name
    }

    const data = await getMerchantList(param)
    return data.addressList
}

/* 手机号校验 */
export const isMobile = (mobile) => {
    return /^1[3-9]\d{9}$/.test(mobile)
}
