<template>
  <div>
    123
  </div>
</template>
<script setup>
import {onActivated,onDeactivated} from 'vue'
onActivated(()=>{
    console.log('onActivatedA');
});
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log('onDeactivatedA');
});
</script>

  