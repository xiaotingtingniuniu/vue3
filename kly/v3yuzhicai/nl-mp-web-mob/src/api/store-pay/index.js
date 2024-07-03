import client from '@/utils/request'

// 获取可领取的优惠券
export const getCouponListApi = (data) => {
    const params = Object.assign({
        promoCode: 'MP1653320134430j7IA3' // 1 用户
    }, data)
    return client({
        url: '/api/marketing/mms/arrival/coupon/promo',
        method: 'get',
        params
    })
}

// 获取手机验证码
export const getMobileCode = (data) => {
    const params = Object.assign({
        userType: 1, // 1 用户
        mobile: '' // 手机号
    }, data)
    return client({
        url: '/api/user/ums/arrival/user/sendSms',
        method: 'post',
        data: params
    })
}

// 领取优惠券
export const receiveCoupon = (data) => {
    const params = Object.assign({
        userType: 1, // 1 用户
        mobile: '', // 手机号
        couponBatchCodeList: [], // 优惠编号券列表
        shopCode: '', // 店铺编号
        code: '' // 短信验证码
    }, data)
    return client({
        url: '/api/user/ums/arrival/user/login',
        method: 'post',
        data: params
    })
}

// 获取以领取的优惠券
export const getCouponList = (data) => {
    const params = Object.assign({
        productLine: '2', // 产品线 2-本地生活|到店
        userId: '', // 用户 id
        storeId: '' // 店铺 id
    }, data)
    return client({
        url: '/api/marketing/mms/arrival/coupon/list',
        method: 'get',
        params
    })
}
