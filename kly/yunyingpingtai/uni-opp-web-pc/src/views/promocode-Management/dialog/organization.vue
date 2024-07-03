<template>
    <div class='scantling-box'>
        <el-dialog v-model="dialogVisible" :title="dialogtitle" width="50%" @close="clostDialog">
            <el-form ref="formRef" :model="formData" :rules="rules" :inline="true" label-position="right" label-width="130px">
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="关联商户" prop="busiMerchantId" :rules = "rules.busiMerchantId">
                            <el-select
                                v-model="formData.busiMerchantId"
                                filterable
                                remote
                                reserve-keyword
                                placeholder="输入商户名称搜索"
                                :remote-method="merchantMsg"
                                :loading="loading"
                            >
                                <el-option
                                    v-for="(item,key) in options"
                                    :key="key"
                                    :label="item.merchantName"
                                    :value="item.busiMerchantId"
                                    @click="merchantCheck(item)"
                                />
                            </el-select>
                            <!-- <el-input v-model="formData.merchantName" @input="merchantMsg(formData.merchantName)" :rules = rules.merchantName placeholder="输入商户名称搜索" clearable /> -->
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="选择业务线" prop="busiCode" :rules = "rules.busiCode">
                            <el-select v-model="formData.busiCode" clearable placeholder="请选择" >
                                <el-option v-for="(item, key) in businessKeyValue" :key="key" :label="item.buisName" :value="item.busiCode" />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="组织名称" prop="orgName" :rules = "rules.orgName">
                            <el-input v-model="formData.orgName" placeholder="请输入组织名称（名称会对推广人展示）" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="城市" prop="effectiveCitysChecked">
                            <el-cascader
                                ref="authorityRef"
                                :props="effectiveCitysProp"
                                @change="effectiveCitysChange"
                                v-model="dataState.effectiveCitysChecked"
                                width="100%"
                                clearable
                                :disabled="canNotEdit"
                                collapse-tags
                                collapse-tags-tooltip
                                v-if="effectiveCitysVisiable"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="主体名称" prop="subjectName" :rules = "rules.subjectName">
                            <el-input v-model="formData.subjectName"  placeholder="请输入主体名称" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="联系人姓名" prop="contactName" :rules = "rules.contactName">
                            <el-input v-model="formData.contactName" :rules = "rules.contactName" placeholder="请输入联系人姓名" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="联系人手机号" prop="phoneMobile" :rules = "rules.phoneMobile">
                            <el-input v-model="formData.phoneMobile" placeholder="请输入联系人手机号" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="合作开始时间" prop="cooperateBeginTime" :rules = "rules.cooperateBeginTime">
                            <el-date-picker v-model="formData.cooperateBeginTime" type="date" range-separator="~" format="YYYY-MM-DD" value-format="YYYY-MM-DD" start-placeholder="开始时间" end-placeholder="结束时间"  @change="daterangeTime"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="24">
                        <el-form-item label="合作结束时间" prop="cooperateEndTime" :rules = "rules.cooperateEndTime">
                            <el-date-picker
                                v-model="formData.cooperateEndTime"
                                type="date"
                                format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD"
                                range-separator="~"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                @change="daterangeTime"
                            />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="24">
                    <el-col :span="8">
                        <el-form-item class="button-box">
                            <el-button @click="clostDialog()" type="primary">取消</el-button>
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
import { allbusiness, newproduct, busiorgproduct, newrule, neworganization, merchantid, editorganization, organizationDeatil } from '@/api/promocodeManagement/index'
import { checkRole, yingyongQueryCategory, cityQueryCategory } from '@/utils'
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
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const dialogVisible = ref(props.visible)
const rowdetailList = ref(props.rowList)
const detialtitle = ref(props.title)
const dialogtitle = ref('')
const defaultTime = new Date(2000, 1, 1, 23, 59, 59)
onMounted(async () => {
    await business()
    if (detialtitle.value === 'new') {
        dialogtitle.value = '新建组织'
    } else {
        dialogtitle.value = '编辑组织'
        await organizationdeatil(rowdetailList.value.orgCode)
    }
    // if (rowdetailList.value) {
    //     dataState.formData.busiMerchantId = rowdetailList.value.busiMerchantId
    //     dataState.formData.busiCode = rowdetailList.value.busiCode
    //     dataState.formData.busiName = rowdetailList.value.busiName
    //     dataState.formData.orgCode = rowdetailList.value.orgCode
    //     // dataState.formData.cityList = rowdetailList.value.ruleItem.cityList
    //     dataState.formData.subjectName = rowdetailList.value.subjectName
    //     dataState.formData.contactName = rowdetailList.value.contactName
    //     dataState.formData.phoneMobile = rowdetailList.value.phoneMobile
    //     dataState.formData.cooperateBeginTime = rowdetailList.value.cooperateBeginTime
    //     dataState.formData.cooperateEndTime = rowdetailList.value.cooperateEndTime
    // }
})
const dataState = reactive({
    formData: {
        busiCode: '',
        busiName: '',
        merchantName: '',
        orgName: '',
        cityList: [],
        subjectName: '',
        contactName: '',
        phoneMobile: '',
        cooperateBeginTime: '',
        cooperateEndTime: '',
        modifierId: '',
        busiMerchantId: '',
        effectiveCitysChecked: ''
    },
    dateTime: {
        ruleTimeStrSt: '',
        ruleTimeStrEn: '',
        ruleTimeEndSt: '',
        ruleTimeEndEn: ''
    },
    effectiveCitysChecked: [], // 生效城市纬度选中
    effectiveCitysVisiable: true // 生效城市级联下拉框
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
const { formData, effectiveCitysVisiable } = toRefs(dataState)
// 查询所有业务线
const businessKeyValue = ref([])
const business = async () => {
    const res = await allbusiness()
    businessKeyValue.value = res.data
}
// 关闭弹窗
const clostDialog = () => {
    // dialogVisible.value = false
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
}
const rules = {
    busiMerchantId: [{ required: true, message: '请输入关联商户', trigger: 'blur' }],
    busiCode: [{ required: true, message: '请选择业务线', trigger: 'change' }],
    busiName: [{ required: true, message: '请选择推广类型', trigger: 'change' }],
    effectiveCitysChecked: [{ required: true, message: '请选择城市', trigger: 'blur' }],
    orgName: [{ required: true, message: '请选择组织', trigger: 'change' }],
    cityList: [{ required: true, message: '请选择城市', trigger: 'change' }],
    subjectName: [{ required: true, message: '请输入主体名称', trigger: 'change' }],
    contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'change' }],
    phoneMobile: [{ required: true, message: '请输入联系人电话', trigger: 'change' }],
    cooperateBeginTime: [{ required: true, message: '请选择合作开始时间', trigger: 'change' }],
    cooperateEndTime: [{ required: true, message: '请选择合作截止时间', trigger: 'change' }]
}
watch(() => dataState.effectiveCitysChecked.length,
    (val) => {
        if (val !== 0) {
            rules.effectiveCitysChecked[0].required = false
            dataState.formData.effectiveCitysChecked = '0'
        } else {
            dataState.formData.effectiveCitysChecked = ''
            rules.effectiveCitysChecked[0].required = true
        }
        console.log(val + '印')
    },
    {
        deep: true
    })
// watch(() => dataState.formData.effectiveCitysChecked,
//     (val) => {
//         if (val !== '0') {
//             debugger
//             rules.effectiveCitysChecked[0].required = false
//         } else {
//             debugger
//             rules.effectiveCitysChecked[0].required = true
//         }
//         console.log(val + '印')
//     },
//     {
//         deep: true
//     })
const organizationdeatil = async (val) => {
    const param = {
        orgCode: val
    }
    const res = await organizationDeatil(param)
    dataState.formData.busiMerchantId = res.data.busiMerchantId
    dataState.formData.merchantName = res.data.merchantName
    dataState.formData.busiCode = res.data.busiCode
    dataState.formData.busiName = res.data.busiName
    dataState.formData.orgCode = res.data.orgCode
    dataState.formData.orgName = res.data.orgName
    dataState.formData.cityList = res.data.cityList
    dataState.formData.subjectName = res.data.subjectName
    dataState.formData.contactName = res.data.contactName
    dataState.formData.phoneMobile = res.data.phoneMobile
    dataState.formData.cooperateBeginTime = res.data.cooperateBeginTime
    dataState.formData.cooperateEndTime = res.data.cooperateEndTime
    // 商户回显
    options.value = [{
        busiMerchantId: dataState.formData.busiMerchantId,
        merchantName: dataState.formData.merchantName
    }]
    // 城市回显
    if (res.data.cityList) {
        res.data.cityList.forEach(item => {
            const catesInfo = [item.provinceCode, item.cityCode]
            dataState.effectiveCitysChecked.push(catesInfo)
        })
        dataState.effectiveCitysVisiable = false
        setTimeout(() => {
            dataState.effectiveCitysVisiable = true
        }, 100)
    }
}
const formRef = ref('')
const sureBtn = async (formEl) => {
    if (dataState.effectiveCitysChecked.length) {
        dataState.formData.effectiveCitysChecked = '0'
    } else {
        dataState.formData.effectiveCitysChecked = ''
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const businame = ref('')
            for (let i = 0; i < businessKeyValue.value.length; i++) {
                if (businessKeyValue.value[i].busiCode === dataState.formData.busiCode) {
                    businame.value = businessKeyValue.value[i].buisName
                }
            }
            if (detialtitle.value === 'new') {
                const param = {
                    appKey: 'A1001001',
                    busiCode: dataState.formData.busiCode,
                    busiName: businame.value,
                    busiMerchantId: dataState.formData.busiMerchantId,
                    orgName: dataState.formData.orgName,
                    cityList: dataState.formData.cityList,
                    subjectName: dataState.formData.subjectName,
                    contactName: dataState.formData.contactName,
                    phoneMobile: dataState.formData.phoneMobile,
                    cooperateBeginTime: dataState.formData.cooperateBeginTime,
                    cooperateEndTime: dataState.formData.cooperateEndTime,
                    modifierId: userInfo.value.name,
                    merchantName: dataState.formData.merchantName
                }
                await neworganization(param)
                ElMessage({
                    type: 'success',
                    message: '创建成功'
                })
                formEl.resetFields()
            } else {
                const param = {
                    appKey: 'A1001001',
                    busiCode: dataState.formData.busiCode,
                    busiName: businame.value,
                    busiMerchantId: dataState.formData.busiMerchantId,
                    orgName: dataState.formData.orgName,
                    orgCode: rowdetailList.value.orgCode,
                    cityList: dataState.formData.cityList,
                    subjectName: dataState.formData.subjectName,
                    contactName: dataState.formData.contactName,
                    phoneMobile: dataState.formData.phoneMobile,
                    cooperateBeginTime: dataState.formData.cooperateBeginTime,
                    cooperateEndTime: dataState.formData.cooperateEndTime,
                    modifierId: userInfo.value.name,
                    merchantName: dataState.formData.merchantName
                }
                await editorganization(param)
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
const authorityRef = ref(null)
// 生效城市联动
const effectiveCitysProp = {
    lazy: true,
    multiple: true,
    lazyLoad: async (node, resolve) => {
        const { level, data } = node
        const res = await cityQueryCategory(level + 1, data.value || '')
        const nodes = res.map(item => {
            return {
                label: item.addressName,
                value: item.addressCode,
                level: item.level,
                leaf: level >= 1
            }
        })
        resolve(nodes)
    }
}
// 生效城市change
const effectiveCitysChange = (value) => {
    dataState.formData.cityList = []
    dataState.effectiveCitysCheckedNodes = authorityRef.value.getCheckedNodes(true)
    dataState.effectiveCitysCheckedNodes.forEach(item => {
        dataState.formData.cityList.push({
            provinceCode: item.pathValues[0],
            provinceName: item.pathLabels[0],
            cityCode: item.pathValues[1],
            cityName: item.pathLabels[1]
        })
    })
}
// 生效城市回显
// if (res.data.provinceCityInfo) {
//     res.data.provinceCityInfo.forEach(item => {
//         const catesInfo = [item.provinceCode, item.cityCode]
//         dataState.effectiveCitysChecked.push(catesInfo)
//     })
//     dataState.effectiveCitysVisiable = false
//     setTimeout(() => {
//         dataState.effectiveCitysVisiable = true
//     }, 100)
// }
const options = ref([])
const merchantMsg = async (query) => {
    if (query) {
        const param = {
            appKey: 'A1001000',
            busiCode: 'A1001011',
            merchantName: query
        }
        const res = await merchantid(param)
        options.value = res.data
    } else {
        options.value = []
    }
}
// 选择商户
const merchantCheck = async (item) => {
    dataState.formData.merchantName = item.merchantName
    dataState.formData.busiMerchantId = item.busiMerchantId
}
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
