<template>
    <div class="info">
        <h1 class="hosname">{{ hospitalStore.hospitalInfo.hospital?.hosname }}查询信息</h1>
        <el-empty description="暂无信息" />
    </div>
</template>

<script setup lang='ts'>
//引入医院详情的仓库数据并展示
import useDetailStore from '@/store/modules/hospitalDetail'
const hospitalStore =  useDetailStore();
</script>

<style scoped lang="scss">
.info{
    .hosname{
        font-size:30px;
        text-align: center;
    }
}
</style>