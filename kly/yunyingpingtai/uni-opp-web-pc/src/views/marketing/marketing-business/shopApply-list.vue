<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="150px">
                    <el-form-item label="商户名称" prop="merchantName">
                        <el-input v-model="searchData.merchantName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="店铺名称" prop="storeName">
                        <el-input v-model="searchData.storeName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="店铺状态" prop="storeStatus">
                        <el-select v-model="searchData.storeStatus" clearable placeholder="请选择" >
                            <el-option v-for="(item, key) in storeStatusKeyValue" :key="item" :label="item" :value="key" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label=" ">
                        <el-button type="primary" @click="getList(true)">搜索</el-button>
                        <el-button type="primary" @click="resetForm(formRef)">重置</el-button>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
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
                    <template #storeStatus="row">
                        {{storeStatusKeyValue[row.row.storeStatus]}}
                    </template>
                    <template #operation="scope">
                        <el-button type="primary" @click="coverShow(scope.row)" link>查看LOGO</el-button>
                        <el-button type="primary" @click="goToDetail('edit', scope.row, 'manage')" link>编辑</el-button>
                        <el-button type="primary" @click="goToDetail('check', scope.row, 'manage')" link>查看</el-button>
                        <!-- <el-button type="primary" @click="toApply(scope.row)" link>审核</el-button> -->
                        <el-button type="primary" @click="addLabel(scope.row)" link>标签</el-button>
                        <el-button type="primary" @click="showDialogTable(scope.row)" link>变更记录</el-button>
                        <el-button type="primary" v-if="scope.row.storeStatus === 1" @click="stopHandle(scope.row)" link>停用</el-button>
                        <el-button type="primary" v-else @click="startHandle(scope.row)" link>启用</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <el-dialog v-model="dialogFormVisible" title="" :close-on-click-modal="false" @close="close">
            <el-form label-width="150px" :model="dialogFormData" ref="dialogFormRef" :rules="rules">
                <el-form-item label="添加标签" prop="tagIdList">
                    <el-select v-model="dialogFormData.tagIdList" clearable placeholder="请选择" multiple>
                        <el-option v-for="(item, index) in labelOption" :key="index" :label="item.tagName" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="已有标签">
                    <el-tag
                        v-for="tag in tagList"
                        :key="tag.tagName"
                        class="mx-1"
                        type="info"
                        style="margin-right: 5px"
                    >
                        {{ tag.tagName }}
                    </el-tag>
                </el-form-item>
            </el-form>
            <el-button style="margin-left:20%" @click="submit(dialogFormRef)" type="primary">保存</el-button>
            <el-button @click="close">取消</el-button>
        </el-dialog>
        <el-dialog v-model="isCoverShow" title="查看LOGO" :close-on-press-escape="false">
            <el-form-item label=" ">
                <el-image class="coverImg" :src="seeData.storeLogo" :preview-src-list="[seeData.storeLogo]" :initial-index="4" fit="cover" />
            </el-form-item>
        </el-dialog>
        <el-dialog v-model="dialogTableVisible" title="变更记录">
            <system-list
                :tHead="recordHead"
                :tableData="dialogTableListData"
                v-model:current-page="dialogPageInfo.currentPage"
                v-model:page-size="dialogPageInfo.pageSize"
                :total="dialogPageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #auditStatus="row">
                    {{StatusKeyValue[row.row.auditStatus]}}
                </template>
            </system-list>
        </el-dialog>
        <el-dialog v-model="dialogMerchantleVisible" title="选择商户" :close-on-click-modal="false" @close="closeMer">
            <el-form label-width="150px" :model="merchantData" ref="dialogFormRefMerch" :rules="merRules">
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="merchantData.busiCode" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="认证类型" prop="merchantType">
                    <el-radio-group v-model="merchantData.merchantType">
                        <el-radio :label="2">个人</el-radio>
                        <el-radio :label="3">个体工商户</el-radio>
                        <el-radio :label="1">企业</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="身份证号码" prop="uniqueCode" v-if="merchantData.merchantType && merchantData.merchantType === 2">
                    <el-input v-model="merchantData.uniqueCode" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="uniqueCode" v-if="merchantData.merchantType && merchantData.merchantType !== 2">
                    <el-input v-model="merchantData.uniqueCode" placeholder="请输入" clearable />
                </el-form-item>
            </el-form>
            <el-button style="margin-left:20%" @click="merSubmit(dialogFormRefMerch)" type="primary">确定</el-button>
            <el-button @click="closeMer">取消</el-button>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { shopThead, recordHead } from './shopThead'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getApplyList, shopUpdateLabel, getMerList, getshopDetail, getRecordList, shopCanEdit, startStopStore } from '../../../api/marketing/marketingApply.js'
import { getLabelList, getMerchantList } from '@/api/operate/index'
const store = useStore()
const router = useRouter()
const userInfo = computed(() => store.state.userInfo)
const storeStatusKeyValue = ref({ 0: '停用', 1: '启用', 2: '新建' })
const StatusKeyValue = ref({ 2: '未审核', 3: '通过', 4: '未通过' })
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
    seeData: null,
    labelOption: [],
    dialogFormData: {
        tagIdList: [],
        storeCode: ''
    },
    dialogTableListData: [],
    tagList: [],
    merchantData: {
        busiCode: '',
        merchantType: null,
        uniqueCode: ''
    },
    BusiInfoResVo: []
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const { tableData, searchData, merchantData, BusiInfoResVo, dialogFormData, seeData, refuse, labelOption, dialogTableListData, tagList } = toRefs(dataState)
// watch(() => dataState.dialogFormData.tagIdList,
//     (val) => {
//         dataState.tagList = []
//         dataState.dialogFormData.tagIdList.map((tagId) => {
//             labelOption.value.map(tag => {
//                 if (tagId === tag.id) {
//                     dataState.tagList.push({
//                         id: tag.id,
//                         tagName: tag.tagName
//                     })
//                 }
//             })
//         })
//     },
//     {
//         deep: true
//     })
// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const param = {
        ...searchData.value,
        // auditStatusList: 3,
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
// 获取标签列表数据
const queryLabelList = async () => {
    const params = {
        appKey: 'A1001000',
        page: 1,
        pageSize: 999
    }
    const res = await getLabelList(params)
    labelOption.value = res.data.list
}
queryLabelList()
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    pageInfo.value.currentPage = 1
    getList()
}
const dialogFormVisible = ref(false)
const rules = reactive({
    tagIdList: [{ required: true, message: '请选择', trigger: 'change' }]
})
// 获取详情
const queryDetail = async (storeCode) => {
    dataState.tagList = []
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        storeCode
    }
    const res = await getshopDetail(params)
    dataState.dialogFormData.tagIdList = res.data.tagIdList
    dataState.dialogFormData.tagIdList.map((tagId) => {
        labelOption.value.map(tag => {
            if (tagId === tag.id) {
                dataState.tagList.push({
                    id: tag.id,
                    tagName: tag.tagName
                })
            }
        })
    })
}
// 添加标签
const addLabel = (val) => {
    queryDetail(val.storeCode)
    dialogFormVisible.value = true
    dataState.dialogFormData.storeCode = val.storeCode
}

// 标签名称删除
const removeLabel = async (id) => {
    dataState.dialogFormData.tagIdList = dataState.dialogFormData.tagIdList.filter(item => item !== id)
}
const dialogFormRef = ref(null)
// 表单重置
const resetDialogForm = () => {
    if (!dialogFormRef.value) return
    dialogFormRef.value.resetFields()
}
const submit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                appKey: 'A1001000',
                busiCode: 'A1001000',
                storeCode: dataState.dialogFormData.storeCode,
                tagIdList: dataState.dialogFormData.tagIdList
            }
            const res = await shopUpdateLabel(params)
            if (res.code === '200') {
                ElMessage.success(res.message)
                close()
            }
        }
    })
}
const close = () => {
    dialogFormVisible.value = false
    resetDialogForm()
    getList()
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
// 查看变更记录
const dialogPageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const dialogTableVisible = ref(false)

const showDialogTable = (val) => {
    dialogTableVisible.value = true
    queryRecordList(val)
}
const queryRecordList = async (val) => {
    dialogPageInfo.value.currentPage = 1
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        storeCode: val.storeCode,
        storeName: val.storeName,
        page: dialogPageInfo.value.currentPage,
        pageSize: dialogPageInfo.value.pageSize
    }
    const res = await getRecordList(param)
    if (res.code === '200') {
        res.data.list.map(item => {
            item.auditTime = item.auditTime ? item.auditTime.replace('T', ' ') : ''
            item.gmtCreate = item.gmtCreate ? item.gmtCreate.replace('T', ' ') : ''
        })
        dataState.dialogTableListData = res.data.list
        dialogPageInfo.value.total = res.data.total
    }
}
// 查询店铺是否可编辑
const queryCanEdit = async (handleType, info, type) => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001001',
        storeCode: info.storeCode
    }
    const res = await shopCanEdit(param)
    if (res.code === '200') {
        console.log(res)
        if (res.data) {
            router.push({ name: 'shop-detail', params: { handleType, type, storeCode: info && info.storeCode, busiMerchantId: info && info.busiMerchantId } })
        } else {
            ElMessage.warning('该店铺存在待审核申请，请完成后操作')
        }
    }
}
// 查看 编辑
const goToDetail = async (handleType, info, type) => {
    if (handleType === 'edit') {
        queryCanEdit(handleType, info, type)
        // ElMessage.warning('该店铺存在待审核申请，请完成后操作')
        // return
    } else {
        router.push({ name: 'shop-detail', params: { handleType, type, storeCode: info && info.storeCode, busiMerchantId: info && info.busiMerchantId } })
    }
}

const dialogMerchantleVisible = ref(false)
const merRules = reactive({
    busiCode: [{ required: true, message: '请选择', trigger: 'change' }],
    merchantType: [{ required: true, message: '请选择', trigger: 'change' }],
    uniqueCode: [{ required: true, message: '请输入', trigger: 'change' }]
})
// 查询业务线
const businesspList = async () => {
    const param = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001001',
            busiCode: 'A1001001',
            roleType: 1
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657884654291RUuhQ',
        name: '查询业务线列表',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(param)
    dataState.BusiInfoResVo = res
}
businesspList()
// 新增
const handleAdd = () => {
    dialogMerchantleVisible.value = true
}
const dialogFormRefMerch = ref()
const merSubmit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                appKey: 'A1001000',
                busiCode: dataState.merchantData.busiCode,
                merchantType: dataState.merchantData.merchantType,
                uniqueCode: dataState.merchantData.uniqueCode
            }
            const res = await getMerList(params)
            if (res.code === '200') {
                if (res.data.list.length === 0) {
                    ElMessage.success('该业务线商户尚未入驻，请完成后新增店铺')
                } else {
                    if (res.data.list[0].busiMerchantStatus === 4) {
                        router.push({ name: 'shop-detail', params: { handleType: 'add', type: 'manage', busiMerchantId: res.data.list[0].busiMerchantId } })
                    } else {
                        ElMessage.success('该业务线商户未审核通过')
                    }
                }
            }
        }
    })
}
// 表单重置
const resetDialogFormMer = () => {
    if (!dialogFormRefMerch.value) return
    dialogFormRefMerch.value.resetFields()
}
const closeMer = () => {
    dialogMerchantleVisible.value = false
    resetDialogFormMer()
    getList()
}

// 停用/启用
const startHandle = (row) => {
    const params = {
        appKey: 'A1001000',
        storeStatus: 1,
        storeCode: row.storeCode
    }
    if (row.auditStatus === 3) {
        ElMessageBox.confirm(
            '确认启用当前数据？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }
        )
            .then(async () => {
                await startStopStore(params)
                ElMessage.success('成功')
                getList()
            })
    } else {
        ElMessage.warning('该店铺尚未通过审核，请完成后操作')
    }
}
// 停用/启用
const stopHandle = (row) => {
    const params = {
        appKey: 'A1001000',
        storeStatus: 0,
        storeCode: row.storeCode
    }
    ElMessageBox.confirm(
        '确认停用当前数据？',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await startStopStore(params)
            ElMessage.success('成功')
            getList()
        })
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
