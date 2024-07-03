<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="商品编号" prop="skuIds">
                <el-input v-model="form.skuIds"  placeholder="商品编号" clearable/>
            </el-form-item>
            <el-form-item label="商品名称" prop="skuName">
                <el-input v-model="form.skuName"  placeholder="商品名称" clearable/>
            </el-form-item>
            <el-form-item label="货柜编号" prop="secondChannelId">
                <el-input v-model="form.secondChannelId"  placeholder="货柜编号" clearable/>
            </el-form-item>
            <el-form-item label="货柜名称" prop="secondChannelName">
                <el-input v-model="form.secondChannelName"  placeholder="货柜名称" clearable/>
            </el-form-item>
            <!-- <el-form-item label="Goods编号" prop="goodsIds">
                <el-input v-model="form.goodsIds"  placeholder="Goods编号" clearable/>
            </el-form-item> -->
            <el-form-item label="Goods名称" prop="goodsName">
                <el-input v-model="form.goodsName"  placeholder="Goods名称" clearable/>
            </el-form-item>
            <el-form-item label="商品条码" prop="barcodes">
                <el-input v-model="form.barcodes"  placeholder="商品条码" clearable/>
            </el-form-item>
            <el-form-item label="柜主名称" prop="merchantName">
                <el-input v-model="form.merchantName"  placeholder="柜主名称" clearable/>
            </el-form-item>
            <el-form-item label="柜主编号" prop="merchantId">
                <el-input v-model="form.merchantId"  placeholder="柜主编号" clearable/>
            </el-form-item>
            <!-- <el-form-item label="标品编号" prop="spuIds">
                <el-input v-model="form.spuIds"  placeholder="标品编号" clearable/>
            </el-form-item> -->
            <el-form-item label="库存数量" prop="minStock">
                <div style="display: flex;">
                    <el-input v-model.number="form.minStock" @blur="minStockBlur" placeholder="请输入" clearable/>～
                    <el-input v-model.number="form.maxStock" @blur="maxStockBlur" placeholder="请输入" clearable/>
                </div>
            </el-form-item>
            <br />
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="resetForm">
                    重置
                </el-button>
                <el-button type="primary" @click="exportTable">
                    导出
                </el-button>
            </el-form-item>
        </el-form>
        <!-- <div class="date-list"  style="float:right">
            <el-form :model="form" label-width="120px">
                <el-select v-model="form.region" placeholder="排列顺序">
                    <el-option label="Zone one" value="shanghai" />
                    <el-option label="Zone two" value="beijing" />
                </el-select>
            </el-form>
        </div> -->
        <el-table :data="tableData" style="width: 100%" @select="onselect">
            <!-- <el-table-column prop="checked1" label="选择列" align="center">
                <div >
                    <el-checkbox v-model="checked1" label="" size="large" />
                </div>
            </el-table-column> -->
            <el-table-column prop="merchantId" label="柜主编号" />
            <el-table-column prop="merchantName" label="柜主名称" />
            <el-table-column prop="skuName" label="商品名称（SKU名称）"/>
            <!-- <el-table-column prop="skuName" label="商品名称"/> -->
            <el-table-column prop="secondChannelName" label="货柜名称"/>
            <el-table-column prop="secondChannelId" label="货柜编号"/>
            <el-table-column prop="stock" label="库存数量">
                <template #default="scope">
                    <span v-if="scope.row.stock >= 0">{{scope.row.stock}}</span>
                    <span v-else style="color: red;">{{scope.row.stock}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="spuId" label="标品编号"/> -->
            <el-table-column prop="salePrice" label="售价"/>
            <el-table-column prop="pointPosition" label="点位名称"/>
            <!-- <el-table-column prop="goodsId" label="Goods编号"/> -->
            <el-table-column prop="skuId" label="商品编号"/>
            <el-table-column prop="lockStock" label="预占数量"/>
            <el-table-column prop="deviceTypeName" label="设备类型"/>
            <el-table-column prop="thirdChannelIdName" label="设备门信息"/>
            <el-table-column prop="deviceTempLayer" label="设备温层"/>
            <el-table-column prop="storageStyle" label="商品温层"/>

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
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { getInventoryList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { exportDetails } from '@/api/moneyManagement'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    merchantName: '',
    merchantId: '',
    skuIds: '',
    skuName: '',
    secondChannelId: '',
    secondChannelName: '',
    goodsIds: '',
    goodsName: '',
    barcodes: '',
    spuIds: '',
    minStock: '',
    maxStock: ''
})
// 底部全选复选框
const checked = ref(false)
const checked1 = ref(false)

const add = () => {
    router.push({ name: 'inventory-add-list' })
}
const toapply = (orderNo) => {
    router.push({ name: 'inventory-editor-list' })
}

const tableData = ref([])

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    form.maxStock = ''
    resetFormData.value.resetFields()
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getRefundList()
    })
}

// 数据接口

const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})
// 数据总数
const totals = ref(0)

onMounted(async () => {
    getRefundList()
    // uslistone()
    // uslisttwo()
})

const onelist = ref([])
const twolist = ref([])

// 展示数据接口
const getRefundList = async () => {
    const params = {
        body: {
            channelType: 1,
            appKey: 'A1001000',
            busiCode: 'A1001002',
            minStock: form.minStock,
            maxStock: form.maxStock,
            merchantName: form.merchantName,
            merchantId: form.merchantId,
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            goodsIds: form.goodsIds === '' ? [] : [form.goodsIds],
            spuIds: form.spuIds === '' ? [] : [form.spuIds],
            goodsName: form.goodsName,
            secondChannelName: form.secondChannelName,
            secondChannelIds: form.secondChannelId === '' ? [] : [form.secondChannelId],
            barcodes: form.barcodes === '' ? [] : [form.barcodes],
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            }
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        // configCode: 'UC16216846724755456',
        configCode: 'UCJH72334264020017152',
        // name: '库存查询',
        name: '库存查询聚合设备和商品',
        // source: '库存中台',
        source: '运营后台',
        modifierId: userInfo.value.id,
        operatorId: userInfo.value.id,
        operatorName: userInfo.value.name

    }
    const data = await getInventoryList(params)
    tableData.value = data ? data.list : []
    dataState.pageinfo.total = data ? data.total : 0
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

const minStockBlur = () => {
    if (!form.minStock) return
    if (/\d/.test(form.minStock)) {
        if (form.maxStock && (form.maxStock < form.minStock)) {
            ElMessage.error('输入的最小库存不能大于最大库存')
            form.minStock = ''
        }
    } else {
        ElMessage.error('请输入数字！')
    }
}

const maxStockBlur = () => {
    if (!form.maxStock) return
    if (/\d/.test(form.maxStock)) {
        if (form.minStock && (form.minStock > form.maxStock)) {
            ElMessage.error('输入的最大库存不能大于最小库存')
            form.maxStock = ''
        }
    } else {
        ElMessage.error('请输入数字！')
    }
}

// 查询
// GOODS165796715460328471 SKU165797196618369677
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
}

// 复选全选
const onselect = (selection, row) => {
    // console.log(selection, row)
}

const onCheck = () => {
    if (checked.value) {
        checked1.value = true
    } else {
        checked1.value = false
    }
}
// 导出
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        // configCode: 'UC16216846724755456',
        configCode: 'UCJH72334264020017152',
        name: '库存查询聚合设备和商品',
        source: '运营后台',
        exportType: 10,
        body: {
            channelType: 1,
            appKey: 'A1001000',
            busiCode: 'A1001002',
            minStock: form.minStock,
            maxStock: form.maxStock,
            merchantName: form.merchantName,
            merchantId: form.merchantId,
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            goodsIds: form.goodsIds === '' ? [] : [form.goodsIds],
            spuIds: form.spuIds === '' ? [] : [form.spuIds],
            goodsName: form.goodsName,
            secondChannelName: form.secondChannelName,
            secondChannelIds: form.secondChannelId === '' ? [] : [form.secondChannelId],
            barcodes: form.barcodes === '' ? [] : [form.barcodes]
        }
    }
    const res = await exportDetails(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    // console.log(fileName)
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('=') + 1)
    }
    const link = document.createElement('a')// 创建一个a标签
    link.download = fileName// 设置a标签的下载属性
    link.style.display = 'none'// 将a标签设置为隐藏
    link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
    document.body.appendChild(link)// 将a标签添加到body中
    link.click()// 执行a标签的点击方法
    URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
    document.body.removeChild(link)// 移除a标签
}
</script>

<style lang="scss" scoped>
// .el-form-item{
//     width: 250px;
// }
.btns{
    margin: 50px 0 20px 1300px;
}
.date-list{
    background-color: rgba($color: black, $alpha: 0.2);
    margin-top: 10px;
    display: flex;
span{
    flex: 1;
}
}
.bottom{
    display: flex;
}
</style>
