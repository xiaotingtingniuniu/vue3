<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="140px">
                    <el-form-item label="微信支付分申请号" prop="wxPayNo">
                        <el-input v-model="searchData.wxPayNo" placeholder="请输入微信支付分申请号" clearable />
                    </el-form-item>
                    <el-form-item label="关闭原因" prop="closeReason">
                        <el-input v-model="searchData.closeReason" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="操作人" prop="modifierId">
                        <el-input v-model="searchData.modifierId" placeholder="请输入操作人" clearable />
                    </el-form-item>
                    <el-form-item label="订单号" prop="orderNo">
                        <el-input v-model="searchData.orderNo" placeholder="请输入订单号" clearable />
                    </el-form-item>
                    <el-form-item label="工单号" prop="workNo">
                        <el-input v-model="searchData.workNo" placeholder="请输入工单号" clearable />
                    </el-form-item>
                    <el-form-item label="用户手机号" prop="phoneMobile">
                        <el-input v-model="searchData.phoneMobile" placeholder="请输入用户手机号" clearable />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="add()">
                            关闭微信支付分
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="searchList">
                            搜索
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
                    <template #recordStatus="recordStatus">
                        <span type="text" v-if="recordStatus.row.recordStatus === 0" >无需关闭</span>
                        <span type="text" v-if="recordStatus.row.recordStatus === 1" >已关闭</span>
                        <span type="text" v-if="recordStatus.row.recordStatus === 2" >不可关闭</span>
                        <span type="text" v-if="recordStatus.row.recordStatus === 3" >关闭失败</span>
                    </template>
                </system-list>
            </div>
        </el-card>
        <add-dialog  v-if="dataState.addDialogVisible" :visible ='dataState.addDialogVisible' @handleClose="dataState.addDialogVisible = false" @fevent="getList"></add-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import addDialog from './wechart-off-add.vue'
import { getWechartOffList } from '@/api/refund/index'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({
    tableData: [],
    searchData: {
        wxPayNo: '',
        closeReason: '',
        modifierId: '',
        orderNo: '',
        workNo: '',
        phoneMobile: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    addDialogVisible: false
})
const { tableData, searchData, pageinfo } = toRefs(dataState)
onMounted(() => {
    getList()
})
// 获取列表
const getList = async () => {
    const param = {
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        wxPayNo: dataState.searchData.wxPayNo,
        closeReason: dataState.searchData.closeReason,
        modifierId: dataState.searchData.modifierId,
        orderNo: dataState.searchData.orderNo,
        workNo: dataState.searchData.workNo,
        phoneMobile: dataState.searchData.phoneMobile
    }
    const res = await getWechartOffList(param)
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
// 重置
const formRef = ref(null)
const resetForm = async (formRef) => {
    if (!formRef) return
    formRef.resetFields()
}
// 新建账户
const add = async () => {
    dataState.addDialogVisible = true
}
const tHead = [
    { align: 'left', tooltip: true, prop: 'wxPayNo', label: '微信支付分申请号', width: 220 },
    { align: 'center', tooltip: true, prop: 'orderNo', label: '订单号', width: 250 },
    { align: 'center', tooltip: true, prop: 'workNo', label: '工单号', width: 200 },
    { align: 'center', tooltip: true, prop: 'phoneMobile', label: '用户手机号', width: 200 },
    { align: 'center', tooltip: true, prop: 'closeReason', label: '关闭原因', width: 120 },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '操作人', width: 150 },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '操作时间', width: 130 },
    { align: 'center', tooltip: true, prop: 'recordStatus', label: '状态', width: 100, slot: true }
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
                    width: 320px;
                }
                .form-item-time{
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
