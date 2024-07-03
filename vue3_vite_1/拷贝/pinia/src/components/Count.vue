<template>
    <div class="count">
        <h2>当前求和为：{{ sum }},放大10倍后为：{{ bigSum }}</h2>
        <!-- 将收集来的数据尽量变成数字 -->
        <select v-model.number="n">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="add">加</button>
        <button @click="minus">减</button>
    </div>
</template>
<script setup lang = "ts" name="Count">
import {ref} from 'vue'
import {useCountStore} from '@/store/count.ts'
import {storeToRefs} from 'pinia'
const n = ref(3);//用户选择的数字
const countStore = useCountStore();
console.log('countStore',countStore);
//storeToRefs只会关注store中的数据，不会对方法进行ref包裹
const {sum,bigSum}=storeToRefs(countStore);
console.log('bigSum',bigSum.value);
console.log(sum);
console.log('countStore',countStore);
const add = () =>{
    //第一种改变store内数据的办法
    sum.value +=n.value;

    // 第二种改变store内数据的办法
    // countStore.$patch({
    //     sum:sum.value+n.value
    // });
    
    //第三种改变store内数据的办法
    // countStore.increment(n.value);
} 
const minus = ()=>{
    //第一种改变store内数据的办法
    sum.value -=n.value;

    //第二种改变store内数据的办法
    // countStore.$patch({
    //     sum:sum.value-n.value
    // });
}
</script>
<style scoped lang="scss">
.count{
    background-color: skyblue;
    padding:10px;
    border-radius: 10px;
    box-shadow: 0 0 10px;
    select,button{
        margin:0 5px;
        height:25px;
    }
}
</style>