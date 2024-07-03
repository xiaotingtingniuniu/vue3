<template>
    <div>
        <div>countRef:{{ countRef }}</div>
        <div>countReact:{{ countReact.count }}</div>
        <button @click="add">add</button>
        <button @click="stopToWatch">停止监听</button>
        <button @click="changeGender">修改性别</button>
    </div>
</template>
<script setup> 
import {ref,reactive,watch, watchEffect} from 'vue'
const countRef = ref(0);
const countReact = reactive({
    count:0,
    infor:{
        name:"zhangsan",
        age:12,
        gender:"male"
    }
});
const add = ()=>{
    countRef.value++;
    countReact.count++;
};
const changeGender = ()=>{
    countReact.infor.gender='female';
};
const stopWatch=watch(countReact,(newValue,oldValue,onClear)=>{
    console.log('watch-countReact-newValue:',newValue);
    console.log('watch-countReact-oldValue:',oldValue);
    onClear(()=>{
        console.log('watch清理函数');
    });
});
const stopWatchEffect=watchEffect((onClear)=>{
    console.log('watchEffect-countReact:',countReact.infor.gender);
    onClear(()=>{
        console.log('watchEffect清理函数');
    })
});
const stopToWatch = ()=>{
    stopWatch();
    stopWatchEffect();
}
</script>