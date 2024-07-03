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
                    <div v-if="listType === 'costAccount'">
                        <el-form-item label="账户编号" prop="acctId">
                            <el-input v-model="searchData.acctId" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="账户名称" prop="acctName">
                            <el-input v-model="searchData.acctName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="预算中心" prop="centorCode">
                            <el-select v-model="searchData.centorCode" clearable placeholder="请选择" >
                                <el-option label="恒生活App" value="A1001001" />
                                <el-option label="智能货柜" value="A1001002" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算科目" prop="subjectName">
                            <el-input v-model="searchData.subjectName" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="申请项目" prop="projectName">
                            <el-input v-model="searchData.projectName" placeholder="请输入" disabled />
                        </el-form-item>
                        <el-form-item label="状态" prop="acctStatus">
                            <el-select v-model="searchData.acctStatus" clearable placeholder="请选择" disabled>
                                <el-option label="启用" value="1" />
                                <el-option label="停用" value="2" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算期间" prop="budgetPeriod">
                            <el-input v-model="searchData.budgetPeriod" placeholder="请输入" disabled />
                        </el-form-item>
                    </div>
                    <div v-if="listType === 'goods'">
                        <!-- <el-form-item label="业务线" prop="userId">
                            <el-input v-model="searchData.userId" placeholder="请输入" clearable />
                        </el-form-item> -->
                        <el-form-item label="业务线" prop="channels">
                            <el-select class="form-action-item-50w" v-model="searchData.channels" placeholder="请选择" disabled multiple>
                                <el-option label="全部" value="1" />
                                <el-option label="智能货柜" value="2" />
                                <el-option label="门店" value="3" />
                                <el-option label="生活充值" value="4" />
                                <el-option label="电商到家" value="5" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品编号" prop="skuIds">
                            <el-input v-model="searchData.skuIds" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品名称" prop="skuName">
                            <el-input v-model="searchData.skuName" placeholder="请输入" clearable />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="cateCode">
                            <el-cascader
                                v-model="searchData.cateCode"
                                :props="goodsClassifyPropsList"
                                @change="goodsClassifyChange"
                            />
                        </el-form-item>
                        <el-form-item label="商品状态" prop="skuStatus">
                            <el-select v-model="searchData.skuStatus" clearable placeholder="请选择" >
                                <el-option label="已上架" value="4" />
                                <el-option label="已下架" value="5" />
                                <el-option label="停用" value="6" />
                            </el-select>
                        </el-form-item>
                        <!-- <el-form-item label="生效城市" prop="busiCode">
                            <span>北京，上海</span>
                        </el-form-item> -->
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
                    <template #acctStatus="row">
                        {{row.row.acctStatus === 1 ? '启用' : '停用'}}
                    </template>
                    <template #thumbnail="scope">
                        <img :src="scope.row.thumbnail" alt="">
                    </template>
                    <template #skuInfo="scope">
                        <span>商品：{{scope.row.skuId}}-{{scope.row.skuName}}</span><br/>
                        <span>商品状态：{{skuStatusKeyValue[scope.row.skuOnshelfStatus]}}</span><br/>
                        <span>商品分类：{{scope.row.firstCateName}}-{{scope.row.secondCateName}}-{{scope.row.thirdCateName}}-{{scope.row.fourthCateName}}</span><br/>
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
import { useStore } from 'vuex'
import SystemList from '@/composables/TablePagination/index.vue'
import { getAccList } from '@/api/marketing/coupon'
import { getGoodsList, getBusiCate } from '@/api/marketing/active'
import { ElMessage } from 'element-plus'

const store = useStore()
const tableRef = ref()
const dialogTitleKeyValue = {
    costAccount: '账户选择',
    goods: '商品选择'
}
const userInfo = computed(() => store.state.userInfo)
const curSelectedRowIds = computed(() => {
    let result = []
    if (dataState.currentDialogCheckedAll && dataState.currentDialogCheckedAll.length > 0) {
        if (props.listType === 'costAccount') {
            result = dataState.currentDialogCheckedAll.map((item) => item.budgetId)
        } else if (props.listType === 'goods') {
            result = dataState.currentDialogCheckedAll.map((item) => item.skuCode)
        }
    }
    return result
})
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
    },
    businessCode: {
        type: Array
    }
})
const dialogTitle = computed(() => {
    return dialogTitleKeyValue[props.listType]
})

const listDialogConfig = ref(props.listVisible)
const tHeadKeyValue = {
    costAccount: [
        // { align: 'center', tooltip: true, prop: 'radio', label: '选择', width: '60', slot: true },
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', tooltip: true, prop: 'acctId', label: '账户编号', width: 250 },
        { align: 'center', tooltip: true, prop: 'acctName', label: '账户名称', width: 250 },
        { align: 'center', tooltip: true, prop: 'deptName', label: '机构', width: 100 },
        { align: 'center', tooltip: true, prop: 'centorName', label: '预算中心', width: 100 },
        { align: 'center', tooltip: true, prop: 'subjectName', label: '预算科目', width: 100 },
        { align: 'center', tooltip: true, prop: 'projectName', label: '预算项目', width: 100 },
        { align: 'center', tooltip: true, prop: 'budgetAmount', label: '预算金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'freezeAmount', label: '已冻结金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'usedAmount', label: '已使用金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'balanceAmount', label: '剩余金额', width: 100 },
        { align: 'center', tooltip: true, prop: 'acctStatus', label: '状态', width: 100, slot: true }
    ],
    goods: [
        { align: 'center', tooltip: true, reserveSelection: true, type: 'selection', label: '', width: 80 },
        { align: 'center', prop: 'thumbnail', label: '图片', width: 120, slot: true },
        { align: 'center', tooltip: true, prop: 'skuInfo', label: 'sku', slot: true },
        { align: 'center', tooltip: true, prop: 'salePrice', label: '当前价格', width: 100 }
    ]
}
const tHead = computed(() => {
    return tHeadKeyValue[props.listType]
})
const dataState = reactive({
    searchData: {
        // 成本账户
        acctId: '',
        acctName: '',
        centorCode: '',
        subjectName: '营销费用',
        projectName: '优惠券',
        acctStatus: '1',
        budgetPeriod: '',
        // 商品
        channels: props.businessCode,
        skuIds: '',
        skuName: '',
        skuStatus: '4',
        firstCateName: '',
        secondCateName: '',
        thirdCateName: '',
        fourthCateName: ''
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    tableData: [],
    radio: null,
    currentDialogCheckedAll: [],
    multipleType: '',
    skuStatusKeyValue: {
        1: '待审核',
        2: '已审核',
        3: '已拒绝',
        4: '已上架',
        5: '下架可上架',
        6: '下架',
        7: '待上架'
    }
})
const { tableData, searchData, multipleType, pageinfo, skuStatusKeyValue } = toRefs(dataState)

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    dataState.searchData.firstCateCode = ''
    dataState.searchData.secondCateCode = ''
    dataState.searchData.thirdCateCode = ''
}

const checkRows = () => {
    dataState.currentDialogCheckedAll = JSON.parse(JSON.stringify(props.hasSelectList))
    const checkedList = dataState.currentDialogCheckedAll
    nextTick(() => {
        dataState.tableData.forEach((row) => {
            checkedList.forEach((item) => {
                if (props.listType === 'costAccount') {
                    if (item.budgetId === row.budgetId) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                } else if (props.listType === 'goods') {
                    if (item.skuCode === row.skuCode) {
                        tableRef.value.tableRef.toggleRowSelection(row, true)
                    }
                }
            })
        })
    })
}

// 获取列表
const getList = async () => {
    if (props.listType === 'costAccount') {
        dataState.multipleType = 'account'
        const param = {
            appKey: 'A1001001',
            busCode: 'A1001001',
            acctId: dataState.searchData.acctId,
            acctName: dataState.searchData.acctName,
            centorCode: dataState.searchData.centorCode,
            subjectName: dataState.searchData.subjectName,
            projectName: dataState.searchData.projectName,
            acctStatus: dataState.searchData.acctStatus,
            budgetPeriod: dataState.searchData.budgetPeriod,
            budgetAmountGreaterZero: 1,
            currPage: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        }
        const res = await getAccList(param)
        if (res.code === '200') {
            dataState.tableData = res.data.list
            dataState.pageinfo.total = res.data.totalCount
            checkRows()
        }
    } else if (props.listType === 'goods') {
        dataState.multipleType = 'account'
        const param = {
            appKey: 'A1001001',
            busiCode: 'A1001004',
            sceneCode: '1',
            functionCode: 'functionCode',
            configCode: 'UC16582257103870OxkY',
            name: '秒杀商品列表',
            source: '营销中台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            body: {
                appKey: 'A1001001',
                busiCode: 'A1001004',
                channels: dataState.searchData.channels.join(','),
                skuIds: dataState.searchData.skuIds,
                skuName: dataState.searchData.skuName,
                firstCateCode: dataState.searchData.firstCateCode,
                secondCateCode: dataState.searchData.secondCateCode,
                thirdCateCode: dataState.searchData.thirdCateCode,
                skuStatus: dataState.searchData.skuStatus,
                currPage: pageinfo.value.currentPage,
                pageSize: pageinfo.value.pageSize
            }
        }
        const res = await getGoodsList(param)
        if (res.code === '200') {
            dataState.tableData = []
            if (res.data.list) {
                res.data.list.map(item => {
                    item = { ...item, skuCode: item.skuId }
                    dataState.tableData.push(item)
                })
            }
            // dataState.tableData = res.data.list
            dataState.pageinfo.total = res.data.total
            checkRows()
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
    // 检查有没有新增的，有新增的就push
    if (selection && selection.length > 0) {
        if (selection.length < dataState.currentDialogCheckedAll.length) {
            selectAll = false
        } else {
            selectAll = true
        }
        selection.forEach((row) => {
            if (props.listType === 'costAccount') {
                if (curSelectedRowIds.value.indexOf(row.budgetId) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            } else if (props.listType === 'goods') {
                if (curSelectedRowIds.value.indexOf(row.skuCode) < 0) {
                    dataState.currentDialogCheckedAll.push(row)
                }
            }
        })
    }
    // 如果当前的selection没有changedRow，表示changedRow被cancel了，
    // 如果this.multipleSelection有这一条，需要splice掉
    if (changedRow) {
        if (selection.indexOf(changedRow) < 0) {
            let changedRowId = ''
            if (props.listType === 'costAccount') {
                changedRowId = changedRow.budgetId
            } else if (props.listType === 'goods') {
                changedRowId = changedRow.skuCode
            }
            if (curSelectedRowIds.value.indexOf(changedRowId) > -1) {
                for (let index = 0; index < dataState.currentDialogCheckedAll.length; index++) {
                    if (props.listType === 'costAccount') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].budgetId) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    } else if (props.listType === 'goods') {
                        if (changedRowId === dataState.currentDialogCheckedAll[index].skuCode) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                            break
                        }
                    }
                }
            }
        }
    } else {
        if (!selectAll) {
            if (selection.length < dataState.currentDialogCheckedAll.length) {
                dataState.tableData.forEach((row) => {
                    if (props.listType === 'costAccount') {
                        const index = curSelectedRowIds.value.indexOf(row.budgetId)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    } else if (props.listType === 'goods') {
                        const index = curSelectedRowIds.value.indexOf(row.skuCode)
                        if (index > -1) {
                            dataState.currentDialogCheckedAll.splice(index, 1)
                        }
                    }
                })
            }
        }
    }
    // 如果当前一条都没有选中，表示都没有选中，则需要把当前页面的rows都遍历一下，splice掉没选中的
    if (selection.length === 0) {
        dataState.tableData.forEach((row) => {
            if (props.listType === 'costAccount') {
                const index = curSelectedRowIds.value.indexOf(row.budgetId)
                if (index > -1) {
                    dataState.currentDialogCheckedAll.splice(index, 1)
                }
            } else if (props.listType === 'goods') {
                const index = curSelectedRowIds.value.indexOf(row.skuCode)
                if (index > -1) {
                    dataState.currentDialogCheckedAll.splice(index, 1)
                }
            }
            // const index = curSelectedRowIds.value.indexOf(row.budgetId)
            // if (index > -1) {
            //     dataState.currentDialogCheckedAll.splice(index, 1)
            // }
        })
    }
}
const getMonth = () => {
    const datetime = new Date()
    const year = datetime.getFullYear()
    const month = datetime.getMonth() + 1 < 10 ? '0' + (datetime.getMonth() + 1) : datetime.getMonth() + 1
    dataState.searchData.budgetPeriod = year + '-' + month
}
const handleClose = () => {
    emit('handleClose', props.visible)
}

onMounted(() => {
    getMonth()
    getList()
})

// 成本账户选择行
const getCurrentRow = (row) => {
    dataState.currentDialogCheckedAll = row
}

const submit = () => {
    if (props.listType === 'costAccount') {
        if (dataState.currentDialogCheckedAll.length > 3) {
            ElMessage.warning('最多可选择3条')
            return
        }
    } else if (props.listType === 'goods') {
        if (dataState.currentDialogCheckedAll.length > 100) {
            ElMessage.warning('最多可选择100条')
            return
        }
    }
    emit('getDialogCheckedData', dataState.currentDialogCheckedAll, props.listIndex)
    handleClose()
}
// 商品分类级联查询
const goodsClassifyPropsList = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const params = {
            appKey: 'A1001001',
            busiCode: 'A1001004',
            sceneCode: '1',
            functionCode: 'functionCode',
            configCode: 'UC1657693343935QOjJ0',
            name: '应用类目层级查询',
            source: '商品中台',
            modifierId: userInfo.value.account,
            operatorId: userInfo.value.account,
            operatorName: userInfo.value.name,
            body: {
                appKey: 'A1001001',
                busiCode: 'A1001004',
                cateCode: data.value || '',
                level: level + 1
            }
        }
        const res = await getBusiCate(params)
        const nodes = res.map(item => {
            return {
                label: item.name,
                value: item.code,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
// 应用类目change
const goodsClassifyChange = (value) => {
    dataState.searchData.firstCateCode = value[0]
    dataState.searchData.secondCateCode = value[1]
    dataState.searchData.thirdCateCode = value[2]
}
const getRowKeys = (row) => {
    if (props.listType === 'costAccount') {
        return row.acctId
    } else if (props.listType === 'goods') {
        return row.skuId
    }
}
</script>
<style lang="scss" scoped>
</style>
