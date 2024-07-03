<script setup lang="ts">
//引入pinia仓库数据
import useUserStore from './store/modules/user';
let userStore = useUserStore();
</script>

<template>
  <div class="container">
    <!-- 顶部组件 -->
    <HospitalTop />
    <!-- 展示路由组件区域 -->
    <div class="content">
      <!-- 展示路由组件的区域 -->
      <router-view></router-view>
    </div>
    <!-- 底部组件 -->
    <HospitalBottom />
    <!-- 登录组件 -->
    <Login v-if="userStore.dialogFormVisible"/>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    margin: 70px 0;
    width: 1200px;
    min-height: 700px;
  }
}
</style>
