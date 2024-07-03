<template>
    <div class="search">
        <el-autocomplete 
            clearable 
            placeholder="请输入医院名称" 
            v-model="hospitalName" 
            :fetch-suggestions="querySearch" 
            :trigger-on-focus="false"
            @select="handleSelect"
        />
        <el-button type="primary" :icon="Search">搜索</el-button>
    </div>
</template>

<script setup lang='ts'>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { reqHospitalInfor } from '@/api/home';
import { HospitalInforData,Content } from '@/api/home/type';
import { useRouter } from 'vue-router';
//存储搜索的关键字（医院的名字）
let hospitalName = ref<string>('');
//创建路由对象
let $router = useRouter();
//当用户输入完，次函数执行，发送请求获取需要展示的数据
const querySearch = async (queryString: string, cb:any) => {
    console.log('1111');
    console.log('queryString',queryString);
    console.log('cb',cb);
    //通过输入的关键字，获取需要展示的医院列表数据
    const result:HospitalInforData= await reqHospitalInfor(queryString);
    console.log('result',result);
    //整理获取到的医院信息的数据
    const showData =result.data.map(item=>{
        console.log('item',item);
        return {
            value:item.hosname,//展示医院的名字
            hoscode:item.hoscode//存储医院的编码
        }
    });
    console.log('showData',showData);
    //组件中显示在搜索菜单中的回调函数，可以去看element -plus的文档
    //给组件提供展示的数组
    cb(showData);
}
//点击选中建议项时触发
const handleSelect=(item:{value:string,hoscode:string})=>{
    console.log('item',item);
    //点击推荐项目进入医院详情页，将来需要携带query参数（医院的编码）
    $router.push({path:'/hospital/register',query:{hoscode:item.hoscode}});
}
</script>

<style scoped lang="scss">
.search {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0;

    // 深度选择器
    /*
    * 原生css：>>> (在没有用less/scss的时候使用)
    * less：/deep/
    * scss:  ::v-deep(如果使用了预处理器都可以使用这个（推荐)）
    * scss:   vue3中可以这样写 :deep(.xxx)
    */
    :deep(.el-input__wrapper) {
        width: 600px;
        margin-right: 10px;
    }
}
</style>