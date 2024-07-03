//定义医院详情的仓库
import { defineStore } from 'pinia';
//引入获取医院详情的接口
import {reqHospitalDetail,reqHospitalDepartment} from '@/api/ hospital/index.ts'
//引入详情数据的ts类型
import type {HospitalDetailData,HospitalDepartmentData,HospitalDetail,HospitalDepartmentArr} from '@/api/ hospital/type'
//引入仓库的医院详情的数据类型
import type {DetailState} from '@/store/modules/interface/index'
//pinia仓库写法：组合式、选项式API写法
const useDetailStore = defineStore('Detail',{
    state:():DetailState => {
        return {
            //医院详情的数据
            hospitalInfo:({} as HospitalDetail),
            //存储医院科室的数据
            hospitalDepartment:([] as HospitalDepartmentArr)
        }
    },
    actions:{
        //获取医院详情的方法
        async getHospital(hoscode:string){
            console.log('hoscode',hoscode);
            let result:HospitalDetailData = await reqHospitalDetail(hoscode);
            console.log('result',result);
            if(result.code === 200) {
                //存储数据
                this.hospitalInfo = result.data;
            }
        },
        async getHospitalDepartment(hoscode:string){
            const result:HospitalDepartmentData = await reqHospitalDepartment(hoscode);
            console.log('result',result);
            if(result.code===200){
                //存储数据
                this.hospitalDepartment = result.data;
                console.log('hospitalDepartment',this.hospitalDepartment);
            }
        }
    },
    getters:{

    }
});
//获取仓库的方法对外暴露
export default useDetailStore