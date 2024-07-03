<template>
    <div class="container">
        <h1 class="tip">确认挂号信息</h1>
        <!-- 卡片：展示就诊人信息 -->
        <el-card class="box-card">
            <!-- 卡片的头部 -->
            <template #header>
                <div class="card-header">
                    <span>请选择就诊人</span>
                    <el-button type="primary" size="default" :icon="User" @click="goPatient">添加就诊人</el-button>
                </div>
            </template>
            <!-- 卡片的身体部分 展示就诊人信息-->
            <div class="user">
                <Visitor v-for="(item,index) in userArr" :key="item.id" class="visitor" :user="item" @click="changeIndex(index)" :index="index" :currentIndex="currentIndex"/>
            </div>
        </el-card>
        <!-- 卡片：展示医生的信息 -->
        <el-card>
            <!-- 卡片的头部 -->
            <template #header>
                <div class="card-header">
                    <span>挂号信息</span>
                </div>
            </template>
            <!-- 卡片的身体部分 -->
            <el-descriptions class="margin-top" title="" :column="2" size="small" border>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊日期：
                        </div>
                    </template>
                    {{ docInfor.workDate }} {{ docInfor.param?.dayOfWeek }} 上午
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊医院：
                        </div>
                    </template>
                    {{ docInfor.param?.hosname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            就诊科室：
                        </div>
                    </template>
                    {{ docInfor.param?.depname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生姓名：
                        </div>
                    </template>
                    {{ docInfor.docname }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生职称：
                        </div>
                    </template>
                    {{ docInfor.title }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医生专长：
                        </div>
                    </template>
                    {{ docInfor.skill }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">
                            医事服务费：
                        </div>
                    </template>
                    {{ docInfor.amount }}
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
        <!-- 确定挂号按钮 -->
        <div class="sure">
            <el-button type="primary" size="default" :disabled="currentIndex===-1?true:false" @click="submitOrder">确定挂号</el-button>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { User } from '@element-plus/icons-vue'
import { onMounted, ref } from 'vue';
import { useRoute,useRouter } from 'vue-router';
//引入获取某一账号下就诊人信息接口

import {reqSubmitOrder,reqAllPatient} from '@/api/user/index'
import {AllPatientResponseData,AllPatient,SubmitOrderResponseData} from '@/api/user/type'
import {DoctorInforResponseData } from '@/api/ hospital/type'
import { reqGetDoctorInfor } from '@/api/ hospital';
import { ElMessage } from 'element-plus';
//获取路由对象
const $route = useRoute();
//获取路由器对象
const $router = useRouter();
const { docId } = $route.query;
console.log('docId', docId);
//存储全部就诊人信息
const userArr = ref<AllPatient>([]);
//存储医生信息
const docInfor = ref<any>({});
//存储用户确定就诊人索引值
const currentIndex = ref<number>(-1);
onMounted(() => {
    //获取就诊人信息
    getUser();
    //获取某个挂号医生的信息
    getDoctor();
});
//获取就诊人信息
const getUser = async () => {
    const result: AllPatientResponseData = await reqAllPatient();
    console.log('result', result);
    if (result.code === 200) {
        userArr.value = result.data;
        console.log('userArr', userArr.value);
    }
}
//获取医生信息
const getDoctor = async () => {
    const result: DoctorInforResponseData = await reqGetDoctorInfor(docId as string);
    if (result.code === 200) {
        docInfor.value = result.data;
        console.log('docInfor', docInfor.value);
    }
}
//点击就诊人卡片进行切换
const changeIndex = (index:number)=>{
    currentIndex.value = index;
    console.log('currentIndex',currentIndex.value);
}
//确定挂号按钮
const submitOrder = async ()=>{
    //医院编号和医生排班id
    const {hoscode,id} = docInfor.value;
    //就诊人id
    const patientId = userArr.value[currentIndex.value].id;
    //提交订单
    const result:SubmitOrderResponseData = await reqSubmitOrder(hoscode,id,patientId);
    if(result.code===200){
        //带着订单编号跳转路由
        $router.push({path:'/user/order',query:{orderId:result.data}})
    }else{
        ElMessage({
            type:'error',
            message:result.message
        });
    }
}
//跳转到就诊人管理页面
const goPatient = ()=>{
    $router.push({path:'/user/patient',query:{type:'add'}});
}
</script>

<style scoped lang="scss">
.container {
    .tip {
        font-weight: 900;
        color: #7f7f7f;
        font-size: 20px;
    }

    .box-card {
        margin: 20px 0;

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .user {
            display: flex;
            flex-wrap: wrap;

            .visitor {
                width: 32%;
                margin: 5px;
            }
        }
    }

    .sure {
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }
}
</style>