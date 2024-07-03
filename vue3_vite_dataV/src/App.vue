<template>
  <div class="bg">
    <dv-full-screen-container>
      <div class="module-box">
        <div class="box-div" style="flex:0 1 25%">
          <dv-border-box-1 :color="['red', 'yellow']" style="color: #fff;">
            <dv-capsule-chart :config="config" style="width:100%;height:260px;padding:30px" />
          </dv-border-box-1>
          <dv-border-box-8 style="color: #fff;">1111111</dv-border-box-8>
        </div>
        <div class="box-div" style="flex:0 1 50%;height: 600px;">
          <dv-border-box-5 style="color: #fff;">2222222</dv-border-box-5>
        </div>
        <div class="box-div" style="flex:0 1 25%">
          <dv-border-box-11 style="color: #fff;" title="333333">33333333</dv-border-box-11>
          <dv-border-box-11 style="color: #fff;" title="333333">33333333</dv-border-box-11>
        </div>
      </div>
    </dv-full-screen-container>
  </div>
</template>
<script setup lang="ts">
import {ref} from 'vue'
const config = ref({
  data: [
    {
      name: '南阳',
      value: 167
    },
    {
      name: '周口',
      value: 67
    },
    {
      name: '漯河',
      value: 123
    },
    {
      name: '郑州',
      value: 55
    },
    {
      name: '西峡',
      value: 98
    },
  ],
  colors: ['#e062ae', '#fb7293', '#e690d1', '#32c5e9', '#96bfff'],
  unit: '万元',
  showValue: true
});
</script>
<style scoped lang="scss">
.bg {
  width: 100%;
  height: 100%;
  background: url('./assets/imgs/v2-dc3ace13b708ddad0f32962c9c5cefb3_1440w.jpg') no-repeat center center;
  background-size: cover;
}
.module-box{
  display: flex;
  // flex-direction: row;//主轴方向
  // flex-wrap: wrap;//是否自动换行 nowrap不换行默认
  flex-flow: row wrap;//flex-direction+flex-wrap
  // justify-content: flex-end;//子元素在主轴上的对齐方式
  // align-items: flex-end;//子元素在交叉轴上的对齐方式 stretch(默认值) ，如果子元素未设置高度或者设为auto，将占满整个容器的高度。
  align-content: flex-start;
  .box-div{
    height: 300px;
  }
}
</style>
