<template>
    <div class="compensation-coupon">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="券批次编号" prop="batchCode">
                        <el-input v-model.trim="searchData.batchCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="券批次名称" prop="batchName">
                        <el-input v-model.trim="searchData.batchName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="发券操作人" prop="modifierId">
                        <el-input v-model.trim="searchData.modifierId" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="操作时间" prop="gmtCreateTime" class="form-item-time">
                        <el-date-picker v-model="searchData.gmtCreateTime" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"/>
                    </el-form-item>
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

                    <template #busiCode="scope">
                        <span v-if="scope.row.busiCode === 'A1001'">A1001-恒生活</span>
                        <span v-if="scope.row.busiCode === 'A1002'">A1002-小恒数科</span>
                        <span v-if="scope.row.busiCode === 'A1003'">A1003-汇财</span>
                        <span v-if="scope.row.busiCode === 'A1004'">A1004-保险</span>
                    </template>
                    <template #subCode="scope">
                        <span v-if="scope.row.subCode === 'A1001001'">A1001001-恒生活App</span>
                        <span v-if="scope.row.subCode === 'A1001002'">A1001002-智能货柜</span>
                        <span v-if="scope.row.subCode === 'A1001003'">A1001003-恒生活众包</span>
                        <span v-if="scope.row.subCode === 'A1001004'">A1001004-恒掌柜</span>
                        <span v-if="scope.row.subCode === 'A1001005'">A1001005-供应链</span>
                        <span v-if="scope.row.subCode === 'A1001006'">A1001006-交付</span>
                    </template>
                    <template #button="row">
                        <span v-if="row.row.recordStatus === 1" >发送成功</span>
                        <span type="text"  v-if="row.row.recordStatus === 0" style="color:red">发送失败</span>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed, watch } from 'vue'
import { recordList } from '@/api/refund'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const dataState = reactive({
    tableData: [],
    searchData: {
        batchCode: '',
        batchName: '',
        batchStatus: 5,
        couponType: '',
        gmtCreateTime: ''
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
const { tableData, searchData, pageinfo } = toRefs(dataState)

const urlPrefix = process.env.VUE_APP_QRCODE_PREFIX
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const dateTime = ref({
    beginTime: '',
    endTime: ''
})
watch(() => dataState.searchData.gmtCreateTime,
    (val) => {
        daterangeUTime(val)
    },
    {
        deep: true
    })
const daterangeUTime = (val) => {
    if (val) {
        dataState.searchData.gmtCreateTime = val
        dateTime.value.beginTime = val[0]
        // new Date(val[0]).getTime()
        dateTime.value.endTime = val[1]
    } else {
        dateTime.value.beginTime = ''
        dateTime.value.endTime = ''
    }
}
// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        ...dateTime.value

    }
    delete param.gmtCreateTime
    const res = await recordList(param)
    if (res.code === '200') {
        console.log(res.data.list)
        if (res.data.list !== null) {
            dataState.tableData = res.data.list.map(item => {
                return {
                    datetime: item.gmtModify.replace('T', ' '),
                    ...item
                }
            })
        } else {
            dataState.tableData = []
        }

        dataState.pageinfo.total = res.data.totalCount
    }
}
getList()

const gosendCoupon = (id) => {
    dialogVisible.value = true
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
    dateTime.value.beginTime = ''
    dateTime.value.endTime = ''
}

const tHead = [
    { align: 'center', fixed: true, tooltip: true, prop: 'batchCode', label: '券批次编号', minWidth: 110 },
    { align: 'center', fixed: true, tooltip: true, prop: 'batchName', label: '券批次名称', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'applierName', label: '申请人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'busiCode', label: '业务线', minWidth: 70, slot: true },
    { align: 'center', tooltip: true, prop: 'subCode', label: '子系统', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '发券操作人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'datetime', label: '操作时间', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '发送手机号', minWidth: 150 },
    { align: 'center', fixed: 'right', prop: 'button', label: '发送结果', minWidth: 150, slot: true }
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
