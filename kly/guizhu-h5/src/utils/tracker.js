import { isApp, isIos } from './index'
import uaParserJs from 'ua-parser-js'
import { trackerApi } from '@/api/tracker'
import md5 from 'js-md5'
import { gzipaes, arrayBufferToBase64, decrypt } from './gzipAesUtil'

const appKey = process.env.VUE_APP_APPKEY
const h5AESKey = process.env.VUE_APP_AES192_KEY
const iosAESKey = process.env.VUE_APP_IOS_AES192_KEY
const androidAESKey = process.env.VUE_APP_ANDROID_AES192_KEY

export const getVersion = () => {
    let appUa = navigator.userAgent.split(' ').pop()
    appUa = decrypt(appUa, isIos ? iosAESKey : androidAESKey)
    return appUa.split(';')[4] || '0'
}

export const apiUa = () => {
    let payloadKeyCommon = null
    try {
        if (isApp) {
            payloadKeyCommon = navigator.userAgent.split(' ').pop()
            payloadKeyCommon = decrypt(payloadKeyCommon, isIos ? iosAESKey : androidAESKey)
            console.log(payloadKeyCommon)
        } else {
            const uaParser = uaParserJs()
            const userId = ''
            const system = `${uaParser.os.name}.${uaParser.os.version}`
            const model = uaParser.device.model
            const deviceId = ''
            const appVersion = ''
            const channel = ''
            const netType = ''
            const sessionId = `${deviceId}${new Date().getTime()}`
            payloadKeyCommon = `${userId};${system};${model};${deviceId};${appVersion};${netType};${channel};${sessionId}`
        }
    } catch (error) { return false }
    // String => gzip压缩 => AES加密 => post上传到后台
    // console.log(arrayBufferToBase64(gzipaes.aesEcbPkcs7Encrypt(gzipaes.gzip(JSON.stringify(payloadKeyCommon)), h5AESKey)))
    return arrayBufferToBase64(gzipaes.aesEcbPkcs7Encrypt(gzipaes.gzip(JSON.stringify(payloadKeyCommon)), h5AESKey))
}

// 埋点上传
// const {module, subModule, event, params, common} = payload
export const tracker = async (payload) => {
    const payloadKeyCommon = { value: null }
    // payloadKeyCommon 字段区分环境
    // {ios, android} => app注入ua
    // {h5} => 浏览器ua解析
    if (isApp) {
        // const temp = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 app/com.credithc.guizhu'
        // payloadKeyCommon.value = temp.split(' ').pop()
        payloadKeyCommon.value = navigator.userAgent.split(' ').pop()
        try {
            payloadKeyCommon.value = decrypt(payloadKeyCommon.value, isIos ? iosAESKey : androidAESKey)
        } catch (error) {
            return false
        }
    } else {
        const uaParser = uaParserJs()
        const userId = ''
        const system = `${uaParser.os.name}.${uaParser.os.version}`
        const model = uaParser.device.model
        const deviceId = ''
        const appVersion = ''
        const channel = ''
        const netType = ''
        const sessionId = `${deviceId}${new Date().getTime()}`
        payloadKeyCommon.value = `${userId};${system};${model};${deviceId};${appVersion};${netType};${channel};${sessionId}`
    }
    Object.assign(payload, { common: payloadKeyCommon.value })
    console.log(payload)
    // payload json => String => gzip压缩 => AES加密 => post上传到后台
    const body = gzipaes.aesEcbPkcs7Encrypt(gzipaes.gzip(JSON.stringify(payload)), h5AESKey)
    const time = (new Date()).valueOf()
    const sign = md5(`${appKey}${time}${arrayBufferToBase64(body.slice(0, 10))}`)
    try {
        await trackerApi({ appKey, time, sign, body })
    } catch (error) {}
}
