
<template>
    <div>
        <el-dialog
            v-model="$props.modelValue"
            :title="title"
            width="900px"
            height="1000px"
            @close="close"
            draggable
        >
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="设备编号：" prop="equipmentCode">
                    <el-input v-model="ruleForm.equipmentCode" disabled placeholder="请选择～"></el-input>
                </el-form-item>
                <el-form-item label="设备名称：" prop="equipmentName">
                    <el-input v-model="ruleForm.equipmentName" disabled placeholder="请选择～"></el-input>
                </el-form-item>
                <el-form-item label="设备点位：" prop="pointName">
                    <el-input v-model="ruleForm.pointName" disabled placeholder="请选择～"></el-input>
                </el-form-item>
                <el-form-item>
                    <template #default>
                        <div>
                            <span>请选择补货规则，系统会在指定的时间根据规则自动生成补货单</span>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="整柜缺货率：" prop="wholeShortageRate" :rules="rules.repRateMax">
                    <el-input v-model.number="ruleForm.wholeShortageRate" placeholder="请选择～"><template v-slot:suffix>%</template></el-input>
                </el-form-item>
                <el-form-item label="单品缺货率：" prop="skuShortageRate" :rules="rules.repRateMax">
                    <el-input v-model.number="ruleForm.skuShortageRate" placeholder="请选择～"><template v-slot:suffix>%</template></el-input>
                </el-form-item>
            </el-form>
            <div class="sku-btns">
                <el-button @click="cancelSku">
                    取消
                </el-button>
                <el-button type="primary" @click="confirmSku(ruleFormRef)">
                    确认
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed, defineProps, defineEmits } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { repRuleDetailSave } from '@/api/operate/index'

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
    row: {
        type: Object,
        default: () => {}
    },
    title: {
        type: String
    }
})
const dataState = reactive({
    ruleForm: {
        id: '',
        equipmentCode: '',
        equipmentName: '',
        pointName: '',
        wholeShortageRate: '',
        skuShortageRate: ''
    }
})
const { ruleForm } = toRefs(dataState)
const store = useStore()
const myCmnType = ref(2)
const userInfo = computed(() => store.state.userInfo)
const emits = defineEmits(['update:modelValue', 'gitList'])
const ruleFormRef = ref()
const tableData = ref([])
const close = () => {
    emits('update:modelValue', false)
    emits('getList')
}
const visible = ref(false)
// 校验规则：支持输入整数数字，可输入范围0~100
const numValidator = (rule, value, callback) => {
    if (value === '') {
        callback()
    } else {
        if (!Number.isInteger(value)) {
            callback(new Error('支持输入整数数字'))
        } else {
            if (value >= 0 && value <= 100) {
                callback()
            } else {
                callback(new Error('请输入大于等于0且小于等于100的数字'))
            }
        }
    }
}
// 表单项规则
const rules = reactive({
    repRateMax: [{ validator: numValidator, trigger: 'change' }]
})
const init = async () => {
    dataState.ruleForm = props.row
//     if (props.type === 'add') {
//         return null
//     } else {
//         ruleForm.value.ratioLevelFirst = props.row.ratioLevelFirst
//         ruleForm.value.ratioLevelSecond = props.row.ratioLevelSecond
//         ruleForm.value.ratioStartTime = props.row.ratioStartTime.substring(0, 10)
//         ruleForm.value.ratioEndTime = props.row.ratioEndTime.substring(0, 10)
//     }
}
init()
// 取消
const cancelSku = async () => {
    emits('update:modelValue', false)
    emits('getList')
}
// 确认
const confirmSku = async (formEl) => {
    if (!formEl) return
    if (dataState.ruleForm.wholeShortageRate === '' && dataState.ruleForm.skuShortageRate === '') {
        ElMessage.warning('整柜与单品缺货率不可同时为空')
        return
    }
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                id: dataState.ruleForm.id,
                wholeShortageRate: dataState.ruleForm.wholeShortageRate,
                skuShortageRate: dataState.ruleForm.skuShortageRate,
                creatorId: userInfo.value.id
            }
            const res = await repRuleDetailSave(params)
            if (res.code === '200') {
                emits('update:modelValue', false)
                emits('getList')
            }
        }
    })
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
.sku-btns{
    margin: 0 auto;
    width: fit-content;
    margin-top: 20px;
}
</style>
