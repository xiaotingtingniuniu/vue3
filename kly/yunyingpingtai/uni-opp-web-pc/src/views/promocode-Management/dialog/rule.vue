<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" :title="dialogtitle" width="50%" @close="clostDialog(formRef)">
            <el-form ref="formRef" :model="formData" :rules="rules" :inline="true" label-position="right" label-width="170px">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择业务线" prop="busiCode" :rules = "rules.busiCode">
                            <el-select v-model="formData.busiCode" @change="checklist(formData.busiCode)" clearable placeholder="请选择" :disabled="detialtitle === 'edit'">
                                <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detialtitle === 'new'">
                    <el-col :span="24">
                        <el-form-item label="选择组织" prop="orgCode" :rules = "rules.orgCode">
                            <el-select v-model="formData.orgCode" clearable placeholder="请选择" :disabled="detialtitle === 'edit'">
                                <el-option v-for="(item, key) in organizationKeyValue" :key="key" :label="item.orgName" :value="item.orgCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-else>
                    <el-col :span="24">
                        <el-form-item label="选择组织" prop="orgName" :rules = "rules.orgName">
                            <el-input v-model="formData.orgName" placeholder="请输入" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="detialtitle === 'new'">
                    <el-col :span="24">
                        <el-form-item label="选择推广产品" prop="productCode" :rules = "rules.productCode">
                            <el-select v-model="formData.productCode" @change="procuctlist(formData.productCode)" clearable placeholder="请选择" :disabled="detialtitle === 'edit'">
                                <el-option v-for="(item, key) in productKeyValue" :key="key" :label="item.productName" :value="item.productCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-else>
                    <el-col :span="24">
                        <el-form-item label="选择推广产品" prop="productName" :rules = "rules.productName">
                            <el-input v-model="formData.productName" placeholder="请输入" clearable disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="isshow || (formData.orderAmount !== null && formData.orderAmount !== 0)">
                    <el-col :span="24">
                        <el-form-item label="推广规则" prop="ruleType" :rules = "rules.ruleItem" :disabled="detialtitle === 'edit'">
                            <el-select v-model="formData.ruleType" @change="rulelist(formData.ruleType)" clearable placeholder="请选择" >
                                <el-option v-for="(item, key) in ruletypelist" :key="key" :label="item.ruleName" :value="item.ruleType" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-else>
                    <el-col :span="24">
                        <el-form-item label="推广规则" prop="ruleName" :rules = "rules.ruleItem">
                            <el-input v-model="formData.ruleName" placeholder="请输入" clearable disabled></el-input></el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24" v-if="isshow || (formData.orderAmount !== null  && formData.orderAmount !== 0)">
                    <el-col :span="24">
                        <el-form-item label="订单金额需大于等于：" prop="orderAmount" :rules = "rules.orderAmount">
                            <el-input v-model="formData.orderAmount" placeholder="请输入" clearable ><template #append>元</template></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="生效开始时间" prop="validStartTime" :rules = "rules.validStartTime">
                            <el-date-picker v-model="formData.validStartTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="生效结束时间" prop="validEndTime" :rules = "rules.validEndTime">
                            <el-date-picker v-model="formData.validEndTime" type="datetime" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm" range-separator="~" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item class="button-box">
                            <el-button @click="clostDialog(formRef)" type="primary">取消</el-button>
                            <el-button @click="sureBtn(formRef)" type="primary">确认</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>

            </el-form>
        </el-dialog>
    </div>
</template>
<script setup>
import { ref, toRefs, computed, reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { allbusiness, newproduct, busiorgproduct, newrule, editrule } from '@/api/promocodeManagement/index'
const props = defineProps({
    visible: {
        type: Boolean
    },
    rowList: {
        type: Object
    },
    modifySource: {
        type: Number
    },
    title: {
        type: String
    }
})
// 商家入驻、用户拉新、货柜分期、全款货柜
const producttypelist = {
    1: '商家入驻', 2: '用户拉新', 3: '货柜分期', 4: '全款货柜'
}
const extensiontypelist = {
    1: '商家入驻并审核通过', 2: '新用户注册并完成首单', 3: '新用户注册完成首单或复购'
}
const ruletypelist = ref([
    {
        ruleType: 2,
        ruleName: '新用户注册并完成首单'
    },
    {
        ruleType: 3,
        ruleName: '新用户注册完成首单或复购'
    }
])
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const rowdetailList = ref(props.rowList)
const detialtitle = ref(props.title)
const dialogtitle = ref('')
onMounted(async () => {
    await business()
    if (detialtitle.value === 'new') {
        dialogtitle.value = '新增推广规则'
    } else {
        dialogtitle.value = '编辑推广规则'
    }
    if (rowdetailList.value && detialtitle.value === 'edit') {
        dataState.formData.busiCode = rowdetailList.value.busiCode
        await checklist(rowdetailList.value.busiCode)
        dataState.formData.busiName = rowdetailList.value.busiName
        dataState.formData.orgName = rowdetailList.value.orgName
        dataState.formData.orgCode = rowdetailList.value.orgCode
        dataState.formData.ruleName = rowdetailList.value.ruleItem.ruleName
        dataState.formData.ruleType = rowdetailList.value.ruleItem.ruleType
        dataState.formData.productName = rowdetailList.value.productName
        dataState.formData.productCode = rowdetailList.value.productCode
        dataState.formData.validStartTime = rowdetailList.value.validStartTime
        dataState.formData.validEndTime = rowdetailList.value.validEndTime
        dataState.formData.orderAmount = rowdetailList.value.ruleItem.orderAmount / 100
    }
})
// watch(() => dataState.formData.productCode,
//     (val) => {
//         daterangeTime(val)
//     },
//     {
//         deep: true
//     })
const dataState = reactive({
    formData: {
        busiCode: '',
        busiName: '',
        orgCode: '',
        productCode: '',
        orgName: '',
        productName: '',
        ruleName: '',
        ruleType: '',
        orderAmount: 0,
        validStartTime: '',
        validEndTime: '',
        ruleItem: []
    },
    dateTime: {
        ruleTimeStrSt: '',
        ruleTimeStrEn: '',
        ruleTimeEndSt: '',
        ruleTimeEndEn: ''
    },
    ruleobj: {
        ruleName: '',
        ruleType: ''
    }
})
const querinfo = ref({
    ruleTimeStr: [],
    ruleTimeEnd: []
})
const daterangeTime = (val) => {
    if (val) {
        querinfo.value.ruleTimeStr = val
        querinfo.value.ruleTimeEnd = val
        dataState.dateTime.ruleTimeStrSt = val[0]
        dataState.dateTime.ruleTimeStrEn = val[1]
        dataState.dateTime.ruleTimeEndSt = val[0]
        dataState.dateTime.ruleTimeEndEn = val[1]
    } else {
        querinfo.value.ruleTimeStr = ''
        querinfo.value.ruleTimeEnd = ''
        dataState.dateTime.ruleTimeStrSt = ''
        dataState.dateTime.ruleTimeStrEn = ''
        dataState.dateTime.ruleTimeEndSt = ''
        dataState.dateTime.ruleTimeEndEn = ''
    }
}
const { formData, ruleobj } = toRefs(dataState)
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 关闭弹窗
const clostDialog = (formEl) => {
    // dialogVisible.value = false
    if (!formEl) return
    formEl.resetFields()
    emit('clostDialog', props.visible)
}
// 组织产品
const productKeyValue = ref([])
const organizationKeyValue = ref([])
const checklist = async (val) => {
    const param = {
        appKey: 'A1001001',
        busiCode: val
    }
    const res = await busiorgproduct(param)
    productKeyValue.value = res.data.productList
    organizationKeyValue.value = res.data.orgList
    dataState.formData.orgCode = ''
    // dataState.formData.ruleType = ''
    dataState.formData.productCode = ''
    dataState.formData.ruleName = ''
}
const isshow = ref(false)
const procuctlist = (val) => {
    for (let i = 0; i < productKeyValue.value.length; i++) {
        if (productKeyValue.value[i].productCode === val) {
            if (productKeyValue.value[i].productType === 2 || productKeyValue.value[i].productType === 3 || productKeyValue.value[i].productType === 4) {
                isshow.value = true
            } else if (productKeyValue.value[i].productType === 1) {
                isshow.value = false
                dataState.formData.ruleType = 1
                dataState.formData.ruleName = '商家入驻并审核通过'
            } else if (productKeyValue.value[i].productType === 5) {
                isshow.value = false
                dataState.formData.ruleType = 5
                dataState.formData.ruleName = '货柜分期下单并支付首金'
            } else {
                isshow.value = false
                dataState.formData.ruleType = 6
                dataState.formData.ruleName = '货柜下单并支付全款'
            }
        }
    }
}
const rulelist = (val) => {
    if (val === 2 || val === 3 || val === 4) {
        isshow.value = true
    } else {
        isshow.value = false
    }
    const rulename = ref('')
    for (let i = 0; i < ruletypelist.value.length; i++) {
        if (ruletypelist.value[i].ruleType === dataState.formData.ruleType) {
            dataState.ruleobj.ruleName = ruletypelist.value[i].ruleName
            dataState.ruleobj.ruleType = ruletypelist.value[i].ruleType
        }
    }
}
const rules = {
    busiCode: [{ required: true, message: '请选择业务线', trigger: 'blur' }],
    busiName: [{ required: true, message: '请选择推广类型', trigger: 'blur' }],
    orgCode: [{ required: true, message: '请选择组织', trigger: 'blur' }],
    productCode: [{ required: true, message: '请选择推广产品', trigger: 'blur' }],
    orgName: [{ required: true, message: '请选择组织', trigger: 'blur' }],
    productName: [{ required: true, message: '请选择推广产品', trigger: 'blur' }],
    ruleItem: [{ required: true, message: '请选择推广规则', trigger: 'blur' }],
    validStartTime: [{ required: true, message: '请选择生效开始时间', trigger: 'blur' }],
    validEndTime: [{ required: true, message: '请选择生效结束时间', trigger: 'blur' }],
    orderAmount: [{ required: true, message: '请输入金额', trigger: 'blur' }]
}
const formRef = ref('')
const sureBtn = async (formEl) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const businame = ref('')
            for (let i = 0; i < businessKeyValue.value.length; i++) {
                if (businessKeyValue.value[i].busiCode === dataState.formData.busiCode) {
                    businame.value = businessKeyValue.value[i].buisName
                }
            }
            if (dataState.formData.orderAmount) {
                const reparams = {
                    orderAmount: dataState.formData.orderAmount * 100
                }
                // dataState.ruleobj.ruleName = dataState.formData.ruleName
                for (let i = 0; i < ruletypelist.value.length; i++) {
                    if (ruletypelist.value[i].ruleType === dataState.formData.ruleType) {
                        dataState.ruleobj.ruleName = ruletypelist.value[i].ruleName
                    }
                }
                dataState.ruleobj.ruleType = dataState.formData.ruleType
                Object.assign(dataState.ruleobj, reparams)
            } else {
                dataState.ruleobj.ruleName = dataState.formData.ruleName
                dataState.ruleobj.ruleType = dataState.formData.ruleType
            }
            if (detialtitle.value === 'new') {
                const param = {
                    appKey: 'A1001001',
                    busiCode: dataState.formData.busiCode,
                    busiName: businame.value,
                    orgCode: dataState.formData.orgCode,
                    productCode: dataState.formData.productCode,
                    ruleItem: dataState.ruleobj,
                    validStartTime: dataState.formData.validStartTime,
                    validEndTime: dataState.formData.validEndTime,
                    modifierId: userInfo.value.name
                }
                await newrule(param)
                ElMessage({
                    type: 'success',
                    message: '创建成功'
                })
                formEl.resetFields()
            } else {
                const param = {
                    appKey: 'A1001001',
                    ruleCode: rowdetailList.value.ruleCode,
                    ruleItem: dataState.ruleobj,
                    validStartTime: dataState.formData.validStartTime,
                    validEndTime: dataState.formData.validEndTime,
                    modifierId: userInfo.value.name
                }
                await editrule(param)
                ElMessage({
                    type: 'success',
                    message: '编辑成功'
                })
                formEl.resetFields()
            }
            emit('clostDialog', props.visible)
        }
    })
}
const emit = defineEmits(['clostDialog'])
</script>
<style lang="scss" scoped>
 .content{
    // border-bottom: 1px solid #999999;
    margin-bottom: 10px;
}
.content-btn{
    margin-top: 20px;
    text-align: center;
}
.img-content{
    display: flex;
}
.height-p{
    line-height:30px;
}
.title{
    color: #000000;
    font-weight: bold;
    line-height:40px;
}
.button-box{
    float: right;
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
  width: 128px;
  height: 138px;
  border-radius: 10px;
  border: 1px dashed #8c939d;
  text-align: center;
}
</style>
