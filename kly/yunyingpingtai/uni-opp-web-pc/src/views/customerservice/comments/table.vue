<template>
    <div class="mine-container" :goodList="shibieList">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" label-position="right" label-width="100px" :inline="true">
                <el-form-item label="商品名称" prop="skuName">
                    <el-input v-model="searchData.skuName" placeholder="请输入商品名称" clearable />
                </el-form-item>
                <el-form-item label="69码" prop="barcodes">
                    <el-input v-model="searchData.barcodes" placeholder="请输入条形码" clearable />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()">
                        搜索商品
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <el-checkbox-group
                v-model="checkedIds"
                @change="handlecheckedIdsChange"
            >
                <el-checkbox-button v-for="item, index in tableData" :key="index" :label="item" class="goods-box">
                    <div>
                        <div class="img-box">
                            <img :src="item.mediaUrl ? item.mediaUrl : './img/1.jpg'" class="goods-img">
                        </div>
                        <div class="goods-title">{{item.skuName}}</div>
                        <div class="goods-title">￥{{item.salePrice}}</div>
                    </div>
                </el-checkbox-button>
            </el-checkbox-group>

        </div>
        <div class="page-box" :style="align">
            <el-pagination
                v-if="showPage"
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="pageinfo.currentPage"
                :page-size="pageinfo.pageSize"
                :page-sizes="pageinfo.pageSizes"
                :layout="pageinfo.layout"
                :total="pageinfo.total"
            ></el-pagination>
        </div>
        <template v-if="!showPage">
            <el-empty description="暂无数据" />
        </template>
        <div v-if="shibieList.length">
            <h2>识别明细</h2>
            <system-list
                :tHead="tHead"
                :tableData="shibieList"
                v-model:current-page="pageinfo.currentPage"
                v-model:page-size="pageinfo.pageSize"
                :total="shibieList.length"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #salePrice="scope">
                    {{scope.row.salePrice}}
                </template>
                <template #quantity="scope">
                    {{scope.row.quantity}}
                </template>
                <template #opbtn="scope">
                    <el-button type="primary" @click="add(scope.row)" text>
                        <el-icon><CirclePlus /></el-icon>
                    </el-button>
                    <el-button type="primary" @click="delate(scope.row)" text>
                        <el-icon><Minus /></el-icon>
                    </el-button>
                </template>
            </system-list>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'

const store = useStore()
const checkAll = ref(false)
const isIndeterminate = ref(false)
const showPage = ref(false)
const editFormVisible = ref(false)
const tipsDialogVisible = ref(false)
const checkedIds = ref([])
const IDs = []
const shibieList = ref([])

const tableData = ref([])
const tHead = [
    { align: 'center', tooltip: true, prop: 'skuName', label: '商品名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'salePrice', label: '单价', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'quantity', label: '数量', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'opbtn', label: '操作', minWidth: 100, slot: true }
]
const dataState = reactive({
    searchData: {
        skuName: '',
        barcodes: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50],
        layout: 'total, sizes, prev, pager, next, jumper'
    },
    // modelList: [], // 商品算法列表
    containerList: [], // 选择货柜列表
    editInfo: {
        name: '',
        price: ''
    },
    isMulHanle: false,
    tipsHandleDetail: '',
    tipsHandleType: '', // 提示框类型
    tipsContent: '', // 提示内容
    tipsBtn1Text: '', // 提示按钮1文案
    tipsBtn2Text: '', // 提示按钮2文案
    tipsHandleTogether: false // 提示操作是否同步
})
const { searchData, containerList, pageinfo, editInfo } = toRefs(dataState)

const align = computed(() => {
    return { 'justify-content': 'center' }
})
onMounted(() => {
    getGoodsList()
})

const handlecheckedIdsChange = (value) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === IDs.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < IDs.length
    shibieList.value = value.map(item => {
        item.quantity = 1
        return {
            ...item
        }
    })
    console.log(value, shibieList.value, 'dhu')
}
// 列表数据
const getGoodsList = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC15115376423575552',
        name: 'sku通用查询接口V2',
        source: '商品中台',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            skuStatus: [4],
            channelTypes: [-1],
            searchSpuGoods: 1,
            skuName: dataState.searchData.skuName,
            barcodes: dataState.searchData.barcodes.split(',') || [],
            pageNo: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize
        }
    }
    checkAll.value = false
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        tableData.value = res.data.list
        dataState.pageinfo.total = res.data.total
        dataState.pageinfo.total > 0 ? showPage.value = true : showPage.value = false
    }
}

// 添加
const add = (row) => {
    row.quantity++
}
const delate = (row) => {
    if (row.quantity !== 0) {
        row.quantity--
    }
    if (row.quantity === 0) {
        shibieList.value.splice(row, 1)
    }
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getGoodsList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getGoodsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getGoodsList()
}

// 上架/下架
const upAndDownGoods = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'MS15469015838445574',
        name: '商品上下架',
        source: '商品中台',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            skuIds: dataState.isMulHanle ? checkedIds.value : [dataState.tipsHandleDetail.skuId],
            skuStatus: 6,
            channelType: 1,
            busiMerchantId: store.state.userInfo?.bisMerchantId || '' // 商户号
        }
    }
    // const res = await queryCommon(params)
    // if (res.code === '200') {
    //     ElMessage({
    //         showClose: true,
    //         message: res.message,
    //         type: 'success'
    //     })
    //     closeTips()
    //     searchCoupon()
    // }
}

// 编辑-获取商品信息
const getGoodsDetail = async (detail) => {
    editFormVisible.value = true
    dataState.tipsHandleDetail = detail
    dataState.editInfo.name = detail.skuName
    dataState.editInfo.price = detail.salePrice
}
// 操作
const handles = (type, detail) => {
    dataState.isMulHanle = false
    tipsDialogVisible.value = true
    dataState.tipsHandleDetail = detail
    dataState.tipsHandleType = type
    if (type === 'down') {
        dataState.tipsContent = '此操作将同步下架货柜商品，为避免异常订单的产生，请务必清空货柜该商品库存。点击仍要下架，下架商品，并将相应货柜商品删除。'
        dataState.tipsBtn1Text = '取消'
        dataState.tipsBtn2Text = '仍要下架'
    }
}
// 批量操作
const mulHanle = (type) => {
    if (checkedIds.value.length === 0) {
        ElMessage({
            showClose: true,
            message: '请选择商品',
            type: 'warning'
        })
    } else {
        dataState.isMulHanle = true
        tipsDialogVisible.value = true
        dataState.tipsHandleType = type
        if (type === 'down') {
            dataState.tipsContent = '此操作将同步下架货柜商品，为避免异常订单的产生，请务必清空货柜该商品库存。点击仍要下架，下架商品，并将相应货柜商品删除。'
            dataState.tipsBtn1Text = '取消'
            dataState.tipsBtn2Text = '仍要下架'
        }
    }
}

// 操作按钮1
const handleBtn1 = async () => {
    if (dataState.tipsHandleType === 'down') {
        closeTips()
    }
}
// 操作按钮2
const handleBtn2 = async () => {
    if (dataState.tipsHandleType === 'down') {
        upAndDownGoods()
    }
}
// 编辑提交
const editSubmit = async () => {
    const params = {
        appKey: 'A1001001', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'MS15469015838445575',
        name: 'SKU价格修改',
        source: '价格中台',
        body: {
            appKey: 'A1001001', // 系统编号
            busiCode: 'A1001002', // 业务线编号
            channelPrices: [{
                skuId: dataState.tipsHandleDetail.skuId,
                channelPrice: dataState.editInfo.price
            }],
            operatorId: 123,
            operatorName: '随便传的'
        }
    }
    // const res = await queryCommon(params)
    // if (res.code === '200') {
    //     editFormVisible.value = false
    //     ElMessage({
    //         showClose: true,
    //         message: res.message,
    //         type: 'success'
    //     })
    //     searchCoupon()
    // }
}
const closeTips = () => {
    tipsDialogVisible.value = false
}
</script>
<style lang="scss" scoped>
 .mine-container{
    :deep(.el-checkbox-button) {
        margin: 20px 40px 0 0;
    }
    :deep(.el-checkbox-button) {
        --el-checkbox-button-checked-bg-color: #fff;
        --el-checkbox-button-checked-text-color: #409eff;
        --el-checkbox-button-checked-border-color: #409eff;
    }
    :deep(.el-checkbox-button__inner) {
        border: none;
        text-align: left;
    }
    :deep(.el-checkbox-button:first-child .el-checkbox-button__inner) {
        // border: none;
    }
    :deep(.is-checked .el-checkbox-button__inner) {
        border: 1px solid #409eff;
    }
    .tableList-area{
        display: flex;
        justify-content: flex-start;
        .goods-box{
        width: 230px;
        .img-box{
            text-align: center;
            padding-bottom: 5px;
            height: 130px;
            .goods-img{
                height: 120px;
            }
        }

        .goods-title{
            width: 230px;
            font-size: 14px;
            color: #222;
            padding-bottom: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;/*内容超宽后禁止换行显示*/
            text-align: center;
        }
        .goods-code{
            font-size: 12px;
            color: #B0B0B0;
            padding-bottom: 10px;
        }
        .bottom{
            display: flex;
            .goods-price{
                font-size: 14px;
                color: #FE7E41;
                padding-bottom: 10px;
                width: 100px;
            }
            .handle{
                flex: 1;
                .handle-btn{
                    display: inline-block;
                    margin-right: 5px;
                    font-size: 12px;
                    color: #328EED;
                }
            }
        }
    }
    }

    .page-box {
        display: flex;
        margin-top: 24px;
    }
 }
</style>
