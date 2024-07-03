<template>
    <div class="son-box">
        <p>Child Component: {{ childData }}</p>
        <button @click="updateParentData">子组件按钮传数据给父组件</button>
        <button @click="updataSonData">给子组件更新数据按钮</button>
        <p>{{ sonData }}</p>
    </div>
</template>
<style>
.son-box{
    width:200px;
    height: 200px;
    background-color: aquamarine;
}
</style>
<script setup>
import { ref, onBeforeUpdate, onUpdated, defineProps, watch,defineEmits,onRenderTracked} from 'vue';

// 定义父组件传递过来的属性
const props = defineProps({
    parentData: String
});
//父组件传过来的数据
const childData = ref(props.parentData);
//子组件数据
const sonData = ref('我是子组件自己的数据');
console.log("从父组件接收到的数据", childData);
// 监听父组件传递的属性变化
watch(() => props.parentData, (newValue,oldValue) => {
    console.log('数据发生变化：', newValue);
    childData.value = newValue;
    console.log('数据发生变化：', oldValue);
});

// 定义子组件触发事件的方法
const emit = defineEmits(['update-parent-data']);
console.log('emit',emit);

//更新子组件自己的数据方法
const updataSonData = ()=>{
    sonData.value = "我是子组件自己的数据,现在已经被修改了";
};
// 更新父组件数据的方法
const updateParentData = () => {
  // 在子组件中触发 update-parent-data 事件，并传递新的数据
  emit('update-parent-data', 'New Data from Child');
};
// 在数据更新前执行的操作
onBeforeUpdate(() => {
    console.log('这里是子组件的onBeforeUpdate函数', childData.value);
});

// 在数据更新后执行的操作
onUpdated(() => {
    console.log('这里是子组件的onUpdate函数', childData.value);
});
//追踪响应式依赖
onRenderTracked((target)=>{
    console.log("target",target.target.value);
});
</script>
  