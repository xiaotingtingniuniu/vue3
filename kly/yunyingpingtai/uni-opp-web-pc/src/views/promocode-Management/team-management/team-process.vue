<template>
    <div>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="所属业务线" prop="busiCode">
                        <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属组织" prop="orgName">
                        <el-input v-model="formData.orgName" placeholder="请输入组织名称" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="所属城市" prop="cityName">
                        <el-input v-model="formData.cityName" placeholder="请输入所属城市" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="8">
                    <el-form-item label="团长手机号" prop="phoneMobile">
                        <el-input v-model="formData.phoneMobile" placeholder="请输入团长手机号" clearable />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="审核状态" prop="auditStatus">
                        <el-select v-model="formData.auditStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="待审核" value="0" />
                            <el-option label="审核通过" value="1" />
                            <el-option label="审核退回" value="2" />
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="审核完成时间" prop="processTime">
                        <el-date-picker v-model="querinfo.processTime" type="datetimerange" format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item class="button-box">
                        <el-button @click="searchList" type="primary">查询</el-button>
                        <el-button @click="resetForm(formRef)" type="primary">重置</el-button>
                        <el-button @click="process()" type="primary">审核</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div>
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
                @selection-change="handleSelectionChange"
            >
                <template #auditStatus="row">
                    <span>{{pocessStatusList[row.row.auditStatus]}}</span>
                </template>
            </system-list>
        </div>
    </div>
    <pro-detail v-if="dialogVisible" :visible="dialogVisible" :rowList="selectlist" @clostDialog="clostDialog"></pro-detail>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import ProDetail from '../dialog/process.vue'
import { useStore } from 'vuex'
import { processlist, processsubmit, allbusiness } from '@/api/promocodeManagement/index'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()
const route = useRoute()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
// 0-待审核 1-审核通过 2-审核拒绝
const pocessStatusList = {
    0: '待审核', 1: '审核通过', 2: '审核退回'
}
// tab 默认值切换
const dataState = reactive({
    spuTemplateList: [],
    formData: {
        busiCode: '',
        orgName: '',
        cityName: '',
        phoneMobile: '',
        auditStatus: '',
        auditTimeStart: '',
        auditTimeEnd: '',
        processTime: ''
    },
    dateTime: {
        processTimeSt: '',
        processTimeEn: ''
    },
    tableData: []
})
const querinfo = ref({
    processTime: []
})
const { formData, tableData, dateTime } = toRefs(dataState)
onMounted(async () => {
    await business()
    await getTableList()
})
// 表头
const tHead = [
    { align: 'left', tooltip: true, minWidth: 60, type: 'selection' },
    { align: 'center', type: 'index', label: '序号', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '所属业务线', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'orgName', label: '所属组织', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'cityName', label: '所属城市', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'teamCode', label: '团队id', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'teamName', label: '团队名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'contactName', label: '团长姓名', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '团长手机号', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'applyTime', label: '申请时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核状态', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审核完成时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'auditRemark', label: '审核原因', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审核人姓名', minWidth: 150 }
]
const newGoods = ref([])
const dialogRebindVisible = ref(false)
// 处理数据
const formatValue = (value) => {
    if (!value) return ''
    const reg = /B2B/gi
    const rst = value.toLowerCase().replace(reg, '进货')
    return rst
}
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 全选
const selectlist = ref([])
const handleSelectionChange = (val) => {
    selectlist.value = val
    console.log(val, ' spuIdsList.value')
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    querinfo.value.processTime = []
    dataState.dateTime.processTimeSt = ''
    dataState.dateTime.processTimeEn = ''
    getTableList()
}
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.processTime = val
        dataState.dateTime.processTimeSt = val[0]
        dataState.dateTime.processTimeEn = val[1]
    } else {
        querinfo.value.processTime = ''
        dataState.dateTime.processTimeSt = ''
        dataState.dateTime.processTimeEn = ''
    }
}
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 获取SPU列表
const getTableList = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: dataState.formData.busiCode,
        orgName: dataState.formData.orgName,
        cityName: dataState.formData.cityName,
        phoneMobile: dataState.formData.phoneMobile,
        auditStatus: dataState.formData.auditStatus,
        auditTimeStart: dataState.dateTime.processTimeSt,
        auditTimeEnd: dataState.dateTime.processTimeEn,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await processlist(param)
    const resultdata = res.data
    dataState.tableData = resultdata
    pageInfo.value.total = res.count
}
const dialogVisible = ref(false)
const process = async () => {
    if (selectlist.value.length !== 0) {
        dialogVisible.value = true
    } else {
        ElMessage({
            type: 'error',
            message: '请至少选择一条数据'
        })
    }
}
const clostDialog = () => {
    dialogVisible.value = false
    getTableList()
}
const dialogTableListRef = ref(null)
const bindSpu = async (formEl) => {
    if (!dialogTableListRef.value) return
    const selectionRows = dialogTableListRef.value.tableRef.getSelectionRows()
    if (selectionRows.length > 1) {
        ElMessage({
            type: 'error',
            message: '只能选择一条标品数据'
        })
        return
    }
    if (selectionRows.length === 0) {
        ElMessage({
            type: 'error',
            message: '请选择一条标品数据'
        })
        return
    }
    const image = ref('')
    if (selectionRows[0].spuMediaList !== null) {
        for (let i = 0; i < selectionRows[0].spuMediaList.length; i++) {
            if (selectionRows[0].spuMediaList[i].mediaType + '' === '2') {
                image.value = selectionRows[0].spuMediaList[i].mediaUrl
            }
        }
    }
    selectionRows[0].image = image.value
    newGoods.value = selectionRows[0]
    dialogRebindVisible.value = false
    if (!formEl) return
    formEl.resetFields()
}
// 跳转详情
const toDetail = (row) => {
    const spuId = row.spuId
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 编辑
const editBtn = (row) => {
    const spuId = row.spuId
    // router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: dataState.formData.spuTemplate, spuId: row.spuId } })
    router.push({ name: 'spu-management-editor', params: { type: 'edit', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 查看详情
const checkDetail = (row) => {
    router.push({ name: 'spu-model-training-list', params: { goodsId: row.spuId } })
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}

</script>
<style lang="scss" scoped>
a{
    text-decoration-line: none;
}
.edit-btn{
    color: #ffffff;
    margin-right: 10px;
}
.text-btn{
    color: rgb(254, 44, 85);
    margin: auto !important;
    cursor:pointer;
}
.db{
    display: block;
}
.content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
</style>
