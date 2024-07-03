<template>
 <div class="region">
    <div class="content">
        <div class="left">
            地区：
        </div>
        <ul class="area">
            <li :class="[isActive===''?'active':'']" @click="changeActive('')">全部</li>
            <li v-for="item in regionData" :key="item.value" :class="[isActive===item.value?'active':'']" @click="changeActive(item.value)">{{ item.name }}</li>
        </ul>
    </div>
 </div>
</template>

<script setup lang='ts' name="Region">
import { onMounted, ref, defineEmits } from 'vue';
import { HospitalLevelAndRegionResponseData, HospitalLevelAndRegionArr } from '@/api/home/type'
import { reqHospitalLevelAndRegion } from '@/api/home/index'
//存储医院地区数据
let regionData = ref<HospitalLevelAndRegionArr>([]);
//存储医院地区高亮响应式数据
let isActive = ref<string>('');
const emit = defineEmits(['change-region']);
onMounted(()=>{
    //获取医院地区接口
    getHospitalRegion();
});
//获取医院地区接口
const getHospitalRegion=async ()=>{
    //获取医院地区数据
    const result:HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion('beijin');
    console.log('result获取医院地区数据',result);
    if(result.code===200){
        regionData.value = result.data;
    }
    console.log('regionData',regionData.value);
}
//改变医院地区高亮
const changeActive = (value:string)=>{
    console.log('value',value);
    isActive.value = value;
    //触发自定义事件，并传值
    emit('change-region',value);
}
</script>

<style scoped lang="scss">
.region{
    color:#7f7f7f;
    margin-top:10px;
    .content{
        display: flex;
        //文字强制一行显示
        white-space: nowrap;
        .left{
            margin-right:10px;
            margin-top:5px;
        }
        .area{
            display: flex;
            flex-wrap: wrap;
            li{
                margin-right:10px;
                margin-top:5px;
                &.active{
                    color:#55a6fe;
                }
            }
            li:hover{
                color:#55a6fe;
                cursor: pointer;
            }
        }
    }
}
</style>