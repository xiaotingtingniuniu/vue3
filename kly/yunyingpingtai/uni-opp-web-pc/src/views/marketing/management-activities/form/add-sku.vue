
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="'新增商品'"
            width="800px"
            height="1000px"
            @close="close"
            draggable
        >
            <el-form ref="resetSkuData" :model="searchData" label-width="120px" :inline="true">
                <el-form-item label="商品名称" prop="skuName">
                    <el-input v-model="searchData.skuName"  placeholder="商品名称"/>
                </el-form-item>
                <el-form-item label="店铺名称" prop="secondChannelName">
                    <el-input v-model="searchData.secondChannelName"  placeholder="店铺名称"/>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchSku">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="resetForm">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" style="width: 100%" ref="tableRef">
                <el-table-column prop="shopId" label="店铺ID"  />
                <el-table-column prop="shopName" label="店铺名称" />
                <el-table-column prop="skuName" label="sku名称"  />
                <el-table-column prop="salePrice" label="sku价格" />
                <el-table-column prop="stock" label="sku库存"  />
                <el-table-column prop="skuStatus" label="sku状态">
                    <template #default="scope">
                        <div>
                            <span v-if="scope.row.skuStatus === 1">待审核</span>
                            <span v-else-if="scope.row.skuStatus === 2">已审核</span>
                            <span v-else-if="scope.row.skuStatus === 3">审核不通过</span>
                            <span v-else-if="scope.row.skuStatus === 4">已上架</span>
                            <span v-else-if="scope.row.skuStatus === 5">下架可上架</span>
                            <span v-else-if="scope.row.skuStatus === 6">下架不可再上架</span>
                            <span v-else-if="scope.row.skuStatus === 7">待上架</span>
                            <span v-else>-</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <el-button v-if="scope.row.isSel === 0" text type="primary" @click="selSku(scope.row)"> 选择 </el-button>
                        <el-button v-if="scope.row.isSel === 1" text type="primary" @click="delSku(scope.row)"> 取消 </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="bottom">
                <div class="demo-pagination-block" style="margin:0 auto">
                    <el-pagination
                        v-model:currentPage="dataState.pageinfo.currentPage"
                        v-model:page-size="dataState.pageinfo.pageSize"
                        :page-sizes="[10, 20, 30, 40]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="dataState.pageinfo.total"
                        @size-change="sizeChange"
                        @current-change="currentChange"
                    />
                </div>
            </div>
            <div class="sku-btns">
                <el-button @click="cancelSku">
                    取消
                </el-button>
                <el-button type="primary" @click="confirmSku">
                    添加
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed, defineProps, defineEmits, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { getV2SkuList } from '@/api/marketing/active'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'getDialogCheckedData'])
const close = () => {
    emits('update:modelValue', false)
}
const tableRef = ref()
// 表单数据
const dataState = reactive({
    searchData: {
        skuName: '',
        secondChannelName: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    tableData: [],
    radio: null,
    currentDialogCheckedAll: []
})
const { tableData, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getList()
})
// 查询
const searchSku = async () => {
    dataState.pageinfo.currentPage = 1
    getList()
}
// 重置
const resetSkuData = ref(null)
const resetForm = () => {
    resetSkuData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getList()
    })
}
// 获取列表
const getList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UCJH76381213909610496',
        name: 'sku聚合实时库存和价格',
        source: '运营后台',
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001005',
            skuName: dataState.searchData.skuName,
            secondChannelName: dataState.searchData.secondChannelName,
            pageNo: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize
        }
    }
    const res = await getV2SkuList(param)
    if (res.code === '200') {
        dataState.tableData = []
        if (res.data.list) {
            res.data.list.map(item => {
                item.isSel = 0
                dataState.tableData.push(item)
            })
        }
        dataState.pageinfo.total = res.data.total
        // checkRows()
    }
}
const checkRows = () => {
    dataState.currentDialogCheckedAll = []
    const checkedList = dataState.currentDialogCheckedAll
    nextTick(() => {
        dataState.tableData.forEach((row) => {
            checkedList.forEach((item) => {
                if (item.skuId === row.skuId) {
                    tableRef.value.tableRef.toggleRowSelection(row, true)
                }
            })
        })
    })
}
// 选择商品
const selSku = async (row) => {
    dataState.tableData.forEach((item) => {
        if (item.skuId === row.skuId) {
            item.isSel = 1
        }
    })
    dataState.currentDialogCheckedAll.push(row)
}
// 删除已选商品
const delSku = async (row) => {
    dataState.tableData.forEach((item, index) => {
        if (item.skuId === row.skuId) {
            item.isSel = 0
        }
    })
    dataState.currentDialogCheckedAll.forEach((item, index) => {
        if (item.skuId === row.skuId) {
            dataState.currentDialogCheckedAll.splice(index, 1)
        }
    })
}
// 取消
const cancelSku = async () => {
    emits('update:modelValue', false)
}
// 确认
const confirmSku = async () => {
    emits('getDialogCheckedData', dataState.currentDialogCheckedAll)
    emits('update:modelValue', false)
}
// 当前页数改变
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getList()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getList()
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
.el-form-item{
    display: flex;
}
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
</style>
