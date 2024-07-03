<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="券批次编号" prop="groupCode">
                        <el-input v-model="searchData.groupCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="券批次名称" prop="groupName">
                        <el-input v-model="searchData.groupName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="申请人" prop="applier">
                        <el-input v-model="searchData.applier" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="状态" prop="groupStatus">
                        <el-select v-model="searchData.groupStatus" clearable placeholder="请选择" >
                            <el-option label="草稿" value="1" />
                            <el-option label="待审批" value="2" />
                            <el-option label="审批驳回" value="3" />
                            <el-option label="待开始" value="4" />
                            <el-option label="在线" value="5" />
                            <el-option label="已停止" value="6" />
                            <el-option label="已结束" value="7" />
                        </el-select>
                    </el-form-item>
                    <!-- <el-form-item label="优惠类型" prop="couponType">
                        <el-select v-model="searchData.couponType" clearable placeholder="请选择">
                            <el-option label="立减" value="1" />
                            <el-option label="满减" value="2" />
                            <el-option label="折扣" value="3" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="组织" prop="orgCode">
                        <el-select v-model="searchData.orgCode" clearable placeholder="请选择">
                            <el-option label="恒生活" value="A1001" />
                            <el-option label="小恒数科" value="A1002" />
                            <el-option label="汇财" value="A1003" />
                            <el-option label="保险" value="A1004" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="业务线" prop="businessCode">
                        <el-select v-model="searchData.businessCode" clearable placeholder="请选择">
                            <el-option label="全部" value="1" />
                            <el-option label="智能货柜" value="2" />
                            <el-option label="门店" value="3" />
                            <el-option label="生活充值" value="4" />
                            <el-option label="电商到家" value="5" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="子系统" prop="subCode">
                        <el-select v-model="searchData.subCode" clearable placeholder="请选择">
                            <el-option label="恒生活App" value="A1001001" />
                            <el-option label="智能货柜" value="A1001002" />
                            <el-option label="恒生活众包" value="A1001003" />
                            <el-option label="恒掌柜" value="A1001004" />
                            <el-option label="供应链" value="A1001005" />
                            <el-option label="交付" value="A1001006" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="批次有效期" prop="isValidTime" class="form-item-time">
                        <el-date-picker v-model="searchData.isValidTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeTime" :editable="false"/>
                    </el-form-item>
                    <el-form-item label="批次创建时间" prop="gmtCreateTime" class="form-item-time">
                        <el-date-picker v-model="searchData.gmtCreateTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeUTime" :editable="false"/>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('marketing-3')" @click="goCouponHandle('add')">新增</el-button>
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
                    :height="tableHeight"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #groupCode="row">
                        <el-popover placement="top-start" :width="150" trigger="hover" @before-enter="row.row.qrcodeVisible=true" @after-leave="row.row.qrcodeVisible=false">
                            <template #default>
                                <qrcode-vue v-if="row.row.qrcodeVisible" :value="`${urlPrefix}?s=2&t=3&c=${row.row.groupCode}`" :size="150" level="L" />
                            </template>
                            <template #reference>
                                {{row.row.groupCode}}
                            </template>
                        </el-popover>
                    </template>
                    <template #businessCode="scope">
                        <span v-if="scope.row.businessCode === 'A1001'">A1001-恒生活</span>
                        <span v-if="scope.row.businessCode === 'A1002'">A1002-小恒数科</span>
                        <span v-if="scope.row.businessCode === 'A1003'">A1003-汇财</span>
                        <span v-if="scope.row.businessCode === 'A1004'">A1004-保险</span>
                    </template>
                    <template #subCode="scope">
                        <span v-if="scope.row.subCode === 'A1001001'">A1001001-恒生活App</span>
                        <span v-if="scope.row.subCode === 'A1001002'">A1001002-智能货柜</span>
                        <span v-if="scope.row.subCode === 'A1001003'">A1001003-恒生活众包</span>
                        <span v-if="scope.row.subCode === 'A1001004'">A1001004-恒掌柜</span>
                        <span v-if="scope.row.subCode === 'A1001005'">A1001005-供应链</span>
                        <span v-if="scope.row.subCode === 'A1001006'">A1001006-交付</span>
                    </template>
                    <template #groupStatus="scope">
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
                        {{row.row.applyCount }}/{{row.row.receiveCount}}/{{row.row.usedCount}}
                    </template>
                    <template #isValidTime="row">
                        <div style="text-align: left;">
                            {{ row.row.isValidBeginTime }} - {{ row.row.isValidEndTime }}
                        </div>
                    </template>
                    <template #button="row">
                        <el-button type="primary" text v-if="checkRole('marketing-4') && (row.row.groupStatus === 1) && userInfo.account === row.row.applierId" @click="goCouponHandle('edit', row.row)">编辑</el-button>
                        <el-button type="primary" text v-if="checkRole('marketing-1')" @click="goCouponHandle('detail', row.row)">批次详情</el-button>
                        <el-button type="primary" text v-if="checkRole('marketing-5') && (row.row.groupStatus === 1) && userInfo.account === row.row.applierId" @click="goCouponHandle('approval', row.row)">提交</el-button>
                        <el-button type="primary" text v-if="checkRole('marketing-8') && (row.row.groupStatus === 1) && userInfo.account === row.row.applierId" @click="deleteCoupon(row.row)">删除</el-button>
                        <el-button type="primary" text v-if="checkRole('marketing-7') && (row.row.groupStatus === 5 || row.row.groupStatus === 4) && userInfo.account === row.row.applierId" @click="submitAudit(row.row,6)">停止</el-button>
                        <!-- <el-button type="text" v-if="checkRole('marketing-6') && row.row.groupStatus === 2 && userInfo.account === row.row.applierId"" @click="submitAudit(row.row,1)">撤回申请</el-button> -->
                        <el-button type="primary" text v-if="checkRole('marketing-2') && (row.row.groupStatus === 5 || row.row.groupStatus === 6 ||row.row.groupStatus === 7)" @click="couponInfo(row.row)">券详情</el-button>
                        <el-button type="primary" text v-if="checkRole('marketing-1')" @click="goCouponHandle('copy', row.row)">复制</el-button>
                    </template>

                </system-list>
            </div>
        </el-card>
        <coupon-submit
            v-if="dialogVisible"
            :visible ='dialogVisible'
            @handleClose="dialogVisible = false"
            :rowList = "rowList"
            @fevent="getList()"
        >
        </coupon-submit>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed, watch } from 'vue'
import couponSubmit from './components/coupon-submit.vue'
import { getCouponList, getCouponAudit, deleteCouponbatch } from '@/api/marketing/coupon'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { checkRole } from '@/utils'

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
        groupName: '',
        applier: '',
        groupStatus: '',
        businessCode: '',
        subCode: '',
        isValidTime: '',
        gmtCreateTime: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    handleType: '', // 操作类型： 新增，编辑，查看详情
    handleBatchCode: '', // 当前操作项编码
    handleAuditId: '', // 当前操作项审批id
    handleSubCode: '' // 当前操作项subCode
})
const dialogVisible = ref(false)
const rowList = ref({})
const { tableData, searchData, pageinfo, couponTypeKeyValue, userRangeTypeKeyValue } = toRefs(dataState)

const urlPrefix = process.env.VUE_APP_QRCODE_PREFIX
const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight - 166
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight - 166
}
const dateTime = ref({
    isValidBeginTime: '',
    isValidEndTime: '',
    gmtCreateBegin: '',
    gmtCreateEnd: ''
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

watch(() => dataState.searchData.isValidTime,
    (val) => {
        daterangeTime(val)
    },
    {
        deep: true
    })
watch(() => dataState.searchData.gmtCreateTime,
    (val) => {
        daterangeUTime(val)
    },
    {
        deep: true
    })
// 时间选择
const daterangeTime = (val) => {
    if (val) {
        dataState.searchData.isValidTime = val
        dateTime.value.isValidBeginTime = new Date(val[0]).getTime()
        dateTime.value.isValidEndTime = new Date(val[1]).getTime()
    } else {
        dateTime.value.isValidBeginTime = ''
        dateTime.value.isValidEndTime = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        dataState.searchData.gmtCreateTime = val
        dateTime.value.gmtCreateBegin = new Date(val[0]).getTime()
        dateTime.value.gmtCreateEnd = new Date(val[1]).getTime()
    } else {
        dateTime.value.gmtCreateBegin = ''
        dateTime.value.gmtCreateEnd = ''
    }
}

// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account,
        pageNum: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        ...dateTime.value,
        queryType: 0
    }
    delete param.isValidTime
    delete param.gmtCreateTime
    const res = await getCouponList(param)
    if (res.code === '200') {
        if (res.data) {
            dataState.tableData = res.data.map(item => {
                item.qrcodeVisible = false
                return item
            })
        } else {
            dataState.tableData = []
        }
        dataState.pageinfo.total = res.count
    }
}
getList()

// 搜索查询列表
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}

// 操作-停止，撤销
const submitAudit = async (row, item) => {
    const params = {
        appKey: row.subCode,
        busiCode: row.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: row.groupCode,
        groupStatus: item,
        operatorId: userInfo.value.account,
        gmtOperate: new Date().getTime()
    }
    ElMessageBox.confirm(
        `用户是否 ${item === 1 ? '撤回审批' : '下线批次'} ？`,
        '关闭确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await getCouponAudit(params)
            ElMessage.success('成功')
            getList()
        })
}

// 删除
const deleteCoupon = async (row) => {
    const params = {
        appKey: row.subCode,
        busiCode: row.subCode,
        sceneCode: '1',
        functionCode: 'functionCode',
        groupCode: row.groupCode,
        groupStatus: row.groupStatus,
        operatorId: userInfo.value.account,
        gmtOperate: new Date().getTime()
    }
    ElMessageBox.confirm(
        '用户是否删除批次',
        '关闭确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await deleteCouponbatch(params)
            ElMessage.success('成功')
            getList()
        })
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dateTime.value.isValidBeginTime = ''
    dateTime.value.isValidEndTime = ''
    dateTime.value.gmtCreateBegin = ''
    dateTime.value.gmtCreateEnd = ''
}

// 批次优惠券
const goCouponHandle = async (handleType, info) => {
    router.push({ name: 'coupon-batch-handle', params: { handleType, groupCode: info && info.groupCode, subCode: info && info.subCode, auditId: info && info.auditId } })
}

// 券详情
const couponInfo = async (info) => {
    router.push({ name: 'coupon-batch-config', query: { groupCode: info && info.groupCode, subCode: info && info.subCode, groupStatus: info && info.groupStatus } })
}
const tHead = [
    { align: 'center', fixed: true, tooltip: false, prop: 'groupCode', label: '券批次编号', minWidth: 110, slot: true },
    { align: 'center', fixed: true, tooltip: false, prop: 'groupName', label: '券批次名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'applier', label: '申请人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'groupStatus', label: '状态', minWidth: 100, slot: true },
    // { align: 'center', tooltip: false, prop: 'businessCode', label: '业务线', minWidth: 70, slot: true },
    // { align: 'center', tooltip: false, prop: 'subCode', label: '子系统', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'couponType', label: '优惠类型', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'userRangeType', label: '用户范围', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'applyCountlist', label: '券申请/领用/使用数量', minWidth: 150, slot: true },
    { align: 'center', tooltip: false, prop: 'isValidTime', label: '券批次有效期', minWidth: 190, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '批次创建时间', minWidth: 190 },
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
