<template>
    <div class="order">
        <Detail v-if="$route.query.orderId"/>
        <AllOrder v-else/>
    </div>
</template>

<script setup lang='ts'>
import {useRoute} from 'vue-router'
import AllOrder from './allOrder/index.vue'
import Detail from './detail/index.vue'
//获取路由对象
const $route = useRoute();
console.log('$route',$route);
</script>

<style scoped lang="scss">
.order{
    margin:10px 10px;
}
</style>