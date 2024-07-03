import { isIos, isApp } from '@/utils'

export const appBridge = (apiName, payload, cb) => {
    if (isIos) {
        return setupWebViewJavascriptBridge(function (bridge) {
            bridge.callHandler(apiName, payload, cb)
        })
    } else {
        if (window.jsHSH[apiName]) {
            let res = null
            if (JSON.stringify(payload) !== '{}' && payload) {
                if (typeof payload === 'object') {
                    res = window.jsHSH[apiName](JSON.stringify(payload))
                } else {
                    res = window.jsHSH[apiName](payload)
                }
            } else {
                res = window.jsHSH[apiName]()
            }
            if (apiName === 'getStoreInfo' || apiName === 'getCounterInfo') {
                try {
                    res = JSON.parse(res)
                } catch (error) {}
            }
            if (cb) cb(res)
        }
    }
}

export const registerhandler = (name, callback) => {
    if (isIos) {
        setupWebViewJavascriptBridge(function (bridge) {
            bridge.registerHandler(name, function (data, responseCallback) {
                callback(data, responseCallback)
            })
        })
    } else {
        window[name] = data => callback(data)
    }
}

const setupWebViewJavascriptBridge = (callback) => {
    if (!isApp) return false
    if (window.WebViewJavascriptBridge) return callback(window.WebViewJavascriptBridge)
    if (window.WVJBCallbacks) return window.WVJBCallbacks.push(callback)
    window.WVJBCallbacks = [callback]
    const WVJBIframe = document.createElement('iframe')
    WVJBIframe.style.display = 'none'
    WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'
    document.documentElement.appendChild(WVJBIframe)
    setTimeout(() => document.documentElement.removeChild(WVJBIframe), 0)
}
