import client from '@/utils/request'
// 获取 Android 下载地址
export const downAndPath = (data) => {
    return client({
        url: '/thy/admin/consumer/getAppUpgrade',
        method: 'post',
        data: {
            osType: 1 // 系统类型 0：ios 1：android
        }
    })
}
