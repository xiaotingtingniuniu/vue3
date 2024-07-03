<template>
    <div class="stockListBox">
        <div class="big-title">单据详情</div>
        <el-form ref="resetFormData" :model="form" label-width="140px" :inline="true">
            <el-form-item label="单据类型：" prop="billType">
                <el-select v-model="form.billType"  placeholder="单据类型" disabled>
                    <el-option label="采购入库单(仓)" :value="0" />
                    <el-option label="采购入库单(店)" :value="1" />
                </el-select>
            </el-form-item>
            <el-form-item label="单号：" prop="purchaseBillNo">
                <el-input v-model="form.purchaseBillNo"  placeholder="单号" disabled/>
            </el-form-item>
            <el-form-item label="相关单号：" prop="warehousingNo">
                <el-input v-model="form.warehousingNo"  placeholder="相关单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">发货方信息</div>
            <el-form-item label="发货方编号：" prop="senderNo">
                <el-input v-model="form.senderNo"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="发货方名称：" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="发货方联系人：" prop="senderContacts">
                <el-input v-model="form.senderContacts"  placeholder="单据类型" disabled/>
            </el-form-item>
            <el-form-item label="发货方联系方式：" prop="senderContactInformation">
                <el-input v-model="form.senderContactInformation"  placeholder="单号" disabled/>
            </el-form-item>
            <el-form-item label="发货方地址：" prop="senderAddress">
                <el-input v-model="form.senderAddress"  placeholder="相关单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">收货方信息</div>
            <el-form-item label="收货方编号：" prop="receiverNo">
                <el-input v-model="form.receiverNo"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方名称：" prop="receiverName">
                <el-input v-model="form.receiverName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="收货方联系人：" prop="receiverContacts">
                <el-input v-model="form.receiverContacts"  placeholder="仓/门店编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方联系方式：" prop="receiverContactInformation">
                <el-input v-model="form.receiverContactInformation"  placeholder="仓/门店名称" disabled/>
            </el-form-item>
            <el-form-item label="收货方地址：" prop="receiverAddress">
                <el-input v-model="form.receiverAddress"  placeholder="采购主体" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">单据信息</div>
            <el-form-item label="数量：" prop="sumCount">
                <el-input v-model="form.sumCount"  placeholder="仓/门店编号" disabled/>
            </el-form-item>
            <el-form-item label="体积（立方米）：" prop="sumVolume">
                <el-input v-model="form.sumVolume"  placeholder="仓/门店名称" disabled/>
            </el-form-item>
            <el-form-item label="重量（千克）：" prop="sumWeight">
                <el-input v-model="form.sumWeight"  placeholder="采购主体" disabled/>
            </el-form-item>
            <br>
            <!--<el-form-item class="button-box">
                <el-button type="primary" @click="search">
                    查询
                </el-button>
                <el-button type="primary" @click="exportTable">
                    导出
                </el-button>
            </el-form-item>-->
        </el-form>
        <div class="big-title">商品明细</div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="序号" />
            <el-table-column prop="standardBarCode" label="商品条码"  />
            <el-table-column prop="goodsNo" label="商品编号"  />
            <el-table-column prop="goodsName" label="商品名称"  />
            <el-table-column prop="goodsSpecs" label="商品规格" />
            <el-table-column prop="goodsCount" label="数量" />
            <el-table-column prop="relevantGoodsNo" label="相关商品编号" />
            <el-table-column prop="relevantGoodsName" label="相关商品名称" />
            <el-table-column prop="relevantGoodsUnit" label="相关商品单位" />
            <el-table-column prop="relevantGoodsSpecs" label="相关商品规格" />
            <el-table-column prop="relevantGoodsCount" label="相关商品数量" />
            <el-table-column prop="standardCategory" label="标品类目" />
            <el-table-column prop="standardNo" label="标品编号" />
            <el-table-column prop="standardName" label="标品名称" />
            <el-table-column prop="goodsConvert" label="发货方商品与标品关系" />
            <el-table-column prop="relevantGoodsConvert" label="收货方商品与标品关系" />
        </el-table>
        <!--<div class="bottom">
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
        </div>-->
        <div class="confirm-btns">
            <el-button type="primary" @click="toBack">
                返回
            </el-button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, defineEmits } from 'vue'
import { replenishmentkDetail, replenishmentExport } from '@/api/oms/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
const props = defineProps(['id'])
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'getList'])
// 查询项
const form = reactive({
    billType: '',
    purchaseBillNo: '',
    warehousingNo: '',
    senderNo: '',
    senderName: '',
    senderContacts: '',
    senderContactInformation: '',
    senderAddress: '',
    receiverNo: '',
    receiverName: '',
    receiverContacts: '',
    receiverContactInformation: '',
    receiverAddress: '',
    sumCount: '',
    sumVolume: '',
    sumWeight: ''
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
    getDataList()
})
// 获取列表数据
const getDataList = async () => {
    const params = {
        billNo: props.id,
        appKey: '', // 系统编号
        busiCode: '' // 业务线编号
    }
    const { data, count } = await replenishmentkDetail(params)
    form.billType = data.billType
    form.purchaseBillNo = data.purchaseBillNo
    form.warehousingNo = data.warehousingNo
    form.senderNo = data.senderNo
    form.senderName = data.senderName
    form.senderContacts = data.senderContacts
    form.senderContactInformation = data.senderContactInformation
    form.senderAddress = data.senderAddress
    form.receiverNo = data.receiverNo
    form.receiverName = data.receiverName
    form.receiverContacts = data.receiverContacts
    form.receiverContactInformation = data.receiverContactInformation
    form.receiverAddress = data.receiverAddress
    form.sumCount = data.sumCount
    form.sumVolume = data.sumVolume
    form.sumWeight = data.sumWeight
    tableData.value = data.details
    dataState.pageinfo.total = count
}
// 返回列表
const toBack = () => {
    router.push({ name: 'purchase-replenishment-list' })
}
// 导出
// const exportTable = async () => {
//     const params = {
//         body: {
//             pageNum: dataState.pageinfo.currentPage,
//             pageSize: dataState.pageinfo.pageSize,
//             equipmentCode: form.equipmentCode,
//             equipmentName: form.equipmentName,
//             ownerName: form.ownerName,
//             pointName: form.pointName,
//             endTime: form.endTime,
//             startTime: form.startTime,
//             appKey: 'A1001000', // 系统编号
//             busiCode: 'A1001002' // 业务线编号
//             // merchantCode: '柜主001'
//         },
//         appKey: 'A1001000', // 系统编号
//         busiCode: 'A1001002', // 业务线编号
//         configCode: 'UC18266831682400256',
//         exportType: 7,
//         name: '导出补货单列表',
//         source: '运单中台'
//     }
//     const res = await replenishmentExport(params)
//     const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
//     let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
//     if (fileName) { // 根据后端返回的数据处理文件名称
//         fileName = fileName.substring(fileName.indexOf('=') + 1)
//     }
//     const link = document.createElement('a')// 创建一个a标签
//     link.download = fileName// 设置a标签的下载属性
//     link.style.display = 'none'// 将a标签设置为隐藏
//     link.href = URL.createObjectURL(blob)// 把之前处理好的地址赋给a标签的href
//     document.body.appendChild(link)// 将a标签添加到body中
//     link.click()// 执行a标签的点击方法
//     URL.revokeObjectURL(link.href) // 下载完成释放URL 对象
//     document.body.removeChild(link)// 移除a标签
// }
// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getDataList()
}
// 当前页改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getDataList()
}
// 查询
// const search = async () => {
//     dataState.pageinfo.currentPage = 1
//     await getDataList()
// }
</script>

<style lang="scss" scoped>
.stockListBox{
    .big-title{
        font-weight: bold;
        margin-bottom: 20px;
    }
    .small-title{
        font-weight: bold;
        margin-bottom: 12px;
        font-size: 14px;
        width: 120px;
        text-align: right;
    }
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
    .confirm-btns{
        margin: 0 auto;
        width: fit-content;
        margin-top: 20px;
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
