import client from '@/api/axios'

export function collegeRecommend (data) {
    return client({
        url: '/hzgApi/guizhu/college/recommend',
        method: 'post',
        data
    })
}
export function collegeCategory (data) {
    return client({
        url: '/hzgApi/guizhu/college/category',
        method: 'post',
        data
    })
}
export function collegeDetail (params) {
    console.log(params)
    return client({
        url: '/hzgApi/guizhu/college/detail/' + params.id,
        method: 'get'
        // params
    })
}
