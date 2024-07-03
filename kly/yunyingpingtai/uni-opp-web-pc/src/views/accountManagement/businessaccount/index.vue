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
                        <el-form-item label="业务线商家ID" prop="userId">
                            <el-input
                                v-model="searchData.userId"
                                clearable
                                placeholder="请输入～"
                            />
                        </el-form-item>
                        <el-form-item label="渠道" prop="channelType">
                            <el-select
                                v-model="searchData.channelType"
                                clearable
                                placeholder="请选择"
                            >
                                <!-- <el-option label="微信收付通" :value="1" />
                                <el-option label="支付宝" :value="2" /> -->
                                <el-option label="恒丰" :value="3" />
                                <el-option label="微信" :value="4" />
                                <el-option label="小恒钱包" :value="5" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="账户类型" prop="subAcctType">
                            <el-select
                                v-model="searchData.subAcctType"
                                clearable
                                placeholder="请选择"
                            >
                                <el-option label="现金" value="01" />
                                <!-- <el-option label="储值" value="02" />
                                <el-option label="积分" value="03" />
                                <el-option label="三方支付消费账户" value="04" /> -->
                                <el-option label="分销" value="05" />
                                <el-option label="待结算" value="06" />
                                <el-option label="补贴" value="07" />
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
                :tHead="busTHead"
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
                <template #busiType="row">
                    {{busiTypeValue[row.row.busiType]}}
                </template>
                <template #subAcctState="row">
                    {{subAcctStateValue[row.row.subAcctState]}}
                </template>
                <template #channelType="row">
                    {{channelTypeValue[row.row.channelType]}}
                </template>
                <template #subAcctAmount="scope">
                    {{scope.row.subAcctAmount === 0 ? '0.00' : ((scope.row.subAcctAmount/100).toFixed(2))}}
                </template>
                <template #subFrozenAmount="scope">
                    {{scope.row.subFrozenAmount === 0 ? '0.00' : ((scope.row.subFrozenAmount/100).toFixed(2))}}
                </template>
                <template v-if="searchData.subAcctType === '01' || searchData.subAcctType === '07'" #operation="{row}">
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
import { busTHead } from '../tHead'
import { getAccountlList, exportDetails } from '@/api/accountManagement/index'
import SystemList from '@/composables/TablePagination/index.vue'
import { ElMessage } from 'element-plus'
import Detail from './detail.vue'
const formRef = ref()
const recordDirectionKeyValue = ref({ 1: '入账', 2: '出账' })
// 业务类型:1-团长分销,2-货柜主,3-批发商,4-代运营商
const busiTypeValue = ref({ 1: '团长分销', 2: '货柜主', 3: '批发商', 4: '代运营商' })
// 1-可用 0-停用、2-注销、3-冻结
const subAcctStateValue = ref({ 0: '停用', 1: '可用', 2: '注销', 3: '冻结' })
// 1-微信收付通,2-支付宝,3-恒丰,4-微信,5-钱包
const channelTypeValue = ref({ 1: '微信收付通', 2: '支付宝', 3: '恒丰', 4: '微信', 5: '钱包' })
// 01-现金,02-储值,03-积分,04-三方支付消费账户,05-分销,06-待结算,07-补贴
// const busiTypeValue = ref({ 1: '团长分销', 2: '货柜主', 3: '批发商', 4: '代运营商' })
// const busiTypeKeyValue = ['货柜主', '批发商', '代运营商']
const dataState = reactive({
    searchData: {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        userId: '',
        busiType: '',
        subAcctType: '',
        channelType: ''
    },
    dialogVisible: false,
    rowList: {},
    type: '',
    tableData: []
})
const { searchData, tableData, dialogVisible } = toRefs(dataState)
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
    if (param.applyTime) {
        param.startDate = param.applyTime[0] || ''
        param.endDate = param.applyTime[1] || ''
    } else {
        param.startDate = param.startDate ? param.startDate : ''
        param.endDate = param.endDate ? param.endDate : ''
    }
    delete param.applyTime
    const res = await getAccountlList(param)
    if (res.code === '200') {
        tableData.value = res.data.list
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

// 表单校验
const rules = reactive({
    // channelType: [
    //     { required: true, message: '请输入渠道', trigger: 'change' }
    // ],
    subAcctType: [
        { required: true, message: '请输入账户类型', trigger: 'change' }
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
// 去详情
const goDetail = (row, type) => {
    dataState.dialogVisible = true
    dataState.rowList = row
    dataState.type = type
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
