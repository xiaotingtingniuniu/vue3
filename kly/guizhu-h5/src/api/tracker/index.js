import client from '@/api/axios'

// 埋点上报
export async function trackerApi (params) {
    const { data } = await client.post(`/hzgApi/tracking/batch/upload?appKey=${params.appKey}&time=${params.time}&sign=${params.sign}`, params.body, { headers: { 'Content-Type': 'text/plain' } })
    return data
}
