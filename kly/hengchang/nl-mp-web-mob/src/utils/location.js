import store from '@/store'
import { currentLocation, locationTranslate } from '@/api/home'
import { getLocation } from '@/utils/wx'
import { isWx, isApp } from '@/utils'
import { Toast } from 'vant'

const mapKey = process.env.VUE_APP_MAPKEY
const mapKeyName = process.env.VUE_APP_MAPKEYNAME

// 获取当前位置
export const getCurrenLocation = async (useTx = false) => {
    console.log('isApp: ' + window.location.href.includes('isApp=1'))
    if (window.location.href.includes('isApp=1')) return false
    if (localStorage.getItem('settlementData') && window.location.pathname.indexOf('/home') === -1) {
        store.commit('renewLocationPermission', true)
    } else {
        if (isWx && !useTx) {
            getLocation()
        } else if (window.qq && !isApp) {
            const geolocation = new qq.maps.Geolocation(mapKey, mapKeyName)
            await geolocation.getLocation(
                async (e) => {
                    await geocoder(e.lat, e.lng)
                }, (error) => {
                    Toast('定位失败，请开启定位')
                    console.log('定位error:  ' + error)
                    store.commit('renewLocationPermission', false)
                }, { timeout: 5000 }
            )
        }
    }
}

// 逆地址解析
export const geocoder = async (lat, lng) => {
    const params = {
        location: `${lat},${lng}`,
        key: mapKey,
        get_poi: 1
    }
    const res = await currentLocation(params)
    await store.dispatch('updateLocation', res)
    store.commit('renewLocationPermission', true)
}

// 坐标转换
export const locationTranslateFn = async (locations, type) => {
    // 输入的locations的坐标类型
    // 1 GPS坐标
    // 2 sogou经纬度
    // 3 baidu经纬度
    // 4 mapbar经纬度
    // 5 [默认]腾讯、google、高德坐标
    // 6 sogou墨卡托
    const res = await locationTranslate({
        locations,
        type,
        key: mapKey
    })
    return res
}
