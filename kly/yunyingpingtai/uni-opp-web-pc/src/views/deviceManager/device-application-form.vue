<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="auto">
                    <el-form-item label="申请人" prop="applicantName" >
                        <el-input v-model.trim="searchData.applicantName" placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="申请时间" prop="applyBeginTime">
                        <el-date-picker v-model="searchData.applyBeginTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"  placeholder="开始时间" :editable="false"/>
                    </el-form-item>
                    <el-form-item label="审批状态" prop="approvalStates">
                        <el-select v-model="searchData.approvalState" clearable placeholder="请选择">
                            <el-option label="待审核" value="0" />
                            <el-option label="已通过" value="1" />
                            <el-option label="已拒绝" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审批人" prop="approverId">
                        <el-input v-model.trim="searchData.approverId" placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="申请单号" prop="applicationId">
                        <el-input v-model.trim="searchData.applicationId" placeholder="请输入"/>
                    </el-form-item>
                    <el-form-item label="审批时间" prop="approvalStartTime" class="form-item-time">
                        <el-date-picker v-model="searchData.approvalStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss"  placeholder="开始时间" :editable="false"/>
                    </el-form-item>
                    <el-form-item label="设备型号" prop="modelCode">
                        <el-input v-model.trim="searchData.modelCode" placeholder="请输入"/>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <!-- <el-button type="primary" @click="newForm(formRef)">
                            新增
                        </el-button> -->
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" border :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #outerOrderNo="{row}">
                        <div class="info">
                            <div >状态: <span :style="row.approvalState === 0 ? 'color:#ccc' : row.approvalState === 1 ? 'color:green' : 'color:red'">{{ row.approvalState === 0 ? '待审批' : row.approvalState === 1 ? '已通过' : '已拒绝'  }}</span></div>
                            <div>操作人:{{ row.applicantName }}</div>
                            <div>操作时间:{{ row.approvalTime }}</div>
                            <div>审批备注:{{ row.applyReason }}</div>
                        </div>
                    </template>
                    <template #operation="scope">
                        <template v-if="scope.row.approvalState === 0">
                            <el-button @click="handleAudit(scope.row, 1)" type="primary" link style="color:darkseagreen">通过</el-button>
                            <el-button @click="handleAudit(scope.row, 2)" type="primary" link>拒绝</el-button>
                        </template>
                        <template v-if="scope.row.approvalState === 1">
                            <el-button @click="onDownQr(scope.row.packetUrl)" type="primary" link style="color:dodgerblue">下载二维码</el-button>
                        </template>
                        <template v-if="scope.row.approvalState === 2">
                            <span> - </span>
                        </template>
                    </template>
                </system-list>
            </div>
            <cst-form v-model='visible' v-if="visible"  :row="dataState.row" @getList='getList'></cst-form>
            <el-drawer v-model="auditVisible" direction="rtl">
                <el-form ref="formRefs" :model="ruleForm">
                    <el-form-item label="审批备注" :rules="rule" props="text">
                        <el-input
                            v-model.trim="ruleForm.text"
                            type="textarea"
                            :rows="8"
                            show-word-limit
                            resize='none'
                            placeholder="请您输入通过备注或者拒绝理由..."
                            maxlength="200"
                        />
                    </el-form-item>
                </el-form>
                <template #title>
                    <h4>设备审核</h4>
                </template>
                <template #footer>
                    <div style="flex: auto">
                        <el-button type="primary" v-if="auditType === 2" @click="handleClick(formRefs)">拒绝</el-button>
                        <el-button type="primary" v-if="auditType === 1" @click="handleClick(formRefs)">通过</el-button>
                    </div>
                </template>
            </el-drawer>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { devicetList, keyCode } from '@/api/deviceManager'
import CstForm from './src/qrCode.vue'

const tHead = [
    { align: 'center', prop: 'applicationId', label: '申请单号', minWidth: 150, fixed: 'left' },
    { align: 'center', prop: 'applicantName', label: '申请人', width: 80, fixed: 'left' },
    { align: 'center', prop: 'applyQty', label: '申请数量' },
    { align: 'center', prop: 'modelCode', label: '设备型号', minWidth: 120 },
    { align: 'center', prop: 'applyReason', label: '申请原因', minWidth: 150 },
    { align: 'center', prop: 'applyTime', label: '申请时间', minWidth: 150 },
    { align: 'center', prop: 'outerOrderNo', label: '审批信息', minWidth: 250, slot: true },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, slot: true }
]
const dataState = reactive({
    tableData: [],
    resourceCode: null,
    currentVal: null,
    searchData: {
        applicationId: '', // 申请编号
        applicantName: '', // 提交人编号
        applicantId: '', // 提交人编号
        applyBeginTime: '', // 提交时间开始
        applyEndTime: '', // 提交时间结束
        approvalState: '', // 审批状态
        approverId: '', // 审批人编号
        approvalStartTime: '', // 审批时间开始
        approvalEndTime: '', // 审批时间结束
        modelCode: '' // 设备型号
    }
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const visible = ref(false)
const auditVisible = ref(false)
const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})
const { tableData, searchData, currentVal } = toRefs(dataState)

onMounted(async () => {
    console.log('初始化', visible.value)
    await getList()
})
// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.page = 1)
    const val = {
        name: '二维码申请单分页查询',
        configCode: 'UC17559287518584832',
        source: '设备中台'
    }
    const params = {
        ...searchData.value,
        ...keyCode,
        approvalStates: [searchData.approvalState],
        pageNo: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        dataState.tableData = res.data.records
        pageInfo.value.total = res.data.totalSize
    }
}

// 重置
const formRef = ref(null)
const formRefs = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}

// 通过 拒绝
const auditType = ref()
const handleAudit = (row, type) => {
    auditVisible.value = true
    auditType.value = type
    dataState.row = row
}

// 点击通过 拒绝 发起请求
const handleClick = async (formEl) => {
    console.log(formEl)
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onSubmit()
        }
    })
}

// 设备通过拒绝 审核提交
const onSubmit = async () => {
    const params = {
        ...keyCode,
        applicationId: Number(dataState.row.applicationId), // 申请编号
        approvalState: Number(auditType.value), // 审批状态
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name,
        approverText: ruleForm.text
    }
    const val = {
        name: '审批设备绑定申请',
        configCode: 'UC18279444667559936',
        source: '设备中台'
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        auditVisible.value = false
        getList()
        ElMessage({
            message: '审核成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '审核失败',
            type: 'error'
        })
    }
}

const ruleForm = reactive({
    text: ''
})

const rule = reactive({
    text: [{ required: true, message: '审批备注内容不能为空', trigger: 'change' }]
})

// 下载二维码
const onDownQr = (value) => {
    window.open(value)
}

// 新增表单
const newForm = (row) => {
    dataState.row = row
    dataState.currentVal = row
    visible.value = true
}
</script>
<style lang="scss" scoped>
.role-page{
    .el-table tr{
        height: 50px;
    }
    .el-select{
        :deep(.el-select__tags-text){
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 280px;
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
        .aaa{
            width:90%
        }
        .numberV{
            position: absolute;
            left: 262px;
            bottom: 18px;
            font-size: 12px;
            color:#ccc
        }
    }
    .info{
        text-align: left;
    }
}
</style>
