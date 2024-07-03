<template>
    <div class="device-application-form">
        <el-dialog
            v-model="$props.modelValue"
            title="新增"
            width="900px"
            height="500px"
            :show-close= false
            draggable
        >
            <el-form ref="formRef" :model="ruleForm" :rules="rules" >
                <el-form-item label="设备型号" prop="modelName">
                    <el-select v-model="ruleForm.modelName" clearable placeholder="请选择">
                        <el-option v-for="(item) in deviceList" :key="item.modelCode" :label=item.modelName :value="{value: item.modelCode, label:item.modelName}"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请数量" prop="applyQty">
                    <el-input v-model.trim="ruleForm.applyQty"></el-input>
                </el-form-item>
                <el-form-item label="申请原因" prop="applyReason">
                    <el-input v-model.trim="ruleForm.applyReason" type="textarea" maxlength="200" :autosize="{ minRows: 2, maxRows: 4}" @input="descInput($event.length)"/>
                    <span class="numberV" style="position: absolute; left: 460px;bottom: -30px; font-size: 12px; color:#ccc">{{txtVal}}/200</span>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(formRef)">提交</el-button>
                    <el-button type="primary" @click="onClose">关闭</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { devicetList, keyCode } from '@/api/deviceManager'
import { get } from 'lodash'

const props = defineProps({
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
const unitypeList = [
    { name: 'xxx-aas-d23', code: '123' },
    { name: 'CVM-FD80DPC21.5S', code: '456' },
    { name: 'MZ-436CVWFP-C0027', code: '789' }
]
const ruleForm = ref({
    modelCode: '', // 设备型号编码
    modelName: '', // 设备型号名称
    applyQty: '', // 申请数量
    applyReason: '', // 申请原因
    operatorId: userInfo.value.account,
    operatorName: userInfo.value.name
})

onMounted(() => {
    getDevMList()
})
const txtVal = ref(0)
const formRef = ref()
const regNum = (rule, value = ruleForm.value.applyQty, callback) => {
    var reg = /^\d{1,5}$/
    if (value === '') {
        callback(new Error('数量不能为空'))
    } else {
        console.log(reg.test(value))
        if (!reg.test(value)) {
            callback(new Error('请输入正确的格式'))
        } else {
            callback()
        }
    }
}
const descInput = (val) => {
    txtVal.value = val
}
const rules = reactive({
    modelName: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
    applyQty: [{ required: true, validator: regNum, trigger: 'change' }],
    applyReason: [{ required: true, message: '请输入原因', trigger: 'change' }]
})

const submitForm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            onSubmit()
        }
    })
}
const onSubmit = async () => {
    const params = {
        ...ruleForm.value,
        ...keyCode,
        modelCode: ruleForm.value.modelName.value,
        modelName: ruleForm.value.modelName.label,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const val = {
        name: '二维码申请',
        configCode: 'UC17603047923167232',
        source: '设备中台'
    }
    const res = await devicetList(params, val)
    if (res.code === '200') {
        onClose()
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

// 获取设备型号列表
const deviceList = ref([])
const getDevMList = async () => {
    const params = {
        ...keyCode
    }
    const val = {
        name: '获取所有的设备型号编号及名称',
        configCode: 'UC19001411414650880',
        source: '设备中台'
    }
    const res = await devicetList(params, val)
    deviceList.value = res.data
}

const onClose = () => {
    console.log('关闭')
    emits('update:modelValue', false)
    emits('getList')
}
</script>
<style scoped lang='scss'>
.device-application-form{
    width: 100%;
    height: 100%;
    .el-input{
        width: 200px;
    }
    .el-textarea{
        width: 500px;
    }
}
</style>
