<template>
    <div class="stockListBox">
        <div class="big-title">单据详情</div>
        <el-form ref="resetFormData" :model="form" label-width="140px" :inline="true">
            <el-form-item label="单据类型：" prop="orderType">
                <el-select v-model="form.orderType"  placeholder="单据类型" disabled>
                    <el-option label="全款货柜" value="1" />
                    <el-option label="货柜租赁" value="2" />
                    <el-option label="货柜分期" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="单号：" prop="orderNo">
                <el-input v-model="form.orderNo"  placeholder="单号" disabled/>
            </el-form-item>
            <el-form-item label="销售订单号：" prop="transOrderNo">
                <el-input v-model="form.transOrderNo"  placeholder="销售订单号" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">发货方信息</div>
            <el-form-item label="发货方编号：" prop="senderNumber">
                <el-input v-model="form.senderNumber"  placeholder="发货方编号" disabled/>
            </el-form-item>
            <el-form-item label="发货方名称：" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="发货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="发货方联系人：" prop="senderContacts">
                <el-input v-model="form.senderContacts"  placeholder="发货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="发货方联系方式：" prop="senderContactInformation">
                <el-input v-model="form.senderContactInformation"  placeholder="发货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="发货方地址：" prop="senderAddress">
                <el-input v-model="form.senderAddress"  placeholder="发货方地址" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">收货方信息</div>
            <el-form-item label="收货方编号：" prop="receiptNumber">
                <el-input v-model="form.receiptNumber"  placeholder="收货方编号" disabled/>
            </el-form-item>
            <el-form-item label="收货方名称：" prop="receiptName">
                <el-input v-model="form.receiptName"  placeholder="收货方名称" disabled/>
            </el-form-item>
            <br>
            <el-form-item label="收货方联系人：" prop="receiptContacts">
                <el-input v-model="form.receiptContacts"  placeholder="收货方联系人" disabled/>
            </el-form-item>
            <el-form-item label="收货方联系方式：" prop="receiptContactInformation">
                <el-input v-model="form.receiptContactInformation"  placeholder="收货方联系方式" disabled/>
            </el-form-item>
            <el-form-item label="收货方地址：" prop="receiptAddress">
                <el-input v-model="form.receiptAddress"  placeholder="收货方地址" disabled/>
            </el-form-item>
            <br>
            <div class="small-title">单据信息</div>
            <el-form-item label="数量：" prop="quantity">
                <el-input v-model="form.quantity"  placeholder="数量" disabled/>
            </el-form-item>
            <el-form-item label="体积（立方米）：" prop="volumn">
                <el-input v-model="form.volumn"  placeholder="体积（立方米）" disabled/>
            </el-form-item>
            <el-form-item label="重量（千克）：" prop="weight">
                <el-input v-model="form.weight"  placeholder="重量（千克）" disabled/>
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
            <el-table-column prop="transGoodsNumber" label="商品编号"  />
            <el-table-column prop="transGoodsName" label="商品名称"  />
            <el-table-column prop="transGoodsSize" label="商品规格" />
            <el-table-column prop="transGoodsQuantity" label="数量" />
            <el-table-column prop="volumn" label="体积" />
            <el-table-column prop="weight" label="重量" />
            <el-table-column prop="relevantGoodsNo" label="相关商品编号" />
            <el-table-column prop="relevantGoodsName" label="相关商品名称" />
            <el-table-column prop="333" label="相关商品单位" />
            <el-table-column prop="relevantGoodsSize" label="相关商品规格" />
            <el-table-column prop="relevantGoodsQuantity" label="相关商品数量" />
            <el-table-column prop="spuId" label="标品编号" />
            <el-table-column prop="transGoodsConvert" label="OMS商品与标品关系" />
            <el-table-column prop="relevantGoodsConvert" label="相关商品与标品关系" />
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
import { billDetail, replenishmentExport } from '@/api/oms/index'
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
    orderType: '',
    orderNo: '',
    transOrderNo: '',
    senderNumber: '',
    senderName: '',
    senderContacts: '',
    senderContactInformation: '',
    senderAddress: '',
    receiptNumber: '',
    receiptName: '',
    receiptContacts: '',
    receiptContactInformation: '',
    receiptAddress: '',
    quantity: '',
    volumn: '',
    weight: ''
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
        orderNo: props.id
    }
    const { data, count } = await billDetail(params)
    form.orderType = data.orderType
    form.orderNo = data.orderNo
    form.transOrderNo = data.transOrderNo
    form.senderNumber = data.senderNumber
    form.senderName = data.senderName
    form.senderContacts = data.senderContacts
    form.senderContactInformation = data.senderContactInformation
    form.senderAddress = data.senderAddress
    form.receiptNumber = data.receiptNumber
    form.receiptName = data.receiptName
    form.receiptContacts = data.receiptContacts
    form.receiptContactInformation = data.receiptContactInformation
    form.receiptAddress = data.receiptAddress
    form.quantity = data.quantity
    form.volumn = data.volumn
    form.weight = data.weight
    tableData.value = data.childerList
    dataState.pageinfo.total = count
}
// 返回列表
const toBack = () => {
    router.push({ name: 'sale-bill-list' })
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
