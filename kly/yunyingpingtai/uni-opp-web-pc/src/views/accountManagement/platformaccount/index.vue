<template>
    <div class="work-order-container">
        <div class="search-area">
            <el-card>
                <el-form
                    ref="formRef"
                    :model="searchData"
                    :rules="rules"
                    label-width="100px"
                    :inline="true"
                >
                    <div class="search-input">
                        <el-form-item label="平台商户ID" prop="mainUserId">
                            <el-input
                                v-model="searchData.mainUserId"
                                clearable
                                placeholder="请输入～"
                            />
                        </el-form-item>
                        <el-form-item label="账户类型" prop="acctType">
                            <el-select
                                v-model="searchData.acctType"
                                clearable
                                placeholder="请选择"
                            >
                                <el-option label="现金" value="01" />
                                <el-option label="充值" value="02" />
                                <!-- <el-option label="积分" value="03" />
                                <el-option label="三方支付消费账户" value="04" /> -->
                                <!-- <el-option label="分销" value="05" /> -->
                                <el-option label="待结算" value="06" />
                                <!-- <el-option label="补贴" value="07" /> -->
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm(formRef)">查询</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-card>
        </div>
        <el-card class="cardBox">
            <system-list
                :tHead="platTHead"
                :tableData="tableData"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #recordDirection="row">
                    {{recordDirectionKeyValue[row.row.recordDirection]}}
                </template>
                <template #transAmount="scope">
                    {{scope.row.transAmount === 0 ? 0 : ((scope.row.transAmount/100).toFixed(2))}}
                </template>
                <template #frozenAmount="scope">
                    {{scope.row.frozenAmount === 0 ? 0 : ((scope.row.frozenAmount/100).toFixed(2))}}
                </template>
                <template #resultAmount="scope">
                    {{scope.row.resultAmount === 0 ? 0 : ((scope.row.resultAmount/100).toFixed(2))}}
                </template>
                <!-- <template #operation="row">
                    <el-button  class="edit-btn" @click="goDetail(row)" type="primary">冻结</el-button>
                    <el-button  class="edit-btn" @click="goDetail(row, 'unfreeze')" type="primary">解冻</el-button>
                </template> -->
            </system-list>
        </el-card>
        <el-card class="cardBox">
            <div>渠道信息</div>
            <system-list
                :tHead="channelTHead"
                :tableData="walletList"
                v-model:current-page="pageInfo.currentPage"
                v-model:page-size="pageInfo.pageSize"
                :total="pageInfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #recordDirection="row">
                    {{recordDirectionKeyValue[row.row.recordDirection]}}
                </template>
                <template #cashAmount="scope">
                    {{scope.row.cashAmount === 0 ? '0.00' : ((scope.row.cashAmount/100).toFixed(2))}}
                </template>
                <template #settlementAmount="scope">
                    {{scope.row.settlementAmount === 0 ? '0.00' : ((scope.row.settlementAmount/100).toFixed(2))}}
                </template>
                <template #frozenAmount="scope">
                    {{scope.row.frozenAmount === 0 ? '0.00' : ((scope.row.frozenAmount/100).toFixed(2))}}
                </template>
                <template #operation="row">
                    <el-button  class="edit-btn" @click="goDetail(row)" type="primary">冻结</el-button>
                    <el-button  class="edit-btn" @click="goDetail(row, 'unfreeze')" type="primary">解冻</el-button>
                </template>
            </system-list>
        </el-card>
        <Detail v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :rowList = "rowList" :type="type" @fevent="getList()"></Detail>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref } from 'vue'
import { platTHead, channelTHead } from '../tHead'
import { plataccountList, exportDetails } from '@/api/accountManagement/index'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import Detail from '../accountSelect/index.vue'
const formRef = ref()
const recordDirectionKeyValue = ref({ 1: '入账', 2: '出账' })
// const busiTypeKeyValue = ['货柜主', '批发商', '代运营商']
const dataState = reactive({
    searchData: {
        mainUserId: '',
        acctType: ''
    },
    dialogVisible: false,
    rowList: {},
    type: '',
    tableData: [],
    walletList: []
})
const { searchData, tableData, walletList, dialogVisible } = toRefs(dataState)
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const open = () => {
    ElMessage({
        showClose: true,
        message: '请选择查询条件',
        type: 'warning'
    })
}
const getList = async () => {
    const param = {
        ...searchData.value,
        page: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    // if (param.applyTime) {
    //     param.startDate = param.applyTime[0] || ''
    //     param.endDate = param.applyTime[1] || ''
    // } else {
    //     param.startDate = param.startDate ? param.startDate : ''
    //     param.endDate = param.endDate ? param.endDate : ''
    // }
    // delete param.applyTime
    const res = await plataccountList(param)
    if (res.code === '200') {
        tableData.value = res.data.accountList
        walletList.value = res.data.walletAccountList
        pageInfo.value.total = res.data.totalCount
    }
}
const submitForm = async (formEl) => {
    pageInfo.value.currentPage = 1
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('11111', formEl)
            getList()
        }
    })
}
// 去详情
const goDetail = (row, type) => {
    dataState.dialogVisible = true
    dataState.rowList = row
    dataState.type = type
}
// 表单校验
const rules = reactive({
    // acctType: [
    //     { required: true, message: '请输入账户类型', trigger: 'change' }
    // ],
    mainUserId: [
        { required: true, message: '请输入平台商户ID', trigger: 'change' }
    ]
})
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getList()
}
// 下一页上一页触发
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getList()
}
</script>
<style lang="scss" scoped>
.tableList-area{
    margin-top:20px;
}
.cardBox{
    margin-top:20px;
}
.search-input {
//   display: flex;
//   justify-content: space-between;
//   .el-input {
//     width: 260px;
//   }
//   .el-select {
//     width: 260px;
//   }
}
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
</style>
