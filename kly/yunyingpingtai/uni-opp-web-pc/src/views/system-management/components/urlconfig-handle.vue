<template>
    <div class='submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="所属中台" prop="sourceFlag" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.sourceFlag" clearable placeholder="请选择">
                    <el-option
                        v-for="item in mgList"
                        :key="item.detailCode"
                        :label="item.detailName"
                        :value="item.detailCode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="配置编号" prop="configCode" :rules="rules.configCode" v-if="handleType === 'edit'">
                <el-input class="form-action-item-50w" v-model="ruleForm.configCode" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="名称" prop="name" :rules="rules.name">
                <el-input class="form-action-item-50w" v-model="ruleForm.name" placeholder="最多输入20字符长度" clearable/>
            </el-form-item>
            <el-form-item label="接口地址" prop="url" :rules="rules.url">
                <el-input class="form-action-item-50w" v-model="ruleForm.url" placeholder="最多输入50字符长度" clearable/>
            </el-form-item>
            <el-form-item label="restfull参数" prop="restfulParam" :rules="rules.restfulParam">
                <el-input class="form-action-item-50w" v-model="ruleForm.restfulParam" placeholder="多个用‘,’隔开"
                          clearable/>
            </el-form-item>
            <el-form-item label="请求类型" prop="reqType">
                <el-select class="form-action-item-50w" v-model="ruleForm.reqType" clearable placeholder="请选择">
                    <el-option label="GET" value="1"/>
                    <el-option label="POST" value="2"/>
                    <el-option label="PUT" value="3"/>
                    <el-option label="DELETE" value="4"/>
                </el-select>
            </el-form-item>
            <el-form-item label="接口类型" prop="configType">
                <el-select class="form-action-item-50w" v-model="ruleForm.configType" clearable placeholder="请选择"
                           @change="dictTypeChange">
                    <el-option label="透传接口" value="1"/>
                    <el-option label="聚合接口" value="2"/>
                </el-select>
            </el-form-item>
            <el-form-item label="数据源" prop="dataSourceType">
                <el-select class="form-action-item-50w" v-model="ruleForm.dataSourceType" clearable placeholder="请选择">
                    <el-option label="接口" value="0"/>
                    <el-option label="ES" value="1"/>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select class="form-action-item-50w" v-model="ruleForm.status" clearable placeholder="请选择">
                    <el-option label="已上线" value="1"/>
                    <el-option label="未上线" value="0"/>
                </el-select>
            </el-form-item>
            <el-form-item label="创建人" prop="creatorId" :rules="rules.creatorId">
                <el-input class="form-action-item-50w" v-model="ruleForm.creatorId" placeholder="最多输入10字符长度" clearable/>
            </el-form-item>
            <el-form-item label="修改人" prop="modifierId" :rules="rules.modifierId">
                <el-input class="form-action-item-50w" v-model="ruleForm.modifierId" placeholder="最多输入10字符长度"
                          clearable/>
            </el-form-item>
            <el-form-item label="文档" prop="docApi" :rules="rules.docApi">
                <el-input class="form-action-item-50w" v-model="ruleForm.docApi" clearable/>
            </el-form-item>
            <el-form-item label="项目" prop="projectVersion" :rules="rules.projectVersion">
                <el-input class="form-action-item-50w" v-model="ruleForm.projectVersion" clearable/>
            </el-form-item>
        </el-form>
        <div>
            <JsonEditorVue class="editor" v-model="ruleForm.inputConfig" @blur="validate"
                           @update:modelValue="updateModelValue"/>
        </div>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary" v-if="handleType === 'add' || handleType === 'edit'"
                           @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
                <el-button type="primary" @click="handleClose">
                    取消
                </el-button>
            </span>
        </div>
    </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { getOneConfig, addConfig, updateConfig, dict } from '@/api/system/urlConfig'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import JsonEditorVue from 'json-editor-vue3'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => handleType === 'edit')
const handleType = route.query.handleType
const configCode = route.query.configCode
const mgList = reactive({})

// 返回批次列表
const backList = async () => {
    router.back()
}
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    backList()
}
const ruleFormRef = ref('')
const ruleForm = reactive({
    name: '',
    inputConfig: null
})

// 表单项规则
const rules = reactive({
    name: [
        {
            required: true,
            message: '请输入',
            trigger: 'change'
        },
        {
            max: 40,
            message: '最长不超过40个字符长度',
            trigger: 'change'
        }
    ]
})

// 获取优惠券批次单条数据
const getsingleData = async () => {
    const res = await getOneConfig(configCode)
    Object.assign(ruleForm, res.data)
    ruleForm.domain = null
    ruleForm.reqType = ruleForm.reqType.toString()
    ruleForm.configType = ruleForm.configType.toString()
    ruleForm.status = ruleForm.status.toString()
    ruleForm.dataSourceType = ruleForm.dataSourceType.toString()
    ruleForm.inputConfig = (ruleForm.inputConfig === 'null' || ruleForm.inputConfig === '' || ruleForm.inputConfig === '{}') ? null : JSON.parse(ruleForm.inputConfig)
}
onMounted(async () => {
    await getMg()
})

const getMg = async () => {
    const res = await dict('mg')
    Object.assign(mgList, res.data)
}

const inputConfig = {
    bodyDef: [
        {
            name: 'appKey',
            type: 'String',
            title: '系统标识',
            verifyRule: 'fun.vad.notNull()'
        }
    ],
    flows: [
        {
            name: 'flow1',
            requests: [
                {
                    name: 'request1',
                    configCode: 'xxx',
                    conditions: [
                        'bsh:#fun.user.get("userId")# == 12'
                    ],
                    body: {
                        appKey: 'input.body.appKey'
                    },
                    fixedBody: {
                        status: 1
                    },
                    isStop: true,
                    response: {
                        body: {
                            dealList: 'fun.agg.listDistinct(fun.path.jsonPath("flow1.request1.response.data.list[*].skuId"))'
                        }
                    }
                }
            ]
        },
        {
            name: 'flow2',
            requests: [
                {
                    name: 'request1',
                    configCode: 'xxx',
                    conditions: [],
                    body: {
                        skuIdList: 'flow1.request1.response.config.dealList'
                    },
                    fixedBody: {},
                    isStop: true,
                    response: {}
                }
            ]
        }
    ],
    inputResponse: {
        body: {
            code: 'flow1.request1.response.body.code',
            msg: 'flow1.request1.response.body.msg',
            list: 'fun.agg.listJoin(fun.path.jsonPath("flow1.request1.response.body.data.list"), fun.agg.Path("flow2.request1.response.body.data"),"skuId:skuId")'
        },
        titleList: [
            {
                fun: 'fun.export.fenToYuan()',
                title: 'xxx',
                field: 'xxx',
                sort: 0
            }
        ]
    }
}

// 字典类型改变，清空字典内容
const dictTypeChange = (param) => {
    if (param === '2') {
        ruleForm.inputConfig = inputConfig
    } else {
        ruleForm.inputConfig = {}
    }
}

if (handleType) {
    if (handleType !== 'add') {
        getsingleData()
    }
}
// 提交表单
const submitForm = async (formEl) => {
    const params = {
        ...ruleForm,
        appKey: 'A1001000',
        busiCode: 'A1001000'
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        ruleForm.inputConfig = (ruleForm.inputConfig === 'null' || ruleForm.inputConfig === '' || ruleForm.inputConfig === '{}') ? null : ruleForm.inputConfig
        if (valid) {
            if (handleType === 'add') {
                const res = await addConfig({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            } else {
                const res = await updateConfig([{ ...params }])
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            }
        }
    })
}
const validate = async (editor) => {
    const res = await editor.validate()
    // res 是错误列表，如果是空数组，则表示检测没有错误
    console.log(res)
}
const updateModelValue = (val) => {
    ruleForm.inputConfig = val
    // console.log(val, '修改了值')
}
</script>
<style lang="scss" scoped>
.submit-box {
    .dictContentBox {
        width: 100%;

        .checkedItem {
            display: block;
        }
    }

    .form-text {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        color: #606266;
        font-size: 14px;
    }

    .form-text-btn {
        display: inline-block;
        margin-left: 5px;
        color: #fe2c55;
        cursor: pointer;
    }

    .footer {
        margin: 30px;
        text-align: center;
    }
}
</style>
