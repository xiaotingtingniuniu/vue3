<template>
    <div class="child1">
        我是子组件
        <br>
        请求到的数据：{{ data }}
    </div>
</template>
<script setup lang="ts" name="Child1">
import axios from 'axios';
import { ref } from 'vue'
//引入异步组件 
const data = ref({});

console.log('去请求');
const respons = await axios.get('https://www.fastmock.site/mock/0482c311e9b98c3ec8502e3018f97b2b/api');
data.value = respons.data;

</script>
<style lang="scss" scoped>
.child1 {
    width: 100%;
    height: 100px;
    background-color: aqua;
    margin-top: 100px;
}
</style>