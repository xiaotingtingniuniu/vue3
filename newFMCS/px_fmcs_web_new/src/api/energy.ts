import { http } from "@/utils/http";
import { DATA_LINKS } from '@/api/helper/servicePort'

type Result = {
  success: boolean;
  data?: Obkect<any>;
};
/**
 能源接口
 **/
//能源首页-超标报警
export const warnSeach = (data: object | undefined) => {
  return http.request<Result>("post", "/energy/api/v1/overrate/alarm", { data });
}
// http.post(`${DATA_LINKS}/energy/api/v1/overrate/alarm`, params, { headers: { noLoading: true } })
//能源首页-部门成本分析
export const costSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/consume`, params, { headers: { noLoading: true } })
// 能源首页-电量分布
export const elecSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/electricDist`, params, { headers: { noLoading: true } })
//能源首页-生产情况
export const produceSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/produce/statistics`, params, { headers: { noLoading: true } })
//能源首页-部门用能排名
export const rankSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/top`, params, { headers: { noLoading: true } })
//能源首页-使用量指数
export const usedSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/usage`, params, { headers: { noLoading: true } })
//能源首页-折合标准煤
export const tceSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/yearCoal`, params, { headers: { noLoading: true } })
// 区域查询top10
export const rgnSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/top/area`, params, { headers: { noLoading: true } })
// 设备查询top10
export const eqtSeach = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/top/device`, params, { headers: { noLoading: true } })
// 使用量
export const used = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/top/device`, params, { headers: { noLoading: true } })
// 用能图标展示
export const egShow = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/table`, params, { headers: { noLoading: true } })
// 区域用能展示1
export const newrgntablelList = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/table/area2`, params, { headers: { noLoading: true } })
// 设备用能展示1
export const neweqttablelList = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/energy/table/equipment2`, params, { headers: { noLoading: true } })
// 生产指数
export const statisticsList = (params: object | undefined) =>
  http.post(`${DATA_LINKS}/energy/api/v1/produce/statistics`, params, { headers: { noLoading: true } })
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", "/user", { data });
};