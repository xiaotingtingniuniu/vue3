<template>
    <div>
        <el-form ref="formRef" :model="formData" label-width="120px" :inline="false">
            <el-form-item label="付款方名称" prop="payMerchantName" :rules="rules.inputRules">
                <el-input v-model="formData.payMerchantName" placeholder="请输入付款方名称" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="付款方账户" prop="payMerchantAccount" :rules="rules.inputRules">
                <el-input v-model="formData.payMerchantAccount" placeholder="请输入付款方账户" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="付款方式" prop="payWays" :rules="rules.inputRules">
                <el-input v-model="formData.payWays" disabled/>
            </el-form-item>
            <el-form-item label="付款金额" prop="payAmount" :rules="rules.inputRules">
                <el-input v-model.number="formData.payAmount" placeholder="请输入付款金额" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="收款方名称" prop="merchantName" :rules="rules.inputRules">
                <el-input v-model="formData.merchantName" placeholder="请输入收款方名称" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="收款方账户" prop="merchantAccount" :rules="rules.inputRules">
                <el-input v-model="formData.merchantAccount" placeholder="请输入收款方账户" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="资金凭证号" prop="payVoucher" :rules="rules.inputRules">
                <el-input v-model="formData.payVoucher" placeholder="请输入资金凭证号" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item label="资金凭证截图" props="payVoucherList">
                <cst-upload
                    :multiple="true"
                    v-model:fileList="formData.payVoucherList"
                    accept=".jpg,.png,.jpeg"
                    tip="支持扩展名：jpg,jpeg,png,文件最大不超过2M"/>
            </el-form-item>
            <el-form-item label="资金用途" prop="payUseFor" :rules="rules.inputRules">
                <el-input v-model="formData.payUseFor" placeholder="请输入资金用途" :disabled="dataState.isExist" />
            </el-form-item>
            <el-form-item class="button-box">
                <div>
                    <el-button type="primary" @click="clear">取消</el-button>
                    <el-button type="primary" @click="submit(formRef)" v-if="!dataState.isExist">提交</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getMerchantListCode } from '@/api/operate/index'
import { ElMessage } from 'element-plus'
import CstUpload from './comments/upload.vue'
const route = useRoute()
const router = useRouter()
const billno = route.params.billNo
const dataState = reactive({
    isExist: false
})
// 表单数据
const formData = ref({
    payMerchantName: '',
    payMerchantAccount: '',
    payWays: 1,
    payAmount: '',
    merchantName: '',
    merchantAccount: '',
    payVoucher: '',
    payUseFor: '',
    payVoucherList: []
})
const pageinfo = reactive({
    page: 1,
    pageSize: 10,
    total: ''
})

const dialogVisible = ref(false)
const handleType = ref('')
const kuid = ref('')
// 表格数据
const detailData = ref({})
// 重置按钮功能
const formRef = ref('')
// const resetForm = () => {
//     formRef.value.resetFields()
// }

// 搜索按钮
const submit = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const params = {
                body: {
                    ...formData.value,
                    payVoucherUrl: formData.value.payVoucherList[0].response.data,
                    payBillNo: billno
                },
                appKey: 'A1001001',
                busiCode: 'A1001006',
                configCode: 'UC66189591848710144',
                name: '收款设置提交',
                source: '采销财务系统'
            }
            delete params.body.payVoucherList
            const res = await getMerchantListCode(params)
            if (res.code === '200') {
                ElMessage.success(res.message)
                clear()
            }
        }
    })
}
const rules = reactive({
    inputRules: [{ required: true, message: '请输入', trigger: 'change' }]
})
// 接口请求数据
const getOrderList = async () => {
    const params = {
        body: {
            payBillNo: billno
        },
        appKey: 'A1001001',
        busiCode: 'A1001006',
        configCode: 'UC66190026961612800',
        name: '付款凭证查询',
        source: '采销财务系统'
    }
    const res = await getMerchantListCode(params)
    if (res.code === '200') {
        dataState.isExist = res.data.exist
        if (!dataState.isExist) return false
        Object.assign(formData.value, res.data.payVoucher)
        formData.value.payVoucherList.push({
            response: {
                data: res.data.payVoucher.payVoucherUrl
            }
        })
    }
}

const clear = () => {
    router.back()
}
onMounted(async () => {
    await getOrderList()
})

</script>

<style lang="scss" scoped>
.button-box {
    display: flex;
    div {
        flex: 1;
    }
}
</style>
