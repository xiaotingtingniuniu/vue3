<template>
    <div class="info">
        <h1 class="hosname">{{ hospitalStore.hospitalInfo.hospital?.hosname }}停诊信息</h1>
        <el-empty description="暂无信息" />
    </div>
</template>

<script setup lang='ts'>
//引入医院详情的仓库数据并展示
import useDetailStore from '@/store/modules/hospitalDetail'
const hospitalStore = useDetailStore();
console.log('hospitalStore',hospitalStore); 
</script>

<style scoped lang="scss">
.info{
    .hosname{
        text-align: center;
        font-size:30px;
    }
}
</style>