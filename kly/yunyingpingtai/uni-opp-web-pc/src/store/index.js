import { createStore } from 'vuex'
import { getQueryVariable, delParam } from '@/utils'
import { logoutApi, userResource, userResourceApi } from '@/api/login'
import router from '@/router'

export default createStore({
    state: {
        token: null,
        // 侧边栏收起
        isCollapse: false,
        userInfo: null,
        acctId: null,
        userResourceTree: null,
        menuTree: null,
        organizationList: [], // 组织下拉
        organizationTreeList: [], // 组织树
        roleList: [], // 角色下拉
        curOrganization: null,
        curRole: null,
        rowData: null

    },
    mutations: {
        menuTreeFn (state, payload) {
            state.menuTree = payload
        },
        init () {
            const url = window.location.href
            // 各系统退出登录时 处理回传的 logout
            if (url.indexOf('/login')) {
                const isLogout = getQueryVariable('logout')
                if (isLogout) {
                    this.dispatch('logoutFn', true, 'replace')
                }
            }
            // 校验系统回跳
            const coreCode = getQueryVariable('coreCode')
            if (coreCode) {
                localStorage.setItem('HSH-UNIFY-TOKEN', coreCode)
                window.location.replace(delParam('coreCode'))
            }
            // 常规登录信息同步
            const token = localStorage.getItem('HSH-UNIFY-TOKEN')
            const userInfo = localStorage.getItem('userInfo')
            if (token) {
                this.commit('syncToken', token)
                this.commit('setUserInfo', JSON.parse(userInfo))
            }
        },
        setUserResourceTree (state, payload) {
            state.userResourceTree = payload
        },
        collapseTrigger (state) {
            state.isCollapse = !state.isCollapse
        },
        // 同步token
        syncToken (state, token) {
            state.token = token
            localStorage.setItem('HSH-UNIFY-TOKEN', token)
            this.dispatch('userResourceFn')
        },
        removeToken (state) {
            state.token = null
            localStorage.removeItem('HSH-UNIFY-TOKEN')
        },
        setUserInfo (state, userInfo) {
            state.userInfo = userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        },
        setOrganizationList (state, list) {
            state.organizationList = list
        },
        setOrganizationTreeList (state, list) {
            state.organizationTreeList = list
        },
        setRoleList (state, list) {
            state.roleList = list
        },
        setCurOrganization (state, val) {
            state.curOrganization = val
            localStorage.setItem('HSH-CUR-ORGANIZATION', JSON.stringify(val || []))
        },
        setCurRole (state, val) {
            state.curRole = val
            localStorage.setItem('HSH-CUR-ROLE', val || '')
        },
        setRowData (state, val) {
            state.rowData = val
            sessionStorage.setItem('rowData', JSON.stringify(val) || null)
        }
    },
    actions: {
        async logoutFn ({ commit, state }, isRequest = true, payload = '') {
            if (isRequest && state.token) await logoutApi({ appKey: 'A1001000', busiCode: 'A1001000' })
            commit('removeToken')
            localStorage.removeItem('HSH-CUR-ORGANIZATION')
            localStorage.removeItem('HSH-CUR-ROLE')
            if (payload === 'replace') return window.location.replace(delParam('logout'))
            if (window.location.pathname !== '/login') {
                window.location.href = window.origin + '/login'
            }
        },
        async userResourceFn ({ commit, state }) {
            const role = JSON.parse(localStorage.getItem('HSH-CUR-ORGANIZATION') || '[]')
            const res = await userResourceApi({
                organizationId: role.length ? role[role.length - 1] : '',
                roleIds: localStorage.getItem('HSH-CUR-ROLE') || ''
            })
            if (res.code === '200') {
                commit('setUserResourceTree', res.data.menuList)
                const website = router.options.routes.filter(item => item.path === '/website')
                const routerTree = website[0].children
                const serverIds = res.data.menuList ? res.data.menuList.map(item => item.serverId) : []
                // for (let i = 0; i < routerTree.length; i++) {
                //     const element = routerTree[i]
                //     if (element.meta.serverId && !serverIds.includes(element.meta.serverId)) {
                //         routerTree.splice(i, 1)
                //     }
                // }
                let len = routerTree.length - 1
                while (len >= 0) {
                    const element = routerTree[len]
                    if (element.meta.serverId && !serverIds.includes(element.meta.serverId)) {
                        routerTree.splice(len, 1)
                    }
                    len--
                }
                commit('menuTreeFn', routerTree)
                commit('setOrganizationList', res.data.selectList)
                commit('setOrganizationTreeList', res.data.selectTreeList)
                // commit('setCurOrganization', res.data.selected?.organizationId || null)
                commit('setCurOrganization', res.data.selected.orgIdList || [])
                commit('setCurRole', Number(res.data.selected?.roleIds) || null)
                let i = 0
                while (i < res.data.selectList.length) {
                    const el = res.data.selectList[i]
                    if (el.organizationId === res.data.selected.organizationId) {
                        commit('setRoleList', el.roleList)
                        return
                    }
                    i++
                }
            }
        }
    }
})
