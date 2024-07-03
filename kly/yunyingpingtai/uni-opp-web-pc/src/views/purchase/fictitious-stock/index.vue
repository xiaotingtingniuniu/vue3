<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="商品编号" prop="equipmentCode">
                <el-input v-model="form.equipmentCode"  placeholder="商品编号"/>
            </el-form-item>
            <el-form-item label="商品名称" prop="equipmentName">
                <el-input v-model="form.equipmentName"  placeholder="商品名称"/>
            </el-form-item>
            <el-form-item label="业务线名称" prop="equipmentName">
                <el-input v-model="form.equipmentName"  placeholder="业务线名称"/>
            </el-form-item>
            <br>
            <el-form-item label="仓/门店编号" prop="pointName">
                <el-input v-model="form.pointName"  placeholder="仓/门店编号"/>
            </el-form-item>
            <el-form-item label="仓/门店名称" prop="ownerName">
                <el-input v-model="form.ownerName"  placeholder="仓/门店名称"/>
            </el-form-item>
            <el-form-item label="采购主体" prop="ownerName">
                <el-input v-model="form.ownerName"  placeholder="采购主体"/>
            </el-form-item>
            <br>
            <el-form-item class="button-box">
                <el-button type="primary" @click="search">
                    查询
                </el-button>
                <el-button type="primary" @click="exportTable">
                    导出
                </el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="ownerCode" label="商品编号"  />
            <el-table-column prop="ownerName" label="商品名称"  />
            <el-table-column prop="ownerName" label="商品规格"  />
            <el-table-column prop="pointCode" label="标品编号" />
            <el-table-column prop="pointName" label="标品名称" />
            <el-table-column prop="billType" label="库存类型" />
            <el-table-column prop="billNo" label="仓/门店编号" />
            <el-table-column prop="equipmentName" label="仓/门店名称" />
            <el-table-column prop="equipmentCode" label="业务线编号" />
            <el-table-column prop="equipmentName" label="业务线名称" />
            <el-table-column prop="equipmentName" label="未下单金额" />
            <el-table-column prop="equipmentName" label="订单未消费" />
            <el-table-column prop="replenisher" label="订单已核销" />
            <el-table-column prop="replenisher" label="OU" />
            <el-table-column prop="replenisher" label="OU名称" />
            <el-table-column prop="replenisher" label="成本价" />
            <el-table-column prop="replenishmentTime" label="补货时间" />
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
import { replenishmentAllList, replenishmentExport } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
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
// 获取列表数据
const getList = async () => {
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
    }
    const { data } = await replenishmentAllList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.totalCount
}
// 导出
const exportTable = async () => {
    const params = {
        body: {
            pageNum: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize,
            equipmentCode: form.equipmentCode,
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
        configCode: 'UC18266831682400256',
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
    getList()
}
// 当前页改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList()
}
// 查询
const search = async () => {
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
