<template>
    我是儿子1
    <br>
    我爸爸的钱有:{{ getMoney }}万元
    <br>
    我自己有手机：{{ phone }} 1台
    <br>
    <button @click="sendPhone(phone)">给爸爸我的手机</button>
    <br>
    <GrandChild></GrandChild>
</template>
<script setup lang="ts" name="Child1">
import { inject, provide,ref } from 'vue';
import GrandChild from './GrandChild.vue';
const getMoney=inject('money');
const phone = ref('苹果手机');
const sendPhone = inject('getSonPhone');
provide("myPhone",phone);
</script>