<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="dialogVisible" :before-close="handleClose">
            <template #title>
                <div class='dialog-title'>
                    新建账户
                </div>
            </template>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="账户名称：" prop="acctName">
                    <el-input v-model="ruleForm.acctName" maxlength="16" placeholder="请输入～"></el-input>
                </el-form-item>
                <el-form-item label="账户类型：" prop="acctType">
                    <el-select v-model="ruleForm.acctType" placeholder="请选择～">
                        <el-option v-for="item in acctTypeStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构：" prop="deptName">
                    <el-select v-model="ruleForm.deptName" placeholder="请选择～">
                        <el-option v-for="item in deptStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算中心：" prop="centorName">
                    <el-select v-model="ruleForm.centorName" placeholder="请选择～">
                        <el-option v-for="item in centorStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算科目：" prop="subjectName">
                    <el-select v-model="ruleForm.subjectName" placeholder="请选择～">
                        <el-option v-for="item in subjectStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算项目：" prop="projectName">
                    <el-select v-model="ruleForm.projectName" placeholder="请选择～">
                        <el-option v-for="item in projectStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">关闭</el-button>
                    <el-button type="primary" @click="submit()">保存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { postAddAccount } from '@/api/marketing/marketing-cost'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps({
    visible: {
        type: Boolean
    }
})
const dataState = reactive({
    ruleForm: {
        acctName: '',
        acctType: '1',
        deptName: '',
        centorName: '',
        subjectName: '',
        projectName: ''
    },
    // 账户类型
    acctTypeStatus: [
        {
            value: '1',
            label: '公司内部'
        }
    ],
    // 预算机构
    deptStatus: [
        {
            value: 'A001',
            label: '恒生活'
        }
    ],
    // 预算中心
    centorStatus: [
        {
            value: 'A1001001',
            label: '恒生活App'
        }
    ],
    // 预算科目
    subjectStatus: [
        {
            value: 'A100100101',
            label: '营销费用'
        }
    ],
    // 预算项目
    projectStatus: [
        {
            value: 'A10010010101',
            label: '优惠券'
        }
    ]
})
const { ruleForm, acctTypeStatus, deptStatus, centorStatus, subjectStatus, projectStatus } = toRefs(dataState)
const ruleFormRef = ref(null)
const dialogVisible = ref(props.visible)
const emit = defineEmits(['handleClose'])
const handleClose = () => {
    emit('handleClose', props.visible)
}
const rules = reactive({
    acctName: [
        { required: true, message: '请输入账户名称～', trigger: 'blur' }
    ],
    deptName: [
        { required: true, message: '请选择机构～', trigger: 'blur' }
    ],
    centorName: [
        { required: true, message: '请选择预算中心～', trigger: 'blur' }
    ],
    subjectName: [
        { required: true, message: '请选择预算科目～', trigger: 'blur' }
    ],
    projectName: [
        { required: true, message: '请选择预算项目～', trigger: 'blur' }
    ]
})

// 提交数据
const submit = async () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const params = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                acctName: dataState.ruleForm.acctName,
                acctType: dataState.ruleForm.acctType,
                deptCode: dataState.ruleForm.deptName.value,
                deptName: dataState.ruleForm.deptName.label,
                centorCode: dataState.ruleForm.centorName.value,
                centorName: dataState.ruleForm.centorName.label,
                subjectCode: dataState.ruleForm.subjectName.value,
                subjectName: dataState.ruleForm.subjectName.label,
                projectCode: dataState.ruleForm.projectName.value,
                projectName: dataState.ruleForm.projectName.label,
                principalId: userInfo.value.account,
                principalName: userInfo.value.name,
                acctStatus: 1,
                creatorId: userInfo.value.account,
                modifierId: userInfo.value.account
            }
            const res = await postAddAccount(params)
            if (res.code === '200') {
                ElMessage.success('新建账户成功！')
                emit('handleClose', props.visible)
            }
        }
    })
}

</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
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
<style>
.el-radio{
    white-space:break-spaces;
    height:40px
}
</style>
