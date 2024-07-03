<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="商户名称" prop="merchantName">
                    <el-input v-model="searchData.merchantName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="用户手机号" prop="phoneMobile">
                    <el-input v-model="searchData.phoneMobile" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="业务线" label-width="80px" prop="busiCode">
                    <el-select v-model="searchData.busiCode" clearable placeholder="请选择" @change="cahngeBusi">
                        <el-option v-for="el in BusiInfoResVo" :label="el.busiName" :value="el.busiCode" :key="el.busiCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="角色" label-width="80px" prop="roleCode" v-if="searchData.busiCode">
                    <el-select v-model="searchData.roleCode" clearable placeholder="请选择">
                        <el-option v-for="el in rolelist" :label="el.roleName" :value="el.roleCode" :key="el.roleCode" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否KA" label-width="80px" prop="kaType">
                    <el-select v-model="searchData.kaType" clearable placeholder="请选择"  @change="cahngeBusi">
                        <el-option label="否" value="0" />
                        <el-option label="是" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态" prop="busiMerchantStatus">
                    <el-select v-model="searchData.busiMerchantStatus" clearable placeholder="请选择">
                        <el-option label="草稿" value="1" />
                        <el-option label="待审批" value="2" />
                        <el-option label="审批驳回" value="3" />
                        <el-option label="通过" value="4" />
                        <el-option label="待进件" value="6" />
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
                    <el-button type="primary" @click="addMerchant('add')"> 新增 </el-button>
                    <!-- <el-button type="primary" @click="addMerchant('add')">
                        新增经营范围
                    </el-button> -->
                    <el-button type="primary" @click="searchCoupon()"> 查询 </el-button>
                    <el-button type="primary" @click="resetForm(formRef)"> 重置 </el-button>
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
                <template #merchantType="scope">
                    <span v-if="scope.row.merchantType === 1">企业</span>
                    <span v-if="scope.row.merchantType === 2">自然人</span>
                    <span v-if="scope.row.merchantType === 3">个人工商户</span>
                    <span v-if="scope.row.merchantType === 4">事业单位</span>
                </template>

                <template #bussiname="scope">
                    <span>{{ scope.row.busiName }}/{{ scope.row.roleName }}</span>
                </template>
                <template #gmtCreate="scope">
                    <span>{{ scope.row.gmtCreate ? scope.row.gmtCreate.replace('T', ' ') : scope.row.gmtCreate }}</span>
                </template>

                <template #merchantSource="scope">
                    <span v-if="scope.row.merchantSource === 1">平台入驻</span>
                    <span v-if="scope.row.merchantSource === 2">商户添加</span>
                    <span v-if="scope.row.merchantSource === 3">后台添加</span>
                </template>
                <template #busiMerchantStatus="scope">
                    <span v-if="scope.row.busiMerchantStatus === 1">草稿</span>
                    <span v-if="scope.row.busiMerchantStatus === 2">待审批</span>
                    <span v-if="scope.row.busiMerchantStatus === 3">审批驳回</span>
                    <span v-if="scope.row.busiMerchantStatus === 4">通过</span>
                    <span v-if="scope.row.busiMerchantStatus === 6">待进件</span>
                </template>
                <template #operation="scope">
                    <div>
                        <el-button text type="primary" v-if="scope.row.isConfirm === 0" @click="toDetail(scope.row, 'confirm')"> 确认 </el-button>
                        <el-button text type="primary" @click="toDetail(scope.row, 'detailnew')"> 查看 </el-button>
                        <el-button text type="primary" @click="toEdit(scope.row, 'edit')" v-if="scope.row.busiMerchantStatus === 4"> 编辑 </el-button>
                    </div>
                    <div>
                        <!-- eip接入 1215期不上
                        <el-button text type="primary" @click="toApply(scope.row.busiMerchantId)"  v-if="scope.row.busiMerchantStatus ===1 || scope.row.busiMerchantStatus === 2">
                            审核
                        </el-button>
                        <el-button disabled text type="info" class="" v-if="scope.row.busiMerchantStatus ===4">
                            审核
                        </el-button> -->
                        <el-button disabled text type="info"> 审核 </el-button>
                        <el-button text type="primary" @click="toApplyRecode(scope.row.busiMerchantId)"> 审核记录 </el-button>
                        <el-button text type="primary" @click="toApplyAddTips(scope.row.busiMerchantId)"> 标签 </el-button>
                    </div>
                </template>
            </system-list>
        </div>

        <!-- 审核弹窗 -->
        <el-dialog v-model="dialogFormVisible" title="审核">
            <el-form :model="applyForm">
                <el-form-item label="" label-width="100px" prop="merchUserType">
                    <el-radio-group v-model="applyForm.merchantStatus">
                        <el-radio :label="4">通过</el-radio>
                        <el-radio :label="3">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="驳回原因" label-width="100px" v-if="applyForm.merchantStatus === 3">
                    <el-input v-model="applyForm.rejectReason" :rows="2" type="textarea" placeholder="请输入驳回原因～" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="apply">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 审核记录弹窗 -->
        <el-dialog v-model="auditRecord" title="审核记录" :show-close="false" center width="70%">
            <system-list
                :tHead="tHeadAuditRecord"
                :tableData="tableDataAuditRecord"
                v-model:current-page="auditRecordPageinfo.page"
                v-model:page-size="auditRecordPageinfo.pageSize"
                :total="auditRecordPageinfo.total"
                @size-change="sizeChangeAuditRecord"
                @current-change="currentChangeAuditRecord"
            >
                <template #applyType="scope">
                    <span>{{ dataState.reCodeApplyType[scope.row.applyType] }}</span>
                </template>
                <template #auditStatus="scope">
                    <span>{{ dataState.reCodeApplyStatus[scope.row.auditStatus] }}</span>
                </template>
                <template #auditRe="scope">
                    <span>{{ dataState.reCodeApplyStatus[scope.row.auditStatus] }}</span>
                </template>
            </system-list>
            <template #footer>
                <el-button type="primary" @click="auditRecord = false"> 关闭 </el-button>
            </template>
        </el-dialog>
        <!-- 添加标签 -->
        <el-dialog v-model="addTips" center>
            <el-form :rules="tipsRules" ref="tagFormRef">
                <el-form-item label="添加标签：" prop="addTagIdSet">
                    <el-select v-model="dataState.addTagIdSet" multiple placeholder="请选择标签">
                        <el-option v-for="item in dataState.addTipsOptions" :key="item.tagName" :label="item.tagName" :value="item.tagId"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="已有标签：">
                    <el-row>
                        <el-tag v-for="tag in tags" :key="tag.name" closable :disable-transitions="false" @close="removeTag(tag)" type="info">
                            {{ tag.tagName }}
                        </el-tag>
                    </el-row>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="addTips = false">取 消</el-button>
                    <el-button type="primary" @click="confirmTag">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getMerchantList } from '@/api/operate/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { unifiedGatewayPost, unifiedGatewayGet } from '../../../api/marketing/marketingApply.js'
import { useStore } from 'vuex'

const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogDetail = ref(false)
const tagFormRef = ref(false)
const radio = ref(3)
const tHead = [
    { align: 'center', tooltip: true, prop: 'merchantName', label: '商户名称', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'bussiname', label: '业务线及角色', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'busiMerchantId', label: '业务线商户ID', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'kaTypeName', label: '是否KA', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'merchantType', label: '商户类型', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'merchantSourceName', label: '入驻来源', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '联系方式', minWidth: 130 },
    // { align: 'center', tooltip: true, prop: 'workStatus', label: '邮箱', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'busiMerchantStatus', label: '审核状态', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'custAppealType', label: '签约状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'creatorId', label: '创建人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 400, slot: true }
]
const tHeadAuditRecord = [
    { align: 'center', tooltip: true, prop: 'applyType', label: '申请类型', minWidth: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'submitName', label: '申请人', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'submitAuditTime', label: '提交时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditOrder', label: '审核节点', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'auditorPost', label: '审核人岗位', minWidth: 130 },
    { align: 'center', tooltip: true, prop: 'auditorName', label: '审核人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'auditStatus', label: '审核状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'auditRe', label: '审核结果', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'auditTime', label: '审核时间', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'auditRemark', label: '驳回原因', minWidth: 180 }
]
const tableData = ref([])
const tableDataAuditRecord = ref([])
const dataState = reactive({
    searchData: {
        merchantName: '',
        phoneMobile: '',
        busiMerchantStatus: '',
        mobile: '',
        custAppealType: '',
        busiCode: '',
        roleCode: '',
        kaType: ''
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
        merchantStatus: '',
        rejectReason: ''
    },
    BusiInfoResVo: [],
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
const { searchData, pageinfo, auditRecordPageinfo, BusiInfoResVo, rolelist, dialogFormVisible, auditRecord, addTips, tags, addTipsOpt, applyForm } = toRefs(dataState)
const tipsRules = {
    addTagIdSet: { required: true, message: '标签不能为空', trigger: ['blur'] }
}
onMounted(async () => {
    await businesspList()
    await getRefundList()
    sessionStorage.removeItem('personBusiness')
    sessionStorage.removeItem('businessLine')
    sessionStorage.removeItem('submitApply')
})
const orderNo = ref('')
// 新增
const addMerchant = (handleType) => {
    router.push({ name: 'settle-apply', params: { handleType } })
}
const toDetail = (row, handleType) => {
    sessionStorage.removeItem('addMerchant')
    sessionStorage.setItem('addMerchant', JSON.stringify(row))
    router.push({ name: 'settle-apply-person', params: { busiMerchantId: row.busiMerchantId, handleType } })
}
const toEdit = (row, handleType) => {
    sessionStorage.removeItem('addMerchant')
    sessionStorage.setItem('addMerchant', JSON.stringify(row))
    router.push({ name: 'edit-merchant-settle', params: { busiMerchantId: row.busiMerchantId, handleType } })
}

const busiId = ref('')
const toApply = (busiMerchantId) => {
    dataState.dialogFormVisible = true
    busiId.value = busiMerchantId
}
// 审核记录弹窗
const toApplyRecode = async (busiMerchantId) => {
    busiId.value = busiMerchantId
    await toApplyRecodeList(busiMerchantId)
    dataState.auditRecord = true
}
// 获取审核列表
const toApplyRecodeList = async () => {
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53420097247547392',
        name: '商户审核记录',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            busiMerchantId: busiId.value,
            page: dataState.auditRecordPageinfo.page,
            pageSize: dataState.auditRecordPageinfo.pageSize
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res) {
        tableDataAuditRecord.value = res.data.list
        dataState.auditRecordPageinfo.total = res.data.total
    }
}
// 添加标签
const TipsbusiM = ref('')
const toApplyAddTips = async (busiMerchantId) => {
    TipsbusiM.value = busiMerchantId
    // 获取已有标签
    const hasTagParam = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC54209970321412096',
        name: '商户标签查询接口',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            busiMerchantId: busiMerchantId
        }
    }
    const hasTag = await unifiedGatewayPost(hasTagParam)
    dataState.tags = hasTag.data
    // 获取可添加标签
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53425392661204992',
        name: '商户还可添加标签',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            busiMerchantId: busiMerchantId
        }
    }
    const res = await unifiedGatewayPost(param)
    dataState.addTipsOptions = res.data
    dataState.addTips = true
}
// 删除标签
const removeTag = async (tag) => {
    dataState.tags.splice(dataState.tags.indexOf(tag), 1)
    dataState.removeTagIdSet.push(tag.tagId)
}
// 标签确认
const confirmTag = async (tagID) => {
    // tagFormRef.value.validate(async (valid) => {
    // if (valid) {
    const tagList = JSON.parse(JSON.stringify(dataState.addTagIdSet))
    dataState.tags.map((item) => {
        tagList.push(item.tagId)
    })
    const param = {
        appKey: 'A1001002', // 系统编号
        busiCode: 'A1001002', // 业务线编号
        configCode: 'UC53425572059975680',
        name: '商户添加或删除标签',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            busiMerchantId: TipsbusiM.value,
            addTagIdSet: dataState.addTagIdSet,
            removeTagIdSet: dataState.removeTagIdSet,
            modifierId: userInfo.value.name
        }
    }
    const res = await unifiedGatewayPost(param)
    dataState.addTips = false
    dataState.addTagIdSet = []
    dataState.removeTagIdSet = []
    // }
    // })
}
const apply = async () => {
    const params = {
        body: {
            businessCode: 'A1001001',
            appKey: 'A1001000',
            busiCode: 'A1001001',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            busiMerchantId: busiId.value,
            ...dataState.applyForm
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC16575962382396uskn',
        name: '修改业务线商户的审核状态',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    await getMerchantList(params)
    ElMessage({
        message: '审核成功',
        type: 'success'
    })
    dataState.dialogFormVisible = false
    await getRefundList()
}
// 列表数据
const getRefundList = async () => {
    const params = {
        body: {
            ...dataState.searchData,
            page: dataState.pageinfo.page,
            pageSize: dataState.pageinfo.pageSize,
            appKey: 'A1001000',
            sceneCode: '1',
            functionCode: 'functionCode',
            creatorId: userInfo.value.account,
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UCJH46233596175048704',
        name: '获取商户信息列表聚合',
        source: '运营后台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    tableData.value = data.list
    dataState.pageinfo.total = data.total
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
    dataState.rolelist = res.map((item) => {
        return {
            roleName: item.roleName,
            roleCode: item.roleCode
        }
    })
}

// 重置
const formRef = ref(null)
const resetForm = (formEl) => {
    if (!formEl) return
    formEl.resetFields()
}
// 申请记录查询
// 查询
const searchAuditRecord = () => {
    dataState.auditRecordPageinfo.page = 1
    toApplyRecodeList()
}

// 当前页数改变
const currentChangeAuditRecord = (val) => {
    dataState.auditRecordPageinfo.page = val
    toApplyRecodeList()
}
const sizeChangeAuditRecord = (val) => {
    dataState.auditRecordPageinfo.page = 1
    dataState.auditRecordPageinfo.pageSize = val
    toApplyRecodeList()
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
.coupon-submit-box {
    .dialog-title {
        font-size: 20px;
        color: red;
        font-weight: 700;
    }
    .header-title {
        font-size: 20px;
        color: red;
        height: 50px;
        font-weight: 700;
        align-items: center;
    }
}
.el-table__body {
    .el-button {
        margin-left: 0 !important;
    }
}
</style>
