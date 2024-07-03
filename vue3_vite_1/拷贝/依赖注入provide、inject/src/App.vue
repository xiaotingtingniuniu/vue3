<template>
  <div class="app">
    我是App组件
    <br>
    我的资产：{{ money }}万元
    <br>
    我有一辆：【{{ car.brand }}】车
    <br>
    价值为：{{ car.price }}万元
    <br>
    孙子给我玩的玩具：{{ grandChildToy }}
    <br>
    儿子给我的手机：{{ sonPhone }}
    <br>
    <Child1></Child1>
    <br>
    <Child2></Child2>
  </div>
</template>
<script setup lang="ts" name="App">
import { inject, onMounted, provide, reactive, ref } from 'vue';
import Child1 from './components/Child1.vue'
import Child2 from './components/Child2.vue'
const car = reactive({
  brand: "大众",
  price: 10
});
const money = ref(100);
provide('money', money);
provide('car', car);
const grandChildToy = ref('');
const getToy=(toy)=>{
  grandChildToy.value=toy;
}
provide('getGrandChildToy',getToy);
const sonPhone = ref("");
//定义一个儿子可以调用的事件
const getSonPhone=(value)=>{
  console.log('value',value);
  sonPhone.value = value;
}
provide('getSonPhone',getSonPhone);
</script>
<style scoped lang="scss">
.app {
  width: 100%;

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
    margin-top: 60px;
    margin-bottom: 60px;

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

    .active {
      color: red;
      background-color: yellowgreen;
    }
  }

  .main-content {
    border: 1px solid #000;
    margin: 0px 10px;
    border-radius: 10px;
    height: 400px;
  }
}</style>