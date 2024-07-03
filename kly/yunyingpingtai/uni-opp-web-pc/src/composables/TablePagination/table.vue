<template>
    <div class="cst-list">
        <el-table
            :data="props.tableData"
            style="width: 100%"
            stripe
            :border="props.border"
            :height="props.height"
            :size="props.tableSize"
            @selection-change="handleSelectionChange"
        >
            <template v-for="(item, index) in props.tHead" :key="index">
                <el-table-column
                    v-if="item.slot"
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :fixed="item.fixed"
                    :type="item.type"
                    :show-overflow-tooltip="item.tooltip"
                    :align="item.align"
                    :sortable="item.sortable"
                    :formatter="item.formatter"
                >
                    <template #default="scope">
                        <slot
                            :name="item.prop"
                            :row="scope.row"
                            :column="scope.column"
                            :index="scope.$index"
                        ></slot>
                    </template>
                </el-table-column>
                <el-table-column
                    v-else
                    :prop="item.prop"
                    :label="item.label"
                    :width="item.width"
                    :min-width="item.minWidth"
                    :fixed="item.fixed"
                    :type="item.type"
                    :show-overflow-tooltip="item.tooltip"
                    :align="item.align"
                    :sortable="item.sortable"
                    :formatter="item.formatter"
                ></el-table-column>
            </template>
        </el-table>
    </div>
</template>
<script setup>
import { computed } from 'vue'

const emit = defineEmits([
    'selection-change',
    'size-change',
    'update:pageSize',
    'update:currentPage',
    'current-change'
])

const props = defineProps({
    // 斑马纹
    stripe: {
        type: Boolean,
        default: true
    },
    // 纵向边框
    border: {
        type: Boolean,
        default: false
    },
    // 表格大小 large / default /small
    tableSize: {
        type: String,
        default: 'default'
    },
    // 表格高度
    height: {
        type: Number,
        default: null
    },
    // tooltip 主题
    tooltipEffect: {
        type: String,
        default: 'dark'
    },
    // 渲染表头数据
    tHead: {
        type: Array,
        required: true
    },
    tableData: {
        type: Array,
        required: true
    },
    currentPage: {
        type: Number,
        default: 1
    },
    pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 50]
    },
    pageSize: {
        type: Number,
        default: 10
    },
    layout: {
        type: String,
        default: 'total, sizes, prev, pager, next, jumper'
    },
    total: {
        type: Number,
        default: 0
    },
    // 是否展示分页
    isPage: {
        type: Boolean,
        default: true
    },
    // 分页位置 left | center | right
    pageAlign: {
        type: String,
        default: 'center'
    }
})

const align = computed(() => {
    return { 'justify-content': props.pageAlign }
})

const showPage = computed(() => {
    return props.isPage && props.tableData && props.tableData.length > 0
})

// 表格选中事件
const handleSelectionChange = (val) => {
    emit('selection-change', val)
}

</script>

<style lang="scss" scoped>
.cst-list{
    .page-box {
        display: flex;
        margin-top: 24px;
    }
}
</style>
