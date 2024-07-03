<template>
    我是about组件
</template>
<script lang="ts" name="about" setup>
import { onMounted,onUnmounted } from 'vue';
onMounted(()=>{
    console.log('about组件挂载了');
});
onUnmounted(()=>{
    console.log('about组件卸载了');
})
</script>