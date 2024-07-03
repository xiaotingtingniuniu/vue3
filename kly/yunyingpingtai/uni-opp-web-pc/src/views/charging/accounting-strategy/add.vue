<template>
    <div class="subaccount-list">
        <div class='submit-box'>
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="策略名称" prop="feeStrategyName" :rules="rules.feeStrategyName" style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.feeStrategyName" placeholder="请输入策略名称" clearable/>
                </el-form-item>
                <el-form-item label="计费场景" prop="feeCode" :rules="rules.feeCode" style="width: 450px">
                    <el-select v-model="ruleForm.feeCode" placeholder="请选择计费场景">
                        <el-option label="货柜" value="1" />
                        <el-option label="本地生活" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="计费项" prop="feeCode" :rules="rules.feeCode" style="width: 450px">
                    <el-select v-model="ruleForm.feeCode" placeholder="请选择计费项">
                        <el-option label="算法服务费" value="1" />
                        <el-option label="平台服务费" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="开始生效时间" prop="startTime" :rules="rules.startTime" style="width: 450px">
                    <el-date-picker
                        v-model="ruleForm.startTime"
                        placeholder="请选择开始生效时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="结束生效时间" prop="endTime" :rules="rules.endTime" style="width: 450px">
                    <el-date-picker
                        v-model="ruleForm.endTime"
                        placeholder="请选择结束生效时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-row :gutter="20" style="width: 700px">
                    <el-col :span="8">
                        <el-form-item label="筛选条件" prop="feeEntityType" :rules="rules.feeEntityType" style="width: 450px">
                            <el-select v-model="ruleForm.feeEntityType" placeholder="设备ID">
                                <el-option label="设备ID" value="1" />
                                <el-option label="商家ID" value="2" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="operator" :rules="rules.operator" style="width: 450px">
                            <el-select v-model="ruleForm.operator" placeholder="请选择操作符号">
                                <el-option label="in" value="1" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="entityIds" :rules="rules.entityIds" style="width: 450px">
                            <el-input class="form-action-item-50w" v-model="ruleForm.entityIds" placeholder="请输入条件，多个条件用逗号隔开" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="footer">
                <span class="dialog-footer">
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确认
                    </el-button>
                    <el-button @click="goBack">
                        取消
                    </el-button>
                </span>
            </div>
        </div>
    </div>
</template >

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
// import { getUpload } from '@/api/sbuaccount.js'
import { getMerchantListCode } from '@/api/operate/index'
const props = defineProps(['type', 'merchantSubId', 'busiMerchantId', 'status', 'merchantSubType'])

const router = useRouter()
// const store = useStore()
// const userInfo = computed(() => store.state.userInfo)
// const loginOrgRole = computed(() => store.state.loginOrgRole)

// 返回批次列表
const goBack = async () => {
    router.back()
}
const ruleFormRef = ref('')

const ruleForm = ref({
    feeStrategyName: '',
    feeCode: '',
    startTime: '',
    endTime: '',
    feeEntityType: '',
    operator: '',
    entityIds: ''
})

// 表单项规则
const rules = reactive({
    feeStrategyName: [
        { required: true, message: '请输入', trigger: 'change' }
        // { max: 50, message: '最长不超过50个字符长度', trigger: 'change' }
    ],
    feeCode: [
        {
            required: true,
            message: '请选择计费项',
            trigger: 'change'
        }
    ],
    startTime: [
        {
            type: 'date',
            required: true,
            message: '请选择开始生效时间',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            type: 'date',
            required: true,
            message: '请选择结束生效时间',
            trigger: 'change'
        }
    ],
    feeEntityType: [
        {
            required: true,
            message: '请选择设备ID',
            trigger: 'change'
        }
    ],
    operator: [
        {
            required: true,
            message: '请选择设备ID',
            trigger: 'change'
        }
    ],
    entityIds: [
        { required: true, message: '请输入', trigger: 'change' }
    ]
})

// 提交表单
const submitForm = async (formEl) => {
    const params = {
        body: {
            ...ruleForm.value,
            creatorId: JSON.parse(localStorage.getItem('userInfo'))?.account ?? '',
            creator: JSON.parse(localStorage.getItem('userInfo'))?.name ?? ''
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC32468695024050176',
        name: '新建计费策略接口',
        url: '/settlement/feeStrategy/saveOrUpdate',
        source: '结算中台'
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const { code, message } = await getMerchantListCode(params)
            if (Number(code) === 200) {
                ElMessage({
                    message: message,
                    type: 'success'
                })
                router.back()
            }
        }
    })
}
</script>
<style lang="scss" scoped>

</style>
