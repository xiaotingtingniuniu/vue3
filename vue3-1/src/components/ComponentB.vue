<template>
    <div>
      222
      <button @click="jumpToBaidu">跳到百度</button>
    </div>
</template>
<script setup>
import {onActivated,onDeactivated,onMounted, onUnmounted} from 'vue'
const jumpToBaidu = ()=>{
  window.location.href="https://www.baidu.com";
  // window.open("https://www.baidu.com");
}
onMounted(()=>{
  console.log('onMountedB');
});
onUnmounted(()=>{
  alert('onUnmountedB');
});
onActivated(()=>{
    console.log('onActivatedB');
});
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  alert('onDeactivatedB');
});
</script>

  