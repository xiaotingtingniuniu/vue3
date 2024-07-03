<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="80px">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model.trim="searchData.name" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="组织" prop="organizationName" style="width: 280px">
                        <!-- 这里需要改成模糊查询 -->
                        <!-- <el-select v-model="searchData.organizationIds" clearable placeholder="请选择" multiple collapse-tags collapse-tags-tooltip>
                            <el-option v-for="el in organizationDatas" :label="el.name" :value="el.id" :key="el.code" />
                        </el-select> -->
                        <!--<el-tree-select
                            v-model="searchData.organizationIds"
                            :data="organizationLists"
                            multiple
                            :collapse-tags="true"
                            :props="{label: 'name', value: 'id'}"
                            :render-after-expand="false"
                            clearable
                        >
                        </el-tree-select>-->
                        <el-input v-model.trim="searchData.organizationName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="状态" prop="state">
                        <el-select v-model="searchData.state" clearable placeholder="请选择">
                            <el-option label="启用" value="1" />
                            <el-option label="停用" value="0" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button v-if="checkRole('permission-7')" type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <router-link v-if="checkRole('permission-8')" :to="{name: 'authority-role-newly', params: {type: 'add', id: ''}}" custom v-slot="{ navigate }">
                            <el-button @click="navigate" type="primary">新增</el-button>
                        </router-link>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #state="scope">
                        {{ scope.row.state === 1 ? '启用' : '停用' }}
                    </template>
                    <template #operation="scope">
                        <!--  v-if="checkRole('permission-12') && scope.row.superRole !== 1" -->
                        <router-link v-if="checkRole('permission-12')" :to="{name: 'authority-role-newly', params: {id: scope.row.id, type: 'edit'}}" custom v-slot="{ navigate }">
                            <el-button @click="navigate" type="primary" link>编辑</el-button>
                        </router-link>
                        <router-link v-if="checkRole('permission-14')" :to="{name: 'authority-role-newly', params: {id: scope.row.id, type: 'detail'}}" custom v-slot="{ navigate }">
                            <el-button @click="navigate" type="primary" link>详情</el-button>
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
import { organizationList, roleList } from '@/api/authority'
import { checkRole } from '@/utils'
import { organizationLists, getOrganizationTree } from './index'

getOrganizationTree()
const dataState = reactive({
    organizationDatas: [],
    organizationLists: [],
    tableData: [],
    searchData: {
        name: null, // 角色名称
        // organizationIds: [], // 组织 ID 逗号分隔
        organizationName: null,
        state: null // 状态
    }
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const { tableData, searchData, organizationDatas } = toRefs(dataState)

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const params = Object.assign({
        ...searchData.value,
        curPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    })
    // }, { organizationIds: searchData.value.organizationIds.length ? searchData.value.organizationIds.join(',') : null })
    const res = await roleList(params)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.totalCount
    }
}
getList()

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'id', label: '角色ID', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'name', label: '角色名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'detail', label: '角色说明', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'organizationName', label: '所属组织', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'createAt', label: '创建时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'createBy', label: '创建人', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'modifyAt', label: '修改时间', minWidth: 150 },
    { align: 'center', tooltip: true, prop: 'modifyBy', label: '修改人', minWidth: 100 },
    { align: 'center', tooltip: true, prop: 'state', label: '状态', minWidth: 60, slot: true },
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
