<template>
  <div class="app-box">
   <div>123</div>
   <div>456</div>
   <div>789</div>
   <div>098</div>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped lang="scss">
.app-box{
  width: 100%;
  height: 100vh;
  background-color: antiquewhite;
  display: flex;
  // flex-direction: row;
  // flex-wrap: wrap;
  flex-flow: row wrap;
  // justify-content: space-between;//子元素在主轴方向的对齐方式
  // align-items: baseline;//子元素在交叉轴方向上的对齐方式 stretch默认值 如果子元素没有设定高度或高度为auto则子元素将占满整个容器的高度
  align-content: flex-start;//子元素在多根轴线的对齐方式，如果项目只有一根轴线，则该属性不起作用
  div{
    width: 400px;
    // height:100px;
    background-color: aquamarine;
  }
}
</style>
