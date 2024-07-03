<template>
    <div>
        <KeepAlive include="ComponentB">
            <component :is="currentCom.name" />
        </KeepAlive>
        <button @click="toggle">切换按钮</button>
    </div>
</template>
  
<script setup>
import { ref,onActivated,onDeactivated } from 'vue';
import ComponentA from '../components/ComponentA.vue';
import ComponentB from '../components/ComponentB.vue';
const change =ref(true);
const comList = ref([
    { name: "a组件",component:ComponentA},
    { name: "b组件",component:ComponentB}
]);

const currentCom = ref({
    name: comList.value[0].component
});
const toggle =()=>{
    console.log("切换");
    currentCom.value.name=change.value?ComponentB:ComponentA;
    change.value=!change.value;
}
onActivated(()=>{
    console.log('onActivated父');
});
onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log('onDeactivated父');
})
</script>
  