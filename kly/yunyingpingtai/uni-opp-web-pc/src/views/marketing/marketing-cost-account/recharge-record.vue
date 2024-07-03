<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="账户编号" prop="acctId">
                        <el-input v-model="searchData.acctId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="账户名称" prop="acctName">
                        <el-input v-model="searchData.acctName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="预算中心" prop="centorName">
                        <el-input v-model="searchData.centorName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="预算科目" prop="subjectName">
                        <el-input v-model="searchData.subjectName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="预算项目" prop="projectName">
                        <el-input v-model="searchData.projectName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="状态" prop="auditStatus">
                        <el-select v-model="searchData.auditStatus" clearable placeholder="请选择" >
                            <el-option label="待审核" value=1 />
                            <el-option label="审核通过" value=2 />
                            <el-option label="审核不通过" value=3 />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预算期间" prop="budgetPeriod" class="form-item-time">
                        <el-date-picker v-model="searchData.budgetPeriod" value-format="YYYY-MM" type="month"/>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
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
                >
                    <template #budgetAmount="budgetAmount">
                        <span>{{ budgetAmount.row.budgetAmount }}</span>
                    </template>
                    <template #attachUrl="attachUrl">
                        <el-button type="text" v-if="attachUrl.row.attachUrl" @click='frontDownload(attachUrl.row.attachUrl)'>附件1</el-button>
                        <span v-else>——</span>
                    </template>
                    <template #auditStatus="auditStatus">
                        <span v-if="auditStatus.row.auditStatus === 1">待审核</span>
                        <span v-if="auditStatus.row.auditStatus === 2">审核通过</span>
                        <span v-if="auditStatus.row.auditStatus === 3">审核不通过</span>
                    </template>
                    <template #button="row">
                        <el-button type="text" v-if="checkRole('marketing-17') && row.row.auditStatus === 1" @click='toBudgetAudit(2, row.row)'>通过</el-button>
                        <el-button type="text" v-if="checkRole('marketing-17') && row.row.auditStatus === 1" @click='toBudgetAudit(3, row.row)'>拒绝</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getChargeList, putBudgetAudit } from '@/api/marketing/marketing-cost'
import { checkRole } from '@/utils'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({
    regTypeKeyValue: {
        1: '手机注册',
        2: '邮箱注册',
        3: '账户',
        4: '微信注册',
        5: '支付宝注册',
        6: 'qq注册'
    },
    userStatusKeyValue: {
        1: '正常',
        2: '已注销',
        3: '已拉黑'
    },
    tableData: [],
    searchData: {
        acctId: '',
        acctName: '',
        centorName: '',
        subjectName: '',
        projectName: '',
        auditStatus: '',
        budgetPeriod: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const { tableData, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getList()
})
// 获取列表
const getList = async () => {
    const param = {
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        acctId: dataState.searchData.acctId,
        acctName: dataState.searchData.acctName,
        centorName: dataState.searchData.centorName,
        subjectName: dataState.searchData.subjectName,
        projectName: dataState.searchData.projectName,
        auditStatus: dataState.searchData.auditStatus,
        budgetPeriod: dataState.searchData.budgetPeriod
    }
    const res = await getChargeList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
    }
}
// 查询
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}
// 通过拒绝审批
const toBudgetAudit = async (num, row) => {
    const param = {
        auditName: userInfo.value.name,
        auditRemark: row.auditRemark,
        auditStatus: num,
        modifierId: userInfo.value.account,
        recordId: row.recordId
    }
    let codeName = '通过'
    if (num === 2) {
        codeName = '通过'
    } else if (num === 3) {
        codeName = '拒绝'
    }
    ElMessageBox.confirm(
        `确定要${codeName}吗？`,
        '确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const res = await putBudgetAudit(param)
            if (res === '200') {
                ElMessage.success(codeName + '成功')
                getList()
            }
        })
}
// 下载附件
const frontDownload = async (url) => {
    const urlName = url.substr(url.lastIndexOf('/') + 1)
    const a = document.createElement('a')
    a.href = url
    a.download = urlName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
const tHead = [
    { align: 'center', tooltip: true, type: 'index', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'acctId', label: '账户编号', width: 220 },
    { align: 'center', tooltip: true, prop: 'acctName', label: '账户名称', width: 250 },
    { align: 'center', tooltip: true, prop: 'deptName', label: '机构', width: 180 },
    { align: 'center', tooltip: true, prop: 'centorName', label: '预算中心', width: 180 },
    { align: 'center', tooltip: true, prop: 'budgetPeriod', label: '预算期间', width: 130 },
    { align: 'center', tooltip: true, prop: 'subjectName', label: '预算科目', width: 150 },
    { align: 'center', tooltip: true, prop: 'projectName', label: '预算项目', width: 100 },
    { align: 'center', tooltip: true, prop: 'budgetAmount', label: '预算金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '状态', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'chargeAmount', label: '充值金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'budgetBillsCode', label: '方案申请单号', width: 200 },
    { align: 'center', tooltip: true, prop: 'applier', label: '提交人', width: 200 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '提交时间', width: 200 },
    { align: 'center', tooltip: true, prop: 'auditName', label: '审批人', width: 200 },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审批时间', width: 200 },
    { align: 'center', tooltip: true, prop: 'attachUrl', label: '附件', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'remark', label: '备注', width: 200 },
    { align: 'center', prop: 'button', label: '操作', minWidth: 100, slot: true }
]
// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList({ ...searchData.value })
}
// 当前也改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getList({ ...searchData.value })
}
</script>
<style lang="scss" scoped>
.register-user-list-page{
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                }
                .button-box{
                    width: 100%;
                    .el-button{
                        border: initial;
                    }
                }
            }
        }
        .page-area{
            display: flex;
            justify-content: center;
        }
    }
}
</style>
