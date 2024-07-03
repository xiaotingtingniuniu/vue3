<template>
    <div class="register-user-list-page">
        <el-form :rules="tipsRules">
            <el-form-item label="业务线：" prop="addTipsOpt">
                <el-select v-model="addTipsOpt" multiple placeholder="请选择标签">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务场景：" prop="addTipsOpt">
                <el-select v-model="addTipsOpt" multiple placeholder="请选择标签">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型：" prop="addTipsOpt">
                <el-select v-model="addTipsOpt" multiple placeholder="请选择标签">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同模版名称：" prop="orderNoSub">
                <el-input v-model="form.orderNoSub" placeholder="请输入合同模板名称" />
            </el-form-item>
            <el-form-item label="模版文件：">
                <el-upload
                    class="multiple"
                    accept="pdf,xlsx,xls,doc,docx,pptx,ppt"
                    :show-file-list=false
                    :auto-upload = "false"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    :on-change="fileRequest">
                </el-upload>
            </el-form-item>
        </el-form>
        <template>
            <el-button type="primary" v-if="scope.row.storeStatus==2" @click="toApply(scope.row)" link>取消</el-button>
            <el-button type="primary" v-else @click="coverShow(scope.row)" link>确认</el-button>
        </template>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs } from 'vue'
import { shopThead } from './shopThead'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getApplyList, shopApply } from '../../../api/marketing/marketingApply.js'
const store = useStore()
const storeStatusKeyValue = ref({ 0: '停用', 1: '启用', 2: '未审核', 3: '通过', 4: '未通过' })
const dataState = reactive({
    tableData: [],
    searchData: {
        appKey: 'A1001001',
        merchantName: '',
        storeName: '',
        storeStatus: ''
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
const isShow = ref(false)
const { tableData, searchData, applyData, seeData, refuse } = toRefs(dataState)
// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = {
        ...searchData.value,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await getApplyList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    pageInfo.value.currentPage = 1
    getList()
}
const dialogFormVisible = ref(false)
const toApply = (val) => {
    dialogFormVisible.value = true
    dataState.applyData = val
}
// 上传文件格式过滤
const beforeUpload = (file) => {
    const isType = file.type === 'application/vnd.ms-excel'
    const isTypeComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const fileType = isType || isTypeComputer
    if (!fileType) {
        ElMessageBox({
            type: 'error',
            message: '上传文件只能是pdf、xlsx、xls、doc、docx、pptx、ppt格式！!'
        })
    }
    return fileType
}
// 上传文件
const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.raw)
    formData.append('appKey', 'A1001000')
    formData.append('busiCode', 'A1001000')
    formData.append('configCode', 'UC10459724838014976')
    formData.append('name', '提现结转导入')
    formData.append('source', '分销系统')
    formData.append('importType', 1)
    // const res = await getupdate(formData)
    // if (res.code === '200') {
    //     ElMessage({
    //         message: '上传成功',
    //         type: 'success'
    //     })
    //     dataState.tableData = res.data
    //     getList()
    // } else {
    //     dataState.tableData = []
    // }
}
const submit = async (val) => {
    const param = {
        appKey: '"A1001000"',
        busiCode: val.busiCode,
        storeCode: val.storeCode,
        storeStatus: val.storeStatus,
        remark: dataState.refuse.reason,
        modifierId: store.state.userInfo.name
    }
    let res
    if (val.storeStatus === '4') {
        if (!dataState.refuse.reason) return ElMessage.warning('拒绝原因不能为空')
        res = await shopApply(param)
        if (res.code === '200') {
            ElMessage.success('成功')
            getList()
            dialogFormVisible.value = false
        }
    } else if (val.storeStatus === '3') {
        res = await shopApply(param)
        if (res.code === '200') {
            ElMessage.success('成功')
            getList()
            dialogFormVisible.value = false
        }
    }
}
const close = () => {
    dataState.refuse.reason = ''
    isShow.value = false
    getList()
    dialogFormVisible.value = false
}
const isCoverShow = ref(false)
const coverShow = (val) => {
    if (!val.storeLogo) return ElMessage.warning('商家未上传LOGO')
    isCoverShow.value = true
    dataState.seeData = val
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
