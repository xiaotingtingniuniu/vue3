<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="提现订单号" prop="withNo">
                        <el-input v-model="searchData.withNo" placeholder="请输入banner名称" clearable />
                    </el-form-item>
                    <el-form-item label="批发商商户号" prop="userId">
                        <el-input v-model="searchData.userId" placeholder="请输入banner名称" clearable />
                    </el-form-item>
                    <el-form-item label="收款账号名称" prop="bankAcctName">
                        <el-input v-model="searchData.bankAcctName" placeholder="请输入banner名称" clearable />
                    </el-form-item>
                    <el-form-item label="银行账户类型" prop="bindType">
                        <el-select v-model="searchData.bindType" clearable placeholder="请选择">
                            <el-option label="对公账户" :value="1" />
                            <el-option label="对私账户" :value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核状态" prop="auditStatus">
                        <el-select v-model="searchData.auditStatus" clearable placeholder="请选择">
                            <el-option label="待审核" value="0" />
                            <el-option label="审核拒绝" value="1" />
                            <el-option label="审核通过" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="审核时间" prop="auditTime">
                        <el-date-picker size="default" v-model="searchData.auditTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="完成时间" prop="finishTime">
                        <el-date-picker size="default" v-model="searchData.finishTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <el-form-item label="申请时间" prop="applyTime">
                        <el-date-picker size="default" v-model="searchData.applyTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="onOpenAudit">
                            审核
                        </el-button>
                        <el-button type="primary" @click="onExport">
                            导出
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list ref="tableRef" :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange" @selection-change="tabelChange">
                    <template #initAmount="scope">
                        {{ ((scope.row.initAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #transAmount="scope">
                        {{ ((scope.row.transAmount || 0) / 100).toFixed(2)}}
                    </template>
                    <template #actualAmount="scope">
                        {{ ((scope.row.actualAmount || 0) / 100).toFixed(2)}}
                    </template>
                </system-list>
            </div>
            <el-dialog
                v-model="result.dialogVisible"
                title="审核"
                width="30%"
                :before-close="handleClose"
            >
                <el-form ref="formRef1" :rules="rules" :model="auditForm" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="审核拒绝原因" prop="reason">
                        <el-input v-model="auditForm.reason" type="textarea" placeholder="请输入审核拒绝原因" clearable />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button type="primary" @click="onAudit(2)">同意</el-button>
                        <el-button @click="onAudit(1)">拒绝</el-button>
                    </span>
                </template>
            </el-dialog>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs, watch, computed } from 'vue'
import { publicRequest, publicExport } from '@/api/common/index.js'
import { tHead } from './index'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'

const store = useStore()
console.log(store)
const userInfo = computed(() => store.state.userInfo)
const result = reactive({
    dialogVisible: false
})
const formRef1 = ref()
const searchData = ref({
    withNo: '', // 提现单号
    userId: '', // 批发商ID
    bankAcctName: '', // 收款账户名称
    bindType: '', // 银行账户类型
    auditStatus: '', // 审核状态
    applyTime: [], // 申请时间
    auditTime: [], // 审核时间
    finishTime: [] // 完成时间

})
const auditForm = ref({
    reason: ''
})
const tableData = ref([])
const selectionData = ref([])
const auditList = ref([])

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})

const rules = {
    reason: [
        {
            required: true,
            message: '请输入拒绝原因！',
            trigger: 'change'
        }
    ]

}
const tableRef = ref()

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async () => {
    selectionData.value = []
    const params = {
        ...searchData.value,
        ...pageInfo.value,
        applyStartDate: searchData.value.applyTime.length ? searchData.value.applyTime[0] : '', // 申请时间
        applyEndDate: searchData.value.applyTime.length ? searchData.value.applyTime[1] : '', // 申请时间
        auditStartDate: searchData.value.auditTime.length ? searchData.value.auditTime[0] : '', // 审核时间
        auditEndDate: searchData.value.auditTime.length ? searchData.value.auditTime[1] : '', // 审核时间
        finishStartDate: searchData.value.finishTime.length ? searchData.value.finishTime[0] : '', // 完成时间
        finishEndDate: searchData.value.finishTime.length ? searchData.value.finishTime[1] : '' // 完成时间
    }
    delete params.applyTime
    delete params.auditTime
    delete params.finishTime
    delete params.total
    const res = await publicRequest({ key: 'FINANCE_CORE_WHOLESALER_LIST', body: params })
    if (res.code === '200') {
        tableData.value = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
    console.log(tableRef.value, 'tableRef')
    console.log(res.data.list, 'list')
}

// // 重置
const formRef = ref(null)
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

const tabelChange = (val) => {
    console.log(val, 'tabelChange')
    selectionData.value = val
}
const handleClose = () => {
    auditForm.value.reason = ''
    result.dialogVisible = false
}
const onExport = async () => {
    const params = {
        ...searchData.value,
        ...pageInfo.value,
        applyStartDate: searchData.value.applyTime.length ? searchData.value.applyTime[0] : '', // 申请时间
        applyEndDate: searchData.value.applyTime.length ? searchData.value.applyTime[1] : '', // 申请时间
        auditStartDate: searchData.value.auditTime.length ? searchData.value.auditTime[0] : '', // 审核时间
        auditEndDate: searchData.value.auditTime.length ? searchData.value.auditTime[1] : '', // 审核时间
        finishStartDate: searchData.value.finishTime.length ? searchData.value.finishTime[0] : '', // 完成时间
        finishEndDate: searchData.value.finishTime.length ? searchData.value.finishTime[1] : '' // 完成时间
    }
    delete params.applyTime
    delete params.auditTime
    delete params.finishTime
    delete params.total
    publicExport({ key: 'FINANCE_CORE_WHOLESALER_EXPORT', body: params })
}
const onOpenAudit = () => {
    auditList.value = []
    if (!selectionData.value.length) return ElMessage.warning('请最少选择一条数据！')
    selectionData.value.forEach(el => {
        if (el.auditStatus === 0) {
            auditList.value.push(el.withNo)
        }
    })
    if (!auditList.value.length) return ElMessage.warning('请最少选择一条待审核的数据！')
    result.dialogVisible = true
}
const onAudit = async (status) => {
    const params = {
        withNoList: auditList.value,
        // auditorId: userInfo.value.id,
        auditStatus: status,
        reason: status === 2 ? '' : auditForm.value.reason
    }
    if (status === 1) {
        if (!formRef1.value) return
        await formRef1.value.validate((valid, fields) => {
            if (valid) {
                auditFn(params)
            }
        })
    } else {
        auditFn(params)
    }
}
const auditFn = async (params) => {
    const res = await publicRequest({ key: 'FINANCE_CORE_WHOLESALER_AUDIT', body: params })
    if (res.code === '200') {
        ElMessage.success('操作成功！')
        handleClose()
        getList()
    } else {
        ElMessage.error(res.msg)
    }
}
</script>
<style lang="scss" scoped>

</style>
