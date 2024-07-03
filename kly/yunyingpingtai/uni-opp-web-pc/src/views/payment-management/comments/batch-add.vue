<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="batchDialogConfig" :before-close="handleClose">
            <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
                <el-form-item label="支付方式" prop="whiteType">
                    <el-radio-group v-model="ruleForm.whiteType">
                        <el-radio :label="2">直连</el-radio>
                        <el-radio :label="1">收付通</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备编号" prop="deviceList">
                    <el-input type="textarea" v-model="ruleForm.deviceList" placeholder="请输入设备编号，用逗号隔开～" clearable oninput="this.value=this.value.replace(/[^\a-zA-Z\0-9]/g,'')"/>
                </el-form-item>
            </el-form>
            <!-- <div class="search-area">
                <el-radio-group v-model="whiteType">
                    <el-radio :label="1">直连</el-radio>
                    <el-radio :label="2">收付通</el-radio>
                </el-radio-group>

            </div> -->
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
    batchVisible: {
        type: Boolean
    }
})
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const batchDialogConfig = ref(props.batchVisible)

// const whiteType = ref(2)
// const deviceList = ref('')
const ruleForm = reactive({
    whiteType: 2,
    deviceList: []
})
const submit = async () => {
    if (ruleForm.deviceList === '') {
        return ElMessage.error('请填写设备编号')
    }
    const parm = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            deviceList: ruleForm.deviceList.split(','),
            whiteType: ruleForm.whiteType,
            modifierId: userInfo.value.account
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC23786901286256640',
        name: '批量添加设备白名单表',
        source: '商户中台',
        modifierId: userInfo.value.account
    }
    const data = await getAllMerchantList(parm)
    if (data.code === '200') {
        const successMsg = data.data.successList.toString() || '无'
        const failListMsg = data.data.failList.toString() || '无'
        const existListMsg = data.data.existList.toString() || '无'
        ElMessage({
            message: '成功：' + successMsg + ',' + '失败：' + failListMsg + ',' + '无效：' + existListMsg,
            type: 'success'
        })
        handleClose()
    }
}
const handleClose = () => {
    emit('handleClose', props.batchVisible)
    emit('pagerUpdate')
}
</script>
<style lang="scss" scoped>
</style>
