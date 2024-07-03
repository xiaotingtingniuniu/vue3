<template>
    我是儿子2
    <br>
    我的电脑:{{ computer }}
    <br>
    我的玩具:{{ toy }}
    <br>
    <button @click="changeHouse($parent)">我来给爸爸买新的房子</button>
</template>
<script setup lang="ts" name="Child">
import {ref} from 'vue'
const computer = ref("华为");
const toy = ref('自行车');
const changeHouse =(parent:any)=>{
    parent.house +=1;
}
//将computer和toy暴露给父亲
defineExpose({computer,toy});
</script>