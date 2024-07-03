<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="dialogVisible"  :before-close="handleClose">
            <template #title>
                <div class='dialog-title'>
                    注意！
                </div>
            </template>
            <div class='header-title'>我已经认真检查，确认填写内容无误！</div>
            <div>
                <el-form
                    ref="raidioFormRef"
                    :model="ruleForm"
                    :rules="rules"
                    class="demo-ruleForm"
                    :size="formSize"
                >
                    <el-form-item label=" " prop="type">
                        <el-checkbox-group v-model="ruleForm.type">
                            <el-checkbox :label="1" name="type" >确认预算资金充足，确认项目ROI测算符合逻辑。</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label=" " prop="typec">
                        <el-checkbox-group v-model="ruleForm.typec">
                            <el-checkbox :label="2" name="type" >确认业务线、营销工具、申请数量，项目预算，商品范围、有效期，使用期限、单个用户使用数量，设备/门店 范围，优惠券说明都填写正确。</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label=" " prop="typed">
                        <el-checkbox-group v-model="ruleForm.typed">
                            <el-checkbox :label="3" name="type" >确认商品折扣力度，毛利率变化 ，商品库存准备都在预期之内。</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="审批人" prop="approval">
                        <el-select class="form-action-item-50w" v-model="ruleForm.approval" clearable placeholder="请选择">
                            <el-option
                                v-for="(item, index) in approvalList"
                                :key="index"
                                :label="item.contentName"
                                :value="item.id"
                                @click="approvalChange(item)"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <div style="padding-left: 50px;font-size: 12px">
                            <p>
                                1）请选择审批人，提交后请审批人在EIP系统中操作审批
                            </p>
                            <p>
                                2）如果审批人不在下拉列表，请联系产品经理
                            </p>
                            <p>
                                3）提交了错误的审批人，请联系对方操作驳回，不要自己操作撤回
                            </p>
                        </div>
                    </el-form-item>
                </el-form>
                <el-radio-group v-model="radio">

                </el-radio-group>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">再检查一下 </el-button>
                    <el-button type="primary" @click="submitAudit">已仔细检查，提交审批 </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { getCouponAudit, getCouponApprovalList } from '@/api/marketing/coupon'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const props = defineProps({
    visible: {
        type: Boolean
    },
    batchList: {
        type: Array
    },
    freezeAmount: {
        String
    }
})
const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const radio = ref(3)
const groupCode = route.params.groupCode
const rules = ref({
    type: [
        {
            type: 'array',
            required: true,
            message: '必须选中',
            trigger: 'change'
        }
    ],
    typec: [
        {
            type: 'array',
            required: true,
            message: '必须选中',
            trigger: 'change'
        }
    ],
    typed: [
        {
            type: 'array',
            required: true,
            message: '必须选中',
            trigger: 'change'
        }
    ],
    approval: [
        {
            required: true,
            message: '请选择',
            trigger: 'change'
        }
    ]

})
const ruleForm = ref({
    typec: [],
    type: [],
    typed: []
})
const raidioFormRef = ref(null)
const submitAudit = async () => {
    const params = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        groupCode: groupCode,
        groupStatus: 2,
        operatorId: userInfo.value.account,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        gmtOperate: new Date().getTime(),
        auditUrl: location.href,
        operatorName: userInfo.value.name,
        dictRelPublishReqVOS: dictRelPublishReqVOS.value,
        auditNote: '审批注意点：\n' + '1、确认预算账户资金充足， 项目ROI测算 符合逻辑。\n' + '\n' + '2、确认 业务线、营销工具、申请数量，项目预算，商品范围、有效期，使用期限、单个用户使用数量，设备/门店 范围，优惠券说明都填写正确。\n' + '\n' + '3、确认 商品折扣力度，毛利率变化，商品库存准备 都在预期之内。'
    }
    raidioFormRef.value.validate(async (valid) => {
        if (valid) {
            const code = await getCouponAudit(params)
            if (code === '200') {
                ElMessage({
                    message: '提交成功',
                    type: 'success'
                })
                emit('fevent')
            }
        }
    })
}
const approvalList = ref([])
// 获取审批人列表
const queryApprovalList = async () => {
    const batchReqVOS = []
    props.batchList.map(item => {
        batchReqVOS.push({
            couponType: item.couponType,
            userRangeType: item.userRangeType
        })
    })
    const params = {
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        freezeAmount: props.freezeAmount * 100,
        batchReqVOS
    }
    const res = await getCouponApprovalList(params)
    if (res.code === '200') {
        approvalList.value = res.data
    }
}
queryApprovalList()

const dictRelPublishReqVOS = ref([])
// 选择审批人
const approvalChange = (tab) => {
    dictRelPublishReqVOS.value = [{
        dictType: tab.dictType,
        contentId: tab.contentId,
        contentName: tab.contentName,
        contentOrder: tab.contentOrder
    }]
}
const emit = defineEmits(['fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}

</script>
<style lang="scss" scoped>
 .coupon-submit-box{
     .dialog-title{
        font-size:20px;
        color:red;
        font-weight:700;
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
.el-checkbox{
    white-space:break-spaces;
    height:40px
}
</style>
