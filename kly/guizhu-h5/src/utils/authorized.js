import store from '@/store'

const authorized = {
    authority: [],
    init: function (array) {
        const authority = array.filter((item) => item.serverId === 200).map(item => item.anchors)[0]
        this.authority = authority
        return this.authority
    },
    check: function (currentAuthority) {
        if (!currentAuthority) return false
        const nextAuthority = Array.isArray(currentAuthority) ? currentAuthority : [currentAuthority]
        let authorityFlg = false
        nextAuthority.map((item) => {
            if (store.state.menuList.includes(item)) authorityFlg = true
        })

        return authorityFlg
    }

}

export default authorized
