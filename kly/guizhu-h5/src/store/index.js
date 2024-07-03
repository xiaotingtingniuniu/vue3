import { createStore } from 'vuex'
import { getUserInfo, isDevelopVConsole } from '@/utils/composables'
import { fetchUserPermission, getManagerInfo } from '@/api/login'
import authorized from '@/utils/authorized'
import { registerhandler } from '@/utils/bridge'
import { setAppStorageFn } from '@/utils/storage'

export default createStore({
    state: {
        locationOrigin: '', // 跳转域名
        phone: '13122221111', // 手机号码
        token: '',
        // 用户信息
        userInfo: {},
        // 权限列表
        menuList: [],
        roleName: '',
        accountName: '',
        accountId: '',
        wxCode: '',
        mobile: '',
        goodsList: [],
        workerDetail: {},
        // 加载层
        loading: false,
        loadStartTime: null,
        loadCount: 0,
        merchantInfo: null,
        contractData: {},
        pointData: {},
        pointAddress: {},
        modify: {},
        busiCode: '' // 当前登陆角色的业务线
    },
    mutations: {
        setphone (state, phone) {
            state.phone = phone
        },
        setlocationOrigin (state, url) {
            state.locationOrigin = url
        },
        setToken (state, token) {
            state.token = token
        },
        setUserInfo (state, payload) {
            state.userInfo = payload
        },
        getMenuList (state, payload) {
            state.menuList = payload
        },
        getAccount (state, payload) {
            state.accountId = payload
        },
        getRoleNames (state, payload) {
            state.roleName = payload
        },
        getBusicode (state, payload) {
            state.busiCode = payload
        },
        getAccountName (state, payload) {
            state.accountName = payload
        },
        getAccountPhone (state, payload) {
            state.mobile = payload
        },
        setWxCode (state, payload) {
            state.wxCode = payload
        },
        setGoodsList (state, good) {
            state.goodsList = good
        },
        setWorkerDetail (state, detail) {
            state.workerDetail = detail
        },
        modifyinfo (state, payload) {
            state.modify = payload
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
                setTimeout(() => {
                    state.loading = false
                }, timer)
            }
        },
        setContractData (state, payload) {
            state.contractData = payload
        },
        setPointData (state, payload) {
            state.pointData = payload
        },
        setPointAddress (state, payload) {
            state.pointAddress = payload
        }
    },
    actions: {
        async initPublicData ({ state, dispatch }) {
            registerhandler('appLogin', () => window.location.reload())
            await dispatch('getUserInfoFn')
            await dispatch('getManagerInfos')
            isDevelopVConsole()
            if (state.roleName !== '商家游客') await dispatch('getAuthLists')
        },
        async getUserInfoFn ({ commit }) {
            const data = await getUserInfo()
            commit('setUserInfo', JSON.parse(data))
        },
        async getAuthLists ({ state, commit }) {
            const res = await fetchUserPermission({ groupId: state.userInfo.groupId, roleId: state.userInfo.roleId })
            if (res.code === '200') {
                try {
                    setAppStorageFn('masterPhoneMobile', res?.data?.merchantInfo?.masterPhoneMobile)
                    state.merchantInfo = res.data.merchantInfo
                } catch (error) {}
                try {
                    setAppStorageFn('managerInfo', res.data.merchantInfo)
                } catch (error) {}
                const { permissionInfo } = res.data
                const list = authorized.init(permissionInfo.menuList)
                commit('getMenuList', list)
                sessionStorage.setItem('merchantId', res?.data?.merchantInfo?.busiMerchantId)
                sessionStorage.setItem('merchantName', res.data.merchantName)
            }
        },
        async getManagerInfos ({ state, commit }) {
            const { code, data } = await getManagerInfo({
                busiCode: 'A1001022',
                appKey: 'A1001001',
                token: state.token
            })
            if (code === '200') {
                // try {
                //     setAppStorageFn('managerInfo', data)
                // } catch (error) {}
                commit('getRoleNames', data.loginOrgRole.roleNames)
                commit('getBusicode', data?.loginOrgRole?.merchantBusiCode)
                commit('getAccount', data.account)
                commit('getAccountName', data.name)
                commit('getAccountPhone', data.mobile)
                commit('modifyinfo', data)

                // sessionStorage.setItem('operatorId', data.account)
                // sessionStorage.setItem('operatorName', data.name)
                // sessionStorage.setItem('operatorPhone', data.mobile)

                if (data?.merchantId) sessionStorage.setItem('merchantId', data.merchantId)
                if (data?.account) sessionStorage.setItem('operatorId', data.account)
                if (data?.name) sessionStorage.setItem('operatorName', data.name)
                if (data?.mobile) sessionStorage.setItem('operatorPhone', data.mobile)

                if (data.loginOrgRole.roleNames) {
                    sessionStorage.setItem('roleNames', data.loginOrgRole.roleNames)
                }
            }
        }
    }
})
