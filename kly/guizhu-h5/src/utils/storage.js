import { appBridge } from '@/utils/bridge'
import { isApp } from '@/utils'
// 添加应用存储信息 兼容app内或h5
export const setAppStorageFn = (key, value) => {
    if (isApp) return appBridge('setStorage', { key, value })
    sessionStorage.setItem(key, JSON.stringify(value))
}

// 取出应用存储信息 兼容app内或h5
export const getAppStorageFn = async (key, cb) => {
    if (isApp) return await appBridge('getStorage', key, (val) => cb(val))
    cb(sessionStorage.getItem(key))
}

// 删除应用存储信息 兼容app内或h5
export const deleteAppStorageFn = async (key) => {
    if (isApp) return await appBridge('deleteStorage', key)
    sessionStorage.removeItem(key)
}
