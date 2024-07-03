import { isIos } from '@/utils'

const setupWebViewJavascriptBridge = (callback) => {
    if (isIos) {
        if (window.WebViewJavascriptBridge) return callback(window.WebViewJavascriptBridge)
        if (window.WVJBCallbacks) return window.WVJBCallbacks.push(callback)
        window.WVJBCallbacks = [callback]
        var WVJBIframe = document.createElement('iframe')
        WVJBIframe.style.display = 'none'
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
        document.documentElement.appendChild(WVJBIframe)
        setTimeout(() => { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
}

export const appBridge = (apiName, payload, cb) => {
    if (isIos) {
        setupWebViewJavascriptBridge((bridge) => bridge.callHandler(apiName, payload, cb))
    } else {
        let res = null
        if (window.jsHZG[apiName]) {
            if (JSON.stringify(payload) !== '{}' && payload) {
                if (typeof payload === 'object') {
                    res = window.jsHZG[apiName](JSON.stringify(payload))
                } else {
                    res = window.jsHZG[apiName](payload)
                }
            } else {
                res = window.jsHZG[apiName]()
            }
            if (cb) cb(res)
        }
    }
}

export const registerhandler = (name, callback) => {
    if (isIos) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(name, callback)
        })
    } else {
        window[name] = data => callback(data)
    }
}
