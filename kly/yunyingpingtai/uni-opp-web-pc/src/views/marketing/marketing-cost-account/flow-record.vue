<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="发生时间" prop="regTime" class="form-item-time">
                        <el-date-picker
                            v-model="searchData.regTime"
                            type="datetimerange"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                        />
                    </el-form-item>
                    <el-form-item label="账户编号" prop="acctId">
                        <el-input v-model="searchData.acctId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="账户名称" prop="acctName">
                        <el-input v-model="searchData.acctName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="营销工具编号" prop="sourceCode">
                        <el-input v-model="searchData.sourceCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="交易单据单号" prop="billsCode">
                        <el-input v-model="searchData.billsCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="金额类型" prop="amountType">
                        <el-select v-model="searchData.amountType" clearable placeholder="请选择" >
                            <el-option label="剩余余额" value="1" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">
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
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #detailType="scope">
                        <span v-if="scope.row.detailType === 1">充值</span>
                        <span v-if="scope.row.detailType === 2">扣除</span>
                        <span v-if="scope.row.detailType === 3">冻结</span>
                        <span v-if="scope.row.detailType === 4">解冻</span>
                        <span v-if="scope.row.detailType === 5">退还未过期</span>
                        <span v-if="scope.row.detailType === 6">退还已过期</span>
                    </template>
                    <template #amountType="amountType">
                        <span v-if="amountType.row.amountType === 1">剩余余额</span>
                    </template>
                    <template #sourceType="sourceType">
                        <span v-if="sourceType.row.sourceType === 1">优惠券</span>
                        <span v-if="sourceType.row.sourceType === 2">活动</span>
                        <span v-if="sourceType.row.sourceType === 3">资源位</span>
                        <span v-if="sourceType.row.sourceType === 4">广告投放</span>
                    </template>
                    <template #attachUrl="attachUrl">
                        <el-button type="text" v-if="attachUrl.row.attachUrl" @click='frontDownload(attachUrl.row.attachUrl)'>附件1</el-button>
                        <span v-else>——</span>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, onMounted, toRefs } from 'vue'
import { getDetailList } from '@/api/marketing/marketing-cost'
import moment from 'moment'

const currentTime = moment(new Date()).format('YYYY-MM-DD 00:00:00')
const startTime = moment(currentTime).subtract(3, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss')
const dataState = reactive({
    regTypeKeyValue: {
        1: '手机注册',
        2: '邮箱注册',
        3: '账户',
        4: '微信注册',
        5: '支付宝注册',
        6: 'qq注册'
    },
    userStatusKeyValue: {
        1: '正常',
        2: '已注销',
        3: '已拉黑'
    },
    tableData: [],
    searchData: {
        regTime: [startTime, currentTime],
        beginDate: '',
        endDate: '',
        acctId: '',
        acctName: '',
        sourceCode: '',
        billsCode: '',
        amountType: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
})
const { tableData, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getList()
})
// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }

    param.beginDate = new Date(param.regTime[0]).getTime() || ''
    param.endDate = new Date(param.regTime[1]).getTime() || ''
    delete param.regTime
    const res = await getDetailList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
    }
}
// 查询
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}
// 下载附件
const frontDownload = async (url) => {
    const urlName = url.substr(url.lastIndexOf('/') + 1)
    const a = document.createElement('a')
    a.href = url
    a.download = urlName
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    a.remove()
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'detailDate', label: '发生时间', width: 180 },
    { align: 'center', tooltip: true, prop: 'acctId', label: '账户编号', width: 250 },
    { align: 'center', tooltip: true, prop: 'acctName', label: '账户名称', width: 250 },
    { align: 'center', tooltip: true, prop: 'detailType', label: '发生动作', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'amountType', label: '金额类型', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'beginAmount', label: '期初值', width: 120 },
    { align: 'center', tooltip: true, prop: 'endAmount', label: '期末值', width: 130 },
    { align: 'center', tooltip: true, prop: 'changeAmount', label: '变化数量', width: 150 },
    { align: 'center', tooltip: true, prop: 'sourceType', label: '来源系统', width: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'sourceCode', label: '活动（批次）编号', width: 200 },
    { align: 'center', tooltip: true, prop: 'billsCode', label: ' 交易单据单号', width: 200, minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'attachUrl', label: '附件', width: 160, slot: true },
    { align: 'center', tooltip: true, prop: 'detailExplain', label: '发生动作', width: 160 }
]
// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList({ ...searchData.value })
}
// 当前也改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getList({ ...searchData.value })
}
</script>
<style lang="scss" scoped>
.register-user-list-page{
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    width: 535px;
                    :deep(.el-date-editor){
                        flex: 1;
                    }
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
    }
}
</style>
