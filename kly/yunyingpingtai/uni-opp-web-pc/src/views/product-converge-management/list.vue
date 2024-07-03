<template>
    <div class="rules-management">
        <!-- 标品等级规则管理 -->
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="130px">
                    <el-form-item label="聚合规则编号" prop="ruleCode">
                        <el-input v-model="searchData.ruleCode" @keyup.enter="searchList" placeholder="精确拼配" clearable />
                    </el-form-item>

                    <el-form-item label="三级基础类目名称" prop="thirdCateName">
                        <el-input v-model="searchData.thirdCateName" @keyup.enter="searchList" placeholder="支持模糊查询" clearable />
                    </el-form-item>
                    <el-form-item label="四级基础类目名称" prop="fourthCateName">
                        <el-input v-model="searchData.fourthCateName" @keyup.enter="searchList" placeholder="支持模糊查询" clearable />
                    </el-form-item>
                    <el-form-item label="规则状态" prop="ruleStatus">
                        <el-select v-model="searchData.ruleStatus" clearable placeholder="请选择" >
                            <el-option
                                v-for="item in selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                            <!-- <el-option label="全部" value="" />
                            <el-option label="启用" value="1" />
                            <el-option label="停用" value="0" /> -->

                        </el-select>
                    </el-form-item>
                    <el-form-item label="聚合规则" prop="ruleDetail">
                        <el-input v-model="searchData.ruleDetail" @keyup.enter="searchList" placeholder="支持模糊查询" clearable />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="addHandle">
                            创建
                        </el-button>
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
                        <span  @click='editHandle(scope.row,"cat")' style="color:#328EED;cursor: pointer;">{{scope.row.ruleCode}}</span>
                    </template>
                    <template #ruleStatus="scope">

                        <span>{{scope.row.ruleStatus===0?'停用':scope.row.ruleStatus===1?'启用': ''}}</span>
                    </template>
                    <template #button="scope">

                        <el-button v-if="scope.row.ruleStatus === 1" type="primary" @click='stopList(scope.row,0)'> 停用</el-button>
                        <el-button v-if="scope.row.ruleStatus === 0" type="primary" @click='stopList(scope.row,1)'> 启用</el-button>
                        <el-button type="primary" @click='editHandle(scope.row,"edit")'>编辑</el-button>
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
        ruleCode: '', // 聚合规则编号
        thirdCateName: '', // 三级品类编号
        fourthCateName: '', // 四级品类编号
        ruleStatus: '', // 0停用、1启用 '' 为全部
        ruleDetail: '' // 规则详情
    },
    pageinfo: {
        total: 0,
        currentPage: 1,
        pageSize: 10
    },
    selectList: [
        {
            value: '',
            label: '全部'
        }, {
            value: '1',
            label: '启用'
        }, {
            value: '0',
            label: '停用'
        }
    ],
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
            ruleContent: 'AA&BBB&CCC&DDD&EEE&FFF&GGGG',
            ruleStatus: 0, // 启用
            mergeTime: '聚合时间',
            ruleDetail: '规则内容'

        }, {
            ruleCode: 'LR00000002',
            thirdCateCode: '三级类目code1',
            thirdCateName: '三级基础类目名称2',
            fourthCateCode: '四级类目code1',
            fourthCateName: '四级类目name2	',
            ruleContent: 'EE&&TT￥###',
            ruleStatus: 1, // 启用
            mergeTime: '聚合时间',
            ruleDetail: '规则内容'

        }]

    }

}
const { tableData, searchData, pageinfo, selectList } = toRefs(dataState)

// 获取列表
const getList = async (obj, val) => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            currPage: pageinfo.value.currentPage,
            pageSize: pageinfo.value.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42973728959934464',
        name: '商品聚合规则管理列表',
        url: '/goods/spu/merge/rule/list/v1',
        source: '商品中台'

    }

    // 启用停用
    if (obj === 'search') {
        const { val } = obj
        param.body = {
            ...param.body,
            ...searchData.value

        }

        console.log(param, 'param==')
    }
    // dataState.tableData = list.value.data.list
    // dataState.pageinfo.total = list.value.data.pageSize
    const res = await getMerchantListCode(param)

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

const stopList = async (val, type) => {
    pageinfo.value.currentPage = 1
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            ruleCode: val.ruleCode,
            ruleStatus: type
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC43653526037504000',
        name: '商品聚合规则管理列表(停用or启用)',
        url: '/goods/spu/merge/rule/status/v1',
        source: '商品中台'

    }
    // dataState.pageinfo.total = list.value.data.pageSize
    const res = await getMerchantListCode(param)

    if (res.code === '200') {
        ElMessage.success(res.message)
        getList()
    }
}
// 查看详情
const catHanle = async (val) => {
    // 跳转到查看详情
    router.push({
        name: 'edit-rules',
        query: {
            id: val.ruleCode,
            type: 0
        }
    })
}
// 创建
const addHandle = async (val) => {
    // 创建
    router.push({
        name: 'product-converge-rules-add'
        // query: {
        //     id: val.ruleCode,
        //     type: 0
        // }
    })
}

// 编辑
const editHandle = async (val, type) => {
    // 跳转到编辑页面
    router.push({
        name: 'product-converge-rules-add',
        query: {
            id: val.ruleCode,
            type: type
        }
    })
}
const tHead = [
    { align: 'center', tooltip: true, prop: 'ruleCode', label: '聚合规则编号', width: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'thirdCateCode', label: '三级基础类目编号', width: 180 },
    { align: 'center', tooltip: true, prop: 'thirdCateName', label: '三级基础类目名称', width: 180 },
    { align: 'center', tooltip: true, prop: 'fourthCateCode', label: '四级基础类目编号', width: 180 },
    { align: 'center', tooltip: true, prop: 'fourthCateName', label: '四级基础类目名称', width: 180 },
    { align: 'center', tooltip: true, prop: 'spuTemplate', label: '属性模板', width: 180 },
    { align: 'center', tooltip: true, prop: 'ruleDetail', label: '规则内容', width: 270 },
    { align: 'center', tooltip: true, prop: 'mergeTime', label: '执行聚合时间', width: 180 },
    { align: 'center', tooltip: true, prop: 'ruleStatus', label: '规则状态', width: 180, slot: true },
    { align: 'center', prop: 'button', label: '操作', minWidth: 180, slot: true }
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
