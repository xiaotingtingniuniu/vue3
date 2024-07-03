
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            title="编辑"
            width="900px"
            @close="close"
            draggable
        >
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="formRule"
                label-width="200px"
                class="demo-ruleForm"
                status-icon
            >
                <el-form-item label="一级应用类目编号" prop="firstCateCode">
                    <el-col :span="10">
                        <el-input v-model="ruleForm.firstCateCode" placeholder="" disabled/>
                    </el-col>
                </el-form-item>
                <el-form-item label="一级应用类目名称" prop="firstCateName">
                    <el-col :span="10">
                        <el-input v-model="ruleForm.firstCateName" placeholder="" disabled/>
                    </el-col>
                </el-form-item>
                <el-form-item label="二级应用类目编号" prop="secondCateCode">
                    <el-col :span="10">
                        <el-input v-model="ruleForm.secondCateCode" placeholder="" disabled/>
                    </el-col>
                </el-form-item>
                <el-form-item label="二级应用类目名称" prop="secondCateName">
                    <el-col :span="10">
                        <el-input v-model="ruleForm.secondCateName" placeholder="" disabled/>
                    </el-col>
                </el-form-item>
                <el-form-item label="分销费率" prop="cateRate">
                    <el-col :span="5">
                        <el-input v-model="ruleForm.cateRate" placeholder=""/>
                    </el-col>
                    &nbsp;<span>%</span>
                </el-form-item>
                <el-form-item label="开始生效时间" prop="startTime" class="form-item-time">
                    <el-col :span="5">
                        <el-date-picker v-model="ruleForm.startTime"  type="date" placeholder="请选择日期" value-format="YYYY-MM-DD"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="失效时间" prop="endTime" class="form-item-time">
                    <el-col :span="5">
                        <el-date-picker v-model="ruleForm.endTime"  type="date" placeholder="请选择日期" value-format="YYYY-MM-DD"/>
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { saveList } from '@/api/distributionManagement'

const props = defineProps({
    type: String,
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    },
    row: Array
})

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const router = useRouter()

const ruleFormRef = ref()

const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}

// 表单数据
const ruleForm = ref({
    firstCateCode: null,
    firstCateName: null,
    secondCateCode: null,
    secondCateName: null,
    commissionRate: null,
    startTime: null,
    endTime: null,
    creatorId: userInfo.value.name,
    modifierId: userInfo.value.name
})

const init = async () => {
    console.log(props.row)
    ruleForm.value.firstCateCode = props.row.firstCateCode
    ruleForm.value.firstCateName = props.row.firstCateName
    ruleForm.value.cateRate = props.row.cateRate
    ruleForm.value.secondCateCode = props.row.secondCateCode
    ruleForm.value.secondCateName = props.row.secondCateName
    ruleForm.value.commissionRate = props.row.commissionRate
    ruleForm.value.startTime = props.row.startTime.substring(0, 10)
    ruleForm.value.endTime = props.row.endTime.substring(0, 10)
    console.log(ruleForm.value.startTime, ruleForm.value.endTime)
}
init()

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onEdit()
        }
    })
}
const onEdit = async () => {
    const params = {
        ...ruleForm.value,
        appKey: 'A1001001',
        busiCode: 'A1001',
        id: props.row.id
    }
    const res = await saveList(params)
    if (res.code === '200') {
        close()
        ElMessage({
            message: '编辑成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '编辑失败',
            type: 'error'
        })
    }
}
const resetForm = (formEl) => {
    if (ruleFormRef.value) {
        ruleFormRef.value.resetFields()
    }
}

// 表单校验规则
const formRule = reactive({
    commissionRate: [
        {
            required: true,
            message: '请输入分销费率',
            trigger: 'change'
        }
    ],
    startTime: [
        {
            required: true,
            message: '请输入开始生效时间',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            required: true,
            message: '请输入失效时间',
            trigger: 'change'
        }
    ]

})

</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
.avatar-uploader .el-upload{
    width: 200px;
    height: 200px;
}

.avatar-uploader{
    width: 300px;
    height: 300px;
}
</style>
