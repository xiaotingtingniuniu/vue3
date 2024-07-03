<template>
    <div>
        <el-form ref="resetFormData" :model="form" label-width="120px" :inline="true">
            <el-form-item label="生效状态" prop="status">
                <el-select v-model="form.status" clearable placeholder="请选择">
                    <el-option label="生效中" value="1" />
                    <el-option label="已失效" value="2" />
                    <el-option label="待生效" value="0" />
                </el-select>
            </el-form-item>
            <el-form-item class="button-box">
                <el-button type="primary" @click="searchCoupon">
                    查询
                </el-button>
                <el-button type="primary" @click="addBilling">
                    + 新增
                </el-button>
                <el-button type="primary" @click="onReset">
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
            v-model:border="boderls"
            v-model:stripe="lines"
            :total="dataState.pageinfo.total"
            @size-change="sizeChange"
            @current-change="currentChange">
            <template #feeAmount="{row}">
                <span v-if="row.feeMode === 1">{{row.feeAmount / 100}}元</span>
                <span v-if="row.feeMode === 2">{{row.feeAmount /100}}%</span>
            </template>
            <template #startTime="{row}">
                {{row.startTime}}至{{row.endTime}}
            </template>
        </system-list>
    </div>
</template >

<script setup>
import { reactive, ref } from '@vue/reactivity'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { getMerchantList } from '@/api/operate/index'
import { exportDetails } from '@/api/settlementManagement/index'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)

const form = reactive({
    status: ''
})

const dataState = reactive({
    formData: {
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: '',
        isEnabled: ''
    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    }
})

const tHead = [
    { align: 'center', tooltip: true, prop: 'feeStrategyName', label: '计费策略名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'feeCodeName', label: '计费项', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'feeAmount', label: '费率', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'feeEntityTypeDesc', label: '筛选项', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'entityId', label: '条件值', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'startTime', label: '生效时间', minWidth: 400, slot: true },
    { align: 'center', tooltip: true, prop: 'statusDesc', label: '生效状态', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'creator', label: '操作员', minWidth: 120 }
]

// 添加
const addBilling = () => {
    router.push({ name: 'accounting-strategy-add' })
}

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
    const params = {
        body: {
            ...form,
            page: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC32468765643546624',
        name: '计费策略列表接口',
        source: '结算中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
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
const onReset = () => {
    if (!resetFormData.value) return
    resetFormData.value.resetFields()
}
// 导出
const exportTable = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC32468765643546624',
        name: '计费策略列表接口',
        source: '结算中台',
        exportType: 7,
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            status: form.status
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

</style>
