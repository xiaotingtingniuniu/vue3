<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item prop="merchantName" label="柜主名称">
                <el-input v-model="form.merchantName" placeholder="柜主名称" clearable />
            </el-form-item>
            <el-form-item prop="merchantId" label="柜主编号">
                <el-input v-model="form.merchantId" placeholder="柜主编号" clearable />
            </el-form-item>
            <el-form-item prop="skuIds" label="商品编号">
                <el-input v-model="form.skuIds" placeholder="商品编号" clearable />
            </el-form-item>
            <el-form-item prop="skuName" label="商品名称">
                <el-input v-model="form.skuName" placeholder="商品名称" clearable />
            </el-form-item>
            <el-form-item prop="dateStart" label="变动日期范围" class="form-item-time">
                <el-date-picker
                    v-model="form.dateStart"
                    type="datetimerange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    clearable
                />
            </el-form-item>
            <!-- <el-form-item prop="goodsIds" label="Goods编号">
                <el-input v-model="form.goodsIds" placeholder="Goods编号" clearable />
            </el-form-item> -->
            <el-form-item prop="goodsName" label="Goods名称">
                <el-input v-model="form.goodsName" placeholder="Goods名称" clearable />
            </el-form-item>
            <!-- <el-form-item prop="spuIds" label="标品编号">
                <el-input v-model="form.spuIds" placeholder="标品编号" clearable />
            </el-form-item> -->
            <el-form-item prop="secondChannelId" label="货柜编号">
                <el-input v-model="form.secondChannelId" placeholder="货柜编号" clearable />
            </el-form-item>
            <el-form-item prop="secondChannelName" label="货柜名称">
                <el-input v-model="form.secondChannelName" placeholder="货柜名称" clearable />
            </el-form-item>
            <el-form-item label="变更后可售数量" prop="minStock">
                <div style="display: flex;">
                    <el-input v-model.number="form.minStock" @blur="minStockBlur" placeholder="请输入" clearable/>～
                    <el-input v-model.number="form.maxStock" @blur="maxStockBlur" placeholder="请输入" clearable/>
                </div>
            </el-form-item><br />
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon()">
                    查询
                </el-button>
                <el-button type="primary" @click="resetForm(formRef)">
                    重置
                </el-button>
                <!-- <el-button type="primary" @click="exportTable()">
                    导出
                </el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="merchantId" label="柜主编号" />
            <el-table-column prop="merchantName" label="柜主名称" />
            <el-table-column prop="secondChannelId" label="二级渠道编号" />
            <el-table-column prop="secondChannelName" label="二级渠道名称" />
            <el-table-column prop="skuId" label="商品编号（SKU编号）" />
            <el-table-column prop="skuName" label="商品名称（SKU名称）" />
            <!-- <el-table-column prop="spuId" label="标品编号" /> -->
            <!-- <el-table-column prop="goodsId" label="Goods编号" /> -->
            <!-- 库存流水类型：0系统，1人工，2活动 -->
            <el-table-column prop="operationType" label="变动类型" >
                <template v-slot="{row}">
                    {{row.operationType ===0?"系统":row.operationType ===1?"人工":'活动'}}
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="可售数量变更">
                <template v-slot="{row}">
                    {{row.stockAfter - row.stockBefore}}
                </template>
            </el-table-column>
            <el-table-column prop="stockBefore" label="变更前可售数量" >
                <template #default="scope">
                    <span v-if="scope.row.stockBefore >= 0">{{scope.row.stockBefore}}</span>
                    <span v-else style="color: red;">{{scope.row.stockBefore}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stockAfter" label="变更后可售数量" >
                <template #default="scope">
                    <span v-if="scope.row.stockAfter >= 0">{{scope.row.stockAfter}}</span>
                    <span v-else style="color: red;">{{scope.row.stockAfter}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="lockStockBefore" label="预占变更前" />
            <el-table-column prop="lockStockAfter" label="预占变更后" />
            <!-- <el-table-column prop="orderStatus" label="状态">
                <template v-slot="{ row }">
                    <div v-if="row.orderStatus === 0">提交订单</div>
                    <div v-else-if="row.orderStatus === 1">支付订单</div>
                    <div v-else-if="row.orderStatus === 2">取消订单</div>
                    <div v-else-if="row.orderStatus === 3">订单取消退款</div>
                    <div v-else-if="row.orderStatus === -1">人工操作</div>
                    <div v-else-if="row.orderStatus === 4">活动锁定</div>
                    <div v-else-if="row.orderStatus === 5">活动返回</div>
                    <div v-else>-</div>
                </template>
            </el-table-column> -->
            <el-table-column prop="orderNo" label="相关单号" />
            <el-table-column prop="gmtCreate" label="变动时间" />
            <el-table-column prop="modifierId" label="变更人" />
            <!-- <el-table-column prop="deviceTypeName" label="设备类型"/>
            <el-table-column prop="deviceDoor" label="设备门信息"/>
            <el-table-column prop="deviceTempLayers" label="设备温层"/>
            <el-table-column prop="storageStyle" label="商品温层"/> -->
            <el-table-column prop="deviceTypeName" label="设备类型"/>
            <el-table-column prop="thirdChannelIdName" label="设备门信息"/>
            <el-table-column prop="deviceTempLayer" label="设备温层"/>
            <el-table-column prop="storageStyle" label="商品温层"/>
        </el-table>
        <div class="bottom">
            <!-- <el-checkbox v-model="checked" label="全选" size="large" />
            <el-select v-model="form.region" placeholder="批量操作">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
            </el-select> -->
            <div class="demo-pagination-block" style="margin: 0 auto">
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
import { computed, reactive, ref, onMounted } from 'vue'
import { getMerchantList } from '@/api/operate/index'
import { exportDetails } from '@/api/moneyManagement'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    merchantName: '',
    merchantId: '',
    skuIds: '',
    skuName: '',
    dateStart: [],
    secondChannelName: '',
    secondChannelId: '',
    spuIds: '',
    goodsIds: '',
    goodsName: '',
    minStock: '',
    maxStock: ''
})
// 底部全选复选框
const checked = ref(false)

// 分页中的页面默认跳转至页数
const currentPage4 = ref('')
// 分页中页面条数的显示
const pageSize4 = ref(100)

const tableData = ref([])

onMounted(() => {
    getRefundList()
})

// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }

})

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getRefundList()
}

// 展示数据接口
const getRefundList = async () => {
    const params = {
        body: {
            channelType: 1,
            appKey: 'A1001000',
            busiCode: 'A1001002',
            minStock: form.minStock,
            maxStock: form.maxStock,
            merchantId: form.merchantId,
            merchantName: form.merchantName,
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            goodsIds: form.goodsIds === '' ? [] : [form.goodsIds],
            firstChannelId: form.firstChannelId,
            secondChannelIds: form.secondChannelId === '' ? [] : [form.secondChannelId],
            secondChannelName: form.secondChannelName,
            dateStart: form.dateStart[0],
            dateEnd: form.dateStart[1],
            goodsName: form.goodsName,
            spuIds: form.spuIds === '' ? [] : [form.spuIds],
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            }
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        // configCode: 'UC16216960704966656',
        configCode: 'UCJH72343874575572992',
        name: '库存流水查询聚合设备和商品',
        source: '运营后台',
        modifierId: userInfo.value.id,
        operatorId: userInfo.value.id,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data ? data.records : []
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

// 重置
const resetFormData = ref(null)
const resetForm = () => {
    resetFormData.value.resetFields()
    form.maxStock = ''
    setTimeout(() => {
        dataState.pageinfo.currentPage = 1
        getRefundList()
    })
}

// 导出
const exportTable = async () => {
    const params = {
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC16216846724755456',
        name: '库存查询',
        source: '库存中台',
        exportType: 10,
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            channelType: 1,
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
            secondChannelId: form.secondChannelId
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
.form-item-time{
    width: 535px;
    :deep(.el-date-editor){
        flex: 1;
    }
}
.date-list {
    background-color: rgba($color: black, $alpha: 0.2);
    margin-top: 10px;
    display: flex;
    span {
        flex: 1;
    }
}
.bottom {
    display: flex;
}
</style>
