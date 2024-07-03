<template>
    <div class='coupon-submit-box'>
        <el-dialog  v-model="dialogVisible"  :before-close="handleClose" width="90%">
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
                    <!-- <el-form-item label="状态" prop="groupStatus">
                        <el-select v-model="searchData.groupStatus" clearable placeholder="请选择" >
                            <el-option label="草稿" value="1" />
                            <el-option label="待审批" value="2" />
                            <el-option label="审批驳回" value="3" />
                            <el-option label="待开始" value="4" />
                            <el-option label="在线" value="5" />
                            <el-option label="已停止" value="6" />
                            <el-option label="已结束" value="7" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="优惠类型" prop="couponType">
                        <el-select v-model="searchData.couponType" clearable placeholder="请选择">
                            <el-option label="立减" value="1" />
                            <el-option label="满减" value="2" />
                            <el-option label="折扣" value="3" />
                        </el-select>
                    </el-form-item> -->
                    <!-- <el-form-item label="成本账户" prop="userCouponStatus">
                        <el-select v-model="searchData.userCouponStatus" clearable placeholder="请选择" >
                            <el-option  v-for="item in setgroupStatus" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="批次有效期" prop="isValidTime" class="form-item-time">
                        <el-date-picker v-model="searchData.isValidTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime" :editable="false"/>
                    </el-form-item>
                    <el-form-item label="批次创建时间" prop="gmtCreateTime" class="form-item-time">
                        <el-date-picker v-model="searchData.gmtCreateTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeUTime" :editable="false"/>
                    </el-form-item>
                    <el-form-item class="button-box">
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
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
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
                        <el-button type="text" @click='choiceCoupon(row.row)'>选择</el-button>
                    </template>
                </system-list>
            </div>
        </el-dialog>

    </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getCouponList } from '@/api/marketing/coupon'
import { getTime } from '@/utils'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const route = useRoute()
const store = useStore()

const props = defineProps({
    visible: {
        type: Boolean
    },
    dataTime: {
        type: Array
    },
    businessCode: {
        type: String
    },
    subCode: {
        type: String
    }
})

const operatorId = computed(() => store.state.userInfo.acctId)
const dialogVisible = ref(props.visible)
const emit = defineEmits(['handleClose', 'fevent', 'getrowList'])
const handleClose = () => {
    emit('handleClose', props.visible)
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'groupCode', label: '券批次编号', minWidth: 200, fixed: true },
    { align: 'center', tooltip: true, prop: 'groupName', label: '券批次名称', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'applier', label: '申请人', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'groupStatus', label: '状态', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'couponName', label: '成本账户', minWidth: 200 },
    // { align: 'center', tooltip: true, prop: 'couponType', label: '优惠类型', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'userRangeType', label: '用户范围', minWidth: 100, slot: true },
    // { align: 'center', tooltip: true, prop: 'applyCountlist', label: '优惠券 申请/领用/使用 数量', minWidth: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'isValidTime', label: '券批次有效期', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '批次创建时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'button', label: '操作', minWidth: 130, slot: true, fixed: 'right' }

]

const tableData = ref([])
const searchData = ref({
    userId: '',
    phoneMobile: '',
    couponCode: '',
    userCouponStatus: '',
    orderNo: '',
    isValidTime: [],
    gmtCreateTime: []
})
const dateTime = ref({
    isValidBeginTime: '',
    isValidEndTime: '',
    gmtCreateBegin: '',
    gmtCreateEnd: ''
})
const pageinfo = ref(
    {
        total: 0,
        currentPage: 1,
        pageSize: 10
    }
)
const userRangeTypeKeyValue = {
    1: '全部用户',
    2: '新用户',
    3: '会员'
}
const couponTypeKeyValue = {
    1: '立减',
    2: '满减',
    3: '折扣'
}

watch(() => searchData.value.isValidTime,
    (val) => {
        daterangeTime(val)
    },
    {
        deep: true
    })
const daterangeTime = (val) => {
    if (val) {
        searchData.value.isValidTime = val
        dateTime.value.isValidBeginTime = new Date(val[0]).getTime()
        dateTime.value.isValidEndTime = new Date(val[1]).getTime()
    } else {
        searchData.value.isValidTime = ''
        dateTime.value.isValidBeginTime = ''
        dateTime.value.isValidEndTime = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        searchData.value.gmtCreateTime = val
        dateTime.value.gmtCreateBegin = new Date(val[0]).getTime()
        dateTime.value.gmtCreateEnd = new Date(val[1]).getTime()
    } else {
        searchData.value.gmtCreateTime = ''
        dateTime.value.gmtCreateBegin = ''
        dateTime.value.gmtCreateEnd = ''
    }
}
const getTimeList = () => {
    if (props.dataTime && searchData.value.isValidTime.length === 0) {
        dateTime.value.isValidBeginTime = new Date(props.dataTime[0]).getTime()
        dateTime.value.isValidEndTime = new Date(props.dataTime[1]).getTime()
    } else {
        dateTime.value.isValidBeginTime = ''
        dateTime.value.isValidEndTime = ''
    }
}

// 获取列表
const getList = async () => {
    getTimeList()
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        // operatorId: userInfo.value.acctId,
        operatorId: '10000024',
        statusList: '4,5',
        pageNum: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        businessCode: props.businessCode,
        subCode: props.subCode,
        ...dateTime.value
    }
    delete param.isValidTime
    delete param.gmtCreateTime
    const res = await getCouponList(param)
    if (res.code === '200') {
        tableData.value = res.data
        pageinfo.value.total = res.count
    }
}

getList()

const choiceCoupon = (row) => {
    emit('handleClose', props.visible)
    emit('getrowList', row)
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

// 查询
const searchCoupon = () => {
    pageinfo.value.currentPage = 1
    getList()
}

// 当前页数改变
const currentChange = (val) => {
    pageinfo.value.currentPage = val
    getList()
}
const sizeChange = (val) => {
    pageinfo.value.currentPage = 1
    pageinfo.value.pageSize = val
    getList()
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
</style>
