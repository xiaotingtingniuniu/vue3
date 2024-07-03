<template>
    <div class="rules-management">
        <!-- 标品等级规则管理 -->
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="130px">
                    <el-form-item label="聚合规则编号" prop="ruleCode">
                        <el-input v-model="searchData.ruleCode" @keyup.enter="searchList" placeholder="精确拼配" clearable />
                    </el-form-item>

                    <el-form-item label="聚合标品编号" prop="mergeSpuCode">
                        <el-input v-model="searchData.mergeSpuCode" @keyup.enter="searchList" placeholder="精确拼配" clearable />
                    </el-form-item>
                    <el-form-item label="SPU 编号" prop="spuId">
                        <el-input v-model="searchData.spuId" @keyup.enter="searchList" placeholder="精确拼配" clearable />
                    </el-form-item>
                    <el-form-item label="标品名称" prop="spuName">
                        <el-input v-model="searchData.spuName" @keyup.enter="searchList" placeholder="模糊搜索" clearable />
                    </el-form-item>
                    <el-form-item label="聚合状态" prop="mergeStatus">
                        <el-select v-model="searchData.mergeStatus" clearable placeholder="请选择" >
                            <el-option
                                v-for="item in selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />

                        </el-select>
                    </el-form-item>
                    <el-form-item label="69码" prop="barcode">
                        <el-input v-model="searchData.barcode" @keyup.enter="searchList" placeholder="精确拼配" clearable />
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
                        <span  @click='hanldeRule(scope.row,"cat")' style="color:#328EED;cursor: pointer;">{{scope.row.ruleCode}}</span>
                    </template>
                    <template #spuId="scope">
                        <span  @click='handleSpuList(scope.row,"cat")' style="color:#328EED;cursor: pointer;">{{scope.row.spuId}}</span>
                    </template>
                    <template #mergeStatus="scope">
                        <span  @click='handleSpu(scope.row,"cat")'>{{scope.row.mergeStatus===0?'当前spu参与聚合规则':scope.row.mergeStatus===1?'spu不参聚合': scope.row.mergeStatus===2?'spu不参与当前聚合':''}}</span>
                    </template>

                    <template #resultId="scope">
                        <el-button class="text-btn db" @click="checkModel(scope.row)" type="primary" text>模型训练媒体文件</el-button>

                    </template>

                    <template #logoUrl="scope">
                        <img v-if="scope.row.logoUrl" :src="scope.row.logoUrl" alt="" style="width: 100px;">
                    </template>
                    <template #button="scope">

                        <el-button type="primary" @click='configHandle(scope.row,"config")'>设置</el-button>
                    </template>
                </system-list>
                <el-dialog v-model="dialogVisible" width="30%">
                    <el-form ref="formRef" :model="formData" label-position="left" label-width="20px" class="forms">
                        <el-form-item prop="type">
                            <h3> 选择聚合状态</h3>
                            <el-radio-group v-model="formData.type">
                                <el-radio :label="0"> 参与当前聚合规则</el-radio>
                                <el-radio :label="1">不参与任何聚合规则</el-radio>
                                <el-radio :label="2">不参与当前聚合，参与其他聚合规则</el-radio>

                            </el-radio-group>
                        </el-form-item>

                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogVisible=false">取消</el-button>
                            <el-button @click="save" type="primary">确认</el-button>
                        </span>
                    </template>
                </el-dialog>

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
const checked = ref(true)
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dataState = reactive({

    tableData: [],
    dialogVisible: false,
    searchData: {
        ruleCode: '', // 聚合规则编号
        mergeSpuCode: '', // 聚合标品编号
        spuId: '', // 标品编号
        spuName: '', // 标品名称
        barcode: '', // 69码
        mergeStatus: '' // 聚合状态
    },
    formData: {
        type: 0
    },
    setConfig: {},

    rowList: {},
    type: '',
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
            label: '当前SPU不参与当前聚合规则，也不参与其他聚合规则'
        }, {
            value: '0',
            label: '当前SPU参与聚合规则'
        }, {
            value: '2',
            label: '当前SPU不参与当前聚合规则，参与其他聚合规则；'
        }
    ],
    addDialogVisible: false,
    editDialogVisible: false
})
// const formData = ref({
//     type: 1
// })
// const list = ref(null)
// list.value = {
//     code: '200',
//     data: {

//         total: 30,
//         pageSize: 10,
//         current: 1,

//         list: [{
//             id: '33',
//             ruleCode: 'LR00000001',
//             mergeSpuCode: '聚合标品编号',
//             spuId: 'SPU1A1A2012345',
//             spuName: '黑人清心绿茶漱口水',
//             resultId: '23',
//             mergeStatus: 1,
//             brandName: '品牌名称',
//             barcode: '69码	',
//             productSpec: '商品规格',
//             modelStatus: 0, // 训练状态 0 初始 1 训练中 2 训练完成 99 训练失败
//             logoUrl: 'https://hsh-native-life-dev-1309143854.cos.ap-beijing.myqcloud.com/46da66a0-c3a1-4712-9db1-f63434d3361a.jpeg	',
//             netRatio: '净含量	,	'

//         }, {
//             id: '33',
//             spuName: '11',
//             resultId: '21',
//             ruleCode: 'LR00000001',
//             mergeSpuCode: '聚合标品编号',
//             spuId: '标品编号',
//             mergeStatus: 0,
//             brandName: '品牌名称',
//             barcode: '4 891338 021708',
//             productSpec: '商品规格',
//             modelStatus: 0, // 训练状态 0 初始 1 训练中 2 训练完成 99 训练失败
//             logoUrl: 'https://hsh-native-life-dev-1309143854.cos.ap-beijing.myqcloud.com/46da66a0-c3a1-4712-9db1-f63434d3361a.jpeg	',
//             netRatio: '净含量		'

//         }

//         ]

//     }

// }
const { tableData, searchData, pageinfo, selectList, dialogVisible, rowList, type, formData, setConfig } = toRefs(dataState)

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
        configCode: 'UC42975326519996416',
        name: '标品聚合字段属性查询',
        url: '/goods/spuMergeDetail/list/v1',
        source: '商品中台'

    }

    // 启用停用
    if (obj === 'search') {
        const { val } = obj
        param.body = {
            ...param.body,
            ...searchData.value

        }
    }
    // dataState.tableData = list.value.data.list
    // dataState.pageinfo.total = list.value.data.list.pageSize
    // const res = list.value
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
// 规则配置页面
const hanldeRule = (row) => {
    router.push({
        name: 'product-converge-rules-add',
        query: {
            id: row.ruleCode,
            type: 'cat'
        }
    })
    // router.push({ name: 'product-converge-rules-tag', params: { type: 'product-converge-rules-add', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 规则配置页面
const handleSpuList = (row) => {
    router.push({ name: 'spu-management-editor', params: { type: 'publicGoodsDetail', spuTemplate: row.spuTemplate, spuId: row.spuId } })
}
// 查看媒体素材
const checkModel = (row) => {
    router.push({ name: 'model-detail', params: { goodsId: row.spuId } })
}
// 上下架
const configHandle = (row, type) => {
    dataState.dialogVisible = true
    dataState.rowList = row
    dataState.type = type

    formData.type = row.mergeStatus
    setConfig.id = row.id
    setConfig.spuId = row.spuId

    console.log(formData.type, ' row.mergeStatus')
}
const save = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001002',
            ...setConfig,
            mergeStatus: formData.value.type
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC42978238965002240',
        name: '商品聚合信息更新',
        url: '/goods/spuMergeDetail/modify/v1',
        source: '商品中台'

    }

    const { code, message } = await getMerchantListCode(param)

    if (code === '200') {
        dialogVisible.value = false

        ElMessage({
            type: 'success',
            message: message
        })
        await getList()
    }
    if (code !== '200') {
        ElMessage({
            type: 'error',
            message: message
        })
    }
}

const tHead = [
    { align: 'center', tooltip: true, prop: 'ruleCode', label: '聚合规则编号', width: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'mergeSpuCode', label: '聚合标品编号', width: 120 },
    { align: 'center', tooltip: true, prop: 'spuId', label: 'SPU编号', width: 150, slot: true },
    { align: 'center', tooltip: true, prop: 'mergeStatus', label: '聚合状态', width: 180, slot: true },
    { align: 'center', tooltip: true, prop: 'brandName', label: '品牌名称', width: 100 },
    { align: 'center', tooltip: true, prop: 'spuName', label: '标品名称', width: 180 },
    { align: 'center', tooltip: true, prop: 'barcode', label: '69码', width: 180 },
    { align: 'center', tooltip: true, prop: 'productSpec', label: '商品规格', width: 150 },
    { align: 'center', tooltip: true, prop: 'netRatio', label: '净含量', width: 80 },
    { align: 'center', tooltip: true, prop: 'resultId', label: '模型训练媒体文件', width: 200, slot: true },
    { align: 'center', tooltip: true, prop: 'logoUrl', label: '正面Logo图', width: 150, slot: true },
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
.rules-management {
    .forms{
    :deep(.el-radio){
        display: block;
    width: 100%;
    }

}

}

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
