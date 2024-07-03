import { createStore } from 'vuex'
import { counterInfoIndexList, indexShop, webAccessToken } from '@/api/home'
import { personalInformation, loginout } from '@/api/login'
import { cartTotal } from '@/api/shopping-cart'
import { isIos, isApp } from '@/utils'
import { appBridge, registerhandler } from '@/utils/bridge'

const store = createStore({
    state: {
        isApp: true,
        /* 定位相关 flag */
        locationStamp: '', // 是否自动拉取过定位
        locationPermission: false, // 定位权限
        /* 定位信息 */
        lat: null,
        lng: null,
        province: '北京市',
        city: null,
        adcode: '110000',
        /* 柜子&&店铺 */
        counterInfo: JSON.parse(sessionStorage.getItem('optimalCounter')) || null, // 最优货柜的信息 (包含 自动分的 / 手动选的)
        storeInfo: JSON.parse(sessionStorage.getItem('optimalStore')) || null, // 最优店铺的信息 (包含 自动分的 / 手动选的)
        /* 登陆 个人 start */
        token: null,
        userInfo: null,
        /* 登陆 个人 end */
        cartNum: 0, // 菜单角标 购物车中商品数量
        // 加载层
        loading: false,
        loadStartTime: null,
        loadCount: 0,
        carChoose: JSON.parse(localStorage.getItem('carChoose')) || [], // 购物车选择保存
        orderTabActive: '',
        // 结算时选中的优惠券
        currentActiveCoupon: JSON.parse(localStorage.getItem('currentActiveCoupon')) || null,
        couponList: JSON.parse(localStorage.getItem('couponList')) || null,
        // 页面临时数据存贮
        settlementData: JSON.parse(localStorage.getItem('settlementData')) || '',
        // 验证是否微信授权 不做实际用处
        wxCode: sessionStorage.getItem('wxCode') || null,
        openId: sessionStorage.getItem('openId') || null,
        // 微信分享时需用到的链接 (ios路由切换地址不变)
        wxSignUrl: isIos ? window.location.href : null,
        menuSearchVal: ''
    },
    mutations: {
        setMenuSearchVal (state, payload) {
            state.menuSearchVal = payload
        },
        setWxCode (state, payload) {
            state.wxCode = payload
            sessionStorage.setItem('wxCode', payload)
        },
        // 是否授权定位
        renewLocationPermission (state, payload) {
            state.locationStamp = payload
            state.locationPermission = payload
        },
        // 配置由 定位 取到的信息
        setLocation (state, payload) {
            state.lat = payload.location.lat
            state.lng = payload.location.lng
            state.city = payload.ad_info.city
            state.province = payload.ad_info.province
            state.adcode = payload.ad_info.adcode
        },
        changeAdcode (state, payload) {
            state.province = payload.name
            state.adcode = payload.code
        },
        // 更新 最优货柜的信息
        updateCounterInfo (state, payload) {
            state.counterInfo = payload
            // 将最优货柜做记录 给获取不到时使用
            sessionStorage.setItem('optimalCounter', JSON.stringify(payload))
        },
        // 更新 最优店铺的信息
        updateStoreInfo (state, payload) {
            state.storeInfo = payload
            // 将最优货柜做记录 给获取不到时使用
            sessionStorage.setItem('optimalStore', JSON.stringify(payload))
        },
        // 同步token
        syncToken (state, token) {
            state.token = token
            localStorage.setItem('yzc-token', token)
        },
        syncUserInfo (state, userInfo) {
            state.userInfo = userInfo
            localStorage.setItem('yzc-userInfo', JSON.stringify(userInfo))
        },
        removeInfo (state) {
            state.token = null
            state.userInfo = null
            localStorage.removeItem('yzc-token')
            localStorage.removeItem('yzc-userInfo')
        },
        // 我的 订单 tab
        setOrderTabActive (state, active) {
            state.orderTabActive = active
        },
        // 加载层计算
        loading (state, payload) {
            state.loadCount = state.loadCount + Number(payload)
            if (state.loadCount <= 0) {
                state.loadCount = 0
                this.commit('changeLoadState', false)
            } else {
                this.commit('changeLoadState', true)
            }
        },
        changeLoadState (state, payload) {
            const date = new Date()
            if (payload) {
                state.loading = true
                state.loadStartTime = date.getTime()
            } else {
                let timer = 0
                const dffiTime = date.getTime() - state.loadStartTime
                if (dffiTime >= 200) return (state.loading = false)
                timer = 200 - dffiTime
                setTimeout(() => { state.loading = false }, timer)
            }
        },
        setcarChoose (state, value) {
            state.carChoose = value
            localStorage.setItem('carChoose', JSON.stringify(value))
        },
        syncCarChoose (state) {
            state.carChoose = JSON.parse(localStorage.getItem('carChoose'))
        },
        setCartNum (state, value) {
            state.cartNum = value
        },
        /** 结算数据保存 / 重置 */
        settlementSave (state, value) {
            // 字段的转换
            value.skuList = value.skuList.map(item => {
                return {
                    ...item,
                    commodityAmount: item.sellPrice * item.quantity,
                    commodityId: item.id,
                    commodityName: item.name,
                    commodityNumber: item.commodityCode,
                    commodityQuantity: item.quantity,
                    commoditySecCid: item.classId,
                    commodityUnitPrice: item.sellPrice,
                    commodityUrl: item.logo
                }
            })
            localStorage.setItem('settlementData', JSON.stringify(value))
            state.settlementData = value
        },
        setCouponList (state, value) {
            localStorage.setItem('couponList', JSON.stringify(value))
            state.couponList = value
        },
        setCurrentActiveCoupon (state, value) {
            localStorage.setItem('currentActiveCoupon', JSON.stringify(value))
            state.currentActiveCoupon = value
        }
    },
    actions: {
        // 动态更新定位 + 联动信息(匹配 货柜)
        async updateLocation ({ state, commit, dispatch }, payload) {
            if (state.lat !== payload.location.lat && state.lng !== payload.location.lng) {
                commit('setLocation', payload)
                const counter = await counterInfoIndexList({
                    longitude: state.lng,
                    latitude: state.lat
                })
                if (!counter.length) return false
                if (counter.length) await dispatch('updateCounter', counter[0])
            }
        },
        // 动态更新货柜(payload === counterInfo) + 联动信息(匹配 店铺)
        async updateCounter ({ commit }, payload) {
            commit('updateCounterInfo', payload)
            if (payload) {
                // 根据柜子 获取店铺
                const store = await indexShop({
                    containerId: payload.id,
                    longitude: payload.longitude,
                    latitude: payload.latitude
                })
                if (store) commit('updateStoreInfo', store.storeInfo)
            }
        },
        // 登录了
        async updateToken ({ commit, dispatch }, payload) {
            commit('syncToken', payload)
            await dispatch('updateUserInfo')
        },
        async updateUserInfo ({ commit }) {
            const { data } = await personalInformation()
            commit('syncUserInfo', data)
        },
        // 退出了
        async logout ({ commit }) {
            const { code } = await loginout()
            if (code === 200) commit('removeInfo')
        },
        // 更新购物车角标
        async updateCartNum ({ state, commit }) {
            if (isApp) appBridge('changeCartCount')
            const { totalQuantity } = await cartTotal({ storeId: state.storeInfo.id })
            if (totalQuantity) {
                commit('setCartNum', totalQuantity > 99 ? '99+' : totalQuantity)
            } else {
                commit('setCartNum', 0)
            }
        },
        async getOpenId ({ state }, code) {
            const { openid } = await webAccessToken({ code })
            state.openId = openid
            sessionStorage.setItem('openId', openid)
        },
        // token + userInfo => init
        async dataInit ({ state, commit }) {
            if (isApp) {
                appBridge('getToken', {}, (payload) => {
                    if (payload) (state.token = payload)
                })
                appBridge('getStoreInfo', {}, (payload) => {
                    this.commit('updateStoreInfo', payload)
                })
                appBridge('getCounterInfo', {}, (payload) => {
                    this.commit('updateCounterInfo', payload)
                    // this.dispatch('updateCartNum')
                })
                registerhandler('appLogin', () => {
                    appBridge('getToken', {}, (payload) => {
                        if (payload) (state.token = payload)
                    })
                })
                registerhandler('homeCartAdd', (data) => {
                    commit('setcarChoose', [...new Set([...state.carChoose, ...data])])
                })
            } else {
                const token = localStorage.getItem('yzc-token')
                const userInfo = localStorage.getItem('yzc-userInfo')
                if (token && userInfo) {
                    state.token = token
                    state.userInfo = JSON.parse(userInfo)
                } else if (token && !userInfo) {
                    await this.dispatch('updateUserInfo')
                }
            }
        }
    }
})

export default store
