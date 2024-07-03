<template>
 
</template>

<script setup lang='ts'>
//获取路由地址中的用户信息
import { useRoute } from 'vue-router';
//引入本地存储用户信息
import {SET_USERINFOR} from '@/utils/user'
//获取路由对象
const $route = useRoute();
console.log('$route',$route.query);
//持久化存储用户信息
SET_USERINFOR(JSON.stringify($route.query));

//执行到此路由时，代表微信用户已经授权成功了
//隐藏掉微信嵌入的iframe
const html:HTMLElement = document.querySelector('html');
html.style.display="none";
</script>

<style scoped lang="scss">
</style>