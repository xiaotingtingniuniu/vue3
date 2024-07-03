<!-- sku管理 -->
<template>
    <div class="container-box">
        <div class="search-area">
            <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="120px">
                <el-form-item label="相似品规则编号" prop="ruleCode">
                    <el-input v-model.trim="searchData.ruleCode" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="相似品组合名称" prop="ruleName">
                    <el-input v-model.trim="searchData.ruleName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="所含标品名称" prop="spuName">
                    <el-input v-model.trim="searchData.spuName" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="69码" prop="barcode">
                    <el-input v-model.trim="searchData.barcode" placeholder="请输入～" clearable />
                </el-form-item>
                <el-form-item label="规则状态" prop="ruleStatus">
                    <el-select v-model.trim="searchData.ruleStatus" clearable placeholder="请选择" >
                        <el-option label="全部" value="" />
                        <el-option label="停用" value="0" />
                        <el-option label="启用" value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item class="button-box">
                    <el-button type="primary" @click="goAdd('add')">
                        创建
                    </el-button>
                    <el-button type="primary" @click="search()">
                        查询
                    </el-button>
                    <el-button type="primary" @click="resetForm(formRef)">
                        重置
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="tableList-area">
            <system-list
                :tHead="tHead"
                :tableData="tableData"
                v-model:current-page="pageinfo.currPage"
                v-model:page-size="pageinfo.pageSize"
                :total="pageinfo.total"
                @size-change="sizeChange"
                @current-change="currentChange"
            >
                <template #lengthth="scope">
                    <el-button type="danger" @click="goDialog(scope.row.ruleCode)" text>
                        {{scope.row.ruleItems?scope.row.ruleItems.length:''}}
                    </el-button>
                </template>
                <template #nameAndNum="scope">
                    <div class="text-table">
                        <p v-for="(item,index) in scope.row.ruleItems" :key="index"> {{item.spuName}},{{item.barcode}}</p>
                    </div>
                </template>

                <template #ruleStatus="scope">
                    <span v-if="scope.row.ruleStatus===0">停用</span>
                    <span v-if="scope.row.ruleStatus===1">启用</span>
                </template>
                <template #operation="scope">
                    <el-button type="primary" @click="stop(scope.row.ruleCode, 0)" text v-if="scope.row.ruleStatus===1">
                        停用
                    </el-button>
                    <el-button type="primary" @click="stop(scope.row.ruleCode, 1)" text v-if="scope.row.ruleStatus===0">
                        启用
                    </el-button>
                    <el-button type="primary" @click="goAdd('edit',scope.row.ruleCode)" text >
                        编辑
                    </el-button>
                </template>
            </system-list>
        </div>
        <dialog-form v-if="dialogVisible" :visible ='dialogVisible' @handleClose="dialogVisible = false" :ruleCode="ruleCode" @fevent="getGoodsList()"></dialog-form>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SystemList from '@/composables/TablePagination/index.vue'
import dialogForm from './dialog.vue'
import { getMerchantList } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import { tr } from 'element-plus/es/locale'
const route = useRoute()
const router = useRouter()

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(false)
const ruleCode = ref('')

const tHead = [
    { align: 'center', prop: 'ruleCode', label: '相似品规则编号', fixed: 'left', minWidth: 200 },
    { align: 'center', tooltip: true, prop: 'ruleName', label: '相似品组名称' },
    { align: 'center', tooltip: true, prop: 'nameAndNum', label: '所含标品名称&69码', slot: true, minWidth: 250 },
    { align: 'center', prop: 'lengthth', label: '所含标品数量', slot: true },
    { align: 'center', tooltip: true, prop: 'gmtCreate', label: '创建时间' },
    { align: 'center', tooltip: true, prop: 'creatorId', label: '创建人' },
    { align: 'center', tooltip: true, prop: 'gmtModify', label: '最新操作时间' },
    { align: 'center', tooltip: true, prop: 'modifierId', label: '最新操作人' },
    { align: 'center', tooltip: true, prop: 'ruleStatus', label: '规则状态', slot: true },
    { align: 'center', prop: 'operation', label: '操作', slot: true, minWidth: 200 }

]

const dataState = reactive({
    searchData: {
        ruleCode: '', // 规则编号
        ruleName: '', // 规则名称
        spuName: '', // 标品名称
        barcode: '', // 69码
        ruleStatus: '' // 状态

    },
    pageinfo: {
        total: 0,
        currPage: 1,
        pageSize: 10
    },
    tableData: [],
    cityList: [],
    firstCateList: [],
    secondCateList: [],
    thirdCateList: [],
    fourCateList: [],
    pinpaiList: [],
    rowList: {},
    type: ''

})
const { searchData, pageinfo, tableData, firstCateList, secondCateList, thirdCateList, fourCateList, rowList, type } = toRefs(dataState)

onMounted(async () => {
    await getPagingList()
})

// 跳转
const goAdd = (type, code) => {
    router.push({ name: 'add-similarity', params: { type, ruleCode: code } })
}
// 列表数据
const getPagingList = async () => {
    const params = {
        body: {
            appKey: 'A1001001',
            busiCode: 'A1001002',
            ...dataState.searchData,
            currentPage: dataState.pageinfo.currPage,
            pageSize: dataState.pageinfo.pageSize
        },
        appKey: 'A1001001',
        busiCode: 'A1001002',
        configCode: 'UC45922260389412864',
        url: '/goods/similar/spu/list/v1',
        source: '商品中台',
        name: '货柜相似品管理'
    }
    const res = await getMerchantList(params)
    console.log('res', res)
    dataState.tableData = res.list
    dataState.pageinfo.total = res.totalCount
}

// 弹窗
const goDialog = (code) => {
    ruleCode.value = code
    dialogVisible.value = true
}
// 停用&&启用
const stop = (code, status) => {
    let testTitle = ''
    let confirmButton = ''
    if (status === 0) {
        testTitle = '请确认是否停用此相似品组规则。停用后，相似品组中的商品上架到同一设备，将不再提示柜主，可能会造成识别错误导致异常订单造成柜主货损。\n若确认停用，请点击“停用”按钮完成操作。'
        confirmButton = '停用'
    }
    if (status === 1) {
        testTitle = '请确认是否启用此相似品组规则。启用后，相似品组中的商品上架到同一设备，将对柜主进行上架操作提示。若确认启用，请点击“启用”钮完成操作。'
        confirmButton = '启用'
    }
    ElMessageBox.confirm(
        testTitle,
        '',
        {
            confirmButtonText: confirmButton,
            cancelButtonText: '关闭'
        }
    )
        .then(async () => {
            const param = {
                body: {
                    appKey: 'A1001001',
                    busiCode: 'A1001002',
                    ruleCode: code,
                    ruleStatus: status
                },
                appKey: 'A1001001',
                busiCode: 'A1001002',
                configCode: 'UC45923553359118336',
                name: '货柜相似品规则停用/启用',
                source: '商品中台'
            }
            await getMerchantList(param)
            ElMessage.success('成功')
            await getPagingList()
        })
}
const open = () => {
    ElMessageBox.confirm(
        '请确认是否启用此相似品组规则。启用后，相似品组中的商品上架到同一设备，将对柜主进行上架操作提示。<br> 若确认停用，请点击“停用”按钮完成操作。',
        '',
        {
            confirmButtonText: '启用',
            cancelButtonText: '关闭'
        }
    )
        .then(async () => {

        })
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
    getPagingList()
}

// 查询
const search = () => {
    dataState.pageinfo.currPage = 1
    getPagingList()
}

// 当前页数改变
const currentChange = (val) => {
    dataState.pageinfo.currPage = val
    getPagingList()
}
const sizeChange = (val) => {
    dataState.pageinfo.currPage = 1
    dataState.pageinfo.pageSize = val
    getPagingList()
}

</script>

<style lang="scss" scoped>
.text-table{
    display:-webkit-box;
    text-overflow:ellipsis;
    overflow:hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient:vertical;
}
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
     }
     .header-title{
         font-size:20px;
         color:red;
         height:50px;
         font-weight:700;
         align-items:center
     }
 }
</style>
