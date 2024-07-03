<template>
    <!-- 价格中台弹窗 -->
    <div class="lz-dialog">
        <el-dialog
            v-model="dialogShow"
            :title="obj.dialogTitle"
            :width="obj.dialogWidth"
            :before-close="close"
            draggable
        >
            <slot> </slot>
            <div>
                <el-form label-width="150px" class="demo-ruleForm" :size="formSize" status-icon :inline="true" >
                    <el-form-item label="报价单号" prop="feeNo">
                        <span>{{searchData.feeNo}}</span>
                    </el-form-item>
                    <el-form-item label="报价单名称" prop="feeName">
                        <span>{{searchData.feeName}}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="始发省" prop="srcProvinceName">
                        <span>{{searchData.srcProvinceName || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="始发市" prop="srcCityName">
                        <span>{{searchData.srcCityName || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="始发县" prop="srcCountyName">
                        <span>{{searchData.srcCountyName || '无'}}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="目的省" prop="targetProvinceName">
                        <span>{{searchData.targetProvinceName || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="目的市" prop="targetCityName">
                        <span>{{searchData.targetCityName || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="目的县" prop="targetCountyName">
                        <span>{{searchData.targetCountyName || '无'}}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="首重重量(KG)" prop="firstWeightStr">
                        <span>{{searchData.firstWeightStr || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="首重价格(元)" prop="firstWeightPriceStr">
                        <span>{{searchData.firstWeightPriceStr || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="重量进位制" prop="weightCalTypeStr">
                        <span>{{searchData.weightCalTypeStr || '无'}}</span>
                    </el-form-item>
                    <br />
                    <el-form-item label="续重重量(KG)" prop="otherWeightStr">
                        <span>{{searchData.otherWeightStr || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="续重价格(元)" prop="otherWeightPriceStr">
                        <span>{{searchData.otherWeightPriceStr || '无'}}</span>
                    </el-form-item>
                    <el-form-item label="价格进位制" prop="priceCalTypeStr">
                        <span>{{searchData.priceCalTypeStr || '无'}}</span>
                    </el-form-item>
                </el-form>
            </div>
            <template #footer>
                <span v-if="obj.dialogIsFooter" class="dialog-footer">
                    <el-button class="btn-mixins-clear-default" @click="close(props.dialogObject.who)">{{ obj.dialogCloseBtnText }}</el-button>
                    <el-button type="primary" class="btn-mixins dia-suc" @click="success(props.dialogObject.who)">{{ obj.dialogSuccessBtnText }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, nextTick, onMounted, onUpdated, reactive, ref, toRefs, watch } from 'vue'
import { dialogProps, ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { getMerchantList, getMerchantListCode } from '@/api/operate/index'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)

const props = defineProps({
    dialogObject: {
        default () {
            return {}
        },
        type: Object
    }
})

const dataState = reactive({
    searchData: {},
    operationstatus: null, // 起停状态
    auditstatus: null // 审核状态
})
const { searchData, operationstatus, auditstatus } = toRefs(dataState)

const emits = defineEmits(['dialogClose', 'dialogSuccess'])
const dialogShow = computed({
    get () {
        // getter
        return props.dialogObject.dialogVisible
    },
    set (val) {
        // console.log(val)
        return val
    }
})

watch(props.dialogObject, (newvalue, oldvalue) => {
    obj.dialogTitle = newvalue.title
    obj.dialogWidth = newvalue.width
    obj.dialogCloseBtnText = newvalue.closeBtnText
    obj.dialogSuccessBtnText = newvalue.successBtnText
    obj.dialogIsFooter = newvalue.isFooter
    if (newvalue.dialogVisible === true) {
        getDeliveryFeeDetail()
        // if (props.dialogObject.who === 'toexamine') {
        //     setTimeout(() => {
        //         dataState.auditstatus = 3
        //         auditDeliveryFeeDetail()
        //     }, 300)
        // }
    }
})

const obj = reactive({
    dialogTitle: '' || '标题',
    dialogWidth: '' || '30%',
    dialogCloseBtnText: '' || '取消',
    dialogSuccessBtnText: '' || '成功',
    dialogIsFooter: '' || false
})
const close = (val) => {
    if (val === 'toexamine') { // 驳回
        console.log('驳回接口')
        dataState.auditstatus = 2
        auditDeliveryFeeDetail()
    } else {
        emits('dialogClose', false, 'close')
    }
}
const success = (val) => {
    if (val === 'toexamine') { // 通过
        console.log('审核接口')
        dataState.auditstatus = 1
        auditDeliveryFeeDetail()
    } else if (val === 'deactivate') { // 停用
        console.log('停用接口')
        dataState.operationstatus = 2
        operateDeliveryFeeDetail()
    } else if (val === 'enable') { // 启用
        console.log('启用接口')
        dataState.operationstatus = 1
        operateDeliveryFeeDetail()
    }
}
const fork = () => {
    emits('forkSuccess', false, 'fork')
}

// 查询报价单明细详情
const getDeliveryFeeDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            id: props.dialogObject.id,
            feeNo: props.dialogObject.feeNo
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11773469736980480',
        name: '查询报价单明细详情',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.searchData = { ...data }
}
// 启用/停用报价单明细
const operateDeliveryFeeDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            id: dataState.searchData?.id ?? null, // 报价单明细ID
            feeNo: dataState.searchData?.feeNo ?? '', // 报价单编号
            operateType: dataState.operationstatus
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11773000985759744',
        name: '启用/停用报价单明细',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === '200') {
        emits('dialogSuccess', false, 'success')
        ElMessage({
            message: message,
            type: 'success'
        })
    }
}
// 审核报价单明细 （通过与驳回）
const auditDeliveryFeeDetail = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            id: dataState.searchData?.id ?? null, // 报价单明细ID
            feeNo: dataState.searchData?.feeNo ?? '', // 报价单编号
            operateType: dataState.auditstatus
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC11773288853426176',
        name: '审核报价单明细 （通过与驳回）',
        source: '运单中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const { code, message } = await getMerchantListCode(params)
    if (code === '200') {
        emits('dialogSuccess', false, 'success')
    }
}
</script>
<style lang="scss" scoped>
.lz-dialog {
    .dia-suc {
        margin-left: 16px !important;
    }
}

</style>
