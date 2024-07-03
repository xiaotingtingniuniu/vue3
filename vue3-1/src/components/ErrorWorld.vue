<template>
    <div>
        <button @click="error">错误按钮</button>
    </div>
</template>
<script setup>
const error = ()=>{
    throw new Error('现在子组件中出了一些错误，请及时修改');
}
</script>