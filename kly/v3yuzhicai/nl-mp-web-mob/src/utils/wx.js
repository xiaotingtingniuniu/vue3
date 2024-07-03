import wx from 'weixin-js-sdk'
import store from '@/store'
import router from '@/router'
import { scanResult } from '@/utils'
import { wxJsSignature } from '@/api/home'
import { geocoder } from '@/utils/location'

export const wxJsSignatureFn = async () => {
    const url = window.location.href
    const { appId, timestamp, nonceStr, signature } = await wxJsSignature({ url })
    wx.config({
        debug: false,
        appId,
        timestamp,
        nonceStr,
        signature,
        jsApiList: ['scanQRCode', 'chooseWXPay', 'getLocation', 'openLocation', 'updateAppMessageShareData', 'updateTimelineShareData']
    })
}

export const scanQRCode = () => {
    wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        success: function (res) {
            scanResult(res.resultStr)
        }
    })
}

export const chooseWXPay = (payload, orderNumber) => {
    wx.chooseWXPay({
        timestamp: payload.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        nonceStr: payload.nonceStr, // 支付签名随机串，不长于 32 位
        package: payload.packageStr, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
        signType: payload.signType, // 微信支付V3的传入RSA,微信支付V2的传入格式与V2统一下单的签名格式保持一致
        paySign: payload.paySign, // 支付签名
        success: function () {
            router.push({ name: 'pay-result-new', params: { orderNumber } })
        },
        cancel: function () {
            // window.location.reload()
        }
    })
}

export const getLocation = () => {
    wx.ready(function () {
        store.commit('renewLocationPermission', false)
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: async function ({ latitude, longitude }) {
                await geocoder(latitude, longitude)
                store.commit('renewLocationPermission', true)
            }
        })
    })
}

export const openLocation = (lat, lng, to, address) => {
    wx.ready(function () {
        wx.openLocation({
            latitude: Number(lat),
            longitude: Number(lng),
            name: to, // 位置名
            address: address, // 地址详情说明
            scale: 17, // 地图缩放级别,整型值,范围从1~28。默认为最大
            infoUrl: '' // 在查看位置界面底部显示的超链接,可点击跳转
        })
    })
}

export const shareWX = () => {
    wx.ready(function () { // 需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData({
            title: '送你新人大礼包', // 分享标题
            desc: '注册恒生活APP，奖励优惠大礼包，限新用户使用～', // 分享描述
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl: window.location.origin + '/images/hsh-logo.png' // 分享图标
        })
        wx.updateTimelineShareData({
            title: '送你新人大礼包', // 分享标题
            link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号 JS 安全域名一致
            imgUrl: window.location.origin + '/images/hsh-logo.png' // 分享图标
        })
    })
}
