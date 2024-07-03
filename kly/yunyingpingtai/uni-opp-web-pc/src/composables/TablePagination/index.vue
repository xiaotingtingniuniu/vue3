<template>
    <div class="cst-list">
        <el-table
            :border="props.border"
            :data="props.tableData"
            style="width: 100%"
            :stripe="props.stripe"
            ref="tableRef"
            :row-key="rowKey"
            :height="props.height"
            :size="props.tableSize"
            @selection-change="handleSelectionChange"
            @select="handleSelect"
            @select-all="handleSelectAll"
            :highlight-current-row="props.highlightCurrentRow"
            @current-change="choiseTableItem"
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
                    :selectable="item.selectable"
                    :sortable="item.sortable"
                    :formatter="item.formatter"
                    :reserve-selection="item.reserveSelection"
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
                    :reserve-selection="item.reserveSelection"
                    :selectable="item.selectable"
                ></el-table-column>
            </template>
        </el-table>
        <div class="page-box" :style="align">
            <el-pagination
                v-if="showPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="props.currentPage"
                :page-sizes="props.pageSizes"
                :page-size="props.pageSize"
                :layout="props.layout"
                :total="props.total"
            ></el-pagination>
        </div>
    </div>
</template>
<script setup>
import { computed, ref, defineExpose } from 'vue'

const emit = defineEmits([
    'select',
    'selection-change',
    'size-change',
    'update:pageSize',
    'update:currentPage',
    'current-change',
    'choiseTableItem',
    'selectable'
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
    rowKey: {
        type: Function
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
    },
    highlightCurrentRow: {
        type: Boolean,
        default: false
    }
})
const align = computed(() => {
    return { 'justify-content': props.pageAlign }
})

const showPage = computed(() => {
    return props.isPage && props.tableData && props.tableData.length > 0
})

const tableRef = ref()

// 表格选中事件
const handleSelectionChange = (val) => {
    emit('selection-change', val)
}
const selectable = (row, index) => {
    emit('selectable', row, index)
}
// 表格选中
const handleSelect = (arr, obj) => {
    emit('select', arr, obj)
}
// 表格选中
const handleSelectAll = (arr, obj) => {
    emit('select-all', arr, obj)
}
// 每页条数改变
const handleSizeChange = (val) => {
    emit('size-change', val)
    emit('update:pageSize', val)
}

// 当前页改变
const handleCurrentChange = (val) => {
    emit('update:currentPage', val)
    emit('current-change', val)
}

defineExpose({
    tableRef
})
const choiseTableItem = (val) => {
    emit('choiseTableItem', val)
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
