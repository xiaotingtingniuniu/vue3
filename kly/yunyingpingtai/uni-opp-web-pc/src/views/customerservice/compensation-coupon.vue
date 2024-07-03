<template>
    <div class="compensation-coupon">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="券批次编号" prop="groupCode">
                        <el-input v-model.trim="searchData.groupCode" placeholder="请输入" clearable  />
                    </el-form-item>
                    <!-- <el-form-item label="券批次名称" prop="batchName">
                        <el-input v-model="searchData.batchName" placeholder="请输入" clearable/>
                    </el-form-item>
                    <el-form-item label="优惠类型" prop="couponType">
                        <el-select v-model="searchData.couponType" clearable placeholder="请选择">
                            <el-option label="立减" value="1" />
                            <el-option label="满减" value="2" />
                            <el-option label="折扣" value="3" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList">
                            搜索
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

                    <template #orgCode="scope">
                        <span v-if="scope.row.orgCode === 'A1001'">A1001-恒生活</span>
                        <span v-if="scope.row.orgCode === 'A1002'">A1002-小恒数科</span>
                        <span v-if="scope.row.orgCode === 'A1003'">A1003-汇财</span>
                        <span v-if="scope.row.orgCode === 'A1004'">A1004-保险</span>
                    </template>
                    <template #subCode="scope">
                        <span v-if="scope.row.subCode === 'A1001001'">A1001001-恒生活App</span>
                        <span v-if="scope.row.subCode === 'A1001002'">A1001002-智能货柜</span>
                        <span v-if="scope.row.subCode === 'A1001003'">A1001003-恒生活众包</span>
                        <span v-if="scope.row.subCode === 'A1001004'">A1001004-恒掌柜</span>
                        <span v-if="scope.row.subCode === 'A1001005'">A1001005-供应链</span>
                        <span v-if="scope.row.subCode === 'A1001006'">A1001006-交付</span>
                    </template>
                    <template #batchStatus="scope">
                        <span v-if="scope.row.groupStatus === 1">草稿</span>
                        <span v-if="scope.row.groupStatus === 2">待审批</span>
                        <span v-if="scope.row.groupStatus === 3">审批驳回</span>
                        <span v-if="scope.row.groupStatus === 4">待开始</span>
                        <span v-if="scope.row.groupStatus === 5">在线</span>
                        <span v-if="scope.row.groupStatus === 6">已停止</span>
                        <span v-if="scope.row.groupStatus === 7">已结束</span>
                    </template>
                    <template #couponType="row">
                        {{couponTypeKeyValue[row.row.couponType]}}
                    </template>
                    <template #userRangeType="row">
                        {{userRangeTypeKeyValue[row.row.userRangeType]}}
                    </template>
                    <template #applyCountlist="row">
                        {{row.row.applyCount }}/{{row.row.assignCount}}/{{row.row.usedCount}}
                    </template>
                    <template #button="row">
                        <el-button type="text" @click="gosendCoupon(row.row)">发放优惠券</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <send-coupon v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :rowList = "rowList" @fevent="getList()"></send-coupon>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed } from 'vue'
import sendCoupon from './dialog/send-coupon-from.vue'
import { getCouponList } from '@/api/marketing/coupon'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()

const dataState = reactive({
    couponTypeKeyValue: {
        1: '立减',
        2: '满减',
        3: '折扣'
    },
    userRangeTypeKeyValue: {
        1: '全部用户',
        2: '新用户',
        3: '会员'
    },
    tableData: [],
    searchData: {
        groupCode: '',
        batchName: '',
        groupStatus: 5,
        couponType: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },

    handleBatchCode: '', // 当前操作项编码
    handleAuditId: '', // 当前操作项审批id
    handleSubCode: '' // 当前操作项subCode
})
const dialogVisible = ref(false)
const rowList = ref({})
const { tableData, searchData, pageinfo, couponTypeKeyValue, userRangeTypeKeyValue } = toRefs(dataState)

const urlPrefix = process.env.VUE_APP_QRCODE_PREFIX
// const tableHeight = ref(null)
// tableHeight.value = document.body.clientHeight - 166
// window.onresize = function () {
//     // 减去导航条60和底部翻页36的高度
//     tableHeight.value = document.body.clientHeight - 166
// }
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        orgCode: 'A1001001',
        operatorId: userInfo.value.account,
        pageNum: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        queryType: 1
    }
    delete param.isValidTime
    delete param.gmtCreateTime
    const res = await getCouponList(param)
    if (res.code === '200') {
        console.log(res, 'reesss1')
        if (searchData.value.groupCode !== '') {
            if (res.data) {
                dataState.tableData = res.data.map(item => {
                    item.qrcodeVisible = false
                    return item
                })
            } else {
                dataState.tableData = []
            }
        } else {
            dataState.tableData = []
        }
        dataState.pageinfo.total = res.count
    }
}
getList()

const gosendCoupon = (row) => {
    dialogVisible.value = true
    rowList.value = row
}
// 搜索查询列表
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 新增批次优惠券
const goCouponHandle = async (handleType, info) => {
    router.push({ name: 'coupon-batch-handle', params: { handleType, batchCode: info && info.batchCode, subCode: info && info.subCode, auditId: info && info.auditId } })
}

// 券详情
const couponInfo = async (info) => {
    router.push({ name: 'coupon-batch-config', query: { batchCode: info && info.batchCode, subCode: info && info.subCode } })
}
const tHead = [
    { align: 'center', fixed: true, tooltip: true, prop: 'groupCode', label: '券批次编号', minWidth: 110 },
    { align: 'center', fixed: true, tooltip: true, prop: 'groupName', label: '券批次名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'applier', label: '申请人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'batchStatus', label: '状态', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'orgCode', label: '业务线', minWidth: 70, slot: true },
    { align: 'center', tooltip: true, prop: 'subCode', label: '子系统', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'couponType', label: '优惠类型', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'userRangeType', label: '用户范围', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'applyCountlist', label: '申请/领用/使用数量', minWidth: 150, slot: true },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 150, slot: true }
]
// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList({ ...searchData.value })
}

// 当前页改变
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
