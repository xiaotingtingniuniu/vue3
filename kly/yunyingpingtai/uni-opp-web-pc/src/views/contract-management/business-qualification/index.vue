<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="经营资质名称" prop="qualificationName">
                    <el-input v-model="searchData.qualificationName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="searchData.busiCode" clearable placeholder="请选择" >
                        <el-option v-for="(item, index) in busiCodeOption" :key="index" :label="item.buisName" :value="item.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否必填" label-width="80px" prop="isMust">
                    <el-select v-model="searchData.isMust" clearable placeholder="请选择" >
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="reload()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                    <el-button type="primary" @click="showDialog('add')">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.page"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #isMust="row">
                    {{isMustValue[row.row.isMust]}}
                </template>
                <template #operation="scope">
                    <el-button text type="primary" @click="showDialog('check', scope.row.id)">
                        查看
                    </el-button>
                    <el-button text type="primary" @click="showDialog('edit', scope.row.id)">
                        编辑
                    </el-button>
                    <el-button text type="primary" @click="delRow(scope.row.id)">
                        删除
                    </el-button>
                </template>
            </system-list>
        </div>
        <el-dialog v-model="dialogFormVisible" :title="dialogTitleValue[dataState.dialogType]" :close-on-click-modal="false" @close="hideDialog">
            <el-form :model="dialogFormData" label-width="120px" :rules="rules" ref="dialogFormRef">
                <el-form-item label="业务线" prop="busiCode">
                    <el-select
                        v-model="dialogFormData.busiCode"
                        clearable placeholder="请选择"
                        :disabled="dataState.dialogType === 'check'"
                        style="width: 100%"
                        @change="busiCodeChange"
                    >
                        <el-option v-for="(item, index) in busiCodeOption" :key="index" :label="item.buisName" :value="item.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="经营资质名称" prop="qualificationName">
                    <el-input
                        v-model="dialogFormData.qualificationName"
                        placeholder="请输入"
                        clearable
                        :disabled="dataState.dialogType === 'check'"
                        style="width: 100%"
                    />
                </el-form-item>
                <el-form-item label="商户类型" prop="mchtType">
                    <el-select v-model="dialogFormData.mchtType" clearable placeholder="请选择" style="width: 100%" multiple :disabled="dataState.dialogType === 'check'">
                        <el-option v-for="(item, index) in mchtTypeOption" :key="index" :label="item.merchantClassifyName" :value="item.merchantClassify" />
                    </el-select>
                </el-form-item>
                <el-form-item label="经营类目" prop="cateCode">
                    <el-cascader
                        ref="goodsClassifyRef"
                        :props="goodsClassifyPropsList"
                        @change="goodsClassifyChange"
                        v-model="dialogFormData.goodsClassifyChecked"
                        v-if="dialogFormData.goodsClassifyRefVisiable"
                        width="100%"
                        clearable
                        :disabled="dataState.dialogType === 'check'"
                        style="width: 100%"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="是否必传" prop="isMust">
                    <el-select v-model="dialogFormData.isMust" clearable placeholder="请选择" style="width: 100%" :disabled="dataState.dialogType === 'check'">
                        <el-option label="是" value="1" />
                        <el-option label="否" value="0" />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button style="margin-left:20%" @click="dialogSubmit(dialogFormRef)" v-if="dataState.dialogType !== 'check'" type="primary">确认</el-button>
            <el-button @click="hideDialog">取消</el-button>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getBusiQualist, addBusiQua, getBusiQuaDetail, updateBusiQua, delBusiQua, getMchtTypeList } from '@/api/contract/index'
import { getAllBusiCode } from '@/api/operate/index'
import { getBusiCate } from '@/api/marketing/active'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useStore } from 'vuex'
const isMustValue = ref({ 1: '是', 0: '否' })
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const radio = ref(3)
const tHead = [
    // { align: 'center', tooltip: true, type: 'index', label: '序号', width: 80 },
    { align: 'center', tooltip: true, prop: 'busiName', label: '业务线', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'qualificationName', label: '经营资质名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'isMust', label: '是否必传', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 100 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, slot: true }
]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        contactName: '',
        contactPhone: '',
        cityName: '',
        wishType: '',
        submitTime: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        merchantStatus: '',
        rejectReason: ''
    },
    BusiInfoResVo: [],
    rolelist: [],
    dialogType: '',
    dialogFormVisible: false,
    dialogFormData: {
        busiCode: '',
        qualificationName: '',
        mchtType: [],
        isMust: '',
        businessCates: [],
        businessCateJson: [],
        goodsClassifyChecked: [], // 商品分类选中
        goodsClassifyCheckedNodes: [], // 商品分类选中
        goodsClassifyRefVisiable: false // 商品分类纬度级联下拉框
    },
    rowId: ''
})
const { searchData, pageinfo, BusiInfoResVo, rolelist, dialogFormVisible, applyForm, dialogFormData } = toRefs(dataState)

onMounted(async () => {
    await queryList()
    await queryAllBusicode()
})
const busiCodeOption = ref([])
const mchtTypeOption = ref([])
// 获取全部业务线
const queryAllBusicode = async () => {
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000'
    }
    const res = await getAllBusiCode(params)
    busiCodeOption.value = res.data
}

// 获取商户类型
const queryMchtType = async (busiCode) => {
    const params = {
        appKey: 'A1001000',
        busiCode
    }
    const res = await getMchtTypeList(params)
    mchtTypeOption.value = res.data
}
// 列表数据
const queryList = async () => {
    const params = {
        appKey: 'A1001000',
        ...dataState.searchData,
        page: dataState.pageinfo.page,
        pageSize: dataState.pageinfo.pageSize
    }
    if (params.submitTime) {
        params.startTime = params.submitTime[0] || ''
        params.endTime = params.submitTime[1] || ''
    } else {
        params.startTime = params.startTime ? params.startTime : ''
        params.endTime = params.endTime ? params.endTime : ''
    }
    delete params.submitTime
    const res = await getBusiQualist(params)
    tableData.value = res.data.list
    dataState.pageinfo.total = res.data.total
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    queryList()
}

// 查询
const reload = () => {
    dataState.pageinfo.page = 1
    queryList()
}

// // 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    queryList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    queryList()
}
const dialogTitleValue = ref({ add: '新增', edit: '编辑', check: '查看' })
// const dialogTitle = (type) => {
//     return dialogTitleValue[type]
// }
// 新增/编辑
const showDialog = (type, id) => {
    dataState.dialogType = type
    dataState.rowId = id
    dataState.dialogFormVisible = true
    if (type === 'edit' || type === 'check') {
        queryDetail()
    }
}
const hideDialog = () => {
    dataState.dialogFormVisible = false
    resetDialogForm()
}
const dialogFormRef = ref()
const rules = reactive({
    busiCode: [{ required: true, message: '请选择', trigger: 'change' }],
    qualificationName: [{ required: true, message: '请选择', trigger: 'change' }],
    isMust: [{ required: true, message: '请选择', trigger: 'change' }]
})

// 经营类目
const goodsClassifyPropsList = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const params = {
            appKey: 'A1001001',
            busiCode: dataState.dialogFormData.busiCode === 'A1001001' ? 'A1001004' : dataState.dialogFormData.busiCode,
            sceneCode: '1',
            functionCode: 'functionCode',
            configCode: 'UCJH58514960206876672',
            name: '应用类目层级查询聚合',
            source: '运营后台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            body: {
                appKey: 'A1001001',
                busiCode: dataState.dialogFormData.busiCode === 'A1001001' ? 'A1001004' : dataState.dialogFormData.busiCode,
                cateCode: data.value || '',
                level: level + 1
            }
        }
        const res = await getBusiCate(params)
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 2
            }
        })
        resolve(nodes)
    }
}
const goodsClassifyRef = ref(null)
// 应用类目change
const goodsClassifyChange = (value) => {
    dataState.dialogFormData.goodsClassifyCheckedNodes = goodsClassifyRef.value.getCheckedNodes(true)
    dataState.dialogFormData.businessCateJson = []
    dataState.dialogFormData.businessCates = []
    dataState.dialogFormData.goodsClassifyCheckedNodes.forEach((item) => {
        dataState.dialogFormData.businessCates.push(item.pathValues[2])
        dataState.dialogFormData.businessCateJson.push({
            firstCategoryId: item.pathValues[0],
            secondCategoryId: item.pathValues[1],
            threeCategoryId: item.pathValues[2]
        })
    })
}
// 获取详情
const queryDetail = async () => {
    dataState.dialogFormData.goodsClassifyRefVisiable = false
    const params = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        id: dataState.rowId
    }
    const res = await getBusiQuaDetail(params)
    dataState.dialogFormData.goodsClassifyChecked = []
    dataState.dialogFormData.busiCode = res.data.busiCode
    dataState.dialogFormData.qualificationName = res.data.qualificationName
    dataState.dialogFormData.businessCateJson = JSON.parse(res.data.businessCateJson) ?? []
    dataState.dialogFormData.businessCates = res.data.businessCates.split(',')
    const mchtType = res.data.mchtType === '' ? [] : res.data.mchtType.split(',')
    mchtType.map(item => {
        dataState.dialogFormData.mchtType.push(Number(item))
    })
    dataState.dialogFormData.isMust = res.data.isMust.toString()
    dataState.dialogFormData.businessCateJson.forEach(item => {
        const cascaderInfo = [item.firstCategoryId, item.secondCategoryId, item.threeCategoryId]
        dataState.dialogFormData.goodsClassifyChecked.push(cascaderInfo)
    })
    setTimeout(() => {
        dataState.dialogFormData.goodsClassifyRefVisiable = true
        dataState.dialogFormData.goodsClassifyCheckedNodes = goodsClassifyRef.value.getCheckedNodes(true)
    }, 100)
    queryMchtType(dataState.dialogFormData.busiCode)
}
// 获取经营类目
const busiCodeChange = () => {
    mchtTypeOption.value = []
    dataState.dialogFormData.mchtType = []
    dataState.dialogFormData.goodsClassifyRefVisiable = false
    setTimeout(() => {
        dataState.dialogFormData.goodsClassifyRefVisiable = true
        dataState.dialogFormData.goodsClassifyCheckedNodes = []
    }, 100)
    queryMchtType(dataState.dialogFormData.busiCode)
}
// 删除
const delRow = (id) => {
    ElMessageBox.confirm(
        '确定删除当前数据吗？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    ).then(async () => {
        const params = {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            modifierId: userInfo.value.account,
            id
        }
        const res = await delBusiQua(params)
        if (res.code === '200') {
            ElMessage.success(res.message)
            reload()
        }
    })
}
// 表单重置
const resetDialogForm = () => {
    if (!dialogFormRef.value) return
    dialogFormRef.value.resetFields()
    dataState.dialogFormData.goodsClassifyChecked = []
    dataState.dialogFormData.goodsClassifyRefVisiable = false
    mchtTypeOption.value = []
    dataState.dialogFormData.mchtType = []
}
// 提交
const dialogSubmit = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        console.log(valid)
        if (valid) {
            if (dataState.dialogType === 'add') {
                const params = {
                    busiCode: dataState.dialogFormData.busiCode,
                    qualificationName: dataState.dialogFormData.qualificationName,
                    businessCates: dataState.dialogFormData.businessCates.join(),
                    businessCateJson: JSON.stringify(dataState.dialogFormData.businessCateJson),
                    mchtType: dataState.dialogFormData.mchtType.join(),
                    isMust: dataState.dialogFormData.isMust,
                    creatorId: userInfo.value.account
                }
                const res = await addBusiQua(params)
                console.log(res)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    hideDialog()
                    reload()
                    resetDialogForm()
                }
            } else if (dataState.dialogType === 'edit') {
                const params = {
                    id: dataState.rowId,
                    busiCode: dataState.dialogFormData.busiCode,
                    qualificationName: dataState.dialogFormData.qualificationName,
                    businessCates: dataState.dialogFormData.businessCates.join(),
                    businessCateJson: JSON.stringify(dataState.dialogFormData.businessCateJson),
                    mchtType: dataState.dialogFormData.mchtType.join(),
                    isMust: dataState.dialogFormData.isMust,
                    modifierId: userInfo.value.account
                }
                const res = await updateBusiQua(params)
                if (res.code === '200') {
                    ElMessage.success(res.message)
                    hideDialog()
                    reload()
                    resetDialogForm()
                }
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
