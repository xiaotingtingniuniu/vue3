<template>
    <div class="cst-list">
        <el-table
            :data="props.tableData"
            style="width: 100%"
            stripe
            show-summary :summary-method="getSummaries"
            :accountData = "props.accountData"
            :height="props.height"
            :title = "props.title"
            :cell-style="changeCellStyle"
            @selection-change="handleSelectionChange"
        >
            <!--  -->
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
// import { computed } from 'vue'

const emit = defineEmits([
    'selection-change'
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
    accountData: {
        type: Object
    },
    title: {
        type: String,
        default: 'default'
    }
})
const changeCellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
        return {
            color: 'red'
        }
    } else {
        return ''
    }
}
const getSummaries = (param) => {
    const { columns, data } = param
    const sums = []
    columns.forEach((column, index) => {
        // column 是每一列，index 表示列的索引，第一列的时候不计算合计，显示自定义的文字内容
        if (index === 0) {
            sums[index] = '总计'
            return
        }

        switch (column.property) {
        // 订单-商品数量总计;
        case 'orderNum':
            // 在这里你就可以根据需要对数据进行一些处理（保留小数位数，加上单位等）
            sums[index] = props.accountData.orderComNum
            break
            // 订单-合计总计;
        case 'sumAmount':
            sums[index] = (props.accountData.sumAmount / 100).toFixed(2)
            break
            // 订单-优惠金额总计
        case 'orderdiscountAmount':
            sums[index] = (props.accountData.discountAmount / 100).toFixed(2)
            break
            // 订单详情支付金额总计
        case 'orderpayAmount':
            sums[index] = (props.accountData.payAmount / 100).toFixed(2)
            break
            // 申请退款商品数量总计
        case 'num':
            sums[index] = props.accountData.refundComNum ? props.accountData.refundComNum : ''
            break
            // 申请退款商品金额总计
        case 'refundsumAmount':
            sums[index] = (props.accountData.refundSumAmount / 100).toFixed(2)
            break
            // 申请退款优惠金额总计
        case 'refundPayAmount':
            sums[index] = (props.accountData.refundDiscountAmount / 100).toFixed(2)
            break
            // 申请退款金额总计
        case 'refundOverdueDate':
            sums[index] = (props.accountData.refundPayAmount / 100).toFixed(2)
            break
        case 'quantity':
            sums[index] = props.accountData?.quantity ? props.accountData?.quantity : ''
            break
            // 不需要计算合计的列就展示‘--’
        default:
            sums[index] = '--'
            break
        }
        if (props.title === 'DS') {
            if (index === 8 || index === 10 || index === 11 || index === 12) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else if (index === 7) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            } else {
                sums[index] = '--'
            }
        }
        if (props.title === 'HG') {
            if (index === 6 || index === 7 || index === 8) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else if (index === 5) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            } else {
                sums[index] = '--'
            }
        } else if (props.title === 'ORDER') {
            if (index === 6 || index === 8 || index === 9 || index === 11) {
                const values = data?.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else if (index === 5) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            }
        } else if (props.title === 'OPENDOOR') {
            if (index === 3) {
                const values = data?.map(item => Number(item[column.property]))
                if (!values?.every(value => isNaN(value))) {
                    const numacount = values?.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            }
        } else if (props.title === 'ORDER1') {
            if (index === 6 || index === 7 || index === 8) {
                const values = data?.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = (numacount / 100).toFixed(2)
                }
            } else if (index === 5) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            }
        }
        if (props.title === 'SKU') {
            if (index === 3 || index === 6) {
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    const numacount = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            const num = prev + curr
                            return num
                        } else {
                            return prev
                        }
                    }, 0)
                    sums[index] = numacount
                }
            } else {
                sums[index] = '--'
            }
        }
    })
    return sums
}
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
:deep(.el-table .el-table__footer-wrapper .cell){
    font-weight: 600;
    color: red;
}
}
</style>
