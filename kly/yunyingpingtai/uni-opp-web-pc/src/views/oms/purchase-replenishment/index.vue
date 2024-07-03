<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="单号" prop="purchaseBillNo">
                <el-input v-model="form.purchaseBillNo"  placeholder="单号"/>
            </el-form-item>
            <el-form-item label="发货方编号" prop="senderNo">
                <el-input v-model="form.senderNo"  placeholder="发货方编号"/>
            </el-form-item>
            <el-form-item label="发货方名称" prop="senderName">
                <el-input v-model="form.senderName"  placeholder="业务线名称"/>
            </el-form-item>
            <el-form-item label="单据类型" prop="billType">
                <el-select v-model="form.billType"  placeholder="单据类型">
                    <el-option label="采购入库单(仓)" value="0" />
                    <el-option label="采购入库单(店)" value="1" />
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="收货方编号" prop="receiverNo">
                <el-input v-model="form.receiverNo"  placeholder="收货方编号"/>
            </el-form-item>
            <el-form-item label="收货方名称" prop="receiverName">
                <el-input v-model="form.receiverName"  placeholder="收货方名称"/>
            </el-form-item>
            <el-form-item label="建单日期" prop="startDateOfDocCreation" class="form-item-time">
                <el-date-picker v-model="form.startDateOfDocCreation" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="endDateOfDocCreation" class="form-item-time">
                <el-date-picker v-model="form.endDateOfDocCreation" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
            </el-form-item>
            <br>
            <el-form-item label="入库日期" prop="startDateOfWarehousing" class="form-item-time">
                <el-date-picker v-model="form.startDateOfWarehousing" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="endDateOfWarehousing" class="form-item-time">
                <el-date-picker v-model="form.endDateOfWarehousing" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
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
            <el-table-column prop="purchaseBillNo" label="单号"  />
            <el-table-column prop="senderNo" label="发货方编号"  />
            <el-table-column prop="senderName" label="发货方名称"  />
            <el-table-column prop="receiverNo" label="收货方编号" />
            <el-table-column prop="receiverName" label="收货方名称" />
            <el-table-column prop="billType" label="单据类型">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.billType === 0">采购入库单(仓)</span>
                        <span v-else-if="scope.row.billType === 1">采购入库单(店)</span>
                        <span v-else>-</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sumCount" label="数量" />
            <el-table-column prop="sumWeight" label="重量" />
            <el-table-column prop="sumVolume" label="体积" />
            <el-table-column prop="billStatus" label="状态">
                <template #default="scope">
                    <div>
                        <span v-if="scope.row.billStatus === 0">未生效</span>
                        <span v-else-if="scope.row.billStatus === 1">已生效</span>
                        <span v-else-if="scope.row.billStatus === 2">已入库</span>
                        <span v-else-if="scope.row.billStatus === 3">取消</span>
                        <span v-else>-</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="gmtCreate" label="创建时间" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="confirm(scope.row)" v-if="scope.row.billStatus === 1"> 入库确认 </el-button>
                    <el-button text type="primary" @click="takeEffect(scope.row)" v-if="scope.row.billStatus === 0"> 生效 </el-button>
                    <el-button text type="primary" @click="cancel(scope.row)" v-if="scope.row.billStatus === 0"> 取消 </el-button>
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
import { replenishmentAllList, replenishmentTakeEffect, replenishmentCancel, replenishmentExport } from '@/api/oms/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import DetailTab from './detail.vue'
import EditTab from './edit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 查询项
const form = reactive({
    purchaseBillNo: '',
    senderNo: '',
    senderName: '',
    receiverNo: '',
    receiverName: '',
    billType: '',
    startDateOfDocCreation: '',
    endDateOfDocCreation: '',
    startDateOfWarehousing: '',
    endDateOfWarehousing: ''
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

onMounted(async () => {
    getOmsList()
})
// 查询
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getOmsList()
}
// 获取补货单数据
const getOmsList = async () => {
    const params = {
        pageNo: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize,
        purchaseBillNo: form.purchaseBillNo,
        senderNo: form.senderNo,
        senderName: form.senderName,
        receiverNo: form.receiverNo,
        receiverName: form.receiverName,
        billType: form.billType,
        startDateOfDocCreation: form.startDateOfDocCreation,
        endDateOfDocCreation: form.endDateOfDocCreation,
        startDateOfWarehousing: form.startDateOfWarehousing,
        endDateOfWarehousing: form.endDateOfWarehousing,
        appKey: '', // 系统编号
        busiCode: '' // 业务线编号
    }
    const { data, count } = await replenishmentAllList(params)
    tableData.value = data/*  */
    dataState.pageinfo.total = count
}
// 虚拟出入库确认
const confirm = async (row) => {
    router.push({ name: 'purchase-replenishment-edit', params: { id: row.purchaseBillNo } })
}
// 生效
const takeEffect = async (row) => {
    const params = {
        billNo: row.purchaseBillNo
    }
    const { code } = await replenishmentTakeEffect(params)
    if (code === '200') {
        ElMessage({
            showClose: true,
            message: '生效成功',
            type: 'success'
        })
        getOmsList()
    }
}
// 取消
const cancel = async (row) => {
    const params = {
        billNo: row.purchaseBillNo
    }
    const { code } = await replenishmentCancel(params)
    if (code === '200') {
        ElMessage({
            showClose: true,
            message: '取消成功',
            type: 'success'
        })
        getOmsList()
    }
}
// 查看单据详情
const view = async (row) => {
    router.push({ name: 'purchase-replenishment-detail', params: { id: row.purchaseBillNo } })
}
// 导出明细列表
const exportTable = async () => {
    const params = {
        body: {
            purchaseBillNo: form.purchaseBillNo,
            senderNo: form.senderNo,
            senderName: form.senderName,
            receiverNo: form.receiverNo,
            receiverName: form.receiverName,
            billType: form.billType,
            startDateOfDocCreation: form.startDateOfDocCreation,
            endDateOfDocCreation: form.endDateOfDocCreation,
            startDateOfWarehousing: form.startDateOfWarehousing,
            endDateOfWarehousing: form.endDateOfWarehousing
        },
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001000', // 业务线编号
        configCode: 'UC63687270076268544',
        exportType: 3,
        name: '导出采购类单据',
        source: 'OMS系统'
    }
    const res = await replenishmentExport(params)
    const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' })// 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    let fileName = decodeURI(res.headers['content-disposition'])// 设置文件名称,decodeURI：可以对后端使用encodeURI() 函数编码过的 URI 进行解码。encodeURI() 是后端为了解决中文乱码问题
    if (fileName) { // 根据后端返回的数据处理文件名称
        fileName = fileName.substring(fileName.indexOf('采'))
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
    getOmsList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getOmsList()
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
