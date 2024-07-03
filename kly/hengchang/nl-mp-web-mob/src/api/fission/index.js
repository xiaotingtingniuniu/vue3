import client from '@/utils/request'
//

// 查询用户的邀请码
export async function getInvitationCode () {
    const params = Object.assign({
        activityType: '1' // 拉新裂变
    })
    const { data } = await client.post('/api/user/ums/user/invitationCode', params)
    return data
}

// 邀请记录
export async function getInviteList () {
    const params = Object.assign({
        activityType: '1' // 拉新裂变
    })
    const { data } = await client.post('/api/user/ums/user/invitationRelation', params)
    return data
}

// 活动信息
export function getActivityInfo () {
    const params = Object.assign({
        promoPageKey: 'dict_promo_fission_page' // 活动落地页 key 编码
        // promoCode: 'MP1655541935742WE6b3' // 活动编码
    })
    return client.post('/api/marketing/mms/activity/v1/coupon/fission', params)
}

// 活动信息(不需要登录)
export function getActivityInfoNoLogin () {
    const params = Object.assign({
        promoPageKey: 'dict_promo_fission_page' // 活动落地页 key 编码
        // promoCode: 'MP1655541935742WE6b3' // 活动编码
    })
    return client.post('/api/marketing/mms/activity/v1/coupon/fission/noLogin', params)
}

// 注册领券
export function register (param) {
    const params = Object.assign({
        userType: 1, // 1、用户 2、商家 3、后台管理  目前传1
        mobile: '', // 手机号
        code: '', // 手机验证码
        invitationCode: '', // 邀请码
        promoPageKey: 'dict_promo_fission_page', // 活动落地页 key 编码
        promoCode: '' // 活动编码
    }, param)
    return client.post('/api/user/ums/user/loginByInvitation', params)
}

// 注册领券
export function received () {
    const params = Object.assign({
        promoPageKey: 'dict_promo_fission_page' // 活动落地页 key 编码
    })
    return client.post('/api/marketing/mms/activity/v1/coupon/fission/received', params)
}

// 活动分享
export function fissionShare (param) {
    const params = Object.assign({
        activityType: 1,
        promoPageKey: 'dict_promo_fission_page', // 活动落地页 key 编码
        invitationBatchCodeList: [], // 优惠券批次 arr
        promoCode: '' // 活动编码
    }, param)
    return client.post('/api/marketing/mms/activity/v1/coupon/fission/share', params)
}
