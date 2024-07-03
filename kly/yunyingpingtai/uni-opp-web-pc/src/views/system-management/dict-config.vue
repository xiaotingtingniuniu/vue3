<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="字典类型" prop="dictType">
                        <el-select class="form-action-item-50w" v-model="searchData.dictType" clearable placeholder="请选择">
                            <el-option label="优惠券落地页" value="1" />
                            <el-option label="批次审批" value="2" />
                            <el-option label="拉新裂变" value="3" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="searchData.dictName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="字典key" prop="dictKey">
                        <el-input v-model="searchData.dictKey" placeholder="请输入" clearable />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="goDictConfigHandle('add')">
                            新增
                        </el-button>
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
                    <template #dictType="row">
                        {{ dictTypeValue[row.row.dictType] }}
                    </template>
                    <template #button="row">
                        <el-button text @click="goDictConfigHandle('edit', row.row)">编辑</el-button>
                        <el-button text @click="releaseHandle(row.row)" v-if="row.row.isPublish === 0">发布</el-button>
                        <el-button text @click="deleteCoupon(row.row)" v-if="row.row.isAllowDel === 1">删除</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed } from 'vue'
import { getDictList, releaseDict, deleteDict } from '@/api/system/dictConfig'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const dataState = reactive({
    tableData: [],
    searchData: {
        batchCode: '',
        groupName: '',
        applier: '',
        batchStatus: '',
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
    handleDictCode: '', // 当前操作项编码
    handleAuditId: '', // 当前操作项审批id
    handleSubCode: '', // 当前操作项subCode
    dictTypeValue: {
        1: '优惠券落地页',
        2: '批次审批',
        3: '拉新裂变'
    }
})
const { tableData, searchData, pageinfo, dictTypeValue } = toRefs(dataState)

const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight - 407
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight - 407
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account,
        currPage: pageinfo.value.currentPage,
        pageSize: pageinfo.value.pageSize
    }
    const res = await getDictList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
    }
}
getList()

// 搜索查询列表
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList()
}

// 发布
const releaseHandle = async (row) => {
    const params = {
        appKey: row.subCode,
        busiCode: row.subCode,
        modifierId: userInfo.value.account,
        dictCode: row.dictCode,
        dictName: row.dictName
    }
    ElMessageBox.confirm(
        '是否确认发布此数据',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await releaseDict(params)
            ElMessage.success('成功')
            getList()
        })
}
// 删除
const deleteCoupon = async (row) => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        modifierId: userInfo.value.account,
        dictCode: row.dictCode,
        dictName: row.dictName
    }
    ElMessageBox.confirm(
        '是否确认删除此数据',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            await deleteDict(params)
            ElMessage.success('成功')
            getList()
        })
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

// 新增/编辑操作
const goDictConfigHandle = async (handleType, info) => {
    router.push({ name: 'dictconfig-handle', query: { handleType, dictCode: info && info.dictCode } })
}

const tHead = [
    { align: 'center', fixed: true, tooltip: false, prop: 'dictType', label: '字典类型', slot: true },
    { align: 'center', tooltip: true, prop: 'dictName', label: '字典名称' },
    { align: 'center', tooltip: false, prop: 'dictKey', label: '字典key' },
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
