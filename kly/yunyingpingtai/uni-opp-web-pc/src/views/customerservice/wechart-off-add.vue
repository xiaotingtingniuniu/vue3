<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="dialogVisible" :before-close="handleClose">
            <template #title>
                <div class='dialog-title'>
                    关闭用户微信支付分功能
                </div>
            </template>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="180px" class="demo-ruleForm">
                <el-form-item label="微信支付分申请号" prop="wxPayNo">
                    <el-input v-model.trim="ruleForm.wxPayNo" placeholder="请输入微信支付分申请号，021开头"></el-input>
                </el-form-item>
                <el-form-item>
                    <template #default>
                        <div>
                            <span class="tip">注：用户侧微信支付分订单中的商户单号</span>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="关闭用户支付分原因" prop="closeReason">
                    <el-input v-model.trim="ruleForm.closeReason" placeholder="请简要输入关闭用户支付分的原因" :rows="4" maxlength="200" show-word-limit type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">关闭弹窗</el-button>
                    <el-button type="primary" @click="submit()">关闭微信支付分</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { postWechartOff } from '@/api/refund/index'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps({
    visible: {
        type: Boolean
    }
})
const dataState = reactive({
    ruleForm: {
        wxPayNo: '',
        acctType: ''
    }
})
const { ruleForm } = toRefs(dataState)
const ruleFormRef = ref(null)
const dialogVisible = ref(props.visible)
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}
const wxPayNoValid = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入021开头商户编号，即微信支付分申请号！'))
    } else if (value.slice(0, 3) !== '021') {
        callback(new Error('请输入021开头商户编号，即微信支付分申请号！'))
    } else {
        callback()
    }
}
const rules = reactive({
    wxPayNo: [
        { required: true, validator: wxPayNoValid, trigger: 'blur' }
    ],
    closeReason: [
        { required: true, message: '请简要输入关闭用户支付分的原因', trigger: 'blur' }
    ]
})
// 提交数据
const submit = async () => {
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const params = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                wxPayNo: dataState.ruleForm.wxPayNo,
                closeReason: dataState.ruleForm.closeReason,
                creatorId: userInfo.value.account,
                modifierId: userInfo.value.account
            }
            const res = await postWechartOff(params)
            if (res.code === '200') {
                ElMessage.success(res.message)
                emit('handleClose', props.visible)
                emit('fevent')
            }
            if (res.code === '036005') {
                emit('handleClose', props.visible)
                emit('fevent')
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
        text-align: center;
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
.tip{
    color: red;
    font-size: 12px;
}
</style>
