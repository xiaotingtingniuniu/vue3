<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="所属中台" prop="sourceFlag">
                        <el-select class="form-action-item-50w" v-model="searchData.sourceFlag" clearable placeholder="请选择">
                            <el-option label="全部" value="" />
                            <el-option label="用户中台" value="user" />
                            <el-option label="商户中台" value="merchant" />
                            <el-option label="营销中台" value="marketing" />
                            <el-option label="权限中台" value="permission" />
                            <el-option label="订单中台" value="order" />
                            <el-option label="支付中台" value="pay" />
                            <el-option label="设备中台" value="machine" />
                            <el-option label="库存中台" value="stock" />
                            <el-option label="商品中台" value="goods" />
                            <el-option label="商品搜索中台" value="goods-search" />
                            <el-option label="资源位中台" value="resource" />
                            <el-option label="价格中台" value="price" />
                            <el-option label="运单中台" value="waybill" />
                            <el-option label="工单中台" value="smp" />
                            <el-option label="结算中台" value="commission" />
                            <el-option label="账户中台" value="account" />
                            <el-option label="分销系统" value="distribution" />
                            <el-option label="商家后台" value="uo" />
                            <el-option label="恒生活众包" value="salesman" />
                            <el-option label="商家后台" value="guizhu_merchant" />
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
            <el-row>
                <el-col :span="4">
                    <el-form-item label="token用户">
                        <el-select class="form-action-item-50w" v-model="tokenParam.mobile" clearable placeholder="请选择用户" @change="getToken()">
                            <el-option label="柜主_18900000002" value="18900000002" />
                            <el-option label="19910200051" value="19910200051" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="">
                        <el-input v-model="tokenParam.mobile" clearable placeholder="请输入手机号" @change="getToken()"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="token" prop="token">
                        <el-input v-model="dialogObjDef.token" placeholder="从商家PC端获取token" clearable />
                    </el-form-item>
                </el-col>
            </el-row>
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
                        <el-row>
                            <el-col :span="12">
                                <el-button  @click="goUrlConfigHandle('edit', row.row)">编辑</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button  @click="popPrjDialog(row.row)">添加项目</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-button  @click="pop('demo', row)">在线调试</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button>
                                    <a :href="row.row.docApi" target="_blank" style="text-decoration: none">
                                        中台文档
                                    </a>
                                </el-button>
                            </el-col>
                        </el-row>
                        <el-button text @click="releaseHandle(row.row)" v-if="row.row.isPublish === 0">发布</el-button>
                        <el-button text @click="deleteCoupon(row.row)" v-if="row.row.isAllowDel === 1">删除</el-button>
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
            <el-descriptions title="" :column="2">
                <el-descriptions-item label="接口地址:">{{ dialogObjDef.apiUrl }}</el-descriptions-item>
                <el-descriptions-item label="接口文档:">
                    <el-link :href="dialogObjDef.row.row.docApi" type="primary" target="_blank" v-if="dialogObjDef.row.row.docApi">body参数文档</el-link>
                    <span v-else>暂无文档</span>
                </el-descriptions-item>
                <br>
                <el-descriptions-item label="中台接口地址:">{{ dialogObjDef.row.row.domain + dialogObjDef.row.row.url }}</el-descriptions-item>
            </el-descriptions>
            <div>
                <el-row>
                    <el-col :span="4">
                        <el-form-item label="">
                            <el-select class="form-action-item-50w" v-model="tokenParam.mobile" clearable placeholder="请选择用户" @change="getToken()">
                                <el-option label="柜主_18900000002" value="18900000002" />
                                <el-option label="19910200051" value="19910200051" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="">
                            <el-input v-model="tokenParam.mobile" clearable placeholder="请输入手机号" @change="getToken()"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="token" prop="token">
                            <el-input v-model="dialogObjDef.token" placeholder="从商家PC端获取token" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
            <div>
                <el-steps :active="dialogObjDef.resultJson.debug.requests.length === 0 ? 1 : dialogObjDef.resultJson.debug.requests.length + 2" align-center>
                    <el-step title="开始"></el-step>
                    <el-step
                        v-for="(request, requestIndex) in dialogObjDef.resultJson.debug.requests"
                        :title="request.configName"
                        :key="requestIndex"
                        :pop="requestIndex"
                        :description="request.path"
                    >
                        <template #icon>
                            <el-tooltip
                                class="box-item"
                                effect="dark"
                                placement="bottom"
                                :visible="stepObjDef.tipVisible[requestIndex]"
                            >
                                <template #content>
                                    {{request.domain + request.url}}
                                    <el-button size="small" round>
                                        <a :href="request.docApi" target="_blank" style="text-decoration: none">
                                            查看文档
                                        </a>
                                    </el-button>
                                    <br>
                                    <el-scrollbar  max-height="600px">
                                        <el-collapse>
                                            <el-collapse-item title="request" name="1">
                                                <pre><p>{{request.request}}</p></pre>
                                            </el-collapse-item>
                                            <el-collapse-item title="response" name="2">
                                                <el-button @click="setMock(request)">设置为mock结果</el-button>
                                                <pre><p>{{request.response.body}}</p></pre>
                                            </el-collapse-item>
                                            <el-collapse-item title="config" name="3" v-if="request.response.config && JSON.stringify(request.response.config) !== '{}'">
                                                <pre><p>{{request.response.config}}</p></pre>
                                            </el-collapse-item>
                                            <el-collapse-item title="function" name="4" v-if="request.functions && JSON.stringify(request.functions) !== '[]'">
                                                <el-collapse>
                                                    <el-collapse-item
                                                        v-for="(func, funcIndex) in request.functions"
                                                        :title="'- ' + func.expresssion"
                                                        :key="func.expresssion + funcIndex"
                                                        :name="func.expresssion + funcIndex"
                                                    >
                                                        <pre>{{func}}</pre>
                                                    </el-collapse-item>
                                                </el-collapse>
                                            </el-collapse-item>
                                            <el-collapse-item title="exception" name="5" v-if="request.exception">
                                                <pre><p>{{request.exception}}</p></pre>
                                            </el-collapse-item>
                                        </el-collapse>
                                    </el-scrollbar>
                                </template>
                                <el-button round @click="stepObjDef.tipVisible[requestIndex] = !stepObjDef.tipVisible[requestIndex]">
                                    {{requestIndex + 2}}
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-step>
                    <el-step title="结束"></el-step>
                </el-steps>
            </div>
            <div>
                <JsonEditorVue class="editor" v-model="demoInfo" @blur="validate"  @update:modelValue="updateInfo"/>
            </div>
            <div>
                <JsonEditorVue class="editor" v-model="dialogObjDef.resultJson" @blur="validate"  @update:modelValue="updateRemoteResult"/>
            </div>
            <br/>
            <span v-if="dialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="debugOnlineClose()">{{ dialogObjDef.closeBtnText }}</el-button>
                <el-button class="btn-mixins-clear-default" @click="invokeMid()">调用中台</el-button>
                <el-button class="btn-mixins-clear-default" @click="debugOnlineWithoutToken()">无token调试</el-button>
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
                <el-button class="btn-mixins-clear-default" @click="prjDialogObjDef.dialogVisible = false">{{ prjDialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="addToPrj()">{{ prjDialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
</template>
<script setup>import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed } from 'vue'
import {
    commonRequest,
    getUrlConfigList,
    syncConfig,
    deleteConfig,
    debugConfig,
    saveTokenRedis
} from '@/api/system/merchantUrlConfig'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonEditorVue from 'json-editor-vue3'

const tokenParam = reactive({
    loginType: 2,
    systemSign: 'HSHMERPC',
    sceneCode: 2,
    mobile: '',
    verifyCode: '666666'
})
const getToken = async () => {
    if (tokenParam.mobile !== '') {
        const params = {
            appKey: 'A1001001',
            busiCode: 'A1001001',
            operatorId: userInfo.value.account,
            configCode: 'MSJH67941378798616576',
            name: '获取验证码并666登录',
            source: '商家后台',
            body: tokenParam
        }
        const res = await commonRequest(params)
        dialogObjDef.token = res.data.data.token
        var srcToken = store.state.token
        store.state.token = dialogObjDef.token
        await saveTokenRedis()
        store.state.token = srcToken
    }
}

const router = useRouter()
// 删除弹框数据
const dialogObjDef = reactive({
    dialogVisible: false,
    apiUrl: 'api/uniter/v1/url/request',
    title: '示例',
    dialogWidth: '70%',
    who: '',
    row: null,
    successBtnText: '确定',
    closeBtnText: '取消',
    isFooter: true, // 是否显示按钮
    resultJson: {
        debug: {
            requests: []
        }
    },
    token: ''
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
const stepObjDef = reactive({
    tipVisible: []
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
const updateRemoteResult = (val) => {
    dialogObjDef.resultJson = val
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
    }
    dialogObjDef.who = who
    dialogObjDef.row = row
    dialogObjDef.resultInfo = ''
    dialogObjDef.isFooter = true
    dialogObjDef.dialogVisible = true
}

// 在线调试
const debugOnline = async () => {
    var srcToken = store.state.token
    store.state.token = dialogObjDef.token
    demoInfo.debug = true
    const res = await debugConfig(demoInfo)
    store.state.token = srcToken
    dialogObjDef.resultJson = res
}
const debugOnlineWithoutToken = async () => {
    var srcToken = store.state.token
    store.state.token = dialogObjDef.token
    demoInfo.debug = true
    const res = await commonRequest(demoInfo)
    store.state.token = srcToken
    dialogObjDef.resultJson = res
}
const debugOnlineClose = async () => {
    dialogObjDef.dialogVisible = false
    dialogObjDef.resultJson = {
        debug: {
            requests: []
        }
    }
}

const invokeMid = async () => {
    dialogObjDef.dialogVisible = false
    dialogObjDef.resultJson = {
        debug: {
            requests: []
        }
    }
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
        configCode: 'MS55352211247874048',
        name: '同步接口配置到项目',
        source: '商家后台',
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
    // param.configCode = 'MSTEST'
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
const setMock = (request) => {
    if (demoInfo.mock_info === undefined) {
        demoInfo.mock_info = []
    }
    const mockData = {
        configCode: request.configCode,
        result: request.response.body
    }
    demoInfo.mock_info.push(mockData)
}
// 新增/编辑操作
const goUrlConfigHandle = async (handleType, info) => {
    router.push({ name: 'guizhu-urlconfig-handle', query: { handleType, configCode: info && info.configCode } })
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
    { align: 'center', tooltip: false, prop: 'creatorId', label: '接口负责人', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'modifierId', label: '接口修改人', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'gmtCreate', label: '创建时间', minWidth: 170 },
    { align: 'center', tooltip: false, prop: 'gmtModify', label: '修改时间', minWidth: 170 },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 240, slot: true }
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
