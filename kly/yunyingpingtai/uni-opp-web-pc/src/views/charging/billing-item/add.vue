<template>
    <div class="subaccount-list">
        <div class='submit-box'>
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="费率类型" prop="feeMode" :rules="rules.feeMode" >
                    <el-select v-model="ruleForm.feeMode" placeholder="请选择费率类型">
                        <el-option label="固定金额" :value="1" />
                        <el-option label="百分比" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="计费场景" prop="feeScene" :rules="rules.feeScene">
                    <el-select v-model="ruleForm.feeScene" placeholder="请选择计费场景">
                        <el-option label="货柜" :value="1" />
                        <el-option label="批发商城" :value="2" />
                        <el-option label="本地生活" :value="3" v-if="ruleForm.feeMode === 2"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="计费项" prop="feeCode" :rules="rules.feeCode" style="width: 450px">
                    <el-select v-model="ruleForm.feeCode" placeholder="请选择计费项">
                        <el-option label="算法使用费" :value="1" />
                        <el-option label="平台服务费" :value="2" v-if="ruleForm.feeMode === 2"/>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="计费英文名称" prop="ebillingitem" :rules="rules.ebillingitem" style="width: 450px">
                    <el-select v-model="ruleForm.ebillingitem" placeholder="请选择计费场景">
                        <el-option label="算法服务费" value="1" />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="开始时间" prop="startTime" :rules="rules.startTime" style="width: 450px">
                    <el-date-picker
                        v-model="ruleForm.startTime"
                        placeholder="请选择开始时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime" :rules="rules.endTime" style="width: 450px">
                    <el-date-picker
                        v-model="ruleForm.endTime"
                        placeholder="请选择结束时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="归属角色" prop="feeAttribution" :rules="rules.feeAttribution" style="width: 450px">
                    <el-select v-model="ruleForm.feeAttribution" placeholder="请选择归属角色">
                        <el-option label="平台" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="费率" prop="feeAmount" :rules="rules.feeAmount" style="width: 240px">
                    <el-row style="flex: 1">
                        <el-col :span="22"><el-input class="form-action-item-50w" v-model="ruleForm.feeAmount" @keyup="ruleForm.feeAmount = oninput(ruleForm.feeAmount)" maxlength="30" clearable/></el-col>
                        <el-col :span="2" style="text-align:center">{{ruleForm.feeMode === 1 ? '元': '%'}}</el-col>
                    </el-row>
                </el-form-item>
                <!-- <el-form-item v-else label="费率" prop="feeAmount" :rules="rules.feeAmount" style="width: 240px">
                    <el-row style="flex: 1">
                        <el-col :span="22"><el-input class="form-action-item-50w" v-model="ruleForm.feeAmount" @keyup="ruleForm.feeAmount = oninput(ruleForm.feeAmount)" maxlength="30"  clearable/></el-col>
                        <el-col :span="2" style="text-align:center">元</el-col>
                    </el-row>
                </el-form-item> -->
            </el-form>
            <div class="footer">
                <span class="dialog-footer">
                    <el-button @click="goBack">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确认
                    </el-button>
                </span>
            </div>
        </div>
    </div>
</template >

<script setup>
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
// import { getUpload } from '@/api/sbuaccount.js'
import { getMerchantListCode } from '@/api/operate/index'
import { oninput } from '@/components/digitalCheck'
const props = defineProps(['type', 'merchantSubId', 'busiMerchantId', 'status', 'merchantSubType'])

const router = useRouter()

// 返回批次列表
const goBack = async () => {
    router.back()
}
const ruleFormRef = ref('')

const ruleForm = ref({
    feeMode: '',
    feeScene: '',
    feeCode: '',
    ebillingitem: '',
    startTime: '',
    endTime: '',
    feeAttribution: '',
    feeAmount: ''
})
const isshow = ref(false)
watch(() => ruleForm.value.feeMode,
    (val) => {
        if (val === 2) {
            isshow.value = true
        } else {
            isshow.value = false
        }
    },
    {
        deep: true
    })
// const checkbtn = (val) => {
//     debugger
//     if (val === 2) {
//         isshow.value = true
//     }
// }

// 表单项规则
const rules = reactive({
    feeMode: [
        {
            required: true,
            message: '请选择费率类型',
            trigger: 'change'
        }
    ],
    feeScene: [
        {
            required: true,
            message: '请选择计费率类型',
            trigger: 'change'
        }
    ],
    merchantSubType: [{ required: true, message: '请选择', trigger: 'change' }],
    feeCode: [
        {
            required: true,
            message: '请选择计费项',
            trigger: 'change'
        }
    ],
    ebillingitem: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 32, message: '最长不超过200个字符长度', trigger: 'change' }
    ],
    startTime: [
        {
            type: 'date',
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            type: 'date',
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
        }
    ],
    feeAttribution: [
        {
            required: true,
            message: '请选择归属角色',
            trigger: 'change'
        }
    ],
    feeAmount: [
        { required: true, message: '请输入费率', trigger: 'blur' }
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
        configCode: 'UC32468539679612928',
        name: '新建&修改计费项接口',
        url: '/settlement/feeConfig/saveOrUpdate',
        source: '结算中台'
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const { code, message } = await getMerchantListCode(params)
            console.log(code)
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
