<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" title="标品库" width="66%" @close="RebinddialogClose(dialogFormRef)">
            <el-form ref="dialogFormRef" :model="dialogSearch" :inline="true" label-position="right" label-width="100px">
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="标品编码" prop="spuId" label-width="75px">
                            <el-input v-model="dialogSearch.spuId" placeholder="精确匹配" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="标品名称" prop="spuName" label-width="75px">
                            <el-input v-model="dialogSearch.spuName" placeholder="请输入标品名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="12">
                        <el-form-item label="标品69码" prop="barcode" label-width="75px">
                            <el-input v-model="dialogSearch.barcode" placeholder="精确匹配" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item class="button-box">
                            <el-button @click="bindSpu(dialogFormRef)" type="primary">选择所选标品</el-button>
                            <el-button @click="searchrebind()" type="primary">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <system-list class="dialogTable" :height="300" ref="dialogTableListRef" :tHead="dialogTHead" :tableData="dialogTableData" v-model:current-page="dialogCurrentPage" @select="dialogSelectable" v-model:page-size="dialogPageSize" :total="dialogTotal" @size-change="dialogSizeChange" @current-change="dialogCurrentChange">
                <template #modelStatus="scope">
                    <span v-if="scope.row.modelList&&scope.row.modelList.length">{{modelStatusList[scope.row.modelList[0]?.modelStatus]}}</span>
                </template>
                <template #mediarUrl="scope">
                    <el-image v-if="scope.row.mediarUrl" style="width:100px" preview-teleported :src="scope.row.mediarUrl" :preview-src-list="[scope.row.mediarUrl]" fit="cover" />
                    <!-- <img :src="scope.row.mediarUrl" alt="" style="width:100px"> -->
                </template>
                <template #spuListPicUrl="scope">
                    <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.spuListPicUrl" :preview-src-list="[scope.row.spuListPicUrl]" fit="cover" />
                </template>
            </system-list>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
const props = defineProps({
    visible: {
        type: Boolean
    }
})
const modelStatusList = {
    0: '初始', 1: '训练中', 2: '训练完成', 80: '上新失败', 99: '训练失败'
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogSearch = ref({
    spuId: null,
    spuName: null,
    barcode: null
})
const dialogVisible = ref(props.visible)
// const dialogRebindVisible = ref(false)
const dialogTableData = ref([])
const dialogTHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编码', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'saleChannel', label: '销售渠道', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'spuListPicUrl', label: '标品图片', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'mediarUrl', label: '模型训练首图', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'modelStatus', label: '模型训练状态', minWidth: 150, slot: true }
]
onMounted(async () => {
    await getStandardList()
})
const dialogTotal = ref(0)
const dialogCurrentPage = ref(1)
const dialogPageSize = ref(10)
// 获取标品库列表
const getStandardList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001004',
            spuIds: dialogSearch.value.spuId ? [dialogSearch.value.spuId] : [],
            spuName: dialogSearch.value.spuName,
            barcodes: dialogSearch.value.barcode ? [dialogSearch.value.barcode] : [],
            isEnabled: 1,
            pageNo: dialogCurrentPage.value,
            pageSize: dialogPageSize.value
        },
        appKey: 'A1001000',
        busiCode: 'A1001004',
        // configCode: 'UC1657692903781wCdeA',
        // name: 'SPU分页列表',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dialogTableData.value = res.list.map(item => {
        if (item.modelMediaList) {
            item.modelMediaList.map(el => {
                if (el.mediaType + '' === '1') {
                    item.mediarUrl = el.mediaUrl
                }
            })
        } else {
            item.mediarUrl = null
        }
        if (item.spuMediaList) {
            item.spuMediaList.map(el => {
                if (el.mediaType + '' === '6') {
                    item.spuListPicUrl = el.mediaUrl
                }
            })
        } else {
            item.spuListPicUrl = null
        }
        return {
            ...item
        }
    })
    dialogTotal.value = res.total
}
const dialogTableListRef = ref(null)
const dialogSelection = ref(null)
const dialogSelectable = (selection, row) => {
    if (dialogSelection.value?.spuId === row.spuId) {
        dialogSelection.value = null
        dialogTableListRef.value.tableRef.clearSelection()
    } else {
        dialogSelection.value = row
        dialogTableListRef.value.tableRef.clearSelection()
        dialogTableListRef.value.tableRef.toggleRowSelection(row, true)
    }
}
const newGoods = ref('')
const bindSpu = async (formEl) => {
    if (!dialogTableListRef.value) return
    const selectionRows = dialogTableListRef.value.tableRef.getSelectionRows()
    if (selectionRows.length > 1) {
        ElMessage({
            type: 'error',
            message: '只能选择一条标品数据'
        })
        return
    }
    if (selectionRows.length === 0) {
        ElMessage({
            type: 'error',
            message: '请选择一条标品数据'
        })
        return
    }
    const image = ref('')
    if (selectionRows[0].spuMediaList !== null) {
        for (let i = 0; i < selectionRows[0].spuMediaList.length; i++) {
            if (selectionRows[0].spuMediaList[i].mediaType + '' === '2') {
                image.value = selectionRows[0].spuMediaList[i].mediaUrl
            }
        }
    }
    selectionRows[0].image = image.value
    newGoods.value = selectionRows[0]
    emit('newGoodsList', newGoods.value)
    // dialogVisible.value = false
    // if (!formEl) return
    // formEl.resetFields()
    emit('RebinddialogClose', props.visible)
    // RebinddialogClose()
    // getStandardList()
}
const emit = defineEmits(['newGoodsList', 'RebinddialogClose'])
const searchrebind = () => {
    dialogCurrentPage.value = 1
    getStandardList()
}
// 关闭弹窗
const dialogFormRef = ref(null)
const RebinddialogClose = formEl => {
    if (!formEl) return
    formEl.resetFields()
    emit('RebinddialogClose', props.visible)
    getStandardList()
}
// 分页
const dialogCurrentChange = (val) => {
    dialogCurrentPage.value = val
    getStandardList()
}
const dialogSizeChange = (val) => {
    dialogCurrentPage.value = 1
    dialogPageSize.value = val
    getStandardList()
}
</script>
<style lang="scss" scoped>
 .coupon-submit-box{
    .p-text{
         color:red;
         font-size:12px;
     }
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }

 }
</style>
