<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="搜索分类名称" prop="busiFirstCateName">
                        <el-input v-model="searchData.busiFirstCateName" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="gitBusiCateList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange" :row-key="getRowKey">
                    <template #operation="scope">
                        <el-button  v-if="scope.row.exist === 0 || scope.row.exist === null" @click="onAdd(scope.row)" type="primary" link>添加分类</el-button>
                        <el-button v-else type="primary" link>已添加</el-button>
                    </template>
                    <template #scene>
                        到家
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { busiCateList } from '@/api/banner'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({
    tableData: [],
    visible: false,
    searchData: {
        busiFirstCateName: null // 名称
    }
})

const getRowKey = (row) => {
    return row.id
}

const typeFrom = ref({
    name: null,
    source: null,
    modifierId: null,
    creatorId: null
})

const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})
const { tableData, searchData, organizationDatas } = toRefs(dataState)

// 获取分类列表
const gitBusiCateList = async (reset = false) => {
    if (reset) (pageInfo.value.pageNum = 1)
    const params = {
        ...searchData.value,
        displaySite: 'HOME_CATEGORY',
        sceneCode: 'A1001004',
        currPage: pageInfo.value.currentPage,
        pageSize: pageInfo.value.pageSize
    }
    const res = await busiCateList(params)
    dataState.tableData = res.data.list
    pageInfo.value.total = res.data.totalCount
}
gitBusiCateList()

// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    gitBusiCateList()
}

const tHead = [
    { align: 'center', type: 'selection', reserveSelection: true, minWidth: 60 },
    { align: 'center', tooltip: true, prop: 'busiFirstCateName', label: '分类名称', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'scene', label: '适用场景', minWidth: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'operation', label: '操作', fixed: 'right', minWidth: 120, slot: true }
]
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    gitBusiCateList()
}

// 当前也改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    gitBusiCateList()
}

const onAdd = async (row) => {
    sessionStorage.setItem('GOODS_CATE', JSON.stringify(row))
    router.push({ name: 'commodity-category-manage-modify', params: { targetId: row.busiFirstCateCode } })
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
