import client from '@/api/axios'
import settings from '@/settings'
import { getTime } from '@/utils'

export const addFeedback = param => {
    const params = Object.assign({
        systems: settings.system,
        timestamp: getTime(), // 请求时间
        feedbackContend: '', // 反馈内容
        feedbackPhone: '' // 反馈手机号
    }, param)
    return client({
        url: '/hzgApi/guizhu/feedback/add',
        method: 'POST',
        data: params
    })
}
