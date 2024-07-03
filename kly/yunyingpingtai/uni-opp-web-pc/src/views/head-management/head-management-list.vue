<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="用户编号" prop="busiUserId">
                        <el-input v-model="searchData.busiUserId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="团长类型" prop="role">
                        <el-select v-model="searchData.role" clearable placeholder="请选择" >
                            <el-option label="大团长" value="1" />
                            <el-option label="小团长" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户状态" prop="roleStatus">
                        <el-select v-model="searchData.roleStatus" clearable placeholder="请选择" >
                            <el-option label="正常" value="1" />
                            <el-option label="已注销" value="2" />
                            <el-option label="已拉黑" value="3" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('gleader-list-search')" @click="searchList">
                            搜索
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list
                    :tHead="headManagement"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #phoneMobile="scope">
                        <span>{{scope.row.phoneMobile?scope.row.phoneMobile.replace(/(\d{3})\d*(\d{4})/, '$1****$2'):scope.row.phoneMobile}}</span>
                    </template>
                    <template #role="scope">
                        <span v-if="scope.row.role===1">大团长</span>
                        <span v-if="scope.row.role===2">小团长</span>
                    </template>
                    <template #roleStatus="scope">
                        <span v-if="scope.row.roleStatus===1">正常</span>
                        <span v-if="scope.row.roleStatus===2">已注销</span>
                        <span v-if="scope.row.roleStatus===3">已拉黑</span>
                    </template>
                    <template #infomation="scope">
                        <div v-if="scope.row.userApplyInfo">姓名：{{scope.row.userApplyInfo.username}}</div>
                        <div v-if="scope.row.userApplyInfo">
                            <div v-if="scope.row.userApplyInfo.sex==0">性别：女</div>
                            <div v-if="scope.row.userApplyInfo.sex==1">性别：男</div>
                            <div v-if="scope.row.userApplyInfo.sex==2">性别：未知</div>
                        </div>
                        <div v-if="scope.row.userApplyInfo">身份证号：{{scope.row.userApplyInfo.idNumber}}</div>
                        <div v-if="scope.row.userApplyInfo">账户姓名：{{scope.row.userApplyInfo.acctName}}</div>
                        <div v-if="scope.row.userApplyInfo">银行卡号：{{scope.row.userApplyInfo.acctNo}}</div>
                        <div v-if="scope.row.userApplyInfo">开户行名称：{{scope.row.userApplyInfo.brchName}}</div>
                        <div v-if="scope.row.userApplyInfo">手机号：{{scope.row.userApplyInfo.mobile}}</div>
                        <div v-if="scope.row.userApplyInfo">家庭住址：{{scope.row.userApplyInfo.address}}</div>
                    </template>
                    <template #operation="scope">
                        <el-button v-if="checkRole('gleader-list-edit')" @click="withdrawalInformation(scope.row)" type="primary" link>修改提现资料</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <el-dialog :close-on-click-modal="false" title="修改提现资料" :show-close='false' draggable width="36%" v-model="dialogTableVisible">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="申请编号" prop="applyId">
                        <div v-if="dataState.tableDatas.userApplyInfo">
                            {{dataState.tableDatas.userApplyInfo.applyId}}
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户昵称" prop="nikeName">
                        {{dataState.tableDatas.nickName}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户编号" prop="busiUserId">
                        {{dataState.tableDatas.busiUserId}}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="用户手机号" prop="phoneMobile">
                        {{dataState.tableDatas.phoneMobile}}
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="用户姓名" prop="username">
                        <div v-if="dataState.tableDatas.userApplyInfo">
                            {{dataState.tableDatas.userApplyInfo.username}}
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="家庭住址" prop="address">
                        <div v-if="dataState.tableDatas.userApplyInfo">
                            {{dataState.tableDatas.userApplyInfo.address}}
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form ref="ruleFormRef" :model="dataForm" :rules="rules" :inline="true" label-position="right" label-width="100px">
                <el-row>
                    <el-col :span="24" v-if="dataState.tableDatas.userApplyInfo">
                        <el-form-item label="账户姓名" class="form-item" prop="acctName">
                            <el-input v-model="dataForm.acctName" placeholder="请输入" inline-message="true" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-if="dataState.tableDatas.userApplyInfo">
                        <el-form-item label="身份证号" class="form-item" prop="idNumber">
                            <el-input v-model="dataForm.idNumber" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-if="dataState.tableDatas.userApplyInfo">
                        <el-form-item label="银行卡号" class="form-item" prop="acctNo">
                            <el-input v-model="dataForm.acctNo" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" v-if="dataState.tableDatas.userApplyInfo">
                        <el-form-item label="开户行名称" class="form-item" prop="brchName">
                            <el-input v-model="dataForm.brchName" placeholder="请输入" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <br>
                <div style="width:100%;display:flex;justify-content:center">
                    <el-form-item>
                        <el-button type="primary" @click="submitForm(ruleFormRef)">
                            保存
                        </el-button>
                        <el-button type="primary" @click="close">
                            关闭
                        </el-button>
                    </el-form-item>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { headManagement } from './tHead.js'
import { reactive, ref, toRefs } from 'vue'
import { getHeadList, userUpdate } from '@/api/head'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { checkRole } from '@/utils'
const store = useStore()

const dataState = reactive({
    tableData: [],
    tableDatas: {
        userApplyInfo: {}
    },
    searchData: {
        busiCode: 'A1001001',
        busiUserId: '',
        role: '',
        roleStatus: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const { tableData, tableDatas, searchData, pageinfo } = toRefs(dataState)

const ruleFormRef = ref(null)
const rules = reactive({
    acctName: [
        { required: true, message: '账户姓名是必填条件', trigger: 'blur' },
        { min: 2, max: 20, message: '账户姓名最少两位字符', trigger: 'blur' }
    ],
    idNumber: [
        { required: true, message: '身份证号是必填条件', trigger: 'blur' },
        { max: 18, message: '身份证号由18位字符组成', trigger: 'blur' }
    ],
    acctNo: [
        { required: true, message: '银行卡号是必填条件', trigger: 'blur' },
        { min: 16, max: 19, message: '银行卡号由16或17或19位数字组成', trigger: 'blur' }
    ],
    brchName: [
        { required: true, message: '开户行名称是必填条件', trigger: 'blur' },
        { max: 100, message: '开户行名称由1-100位字符组成', trigger: 'blur' }
    ]
})
// 获取列表
const getList = async () => {
    const param = { ...searchData.value, currPage: pageinfo.value.currentPage, pageSize: pageinfo.value.pageSize }
    if (param.regTime) {
        param.regBeginTime = param.regTime[0] || ''
        param.regEndTime = param.regTime[1] || ''
    } else {
        param.regBeginTime = param.regBeginTime ? param.regBeginTime : ''
        param.regEndTime = param.regEndTime ? param.regEndTime : ''
    }
    delete param.regTime
    const res = await getHeadList(param)
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

// 修改体现资料
const dataForm = ref({
    acctName: '',
    idNumber: '',
    acctNo: '',
    brchName: ''
})
const dialogTableVisible = ref(false)
const withdrawalInformation = (val) => {
    if (val.userApplyInfo) {
        dialogTableVisible.value = true
        dataState.tableDatas = val
        dataForm.value.acctName = val.userApplyInfo.acctName
        dataForm.value.idNumber = val.userApplyInfo.idNumber
        dataForm.value.acctNo = val.userApplyInfo.acctNo
        dataForm.value.brchName = val.userApplyInfo.brchName
        ruleFormRef.value = val
    } else {
        ElMessage({
            showClose: true,
            message: '用户提现资料为空',
            type: 'warning'
        })
    }
}
const close = () => {
    getList()
    dataForm.value = {}
    dialogTableVisible.value = false
}
const submitForm = async (formEl) => {
    if (!formEl) return
    const param = {
        appKey: 'A1001000',
        busiCode: dataState.tableDatas.userInfo.busiCode,
        applyId: dataState.tableDatas.userApplyInfo.applyId,
        username: dataState.tableDatas.userApplyInfo.username,
        address: dataState.tableDatas.userApplyInfo.address,
        ...dataForm.value,
        modifyId: store.state.userInfo.id
    }
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const res = await userUpdate(param)
            if (res.code === '200') {
                dialogTableVisible.value = false
                ElMessage({
                    showClose: true,
                    message: res.message,
                    type: 'success'
                })
                getList()
                dataForm.value = {}
            }
        }
    })
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

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
    .box-cards{
        height:400px;
        overflow:hidden;
        overflow-y:scroll;
        .top{
            width:100%;
            height:40px;
            line-height:40px;
            .left{
                float: left;
                // position: absolute;
                // left:20px;
            }
            .right{
                float: left;
                position: absolute;
                right:40px;
            }
        }
        .bottom{
            height:40px;
            line-height:40px;
        }
    }
    .form-item{
        width:60%;
    }
}
</style>
