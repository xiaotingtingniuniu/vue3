<template>
    <div>
        <el-card shadow="hover" @click="goDetail">
            <div class="content">
                <div class="left">
                    <div class="hospital_name">
                        {{ hospitalInfo.hosname }}
                    </div>
                    <div class="tip">
                        <div class="level">
                            <i class="iconfont icon-dianzan"></i>
                            <span>{{ hospitalInfo.param.hostypeString }}</span>
                        </div>
                        <div class="time">
                            <i class="iconfont icon-shijian"></i>
                            <span>每天{{ hospitalInfo.bookingRule?.releaseTime }}放号</span>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <img :src="`data:image/ipeg;base64,${hospitalInfo.logoData}`" alt="">
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import '@/style/icon.scss'
import { defineProps } from 'vue';
import {useRouter} from 'vue-router'
const props = defineProps(['hospitalInfo']);
//创建路由实例
const $router = useRouter();
//点击卡片时跳转医院详情页
const goDetail=()=>{
    console.log('props',props.hospitalInfo);
    $router.push({path:'/hospital/register',query:{hoscode:props.hospitalInfo.hoscode}});
}
</script>

<style scoped lang="scss">
.content{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .left{
        width:60%;
        .tip{
            margin-top:20px;
            display: flex;
            justify-content: space-between;
            color:#7f7f7f;
            span{
                margin-left:5px;
            }
        }
    }
    .right{
        img{
            width:50px;
            height: 50px;
        }
    }
}
</style>