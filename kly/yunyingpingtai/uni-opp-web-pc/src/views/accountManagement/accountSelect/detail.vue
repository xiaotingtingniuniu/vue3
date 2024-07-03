<template>
    <div class="work-order-container">
        <el-dialog v-model="dialogVisible"  width="50%" height="50%" :before-close="handleClose" :title="props.type === 'unfreeze' ? '账户解冻': '账户冻结'">
            <div class="gongdaninfo">
                <el-form
                    ref="formRef"
                    :model="ruleForm"
                >
                    <el-row :gutter="20">
                        <el-col :span="15"><div class="height-p">商家ID：{{detail.subAcctId}}</div></el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="业务类型" prop="busiType">
                            <el-select
                                v-model="detail.busiType"
                                clearable
                                disabled
                                placeholder="请选择"
                            >
                                <el-option label="货柜主" :value="2" />
                                <el-option label="批发商" :value="3" />
                                <el-option label="代运营商" :value="4" />
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-form-item label="账户类型" prop="subAcctType">
                            <el-select
                                v-model="detail.subAcctType"
                                clearable
                                disabled
                                placeholder="请选择"
                            >
                                <el-option label="现金账户" value="01" />
                                <el-option label="待结算账户" value="06" />
                                <el-option label="预分佣账户" value="05" />
                                <el-option label="补贴账户" value="07" />
                            </el-select>
                        </el-form-item>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="可冻结金额" v-if="props.type !== 'unfreeze'">
                                <el-input  v-model="detail.subAcctAmount">
                                    <template #append>元</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8" v-if="props.type !== 'unfreeze'">
                            <el-form-item label="冻结金额" prop="frozenAmount" :rules="rules.frozenAmount">
                                <el-input v-model="ruleForm.frozenAmount"><template #append>元</template></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8" v-if="props.type === 'unfreeze'">
                            <el-form-item label="冻结金额" prop="frozenAmount" :rules="rules.frozenAmount">
                                <el-input v-model="detail.subFrozenAmount" disabled><template #append>元</template></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="冻结原因" prop="reason" :rules="rules.reason" v-if="props.type !== 'unfreeze'">
                                <div class="aaa" style="position: relative">
                                    <el-input v-model.trim="ruleForm.reason" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" resize='none' placeholder="请您输入冻结原因" maxlength="200"  style="width:300px;height:100px">
                                    </el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <el-dialog v-model="isvisible"  width="30%" center>
                    <span v-if="frozenType === 2">商家ID{{detail.subAcctId}},账户冻结,资金只进不出</span>
                    <span v-else >商家ID{{detail.subAcctId}},{{props.type === 'unfreeze' ? '解冻账户' : '冻结金额'}}{{props.type === 'unfreeze' ? '' : ruleForm.frozenAmount + '元'}}</span>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="isvisible = false">取消</el-button>
                            <el-button type="primary" @click="submitForm(formRef, frozenType)">确认</el-button>
                        </span>
                    </template>
                </el-dialog>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" v-if="props.type === 'unfreeze'" @click="frozen">确认解冻</el-button>
                    <el-button type="primary" v-else @click="frozen(1)">确认冻结</el-button>
                    <el-button type="primary" v-if="props.type !== 'unfreeze'" @click="frozen(2)">账户冻结</el-button>
                    <el-button type="primary" @click="handleClose">取消</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { frozenAccountl, unfrozenAccountl } from '@/api/accountManagement'
import { regNumber } from '@/utils/rule.js'
const store = useStore()
const formRef = ref()
const isvisible = ref(false)
const ruleForm = ref({
    reason: '',
    subFrozenAmount: '0',
    frozenAmount: '0',
    digest: ''
})

const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    type: {
        type: String
    }
})
const frozen = (type) => {
    isvisible.value = true
    frozenType.value = type
}
const detail = ref({
    acctName: props.rowList.acctName,
    busiType: props.rowList.busiType,
    channelType: props.rowList.channelType,
    indexNum: props.rowList.indexNum,
    subAcctAmount: props.rowList.subAcctAmount * 0.01,
    subAcctId: props.rowList.subAcctId,
    subAcctState: props.rowList.subAcctState,
    subAcctType: props.rowList.subAcctType,
    subFrozenAmount: props.rowList.subFrozenAmount * 0.01,
    userId: props.rowList.userId
})
const dialogVisible = ref(props.visible)
const validatePass2 = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入'))
    } else if (regNumber.test(value)) {
        callback(new Error('请输入正确的数字!'))
    } else {
        callback()
    }
}

const rules = reactive({
    reason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }]
    // frozenAmount: [{ required: true, validator: validatePass2, trigger: 'change' }]
})

onMounted(async () => {
    console.log('787878', props.rowList)
    // await detailInfo()
})

const detailInfo = () => {
}
const submitForm = async (formEl, frozenType) => {
    isvisible.value = false
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            send(frozenType)
        }
    })
}

const frozenType = ref(null)
const send = async (frozenType) => {
    const params = {
        ...ruleForm.value,
        userId: detail.value.userId,
        creatorId: store.state.userInfo.id,
        digest: frozenType === 1 ? ('商家ID' + detail.value.subAcctId + '冻结金额' + ruleForm.value.frozenAmount) : frozenType === 2 ? ('商家ID' + detail.value.subAcctId + '资金只进不出') : ('商家ID' + detail.value.subAcctId + '金额解冻'),
        subAcctId: detail.value.subAcctId,
        frozenAmount: ruleForm.value.frozenAmount * 100,
        frozenType
    }
    if (props.type === 'unfreeze') {
        const res2 = await unfrozenAccountl(params)
        if (res2.code === '200') {
            ElMessage.success('解冻成功')
        } else {
            ElMessage.success('解冻失败')
        }
    } else {
        const res = await frozenAccountl(params)
        if (res.code === '200') {
            ElMessage.success('冻结成功')
        } else {
            ElMessage.success('冻结失败')
        }
    }
    handleClose()
    emit('fevent')
}

const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    emit('handleClose', props.visible)
}

</script>
<style lang="scss" scoped>
.work-order-container{
    .height-p{
        line-height:40px;
    }
    .el-form-item{
        margin-top:  40px;
    }
    h2{
        line-height:50px;
    }
    .orderinfo{
        margin-top:40px
    }
    .p_class{
    overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
    }

    .img-box{
        img{
            display:block;
            width:150px;
        }
    }
}
</style>
