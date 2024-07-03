<template>
    我是GrandChild
    <br>
    爷爷的资产：{{ getMoney }}万元
    <br>
    爷爷的车：
    <br>
    品牌：{{ getCar.brand }}
    <br>
    价格：{{ getCar.price }}万元
    <br>
    我自己有：{{ toy }}
    <button @click="getToy(toy)">给爷爷玩我的玩具</button>
</template>
<script setup lang="ts" name="GrandChild">
import { inject,ref } from 'vue';
const toy = ref('娃娃');
const getMoney=inject('money');
console.log('getMoney',getMoney);
const getCar=inject('car');
const getToy = inject('getGrandChildToy');
</script>