<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="单号" prop="orderNo">
                <el-input v-model="form.orderNo"  placeholder="单号"/>
            </el-form-item>
            <el-form-item label="发货方编号" prop="senderNumber">
                <el-input v-model="form.senderNumber"  placeholder="发货方编号"/>
            </el-form-item>
            <el-form-item label="发货方名称" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="业务线名称"/>
            </el-form-item>
            <el-form-item label="单据类型" prop="orderType">
                <el-select v-model="form.orderType"  placeholder="单据类型">
                    <el-option label="全款货柜" value="1" />
                    <el-option label="货柜租赁" value="2" />
                    <el-option label="货柜分期" value="3" />
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="销售订单号" prop="transOrderNo">
                <el-input v-model="form.transOrderNo"  placeholder="销售订单号"/>
            </el-form-item>
            <el-form-item label="业务线" prop="businessLine">
                <el-input v-model="form.businessLine"  placeholder="业务线"/>
            </el-form-item>
            <el-form-item label="建单日期" prop="createBeginDate" class="form-item-time">
                <el-date-picker v-model="form.createBeginDate" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="createEndDate" class="form-item-time">
                <el-date-picker v-model="form.createEndDate" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
            </el-form-item>
            <br>
            <el-form-item label="入库日期" prop="beginDate" class="form-item-time">
                <el-date-picker v-model="form.beginDate" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="endDate" class="form-item-time">
                <el-date-picker v-model="form.endDate" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <!--<el-button type="primary" @click="exportTable">
                    导出
                </el-button>-->
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="orderNo" label="单号"  />
            <el-table-column prop="transOrderNo" label="销售订单号" />
            <el-table-column prop="senderNumber" label="发货方编号"  />
            <el-table-column prop="senderName" label="发货方名称"  />
            <el-table-column prop="receiptNumber" label="收货方编号" />
            <el-table-column prop="receiptName" label="收货方名称" />
            <el-table-column prop="orderType" label="单据类型">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.orderType === '1'">全款货柜</span>
                        <span v-else-if="scope.row.orderType === '2'">货柜租赁</span>
                        <span v-else-if="scope.row.orderType === '3'">货柜分期</span>
                        <span v-else>-</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" />
            <el-table-column prop="weight" label="重量" />
            <el-table-column prop="volumn" label="体积" />
            <el-table-column prop="status" label="状态">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.status === '1'">待生效</span>
                        <span v-else-if="scope.row.status === '2'">已生效</span>
                        <span v-else-if="scope.row.status === '3'">取消</span>
                        <span v-else-if="scope.row.status === '4'">已出库</span>
                        <span v-else>-</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="orderDate" label="创建时间" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="confirm(scope.row)" v-if="scope.row.status === '2'"> 出库确认 </el-button>
                    <el-button text type="primary" @click="takeEffect(scope.row, 2)" v-if="scope.row.status === '1'"> 生效 </el-button>
                    <el-button text type="primary" @click="takeEffect(scope.row, 3)" v-if="scope.row.status === '1'"> 取消 </el-button>
                </template>
            </el-table-column>
            <el-table-column label="查看详情" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="view(scope.row)"> 查看详情 </el-button>
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
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { billAllList, billTakeEffect } from '@/api/oms/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DetailTab from './detail.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 查询项
const form = reactive({
    // equipmentCode: '',
    // equipmentName: '',
    // startTime: '',
    // endTime: '',
    // pointName: '',
    // ownerName: ''
    orderNo: '',
    senderNumber: '',
    senderName: '',
    orderType: '',
    transOrderNo: '',
    businessLine: '',
    createBeginDate: '',
    createEndDate: '',
    beginDate: '',
    endDate: ''
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
const Title = ref('补货详情')
const visible = ref(false)

onMounted(async () => {
    getOmsList()
})
// 获取补货单数据
const getOmsList = async () => {
    const params = {
        page: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize,
        orderNo: form.orderNo,
        senderNumber: form.senderNumber,
        senderName: form.senderName,
        orderType: form.orderType,
        transOrderNo: form.transOrderNo,
        businessLine: form.businessLine,
        createBeginDate: form.createBeginDate,
        createEndDate: form.createEndDate,
        beginDate: form.beginDate,
        endDate: form.endDate
    }
    const { data } = await billAllList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.total
}
// 确认补货单详情
const confirm = async (row) => {
    router.push({ name: 'sale-bill-edit', params: { id: row.orderNo } })
}
// 生效/取消 1:待生效，2：已生效，3：取消，4：已出库
const takeEffect = async (row, num) => {
    const params = {
        transOrderNo: row.transOrderNo,
        status: num
    }
    const { code } = await billTakeEffect(params)
    if (code === '200') {
        ElMessage({
            showClose: true,
            message: '成功',
            type: 'success'
        })
        getOmsList()
    }
}
// 查看补货单详情
const view = async (row) => {
    router.push({ name: 'sale-bill-detail', params: { id: row.orderNo } })
}
// 导出明细列表
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
    getOmsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getOmsList()
}

// 查询
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getOmsList()
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
