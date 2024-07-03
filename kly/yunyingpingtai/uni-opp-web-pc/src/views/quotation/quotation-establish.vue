<template>
    <h3>报价单创建</h3>
    <el-form ref="ruleFormRef" :model="dataState" :rules="rules" :inline="true" label-position="right" label-width="200px">
        <el-form-item label="报价单名称" prop="feeName">
            <el-input v-model="dataState.feeName" placeholder="请输入～" clearable class="input-line" />
        </el-form-item>
        <el-form-item label="报价单编号" prop="feeNo">
            <el-input v-model="dataState.feeNo" placeholder="请输入～" clearable class="input-line" />
        </el-form-item>
        <!-- 日期 -->
        <el-form-item label="录入报价单生效日期" prop="startTime">
            <el-date-picker
                v-model="dataState.startTime"
                value-format="YYYY-MM-DD hh:mm:ss"
                type="datetime"
                placeholder="录入报价单生效日期"
            />
        </el-form-item>
        <el-form-item label="报价单失效日期" prop="endTime">
            <el-date-picker
                v-model="dataState.endTime"
                value-format="YYYY-MM-DD hh:mm:ss"
                type="datetime"
                placeholder="报价单失效日期"
            />
        </el-form-item>
        <br />
        <el-form-item label="备注" prop="">
            <el-input v-model="dataState.remarks" placeholder="请输入～" clearable class="input-line" />
        </el-form-item>
        <br />
        <el-form-item class="button-box">
            <el-button @click="cancel()">
                取消
            </el-button>
            <el-button type="primary" @click="confirm(ruleFormRef)">
                确认
            </el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { reactive, ref } from '@vue/reactivity'
import { computed } from '@vue/runtime-core'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const ruleFormRef = ref()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const tableData = ref([])
const dataState = reactive({
    feeName: '', // 报价单名称
    feeNo: '', // 报价单编号
    startTime: '', // 生效
    endTime: '', // 失效
    remarks: '' // 备注
})

// 表单验证
const rules = reactive({
    feeNo: [
        { required: true, message: '请输入报价单编号', trigger: 'blur' }
    ],
    feeName: [
        { required: true, message: '请输入报价单名称', trigger: 'blur' }
    ],
    startTime: [
        {
            type: 'date',
            required: true,
            message: '请录入报价单生效日期',
            trigger: 'change'
        }
    ],
    endTime: [
        {
            type: 'date',
            required: true,
            message: '请报价单失效日期',
            trigger: 'change'
        }
    ]
})

// 确认
const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            console.log('submit!通过校验')
            addDeliveryFee()
        } else {
            console.log('error submit!', fields)
        }
    })
}

// 取消
const cancel = () => {
    goout()
}

const goout = () => {
    router.go(-1)
}
// 新建报价单
const addDeliveryFee = async (val) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            feeName: dataState.feeName,
            feeNo: dataState.feeNo,
            startTime: dataState.startTime,
            endTime: dataState.endTime,
            remarks: dataState.remarks,
            creatorId: userInfo.value.id + ''
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11772314822791168',
        name: '新建报价单',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === '200') {
        goout()
        ElMessage({
            message: message,
            type: 'success'
        })
    }
}
</script>
<style lang="scss" scoped>
.el-form {
    padding: 0 5%;
}
.input-line {
    width: 220px;
}
</style>
