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
                    <el-form-item label="状态" prop="acctStatus">
                        <el-select v-model="searchData.acctStatus" clearable placeholder="请选择" >
                            <el-option label="启用中" value="1" />
                            <el-option label="已关闭" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预算期间" prop="budgetPeriod" class="form-item-time">
                        <el-date-picker v-model="searchData.budgetPeriod" value-format="YYYY-MM" type="month"/>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="searchList">
                            查询
                        </el-button>
                        <el-button v-if="checkRole('marketing-13')" type="primary" @click="add()">
                            新建
                        </el-button>
                        <el-button v-if="checkRole('marketing-14')" type="primary" @click="edit()">调整预算金额</el-button>
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
                    <template #acctType="acctType">
                        <span type="text" v-if="acctType.row.acctType === 1" >公司内部</span>
                    </template>
                    <template #acctStatus="acctStatus">
                        <span type="text" v-if="acctStatus.row.acctStatus === 1" >启用中</span>
                        <span type="text" v-if="acctStatus.row.acctStatus === 2" >已关闭</span>
                    </template>
                    <template #button="row">
                        <el-button type="text" v-if="checkRole('marketing-15') && row.row.acctStatus === 1" @click='changeAcctStatus(2, row.row)'>关闭</el-button>
                        <el-button type="text" v-if="checkRole('marketing-15') && row.row.acctStatus === 2" @click='changeAcctStatus(1, row.row)'>启用</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <add-dialog  v-if="dataState.addDialogVisible" :visible ='dataState.addDialogVisible' @handleClose="dataState.addDialogVisible = false"></add-dialog>
        <edit-dialog  v-if="dataState.editDialogVisible" :visible ='dataState.editDialogVisible' @handleClose="dataState.editDialogVisible = false"></edit-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import addDialog from './dialog/add.vue'
import editDialog from './dialog/edit.vue'
import { getAccountList, putAccountStatus } from '@/api/marketing/marketing-cost'
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
        acctStatus: '',
        budgetPeriod: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    addDialogVisible: false,
    editDialogVisible: false
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
        acctStatus: dataState.searchData.acctStatus,
        budgetPeriod: dataState.searchData.budgetPeriod
    }
    const res = await getAccountList(param)
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
// 重置
const formRef = ref(null)
const resetForm = async (formRef) => {
    if (!formRef) return
    formRef.resetFields()
}
// 开启关闭账户
const changeAcctStatus = async (num, row) => {
    const param = {
        acctId: row.acctId,
        acctStatus: num,
        modifierId: userInfo.value.account
    }
    let codeName = '启用'
    if (num === 1) {
        codeName = '启用'
    } else if (num === 2) {
        codeName = '关闭'
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
            const res = await putAccountStatus(param)
            if (res.code === '200') {
                ElMessage.success(codeName + '成功')
                getList()
            }
        })
}
// 调整预算金额
const edit = async () => {
    dataState.editDialogVisible = true
    // router.push({ name: 'coupon-batch-apply', params: { userId: '123' } })
}
// 新建账户
const add = async () => {
    dataState.addDialogVisible = true
    // router.push({ name: 'coupon-batch-apply', params: { userId: '123' } })
}
const tHead = [
    { align: 'center', tooltip: true, type: 'index', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'acctId', label: '账户编号', width: 220 },
    { align: 'center', tooltip: true, prop: 'acctName', label: '账户名称', width: 250 },
    { align: 'center', tooltip: true, prop: 'acctType', label: '账户类型', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'deptName', label: '机构', width: 100 },
    { align: 'center', tooltip: true, prop: 'centorName', label: '预算中心', width: 120 },
    { align: 'center', tooltip: true, prop: 'budgetPeriod', label: '预算期间', width: 130 },
    { align: 'center', tooltip: true, prop: 'subjectName', label: '预算科目', width: 150 },
    { align: 'center', tooltip: true, prop: 'projectName', label: '预算项目', width: 100 },
    { align: 'center', tooltip: true, prop: 'budgetAmount', label: '预算金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'freezeAmount', label: '已冻结金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'usedAmount', label: '已使用金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'balanceAmount', label: '剩余金额', width: 100 },
    { align: 'center', tooltip: true, prop: 'acctStatus', label: '状态', width: 80, slot: true },
    { align: 'center', prop: 'button', label: '操作', minWidth: 80, slot: true }
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
