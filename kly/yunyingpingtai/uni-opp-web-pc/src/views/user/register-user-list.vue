<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="用户ID" prop="userId">
                        <el-input v-model="searchData.userId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickName">
                        <el-input v-model="searchData.nickName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="手机号" prop="phoneMobile">
                        <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in busiCodeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册方式" prop="regType">
                        <el-select v-model="searchData.regType" clearable placeholder="请选择">
                            <el-option v-for="(item, key) in regTypeKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="角色状态" prop="userStatus">
                        <el-select v-model="searchData.userStatus" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in userStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="注册时间" prop="regTime" class="form-item-time">
                        <el-date-picker size="default" v-model="searchData.regTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
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
                    <template #regType="row">
                        {{regTypeKeyValue[row.row.regType]}}
                    </template>
                    <template #busiCode="row">
                        {{busiCodeKeyValue[row.row.busiCode]}}
                    </template>
                    <template #userStatus="row">
                        {{userStatusKeyValue[row.row.userStatus]}}
                    </template>
                    <template #loginStatus="row">
                        {{loginStatusKeyValue[row.row.loginStatus]}}
                    </template>
                    <template #isAddress="{ row }">
                        <el-button @click="address(row)" :class="!row.isAddress ? 'gray' : ''" type="primary" link>{{row.isAddress ? '查看' : '暂无'}}</el-button>
                    </template>
                    <template #operation="{ row }">
                        <el-button @click="blockFn(row)" :class="row.userStatus===2 ? 'gray' : ''" type="primary" link>{{ row.userStatus===1 ? '拉黑': (row.userStatus===2 ? '已注销' : '查看')}}</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <el-dialog title="用户拉黑" v-model="dialogForBlock" center>
            <div class="dialog-wrap">
                <div class="title">用户基本信息</div>
                <el-table :data="[targetUser]" style="width: 100%">
                    <el-table-column prop="userId" label="用户ID" width="250" />
                    <el-table-column prop="nickName" label="用户昵称" width="180" />
                    <el-table-column prop="phoneMobile" label="手机号" width="180" />
                    <el-table-column prop="regTime" label="注册时间" width="200"/>
                    <el-table-column prop="userStatus" label="用户状态" width="180">
                        <template #default="scope">
                            <div v-if="scope.row.userStatus=='1'">正常</div>
                            <div v-if="scope.row.userStatus=='2'">注销</div>
                            <div v-if="scope.row.userStatus=='3'">拉黑</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="regOrigin" label="用户来源" width="180">
                        <template #default="scope">
                            <div v-if="scope.row.regOrigin=='A1001001'">恒生活App</div>
                            <div v-if="scope.row.regOrigin=='A1001002'">智能货柜</div>
                            <div v-if="scope.row.regOrigin=='A1001003'">恒生活众包</div>
                            <div v-if="scope.row.regOrigin=='A1001004'">恒掌柜</div>
                            <div v-if="scope.row.regOrigin=='A1001005'">供应链</div>
                            <div v-if="scope.row.regOrigin=='A1001006'">交付</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="busiCode" label="所属业务线" width="200" />
                </el-table>
                <div class="mrt20">
                    <div class="title">拉黑范围</div>
                    <div class="block-card">
                        <div class="check-line">
                            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全场景</el-checkbox>
                            <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
                                <el-checkbox  v-for="item in sceneArr" :key="item" :label="item">{{ sceneArrText[item - 1] }}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <el-button type="primary" v-if="targetUser.userStatus===1" @click="affirmFn(true)">立即生效</el-button>
                        <el-button type="primary" v-else @click="affirmFn(false)">解除黑名单</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="收货地址" v-model="dialogForAddress" center>
            <div class="dialog-wrap">
                <div class="title">用户基本信息</div>
                <el-table :data="[targetUser]" style="width: 100%">
                    <el-table-column prop="userId" label="用户ID" width="250" />
                    <el-table-column prop="nickName" label="用户昵称" width="180" />
                    <el-table-column prop="phoneMobile" label="手机号" width="180" />
                    <el-table-column prop="regTime" label="注册时间" width="200"/>
                    <el-table-column prop="userStatus" label="用户状态" width="180">
                        <template #default="scope">
                            <div v-if="scope.row.userStatus=='1'">正常</div>
                            <div v-if="scope.row.userStatus=='2'">注销</div>
                            <div v-if="scope.row.userStatus=='3'">拉黑</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="regOrigin" label="用户来源" width="180">
                        <template #default="scope">
                            <div v-if="scope.row.regOrigin=='A1001001'">恒生活App</div>
                            <div v-if="scope.row.regOrigin=='A1001002'">智能货柜</div>
                            <div v-if="scope.row.regOrigin=='A1001003'">恒生活众包</div>
                            <div v-if="scope.row.regOrigin=='A1001004'">恒掌柜</div>
                            <div v-if="scope.row.regOrigin=='A1001005'">供应链</div>
                            <div v-if="scope.row.regOrigin=='A1001006'">交付</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="busiCode" label="所属业务线" width="200" />
                </el-table>
                <div class="mrt20">
                    <div class="title">收货地址</div>
                    <div class="box-cards">
                        <el-card class="address-item" v-for="item in userAddressList" :key="item.id">
                            <div class="address-item-title">
                                <div>收货人：{{item.receiver}} {{item.receiverPhone}}</div>
                                <div class="colour" v-if="item.isDefault===1">默认地址</div>
                            </div>
                            <div class="address-item-full">{{ item.fullAddr }}</div>
                        </el-card>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { tHead } from './tHead.js'
import { ref, onMounted } from 'vue'
import { getUserList, getAdress, userBlock, userUnBlock, getUserBlock } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

onMounted(() => {
    getList()
})

// 字段映射
const regTypeKeyValue = ref({ 1: '手机注册', 2: '邮箱注册', 3: '账户', 4: '微信注册', 5: '支付宝注册', 6: 'qq注册' })
const userStatusKeyValue = ref({ 1: '正常', 2: '已注销', 3: '已拉黑', 4: '部分拉黑' })
const loginStatusKeyValue = ref({ 1: '正常', 2: '已过期' })
const busiCodeKeyValue = ref({ A1001001: '恒生活App', A1001002: '智能货柜', A1001003: '恒生活众包', A1001004: '恒掌柜', A1001005: '供应链', A1001006: '交付' })
// 当前操作的用户数据
const targetUser = ref(null)

// 列表
const pageinfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const searchData = ref({
    userId: '',
    nickName: '',
    phoneMobile: '',
    busiCode: '',
    regType: '',
    userStatus: '',
    regTime: ''
})
const tableData = ref([])
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
    const { code, data } = await getUserList(param)
    if (code === '200') {
        tableData.value = data.list
        pageinfo.value.total = data.totalCount
    }
}
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getList({ ...searchData.value })
}
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getList({ ...searchData.value })
}

// 拉黑
const dialogForBlock = ref(false)
const blockFn = async (val) => {
    targetUser.value = val
    if (targetUser.value.userStatus > 2) {
        const { data } = await getUserBlock({
            busiCode: targetUser.value.busiCode,
            appKey: 'appKey',
            userMarkId: targetUser.value.subUserId,
            markType: 1
        })
        if (data[0].sceneCode === '0') {
            checkAll.value = true
            handleCheckAllChange(true)
        } else {
            checkAll.value = false
            checkList.value = data.map(item => item.sceneCode)
        }
    } else {
        checkAll.value = false
        checkList.value = []
        isIndeterminate.value = false
    }
    dialogForBlock.value = true
}
const sceneArrText = ['预约购物', '到店支付', '智能货柜', '到家电商'] // , '小程序-货柜购物'
const sceneArr = ['1', '2', '3', '4'] // , '5'
const checkList = ref([])
const checkAll = ref(false)
const isIndeterminate = ref(false)
const handleCheckAllChange = (val) => {
    checkList.value = val ? sceneArr : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === sceneArr.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < sceneArr.length
}
const affirmFn = async (status) => {
    if (status) {
        ElMessageBox.confirm(
            '拉黑后，会按照选择范围，限制该用户的登录/访问/购物等操作',
            '是否确认拉黑！',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            const params = {
                // busiCode: targetUser.value.busiCode,
                busiCode: 'A1001001',
                appKey: 'appKey',
                userMarkId: targetUser.value.subUserId,
                markType: 1,
                remark: null,
                sceneCode: checkAll.value ? '0' : checkList.value.join(',')
            }
            const { code } = await userBlock(params)
            if (code === '200') {
                dialogForBlock.value = false
                ElMessage({ type: 'success', message: '拉黑生效' })
                getList()
            }
        })
    } else {
        ElMessageBox.confirm(
            '解除后，会恢复该用户的登录/访问/购物等操作权限',
            '是否确认解除黑名单',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            const params = {
                busiCode: targetUser.value.busiCode,
                appKey: 'appKey',
                userMarkId: targetUser.value.subUserId,
                markType: 1
            }
            const { code } = await userUnBlock(params)
            if (code === '200') {
                dialogForBlock.value = false
                ElMessage({ type: 'success', message: '黑名单解除' })
                getList()
            }
        })
    }
}

// 查看收货地址
const dialogForAddress = ref(false)
const userAddressList = ref(null)
const address = async (val) => {
    if (val.isAddress === 1) {
        const param = {
            busiCode: 'A1001001',
            appKey: 'A1001001',
            userMarkId: val.subUserId,
            markType: 1
        }
        const { data } = await getAdress(param)
        targetUser.value = val
        userAddressList.value = data
        dialogForAddress.value = true
    }
}

</script>
<style lang="scss" scoped>
.register-user-list-page{
    .dialog-wrap{
        .title{
            font-size: 18px;
            color: #303133;
        }
        .mrt20{
            margin-top: 20px;
        }
        .block-card{
            .check-line{
                display: flex;
                margin-top: 10px;
                .el-checkbox-group{
                    margin-left: 30px;
                }
            }
            .el-button{
                margin-top: 10px;
            }
        }
    }
    .gray{
        color: #9b9b9b;
    }
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
        margin-top: 12px;
        background-color: #fff;
        .address-item{
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-bottom: 12px;
            box-shadow: initial;
            .address-item-title{
                display: flex;
                justify-content: space-between;
                .colour{
                    color: #fe2c55;
                }
            }
        }
    }
}
</style>
