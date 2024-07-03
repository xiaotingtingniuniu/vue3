<template>
    我是儿子1
    <br>
    我的书:{{ book }}本
    <br>
    我的玩具:{{ toy }}
    <button @click="changeHouse($parent)">卖掉父亲的房子</button>
</template>
<script setup lang="ts" name="Child1">
import {ref} from 'vue'
const book = ref(2);
const toy = ref('手枪');
//$parent 子传父  儿子将爸爸的房子卖掉
const changeHouse = (parent:any)=>{
    console.log(parent.house);
    parent.house -=1;

}
defineExpose({book,toy});//向爸爸暴露book和toy
</script>