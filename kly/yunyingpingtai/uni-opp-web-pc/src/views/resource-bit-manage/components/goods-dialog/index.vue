<template>
    <el-dialog
        v-model="$props.modelValue"
        title="编辑"
        width="600px"
        @close="close"
        draggable
    >
        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            label-width="140px"
            class="demo-ruleForm"
            status-icon
        >
            <el-form-item label="商品名称" prop="skuName">
                {{ruleForm.skuName}}
            </el-form-item>
            <el-form-item label="是否上架" prop="isEnabled">
                <el-select
                    v-model="ruleForm.isEnabled"
                    placeholder="请选择状态"
                >
                    <el-option label="上架" :value="1" />
                    <el-option label="下架" :value="0" />
                </el-select>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
                <el-input v-model="ruleForm.orderNum" placeholder="请输入排序" maxlength="9" minlength="1"/>
            </el-form-item>
            <el-form-item>
                <el-button @click="close">取消</el-button>
                <el-button @click="dialogVisible=true">从列表移除</el-button>
                <el-button type="primary" @click="submitForm">保存</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            v-model="dialogVisible"
            width="30%"
        >
            <span>是否确认移除该商品</span>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">否</el-button>
                    <el-button type="primary" @click="removeList"
                    >是</el-button
                    >
                </span>
            </template>
        </el-dialog>
    </el-dialog>
</template>
<script setup>
import { reactive, ref, toRefs, onMounted, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const dialogVisible = ref(false)
const props = defineProps({
    currentVal: {
        type: Object,
        default: () => {}
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const close = () => {
    emit('update:modelValue', false)
}
const ruleForm = reactive({
    skuId: props.currentVal.skuId, // 商品id/名称
    skuName: props.currentVal.skuName, // 商品/名称
    isEnabled: props.currentVal.isEnabled, // 请选择状态
    orderNum: props.currentVal.orderNum, // 排序
    operatorId: props.currentVal.operatorId, // 操作人
    type: props.currentVal.type, // 类型
    isDeleted: props.currentVal.isDeleted// 是否移除
})
const ruleForms = reactive({
    skuId: props.currentVal.skuId, // 商品id/名称
    skuName: props.currentVal.skuName, // 商品/名称
    isEnabled: props.currentVal.isEnabled, // 请选择状态
    orderNum: props.currentVal.orderNum, // 排序
    operatorId: props.currentVal.operatorId, // 操作人
    type: props.currentVal.type, // 类型
    isDeleted: 1// 是否移除
})

const removeList = async () => {
    emit('confirm', ruleForms)
}
// 提交
const submitForm = async () => {
    console.log('submit!', ruleForm)
    if (ruleForm.orderNum) {
        emit('confirm', ruleForm)
    } else {
        ElMessage({
            message: '序号不能为空',
            type: 'error'
        })
    }
}
</script>
<style>
.demo-ruleForm .el-input {
    width: 300px;
}
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
</style>
