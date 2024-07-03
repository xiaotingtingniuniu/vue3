<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="150px">
                    <el-form-item label="合同模板名称" prop="templateName">
                        <el-input v-model="searchData.templateName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.busiCode" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业务场景" prop="scene">
                        <el-select v-model="searchData.scene" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.scene" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同类型" prop="contractType">
                        <el-select v-model="searchData.contractType" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.contractType" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.status" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getList(true)">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                        <el-button type="primary" @click="addContract">新增</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
        <el-card class="box-card">
            <div class="tableList-area">
                <system-list
                    :tHead="shopThead"
                    :tableData="tableData"
                    v-model:current-page="pageInfo.currentPage"
                    v-model:page-size="pageInfo.pageSize"
                    :total="pageInfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #busiCode="row">
                        {{form.busiCode[row.row.busiCode]}}
                    </template>
                    <template #scene="row">
                        {{form.scene[row.row.scene]}}
                    </template>
                    <template #contractType="row">
                        {{form.contractType[row.row.contractType]}}
                    </template>
                    <template #status="row">
                        {{form.status[row.row.status]}}
                    </template>
                    <template #operation="scope">
                        <el-button type="primary" @click="coverShow(scope.row)" link>查看</el-button>
                        <el-button type="primary" v-if="scope.row.status==3 || scope.row.status==1" @click="toApply(scope.row)" link>启用</el-button>
                        <el-button type="primary" v-if="scope.row.status==2" @click="toApply(scope.row)" link>停用</el-button>
                        <el-button type="primary" @click="downContract(scope.row)" link>下载</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <el-dialog v-model="dialogFormVisible" center title="新增" :close-on-click-modal="false" :show-close="false">
            <el-form ref="addFormRef" :model="addSearchData" :inline="true" label-position="center" label-width="150px">
                <el-form-item label="合同模板名称" prop="templateName">
                    <el-input v-model="addSearchData.templateName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="业务线" prop="busiCode" :rules="rules.sle">
                    <el-select v-model="addSearchData.busiCode" clearable placeholder="请选择">
                        <el-option v-for="(item, key) in form.busiCode" :key="item" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务场景" prop="scene" :rules="rules.sle">
                    <el-select v-model="addSearchData.scene" clearable placeholder="请选择">
                        <el-option v-for="(item, key) in form.scene" :key="item" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="合同类型" prop="contractType" :rules="rules.sle">
                    <el-select v-model="addSearchData.contractType" clearable placeholder="请选择">
                        <el-option v-for="(item, key) in form.contractType" :key="item" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="模版文件：">
                    <cst-upload :limit="1" :multiple="false" v-model:fileList="addSearchData.templateUrl" accept="pdf,xlsx,xls,doc,docx,pptx,ppt" :mediaType="1"></cst-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="dialogFormVisible=false">取消</el-button>
                    <el-button type="primary" @click="addContractConfirm">确认</el-button>
                </span>
            </template>
        </el-dialog>
        <el-dialog v-model="isCoverShow" title="查看LOGO" :close-on-press-escape="false">
            <el-form-item label=" ">
                <el-image class="coverImg" :src="seeData.storeLogo" :preview-src-list="[seeData.storeLogo]" :initial-index="4" fit="cover" />
            </el-form-item>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs } from 'vue'
import { shopThead } from './shopThead'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { unifiedGatewayPost, unifiedGatewayGet } from '../../../api/marketing/marketingApply.js'
import { downloadFile } from '@/utils'
import CstUpload from '@/components/upload/uploadContract.vue'
const store = useStore()
const router = useRouter()
const dataState = reactive({
    tableData: [],
    searchData: {
        appKey: 'A1001002',
        busiCode: '',
        templateName: '',
        status: '',
        scene: '',
        contractType: ''
    },
    addSearchData: {
        appKey: 'A1001002',
        busiCode: '',
        templateName: '',
        scene: '',
        contractType: '',
        templateUrl: []
    },
    form: {
        scene: { 1: '入驻', 2: '开户' },
        contractType: { 1: '服务协议', 2: '业务合同', 3: '委托划款', 4: '租赁合同' },
        status: { 1: '新建', 2: '启用', 3: '停用' },
        busiCode: {}
    },
    refuse: {
        reason: ''
    },
    applyData: null,
    seeData: null
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
// 重置
const formRef = ref(null)
const addFormRef = ref(null)
const isShow = ref(false)
const { tableData, searchData, addSearchData, applyData, seeData, refuse, form } = toRefs(dataState)
// 获取业务线
const getBusi = async () => {
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53772472084463616',
        name: '查询所有业务线',
        source: '商户中台',
        body: {}
    }
    const res = await unifiedGatewayPost(param)
    if (res) {
        res.data.map((item) => {
            dataState.form.busiCode[item.busiCode] = item.buisName
        })
    }
}
getBusi()
// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53427029509312512',
        name: '查询合同模版列表',
        source: '商户中台',
        body: {
            ...searchData.value,
            page: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()
// 新增模版
const addContractConfirm = async () => {
    if (!dataState.addSearchData.templateUrl.length || !dataState.addSearchData.templateUrl[0].url) {
        ElMessage({
            message: '请上传合同模版！',
            type: 'error'
        })
        return
    }
    // addFormRef.value.validate(async (valid) => {
    // if (valid) {
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53194949819011072',
        name: '合同模版新增接口',
        source: '商户中台',
        body: {
            appKey: dataState.addSearchData.appKey,
            busiCode: dataState.addSearchData.busiCode,
            templateName: dataState.addSearchData.templateName,
            scene: dataState.addSearchData.scene,
            contractType: dataState.addSearchData.contractType,
            templateUrl: dataState.addSearchData.templateUrl[0].url
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res) {
        addFormRef.value.resetFields()
        dataState.addSearchData.templateUrl = []
        getList()
        addContract()
    }
    // }
    // })
}
const rules = reactive({
    sle: [{ required: true, message: '请选择', trigger: 'change' }],
    input: [{ required: true, message: '请输入', trigger: 'blur' }]
})
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    pageInfo.value.currentPage = 1
    getList()
}
const dialogFormVisible = ref(false)
const toApply = async (val) => {
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53426691460993024',
        name: '合同模版启用接口',
        source: '商户中台',
        body: {
            appKey: 'A1001002',
            id: val.id,
            status: val.status === 2 ? 3 : 2
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res) {
        getList()
    }
}
// 新增弹窗
const addContract = () => {
    dialogFormVisible.value = !dialogFormVisible.value
}
// 下载
const downContract = (val) => {
    downloadFile(val.templateUrl, val.templateName)
}
const close = () => {
    dataState.refuse.reason = ''
    isShow.value = false
    getList()
    // dialogFormVisible.value = false
}
// const isCoverShow = ref(false)
const coverShow = (val) => {
    if (val.templateUrl) {
        window.open(val.templateUrl, '_blank')
    }
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getList()
}
</script>
<style lang="scss" scoped>
.search-area{
    display:flex;
    justify-content: space-between;
    .el-input{
        width:240px;
    }
    .el-select{
        width:240px;
    }
}
.image{
    width:50px;
    height:50px;
    border:1px solid #ccc;
}
.tableList-area{
    margin-top:20px;
}
.box-card{
    margin-top:20px;
}
.coverImg{
    width:100px;
    height: 100px;
    margin-left:50px;
}
.button-box{
    display:flex;
    flex-direction:row-reverse;
}
</style>
