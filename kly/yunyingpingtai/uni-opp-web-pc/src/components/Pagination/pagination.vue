<template>
    <el-pagination
        v-model:pageSize="pageSize"
        :total="props.total"
        :current-page="props.currentPage"
        :pager-count="5"
        background
        :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['pagerUpdate'])
const props = defineProps({
    total: {
        type: Number,
        default: 0,
        required: true
    },
    currentPage: {
        type: Number,
        default: 0,
        required: true
    }
})
// 定义当前页码 + 当前条数
const currentPage = ref(props.currentPage)
const pageSize = ref(10)

// 两个导出方法
const handleSizeChange = (pageSize) => {
    currentPage.value = 1
    emit('pagerUpdate', { pageSize, pageNo: 1 })
}
const handleCurrentChange = (currentPage) => {
    emit('pagerUpdate', { pageSize: pageSize.value, pageNo: currentPage })
}

</script>
<style lang="scss" scoped>
.el-pagination{
    text-align: center;
    margin-top: 20px;
}
</style>
