<template>
    <div class="subaccount-list">
        <el-dialog v-model="dialogVisible" title="编辑" width="50%" @close="clostDialog">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="一级类目编码" prop="firstCateCode">
                    <el-input v-model="ruleForm.firstCateCode" placeholder="请输入一级类目编码" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="一级类目名称" prop="firstCateName">
                    <el-input v-model="ruleForm.firstCateName" placeholder="请输入一级类目名称" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="二级类目编码" prop="secondCateCode">
                    <el-input v-model="ruleForm.secondCateCode" placeholder="请输入二级类目编码" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="二级类目名称" prop="secondCateName">
                    <el-input v-model="ruleForm.secondCateName" placeholder="请输入二级类目名称" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="三级类目编码" prop="thirdCateCode">
                    <el-input v-model="ruleForm.thirdCateCode" placeholder="请输入二级类目编码" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="三级类目名称" prop="thirdCateName">
                    <el-input v-model="ruleForm.thirdCateName" placeholder="请输入二级类目名称" clearable style="width: 450px" disabled/>
                </el-form-item>
                <el-form-item label="开始失效时间" prop="startTime" :rules="rules.startTime">
                    <el-date-picker
                        v-model="ruleForm.startTime"
                        placeholder="请选择开始失效时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="失效时间" prop="endTime" :rules="rules.endTime">
                    <el-date-picker
                        v-model="ruleForm.endTime"
                        placeholder="请选择失效时间"
                        type="datetime"
                        value-format="YYYY-MM-DD HH:mm:ss"
                    />
                </el-form-item>
                <el-form-item label="费率" prop="cateRate" :rules="rules.cateRate">
                    <el-row>
                        <el-col :span="22"><el-input class="form-action-item-50w" v-model="ruleForm.cateRate" maxlength="30" clearable/></el-col>
                        <el-col :span="2" style="text-align:center">%</el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <div class="footer">
                <span class="dialog-footer">
                    <el-button @click="clostDialog">
                        取消
                    </el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                        确认
                    </el-button>
                </span>
            </div>
        </el-dialog>
    </div>
</template >

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { editrates } from '@/api/accountManagement/index'
import { ElMessage } from 'element-plus'
const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    }
})
const dialogVisible = ref(props.visible)
const rowList = ref(props.rowList)
const ruleFormRef = ref('')
onMounted(() => {
    Object.assign(ruleForm, rowList)
})
const ruleForm = ref({
    firstCateCode: '',
    firstCateName: '',
    secondCateCode: '',
    secondCateName: '',
    thirdCateCode: '',
    thirdCateName: '',
    cateRate: '',
    startTime: '',
    endTime: '',
    id: '',
    busiCode: ''
})

// 表单项规则
const rules = reactive({
    startTime: [
        {
            type: 'date',
            required: true,
            message: '请选择失效开始时间',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            type: 'date',
            required: true,
            message: '请选择失效时间',
            trigger: 'change'
        }
    ],
    cateRate: [
        { required: true, message: '请输入费率', trigger: 'blur' }
    ]
})
// 关闭弹窗
const clostDialog = () => {
    // dialogVisible.value = false
    emit('clostDialog', props.visible)
}
const emit = defineEmits(['clostDialog'])

// 提交表单
const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const param = {
                // ...ruleForm.value,
                firstCateCode: ruleForm.value.firstCateCode,
                firstCateName: ruleForm.value.firstCateName,
                secondCateCode: ruleForm.value.secondCateCode,
                secondCateName: ruleForm.value.secondCateName,
                thirdCateCode: ruleForm.value.thirdCateCode,
                thirdCateName: ruleForm.value.thirdCateName,
                cateRate: ruleForm.value.cateRate,
                startTime: ruleForm.value.startTime,
                endTime: ruleForm.value.endTime,
                id: rowList.value.id,
                busiCode: rowList.value.busiCode
            }
            await editrates(param)
            ElMessage({
                type: 'success',
                message: '修改成功'
            })
            formEl.resetFields()
            emit('clostDialog', props.visible)
        }
    })
}
// const submitForm = async (formEl) => {
//     const params = {
//         body: {
//             ...ruleForm.value,
//             modifierId: JSON.parse(localStorage.getItem('userInfo'))?.account ?? '',
//             modifier: JSON.parse(localStorage.getItem('userInfo'))?.name ?? ''
//         },
//         appKey: 'A1001001',
//         busiCode: 'A1001001',
//         configCode: 'UC32468539679612928',
//         name: '新建&修改计费项接口',
//         url: '/settlement/feeConfig/saveOrUpdate',
//         source: '结算中台'
//     }
//     if (!formEl) return
//     await formEl.validate(async (valid, fields) => {
//         if (valid) {
//             const { code, message } = await getMerchantListCode(params)
//             console.log(code)
//             if (Number(code) === 200) {
//                 ElMessage({
//                     message: message,
//                     type: 'success'
//                 })
//                 router.back()
//             }
//         }
//     })
// }
</script>
<style lang="scss" scoped>
.subaccount-list{}
</style>
