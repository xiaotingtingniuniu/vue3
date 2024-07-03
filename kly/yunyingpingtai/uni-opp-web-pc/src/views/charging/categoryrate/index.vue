<template>
    <div>
        <el-form ref="resetFormData" :model="formData" label-width="120px" :inline="true">
            <el-form-item label="一级类目编码" prop="firstCateCode">
                <el-input v-model="formData.firstCateCode" placeholder="请输入一级类目编码" clearable />
            </el-form-item>

            <el-form-item label="二级类目编码" prop="secondCateCode">
                <el-input v-model="formData.secondCateCode" placeholder="请输入二级类目编码" clearable />
            </el-form-item>
            <el-form-item label="三级类目编码" prop="thirdCateCode">
                <el-input v-model="formData.thirdCateCode" placeholder="请输入三级类目编码" clearable />
            </el-form-item>
            <el-form-item label="四级类目编码" prop="fourthCateCode">
                <el-input v-model="formData.fourthCateCode" placeholder="请输入四级类目编码" clearable />
            </el-form-item>
            <el-form-item label="生效状态" prop="status">
                <el-select v-model="formData.status" clearable placeholder="请选择">
                    <el-option label="未生效" value="1" />
                    <el-option label="已生效" value="2" />
                    <el-option label="已失效" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="onReset(resetFormData)">
                    重置
                </el-button>
                <el-button type="primary" @click="exportTable()">
                    导出
                </el-button>
            </el-form-item>
        </el-form>
        <system-list
            :tHead="tHead"
            :tableData="tableData"
            v-model:current-page="dataState.pageinfo.currPage"
            v-model:page-size="dataState.pageinfo.pageSize"
            :total="dataState.pageinfo.total"
            @size-change="sizeChange"
            @current-change="currentChange">
            <template #feeAmount="{row}">
                {{row.feeAmount / 100}}元
            </template>
            <template #startTime="{row}">
                {{row.startTime}}至{{row.endTime}}
            </template>
            <template #operation="{row}">
                <el-button @click="edit(row)" type="primary">编辑</el-button>
            </template>
        </system-list>
    </div>
    <cate-detail v-if="dialogvisible" :visible="dialogvisible" :rowList="rowList" @clostDialog="clostDialog"></cate-detail>
</template >

<script setup>
import { reactive, ref, toRefs } from '@vue/reactivity'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { ratesList } from '@/api/accountManagement/index'
import { exportDetails } from '@/api/settlementManagement/index'
import { useStore } from 'vuex'
import CateDetail from './edit.vue'

const router = useRouter()

const store = useStore()
const dialogvisible = ref(false)
const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    status: ''
})

const dataState = reactive({
    formData: {
        firstCateCode: '',
        secondCateCode: '',
        thirdCateCode: '',
        fourthCateCode: '',
        status: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    }
})
const { formData, pageinfo } = toRefs(dataState)
const tHead = [
    { align: 'center', tooltip: true, prop: 'firstCateCode', label: '一级类目编码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'firstCateName', label: '一级类目名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'secondCateCode', label: '二级类目编码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'secondCateName', label: '二级类目名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'thirdCateCode', label: '三级类目编码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级类目名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'fourthCateCode', label: '四级类目编码', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级类目名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'cateRate', label: '费率%', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '生效时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'endTime', label: '失效时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 120, slot: true }
]

const tableData = ref([])
onMounted(() => {
    // console.log(userInfo)
    adminAdd()
})

const searchCoupon = () => {
    dataState.pageinfo.currPage = 1
    adminAdd()
}

const adminAdd = async () => {
    const param = {
        ...formData.value,
        busiCode: 'A1001003',
        page: dataState.pageinfo.currPage,
        pageSize: dataState.pageinfo.pageSize
    }
    const res = await ratesList(param)
    tableData.value = res.data.list
    dataState.pageinfo.total = res.data.total
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    // 调用列表方法
    adminAdd()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    // 调用列表方法
    adminAdd()
}
// 重置
const resetFormData = ref(null)
const onReset = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
    adminAdd()
}
// 导出
const exportTable = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC61045863157030912',
        exportType: 7,
        body: {
            ...formData.value,
            busiCode: 'A1001003'
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
const rowList = ref({})
const edit = async (row) => {
    dialogvisible.value = true
    rowList.value = row
}
const clostDialog = () => {
    dialogvisible.value = false
    adminAdd()
}
</script>
<style lang="scss" scoped>

</style>
