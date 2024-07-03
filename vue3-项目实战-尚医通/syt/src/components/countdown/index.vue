<template>
    <span>获取验证码{{time}}s</span>
</template>

<script setup lang='ts'>
import {ref,watch} from 'vue'
//倒计时的水间
const time = ref<number>(5);
//接收父组件传递的props
const props = defineProps(['flag']);
const $emit = defineEmits(['getFlag'])
//监听父组件传递过来的props数据变化
watch(()=>props.flag,()=>{
    console.log(123);
    //开启定时器
    let timer = setInterval(()=>{
        time.value--;
        if(time.value===0){
            //清除定时器
            clearInterval(timer);
            //通知父组件将flag变为false
            $emit('getFlag',false);
        }
    },1000);
},{
    immediate:true
});
</script>

<style scoped lang="scss">
</style>