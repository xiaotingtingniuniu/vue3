<template>
    <div class='submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="字典类型" prop="dictType" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.dictType" clearable placeholder="请选择" :disabled="canNotEdit" @change="dictTypeChange">
                    <el-option label="优惠券落地页" value="1" />
                    <el-option label="批次审批" value="2" />
                    <el-option label="拉新裂变" value="3" />
                </el-select>
            </el-form-item>
            <el-form-item label="字典名称" prop="dictName" :rules="rules.name">
                <el-input class="form-action-item-50w" v-model="ruleForm.dictName" placeholder="最多输入40字符长度" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="字典key" prop="dictKey" :rules="rules.dictKey">
                <el-input class="form-action-item-50w" v-model="ruleForm.dictKey" placeholder="最多输入40字符长度" clearable :disabled="canNotEdit"/>
            </el-form-item>
            <el-form-item label="字典内容" prop="dictContent" v-if="ruleForm.dictType">
                <span class="form-text form-text-btn" @click="showSubDialog()">选择</span>
                <div class="dictContentBox">
                    <span class="checkedItem" v-for="(item, index) in ruleForm.dictContent" :key="index">
                        {{item.contentName}}({{item.contentId}})
                        <span class="form-text form-text-btn" @click="removeDictContent(index)">删除</span>
                    </span>
                </div>
            </el-form-item>
        </el-form>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary"  v-if="handleType === 'add' || handleType === 'edit'" @click="submitForm(ruleFormRef)">
                    提交
                </el-button>
                <el-button type="primary" @click="handleClose">
                    取消
                </el-button>
            </span>
        </div>
        <com-List
            v-if="listDialogConfig"
            :listVisible ='listDialogConfig'
            :listType="dataState.subListType"
            :hasSelectList="ruleForm.dictContent"
            @handleClose="listDialogConfig = false"
            @getCheckedData="getCheckedData"
        ></com-List>
    </div>
</template>
<script setup>
import { reactive, ref, computed, nextTick } from 'vue'
import comList from './dictconfig-handle-comList.vue'
import { geteDict, addDict, updateDict } from '@/api/system/dictConfig'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const canNotEdit = computed(() => handleType === 'edit')
const listDialogConfig = ref(false) // 页面子列表弹框
const handleType = route.query.handleType
const dictCode = route.query.dictCode

// 返回批次列表
const goCouponBatchList = async () => {
    router.back()
}
const emit = defineEmits(['handleClose', 'fevent'])
const handleClose = () => {
    goCouponBatchList()
}
const ruleFormRef = ref('')
const dataState = reactive({
    authorityCheckedNodes: [],
    subListType: '' // 子弹框列表
})
const ruleForm = reactive({
    dictType: null,
    dictKey: '',
    dictName: '',
    dictContent: []
})

// 表单项规则
const rules = reactive({
    selectRule: [{ required: true, message: '请选择', trigger: 'change' }],
    name: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 40, message: '最长不超过40个字符长度', trigger: 'change' }
    ],
    dictKey: [
        { required: true, message: '请输入', trigger: 'change' },
        { max: 40, message: '最长不超过40个字符长度', trigger: 'change' }
    ],
    dictContent: [{ required: true, message: '请选择', trigger: 'change' }]
})

// 获取优惠券批次单条数据
const getsingleData = async () => {
    const params = {
        dictCode: dictCode,
        batchStatus: 1,
        operatorId: userInfo.value.account
    }
    const res = await geteDict(params)
    Object.assign(ruleForm, res.data)
    ruleForm.dictType = ruleForm.dictType.toString()
}

if (handleType) {
    if (handleType !== 'add') {
        getsingleData()
    }
}

// 提交表单
const submitForm = async (formEl) => {
    const params = {
        ...ruleForm,
        modifierId: userInfo.value.account,
        applier: userInfo.value.name,
        applierId: userInfo.value.account,
        gmtOperate: new Date().getTime()
    }
    if (params.dictType !== '1') {
        if (params.dictContent.length === 0) {
            ElMessage.warning('请选择字典内容')
            return false
        }
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (handleType === 'add') {
                const res = await addDict({ ...params })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            } else {
                const res = await updateDict({ ...params, dictCode })
                if (res.code === '200') {
                    handleClose()
                    ElMessage({
                        message: res.message,
                        type: 'success'
                    })
                    emit('fevent')
                }
            }
        }
    })
}
// 字典类型改变，清空字典内容
const dictTypeChange = () => {
    ruleForm.dictContent = []
}

// 获取已选列表项
const getCheckedData = (info, index) => {
    const checkedList = []
    ruleForm.dictContent = []
    info.map((item, index) => {
        checkedList.push({
            ...item,
            contentOrder: index
        })
    })
    nextTick(() => {
        ruleForm.dictContent = checkedList
    })
}
// 展示子列表
const showSubDialog = () => {
    dataState.subListType = ruleForm.dictType
    listDialogConfig.value = true
}
// 删除成本账户
const removeDictContent = (index) => {
    ruleForm.dictContent.splice(index, 1)
}
</script>
<style lang="scss" scoped>
    .submit-box{
        .dictContentBox{
            width: 100%;
            width: 100%;
            .checkedItem{
                display: block;
            }
        }
        .form-text{
          display: inline-block;
          height: 32px;
          line-height: 32px;
          color: #606266;
          font-size: 14px;
        }
        .form-text-btn{
          display: inline-block;
          margin-left: 5px;
          color: #fe2c55;
          cursor: pointer;
        }
        .footer{
          margin: 30px;
          text-align: center;
        }
    }
</style>
