
import client from '@/api/axios'

// 获取分账比例列表
export const ledgerList = (params) => client({
    url: `/hzgApi/guizhu/feedback/add${params}`,
    method: 'get'
})

// 编辑结算
export const amount = (params) => client({
    url: '/hzgApi/guizhu/feedback/add',
    method: 'POST',
    data: params
})

// 根据姓名 手机号 筛选
export const filterDate = (params) => client({
    url: '/hzgApi/guizhu/feedback/filter',
    method: 'POST',
    data: params
})
