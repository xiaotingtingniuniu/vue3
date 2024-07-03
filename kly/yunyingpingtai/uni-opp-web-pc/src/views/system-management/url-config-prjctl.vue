<template>
    <div class="register-user-list-page">
        <el-card class="box-card">
            <div class="search-area">
                <el-form ref="formRef" :model="searchData" :inline="true" label-position="right" label-width="100px">
                    <el-form-item label="项目版本" prop="projectVersion">
                        <el-select class="form-action-item-50w" v-model="searchData.projectVersion" clearable contenteditable="true" placeholder="请选择">
                            <el-option v-for="item in prjOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="接口编码" prop="configCode">
                        <el-input v-model="searchData.configCode" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="接口名称" prop="name">
                        <el-input v-model="searchData.name" placeholder="请输入" clearable />
                    </el-form-item>
                    <el-form-item label="接口进度" prop="optGroundProRate">
                        <el-select class="form-action-item-50w" v-model="searchData.optGroundProRate" clearable contenteditable="true" placeholder="请选择">
                            <el-option label="已配置" value="1" />
                            <el-option label="已部署可联调" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属中台" prop="sourceFlag">
                        <el-select class="form-action-item-50w" v-model="searchData.sourceFlag" clearable contenteditable="true" placeholder="请选择">
                            <el-option
                                v-for="item in mgList"
                                :key="item.detailCode"
                                :label="item.detailName"
                                :value="item.detailCode"
                            />
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
                        <el-button type="primary" @click="pulishUrlConfig(searchData.projectVersion)">
                            发布
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
                    <template #status="row">
                        {{ row.row.status==1?"已上线":"未上线" }}
                    </template>
                    <template #button="row">
                        <el-button  @click="pop('rate',row.row)">进度</el-button>
                        <el-button  @click="pop('test', row)">在线调试</el-button>
                        <el-button  @click="deleletFormPrj(row.row)">移除</el-button>
                        <el-button>
                            <a :href="row.row.docApi" target="_blank" style="text-decoration: none">
                                中台文档
                            </a>
                        </el-button>
                    </template>
                </system-list>
            </div>
        </el-card>
    </div>
    <el-dialog
        v-model="testOnlineObjDef.dialogVisible"
        :title="testOnlineObjDef.title"
        :width="testOnlineObjDef.dialogWidth"
        :before-close="close"
        draggable>
        <div class="lz-dialog">
            <el-descriptions title="">
                <el-descriptions-item label="接口地址:">{{ testOnlineObjDef.apiUrl }}</el-descriptions-item>
                <el-descriptions-item label="接口文档:">
                    <el-link :href="testOnlineObjDef.row.docApi" type="primary" target="_blank" v-if="testOnlineObjDef.row.docApi">body参数文档</el-link>
                    <span v-else>暂无文档</span></el-descriptions-item>
            </el-descriptions>
            <div>
                <JsonEditorVue class="editor" v-model="demoInfo" @blur="validate"  @update:modelValue="updateInfo"/>
            </div>
            <div class="highlight" style="width: 100%;">
                <pre>
                    <code class="html hljs xml">
                    {{ testOnlineObjDef.resultInfo }}
                    </code>
                </pre>
            </div>
            <br/>
            <span v-if="testOnlineObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="testOnlineObjDef.dialogVisible = false">{{ testOnlineObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="debugOnline()">{{ testOnlineObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
    <el-dialog
        v-model="dialogObjDef.dialogVisible"
        :title="dialogObjDef.title"
        :width="dialogObjDef.dialogWidth"
        :before-close="close"
        draggable>
        <div class="lz-dialog">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="配置编号" prop="configCode" :rules="rules.configCode">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.configCode" :disabled="true"/>
                </el-form-item>
                <el-form-item label="配置名称" prop="name" :rules="rules.name">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.name" :disabled="true"/>
                </el-form-item>
                <el-form-item label="中台开发人员" prop="midGroundDeveloper" :rules="rules.midGroundDeveloper">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.midGroundDeveloper" placeholder="最多输入10字符长度" clearable/>
                </el-form-item>
                <el-form-item label="中台进度" prop="midGroundProRate" :rules="rules.midGroundProRate">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.midGroundProRate" placeholder="最多输入10字符长度" clearable/>
                </el-form-item>
                <el-form-item label="运营后台进度" prop="optGroundProRate" :rules="rules.optGroundProRate">
                    <el-select class="form-action-item-50w" v-model="ruleForm.row.optGroundProRate" placeholder="最多输入10字符长度" clearable>
                        <el-option label="已配置" value="1" />
                        <el-option label="已部署，可联调" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="前端开发人员" prop="frontGroupDeveloper" :rules="rules.frontGroupDeveloper">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.frontGroupDeveloper" placeholder="最多输入10字符长度" clearable/>
                </el-form-item>
                <el-form-item label="前端进度" prop="frontGroupProRate" :rules="rules.frontGroupProRate">
                    <el-input class="form-action-item-50w" v-model="ruleForm.row.frontGroupProRate" placeholder="最多输入10字符长度" clearable/>
                </el-form-item>
            </el-form>
            <br/>
            <span v-if="dialogObjDef.isFooter" class="dialog-footer" style="float: right">
                <el-button class="btn-mixins-clear-default" @click="dialogObjDef.dialogVisible = false">{{ dialogObjDef.closeBtnText }}</el-button>
                <el-button type="primary" class="btn-mixins dia-suc" @click="saveProRate()">{{ dialogObjDef.successBtnText }}</el-button>
            </span>
            <br/>
        </div>
    </el-dialog>
</template>
<script setup>
import SystemList from '@/composables/TablePagination/index.vue'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'
import { commonRequest, debugConfig, dict } from '@/api/system/urlConfig'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import JsonEditorVue from 'json-editor-vue3'
const mgList = reactive({})
const router = useRouter()

onMounted(async () => {
    await getMg()
})

const getMg = async () => {
    const res = await dict('mg')
    Object.assign(mgList, res.data)
}

const dataState = reactive({
    tableData: [],
    searchData: {
        projectVersion: ''
    },
    pageinfo: {
        total: 0,
        pageNo: 1,
        pageSize: 10
    },
    handleType: '', // 操作类型： 新增，编辑，查看详情
    prjOptions: [],
    optGroundProRateEnum: {
        1: '已配置',
        2: '已部署，可联调'
    }
})

const { tableData, searchData, pageinfo, prjOptions } = toRefs(dataState)
const tableHeight = ref(null)
tableHeight.value = document.body.clientHeight - 407
window.onresize = function () {
    // 减去导航条60和底部翻页36的高度
    tableHeight.value = document.body.clientHeight - 407
}
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const getProjectVersionList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC40068556056133632',
        name: '接口配置版本列表',
        source: '运营后台',
        operatorId: userInfo.value.account,
        body: {}
    }
    const res = await commonRequest(param)
    if (res.code === '200' && res.data.records.length > 0) {
        dataState.prjOptions = res.data.records.map(item => {
            return {
                value: item,
                label: item
            }
        })
        dataState.searchData.projectVersion = res.data.records[0]
    }
}

// 获取列表
const getList = async () => {
    const queryParam = {
        ...searchData.value,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const param = {
        body: queryParam,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UCJH39085074479239168',
        name: '接口版本列表',
        source: '运营后台',
        operatorId: userInfo.value.account,
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const res = await commonRequest(param)
    if (res.code === '200') {
        dataState.tableData = res.data.list
        dataState.pageinfo.total = res.data.total
        dataState.pageinfo.pageTotal = dataState.pageinfo.total / dataState.pageinfo.pageSize + 1
    }
}
getProjectVersionList().then(function () {
    getList()
})

// 搜索查询列表
const searchList = async () => {
    pageinfo.value.pageNo = 1
    getList()
}
// 发布
const pulishUrlConfig = async (projectVersion) => {
    ElMessageBox.confirm(
        '是否确认发布此数据',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }
    )
        .then(async () => {
            const queryParam = {
                projectVersion: projectVersion,
                modifierId: userInfo.value.account,
                targetEnvs: 4,
                appKey: 'A1001001',
                busiCode: 'A1001001'
            }
            const param = {
                body: queryParam,
                appKey: 'A1001001',
                busiCode: 'A1001001',
                configCode: 'UC40389736443101184',
                name: '根据项目发布当前项目下的接口',
                source: '运营后台',
                operatorId: userInfo.value.account,
                pageNo: pageinfo.value.pageNo,
                pageSize: pageinfo.value.pageSize
            }
            const res = await commonRequest(param)
            const message = res.message
            ElMessageBox.alert(
                message.replaceAll('|', '<br/>'),
                res.code === '200' ? '同步成功' : '同步失败',
                {
                    confirmButtonText: '确定',
                    dangerouslyUseHTMLString: true
                }
            )
                .then(async () => {
                    getProjectVersionList().then(function () {
                        getList()
                    })
                })
        })
}
// 删除
const deleletFormPrj = async (row) => {
    ElMessageBox.confirm(
        '此操作仅删除接口与项目关联，不会删除原有接口，<br/>是否确认从项目进度中删除此配置，',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true
        }
    )
        .then(async () => {
            const queryParam = {
                id: row.id,
                appKey: 'A1001001',
                busiCode: 'A1001001'
            }
            const param = {
                body: queryParam,
                appKey: 'A1001001',
                busiCode: 'A1001001',
                configCode: 'UC40384160065601536',
                name: '项目版本删除接口关联接口',
                source: '运营后台',
                operatorId: userInfo.value.account,
                pageNo: pageinfo.value.pageNo,
                pageSize: pageinfo.value.pageSize
            }
            const res = await commonRequest(param)
            if (res.code === '200') {
                ElMessage.success('成功')
            }
            await getList()
        })
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

const ruleForm = reactive({
    name: '',
    inputConfig: null
})

// 表单项规则
const rules = reactive({
//    name: [
//        { required: true, message: '请输入', trigger: 'change' },
//        { max: 40, message: '最长不超过40个字符长度', trigger: 'change' }
//    ]
})
const dialogObjDef = reactive({
    dialogVisible: false,
    title: '更新进度',
    width: '50%',
    who: '',
    row: null,
    successBtnText: '确定',
    closeBtnText: '取消',
    isFooter: true // 是否显示按钮
})

// 在线调试数据
const testOnlineObjDef = reactive({
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
    if (who === 'test') {
        testOnlineObjDef.title = '在线调试'
        testOnlineObjDef.successBtnText = '调试'
        testOnlineObjDef.closeBtnText = '取消'
        demoInfo.configCode = row.row.configCode
        demoInfo.name = row.row.name
        demoInfo.source = row.row.source
        demoInfo.body = {}
        testOnlineObjDef.who = who
        testOnlineObjDef.row = row.row
        testOnlineObjDef.resultInfo = ''
        testOnlineObjDef.isFooter = true
        testOnlineObjDef.dialogVisible = true
    } else if (who === 'rate') {
        dialogObjDef.title = '更新进度'
        dialogObjDef.successBtnText = '确定'
        dialogObjDef.closeBtnText = '取消'
        ruleForm.row = row
        dialogObjDef.who = who
        dialogObjDef.row = row
        dialogObjDef.resultInfo = ''
        dialogObjDef.isFooter = true
        dialogObjDef.dialogVisible = true
    }
}

// 在线调试
const debugOnline = async () => {
    const res = await debugConfig(demoInfo)
    testOnlineObjDef.resultInfo = res
}

const saveProRate = async () => {
    const queryParam = {
        ...dialogObjDef.row,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const param = {
        body: queryParam,
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC40374795187208192',
        name: '接口进度更新接口',
        source: '运营后台',
        operatorId: userInfo.value.account,
        pageNo: pageinfo.value.pageNo,
        pageSize: pageinfo.value.pageSize
    }
    const res = await commonRequest(param)
    if (res.code === '200') {
        dialogObjDef.row.optGroundProRateName = dataState.optGroundProRateEnum[dialogObjDef.row.optGroundProRate]
        dialogObjDef.dialogVisible = false
    }
}

const tHead = [
    { align: 'left', fixed: true, tooltip: false, prop: 'id', label: 'ID' },
    { align: 'center', tooltip: true, prop: 'configCode', label: '配置编号', minWidth: 190 },
    { align: 'left', tooltip: false, prop: 'name', label: '名称', minWidth: 200 },
    { align: 'center', tooltip: false, prop: 'source', label: '所属中台' },
    { align: 'center', tooltip: false, prop: 'midGroundProRate', label: '中台进度' },
    { align: 'center', tooltip: false, prop: 'midGroundDeveloper', label: '中台开发人员', minWidth: 120 },
    { align: 'center', tooltip: false, prop: 'optGroundProRateName', label: '运营后台进度', minWidth: 140 },
    { align: 'center', tooltip: false, prop: 'frontGroupProRate', label: '前端进度' },
    { align: 'center', tooltip: false, prop: 'frontGroupDeveloper', label: '前端开发人员', minWidth: 120 },
    { align: 'left', tooltip: true, prop: 'url', label: '接口地址', minWidth: 200 },
    { align: 'center', tooltip: false, prop: 'versionOptTypeName', label: '版本处理类型', minWidth: 120 },
    { align: 'center', tooltip: true, prop: 'projectVersion', label: '项目版本', minWidth: 100 },
    { align: 'center', tooltip: false, prop: 'version', label: '版本' },
    { align: 'center', fixed: 'right', prop: 'button', label: '操作', minWidth: 200, slot: true }
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
