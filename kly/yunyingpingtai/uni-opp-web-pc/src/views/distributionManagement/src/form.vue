
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="dialogTitle"
            width="900px"
            @close="close"
            draggable
        >
            <el-form
                ref="ruleFormRef"
                :model="ruleForm"
                :rules="formRule"
                label-width="120px"
                class="demo-ruleForm"
                status-icon
            >
                <el-form-item label="分销模式" prop="cmnType" width="120px">
                    <el-col :span="10">
                        <el-input value="二级分销" placeholder="请输入分销模式" disabled/>
                    </el-col>
                </el-form-item>
                <el-form-item label="一级分销比例" prop="ratioLevelFirst" width="50px">
                    <el-col :span="5">
                        <el-input v-model="ruleForm.ratioLevelFirst" placeholder="请输入一级分销比例"/>
                    </el-col>
                    &nbsp;<span>%</span>
                </el-form-item>
                <el-form-item label="二级分销比例" prop="ratioLevelSecond" width="120px">
                    <el-col :span="5">
                        <el-input v-model="ruleForm.ratioLevelSecond" placeholder="请输入二级分销比例"/>
                    </el-col>
                    &nbsp;<span>%</span>
                </el-form-item>
                <el-form-item label="开始生效时间" prop="ratioStartTime" class="form-item-time">
                    <el-col :span="5">
                        <el-date-picker
                            v-model="ruleForm.ratioStartTime"
                            type="date"
                            value-format="YYYY-MM-DD"
                            :disabledDate="disabledDateFun"
                            placeholder="开始时间"
                        />
                    </el-col>
                </el-form-item>
                <el-form-item label="失效时间" prop="ratioEndTime" class="form-item-time">
                    <el-col :span="5">
                        <el-date-picker v-model="ruleForm.ratioEndTime"  type="date" placeholder="失效日期" value-format="YYYY-MM-DD"/>
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
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { proportionConfigModif, proportionConfig } from '@/api/distributionManagement'

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
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const ruleFormRef = ref()

const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}

// 表单数据
const ruleForm = ref({
    cmnType: myCmnType,
    ratioLevelFirst: null,
    ratioLevelSecond: null,
    ratioStatus: 2,
    ratioStartTime: null,
    ratioEndTime: null,
    creatorId: userInfo.value.name,
    remark: null
})

const init = async () => {
    if (props.type === 'add') {
        return null
    } else {
        ruleForm.value.ratioLevelFirst = props.row.ratioLevelFirst
        ruleForm.value.ratioLevelSecond = props.row.ratioLevelSecond
        ruleForm.value.ratioStartTime = props.row.ratioStartTime.substring(0, 10)
        ruleForm.value.ratioEndTime = props.row.ratioEndTime.substring(0, 10)
    }
}
init()

const dialogTitle = computed(() => {
    let title = ''
    if (props.type === 'add') {
        title = '新增'
    } else if (props.type === 'edit') {
        title = '编辑'
    }
    return title
})

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid) => {
        valid && props.type === 'add' ? onNewly() : onEdit()
    })
}
const onNewly = async () => {
    const params = {
        ...ruleForm.value
    }
    const { code } = await proportionConfig(params)
    if (code === '200') {
        ElMessage.success('新增成功')
        close()
    }
}
const onEdit = async () => {
    const params = {
        ...ruleForm.value,
        id: props.row.id,
        modifierId: userInfo.value.name
    }
    const res = await proportionConfigModif(params)
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
// 表单校验规则
const formRule = reactive({
    cmnType: [
        { required: true, message: '分销模式', trigger: 'change' }
    ],
    ratioLevelFirst: [
        {
            required: true,
            message: '请输入一级分销比例',
            trigger: 'change'
        }
    ],
    ratioLevelSecond: [
        {
            required: true,
            message: '请输入二级分销比例',
            trigger: 'change'
        }
    ],
    ratioStartTime: [
        {
            required: true,
            message: '请输入开始生效时间',
            trigger: 'change'
        }
    ],
    ratioEndTime: [
        {
            required: true,
            message: '请输入失效时间',
            trigger: 'change'
        }
    ]

})
const timeDate = ref(new Date() + 1 * 8.64e7)
// 时间范围
const disabledDateFun = (time) => {
    return time.getTime() < new Date(timeDate.value).getTime()
}
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
.el-form-item{
    display: flex;
}
</style>
