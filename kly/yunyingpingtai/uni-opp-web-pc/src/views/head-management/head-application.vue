<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="申请单号" prop="applyId">
                        <el-input v-model="searchData.applyId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model="searchData.mobile" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="团长类型" prop="userType">
                        <el-select v-model="searchData.userType" clearable placeholder="请选择" >
                            <el-option label="大团长" value="1" />
                            <el-option label="小团长" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请单状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择" >
                            <el-option label="审核中" value="2" />
                            <el-option label="审核驳回" value="3" />
                            <el-option label="审核通过" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('gleader-audit-search')" @click="searchList">
                            搜索
                        </el-button>
                        <el-button type="primary"  @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button v-if="checkRole('gleader-audit-batch-pass')&&ids.length" type="primary" @click="batchAdopt()">
                            批量通过
                        </el-button>
                        <el-button v-if="checkRole('gleader-audit-batch-pass')&&!ids.length" @click="tiShi" type="primary">
                            批量通过
                        </el-button>
                        <el-button v-if="checkRole('gleader-audit-batch-reject')&&ids.length" type="primary" @click="showPs()">
                            批量拒绝
                        </el-button>
                        <el-button v-if="checkRole('gleader-audit-batch-reject')&&!ids.length" @click="tiShi" type="primary">
                            批量拒绝
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list
                    :tHead="headApplication"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    @selection-change="handleSelectionChange"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #applyOrder="scope">
                        <div>申请单单号：{{scope.row.applyId}}</div>
                        <div>申请时间：{{scope.row.applyTime}}</div>
                    </template>
                    <template #applyInfo="scope">
                        <div>申请身份：{{scope.row.userType===1?'大团长':'小团长'}}</div>
                        <div>姓名：{{scope.row.username}}</div>
                        <div v-if="scope.row.sex==0">性别：女</div>
                        <div v-if="scope.row.sex==1">性别：男</div>
                        <div v-if="scope.row.sex==2">性别：未知</div>
                        <div>身份证号：{{scope.row.idNumber}}</div>
                        <div>银行卡号：{{scope.row.acctNo}}</div>
                        <div>账户姓名：{{scope.row.acctName}}</div>
                        <div>开户行名称：{{scope.row.brchName}}</div>
                        <div>手机号：{{scope.row.mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')}}</div>
                        <div>家庭住址：{{scope.row.address}}</div>
                    </template>
                    <template #applyPeople="scope">
                        <div v-if="scope.row.userInfo">
                            <div>用户编号：{{scope.row.userInfo.busiUserId}}</div>
                            <div>用户昵称：{{scope.row.userInfo.nickName}}</div>
                            <div>注册手机号：{{scope.row.userInfo.phoneMobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')}}</div>
                            <div v-if="scope.row.userInfo.userStatus===1">用户状态：正常</div>
                            <div v-if="scope.row.userInfo.userStatus===2">用户状态：已注册</div>
                            <div v-if="scope.row.userInfo.userStatus===3">用户状态：已拉黑</div>
                        </div>
                    </template>
                    <template #inviterBusi="scope">
                        <div v-if="scope.row.userType==2">
                            <div v-if="scope.row.associateUserInfo">团长编号：{{scope.row.associateUserInfo.busiUserId}}</div>
                            <div v-if="scope.row.associateUserInfo">团长用户编号：{{scope.row.associateUserInfo.userId}}</div>
                            <div v-if="scope.row.associateUserInfo">团长昵称：{{scope.row.associateUserInfo.nickName}}</div>
                            <div v-if="scope.row.associateUserInfo">团长手机号：{{scope.row.associateUserInfo.phoneMobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')}}</div>
                        </div>
                    </template>
                    <template #applyStatus="scope">
                        <div v-if="scope.row.status===2">状态：审核中</div>
                        <div v-if="scope.row.status===3">状态：申请驳回</div>
                        <div v-if="scope.row.status===4">状态：通过</div>
                        <div>审批人：{{scope.row.auditor}}</div>
                        <div>审批时间：{{scope.row.auditTime}}</div>
                    </template>
                    <template #operation="scope">
                        <div v-if="scope.row.status===3">
                            <el-button link>申请驳回</el-button>
                        </div>
                        <div v-else-if="scope.row.status==4">
                            <el-button link>已通过</el-button>
                        </div>
                        <div v-else>
                            <el-button v-if="checkRole('gleader-audit-pass')" @click="adopt(scope.row)" type="primary" link>通过</el-button>
                            <el-button v-if="checkRole('gleader-audit-reject')" @click="refuse(scope.row)" type="primary" link>拒绝</el-button>
                        </div>
                    </template>
                </system-list>
            </div>
        </el-card>
        <el-dialog :close-on-click-modal="false" title="拒绝" :show-close='false' draggable width="36%" :modal="false" v-model="dialogTableVisible">
            <el-form :model="refuseDesc" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="拒绝原因" class="form-item" prop="name">
                    <el-input v-model="refuseDesc.desc" type="textarea" clearable />
                </el-form-item>
                <br>
                <div style="width:100%;display:flex;justify-content:center">
                    <el-form-item>
                        <el-button type="primary" @click="submit">
                            保存
                        </el-button>
                        <el-button type="primary" @click="dialogTableVisible=false">
                            关闭
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="批量拒绝" :show-close='false' draggable width="36%" :modal="false" v-model="showPopup">
            <el-form :model="batchrefuseDesc" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="拒绝原因" class="form-item" prop="name">
                    <el-input v-model="batchrefuseDesc.desc" type="textarea" clearable />
                </el-form-item>
                <br>
                <div style="width:100%;display:flex;justify-content:center">
                    <el-form-item>
                        <el-button type="primary" @click="batchRefuse">
                            保存
                        </el-button>
                        <el-button type="primary" @click="showPopup =false">
                            关闭
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog v-model="dialogTable" title="提示" center>
            <el-table :data="messageList">
                <el-table-column align="center" prop="applyId" label="申请单号" width="400" />
                <el-table-column  align="center" prop="errorMsg" label="拒绝信息" width="400" />
            </el-table>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { headApplication } from './tHead.js'
import { reactive, ref, toRefs } from 'vue'
// import { InstallEXCEL } from '@/utils'
import { shenhe, headApplyList } from '@/api/head'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { checkRole } from '@/utils'
const store = useStore()

const dataState = reactive({
    tableData: [],
    searchData: {
        busiCode: 'A1001001',
        applyId: '',
        mobile: '',
        userId: '',
        userType: '',
        status: ''
    },
    refuseDesc: {
        desc: ''
    },
    refuseDescs: null,
    batchrefuseDesc: {
        desc: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    messageList: []
})
const { tableData, searchData, refuseDesc, refuseDescs, batchrefuseDesc, pageinfo, messageList } = toRefs(dataState)
// const getList = async () => {
//     const param = {
//         ...searchData.value,
//         page: pageinfo.value.currentPage,
//         pageSize: pageinfo.value.pageSize
//     }
//     const res = await headApplyList(param)
//     if (res.code === '200') {
//         dataState.tableData = res.data.list
//         dataState.pageinfo.total = res.data.totalCount
//     }
// }
// getList()
// 批量
const ids = ref([])
const tiShi = () => {
    ElMessage({
        showClose: true,
        message: '请选择申请单',
        type: 'error'
    })
}
const handleSelectionChange = (val) => {
    ids.value = val.map(el => el.applyId)
}
const dialogTable = ref(false)
const batchAdopt = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        applyIdList: ids.value,
        status: 4,
        auditor: store.state.userInfo.name
    }
    const res = await shenhe(param)
    if (res.code === 200 || res.data !== null) {
        dataState.messageList = res.data
        dialogTable.value = true
    } else {
        ElMessage({
            showClose: true,
            message: res.message,
            type: 'success'
        })
    }
    getList()
}
const showPopup = ref(false)
const showPs = () => {
    showPopup.value = true
}

const batchRefuse = async (val) => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        applyIdList: ids.value,
        status: 3,
        auditor: store.state.userInfo.name,
        reason: dataState.batchrefuseDesc.desc
    }
    const res = await shenhe(param)
    if (res.code === 200 || res.data !== null) {
        dataState.messageList = res.data
        dialogTable.value = true
    } else {
        ElMessage({
            showClose: true,
            message: res.message,
            type: 'success'
        })
    }
    ids.value = []
    dataState.batchrefuseDesc.desc = ''
    showPopup.value = false
    getList()
}
// 审核通过
const adopt = async (val) => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        applyIdList: [val.applyId],
        status: 4,
        auditor: store.state.userInfo.name
    }

    const res = await shenhe(param)
    if (res.code === 200 || res.data !== null) {
        ElMessage({
            showClose: true,
            message: res.data[0].errorMsg,
            type: 'success'
        })
    } else {
        ElMessage({
            showClose: true,
            message: res.message,
            type: 'success'
        })
    }
    getList()
}
const dialogTableVisible = ref(false)
// 拒绝
const refuse = (val) => {
    dataState.refuseDescs = val
    dialogTableVisible.value = true
}
// 拒绝提交
const submit = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        applyIdList: [dataState.refuseDescs.applyId],
        status: 3,
        auditor: store.state.userInfo.name,
        reason: dataState.refuseDesc.desc
    }
    const res = await shenhe(param)
    dialogTableVisible.value = false
    if (res.code === 200 || res.data !== null) {
        ElMessage({
            showClose: true,
            message: res.data[0].errorMsg,
            type: 'success'
        })
    } else {
        ElMessage({
            showClose: true,
            message: res.message,
            type: 'success'
        })
    }
    dataState.refuseDesc.desc = ''
    getList()
}
// const phoneReplace = () => {
//     mobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2')
// }
// const submit = () => {
//     console.log('保存', dataState.refuseDesc.desc)
//     dialogTableVisible.value = false
// }
// const getList = async () => {
//     const param = {
//         ids: [1, 2, 3, 4]
//     }
//     const res = await getShenHeList(param)
//     console.log(123, res)
// }
// getList()
// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        page: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }
    if (param.regTime) {
        param.regBeginTime = param.regTime[0] || ''
        param.regEndTime = param.regTime[1] || ''
    } else {
        param.regBeginTime = param.regBeginTime ? param.regBeginTime : ''
        param.regEndTime = param.regEndTime ? param.regEndTime : ''
    }
    delete param.regTime
    const res = await headApplyList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
    }
}
getList()
// 搜索查询列表
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList()
}

// 当前也改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getList()
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
                    width: 535px;
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                    :deep(.el-form-item__content){
                        .el-range-editor.el-input__inner{
                            padding: 0 10px;
                        }
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
    .h2{
        height:40px;
        font-size:22px;
        font-weight:800;
        border-bottom:1px solid #ccc;
        margin-bottom:20px;
    }
    .form-item{
        width:80%;
    }
}
</style>
