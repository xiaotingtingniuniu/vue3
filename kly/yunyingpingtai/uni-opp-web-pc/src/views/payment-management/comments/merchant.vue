<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="listDialogConfig" :before-close="handleClose">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <div v-if="listType === '1'">
                        <el-form-item label="商户名称" prop="merchantName">
                            <el-input v-model="searchData.merchantName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="用户手机号" prop="phoneMobile">
                            <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
                        </el-form-item>
                    </div>
                    <div v-if="listType === '2'">
                        <el-form-item label="商家名称" prop="merchantName">
                            <el-input v-model="searchData.merchantName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="用户手机号" prop="phoneMobile">
                            <el-input v-model="searchData.phoneMobile" placeholder="请输入" clearable />
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
import { getAllMerchantList, getenMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const tableRef = ref()

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
const curSelectedRowIds = computed(() => {
    console.log(dataState.costAccountChecked, 'costAccountChecked')
    let result = []
    if (dataState.costAccountChecked && dataState.costAccountChecked.length > 0) {
        result = dataState.costAccountChecked.map((item) => item.contentId)
    }
    console.log(result, 'result')
    return result
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const listDialogConfig = ref(props.listVisible)
const tHeadKeyValue = {
    1: [
        { align: 'center', tooltip: true, type: 'selection', reserveSelection: true, label: '', width: 80 },
        { align: 'center', fixed: true, tooltip: false, prop: 'merchantName', label: '商家名称', minWidth: 110 },
        { align: 'center', fixed: true, tooltip: false, prop: 'phoneMobile', label: '用户手机号', minWidth: 100 }
    ],
    2: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', fixed: true, tooltip: false, prop: 'merchantSubName', label: '用户名称', minWidth: 110 },
        { align: 'center', fixed: true, tooltip: false, prop: 'phoneMobile', label: '用户手机号', minWidth: 100 }
    ]
}
const tHead = computed(() => {
    return tHeadKeyValue[props.listType]
})
const dataState = reactive({
    searchData: {
        // 批次券
        merchantName: '',
        phoneMobile: '',
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
    console.log(checkedList, 'checkedList')
    nextTick(() => {
        if (dataState.tableData) {
            dataState.tableData.forEach((row) => {
                checkedList.forEach((item) => {
                    if (props.listType === '1') {
                        if (item.contentId === row.busiMerchantId) {
                            tableRef.value.tableRef.toggleRowSelection(row, true)
                        }
                    } else if (props.listType === '2') {
                        if (item.contentId === row.merchantSubId) {
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
    // const param = {
    //     appKey: 'A1001001',
    //     busiCode: 'A1001001',
    //     operatorId: userInfo.value.account
    // }
    if (props.listType === '2') {
        dataState.multipleType = 'author'
        const params = {
            body: {
                ...dataState.searchData,
                status: '2',
                appKey: 'A1001001',
                merchantSubType: 1,
                currPage: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize
            },
            appKey: 'A1001001',
            busiCode: 'A1001001',
            configCode: 'UC13259454390706176',
            name: '子账号管理列表',
            source: '商户中台'
        }
        const res = await getenMerchantList(params)
        console.log(res, 'res')
        dataState.pageinfo.total = res.total
        dataState.tableData = res.list
        checkRows()
    } else if (props.listType === '1') {
        dataState.multipleType = 'coupon'
        const params = {
            body: {
                ...dataState.searchData,
                busiCode: 'A1001002',
                busiMerchantStatus: '4',
                page: dataState.pageinfo.currentPage,
                pageSize: dataState.pageinfo.pageSize,
                appKey: 'A1001000',
                sceneCode: '1',
                functionCode: 'functionCode',
                creatorId: userInfo.value.account,
                modifierId: userInfo.value.account,
                operatorId: userInfo.value.account,
                operatorName: userInfo.value.name
            },
            appKey: 'A1001000',
            busiCode: 'A1001001',
            configCode: 'UC1657588823142wNsGY',
            name: '获取商户信息列表',
            source: '商户中台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name
        }
        const data = await getenMerchantList(params)
        dataState.tableData = data.list
        dataState.pageinfo.total = data.total
        checkRows()
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
    console.log(selection, changedRow, 'changedRow')
    let selectAll = false
    if (selection && selection.length > 0) {
        if (selection.length < dataState.costAccountChecked.length) {
            selectAll = false
        } else {
            selectAll = true
        }
        selection.forEach((row) => {
            if (props.listType === '1') {
                if (curSelectedRowIds.value.indexOf(row.busiMerchantId) < 0) {
                    dataState.costAccountChecked.push({
                        phoneMobile: row.phoneMobile,
                        merchantName: row.merchantName,
                        contentId: row.busiMerchantId
                    })
                }
            } else if (props.listType === '2') {
                if (curSelectedRowIds.value.indexOf(row.merchantSubId) < 0) {
                    dataState.costAccountChecked.push({
                        phoneMobile: row.phoneMobile,
                        merchantName: row.merchantSubName,
                        contentId: row.merchantSubId
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
                changedRowId = changedRow.busiMerchantId
            } else if (props.listType === '2') {
                changedRowId = changedRow.merchantSubId
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
                        const index = curSelectedRowIds.value.indexOf(row.busiMerchantId)
                        if (index > -1) {
                            dataState.costAccountChecked.splice(index, 1)
                        }
                    } else if (props.listType === '2') {
                        const index = curSelectedRowIds.value.indexOf(row.merchantSubId)
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
    console.log(dataState.costAccountChecked, 'dataState.costAccountChecked')
})

// 成本账户选择行
const getCurrentRow = (row) => {
    dataState.costAccountChecked = row
}

const submit = () => {
    if (props.listType === '1') {
        if (dataState.costAccountChecked.length > 1) {
            ElMessage.warning('最多可选择1条')
            return
        }
    } else if (props.listType === '2') {
        if (dataState.costAccountChecked.length > 1) {
            ElMessage.warning('最多可选择1条')
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
        return row.busiMerchantId
    } else if (props.listType === '2') {
        return row.merchantSubId
    }
}
</script>
<style lang="scss" scoped>
</style>
