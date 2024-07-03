<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="用户ID" prop="busiUserId">
                        <el-input v-model="searchData.busiUserId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phoneMobile">
                        <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                            <el-option label="恒生活App" value="A1001001" />
                            <el-option label="智能货柜" value="A1001002" />
                            <el-option label="恒生活众包" value="A1001003" />
                            <el-option label="恒掌柜" value="A1001004" />
                            <el-option label="供应链" value="A1001005" />
                            <el-option label="交付" value="A1001006" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册方式" prop="regType">
                        <el-select v-model="searchData.regType" clearable placeholder="请选择">
                            <el-option label="手机注册" value="1" />
                            <el-option label="邮箱注册" value="2" />
                            <el-option label="账户" value="3" />
                            <el-option label="微信注册" value="4" />
                            <el-option label="支付宝注册" value="5" />
                            <el-option label="qq注册" value="6" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分销角色" prop="role">
                        <el-select v-model="searchData.role" clearable placeholder="请选择" >
                            <el-option label="大团长" value="1" />
                            <el-option label="小团长" value="2" />
                            <el-option label="大团长用户" value="3" />
                            <el-option label="小团长用户" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色状态" prop="roleStatus">
                        <el-select v-model="searchData.roleStatus" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="正常" value="1" />
                            <el-option label="已注销" value="2" />
                            <el-option label="已拉黑" value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册时间" prop="regTime" class="form-item-time">
                        <el-date-picker size="default" v-model="searchData.regTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">
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
                    :tHead="distributionThead"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #regType="scope">
                        <span v-if="scope.row.regType==1">手机注册</span>
                        <span v-if="scope.row.regType==2">邮箱注册</span>
                        <span v-if="scope.row.regType==3">账户</span>
                        <span v-if="scope.row.regType==4">微信注册</span>
                        <span v-if="scope.row.regType==5">支付宝注册</span>
                        <span v-if="scope.row.regType==6">QQ注册</span>
                    </template>
                    <template #role="scope">
                        <span v-if="scope.row.role==1">大团长</span>
                        <span v-if="scope.row.role==2">小团长</span>
                        <span v-if="scope.row.role==3">大团长用户</span>
                        <span v-if="scope.row.role==4">小团长用户</span>
                    </template>
                    <template #inviterRole="scope">
                        <span v-if="scope.row.inviterRole==1">大团长</span>
                        <span v-if="scope.row.inviterRole==2">小团长</span>
                        <span v-if="scope.row.inviterRole==3">大团长用户</span>
                        <span v-if="scope.row.inviterRole==4">小团长用户</span>
                    </template>
                    <template #roleStatus="scope">
                        <span v-if="scope.row.roleStatus==1">正常</span>
                        <span v-if="scope.row.roleStatus==2">已注销</span>
                        <span v-if="scope.row.roleStatus==3">已拉黑</span>
                    </template>
                    <template #roleRelationStatus="scope">
                        <span v-if="scope.row.roleRelationStatus==1">正常</span>
                        <span v-if="scope.row.roleRelationStatus==2">解绑</span>
                    </template>
                    <template #inviterRoleStatus="scope">
                        <span v-if="scope.row.inviterRoleStatus==1">正常</span>
                        <span v-if="scope.row.inviterRoleStatus==2">已注销</span>
                        <span v-if="scope.row.inviterRoleStatus==3">已拉黑</span>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { distributionThead } from './tHead.js'
import { reactive, ref, toRefs } from 'vue'
// import { InstallEXCEL } from '@/utils'
import { getDistribution } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const infoMessage = () => {
    ElMessage({
        showClose: true,
        message: '功能正在开发中',
        type: 'warning'
    })
}
const dataState = reactive({
    tableData: [],
    searchData: {
        busiUserId: '',
        phoneMobile: '',
        busiCode: '',
        regType: '',
        role: '',
        roleStatus: '',
        regTime: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const { tableData, searchData, pageinfo } = toRefs(dataState)

// 获取列表
const getList = async () => {
    const param = { ...searchData.value, currPage: pageinfo.value.currentPage, pageSize: pageinfo.value.pageSize }
    if (param.regTime) {
        param.regStartTime = param.regTime[0] || ''
        param.regEndTime = param.regTime[1] || ''
    } else {
        param.regStartTime = param.regStartTime ? param.regStartTime : ''
        param.regEndTime = param.regEndTime ? param.regEndTime : ''
    }
    delete param.regTime
    const res = await getDistribution(param)
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
const dialogTableVisible = ref(false)
const dialogTableVisibles = ref(false)
const address = (val) => {
    dialogTableVisibles.value = true
    dataState.adressTable[0] = val
}
const block = (val) => {
    dialogTableVisible.value = true
    dataState.blockTable[0] = val
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
}
</style>
