<template>
    <ul>
        <li>编号：{{ id }}</li>
        <li>标题：{{ title }}</li>
        <li>内容：{{ content }}</li>
    </ul>
</template>
<script setup lang="ts" name="content">
import { defineProps } from 'vue';
defineProps(['id','title','content']);
</script>