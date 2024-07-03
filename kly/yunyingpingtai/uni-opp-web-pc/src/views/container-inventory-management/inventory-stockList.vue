<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="设备编号" prop="equipmentCode">
                <el-input v-model="form.equipmentCode"  placeholder="设备编号"/>
            </el-form-item>
            <el-form-item label="设备名称" prop="equipmentName">
                <el-input v-model="form.equipmentName"  placeholder="设备名称"/>
            </el-form-item>
            <!-- <el-form-item label="补货时间" prop="skuIds">
                <el-input v-model="form.skuIds"  placeholder="补货时间"/>
            </el-form-item> -->
            <el-form-item label="补货时间" prop="startTime" class="form-item-time">
                <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="endTime" class="form-item-time">
                <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
            </el-form-item>
            <br>
            <el-form-item label="点位名称" prop="pointName">
                <el-input v-model="form.pointName"  placeholder="点位名称"/>
            </el-form-item>
            <el-form-item label="柜主名称" prop="ownerName">
                <el-input v-model="form.ownerName"  placeholder="柜主名称"/>
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
            <el-table-column prop="ownerCode" label="柜主编号"  />
            <el-table-column prop="ownerName" label="柜主名称"  />
            <el-table-column prop="pointCode" label="合同货柜编号" />
            <el-table-column prop="pointName" label="点位名称" />
            <el-table-column prop="billNo" label="补货单号" />
            <el-table-column prop="replenisher" label="补货人员" />
            <el-table-column prop="replenishmentTime" label="补货时间" />
            <!-- <el-table-column prop="secondChannel" label="补货完成时间" /> -->
            <el-table-column prop="equipmentCode" label="设备编号" />
            <el-table-column prop="equipmentName" label="设备名称" />
            <el-table-column prop="billStatusDesc" label="补货单状态" />
            <el-table-column prop="billType" label="补货单类型" />
            <el-table-column prop="secondCabinetTypeName" label="设备类型" />
            <el-table-column prop="doorName" label="设备门信息" />
            <el-table-column prop="temperatureName" label="设备温层" />
            <!--<el-table-column prop="billType" label="商品温层" />-->
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="confirm(scope.row)" v-if="scope.row.originalBillStatus === 0"> 确认 </el-button>
                    <el-button text type="primary" @click="cancel(scope.row, -1)" v-if="scope.row.originalBillStatus === 0"> 作废 </el-button>
                    <el-button text type="primary" @click="cancel(scope.row, 5)" v-if="scope.row.originalBillStatus === 1"> 取消 </el-button>
                    <el-button text type="primary" @click="view(scope.row)"> 补货单详情 </el-button>
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
    <cst-form v-model="visible" v-if="visible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getRefundList"></cst-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { replenishmentAllList, replenishmentkDetail, replenishmentExport, replenishmentDetailc, replenishmentCancel } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CstForm from './form/form.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 查询项
const form = reactive({
    equipmentCode: '',
    equipmentName: '',
    startTime: '',
    endTime: '',
    pointName: '',
    ownerName: ''
})
const tableData = ref([])
// 重置
// const resetFormData = ref(null)
// const resetForm = () => {
//     resetFormData.value.resetFields()
//     setTimeout(() => {
//         dataState.pageinfo.currentPage = 1
//         getRefundList()
//     })
// }
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
    getRefundList()
})
// 获取补货单数据
const getRefundList = async () => {
    const params = {
        pageNo: dataState.pageinfo.currentPage,
        pageSize: dataState.pageinfo.pageSize,
        equipmentCode: form.equipmentCode,
        equipmentCodeList: form.equipmentCode ? [form.equipmentCode] : [],
        equipmentName: form.equipmentName,
        ownerName: form.ownerName,
        pointName: form.pointName,
        endTime: form.endTime,
        startTime: form.startTime,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002' // 业务线编号
        // merchantCode: '柜主001'
    }
    const { data } = await replenishmentAllList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.totalCount
}
// 确认补货单详情
const confirm = async (row) => {
    const params = {
        billNo: row.billNo,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002' // 业务线编号
        // merchantCode: ''
    }
    const { data } = await replenishmentDetailc(params)
    dataState.row = data
    Title.value = '补货单确认'
    visible.value = true
}
// 取消补货单
const cancel = async (row, num) => {
    const param = {
        billNo: row.billNo,
        billStatus: Number(num),
        creatorId: userInfo.value.id
    }
    ElMessageBox.confirm(
        '确定取消吗？',
        '取消确认',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await replenishmentCancel(param)
            if (res.code === '200') {
                ElMessage.success('取消成功')
                getRefundList()
            }
        })
}
// 查看补货单详情
const view = async (row) => {
    const params = {
        billNo: row.billNo,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002' // 业务线编号
        // merchantCode: '柜主001'
    }
    const { data } = await replenishmentDetailc(params)
    dataState.row = data
    Title.value = '补货详情'
    visible.value = true
}
// 导出明细列表
const exportTable = async () => {
    const params = {
        body: {
            pageNum: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize,
            equipmentCode: form.equipmentCode,
            equipmentCodeList: form.equipmentCode ? [form.equipmentCode] : [],
            equipmentName: form.equipmentName,
            ownerName: form.ownerName,
            pointName: form.pointName,
            endTime: form.endTime,
            startTime: form.startTime,
            appKey: 'A1001000', // 系统编号
            busiCode: 'A1001002' // 业务线编号
            // merchantCode: '柜主001'
        },
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        // configCode: 'UC18266831682400256',
        configCode: 'UCJH75645150771552256',
        exportType: 7,
        name: '导出补货单列表',
        source: '运单中台'
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
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
}

// 查询
// GOODS165796715460328471 SKU165797196618369677
const searchCoupon = async () => {
    dataState.pageinfo.currentPage = 1
    await getRefundList()
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
