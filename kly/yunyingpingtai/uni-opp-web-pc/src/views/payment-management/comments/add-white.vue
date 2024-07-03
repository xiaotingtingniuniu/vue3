<template>
    <div class='submit-box'>
        <el-form ref="ruleFormRef" :model="ruleForm" label-position="right" label-width="150px">
            <el-form-item label="支付方式" prop="whiteType" :rules="rules.selectRule">
                <el-radio-group v-model="ruleForm.whiteType">
                    <el-radio :label="2">直连</el-radio>
                    <el-radio :label="1">收付通</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商户类型" prop="merchantType" :rules="rules.selectRule">
                <el-select class="form-action-item-50w" v-model="ruleForm.merchantType" clearable placeholder="请选择" @change="dictTypeChange">
                    <el-option label="柜主" value="1" />
                    <el-option label="待运营商" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="选择商户" prop="dictContent" v-if="ruleForm.merchantType" :rules="rules.dictContent">
                <span class="form-text form-text-btn" @click="showSubDialog()">选择</span>
                <div class="dictContentBox">
                    <span class="checkedItem" v-for="(item, index) in ruleForm.dictContent" :key="index">
                        {{item.merchantName}}({{item.phoneMobile}})
                        <span class="form-text form-text-btn" @click="removeDictContent(index)">删除</span>
                    </span>
                </div>
            </el-form-item>
            <el-form-item label="货柜编号" prop="dviceCode" v-if="ruleForm.dictContent.length>0"  :rules="rules.selectRule">
                <el-select v-model="ruleForm.dviceCode" clearable placeholder="请选择" multiple collapse-tags collapse-tags-tooltip>
                    <el-option v-for="el in dviceList" :label="el" :value="el" :key="el" />
                </el-select>
            </el-form-item>
        </el-form>
        <div class="footer">
            <span class="dialog-footer">
                <el-button type="primary"  v-if="props.type === 'add'" @click="submitForm(ruleFormRef)">
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
            :listType="ruleForm.merchantType"
            :hasSelectList="ruleForm.dictContent"
            @handleClose="listDialogConfig = false"
            @getCheckedData="getCheckedData"
        ></com-List>
    </div>
</template>
<script setup>
import { reactive, ref, computed, nextTick, onMounted } from 'vue'
import comList from './merchant'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getMerchantList } from '@/api/operate/index'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['type'])
const listDialogConfig = ref(false) // 页面子列表弹框
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
    merchantType: null,
    dictKey: '',
    dictName: '',
    whiteType: 2,
    dictContent: [],
    dviceCode: []
})
const dviceList = ref([])

onMounted(() => {
    console.log(ruleForm.dictContent, 'dictContent')
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

const device = async () => {
    const parm = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            merchantType: ruleForm.merchantType,
            whiteType: 2
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC23790479870681088',
        name: '查询柜主所有设备',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (ruleForm.merchantType === '1') {
        parm.body.busiMerchantId = ruleForm.dictContent[0].contentId
    }
    if (ruleForm.merchantType === '2') {
        parm.body.merchantSubId = ruleForm.dictContent[0].contentId
    }
    const data = await getMerchantList(parm)
    dviceList.value = data
}

const getDeviceList = async () => {
    const parm = {
        body: {
            busiCode: 'A1001002',
            appKey: 'A1001000',
            deviceList: ruleForm.dviceCode,
            modifierId: userInfo.value.account,
            whiteType: ruleForm.whiteType
        },
        appKey: 'A1001000',
        busiCode: 'A1001002',
        configCode: 'UC23786901286256640',
        name: '批量添加设备白名单表',
        source: '商户中台',
        modifierId: userInfo.value.account
    }
    const data = await getMerchantList(parm)
    router.go(-1)
}
// 提交表单
const submitForm = async (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid, fields) => {
        if (valid) {
            ElMessageBox.confirm('是否确认加入白名单，加入白名单后对应货柜只能通过收付通收款', '提示',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'error'
                }
            ).then(async () => {
                await getDeviceList()
            }).catch(() => {})
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
    ruleForm.dviceCode = ''
    dviceList.value = []
    info.map((item, index) => {
        checkedList.push({
            ...item,
            contentOrder: index
        })
    })
    nextTick(() => {
        ruleForm.dictContent = checkedList
        console.log(ruleForm.dictContent, ruleForm.dictContent[0].contentId, ' ruleForm.dictContent')
        device()
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
    ruleForm.dviceCode = ''
    dviceList.value = []
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
