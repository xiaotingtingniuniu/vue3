<template>
    <div class="data-migration-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="商家编号" prop="busiMerchantId">
                        <el-input v-model="searchData.busiMerchantId" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="商家名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入商家名称" clearable />
                    </el-form-item>
                    <el-form-item label="商家手机号" prop="merchantPhone">
                        <el-input v-model="searchData.merchantPhone" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="设备编号" prop="deviceId">
                        <el-input v-model="searchData.deviceId" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="设备名称" prop="deviceName">
                        <el-input v-model="searchData.deviceName" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="代运营商编号" prop="merchantSubId">
                        <el-input v-model="searchData.merchantSubId" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="是否有标品匹配" prop="isMatch" label-width="120px">
                        <el-select v-model="searchData.isMatch" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="是" :value="1" />
                            <el-option label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="是否有建模" prop="isModeling">
                        <el-select v-model="searchData.isModeling" clearable>
                            <el-option label="全部" value="" />
                            <el-option label="是" :value="1" />
                            <el-option label="否" :value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标品名称" prop="spuName">
                        <el-input v-model="searchData.spuName" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="标品69码" prop="barcode">
                        <el-input v-model="searchData.barcode" placeholder="精确匹配" clearable />
                    </el-form-item>
                    <el-form-item label="迁移状态" prop="skuDealStatus">
                        <el-select v-model="searchData.skuDealStatus">
                            <el-option label="待迁移" :value="0" />
                            <el-option label="已迁移" :value="1" />
                            <el-option label="已清除" :value="2" />
                            <el-option label="迁移失败" :value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标品匹配时间" prop="regTime" class="form-item-time">
                        <el-date-picker size="default" v-model="searchData.regTime" type="daterange" value-format="YYYY-MM-DD" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <div>
                            <el-button type="primary" @click="allSelection()">全选</el-button>
                            <el-button type="primary" @click="clearGoods()" :disabled="selection.length ? false : true" title="支持清除所选的商品信息">清除失效商品</el-button>
                            <el-button type="primary" @click="refreshGoods()" :disabled="refreshButtonHighlight ? false : true" title="根据搜索条件中的【商家编号】或【商家编号】+【代运营商编号】，更新没有标品匹配的数据">刷新</el-button>
                            <el-button type="primary" @click="goodsTransfer()" :disabled="refreshButtonHighlight ? false : true" title="根据搜索条件中的【商家编号】或【商家编号】+【代运营商编号】，迁移全量的所选柜主下的设备商品数据">一键迁移</el-button>
                        </div>
                        <div>
                            <el-button type="primary" @click="searchList">搜索</el-button>
                            <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list ref="tableListRef" :height="tableHeight" :tHead="tHead" :tableData="tableData" v-model:current-page="currentPage" @selection-change="selectable" v-model:page-size="pageSize" :total="total" @size-change="sizeChange" @current-change="currentChange">
                    <template #matchTime="scope">
                        {{ scope.row.matchTime.replace('T', ' ') }}
                    </template>
                    <template #isMatch="scope">
                        {{ scope.row.isMatch ? '是' : '否' }}
                    </template>
                    <template #isModeling="scope">
                        {{ scope.row.isModeling ? '是' : '否' }}
                    </template>
                    <template #image="scope">
                        <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.image" :preview-src-list="[scope.row.image]" fit="cover" />
                    </template>
                    <template #mediaUrl="scope">
                        <el-image style="width: 100px; height: 100px" preview-teleported :src="scope.row.mediaUrl" :preview-src-list="[scope.row.mediaUrl]" fit="cover" />
                    </template>
                    <template #operation="scope">
                        <el-button link type="primary" @click="showDialog(scope.row)">关联标品</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
    <el-dialog v-model="dialogTableVisible" title="关联标品-公共商品库" width="950px" @close="dialogClose">
        <el-form ref="dialogFormRef" :model="dialogSearch" :inline="true" label-position="right" label-width="100px">
            <el-form-item label="标品编码" prop="spuIds" label-width="75px">
                <el-input v-model="dialogSearch.spuIds" placeholder="精确匹配" />
            </el-form-item>
            <el-form-item label="标品名称" prop="spuName" label-width="75px">
                <el-input v-model="dialogSearch.spuName" placeholder="请输入标品名称" />
            </el-form-item>
            <el-form-item label="标品69码" prop="barcodes" label-width="75px">
                <el-input v-model="dialogSearch.barcodes" placeholder="精确匹配" />
            </el-form-item>
            <el-form-item class="button-box">
                <el-button type="primary" @click="dialogSearchList" :disabled="(dialogSearch.spuIds || dialogSearch.spuName || dialogSearch.barcodes) ? false : true">搜索</el-button>
                <el-button type="primary" @click="dialogResetForm(dialogFormRef)" :disabled="(dialogSearch.spuIds || dialogSearch.spuName || dialogSearch.barcodes) ? false : true">重置</el-button>
                <el-button type="primary" @click="bindSpu()" :disabled="dialogSelection ? false : true">绑定所选标品</el-button>
            </el-form-item>
        </el-form>
        <system-list class="dialogTable" :height="300" ref="dialogTableListRef" :tHead="dialogTHead" :tableData="dialogTableData" v-model:current-page="dialogCurrentPage" @select="dialogSelectable" v-model:page-size="dialogPageSize" :total="dialogTotal" @size-change="dialogSizeChange" @current-change="dialogCurrentChange">
            <template #spuMediaList="scope">
                <el-image style="width: 100px; height: 100px" preview-teleported :src="getPicByMediaType(scope.row.spuMediaList, 9)" :preview-src-list="[getPicByMediaType(scope.row.spuMediaList, 9)]" fit="cover" />
            </template>
            <template #modelMediaList="scope">
                <el-image style="width: 100px; height: 100px" preview-teleported :src="getPicByMediaType(scope.row.modelMediaList, 1)" :preview-src-list="[getPicByMediaType(scope.row.modelMediaList, 1)]" fit="cover" />
            </template>
        </system-list>
    </el-dialog>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { ref, onBeforeMount } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getPicByMediaType } from '@/utils'

const searchData = ref({
    busiMerchantId: null,
    merchantName: null,
    merchantPhone: null,
    deviceId: null,
    deviceName: null,
    isMatch: null,
    isModeling: null,
    spuName: null,
    regTime: null,
    barcode: null,
    merchantSubId: null,
    skuDealStatus: 0
})
// 刷新 和 一键迁移 按钮是否可用 都依赖于此标记
const refreshButtonHighlight = ref(false)

onBeforeMount(() => {
    getData()
})

const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight - 407
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight - 407
}

const tHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'busiMerchantId', label: '柜主-商家编号', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '柜主名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantPhone', label: '柜主手机号', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'deviceId', label: '设备编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'deviceName', label: '设备名称', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'merchantSubId', label: '代运营商-商家编号', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantSubName', label: '代运营商名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'merchantSubPhone', label: '代运营商手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'matchTime', label: '标品匹配时间', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'isMatch', label: '是否有标品匹配', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'isModeling', label: '是否有建模', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '关联标品', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'oldSkuId', label: '原Sku编码', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'oldSkuName', label: '原商品名称', minWidth: 250 },
    { align: 'center', tooltip: true, prop: 'image', label: '原商品图片', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'oldBarCode', label: '原69码', minWidth: 160 },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编码', minWidth: 280 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 250 },
    { align: 'center', tooltip: true, prop: 'mediaUrl', label: '标品图片-Pad图', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'barcode', label: '标品69码', minWidth: 160 }
]

const tableData = ref([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const secondChannelId = ref(null)
const getData = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            // skuDealStatus: 0, // 迁移状态 0初始 1迁移完成 2清除 3迁移失败
            ...searchData.value,
            matchTimeStart: searchData.value.regTime ? searchData.value.regTime[0] : null,
            matchTimeEnd: searchData.value.regTime ? searchData.value.regTime[1] : null,
            currPage: currentPage.value,
            pageSize: pageSize.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UCJH49094731371188224',
        name: '三方sku跟自研SPU关联查询（列表）-聚合代运营商id',
        source: '运营后台'
    }
    const res = await getMerchantList(params)
    tableData.value = res.list || []
    total.value = res.total
    secondChannelId.value = res.deviceId || null
    if (searchData.value.busiMerchantId && total.value) {
        refreshButtonHighlight.value = true
    } else {
        refreshButtonHighlight.value = false
    }
}

const searchList = async () => {
    if (searchData.value.merchantSubId && !searchData.value.busiMerchantId) {
        return ElMessage({
            type: 'warning',
            message: '请在搜索条件中输入“商家编号”，再进行“代运营商”维度的商品数据搜索和数据迁移！'
        })
    }
    currentPage.value = 1
    getData()
}
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getData()
}
const tableListRef = ref(null)
const allSelection = () => {
    if (!tableListRef.value) return
    tableListRef.value.tableRef.toggleAllSelection()
}

const sizeChange = (val) => {
    currentPage.value = 1
    pageSize.value = val
    getData()
}
const currentChange = (val) => {
    currentPage.value = val
    getData()
}

const selection = ref([])
const selectable = (val) => {
    selection.value = val
}

// 清除失效商品
const clearGoods = () => {
    if (!tableListRef.value) return
    const selectionRows = tableListRef.value.tableRef.getSelectionRows()
    ElMessageBox.confirm(
        '【清除失效商品】将会清除所有选中商品中没有标品建模的设备商品。请再次确认后点击"确认清除"按钮完成后续操作', {
            confirmButtonText: '确认清除',
            cancelButtonText: '关闭',
            center: true
        }).then(async () => {
        const params = {
            body: {
                appKey: 'A1001001',
                busiCode: 'A1001002',
                list: selectionRows.map(item => {
                    return {
                        merchantId: item.busiMerchantId,
                        outSkuId: item.oldSkuId,
                        secondChannelId: null
                    }
                })
            },
            appKey: 'A1001001',
            busiCode: 'A1001002',
            configCode: 'UC35777964789207040',
            name: '清除失效商品',
            source: '商品中台'
        }
        await getMerchantList(params)
        await getData()
        ElMessage({
            type: 'success',
            message: '操作成功'
        })
    })
}

// 刷新
const refreshGoods = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            merchantId: searchData.value.busiMerchantId,
            secondChannelId: secondChannelId.value
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC35071425053429760',
        name: '根据柜主刷新标品',
        source: '商品中台'
    }
    await getMerchantList(params)
    await getData()
    ElMessage({
        type: 'success',
        message: '操作成功'
    })
}

// 一键迁移
const goodsTransfer = async () => {
    ElMessageBox.confirm(
        '<span style="color: #FE2C55; font-weight: bold">一键迁移前，请务必确认柜主的设备商品已绑定SPU并完成建模。</span><br/>注：可通过柜主或代运营商的手机号，联系柜主完成商品确认、图片采集、商品上下架操作。',
        {
            confirmButtonText: '一键迁移',
            cancelButtonText: '关闭',
            dangerouslyUseHTMLString: true
        })
        .then(() => {
            ElMessageBox.confirm(
                '<span style="color: #FE2C55; font-weight: bold">为保证数据迁移正确，避免后续因商品无法识别造成异常订单导致柜主货损，请务必确认柜主的设备商品已绑定SPU并完成建模。若已完成以上工作，请点击“一键迁移”按钮，完成一键迁移。</span>', {
                    confirmButtonText: '一键迁移',
                    cancelButtonText: '关闭',
                    dangerouslyUseHTMLString: true
                })
                .then(async () => {
                    const params = {
                        body: {
                            appKey: 'A10010041',
                            busiCode: 'A1001002',
                            merchantId: searchData.value.busiMerchantId,
                            secondChannelIds: secondChannelId.value?.split(',') || null
                        },
                        appKey: 'A1001001',
                        busiCode: 'A1001002',
                        configCode: 'UC35826894155550720',
                        name: '三方sku匹配自研spu',
                        source: '商品中台'
                    }
                    await getMerchantList(params)
                    await getData()
                    ElMessage({
                        type: 'success',
                        message: '操作成功'
                    })
                })
        })
}

// 关联标品相关
const editGoods = ref(null)
const showDialog = (row) => {
    dialogTableVisible.value = true
    editGoods.value = row
}
// 关闭时的回调 清空筛选项
const dialogClose = () => {
    dialogSelection.value = null
    dialogTableListRef.value.tableRef.clearSelection()
    editGoods.value = null
    dialogTableData.value = []
    dialogTotal.value = 0
    dialogCurrentPage.value = 1
    dialogSearch.value = {
        spuIds: null,
        spuName: null,
        barcodes: null
    }
}
const dialogTableVisible = ref(false)
const dialogSearch = ref({
    spuIds: null,
    spuName: null,
    barcodes: null
})
const dialogTHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'spuId', label: '标品编码', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', minWidth: 180 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'spuMediaList', label: '标品图片-Pad图', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'modelMediaList', label: '标品模型训练首图', minWidth: 150, slot: true }
]
const dialogTableListRef = ref(null)
const dialogTableData = ref([])
const dialogTotal = ref(0)
const dialogCurrentPage = ref(1)
const dialogPageSize = ref(10)
const dialogSizeChange = (val) => {
    dialogCurrentPage.value = 1
    dialogPageSize.value = val
    getDialogData()
}
const dialogCurrentChange = (val) => {
    dialogCurrentPage.value = val
    getDialogData()
}
const dialogSearchList = async () => {
    dialogCurrentPage.value = 1
    getDialogData()
}
const dialogFormRef = ref(null)
const dialogResetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dialogSelection.value = null
    dialogTableListRef.value.tableRef.clearSelection()
    dialogTableData.value = []
    dialogTotal.value = 0
    dialogCurrentPage.value = 1
}
const getDialogData = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            spuIds: [dialogSearch.value.spuIds],
            spuName: dialogSearch.value.spuName,
            barcodes: [dialogSearch.value.barcodes],
            pageNo: dialogCurrentPage.value,
            pageSize: dialogPageSize.value,
            saleChannels: ['货柜']
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC15115376448741376',
        name: 'spu通用搜索接口V2',
        source: '商品中台'
    }
    const res = await getMerchantList(params)
    dialogTableData.value = res.list
    dialogTotal.value = res.total
}

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
const bindSpu = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            merchantId: editGoods.value.busiMerchantId,
            outSkuIds: [editGoods.value.oldSkuId],
            spuId: dialogSelection.value.spuId,
            secondChannelId: editGoods.value.deviceId
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC36030730577121280',
        name: '三方sku跟自研SPU关联编辑',
        source: '商品中台'
    }
    await getMerchantList(params)
    ElMessage({
        type: 'success',
        message: '操作成功'
    })
}

</script>
<style lang="scss" scoped>
.data-migration-page{
    .gray{
        color: #9b9b9b;
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    width: 535px;
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                    :deep(.el-form-item__content){
                        .el-range-editor.el-input__inner{
                            padding: 0 10px;
                        }
                    }
                }
                .button-box{
                    width: 100%;
                    :deep(.el-form-item__content){
                        display: flex;
                        justify-content: space-between;
                        .el-button{
                            border: initial;
                        }
                    }
                }
            }
        }
    }
}
.dialogTable{
    :deep(thead){
        .el-table-column--selection{
            .el-checkbox__input{
                display: none;
            }
        }
    }
}
</style>
