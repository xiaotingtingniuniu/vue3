<template>
    <div class="white-list-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="货柜编号" prop="deviceNo">
                    <el-input v-model="searchData.deviceNo" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="柜主名称" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="支付方式" prop="whiteType">
                    <el-select v-model="searchData.whiteType" placeholder="请选择支付方式">
                        <el-option label="全部" value="" />
                        <el-option label="收付通" :value="1" />
                        <el-option label="直连" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="searchCoupon()"> 查询 </el-button>
                    <el-button type="primary" @click="resetForm(formRef)"> 重置 </el-button>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="addWhiteFn('add')"> 添加 </el-button>
                <el-button type="primary" @click="setRemove"> 移除 </el-button>
                <el-button type="primary" @click="exportList"> 导出明细 </el-button>
                <el-button type="primary" @click="addList"> 批量添加 </el-button>
            </div>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currentPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="handleSelectionChange"
            >
                <template #whiteType="{row}">
                    {{whiteTypes[row.whiteType]}}
                </template>
                <template #oprate="{row}">
                    <el-button type="primary" text @click="editWhiteFn(row)"> 编辑 </el-button>
                </template>

            </system-list>
        </div>
        <batch-add-list
            v-if="batchVisible"
            :batchVisible="batchVisible"
            @handleClose="batchVisible = false"
            @pagerUpdate="getRefundList()"
        ></batch-add-list>
        <edit-white-list  v-if="editVisible"
                          :editVisible="editVisible"
                          :editObj="editObj"
                          @handleClose="editVisible = false"
                          @pagerUpdate="getRefundList()"></edit-white-list>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import batchAddList from './comments/batch-add.vue'
import editWhiteList from './comments/edit-white.vue'
import { useRoute, useRouter } from 'vue-router'
import { getMerchantList } from '@/api/operate/index'
import { exportDetails } from '@/api/moneyManagement'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const tHead = [
    { align: 'center', tooltip: true, type: 'selection', minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'deviceNo', label: '货柜编号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'merchantName', label: '实际运营人（柜主或代运营商）', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '实际运营人手机号', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'whiteType', label: '支付方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'oprate', label: '操作', minWidth: 130, slot: true }
]

const whiteTypes = {
    1: '收付通',
    2: '直连'
}
const tableData = ref([])
const dataState = reactive({
    searchData: {
        merchantName: '', //
        deviceNo: '',
        whiteType: '' //
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const { searchData, pageinfo } = toRefs(dataState)

const merchantVisible = ref(false)
const batchVisible = ref(false)
const editVisible = ref(false)
onMounted(async () => {
    await getRefundList()
})

// // 列表数据
const getRefundList = async () => {
    const parm = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            ...dataState.searchData,
            page: dataState.pageinfo.currentPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC23787078596263936',
        name: '分页查询商户白名单表',
        source: '商户中台'
    }
    const data = await getMerchantList(parm)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
}

const removeList = ref([])
const handleSelectionChange = async (val) => {
    removeList.value = val.map((item) => item.id)
}

const setRemove = async () => {
    ElMessageBox.confirm('是否确认移除白名单，移除白名单后只能收款到智点汇融', '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'error'
        }
    ).then(async () => {
        const parm = {
            body: {
                busiCode: 'A1001002',
                appKey: 'A1001000',
                list: removeList.value,
                modifierId: userInfo.value.account
            },
            appKey: 'A1001000',
            busiCode: 'A1001002',
            configCode: 'UC23786992239738880',
            name: '批量删除商户白名单表',
            source: '商户中台'
        }
        await getMerchantList(parm)
        ElMessage.success('成功')
        await getRefundList()
    }).catch(() => {})
}
// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}

const addList = () => {
    batchVisible.value = true
    console.log(batchVisible.value, 'batchVisible.value')
}

const editObj = ref({})
const editWhiteFn = (row) => {
    editVisible.value = true
    Object.assign(editObj.value, row)
}
const exportList = async () => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            ...dataState.searchData
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        exportType: 7,
        configCode: 'UC24798367841148928',
        name: '导出商户白名单表',
        source: '商户中台'

    }
    const res = await exportDetails(params)
    console.log(res, 'res')
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

// 查询
const searchCoupon = () => {
    dataState.pageinfo.currentPage = 1
    getRefundList()
}

const addWhiteFn = (type) => {
    router.push({ name: 'add-white', params: { type } })
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
</script>
<style lang="scss" scoped>
.coupon-submit-box {
    .dialog-title {
        font-size: 20px;
        color: red;
        font-weight: 700;
    }
    .header-title {
        font-size: 20px;
        color: red;
        height: 50px;
        font-weight: 700;
        align-items: center;
    }
}
</style>
