<template>
    <div class="rules-management">
        <!-- 标品等级规则管理 -->
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="130px">
                    <el-form-item label="规则编号" prop="ruleCode">
                        <el-input v-model="searchData.ruleCode" @keyup.enter="searchList" placeholder="请输入" clearable />
                    </el-form-item>

                    <el-form-item label="标品等级" prop="level">
                        <el-select v-model="searchData.level" clearable placeholder="请选择" >
                            <el-option label="全部" value="" />
                            <el-option label="L1" value="L1" />
                            <el-option label="L2" value="L2" />
                            <el-option label="L3" value="L3" />

                        </el-select>
                    </el-form-item>
                    <el-form-item label="三级基础类目名称" prop="thirdCateName">
                        <el-input v-model="searchData.thirdCateName" @keyup.enter="searchList" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="四级基础类目名称" prop="fourthCateName">
                        <el-input v-model="searchData.fourthCateName" @keyup.enter="searchList" placeholder="请输入" clearable />
                    </el-form-item>

                    <br>
                    <el-form-item class="button-box">

                        <el-button type="primary" @click="searchList">
                            搜索
                        </el-button>

                    </el-form-item>
                </el-form>
            </div>
            <div class="tableList-area">
                <system-list
                    :tHead="tHead"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.currentPage"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #ruleCode="scope">
                        <span  @click='catHandle(scope.row)' style="color:#328EED;cursor: pointer;">{{scope.row.ruleCode}}</span>
                    </template>
                    <template #button="scope">
                        <el-button type="primary" @click='editHandle(scope.row)'>编辑</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'

import { reactive, ref, onMounted, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import router from '@/router'

import { ElMessage, ElMessageBox } from 'element-plus'
// import { getLevelList } from '@/api/product-level-management/product-level'
import { getMerchantListCode } from '@/api/operate/index'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({

    tableData: [],
    searchData: {
        ruleCode: '', // 规则编号
        level: '', // 标品等级
        thirdCateName: '', // 三级品类name
        fourthCateName: '' // 四级品类name
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    addDialogVisible: false,
    editDialogVisible: false
})
const list = ref(null)
list.value = {
    code: '200',
    data: {
        totalCount: 30,
        pageSize: 10,
        currPage: 1,
        list: [{
            ruleCode: 'LR00000001',
            level: 'L1',
            thirdCateCode: '三级类目code',
            thirdCateName: '三级基础类目名称',
            fourthCateCode: '四级类目code',
            fourthCateName: '四级类目name	',
            ruleContent: 'AA&BBB&CCC&DDD&EEE&FFF&GGGG'

        }]

    }

}
const { tableData, searchData, pageinfo } = toRefs(dataState)

// 获取列表
const getList = async (key) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            currPage: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC38578188684451840',
        name: '标品等级查询V4',
        url: '/goods/spu/level/list/v4',
        source: '商品中台'

    }

    if (key === 'search') {
        param.body = {
            ...param.body,
            ...dataState.searchData

        }
        // console.log(newparams, 'pp')
    }
    const res = await getMerchantListCode(param) // 后续记得打开

    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.totalCount
    }
}
onMounted(() => {
    getList()
})
// 查询
const searchList = async () => {
    pageinfo.value.currentPage = 1
    getList('search')
}
// 查看详情
const catHandle = async (val) => {
    // 跳转到查看详情
    router.push({
        name: 'edit-rules',
        query: {
            id: val.ruleCode,
            type: 0
        }
    })
}

// 编辑
const editHandle = async (val) => {
    // 跳转到编辑页面
    router.push({
        name: 'edit-rules',
        query: {
            id: val.ruleCode,
            type: 1
        }
    })
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'ruleCode', label: '规则编号', width: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'level', label: '标品等级', width: 80 },
    { align: 'center', tooltip: true, prop: 'thirdCateCode', label: '三级基础类目编号', width: 150 },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级基础类目名称', width: 150 },
    { align: 'center', tooltip: true, prop: 'fourthCateCode', label: '四级基础类目编号', width: 150 },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级基础类目名称', width: 150 },
    { align: 'center', tooltip: true, prop: 'ruleContent', label: '规则内容', width: 170 },
    { align: 'center', prop: 'button', label: '操作', minWidth: 80, slot: true }
]
// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.currentPage = 1
    dataState.pageinfo.pageSize = val
    getList({ ...searchData.value })
}
// 当前也改变
const currentChange = (val) => {
    dataState.pageinfo.currentPage = val
    getList({ ...searchData.value })
}
</script>
<style lang="scss" scoped>
.register-user-list-page{
    .box-card{
        border: initial;
        .search-area{
            .el-form{
                .el-form-item{
                    width: 250px;
                }
                .form-item-time{
                    :deep(.el-date-editor){
                        flex: 1;
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
