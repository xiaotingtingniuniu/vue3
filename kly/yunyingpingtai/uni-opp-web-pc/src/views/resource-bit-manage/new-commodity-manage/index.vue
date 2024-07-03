<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="80px">
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="商品状态" prop="isEnabled">
                                <el-select v-model="searchData.isEnabled" clearable placeholder="请选择">
                                    <el-option label="上架" value="1" />
                                    <el-option label="下架" value="0" />
                                </el-select>
                            </el-form-item>
                            <el-form-item class="button-box">
                                <el-button type="primary" @click="getList(true)">
                                    查询
                                </el-button>
                                <el-button type="primary" @click="resetForm(formRef)">
                                    重置
                                </el-button>
                                <el-button type="primary" @click="getSkuList()">
                                    新增
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.currentPage" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #banner="scope">
                        <img :src="scope.row.banner" alt="">
                    </template>
                    <template #isEnabled="scope">
                        {{ scope.row.isEnabled === 1 ? '上架' : '下架' }}
                    </template>
                    <template #operation="scope">
                        <el-button @click="onModify(scope.row)" type="primary" link>编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <goods-dialog v-if="visible" v-model="visible" :current-val="dataState.currentVal" @confirm="confirm"></goods-dialog>

        <el-dialog title="新增" v-model="dialogTableVisible">
            <el-form ref="formRefs" :model="dataState.searchDatas" :inline="true" label-position="right" label-width="100px">
                <el-form-item label="搜索商品名称" prop="skuName">
                    <el-input v-model="dataState.searchDatas.skuName" placeholder="请输入" clearable />
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="getSkuList(true)">
                        搜索
                    </el-button>
                    <el-button type="primary" @click="addResetForm">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
            <div v-if="tableDatas==false" style="text-align:center;font-size:25px;font-weight:800">
                搜索商品为空
            </div>
            <system-list v-else :tHead="addHead" :tableData="tableDatas" v-model:current-page="addPageInfo.currentPage" v-model:page-size="addPageInfo.pageSize" :total="addPageInfo.total" @size-change="addSizeChange" @current-change="addCurrentChange">
                <template #banner="scope">
                    <img :src="scope.row.banner" alt="">
                </template>
                <template #supplierType>
                    到家
                </template>
                <template #operation="scope">
                    <el-button v-if="scope.row.existHot===0" @click="addHot(scope.row)" type="primary" link>添加</el-button>
                    <el-button v-else type="primary" link>已添加</el-button>
                </template>
            </system-list>
        </el-dialog>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs } from 'vue'
import { useStore } from 'vuex'
import { tHead, addHead } from './index.js'
import { hotGoodsSelect, hotGoodsUpdata, hotGoodsAdd, sukListSelect } from '@/api/resource-niche'
import { ElMessage, ElMessageBox } from 'element-plus'
import GoodsDialog from '../components/goods-dialog/index.vue'
const store = useStore()
const dataState = reactive({
    organizationDatas: [],
    organizationLists: [],
    tableData: [],
    tableDatas: [],
    searchData: {
        type: 3, // 角色名称
        appKey: 'A1001001',
        busiCode: 'A1001004',
        isEnabled: null // 状态
    },
    searchDatas: {
        skuName: null
    },
    currentVal: {}
})
const pageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})

const addPageInfo = ref({
    total: 0,
    currentPage: 1,
    pageSize: 10
})

const formRefs = ref(null)
const visible = ref(false)
const dialogTableVisible = ref(false)
const { tableData, tableDatas, searchData, searchDatas, organizationDatas } = toRefs(dataState)
// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.currentPage = 1)
    const params = Object.assign({
        ...searchData.value,
        page: {
            pageNo: pageInfo.value.currentPage,
            pageSize: pageInfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001004'
    })
    const res = await hotGoodsSelect(params)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        pageInfo.value.total = res.data.total
    }
}
getList()
const getSkuList = async (reset = false) => {
    dialogTableVisible.value = true
    if (reset) (addPageInfo.value.currentPage = 1)
    const params = Object.assign({
        // ...searchData.value,
        currPage: addPageInfo.value.currentPage,
        pageSize: addPageInfo.value.pageSize,
        skuName: dataState.searchDatas.skuName,
        type: 3,
        appKey: 'A1001001',
        busiCode: 'A1001004',
        firstChannel: 1
    })
    const res = await sukListSelect(params)
    if (res.code === '200') {
        dataState.tableDatas = res.data.list
        addPageInfo.value.total = res.data.total
    }
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getList()
}

const addResetForm = () => {
    if (!formRefs.value) return
    formRefs.value.resetFields()
}

const handleSelectionChange = (val) => {
    this.multipleSelection = val
}
// 页数改变
const sizeChange = (val) => {
    pageInfo.value.currentPage = 1
    pageInfo.value.pageSize = val
    getList()
}
// 添加列表页数改变
const addSizeChange = (val) => {
    addPageInfo.value.currentPage = 1
    addPageInfo.value.pageSize = val
    getSkuList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.currentPage = val
    getList()
}

// 添加列表当前页改变
const addCurrentChange = (val) => {
    addPageInfo.value.currentPage = val
    getSkuList()
}

const onModify = (row) => {
    dataState.currentVal = row
    visible.value = true
}
// 添加
const addHot = async (row) => {
    const params = Object.assign({
        skuId: row.skuId,
        skuName: row.skuName,
        type: 3,
        isEnabled: 1,
        orderNum: 1,
        creatorId: store.state.userInfo.name,
        appKey: 'A1001001',
        busiCode: 'A1001004'
    })
    await hotGoodsAdd(params)
    getSkuList()
    getList()
}

const confirm = async (val) => {
    const param = {
        skuId: val.skuId,
        type: val.type,
        appKey: 'A1001001',
        busiCode: 'A1001004',
        orderNum: val.orderNum,
        isEnabled: val.isEnabled,
        operatorId: store.state.userInfo.name,
        isDeleted: val.isDeleted
    }
    const res = await hotGoodsUpdata(param)
    if (res.code === '200') {
        ElMessage({
            message: '修改成功',
            type: 'success'
        })
        visible.value = false
        getList()
    }
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
