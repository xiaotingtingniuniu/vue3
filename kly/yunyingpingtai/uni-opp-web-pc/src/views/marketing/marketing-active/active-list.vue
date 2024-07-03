<template>
    <div class="active-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" >
                    <el-form-item label="营销活动编号" prop="applyCode" label-width="100px">
                        <el-input v-model="searchData.applyCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="活动名称" prop="applyName" label-width="80px">
                        <el-input v-model="searchData.applyName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="申请人" prop="applier" label-width="60px">
                        <el-input v-model="searchData.applier" placeholder="仅支持搜索申请人名称" clearable />
                    </el-form-item>
                    <!-- 本期不做 -->
                    <!-- <el-form-item label="成本账户" prop="acctInfo">
                        <el-input v-model="searchData.acctInfo" placeholder="请输入" clearable />
                    </el-form-item> -->
                    <el-form-item label="状态" prop="promoStatus" label-width="50px">
                        <el-select v-model="searchData.promoStatus" clearable placeholder="请选择" style="width:200px">
                            <el-option label="全部" value="" />
                            <el-option label="草稿" value="1" />
                            <el-option label="待审批" value="2" />
                            <el-option label="审批驳回" value="3" />
                            <el-option label="待开始" value="4" />
                            <el-option label="在线" value="5" />
                            <el-option label="已停止" value="6" />
                            <el-option label="已结束" value="7" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="营销工具" prop="promoType" label-width="80px">
                        <el-select v-model="searchData.promoType" clearable placeholder="请选择">
                            <el-option  v-for="item in promoTypeList" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动有效期" prop="isValidTime" class="form-item-time" label-width="100px">
                        <el-date-picker v-model="searchData.isValidTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeTime" :editable="false"/>
                    </el-form-item>
                    <el-form-item label="活动创建时间" prop="gmtCreateTime" class="form-item-time" label-width="100px">
                        <el-date-picker v-model="searchData.gmtCreateTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" @change="daterangeUTime" :editable="false"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">
                            搜索
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <!-- <el-button type="primary" @click="toApply">
                            新建
                        </el-button> -->
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

                    <template #applier="row">
                        {{row.row.applier}}({{row.row.applierId}})
                    </template>
                    <template #promoStatus="scope">
                        <span v-if="scope.row.promoStatus === 1">草稿</span>
                        <span v-if="scope.row.promoStatus === 2">待审批</span>
                        <span v-if="scope.row.promoStatus === 3">审批驳回</span>
                        <span v-if="scope.row.promoStatus === 4">待开始</span>
                        <span v-if="scope.row.promoStatus === 5">在线</span>
                        <span v-if="scope.row.promoStatus === 6">已停止</span>
                        <span v-if="scope.row.promoStatus === 7">已结束</span>
                    </template>
                    <template #couponType="row">
                        {{couponTypeKeyValue[row.row.couponType]}}
                    </template>
                    <template #promoType="row">
                        {{promoTypeVlue[row.row.promoType]}}
                    </template>
                    <template #userRangeType="row">
                        {{userRangeTypeKeyValue[row.row.userRangeType]}}
                    </template>
                    <template #applyCountlist="row">
                        {{row.row.applyCount }}/{{row.row.receiveCount}}/{{row.row.usedCount}}
                    </template>
                    <template #isValidTime="row">
                        <div style="text-align: left;">
                            {{ row.row.promoBeginDate }} - {{ row.row.promoEndDate }}
                        </div>
                    </template>
                    <template #button="row">
                        <el-button type="text" @click="goCouponHandle('approval',row.row.applyCode, row.row.promoType)" v-if="checkRole('marketing-5')&&row.row.promoStatus === 1&& userInfo.account === row.row.applierId">提交</el-button>
                        <el-button type="text" @click="editHandle('edit', row.row.applyCode, row.row.promoType)" v-if="checkRole('marketing-4')&&row.row.promoStatus === 1&& userInfo.account === row.row.applierId">编辑</el-button>
                        <el-button type="text" @click="goCouponHandle('detail', row.row.applyCode, row.row.promoType)" v-if="checkRole('marketing-1')">活动详情</el-button>
                        <el-button type="text"  @click="deleteCoupon(row.row)" v-if="checkRole('marketing-8') && (row.row.promoStatus === 1|| row.row.promoStatus === 3)&& userInfo.account === row.row.applierId">删除</el-button>
                        <el-button type="text"  @click="submitAudit(row.row,6)"  v-if="checkRole('marketing-7') &&(row.row.promoStatus === 5||row.row.promoStatus === 4)&& userInfo.account === row.row.applierId">停止</el-button>
                        <el-button type="text" @click="goCouponHandle('copy', row.row.applyCode, row.row.promoType)" v-if="checkRole('marketing-1')">复制</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { getPromoList, deletePromoApply, deletePromoStatus } from '@/api/marketing/active'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
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
        2: 'App新注册用户',
        3: '已注册未下单用户',
        4: '已下单用户'
    },
    promoTypeVlue: {
        0: '',
        1: '支付优惠',
        2: '拉新有礼',
        3: '秒杀'
    },
    promoTypeList: [
        {
            value: '',
            label: '全部'
        }, {
            value: '1',
            label: '支付优惠'
        }, {
            value: '2',
            label: '拉新有礼'
        },
        {
            value: '3',
            label: '秒杀'
        }
    ],
    tableData: [],
    searchData: {
        applyCode: '',
        applyName: '',
        applier: '',
        promoType: '',
        promoStatus: '',
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
const { tableData, searchData, pageinfo, couponTypeKeyValue, promoTypeVlue, promoTypeList, userRangeTypeKeyValue } = toRefs(dataState)

const dateTime = ref({
    applyStartDate: '',
    applyEndDate: '',
    queryCreateBegin: '',
    queryCreateEnd: ''
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
    console.log(val)
    if (val) {
        dataState.searchData.isValidTime = val
        dateTime.value.applyStartDate = new Date(val[0]).getTime()
        dateTime.value.applyEndDate = new Date(val[1]).getTime()
    } else {
        dateTime.value.applyStartDate = ''
        dateTime.value.applyEndDate = ''
    }
}

const daterangeUTime = (val) => {
    if (val) {
        dataState.searchData.gmtCreateTime = val
        dateTime.value.queryCreateBegin = new Date(val[0]).getTime()
        dateTime.value.queryCreateEnd = new Date(val[1]).getTime()
    } else {
        dateTime.value.queryCreateBegin = ''
        dateTime.value.queryCreateEnd = ''
    }
}
// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: '10000024',
        pageNum: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        ...dateTime.value
    }

    delete param.isValidTime
    delete param.gmtCreateTime
    const res = await getPromoList(param)
    dataState.tableData = res.data
    dataState.pageinfo.total = res.count
}

getList()

// 操作-停止，撤销
const submitAudit = async (row) => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        applyCode: row.applyCode,
        applyName: row.applyName,
        promoStatus: 6,
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        '用户是否停止该活动',
        '关闭确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await deletePromoStatus(params)
            ElMessage.success('成功')
            getList()
        })
}

// 删除
const deleteCoupon = async (row) => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        sceneCode: '1',
        functionCode: 'functionCode',
        applyCode: row.applyCode,
        applyName: row.applyName,
        isDel: '1',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    ElMessageBox.confirm(
        '用户是否删除该活动',
        '关闭确认框',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await deletePromoApply(params)
            ElMessage.success('成功')
            getList()
        })
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dateTime.value.applyStartDate = ''
    dateTime.value.applyEndDate = ''
    dateTime.value.queryCreateBegin = ''
    dateTime.value.queryCreateEnd = ''
    getList()
}

// 编辑
const editHandle = (handleType, applyCode, promoType) => {
    if (promoType === 3) {
        router.push({ name: 'apply-active-seckill', params: { handleType, applyCode } })
    } else {
        router.push({ name: 'apply-active', params: { handleType, applyCode } })
    }
}
// 详情跳转
const goCouponHandle = (handleType, applyCode, promoType) => {
    if (promoType === 3) {
        router.push({ name: 'apply-active-seckill', params: { handleType, applyCode } })
    } else {
        router.push({ name: 'apply-active', params: { handleType, applyCode } })
    }
}

// 查询
const search = () => {
    dataState.pageinfo.currentPage = 1
    getList()
}
const tHead = [
    { align: 'center', fixed: true, tooltip: true, prop: 'applyCode', label: '活动编号', minWidth: 110 },
    { align: 'center', fixed: true, tooltip: false, prop: 'applyName', label: '活动名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'applier', label: '申请人', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'promoStatus', label: '状态', minWidth: 100, slot: true },
    // { align: 'center', tooltip: false, prop: 'acctName', label: '成本账户', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'promoType', label: '营销工具', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'userRangeType', label: '用户范围', minWidth: 100, slot: true },
    { align: 'center', tooltip: false, prop: 'isValidTime', label: '活动有效期', minWidth: 190, slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '活动创建时间', minWidth: 190 },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 150, slot: true }
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
.active-list-page{
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
