<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="50px">
                    <el-form-item label="状态" prop="ratioStatus" >
                        <el-select v-model="searchData.ratioStatus" clearable placeholder="请选择">
                            <el-option v-for="(item,index) in ratioStatusData" :key="index" :label=item.name :value=index></el-option>
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" v-if="checkRole('distri-ratio-query')" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary"  @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" v-if="checkRole('distri-ratio-new')" @click="onAdd(formRef)">
                            新建
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.page" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #ratioStatus="scope">
                        <template v-for="(span, index) in ratioStatusData" :key="index">
                            <span v-if="scope.row.ratioStatus === index" :style="{color:span.color}">{{span.name}}</span>
                        </template>
                        <!-- {{scope.row.ratioStatus === 0 ? '未生效' : scope.row.ratioStatus === 1 ? '生效中' : '已失效'}} -->
                    </template>
                    <template #cmnType="scope">
                        <span v-show="scope.row.cmnType === 1 ">一级分销</span>
                        <span v-show="scope.row.cmnType === 2 ">二级分销</span>
                        <span v-show="scope.row.cmnType === 3 ">三级分销</span>
                    </template>
                    <template #operation="scope">
                        <el-button v-if="checkRole('distri-ratio-edit')&&scope.row.ratioStatus !== 2" @click="onEdit(scope.row)" type="primary" link>编辑</el-button>
                        <el-button v-if="checkRole('distri-ratio-edit')&&scope.row.ratioStatus === 2" @click="onEdit(scope.row)" type="primary" link disabled style="color:#ccc">编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <cst-form v-model="visible" v-if="visible" :type="dataState.dialogType"  :row="dataState.row" @getList="getList"></cst-form>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs } from 'vue'
import { proportionList } from '@/api/distributionManagement'
import CstForm from './src/form.vue'
import { checkRole } from '@/utils'

const tHead = [
    { align: 'center', prop: 'cmnType', label: '分销模式', width: 80, slot: true },
    { align: 'center', prop: 'ratioLevelFirst', label: '一级分销比例', minWidth: 120 },
    { align: 'center', prop: 'ratioLevelSecond', label: '二级分销比例', minWidth: 120 },
    { align: 'center', prop: 'ratioStatus', label: '状态', minWidth: 150, slot: true },
    { align: 'center', prop: 'ratioStartTime', label: '开始生效时间', minWidth: 120 },
    { align: 'center', prop: 'ratioEndTime', label: '失效时间', minWidth: 150 },
    { align: 'center', prop: 'gmtCreate', label: '创建时间', minWidth: 150 },
    { align: 'center', prop: 'creatorId', label: '操作员', minWidth: 120 },
    { align: 'center', prop: 'operation', label: '操作', minWidth: 150, fixed: 'right', slot: true }
]

const dataState = reactive({
    tableData: [],
    row: null,
    resourceCode: null,
    currentVal: null,
    visible: false,
    dialogType: null,
    searchData: {
        userMobile: null, // 手机号
        cmnType: null, // 名称
        ratioStatus: null // 状态
    }
})
const ratioStatusData = [
    { name: '未生效', color: '#1781b5' },
    { name: '生效中', color: '#41ae3c' },
    { name: '已失效', color: '#dad4cb' }
]

const pageInfo = ref({
    total: 0,
    page: 1,
    pageSize: 10
})
const { tableData, searchData, visible, dialogType, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.page = 1)
    const params = {
        ...searchData.value,
        page: pageInfo.value.page,
        pageSize: pageInfo.value.pageSize

    }
    const res = await proportionList(params)
    console.log(res)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

// 页数改变
const sizeChange = (val) => {
    pageInfo.value.page = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.page = val
    getList()
}

// 弹出新增页
const onAdd = () => {
    dataState.visible = true
    dataState.dialogType = 'add'
}

// 弹出编辑页
const onEdit = (row) => {
    dataState.row = row
    console.log(dataState.row)
    dataState.resourceCode = row.resourceCode
    dataState.currentVal = row
    dataState.visible = true
    dataState.dialogType = 'edit'
}

</script>
<style lang="scss" scoped>
.role-page{
    .el-table tr{
        height: 50px;
    }
    .el-select{
        :deep(.el-select__tags-text){
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
            justify-content: flex-start;
        }
    }
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
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
            // color: rgb(68, 187, 131);
        }
    }
}
</style>
