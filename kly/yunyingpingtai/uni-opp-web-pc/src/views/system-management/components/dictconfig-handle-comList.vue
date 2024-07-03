<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="listDialogConfig" :before-close="handleClose">
            <template #title>
                <div class='dialog-title'>
                    {{dialogTitle}}
                </div>
            </template>
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <div v-if="listType === '1'">
                        <el-form-item label="券批次名称" prop="groupName">
                            <el-input v-model="searchData.groupName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="券批次编号" prop="groupCode">
                            <el-input v-model="searchData.groupCode" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <div v-if="listType === '2'">
                        <el-form-item label="姓名" prop="auditorName">
                            <el-input v-model="searchData.auditorName" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <div v-if="listType === '3'">
                        <el-form-item label="活动编号" prop="applyCode">
                            <el-input v-model="searchData.applyCode" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="活动名称" prop="applyName">
                            <el-input v-model="searchData.applyName" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="searchList()">
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
                    :rowKey="getRowKeys"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                    @select="handleChange"
                    ref="tableRef"
                    :multipleType="multipleType"
                >
                    <template #radio="row">
                        <el-radio :label="row.$index" v-model="dataState.radio" @change="getCurrentRow(row.row)"></el-radio>
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
                </system-list>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, onMounted, nextTick } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { getAuthorList } from '@/api/system/dictConfig'
import { getCouponList } from '@/api/marketing/coupon'
import { getPromoList } from '@/api/marketing/active'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const tableRef = ref()
const dialogTitleKeyValue = {
    costAccount: '账户选择',
    goods: '商品选择'
}
const emit = defineEmits(['handleClose', 'pagerUpdate'])
const props = defineProps({
    listVisible: {
        type: Boolean
    },
    listType: {
        type: String
    },
    listIndex: {
        type: Number
    },
    hasSelectList: {
        type: Array
    }
})
const dialogTitle = computed(() => {
    return dialogTitleKeyValue[props.listType]
})
const curSelectedRowIds = computed(() => {
    let result = []
    if (dataState.costAccountChecked && dataState.costAccountChecked.length > 0) {
        result = dataState.costAccountChecked.map((item) => item.contentId)
    }
    return result
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const listDialogConfig = ref(props.listVisible)
const tHeadKeyValue = {
    1: [
        { align: 'center', tooltip: true, type: 'selection', reserveSelection: true, label: '', width: 80 },
        { align: 'center', fixed: true, tooltip: false, prop: 'groupCode', label: '券批次编号', minWidth: 110 },
        { align: 'center', fixed: true, tooltip: false, prop: 'groupName', label: '券批次名称', minWidth: 100 },
        { align: 'center', tooltip: true, prop: 'gmtCreate', label: '批次创建时间', minWidth: 190 }
    ],
    2: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', tooltip: true, prop: 'auditorName', label: '姓名', width: 250 },
        { align: 'center', tooltip: true, prop: 'auditorId', label: '用户id', width: 250 },
        { align: 'center', tooltip: true, prop: 'deptName', label: '部门', width: 100 }
    ],
    3: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', tooltip: true, prop: 'applyCode', label: '活动编号', width: 250 },
        { align: 'center', tooltip: true, prop: 'applyName', label: '活动名称', width: 250 },
        { align: 'center', tooltip: true, prop: 'promoStatus', label: '活动状态', width: 100, slot: true }
    ]
}
const tHead = computed(() => {
    return tHeadKeyValue[props.listType]
})
const dataState = reactive({
    searchData: {
        // 批次券
        groupName: '',
        groupCode: '',
        // 审批人
        auditorName: '',
        // 拉新裂变
        applyCode: '',
        applyName: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pageSizes: [10, 20, 30, 50]
    },
    tableData: [],
    multipleType: '',
    radio: null,
    costAccountChecked: []
})
const { tableData, multipleType, searchData, pageinfo } = toRefs(dataState)

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

const checkRows = () => {
    const checkedList = dataState.costAccountChecked
    nextTick(() => {
        if (dataState.tableData) {
            dataState.tableData.forEach((row) => {
                checkedList.forEach((item) => {
                    if (props.listType === '1') {
                        if (item.contentId === row.groupCode) {
                            tableRef.value.tableRef.toggleRowSelection(row, true)
                        }
                    } else if (props.listType === '2') {
                        if (item.contentId === row.auditorId) {
                            tableRef.value.tableRef.toggleRowSelection(row, true)
                        }
                    } else if (props.listType === '3') {
                        if (item.contentId === row.applyCode) {
                            tableRef.value.tableRef.toggleRowSelection(row, true)
                        }
                    }
                })
            })
        }
    })
}

// 获取列表
const getList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account
    }
    if (props.listType === '2') {
        dataState.multipleType = 'author'
        param.auditorName = searchData.value.auditorName
        param.currPage = pageinfo.value.currentPage
        param.pageSize = pageinfo.value.pageSize
        const res = await getAuthorList(param)
        if (res.code === '200') {
            dataState.tableData = res.data.list || []
            dataState.pageinfo.total = res.data.totalCount
            checkRows()
        }
    } else if (props.listType === '1') {
        dataState.multipleType = 'coupon'
        param.groupName = searchData.value.groupName
        param.groupCode = searchData.value.groupCode
        param.pageNum = pageinfo.value.currentPage
        param.pageSize = pageinfo.value.pageSize
        const res = await getCouponList(param)
        if (res.code === '200') {
            dataState.tableData = res.data || []
            dataState.pageinfo.total = res.count
            checkRows()
            console.log(dataState.costAccountChecked)
        }
    } else if (props.listType === '3') {
        dataState.multipleType = 'coupon'
        param.applyCode = searchData.value.applyCode
        param.applyName = searchData.value.applyName
        param.pageNum = pageinfo.value.currentPage
        param.pageSize = pageinfo.value.pageSize
        const res = await getPromoList(param)
        if (res.code === '200') {
            dataState.tableData = res.data || []
            dataState.pageinfo.total = res.count
            checkRows()
            console.log(dataState.costAccountChecked)
        }
    }
}

// 搜索查询列表
const searchList = async () => {
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

const handleChange = (selection, changedRow) => {
    let selectAll = false
    // dataState.costAccountChecked = selection.map((item) => {
    //     if (props.listType === '1') {
    //         return { contentId: item.groupCode, contentName: item.groupName }
    //     } else if (props.listType === '2') {
    //         return { contentId: item.auditorId, contentName: item.auditorName }
    //     }
    // })
    if (selection && selection.length > 0) {
        if (selection.length < dataState.costAccountChecked.length) {
            selectAll = false
        } else {
            selectAll = true
        }
        selection.forEach((row) => {
            if (props.listType === '1') {
                if (curSelectedRowIds.value.indexOf(row.groupCode) < 0) {
                    dataState.costAccountChecked.push({
                        contentId: row.groupCode,
                        contentName: row.groupName
                    })
                }
            } else if (props.listType === '2') {
                if (curSelectedRowIds.value.indexOf(row.auditorId) < 0) {
                    dataState.costAccountChecked.push({
                        contentId: row.auditorId,
                        contentName: row.auditorName
                    })
                }
            } else if (props.listType === '3') {
                if (curSelectedRowIds.value.indexOf(row.applyCode) < 0) {
                    dataState.costAccountChecked.push({
                        contentId: row.applyCode,
                        contentName: row.applyName
                    })
                }
            }
        })
    }
    // 如果当前的selection没有changedRow，表示changedRow被cancel了，
    // 如果this.multipleSelection有这一条，需要splice掉
    if (changedRow) {
        if (selection.indexOf(changedRow) < 0) {
            let changedRowId = ''
            if (props.listType === '1') {
                changedRowId = changedRow.groupCode
            } else if (props.listType === '2') {
                changedRowId = changedRow.auditorId
            } else if (props.listType === '3') {
                changedRowId = changedRow.applyCode
            }
            if (curSelectedRowIds.value.indexOf(changedRowId) > -1) {
                for (let index = 0; index < dataState.costAccountChecked.length; index++) {
                    if (changedRowId === dataState.costAccountChecked[index].contentId) {
                        dataState.costAccountChecked.splice(index, 1)
                    }
                }
            }
        }
    } else {
        if (!selectAll) {
            if (selection.length < dataState.costAccountChecked.length) {
                dataState.tableData.forEach((row) => {
                    if (props.listType === '1') {
                        const index = curSelectedRowIds.value.indexOf(row.groupCode)
                        if (index > -1) {
                            dataState.costAccountChecked.splice(index, 1)
                        }
                    } else if (props.listType === '2') {
                        const index = curSelectedRowIds.value.indexOf(row.auditorId)
                        if (index > -1) {
                            dataState.costAccountChecked.splice(index, 1)
                        }
                    } else if (props.listType === '3') {
                        const index = curSelectedRowIds.value.indexOf(row.applyCode)
                        if (index > -1) {
                            dataState.costAccountChecked.splice(index, 1)
                        }
                    }
                })
            }
        }
    }
    // // 如果当前一条都没有选中，表示都没有选中，则需要把当前页面的rows都遍历一下，splice掉没选中的
    if (selection.length === 0) {
        dataState.tableData && dataState.tableData.forEach((row) => {
            const index = curSelectedRowIds.value.indexOf(row.contentId)
            if (index > -1) {
                dataState.costAccountChecked.splice(index, 1)
            }
        })
    }
}

const handleClose = () => {
    tableRef.value.tableRef.clearSelection()
    emit('handleClose', props.visible)
}

onMounted(() => {
    getList()
    dataState.costAccountChecked = JSON.parse(JSON.stringify(props.hasSelectList))
})

// 成本账户选择行
const getCurrentRow = (row) => {
    dataState.costAccountChecked = row
}

const submit = () => {
    if (props.listType === '1') {
        if (dataState.costAccountChecked.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    } else if (props.listType === '2') {
        if (dataState.costAccountChecked.length > 14) {
            ElMessage.warning('最多可选择14条')
            return
        }
    } else if (props.listType === '3') {
        if (dataState.costAccountChecked.length > 1) {
            ElMessage.warning('最多可选择1条')
            return
        }
    }
    emit('getCheckedData', dataState.costAccountChecked, props.listIndex)
    handleClose()
}
const getRowKeys = (row) => {
    if (props.listType === '1') {
        return row.groupCode
    } else if (props.listType === '2') {
        return row.auditorId
    } else if (props.listType === '3') {
        return row.applyCode
    }
}
</script>
<style lang="scss" scoped>
</style>
