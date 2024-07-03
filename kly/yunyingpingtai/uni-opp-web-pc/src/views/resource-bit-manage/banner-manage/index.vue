<template>
    <div class="role-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="banner名称" prop="title">
                        <el-input v-model="searchData.title" placeholder="请输入banner名称" clearable />
                    </el-form-item>
                    <el-form-item label="业务线" prop="busiCode">
                        <el-select v-model="searchData.busiCode" clearable placeholder="请选择" @change="busiChange">
                            <!-- <el-option label="恒生活APP" value="A1001" /> -->
                            <el-option v-for="item in busiCodeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="展示位置" prop="displaySite">
                        <el-select v-model="searchData.displaySite" clearable placeholder="请选择">
                            <!-- <el-option label="首页" value="HOME_BANNER" />
                            <el-option label="支付完成页" value="ORDER_FINISH_BANNER" /> -->
                            <el-option v-for="item in displaySite" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select v-model="searchData.status" clearable placeholder="请选择">
                            <el-option label="启用" value="1" />
                            <el-option label="停用" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="投放类型" prop="useType">
                        <el-radio-group v-model="searchData.useType">
                            <el-radio :label="2">广告</el-radio>
                            <el-radio :label="1">运营</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="上线时间" prop="time" class="cst-form-item">
                        <el-date-picker size="default" v-model="searchData.time" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间" />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="getList(true)">
                            查询
                        </el-button>
                        <el-button type="primary" @click="resetForm(formRef)">
                            重置
                        </el-button>
                        <el-button type="primary" @click="onAdd">
                            新增
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list :tHead="tHead" :tableData="tableData" v-model:current-page="pageInfo.pageNum" v-model:page-size="pageInfo.pageSize" :total="pageInfo.total" @size-change="sizeChange" @current-change="currentChange">
                    <template #imgUrl="scope">
                        <img :src="scope.row.imgUrl" alt="" style="height: 50px">
                    </template>
                    <template #displaySite="scope">
                        <!-- {{ scope.row.displaySite === 'HOME_BANNER' ? '首页' : '支付完成页'}} -->
                        {{ displaySiteAll.find(el => el.value === scope.row.displaySite).label }}
                    </template>
                    <template #busiCode="scope">
                        <span v-if="scope.row.busiCode === 'A1001'">恒生活APP</span>
                        <span v-else-if="scope.row.busiCode === 'A1002'">恒生活智能货柜小程序</span>
                        <span v-else-if="scope.row.busiCode === 'A1001006'">恒生活智能货柜小程序</span>
                        <span v-else-if="scope.row.busiCode === 'A1001005'">进货商城</span>
                        <span v-else>{{scope.row.busiCode}}</span>
                    </template>
                    <template #status="scope">
                        {{ scope.row.status === 1 ? '启用' : '停用' }}
                    </template>
                    <!-- <template #displaySite="scope">
                        {{scope.row}}
                        {{ displaySiteAll.find(el => el.value === scope.row.displaySite).label }}
                    </template> -->
                    <template #time="scope">
                        {{ scope.row.startTime }} - {{ scope.row.endTime }}
                    </template>
                    <template #operation="scope">
                        <el-button @click="onEdit(scope.row)" type="primary" link>编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
        <cst-form v-model="visible" v-if="visible" :type="dataState.dialogType" :resourceCode="dataState.resourceCode" @getList="getList"></cst-form>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { onMounted, reactive, ref, toRefs, watch } from 'vue'
import { bannerRequestList } from '@/api/banner'
import CstForm from './src/form.vue'
import { busiCodeList, AppDisplaySite, wxAppDisplaySite, displaySiteAll } from './src/index'
import { tHead } from './index'

const dataState = reactive({
    tableData: [],
    resourceCode: null,
    visible: false,
    dialogType: null,
    currentVal: null,
    searchData: {
        time: [], // 时间
        title: '', // banner名称
        displaySite: null, // 展示位置
        busiCode: '', // 业务线
        status: null, // 状态
        useType: '' // 投放类型
    }
})

const displaySite = ref([])

const pageInfo = ref({
    total: 0,
    pageNum: 1,
    pageSize: 10
})
const { tableData, searchData, visible, dialogType, currentVal } = toRefs(dataState)

onMounted(async () => {
    await getList()
})

// 获取列表
const getList = async (reset = false) => {
    if (reset) (pageInfo.value.pageNum = 1)
    console.log(searchData, 'searchData')
    const params = {
        ...searchData.value,
        startTime: searchData.value.time?.length ? searchData.value.time[0] : '',
        endTime: searchData.value.time?.length ? searchData.value.time[1] : '',
        // sceneCode: 'A1001004',
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize

    }
    delete params.time
    const res = await bannerRequestList(params)
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
    pageInfo.value.pageNum = 1
    pageInfo.value.pageSize = val
    getList()
}

// 当前页改变
const currentChange = (val) => {
    pageInfo.value.pageNum = val
    getList()
}
// 弹出新增页
const onAdd = () => {
    dataState.visible = true
    dataState.dialogType = 'add'
}
// 弹出编辑页
const onEdit = (row) => {
    dataState.resourceCode = row.resourceCode
    dataState.currentVal = row
    dataState.visible = true
    dataState.dialogType = 'edit'
}

const busiChange = val => {
    console.log(val)
    dataState.searchData.displaySite = ''
    displaySite.value = val === 'A1001' ? AppDisplaySite : wxAppDisplaySite
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
.role-page .box-card .search-area .el-form .cst-form-item {
    width: 400px;
}
</style>
