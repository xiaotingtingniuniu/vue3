<template>
  <div class="app">
    <h2>我是App组件</h2>
    <br>
    <Count></Count>
    <br>
    <LoveTalk></LoveTalk>
  </div>
</template>
<script setup lang="ts" name="App">
import Count from './components/Count.vue';
import LoveTalk from './components/LoveTalk.vue';
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