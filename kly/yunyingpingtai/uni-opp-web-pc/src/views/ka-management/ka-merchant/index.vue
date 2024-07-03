<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
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
                <el-form-item label="对接方式" label-width="80px" prop="joinMode">
                    <el-select v-model="searchData.joinMode" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option label="全部" value="" />
                        <el-option label="平台Saas" value="1" />
                        <el-option label="小程序定制" value="2" />
                        <el-option label="API对接" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="searchData.status" clearable placeholder="请选择" >
                        <el-option label="启用" value="1" />
                        <el-option label="停用" value="2" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="签约状态" prop="workType">
                    <el-select v-model="searchData.workType" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="退款" value="0" />
                        <el-option label="补款" value="1" />
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
                <template #busiCode="scope">
                    <span v-if="scope.row.busiCode === 'A1001002'">智能货柜</span>
                </template>

                <template #payMode="scope">
                    <span v-if="scope.row.payMode === 1">积分</span>
                </template>
                <template #status="scope">
                    <span v-if="scope.row.status === 1">启用</span>
                    <span v-if="scope.row.status === 2">停用</span>
                </template>
                <template #openDoorMap="scope">
                    <span>{{(Object.values(scope.row.openDoorMap)).toString()}}</span>
                </template>
                <template #operation="scope">
                    <div>
                        <!-- <el-button text type="primary" v-if="scope.row.isConfirm===0" @click="toDetail(scope.row, 'confirm')">
                            确认
                        </el-button> -->
                        <el-button text type="primary" @click="stop(scope.row)" v-if="scope.row.status === 1">
                            停用
                        </el-button>
                        <el-button text type="primary" @click="toEdit(scope.row, 'edit')" v-if="scope.row.status === 1">
                            编辑
                        </el-button>
                    </div>
                    <!--  -->
                </template>
            </system-list>
        </div>

        <!-- 审核弹窗 -->
        <el-dialog v-model="dialogFormVisible" :title="handleType ==='add'?'新增':'编辑'" :before-close="handleClose" >
            <el-form :model="applyForm" label-width="120px" ref="ruleFormRef" :rules="rules">
                <el-form-item label="业务线"  prop="busiCode">
                    <el-select v-model="applyForm.busiCode" clearable placeholder="请选择"   disabled>
                        <!-- <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" /> -->
                        <el-option label="智能货柜" value="A1001002" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商户ID" prop="busiMerchantId" >
                    <el-input v-model="applyForm.busiMerchantId" placeholder="请输入～" clearable :disabled="handleType === 'edit'"/>
                </el-form-item>
                <el-form-item label="KA商户简称" prop="merchantSimpleName"  >
                    <el-input v-model="applyForm.merchantSimpleName" placeholder="请输入～" clearable maxlength="20" :disabled="handleType === 'edit'"/>
                </el-form-item>
                <el-form-item label="KA级别" prop="kaDefinitionId">
                    <el-select v-model="applyForm.kaDefinitionId" clearable placeholder="请选择">
                        <el-option v-for="el in KaInfoResVo" :label="el.kaLevel" :value="el.id" :key="el.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="对接方式" prop="joinMode">
                    <el-select v-model="applyForm.joinMode" clearable placeholder="请选择" >
                        <el-option label="平台Saas" :value="1" />
                        <el-option label="小程序定制" :value="2" />
                        <el-option label="API对接" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="APPID(小程序ID)"  prop="appId">
                    <el-input
                        v-model="applyForm.appId"
                        type="text"
                        placeholder="请输入～"
                        maxlength="50"
                    />
                </el-form-item>
                <el-form-item label="小程序地址URL" prop="appUrl" >
                    <el-input
                        v-model="applyForm.appUrl"
                        type="text"
                        placeholder="请输入～"
                        maxlength="255"
                    />
                </el-form-item>
                <!-- <el-form-item label="开门方式" >
                    <el-input
                        v-model="applyForm.rejectReason"
                        type="text"
                        placeholder="请输入～"
                    />
                </el-form-item> -->
                <el-form-item label="支付渠道" prop="payChannel">
                    <el-select v-model="applyForm.payChannel" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option label="企业支付" :value="1" />
                        <el-option label="个人支付" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式" prop="payMode">
                    <el-select v-model="applyForm.payMode" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option label="积分" :value="1" />
                    </el-select>
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

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'busiCode', label: '业务线', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'busiMerchantId', label: '业务线商户ID', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantSimpleName', label: 'KA商户简称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'kaLevel', label: 'KA级别', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'joinModeName', label: '对接方式', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'appId', label: 'APPID(小程序ID)', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'appUrl', label: '小程序地址URL', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'openDoorMap', label: '开门方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'payChannelName', label: '支付渠道', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'payMode', label: '支付方式', minWidth: 130, slot: true },
    { align: 'center', tooltip: true, prop: 'convertRate', label: '当前兑换比例', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '更新时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 200, slot: true }

]

const tableData = ref([])
const dataState = reactive({
    searchData: {
        merchantName: '',
        phoneMobile: '',
        busiMerchantStatus: '',
        mobile: '',
        custAppealType: '',
        busiCode: '',
        joinMode: '',
        status: ''
    },
    pageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    auditRecordPageinfo: {
        total: 0,
        page: 1,
        pageSize: 10
    },
    applyForm: {
        busiCode: 'A1001002',
        busiMerchantId: '',
        merchantSimpleName: '',
        kaDefinitionId: '',
        joinMode: 1,
        appId: '',
        appUrl: '',
        payChannel: '',
        payMode: ''
    },
    BusiInfoResVo: [],
    KaInfoResVo: [],
    rolelist: [],
    dialogFormVisible: false,
    auditRecord: false,
    addTips: false,
    tags: [],
    addTagIdSet: [],
    removeTagIdSet: [],
    addTipsOptions: [],
    reCodeApplyType: { 1: '入驻申请', 2: '信息变更' },
    reCodeApplyStatus: { 1: '待审核', 2: '审核通过', 3: '审核不通过' }

})
const { searchData, pageinfo, BusiInfoResVo, dialogFormVisible, applyForm, KaInfoResVo } = toRefs(dataState)

const ruleFormRef = ref('')
// 校验
const rules = reactive({
    busiMerchantId: [{ required: true, message: '请输入～', trigger: 'change' }],
    merchantSimpleName: [{ required: true, message: '请输入～', trigger: 'change' },
        { min: 1, max: 20, message: '不得超过20字符', trigger: 'change' }],
    kaDefinitionId: [{ required: true, message: '请输入～', trigger: 'change' }],
    joinMode: [{ required: true, message: '请选择～', trigger: 'change' }]
})
onMounted(async () => {
    await businesspList()
    await getRefundList()
    await getKAlist()
    sessionStorage.removeItem('personBusiness')
    sessionStorage.removeItem('businessLine')
    sessionStorage.removeItem('submitApply')
})
// 新增
const handleType = ref('')
const rowId = ref('')
const addMerchant = (type) => {
    dataState.applyForm = {
        busiCode: 'A1001002',
        joinMode: 1
    }
    dataState.dialogFormVisible = true
    handleType.value = type
}

const toEdit = async(row, type) => {
    dataState.dialogFormVisible = true
    handleType.value = type
    rowId.value = row.id
    await getDetail(row.id)
}

const getDetail = async(row) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            id: row

        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC73093326688559104',
        name: '根据id获取ka商家详情接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        Object.assign(dataState.applyForm, res.data)
        dataState.applyForm.joinMode = res.data.joinMode ? Number(res.data.joinMode) : ''
    }
}

// 新增/编辑
const apply = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                body: {
                    appKey: 'A1001000',
                    busiCode: 'A1001002',
                    creatorId: userInfo.value.account,
                    modifierId: userInfo.value.account,
                    operatorId: userInfo.value.account,
                    creatorName: userInfo.value.name,
                    ...dataState.applyForm
                },
                appKey: 'A1001000',
                busiCode: 'A1001002',
                source: '商户中台',
                modifierId: userInfo.value.account,
                operatorId: userInfo.value.account,
                creatorName: userInfo.value.name
            }
            if (handleType.value === 'add') {
                params.configCode = 'UC73092884504059904'
                params.name = 'ka商户添加接口'
            }
            if (handleType.value === 'edit') {
                params.body.id = rowId.value
                // params.configCode = 'UC73091645804453888'
                params.configCode = 'UCJH75617327457509376'
                params.name = 'ka商户更新接口'
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
            joinMode: dataState.searchData.joinMode,
            page: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC73091789329342464',
        name: 'ka商户分页查询接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
}

// 查询KA级别
const getKAlist = async () => {
    const params = {
        body: {
            page: 1,
            pageSize: 99999,
            appKey: 'A1001000',
            busiCode: 'A1001002'
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC73090534066429952',
        name: 'ka定义分页查询接口',
        source: '商户中台'
    }
    const data = await getMerchantList(params)
    dataState.KaInfoResVo = data.list
}

// 停用
const stop = async(row) => {
    const params = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            id: row.id,
            status: row.status,
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        // configCode: 'UC73092667968921600',
        configCode: 'UCJH75618000047710208',
        name: 'ka商家停用接口',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        '操作停用后不支持在启用，确定停用吗？',
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

// // 业务线查询
// const cahngeBusi = async (val) => {
//     dataState.searchData.roleCode = ''
//     if (val) {
//         await getrolelist(val)
//     }
// }
// // 查询角色
// const getrolelist = async (val) => {
//     const param = {
//         body: {
//             businessCode: val,
//             appKey: 'A1001001',
//             busiCode: 'A1001001'
//         },
//         appKey: 'A1001001',
//         busiCode: 'A1001001',
//         sceneCode: '1',
//         functionCode: 'functionCode',
//         configCode: 'UC1657597210662FSEfM',
//         name: '业务线角色级联查询',
//         source: '商户中台',
//         modifierId: userInfo.value.account,
//         operatorId: userInfo.value.account,
//         operatorName: userInfo.value.name

//     }
//     const res = await getMerchantList(param)
//     dataState.rolelist = res.map(item => {
//         return {
//             roleName: item.roleName,
//             roleCode: item.roleCode
//         }
//     })
// }

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
