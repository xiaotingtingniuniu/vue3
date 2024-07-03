<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="所属中台" prop="sourceFlag">
                        <el-select class="form-action-item-50w" v-model="searchData.sourceFlag" clearable placeholder="请选择">
                            <el-option
                                v-for="item in mgList"
                                :key="item.detailCode"
                                :label="item.detailName"
                                :value="item.detailCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="接口编码" prop="configCode">
                        <el-input v-model="searchData.configCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="接口名称" prop="name">
                        <el-input v-model="searchData.name" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="接口地址" prop="url">
                        <el-input v-model="searchData.url" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="接口类型" prop="configType">
                        <el-select class="form-action-item-50w" v-model="searchData.configType" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="透传接口" value="1" />
                            <el-option label="聚合接口" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请求类型" prop="reqType">
                        <el-select class="form-action-item-50w" v-model="searchData.reqType" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="GET" value="1" />
                            <el-option label="POST" value="2" />
                            <el-option label="PUT" value="3" />
                            <el-option label="DELETE" value="4" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数据源" prop="dataSourceType">
                        <el-select class="form-action-item-50w" v-model="searchData.dataSourceType" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="接口" value="0" />
                            <el-option label="ES" value="1" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-select class="form-action-item-50w" v-model="searchData.status" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="已上线" value="1" />
                            <el-option label="未上线" value="0" />
                        </el-select>
                    </el-form-item>
                    <br>
                    <el-form-item class="button-box">
                        <el-button type="primary" @click="goUrlConfigHandle('add')">
                            新增
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
                    <template #reqType="row">
                        {{ reqTypeValue[row.row.reqType] }}
                    </template>
                    <template #configType="row">
                        {{ row.row.configType==1?"透传接口":"聚合接口" }}
                    </template>
                    <template #dataSourceType="row">
                        {{ row.row.dataSourceType==1?"ES":"接口" }}
                    </template>
                    <template #status="row">
                        {{ row.row.status==1?"已上线":"未上线" }}
                    </template>
                    <template #button="row">
                        <el-button  @click="goUrlConfigHandle('edit', row.row)">编辑</el-button>
                        <el-button text @click="releaseHandle(row.row)" v-if="row.row.isPublish === 0">发布</el-button>
                        <el-button text @click="deleteCoupon(row.row)" v-if="row.row.isAllowDel === 1">删除</el-button>
                        <el-button  @click="pop('demo', row)">在线调试</el-button>
                        <el-button  @click="popPrjDialog(row.row)">添加项目</el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
    <el-dialog
        v-model="dialogObjDef.dialogVisible"
        :title="dialogObjDef.title"
        :width="dialogObjDef.dialogWidth"
        :before-close="close"
        draggable>
        <div class="lz-dialog">
            <el-descriptions title="">
                <el-descriptions-item label="接口地址:">{{ dialogObjDef.apiUrl }}</el-descriptions-item>
                <el-descriptions-item label="接口文档:">
                    <el-link :href="dialogObjDef.row.row.docApi" type="primary" target="_blank" v-if="dialogObjDef.row.row.docApi">body参数文档</el-link>
                    <span v-else>暂无文档</span></el-descriptions-item>
            </el-descriptions>
            <div>
                <JsonEditorVue class="editor" v-model="demoInfo" @blur="validate"  @update:modelValue="updateInfo"/>
            </div>
            <div class="highlight" style="width: 100%;">
                <pre>
                    <code class="html hljs xml">
                    {{ dialogObjDef.resultInfo }}
                    </code>
                </pre>
            </div>
            <br/>
            <span v-if="dialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="dialogObjDef.dialogVisible = false">{{ dialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="debugOnline()">{{ dialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
    <el-dialog
        v-model="prjDialogObjDef.dialogVisible"
        :title="prjDialogObjDef.title"
        :width="prjDialogObjDef.dialogWidth"
        :before-close="close"
        draggable>
        <div class="lz-dialog">
            <el-form ref="ruleFormRef" :model="prjRuleForm" label-position="right" label-width="150px">
                <el-form-item label="配置编号" prop="configCode" :rules="prjRules.configCode">
                    <el-input class="form-action-item-50w" v-model="prjRuleForm.row.configCode" :disabled="true"/>
                </el-form-item>
                <el-form-item label="配置名称" prop="name" :rules="prjRules.name">
                    <el-input class="form-action-item-50w" v-model="prjRuleForm.row.name" :disabled="true"/>
                </el-form-item>
                <el-form-item label="项目" prop="projectVersion" :rules="prjRules.projectVersion">
                    <el-input class="form-action-item-50w" v-model="prjRuleForm.row.projectVersion" placeholder="最多输入10字符长度" clearable/>
                </el-form-item>
                <el-form-item label="项目" prop="versionOptType" :rules="prjRules.versionOptType">
                    <el-select class="form-action-item-50w" v-model="prjRuleForm.row.versionOptType" placeholder="请选择" clearable>
                        <el-option label="新增" value="1" />
                        <el-option label="配置修改" value="2" />
                        <el-option label="中台修改配置无改动" value="3" />
                    </el-select>
                </el-form-item>
            </el-form>
            <br/>
            <span v-if="prjDialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="prjDialogObjDef.dialogVisible = false">{{ dialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="addToPrj()">{{ prjDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
</template>
<script setup>import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { commonRequest, getUrlConfigList, dict, debugConfig } from '@/api/system/urlConfig'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonEditorVue from 'json-editor-vue3'
const mgList = reactive({})

onMounted(async () => {
    await getMg()
})

const getMg = async () => {
    const res = await dict('mg')
    Object.assign(mgList, res.data)
}

const router = useRouter()
// 删除弹框数据
const dialogObjDef = reactive({
    dialogVisible: false,
    apiUrl: 'api/uniter/v1/url/request',
    title: '示例',
    width: '50%',
    who: '',
    row: null,
    successBtnText: '确定',
    closeBtnText: '取消',
    isFooter: true, // 是否显示按钮
    resultInfo: ''
})
const prjDialogObjDef = reactive({
    dialogVisible: false,
    apiUrl: 'api/uniter/v1/url/request',
    title: '示例',
    width: '50%',
    who: '',
    row: null,
    successBtnText: '确定',
    closeBtnText: '取消',
    isFooter: true, // 是否显示按钮
    resultInfo: ''
})
const validate = async (editor) => {
    const res = await editor.validate()
    // res 是错误列表，如果是空数组，则表示检测没有错误
    console.log(res)
}

let demoInfo = reactive({
    appKey: 'A1001000',
    busiCode: 'A1001000',
    configCode: '',
    name: '',
    source: '',
    body: {}
})

const updateInfo = (val) => {
    demoInfo = val
}

// 弹窗
const pop = (who, row) => {
    if (who === 'demo') {
        dialogObjDef.title = '在线调试'
        dialogObjDef.successBtnText = '调试'
        dialogObjDef.closeBtnText = '取消'
        demoInfo.configCode = row.row.configCode
        demoInfo.name = row.row.name
        demoInfo.source = row.row.source
        demoInfo.body = {}
    } else if (who === 'todo') {
        dialogObjDef.title = '报价单明细停用'
        dialogObjDef.successBtnText = '确认'
        dialogObjDef.closeBtnText = '取消'
    }
    dialogObjDef.who = who
    dialogObjDef.row = row
    dialogObjDef.resultInfo = ''
    dialogObjDef.isFooter = true
    dialogObjDef.dialogVisible = true
}

// 在线调试
const debugOnline = async () => {
    const res = await debugConfig(demoInfo)
    dialogObjDef.resultInfo = res
}

const prjRuleForm = reactive({
})
// 表单项规则
const prjRules = reactive({
})
// 弹窗
const popPrjDialog = (row) => {
    prjDialogObjDef.title = '添加至项目'
    prjDialogObjDef.successBtnText = '确定'
    prjDialogObjDef.closeBtnText = '取消'
    prjDialogObjDef.row = row
    prjDialogObjDef.resultInfo = ''
    prjDialogObjDef.isFooter = true
    prjDialogObjDef.dialogVisible = true
    prjRuleForm.row = row
    prjRuleForm.row.versionOptType = '3'
}

const addToPrj = async () => {
    const queryParam = {
        ...prjDialogObjDef.row,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        operatorId: userInfo.value.account
    }
    const param = {
        body: queryParam,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC40456257742389248',
        name: '同步接口配置到项目',
        source: '运营后台',
        operatorId: userInfo.value.account,
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const res = await commonRequest(param)
    if (res.code === '200') {
        prjDialogObjDef.dialogVisible = false
    }
}

const dataState = reactive({
    tableData: [],
    searchData: {
        configCode: '',
        name: '',
        url: '',
        sourceFlag: '',
        reqType: '',
        configType: '',
        dataSourceType: '',
        status: ''
    },
    pageinfo: {
        total: 0,
        pageNo: 1,
        pageSize: 10
    },
    handleType: '', // 操作类型： 新增，编辑，查看详情
    handleDictCode: '', // 当前操作项编码
    handleAuditId: '', // 当前操作项审批id
    handleSubCode: '', // 当前操作项subCode
    reqTypeValue: {
        1: 'GET',
        2: 'POST',
        3: 'PUT',
        4: 'DELETE'
    }
})
const { tableData, searchData, pageinfo, reqTypeValue } = toRefs(dataState)
const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight - 407
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight - 407
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
    const res = await getUrlConfigList(param)
    if (res.code === '200') {
        dataState.tableData = res.data.records
        dataState.pageinfo.total = res.data.total
    }
}
getList()
// 搜索查询列表
const searchList = async () => {
    pageinfo.value.pageNo = 1
    getList()
}
// 重置
const formRef = ref(null)
const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
}
// 新增/编辑操作
const goUrlConfigHandle = async (handleType, info) => {
    router.push({ name: 'urlconfig-handle', query: { handleType, configCode: info && info.configCode } })
}
const tHead = [
    { align: 'left', fixed: true, tooltip: false, prop: 'id', label: 'ID' },
    { align: 'center', tooltip: true, prop: 'configCode', label: '配置编号', minWidth: 190 },
    { align: 'left', tooltip: false, prop: 'name', label: '名称', minWidth: 200 },
    { align: 'left', tooltip: true, prop: 'url', label: '接口地址', minWidth: 200 },
    { align: 'center', tooltip: false, prop: 'source', label: '所属中台' },
    { align: 'center', tooltip: false, prop: 'sourceFlag', label: '中台标识', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'domain', label: '域名', minWidth: 250 },
    { align: 'center', tooltip: false, prop: 'reqType', label: '请求方式', slot: true },
    { align: 'center', tooltip: false, prop: 'configType', label: '接口类型', slot: true },
    { align: 'center', tooltip: false, prop: 'dataSourceType', label: '数据源', slot: true },
    { align: 'center', tooltip: false, prop: 'status', label: '上线状态', slot: true },
    { align: 'center', tooltip: false, prop: 'version', label: '版本' },
    { align: 'center', tooltip: false, prop: 'creatorId', label: '创建人' },
    { align: 'center', tooltip: false, prop: 'modifierId', label: '修改人' },
    { align: 'center', tooltip: false, prop: 'gmtCreate', label: '创建时间', minWidth: 170 },
    { align: 'center', tooltip: false, prop: 'gmtModify', label: '修改时间', minWidth: 170 },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 300, slot: true }
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
