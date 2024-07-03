<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="字典类型" prop="dictType">
                        <el-input v-model="searchData.dictType" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="searchData.dictName" placeholder="请输入" clearable />
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="popAdd(dictReqVO)">
                            新增
                        </el-button>
                        <el-button type="primary" @click="loadDictDetailCachePro('', '')">
                            加载缓存
                        </el-button>
                        <el-button type="primary" @click="searchList">
                            搜索
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
                    :height="tableHeight"
                    :tableData="tableData"
                    v-model:current-page="pageinfo.pageNo"
                    v-model:page-size="pageinfo.pageSize"
                    :total="pageinfo.total"
                    @size-change="sizeChange"
                    @current-change="currentChange"
                >
                    <template #button="row">
                        <el-button text @click="dictDetail(row.row.dictType, row.row.dictName)">查看</el-button>
                        <el-button text @click="dictDetailCache(row.row.dictType, row.row.dictName)">查看缓存</el-button>
                        <el-button text @click="loadDictDetailCachePro(row.row.dictType, row.row.dictName)">加载缓存</el-button>
                        <el-button text @click="deleteDictDetailCachePro(row.row.dictType, row.row.dictName)">删除</el-button>
                        <el-button text @click="releaseDictPro(row.row)">发布</el-button>
                    </template>
                </system-list>
            </div>
            <el-row :gutter = 12>
                <el-col :span="24">
                    <el-card >
                        <div shadow="always" class="cardstyle">
                            当前查看的是：{{ detailDataState.source }}，字典类型 {{ detailDataState.dictType }} : {{ detailDataState.dictName }}
                            <el-button size="small" type="primary" class="btn-mixins dia-suc" @click="popAdd(dictDetailReqVO)">新增字典行</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <div class="tableList-area">
                <system-list
                    :tHead="tDetailHead"
                    :height="tableHeight"
                    :tableData="detailTableData"
                >
                    <template #detailAttr="row">
                        {{ row.detailAttr === undefined || row.detailAttr === null || row.detailAttr === '' ? '' : JSON.stringify(row.detailAttr) }}
                    </template>
                    <template #button="row">
                        <el-button text @click="popEdit(row.row, dictDetailReqVO)">编辑</el-button>
                        <el-button text @click="deleteDetail(row.row)">删除</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
    <el-dialog
        v-model="addDialogObjDef.dialogVisible"
        :title="addDialogObjDef.title"
        :width="addDialogObjDef.width"
        :before-close="close"
        draggable
    >
        <div class="lz-dialog">
            <el-form>
                <el-form-item
                    v-for="(obj, key) in addDialogObjDef.content"
                    :label="key"
                    :key="key"
                    :prop="key"
                >
                    <el-input v-if="key !== 'detailList' && !(key === 'dictType' && (addDialogObjDef.isEdit || !addDialogObjDef.isMain))" v-model="addDialogObjDef.content[key]"></el-input>
                    <span v-if="key === 'detailList'">只新增字典定义，明细行需要处理</span>
                    <span v-if="key === 'dictType' && (addDialogObjDef.isEdit || !addDialogObjDef.isMain)">不允许修改DictType</span>
                </el-form-item>
            </el-form>
            <br/>
            <span v-if="addDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="closeAddDialogObj">{{ addDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="confirmAddDialogObj()">{{ addDialogObjDef.successBtnText }}</el-button>
            </span>
        </div>
    </el-dialog>
</template>
<script setup>import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed } from 'vue'
import { addDict, addDictDetail, updateDictDetail, releaseDict, deleteDict, deleteDictDetail, getDictList, getDictDetail, loadDictDetailCache } from '@/api/system/merchantUrlConfig'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

const dataState = reactive({
    tableData: [],
    searchData: {
        dictType: '',
        dictName: ''
    },
    pageinfo: {
        total: 0,
        pageNo: 1,
        pageSize: 10
    }
})
const detailDataState = reactive({
    source: '',
    cache: false,
    dictType: '',
    dictName: '',
    detailTableData: []
})
const { tableData, searchData, pageinfo } = toRefs(dataState)
const { detailTableData } = toRefs(detailDataState)
const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight / 2 - 200
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight / 2 - 200
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
// 获取列表
const getList = async () => {
    const param = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account,
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const res = await getDictList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.records
        dataState.pageinfo.total = res.data.total
    }
    if (dataState.tableData.length > 0) {
        const curRow = dataState.tableData[0]
        dictDetail(curRow.dictType, curRow.dictName)
    }
}
getList()

// 搜索查询列表
const searchList = async () => {
    pageinfo.value.pageNo = 1
    getList()
}

const dictDetail = async (dictType, dictName) => {
    dictReqVO.cache = false
    detailDataState.source = '数据库'
    detailDataState.cache = false
    detailDataState.dictType = dictType
    detailDataState.dictName = dictName
    const param = dictType
    const res = await getDictDetail(param, dictReqVO)
    if (res.code === '200') {
        detailDataState.detailTableData = res.data
    }
}

const dictDetailCache = async (dictType, dictName) => {
    dictReqVO.cache = true
    detailDataState.source = '缓存'
    detailDataState.cache = true
    detailDataState.dictType = dictType
    detailDataState.dictName = dictName
    const param = dictType
    const res = await getDictDetail(param, dictReqVO)
    if (res.code === '200') {
        detailDataState.detailTableData = res.data
    }
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}

const addDialogObjDef = reactive({
    title: '',
    dialogVisible: false,
    isFooter: true,
    successBtnText: '确定',
    closeBtnText: '取消',
    width: '500px',
    isEdit: false,
    isMain: false,
    content: {}
})

const popAdd = (reqVO) => {
    clearReqVoValue()
    if (reqVO === dictReqVO) {
        addDialogObjDef.title = '新增字典'
        addDialogObjDef.isMain = true
    } else {
        dictReqVO.dictType = detailDataState.dictType
        dictReqVO.dictName = detailDataState.dictName
        dictDetailReqVO.dictType = detailDataState.dictType
        dictDetailReqVO.detailSort = detailDataState.detailTableData.length
        addDialogObjDef.title = '新增字典明细'
        addDialogObjDef.isMain = false
    }
    addDialogObjDef.isEdit = false
    addDialogObjDef.content = reqVO
    addDialogObjDef.dialogVisible = true
}
const popEdit = (row, reqVO) => {
    clearReqVoValue()
    if (reqVO === dictReqVO) {
        addDialogObjDef.title = '编辑字典'
        dictReqVO.dictType = row.dictType
        dictReqVO.dictName = row.dictName
        dictReqVO.dictRemark = row.dictRemark
        addDialogObjDef.isMain = true
    } else {
        addDialogObjDef.isMain = false
        dictReqVO.dictType = detailDataState.dictType
        dictReqVO.dictName = detailDataState.dictName
        addDialogObjDef.title = '编辑字典明细'
        dictDetailReqVO.dictType = row.dictType
        dictDetailReqVO.detailName = row.detailName
        dictDetailReqVO.detailCode = row.detailCode
        dictDetailReqVO.detailSort = row.detailSort
        dictDetailReqVO.detailRemark = row.detailRemark
        if (row.detailAttr !== undefined || row.detailAttr !== '') {
            dictDetailReqVO.detailAttr = JSON.stringify(row.detailAttr)
        }
    }
    addDialogObjDef.isEdit = true
    addDialogObjDef.content = reqVO
    addDialogObjDef.dialogVisible = true
}

const clearReqVoValue = () => {
    dictReqVO.dictType = ''
    dictReqVO.dictName = ''
    dictReqVO.dictRemark = ''
    dictDetailReqVO.dictType = ''
    dictDetailReqVO.detailName = ''
    dictDetailReqVO.detailCode = ''
    dictDetailReqVO.detailSort = detailDataState.detailTableData.length
    dictDetailReqVO.detailAttr = ''
    dictDetailReqVO.detailRemark = ''
    dictReqVO.detailList = []
}

const closeAddDialogObj = () => {
    clearReqVoValue()
    addDialogObjDef.dialogVisible = false
}

const confirmAddDialogObj = () => {
    if (dictDetailReqVO.detailAttr !== undefined && dictDetailReqVO.detailAttr !== '') {
        dictDetailReqVO.detailAttr = JSON.parse(dictDetailReqVO.detailAttr)
    } else {
        dictDetailReqVO.detailAttr = {}
    }
    if (addDialogObjDef.isMain && !addDialogObjDef.isEdit) {
        addDictPro().then(() => {
            getList()
        })
    } else if (addDialogObjDef.isMain && addDialogObjDef.isEdit) {
    } else if (!addDialogObjDef.isMain && !addDialogObjDef.isEdit) {
        dictReqVO.detailList.push(dictDetailReqVO)
        addDictDetailPro().then(() => {
            dictDetail(dictReqVO.dictType, dictReqVO.dictName)
        })
    } else if (!addDialogObjDef.isMain && addDialogObjDef.isEdit) {
        dictReqVO.detailList.push(dictDetailReqVO)
        updateDictDetailPro().then(() => {
            dictDetail(dictReqVO.dictType, dictReqVO.dictName)
        })
    }
    addDialogObjDef.dialogVisible = false
}

const addDictPro = async () => {
    await addDict(dictReqVO)
}

const addDictDetailPro = async () => {
    await addDictDetail(dictReqVO)
}

const updateDictDetailPro = async () => {
    dictReqVO.cache = false
    await updateDictDetail(dictReqVO)
}

const loadDictDetailCachePro = async (dictType, dictName) => {
    dictReqVO.dictType = dictType
    await loadDictDetailCache(dictReqVO)
    if (dictType === '') {
        const curRow = dataState.tableData[0]
        dictDetail(curRow.dictType, curRow.dictName)
    } else {
        dictDetail(dictType, dictName)
    }
}

const dictReqVO = reactive({
    dictType: '',
    dictName: '',
    dictRemark: '',
    cache: true,
    targetEnvs: 0,
    detailList: [
    ]
})
const dictDetailReqVO = reactive({
    dictType: '',
    detailName: '',
    detailCode: '',
    detailSort: 0,
    detailAttr: '',
    detailRemark: ''
})

const releaseDictPro = async (row) => {
    ElMessageBox.confirm(
        '是否确认发布此数据',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            dictReqVO.dictType = row.dictType
            dictReqVO.dictName = row.dictName
            dictReqVO.cache = false
            dictReqVO.targetEnvs = 4
            const res = await releaseDict(dictReqVO)
            const message = res.data
            ElMessageBox.alert(
                '同步字典：' + message,
                res.code === '200' ? '同步成功' : '同步失败',
                {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true
                }
            )
        })
}

const releaseDictConfirm = () => {

}

const deleteDictDetailCachePro = (dictType, dictName) => {
    ElMessageBox.confirm(
        '删除数据不能同步线上，线上如需删除，需要操作线上接口',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            dictReqVO.dictType = dictType
            dictReqVO.dictName = dictName
            dictReqVO.cache = false
            deleteDict(dictReqVO).then(() => {
                ElMessage.success('成功')
                getList()
            })
        })
}

const deleteDetail = (row) => {
    dictReqVO.dictType = row.dictType
    dictDetailReqVO.dictType = row.dictType
    dictDetailReqVO.detailCode = row.detailCode
    dictDetailReqVO.detailAttr = {}
    dictReqVO.detailList = []
    dictReqVO.cache = false
    dictReqVO.detailList.push(dictDetailReqVO)
    deleteDictDetail(dictReqVO).then(() => {
        dictDetail(dictDetailReqVO.dictType, '')
    })
}

const tHead = [
    { align: 'center', fixed: true, tooltip: false, prop: 'dictType', label: '字典类型' },
    { align: 'center', tooltip: true, prop: 'dictName', label: '字典名称' },
    { align: 'center', tooltip: false, prop: 'dictRemark', label: 'dictRemark' },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 150, slot: true }
]

const tDetailHead = [
    { align: 'center', fixed: true, tooltip: false, prop: 'dictType', label: '字典类型' },
    { align: 'center', tooltip: true, prop: 'detailName', label: 'name' },
    { align: 'center', tooltip: false, prop: 'detailCode', label: 'code' },
    { align: 'center', tooltip: false, prop: 'detailSort', label: '排序' },
    { align: 'center', tooltip: false, prop: 'detailAttr', label: '属性' },
    { align: 'center', tooltip: false, prop: 'detailRemark', label: '备注' },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 150, slot: true }
]

// 页数改变
const sizeChange = (val) => {
    dataState.pageinfo.pageNo = 1
    dataState.pageinfo.pageSize = val
    getList({ ...searchData.value })
}
// 当前也改变
const currentChange = (val) => {
    dataState.pageinfo.pageNo = val
    getList({ ...searchData.value })
}
</script>
<style lang="scss" scoped>
    pre {
        display: block;
        font-family: monospace;
        white-space: pre;
        margin: 1em 0px;
    }
    .hljs {
        line-height: 1.8;
        font-family: Menlo,Monaco,Consolas,Courier,monospace;
        font-size: 12px;
        padding: 18px 24px;
        background-color: #fafafa;
        border: 1px solid #eaeefb;
        margin-bottom: 25px;
        border-radius: 4px;
        -webkit-font-smoothing: auto;
        display: block;
        overflow-x: auto;
        padding: 0.5em;
        background: #fff;
    }
    code {
        background-color: #f9fafc;
        padding: 0 4px;
        border: 1px solid #eaeefb;
        border-radius: 4px;
        font-family: monospace;
    }
    .register-user-list-page{
        .box-card{
            border: initial;
            .search-area{
                .el-form{
                    .el-form-item{
                        width: 250px;
                    }
                    // .form-item-time{
                    //     width: 535px;
                    //     // :deep(.el-date-editor){
                    //     //     flex: 1;
                    //     // }
                    // }
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
