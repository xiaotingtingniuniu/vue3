<template>
    <div class="user">
        <!-- 左侧显示导航区域 -->
        <div class="menu">
            <div class="top">
                <el-icon><HomeFilled/></el-icon>
                <span>/会员中心</span>
            </div>
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" :router=true>
                <el-menu-item index="/user/certification">
                    <el-icon><Postcard /></el-icon>
                    <span>实名认证</span>
                </el-menu-item>
                <el-menu-item index="/user/order">
                    <el-icon><Memo /></el-icon>
                    <span>挂号订单</span>
                </el-menu-item>
                <el-menu-item index="/user/patient">
                    <el-icon><UserFilled /></el-icon>
                    <span>就诊人管理</span>
                </el-menu-item>
                <el-menu-item index="/user/profile">
                    <el-icon><Document /></el-icon>
                    <span>账号信息</span>
                </el-menu-item>
                <el-menu-item index="/user/feedback">
                    <el-icon><ChatDotRound /></el-icon>
                    <span>意见反馈</span>
                </el-menu-item>
            </el-menu>
        </div>
        <!-- 右侧展示会员中心二级路由组件区域 -->
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup lang='ts'>
import {
  Postcard,
  Memo,
  UserFilled,
  Document,
  ChatDotRound,
  HomeFilled
} from '@element-plus/icons-vue'
import {useRoute} from 'vue-router'
//获取路由对象
const $route = useRoute();
</script>

<style scoped lang="scss">
.user {
    display: flex;
    flex-direction: row;
    .menu {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        .top{
            display: flex;
        }
    }

    .content {
        flex: 8;
    }
}
</style>