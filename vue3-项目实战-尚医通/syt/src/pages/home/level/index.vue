<template>
   <div class="level">
      <h1>医院</h1>
      <div class="content">
         <div class="left">
            等级：
         </div>
         <ul class="hospital">
            <li :class="[isActive===''?'active':'']" @click="changeActive('')">全部</li>
            <li v-for="item in levelData" :key="item.value" :class="[isActive===item.value?'active':'']" @click="changeActive(item.value)">{{ item.name }}</li>
         </ul>
      </div>
   </div>
</template>

<script setup lang='ts' name="Level">
import { onMounted, ref, defineEmits } from "vue";
import { reqHospitalLevelAndRegion } from "@/api/home/index"
import {HospitalLevelAndRegionResponseData,HospitalLevelAndRegionArr} from "@/api/home/type"
//存储医院等级的数据
let levelData = ref<HospitalLevelAndRegionArr>([]);
//存储医院等级高亮响应式数据
let isActive = ref<string>('');
//向外派发自定义事件
const emit = defineEmits(['change-level']);
onMounted(()=>{
   //获取医院的等级
   getHospitalLevel();
});
//获取医院的等级
const getHospitalLevel= async()=>{
   const result:HospitalLevelAndRegionResponseData = await reqHospitalLevelAndRegion("hostype");
   console.log('result获取医院的等级',result);
   if(result.code === 200) {
      levelData.value = result.data;
   };
   console.log('levelData',levelData.value);
}  
//修改医院等级高亮
const changeActive = (value:string)=>{
   console.log('value',value);
   isActive.value = value;
   //触发自定义事件并传值
   emit('change-level',value);
}
</script>

<style scoped lang="scss">
.level {
   color: #7f7f7f;

   h1 {
      font-size: 14px;
      font-weight: 900;
      margin: 10px 0;
   }

   .content {
      display: flex;

      .left {
         margin-right: 10px;
      }

      .hospital {
         display: flex;

         li {
            margin-right: 10px;

            &.active {
               color: #55a6fe;
            }
         }

         li:hover {
            color: #55a6fe;
            cursor: pointer;
         }
      }
   }
}</style>