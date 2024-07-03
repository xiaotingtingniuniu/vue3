<template>
    <div class="talk">
        <button @click="getLoveTalk">获取一句土味情话</button>
        <ul>
            <li v-for="item in list" :key="item.id">
                {{ item.title }}
            </li>
        </ul>
    </div>
</template>
<script setup lang="ts" name="LoveTalk">
import {useLoveTalkStore} from '@/store/loveTalk.ts'
import {storeToRefs} from 'pinia'
//从pinia中获取loveTalkStore 并获取list列表
const loveTalkStore = useLoveTalkStore();

const {list} = storeToRefs(loveTalkStore);
loveTalkStore.$subscribe((mutate,state)=>{
    console.log('mutate',mutate);
    console.log('state',state);//state 就是loveTalkStore数据仓库
    localStorage.setItem('talkList',JSON.stringify(state.list));
})
const  getLoveTalk = ()=>{
    loveTalkStore.getATalk();
}
</script>
<style lang="scss" scoped>
.talk{
    background-color: rgb(88, 187, 64);
    padding:10px;
    border-radius: 10px;
    box-shadow: 0 0 10px;
}
</style>