<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="80px">
                    <el-form-item label="业务线" prop="busiCode">
                        <!-- <el-input v-model="searchData.business" placeholder="请输入" clearable /> -->
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择">
                            <el-option label="恒生活APP" value="A1001" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option label="启用" value="1" />
                            <el-option label="停用" value="0" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <router-link :to="{name: 'commodity-category-manage-newly'}" custom v-slot="{ navigate }">
                            <el-button @click="navigate" type="primary">新增</el-button>
                        </router-link>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #imgUrl="scope">
                        <img :src="scope.row.imgUrl" alt="" style="white:200px; height:60px">
                    </template>
                    <template #busiCode="scope">
                        {{ scope.row.busiCode === 'A1001' ? '恒生活APP' : scope.row.busiCode }}
                    </template>
                    <template #status="scope">
                        {{ scope.row.status === 1 ? '启用' : '停用' }}
                    </template>
                    <template #operation="scope">
                        <router-link :to="{name: 'commodity-category-manage-modify', params: {id: scope.row.resourceCode, targetId: scope.row.targetId}}" custom v-slot="{ navigate }">
                            <el-button @click="navigate" type="primary" link>编辑</el-button>
                        </router-link>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs } from 'vue'
import { aggregateList } from '@/api/banner'

const dataState = reactive({
    organizationDatas: [],
    tableData: [],
    searchData: {
        busiCode: null,
        status: null
    }
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageNum: 0,
    pageSize: 10
})
const { tableData, searchData, organizationDatas } = toRefs(dataState)

// 获取资源位信息列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)

    const params = Object.assign({
        ...searchData.value,
        displaySite: 'HOME_CATEGORY',
        sceneCode: 'A1001004',
        pageNum: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    const res = await aggregateList(params)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'sort', label: '排序', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'title', label: '分类基础名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'targetName', label: '分类应用名称', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'imgUrl', label: 'ICON', minWidth: 100, slot: true },
    { align: 'center', tooltip: true, prop: 'busiCode', label: '业务线', minWidth: 120, slot: true },
    { align: 'center', tooltip: true, prop: 'status', label: '状态', minWidth: 60, slot: true },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '操作人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', fixed: 'right', minWidth: 120, slot: true }
]
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getList()
}

</script>
<style lang="scss" scoped>
.role-page{
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
                .form-item-time{
                    width: 535px;
                    :deep(.el-date-editor){
                        flex: 1;
                    }
                    :deep(.el-form-item__content){
                        .el-range-editor.el-input__inner{
                            padding: 0 10px;
                        }
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
