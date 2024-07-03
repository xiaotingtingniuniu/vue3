<template>
    <el-container>
        <Aside />
        <el-container direction="vertical">
            <Header />
            <el-main>
                <router-view />
            </el-main>
        </el-container>
    </el-container>
</template>
<script setup>
import Aside from './Aside/index.vue'
import Header from './Header/index.vue'
</script>
<style>
.el-main{
    background: #fff;
    height: calc(100vh - 111px);
}
</style>
