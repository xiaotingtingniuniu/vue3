<template>
    <div>
        <!-- 首页轮播图 -->
        <Carousel />
        <!-- 首页搜索医院form表单区 -->
        <Search />
        <!-- 底部展示医院的结构 -->
        <el-row :gutter="20">
            <el-col :span="20">
                <!-- 等级组件 -->
                <Level @change-level="changLevel"/>
                <!-- 地区组件 -->
                <Region @change-region="changeRegion"/>
                <!-- 展示医院的结构 -->
                <div class="hospital" v-if="hasHospitalArr.length>0">
                    <Card v-for="(item,index) in hasHospitalArr" :key="index" class="item" :hospitalInfo="item"/>
                </div>
                <el-empty v-else description="暂无数据" />
                <!-- 展示分页器 -->
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="pageSize"
                    :page-sizes="[10, 20, 30, 40]"
                    :background="true"
                    layout="prev, pager, next, jumper, ->, sizes, total"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                />
            </el-col>
            <el-col :span="4">
                <Tip/>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang='ts'>
//引入局部组件（首页轮播图组件）
import Carousel from './carousel/index.vue'
//引入局部组件（首页搜索的组件）
import Search from './search/index.vue'
//引入局部组件（首页等级组件）
import Level from './level/index.vue'
//引入局部组件（首页地区选择组件）
import Region from './region/index.vue'
//引入局部组件（首页医院卡片组件）
import Card from './card/index.vue'
//引入局部组件（右侧的结构）
import Tip from './tip/index.vue'
//分页器需要的数据
import {ref,onMounted} from 'vue';
import {reqHospital} from '@/api/home/index'
//引入数据类型
import type { Content,HospitalResponseData } from '@/api/home/type'
//分页器当前页码
let pageNo = ref<number>(1);
//一页展示几条数据
let pageSize = ref<number>(10);
//存储已有医院的数据
let hasHospitalArr = ref<Content>([]);
//存储医院总个数
let total = ref<number>(0);
//存储医院等级的响应式数据
let hospitalLevel = ref<string>('');
//存储医院地区的响应式数据
let hospitalRegion = ref<string>('');
//组件挂载完毕：发送请求
onMounted(()=>{
    console.log('挂载');
    //获取已有医院的数据
    getHospitalInfo();
});
//获取已有医院的数据
const getHospitalInfo = async()=>{
    console.log('进入getHospitalInfo');
    //获取医院的数据：默认获取第一页，一页10条数据
    const result: HospitalResponseData= await reqHospital(pageNo.value,pageSize.value,hospitalLevel.value,hospitalRegion.value);
    console.log('result获取已有医院的数据',result);
    if(result.code === 200){
        //存储已有医院的数据
        hasHospitalArr.value = result.data.content;
        //存储医院的总个数
        total.value = result.data.totalElements;
    }
}
//修改分页器一页展示几条数据
const handleSizeChange = ()=>{
    console.log('修改分页器一页展示几条数据');
    getHospitalInfo();
}
//修改分页器当前页码
const handleCurrentChange = ()=>{
    console.log('修改分页器当前页码')
    getHospitalInfo();
}
//修改医院等级的方法(从子组件传来level的方法)
const changLevel = (level:string)=>{
    console.log('修改医院等级的方法level',level);
    hospitalLevel.value=level;
    //获取level的医院数据
    getHospitalInfo();
}
//修改医院地区的方法(从子组件传来的region的方法)
const changeRegion = (region:string)=>{
    console.log('修改医院地区的方法region',region);
    hospitalRegion.value=region;
    //获取地区的医院数据
    getHospitalInfo();
}
</script>

<style scoped lang="scss">
.hospital{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin:10px 0;
    .item{
        width:48%;
        margin:10px 0;
    }
}
</style>