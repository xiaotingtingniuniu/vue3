<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="150px">
                    <el-form-item label="商户名称" prop="templateName">
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
                    <!-- <el-form-item label="合同类型" prop="contractType">
                        <el-select v-model="searchData.contractType" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.contractType" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in form.status" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" @click="getList(true)">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
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
                        <el-button type="primary" @click="downContract(scope.row)" link>下载</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
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
        status: '',
        scene: '',
        contractType: ''
    },
    form: {
        scene: { 1: '入驻', 2: '开户' },
        contractType: { 1: '服务合同', 2: '合作协议', 3: '支付协议', 4: '租赁合同', 5: '技术协议' },
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
        configCode: 'UC53194757032022016',
        name: '查询商户合同列表',
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
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    pageInfo.value.currentPage = 1
    getList()
}
// 下载
const downContract = (val) => {
    downloadFile(val.contractUrl, val.contractName)
}
// const isCoverShow = ref(false)
const coverShow = (val) => {
    if (val.contractUrl) {
        window.open(val.contractUrl, '_blank')
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
