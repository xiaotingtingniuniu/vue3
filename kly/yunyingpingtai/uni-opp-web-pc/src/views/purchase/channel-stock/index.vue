<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="标品编号" prop="spuIds">
                <el-input v-model="form.spuIds"  placeholder="标品编号"/>
            </el-form-item>
            <el-form-item label="商品条码" prop="barcodes">
                <el-input v-model="form.barcodes"  placeholder="商品条码"/>
            </el-form-item>
            <br>
            <el-form-item label="商品编号" prop="skuIds">
                <el-input v-model="form.skuIds"  placeholder="商品编号"/>
            </el-form-item>
            <el-form-item label="商品名称" prop="skuName">
                <el-input v-model="form.skuName"  placeholder="商品名称"/>
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="exportTable">
                    导出
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="skuId" label="商品编号"  />
            <el-table-column prop="skuName" label="商品名称"  />
            <el-table-column prop="stock" label="商品数量" />
            <el-table-column prop="productSpec" label="商品规格" />
            <el-table-column prop="lockStock" label="预占数量" />
            <el-table-column prop="spuId" label="标品编号" />
            <el-table-column prop="barcode" label="商品条码" />
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
import { getMerchantList, replenishmentExport } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 查询项
const form = reactive({
    spuIds: '',
    barcodes: '',
    skuIds: '',
    skuName: ''
})
const tableData = ref([])
// 数据接口
const dataState = reactive({
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    row: null
})
// 数据总数
const totals = ref(0)

onMounted(async () => {
    getList()
})
// 获取补货单数据
const getList = async () => {
    const params = {
        body: {
            spuIds: form.spuIds === '' ? [] : [form.spuIds],
            barcodes: form.barcodes === '' ? [] : [form.barcodes],
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            channelType: 6,
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            },
            appKey: 'A1001000',
            busiCode: 'A1001006'
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC16216846724755456',
        name: '库存查询',
        source: '库存中台',
        modifierId: userInfo.value.id,
        operatorId: userInfo.value.id,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    if (data) {
        tableData.value = data.list
        dataState.pageinfo.total = data.total
    } else {
        tableData.value = []
        dataState.pageinfo.total = 0
    }
}
// 导出
const exportTable = async () => {
    const params = {
        body: {
            spuIds: form.spuIds === '' ? [] : [form.spuIds],
            barcodes: form.barcodes === '' ? [] : [form.barcodes],
            skuIds: form.skuIds === '' ? [] : [form.skuIds],
            skuName: form.skuName,
            channelType: 6,
            page: {
                pageNo: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            },
            appKey: 'A1001000',
            busiCode: 'A1001006'
        },
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC16216846724755456',
        exportType: 10,
        name: '库存查询',
        source: '库存中台'
    }
    const res = await replenishmentExport(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
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
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getList()
}
// 当前页改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList()
}
// 查询
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getList()
}

</script>

<style lang="scss" scoped>
.stockListBox{
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
    .el-pager li.is-active{
        color: #409EFF !important;
    }
    .primaryBox{
        color: #409EFF !important;
    }
    .demo-pagination-block{
        .is-active{
            color: #409EFF !important;
        }
    }
}

</style>
