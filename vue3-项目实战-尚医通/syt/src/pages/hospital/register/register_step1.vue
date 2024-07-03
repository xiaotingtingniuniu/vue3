<template>
    <div class="wrap">
        <!-- 顶部结构 -->
        <div class="top">
            <div class="hosname">{{ workData.baseMap?.hosname }}</div>
            <div class="line">|</div>
            <div>{{ workData.baseMap?.bigname }}</div>
            <div class="dot">.</div>
            <div class="hosdeparment">{{ workData.baseMap?.depname }}</div>
        </div>
        <!-- 中间结构 -->
        <div class="center">
            <h1>{{ workData.baseMap?.workDateString }}</h1>
            <div class="container">
                <div class="item" :class="{ active: item.status == -1 || item.availableNumber == -1,cur:item.workDate==workTime }"
                    v-for="(item, index) in workData.bookingScheduleList" :key="index" @click="changeTime(item)">
                    <div class="top1">
                        {{ item.workDate }} {{ item.dayOfWeek }}
                    </div>
                    <div class="bottom">
                        <div v-if="item.status === -1">
                            停止挂号
                        </div>
                        <div v-else-if="item.status === 0">
                            {{ item.availableNumber == -1 ? "约满了" : `有号(${item.availableNumber})` }}
                        </div>
                        <div v-else-if="item.status === 1">
                            即将放号
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination layout="prev, pager, next" :total="workData.total" v-model:current-page="pageNo"
                @current-change="changePage" />
        </div>
        <!-- 底部结构 -->
        <div class="bottom">
            <!-- 展示放号时间 -->
            <div class="issuance" v-if="workStatus===1">
                <span class="time">2024年6月3日08:30</span>
                <span class="text">放号</span>
            </div>
            <!-- 展示医生信息 -->
            <div class="doctor" v-else>
                <div class="morning">
                    <div class="top">
                        <i class="iconfont icon-shangwu"></i>
                        <span>上午号源</span>
                    </div>
                    <!-- 医生信息 -->
                    <div class="doctor_info" v-for="(item,index) in morningDoctorArr" :key="index">
                        <div class="left">
                            <div class="info">
                                <span>{{ item.title }}</span>
                                <span>｜</span>
                                <span>{{ item.docname }}</span>
                            </div>
                            <div class="skill">
                                {{ item.skill }}
                            </div>
                        </div>
                        <div class="right">
                            <div class="money">
                                ¥{{ item.amount }}
                            </div>
                            <el-button type="primary" size="default" @click="goSelectVisitPerson(item)">{{ item.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
                <div class="afternoon">
                    <div class="top">
                        <i class="iconfont icon-xiawu"></i>
                        <span>下午号源</span>
                    </div>
                    <!-- 医生信息 -->
                    <div class="doctor_info" v-for="(item,index) in afternoonDoctorArr" :key="index">
                        <div class="left">
                            <div class="info">
                                <span>{{ item.title }}</span>
                                <span>｜</span>
                                <span>{{ item.docname }}</span>
                            </div>
                            <div class="skill">
                                {{ item.skill }}
                            </div>
                        </div>
                        <div class="right">
                            <div class="money">
                                ¥{{ item.amount }}
                            </div>
                            <el-button type="primary" size="default" @click="goSelectVisitPerson(item)">{{ item.availableNumber }}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue';
import { reqHospitalWork,reqHospitalWorkDate } from '@/api/ hospital/index'
import { useRoute, useRouter } from 'vue-router';
import { HospitalWorkResponseData, HospitalWork,HospitalWorkDateResponseData,DoctorArr,bookingScheduleList,Doctor } from '@/api/ hospital/type'
import '@/style/icon.scss'
//
//分页器当前页数
const pageNo = ref<number>(1);
//每页展示几条数据
const limit = ref<number>(6);
//获取路由对象
const $route = useRoute();
//获取路由器对象
const $router = useRouter();
console.log('$route', $route.query);
console.log('$router',$router);
const { hoscode, depcode } = $route.query;
//存储医院挂号数据
let workData = ref<HospitalWork>({
    total: 0,
    bookingScheduleList: [],
    baseMap: {
        workDateString: '',
        releaseTime: '',
        bigname: '',
        stopTime: '',
        depname: '',
        hosname: ''
    }
});
//存储医生排班日期：医院挂号数据的第一个
let workTime = ref<string>('');
//存储医生排班日期的上午或者下午
let workStatus = ref<number>(0);
//存储医生信息
let doctorInforArr = ref<DoctorArr>([]);
//组件挂载完毕以后发送一次请求
onMounted(() => {
    getHospitalWork();
});
//获取挂号数据
const getHospitalWork = async () => {
    const result: HospitalWorkResponseData = await reqHospitalWork(pageNo.value, limit.value, hoscode as string, depcode as string);
    console.log('result', result);
    if (result.code === 200) {
        workData.value = result.data;
        //存储第一天排班的日期
        workTime.value = result.data.bookingScheduleList[0].workDate;
        console.log('workTime',workTime.value);
        //存储第一天排班日期的上午或者下午
        workStatus.value = result.data.bookingScheduleList[0].status;
        console.log('workStatus',workStatus.value);
        //获取医生值班信息
        getHospitalDoctor();
    }

}
//修改分页器页数
const changePage = () => {
    getHospitalWork();
}
//获取某一天医生排班的数据
const getHospitalDoctor = async ()=>{
    console.log('hoscode',hoscode);
    const result:HospitalWorkDateResponseData= await reqHospitalWorkDate(hoscode as string,depcode as string,workTime.value);
    console.log('result',result);
    if(result.code===200){
        //存储医生值班信息
        doctorInforArr.value = result.data;
        console.log('doctorInforArr',doctorInforArr.value);
    }
}
//修改排班时间
const changeTime = (item:bookingScheduleList)=>{
    console.log('item',item);
    //存储排班日期
    workTime.value = item.workDate;
    console.log('workTime',workTime.value);
    //存储排班日期的上午或者下午
    workStatus.value = item.status;
    //获取医生值班信息
    getHospitalDoctor();
}
//计算出所有上午排班的医生数组
const morningDoctorArr = computed(()=>{
    return doctorInforArr.value.filter((doc:Doctor)=>{
        return doc.workTime === 0;
    });
});
const afternoonDoctorArr = computed(()=>{
    return doctorInforArr.value.filter((doc:Doctor)=>{
        return doc.workTime === 1;
    });
});

//去选择就诊人页面
const goSelectVisitPerson = (item:Doctor)=>{
    console.log('item',item);
    $router.push({path:'/hospital/register_step2',query:{docId:item.id}});
}
</script>

<style scoped lang="scss">
.wrap {
    .top {
        display: flex;
        color: #7f7f7f;

        .line {
            margin: 0 10px;
        }

        .dot {
            margin: 0 5px;
        }
    }

    .center {
        margin: 20px 0;
        display: flex;
        flex-direction: column;
        align-items: center;

        h1 {
            font-size: 20px;
            color: #7f7f7f;
            font-weight: 900;
        }

        .container {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            margin: 30px 0;

            .item {
                flex: 1;
                border: 1px solid skyblue;
                margin: 0 5px;
                display: flex;
                flex-direction: column;
                align-items: center;
                translate: all .5s;
                &.active {
                    border: 1px solid #ccc;
                    color: #7f7f7f;

                    .top1 {
                        background-color: #ccc;
                    }
                }
                &.cur{
                    transform: scale(1.1);//使div变大1.1倍
                }
                .top1 {
                    background-color: #e8f2ff;
                    height: 30px;
                    line-height: 30px;
                    width: 100%;
                    text-align: center;
                }

                .bottom {
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                    text-align: center;
                }
            }
        }
    }

    .bottom {
        .issuance {
            text-align: center;
            font-weight: 900;
            font-size: 30px;

            .time {
                color: red;
            }

            .text {
                color: skyblue;
            }
        }

        .doctor {
            i {
                color: skyblue;
            }

            .morning,
            .afternoon {
                display: flex;
                color: #7f7f7f;
                font-weight: 900;
                flex-direction: column;
                justify-content: center;

                .doctor_info {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    border-bottom: 1px solid #7f7f7f;

                    .left {
                        .info {
                            color: skyblue;
                            margin: 10px 0;

                            span {
                                margin: 0 5px;
                                font-size: 18px;
                                font-weight: 900;
                            }
                        }

                        .skill {
                            margin: 10px 0;
                        }
                    }

                    .right {
                        width: 150px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        .money{
                            color:#7f7f7f;
                            font-weight: 900;
                        }
                    }
                }
            }
        }
    }
}
</style>