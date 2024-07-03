<template>
  <div class="app">
    我是App组件
    <Suspense>
      <template v-slot:fallback>
        <h2>请求中···········</h2>
      </template>
      <template v-slot:default>
        <Child1/>
      </template>
    </Suspense>
  </div>
</template>
<script setup lang="ts" name="App1">
// import Child1 from './components/Child1.vue'
import { defineAsyncComponent,Suspense } from 'vue';
const Child1 = defineAsyncComponent(()=>
    import("./components/Child1.vue")
)
</script>
<style scoped lang="scss">
.app {
  width: 100%;
  height: 300px;
  background-color:bisque;
}
</style>