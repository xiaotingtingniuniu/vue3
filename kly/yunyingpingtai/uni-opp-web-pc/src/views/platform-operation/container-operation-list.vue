<template>
    <div>
        <el-form ref="formRef" :model="formData" :inline="true" label-position="right" label-width="130px">
            <el-form-item label="选择城市" prop="cityIds">
                <el-cascader
                    ref="authorityRef"
                    :props="selCitysProp"
                    @change="selCitysChange"
                    v-model="dataState.selCitysChecked"
                    width="100%"
                    clearable
                />
            </el-form-item>
            <el-form-item class="button-box">
                <el-button @click="searchList" type="primary">查询</el-button>
                <el-button @click="resetForm" type="primary">重置</el-button>
            </el-form-item>
        </el-form>
        <el-tabs
            v-model="activeName"
            type="card"
            class="demo-tabs"
            @tab-click="handleClick">
            <el-tab-pane :label="item.tabname" :name="item.mappingType" v-for="(item,index) in tablist" :key='index'>
                <div>
                    <system-list
                        :tHead="item.tHead"
                        :tableData="tableData"
                        v-model:current-page="pageInfo.currentPage"
                        v-model:page-size="pageInfo.pageSize"
                        :total="pageInfo.total"
                        @size-change="sizeChange"
                        @current-change="currentChange">
                        <template #operation="row">
                            <el-button text v-if="formData.mappingType === 1 && checkRole('cabinet-operate-area-manage')" @click="editBtn(row.row, 1)" type="primary">管理大区总</el-button>
                            <el-button text v-if="formData.mappingType === 1 && checkRole('cabinet-operate-area-modify')" @click="editBtn(row.row, 4)" type="primary">修改运营人员</el-button>
                            <el-button text v-if="formData.mappingType === 2 && checkRole('cabinet-operate-city-manage')" @click="editBtn(row.row, 2)" type="primary">管理城市经理</el-button>
                            <el-button text v-if="formData.mappingType === 2 && checkRole('cabinet-operate-city-modify')" @click="editBtn(row.row, 3)" type="primary">修改运营人员</el-button>
                        </template>
                    </system-list>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <edit-form v-model="editVisible" v-if="editVisible" :type="dataState.dialogType" :title="Title"  :row="dataState.row" @getList="getTableList"></edit-form>
</template>
<script setup>
import { ref, computed, onMounted, reactive, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useStore } from 'vuex'
import { getAllList } from '@/api/platformOperation/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { cityQueryCategory, checkRole } from '@/utils'
import EditForm from './form/form.vue'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const pageInfo = ref({
    total: null,
    currentPage: 1,
    pageSize: 10
})
// tab 默认值切换
const activeName = ref(1)
const dataState = reactive({
    formData: {
        cityIds: '',
        mappingType: 1
    },
    tablist: [
        {
            tabname: '战区',
            mappingType: 1,
            tHead: [
                { align: 'center', tooltip: true, prop: 'organizationName', label: '大区', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'userName', label: '大区总', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'mobile', label: '手机号', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'account', label: '工号', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'createBy', label: '创建人', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'createAt', label: '创建时间', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'modifyBy', label: '修改人', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'modifyAt', label: '修改时间', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 400, slot: true }
            ]
        },
        {
            tabname: '城市',
            mappingType: 2,
            tHead: [
                { align: 'center', tooltip: true, prop: 'parentOrgName', label: '所属大区', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'organizationName', label: '城市', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'userName', label: '城市经理姓名', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'mobile', label: '手机号', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'account', label: '工号', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'createBy', label: '创建人', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'createAt', label: '创建时间', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'modifyBy', label: '修改人', minWidth: 120 },
                // { align: 'center', tooltip: true, prop: 'modifyAt', label: '修改时间', minWidth: 120 },
                { align: 'center', tooltip: true, prop: 'operation', label: '操作', minWidth: 400, slot: true }
            ]
        }
    ],
    tableData: [],
    tHead: [],
    row: {}
})
const { formData, tablist, tableData, row } = toRefs(dataState)
const editVisible = ref(false)
onMounted(async () => {
    await getTableList()
})
// 搜索数据
const searchList = () => {
    pageInfo.value.currentPage = 1
    getTableList()
}
// 切换TAB
const handleClick = (tab, event) => {
    dataState.formData.mappingType = tab.props.name
    pageInfo.value.currentPage = 1
    getTableList()
}

// 选择城市联动
const selCitysProp = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
const authorityRef = ref(null)
// 选择城市change
const selCitysChange = (value) => {
    if (value.length > 150) {
        ElMessageBox.confirm(
            '选择城市数量不能超过150个!',
            '提示',
            {
                confirmButtonText: '确定'
            }
        )
        return
    }
    formData.ruleDetails = []
    dataState.selCitysCheckedNodes = authorityRef.value.getCheckedNodes(true)
    if (dataState.selCitysCheckedNodes.length === 1) {
        formData.ruleDetails += dataState.selCitysCheckedNodes[0].pathValues[1]
    } else {
        dataState.selCitysCheckedNodes.forEach((item, index) => {
            if (index === dataState.selCitysCheckedNodes.length - 1) {
                formData.ruleDetails += item.pathValues[1]
            } else {
                formData.ruleDetails += item.pathValues[1] + ','
            }
        })
    }
    if (formData.ruleDetails.length > 0) {
        dataState.formData.cityIds = formData.ruleDetails
    } else {
        dataState.formData.cityIds = ''
    }
}
// 重置
const formRef = ref(null)
const resetForm = async () => {
    authorityRef.value.handleClear(true)
    dataState.formData.cityIds = ''
}
// 获取平台运营员工列表
const getTableList = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001002',
        mappingType: dataState.formData.mappingType,
        cityIds: dataState.formData.cityIds,
        // cityIds: '110100000000,120100000000',
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await getAllList(param)
    tableData.value = res.data.list
    pageInfo.value.total = res.data.totalCount
}
// 编辑
const editBtn = (row, num) => {
    dataState.row = row
    dataState.row.ruleType = num
    editVisible.value = true
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getTableList()
}
// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getTableList()
}

</script>
<style lang="scss" scoped>
a{
    text-decoration-line: none;
}
.edit-btn{
    color: #ffffff;
    margin-right: 10px;
}
.text-btn{
    color: rgb(254, 44, 85);
    margin: auto !important;
    cursor:pointer;
}
.db{
    display: block;
}
</style>
