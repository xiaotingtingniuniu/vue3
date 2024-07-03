<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="editDialogConfig" :before-close="handleClose">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="实际运营人" prop="merchantName">
                    <el-input type="text" v-model="ruleForm.merchantName"  disabled="true"/>
                </el-form-item>
                <el-form-item label="实际运营人手机号" prop="phoneMobile">
                    <el-input type="text" v-model="ruleForm.phoneMobile"  disabled="true"/>
                </el-form-item>
                <el-form-item label="支付方式" prop="whiteType">
                    <el-radio-group v-model="ruleForm.whiteType">
                        <el-radio :label="2">直连</el-radio>
                        <el-radio :label="1">收付通</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备编号" prop="deviceList">
                    <el-input type="text" v-model="ruleForm.deviceList" disabled="true"/>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="submit">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed, reactive } from 'vue'
import { getAllMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const emit = defineEmits(['handleClose', 'pagerUpdate'])
const props = defineProps({
    editVisible: {
        type: Boolean
    },
    editObj: {
        type: Object
    }
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const editDialogConfig = ref(props.editVisible)
const ruleForm = reactive({
    whiteType: null,
    deviceList: '',
    merchantName: '',
    phoneMobile: ''
})
const getInfo = () => {
    ruleForm.whiteType = props.editObj.whiteType
    ruleForm.deviceList = props.editObj.deviceNo
    ruleForm.merchantName = props.editObj.merchantName
    ruleForm.phoneMobile = props.editObj.phoneMobile
    console.log(props.editObj, 'editObj')
}
getInfo()
const submit = async () => {
    if (ruleForm.whiteType === null) {
        return ElMessage.error('请选择支付方式')
    }
    const parm = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            whiteType: ruleForm.whiteType,
            id: props.editObj.id,
            modifierId: userInfo.value.account
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC25578408636772352',
        name: '更新商户白名单',
        source: '商户中台',
        modifierId: userInfo.value.account
    }
    const data = await getAllMerchantList(parm)
    if (data.code === '200') {
        ElMessage({
            message: data.message,
            type: 'success'
        })
        handleClose()
    }
}
const handleClose = () => {
    emit('handleClose', props.editVisible)
    emit('pagerUpdate')
}
</script>
<style lang="scss" scoped>
</style>
