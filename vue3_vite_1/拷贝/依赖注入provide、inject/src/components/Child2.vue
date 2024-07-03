<template>
    我是Child2
    <br>
    <!-- 我哥哥有一台{{ myPhone }} -->
</template>
<script setup lang="ts" name="Child2">
import { inject } from 'vue';
// const myPhone = inject('myPhone');
</script>