<template>
    <div class="stockListBox">
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="设备编号" prop="equipmentCode">
                <el-input v-model="form.equipmentCode"  placeholder="设备编号"/>
            </el-form-item>
            <el-form-item label="设备名称" prop="equipmentName">
                <el-input v-model="form.equipmentName"  placeholder="设备名称"/>
            </el-form-item>
            <el-form-item label="盘点时间" prop="startTime" class="form-item-time">
                <el-date-picker v-model="form.startTime" type="date" value-format="YYYY-MM-DD"  placeholder="开始时间" :editable="false"/>
            </el-form-item>
            <el-form-item label prop="endTime" class="form-item-time">
                <el-date-picker v-model="form.endTime" type="date" value-format="YYYY-MM-DD"  placeholder="结束时间" :editable="false"/>
            </el-form-item>
            <el-form-item label="点位名称" prop="pointName">
                <el-input v-model="form.pointName"  placeholder="点位名称"/>
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
            <el-table-column prop="pointCode" label="点位ID"  />
            <el-table-column prop="pointName" label="点位名称"  />
            <el-table-column prop="billNo" label="盘点单号" />
            <el-table-column prop="tallyTime" label="盘点时间" />
            <el-table-column prop="tallyerName" label="盘点人名称" />
            <el-table-column prop="equipmentCode" label="设备编号" />
            <el-table-column prop="equipmentName" label="设备名称" />
            <el-table-column prop="equipmentAddress" label="设备地址" />
            <el-table-column prop="secondCabinetTypeName" label="设备类型"/>
            <el-table-column prop="doorName" label="设备门信息"/>
            <el-table-column prop="temperatureName" label="设备温层"/>
            <!-- <el-table-column prop="storageStyle" label="商品温层"/> -->
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button text type="primary" @click="view(scope.row)"> 查看 </el-button>
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

    <cst-form v-model="visible" v-if="visible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getList"></cst-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { checkAllList, checkDetail, checkExport } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CstForm from './form/form.vue'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    equipmentCode: '',
    equipmentName: '',
    ownerName: '',
    pointName: '',
    startTime: '',
    endTime: ''
})

const tableData = ref([])

// 重置
const resetFormData = ref(null)
const resetForm = () => {
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
    },
    row: null

})
// 数据总数
const totals = ref(0)
const visible = ref(false)
const Title = ref('盘点详情')

onMounted(async () => {
    getRefundList()
    // uslistone()
    // uslisttwo()
})

const onelist = ref([])
const twolist = ref([])

// 盘点清单列表
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
        busiCode: 'A1001002', // 业务线编号
        merchantCode: '柜主001'
    }
    const { data } = await checkAllList(params)
    tableData.value = data.list/*  */
    dataState.pageinfo.total = data.totalCount
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
    const { data } = await getRefundList()
    dataState.row = data
    visible.value = true
    console.log(visible.value + 'visible.value')
}

// 导出明细列表
const exportTable = async () => {
    const params = {
        body: {
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
            busiCode: 'A1001002', // 业务线编号
            merchantCode: '柜主001'
        },
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        // configCode: 'UC18271361773989888',
        configCode: 'UCJH72385274092494848',
        exportType: 7,
        name: '导出盘点单聚合设备和商品',
        source: '运营后台'
    }
    const res = await checkExport(params)
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
const view = async (row) => {
    const params = {
        billNo: row.billNo,
        appKey: 'A1001000', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        merchantCode: '柜主001',
        deviceCode: row.equipmentCode || '0'
    }
    // console.log({ billNo: row.billNo })
    const { data } = await checkDetail(params)
    dataState.row = data
    visible.value = true
    console.log(visible.value + 'visible.value')
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
