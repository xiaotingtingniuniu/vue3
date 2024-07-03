<template>
  <div class="app">
    我是App组件
    我有{{ house }}套房子
    <br>
    <button @click="changeBook">我要把儿子1的书+1</button>
    <button @click="changeComputer">我要给儿子2换一个电脑</button>
    <button @click="changeAllToy($refs)">我要给所有孩子换玩具</button>
    <br>
    <Child1 ref="c1"></Child1>
    <br>
    <Child2 ref="c2"></Child2>
    
  </div>
</template>
<script setup lang="ts" name="App">
import Child1 from './components/Child1.vue'
import Child2 from './components/Child2.vue';
import {ref} from 'vue'
const house = ref(4);
const c1 = ref();
const c2 = ref();
//ref父传子，将儿子1的书增加
const changeBook = ()=>{
  c1.value.book +=1;
}
//ref父传子，将儿子2的电脑换成苹果电脑
const changeComputer=()=>{
  c2.value.computer = "苹果";
}
//$refs 父传子获取所有儿子暴露出来的数据 
const changeAllToy = (refs:any)=>{
  console.log(refs);
  //遍历对象，使得c1、c2的toy都换成新的玩具
  for(let key in refs) {
    refs[key].toy="新玩具"
  }
}

//父亲将房子向儿子暴露出来
defineExpose({house});
</script>
<style scoped lang="scss">
.app {
  width:100%;
  h2 {
    width: 100%;
    height: 80px;
    background: linear-gradient(to right, #4c4545, #c0c0c0, #f0f0f0);
    text-align: center;
    line-height: 80px;
    color: #000;
    border-radius: 10px;
    border: 1px solid #000;
    font-weight: 800;
    margin-top: 30px;
  }

  .nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top:60px;
    margin-bottom:60px;
    a {
      width: 80px;
      height: 40px;
      background-color: #c0c0c0;
      border-radius: 10px;
      line-height: 40px;
      vertical-align: top;
      text-align: center;
      color: #fff;
    }
    .active{
      color: red;
      background-color: yellowgreen;
    }
  }
  .main-content{
    border: 1px solid #000;
    margin: 0px 10px;
    border-radius: 10px;
    height: 400px;
  }
}
</style>