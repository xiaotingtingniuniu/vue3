
import client from './axios'

const appId = process.env.VUE_APP_WX_APPID // appId
const secret = process.env.VUE_APP_WX_SECRET
// 查询签约状态
export const getWxOpenid = code => {
    return client({
        url: `/wx-api/sns/oauth2/access_token?appid=${appId}&secret=${secret}&code=${code}&grant_type=authorization_code`,
        method: 'get'
    })
}
