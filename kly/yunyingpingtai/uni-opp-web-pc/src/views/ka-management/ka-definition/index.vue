<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="KA级别" prop="kaLevel">
                    <el-input v-model="searchData.kaLevel" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="searchData.busiCode" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="角色" label-width="80px" prop="roleCode" v-if="searchData.busiCode">
                    <el-select v-model="searchData.roleCode" clearable placeholder="请选择" >
                        <el-option v-for="el in rolelist" :label="el.roleName" :value="el.roleCode" :key="el.roleCode" />
                    </el-select>
                </el-form-item> -->
                <el-form-item class="button-box">
                    <el-button type="primary" @click="addMerchant('add')">
                        新增
                    </el-button>
                    <!-- <el-button type="primary" @click="addMerchant('add')">
                        新增经营范围
                    </el-button> -->
                    <el-button type="primary" @click="searchCoupon()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
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
                <template #operation="scope">
                    <div>
                        <el-button text type="primary"  @click="toDelate(scope.row)">
                            删除
                        </el-button>
                        <el-button text type="primary" @click="toEdit(scope.row, 'edit')" >
                            编辑
                        </el-button>
                    </div>
                </template>
            </system-list>
        </div>

        <!-- 新增/编辑 -->
        <el-dialog v-model="dialogFormVisible" :title="handleType ==='add'?'新增':'编辑'" :before-close="handleClose" >
            <el-form :model="applyForm" label-width="80px" ref="ruleFormRef" :rules="rules">
                <el-form-item label="业务线"  prop="busiCode">
                    <el-select v-model="applyForm.busiCode" clearable placeholder="请选择"   disabled>
                        <!-- <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" /> -->
                        <el-option label="智能货柜" value="A1001002" />
                    </el-select>
                </el-form-item>
                <el-form-item label="KA级别" prop="kaLevel">
                    <el-input
                        v-model="applyForm.kaLevel"
                        type="text"
                        placeholder="请输入级别名称"
                    />
                </el-form-item>
                <el-form-item label="达成条件"  prop="conditionCode">
                    <el-select v-model="applyForm.conditionCode" clearable placeholder="请选择">
                        <el-option label="购买设备数量" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="最大值" label-width="80px" prop="max" v-if="applyForm.conditionCode === 1">
                    <el-input v-model="applyForm.max"   type="text" style="width:250px">
                        <template #append>台</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最小值" label-width="80px" prop="min" v-if="applyForm.conditionCode === 1">
                    <el-input v-model="applyForm.min"   type="text" style="width:250px" >
                        <template #append>台</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="apply(ruleFormRef)"
                    >确定</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { regAccountC } from '@/utils/rule.js'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const tHead = [
    { align: 'center', tooltip: true, prop: 'busiName', label: '业务线', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'kaLevel', label: 'KA级别', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'conditionName', label: '达成条件', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '更新时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 150, slot: true }

]
const tableData = ref([])
const dataState = reactive({
    searchData: {
        kaName: '',
        phoneMobile: '',
        busiMerchantStatus: '',
        mobile: '',
        custAppealType: '',
        busiCode: '',
        roleCode: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        busiCode: 'A1001002',
        kaLevel: '',
        conditionCode: '',
        max: '',
        min: ''
    },
    BusiInfoResVo: [],
    rolelist: [],
    dialogFormVisible: false,
    auditRecord: false,
    addTips: false,
    tags: [],
    addTagIdSet: [],
    removeTagIdSet: []

})
const { searchData, pageinfo, BusiInfoResVo, dialogFormVisible, addTips, tags, applyForm } = toRefs(dataState)

onMounted(async () => {
    await businesspList()
    await getRefundList()
    sessionStorage.removeItem('personBusiness')
    sessionStorage.removeItem('businessLine')
    sessionStorage.removeItem('submitApply')
})
const ruleFormRef = ref('')
// 数字+字母
const validAccount = (rule, value, callback) => {
    if (value === '') { return callback(new Error('请输入汉字或字母或数字或三种组合～')) }
    if (!regAccountC(value)) return callback(new Error('请输入汉字或字母或数字或三种组合～'))
    callback()
}
// 数值校验
const maxN = (rule, value, callback) => {
    if (value && (value < 0 || Number(value) === 0)) { return callback(new Error('请输入大于0的数值')) }
    callback()
}
const minN = (rule, value, callback) => {
    if (value && (value < 0 || Number(value) === 0)) { return callback(new Error('请输入大于0的数值')) }
    if (value && (value > dataState.applyForm.max)) { return callback(new Error('不得大于最大值')) }
    callback()
}
const rules = reactive({
    kaLevel: [{ required: true, validator: validAccount, trigger: 'blur' },
        { min: 1, max: 40, message: '不得超过40字符', trigger: 'blur' }],
    max: [{ validator: maxN, trigger: 'blur' }],
    min: [{ validator: minN, trigger: 'blur' }]
})
// 新增
const handleType = ref(null)
const rowId = ref(null)
const addMerchant = (type) => {
    dataState.applyForm = {
        busiCode: 'A1001002'
    }
    dataState.dialogFormVisible = true
    handleType.value = type
}

const toEdit = async(row, type) => {
    dataState.dialogFormVisible = true
    handleType.value = type
    rowId.value = row.id
    await getDetail()
}

// 详情
const getDetail = async() => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            id: rowId.value
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC73091394364317696',
        name: 'ka定义详情接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        Object.assign(dataState.applyForm, res.data)
    }
}
// 新增/编辑保存
const apply = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                body: {
                    appKey: 'A1001000',
                    busiCode: 'A1001002',
                    creatorId: userInfo.value.account,
                    creatorName: userInfo.value.name,
                    ...dataState.applyForm,
                    max: dataState.applyForm.max ? Number(dataState.applyForm.max) : '',
                    min: dataState.applyForm.min ? Number(dataState.applyForm.min) : ''

                },
                appKey: 'A1001000',
                busiCode: 'A1001002',
                source: '商户中台',
                creatorId: userInfo.value.account,
                creatorName: userInfo.value.name
            }
            if (handleType.value === 'add') {
                params.configCode = 'UC73090187704999936'
                params.name = 'ka定义添加接口'
            }
            if (handleType.value === 'edit') {
                params.body.id = rowId.value
                // params.configCode = 'UC73090362343235584'
                params.configCode = 'UCJH75599185452736512'
                params.name = 'ka定义更新接口'
            }
            await getMerchantList(params)
            ElMessage({
                message: '成功',
                type: 'success'
            })
            dataState.dialogFormVisible = false
            await getRefundList()
        }
    })
}

// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            ...dataState.searchData,
            page: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC73090534066429952',
        name: 'ka定义分页查询接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
}

const toDelate = async(row) => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            id: row.id,
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        // configCode: 'UC73091180459008000',
        configCode: 'UCJH75617008883343360',
        name: 'ka定义删除接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        '确定删除吗？',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async() => {
            const res = await getMerchantListCode(params)
            if (res.code === '200') {
                ElMessage({
                    type: 'success',
                    message: res.message
                })
                await getRefundList()
            } else if (res.code === '049005') {
                ElMessage({
                    type: 'warning',
                    message: '有商户正在使用，不支持删除'
                })
            }
        })
        .catch(() => {

        })
}
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

// 业务线查询
const cahngeBusi = async (val) => {
    dataState.searchData.roleCode = ''
    if (val) {
        await getrolelist(val)
    }
}
// 查询角色
const getrolelist = async (val) => {
    const param = {
        body: {
            businessCode: val,
            appKey: 'A1001001',
            busiCode: 'A1001001'
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        configCode: 'UC1657597210662FSEfM',
        name: '业务线角色级联查询',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name

    }
    const res = await getMerchantList(param)
    dataState.rolelist = res.map(item => {
        return {
            roleName: item.roleName,
            roleCode: item.roleCode
        }
    })
}
const handleClose = () => {
    dataState.dialogFormVisible = false
    ruleFormRef.value.resetFields()
    getRefundList()
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getRefundList()
}

// 查询
const searchCoupon = () => {
    dataState.pageinfo.page = 1
    getRefundList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.page = val
    getRefundList()
}
const sizeChange = (val) => {
    dataState.pageinfo.page = 1
    dataState.pageinfo.pageSize = val
    getRefundList()
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
 .el-table__body{
     .el-button{
         margin-left: 0 !important;
     }
 }
</style>
