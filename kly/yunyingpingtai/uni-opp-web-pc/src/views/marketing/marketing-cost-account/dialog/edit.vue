<template>
    <div class='coupon-submit-box'>
        <el-dialog v-model="dialogVisible" :before-close="handleClose">
            <template #title>
                <div class='dialog-title'>
                    调整预算金额
                </div>
            </template>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                <el-form-item label="账户名称：" prop="acctId">
                    <el-select v-model="ruleForm.acctId" placeholder="请选择～" @change="acctNameChange">
                        <el-option v-for="item in acctNameList" :key="item.acctId" :label="item.acctName" :value="item.acctId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型：" prop="acctType">
                    <el-select v-model="ruleForm.acctType" disabled placeholder="请选择～">
                        <el-option v-for="item in acctTypeStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="机构：" prop="deptName">
                    <el-select v-model="ruleForm.deptName" disabled placeholder="请选择～">
                        <el-option v-for="item in deptStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算中心：" prop="centorName">
                    <el-select v-model="ruleForm.centorName" disabled placeholder="请选择～">
                        <el-option v-for="item in centorStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算科目：" prop="subjectName">
                    <el-select v-model="ruleForm.subjectName" disabled placeholder="请选择～">
                        <el-option v-for="item in subjectStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算项目：" prop="projectName">
                    <el-select v-model="ruleForm.projectName" disabled placeholder="请选择～">
                        <el-option v-for="item in projectStatus" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预算期间：" prop="budgetPeriods" class="form-item-time">
                    <el-date-picker
                        v-model="ruleForm.budgetPeriods"
                        type="monthrange"
                        value-format="YYYY-MM"
                        range-separator="～"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        @change="clickdDate"
                    />
                </el-form-item>
                <el-form-item>
                    <template #default>
                        <div>
                            <div class="date-box" v-for="(item,index) in getMonthBT" :key="index">
                                <div>{{item.budgetPeriod}}</div>
                                <div class="date-box-text">充值金额: ￥</div>
                                <div class="date-box-input"><el-input-number v-model="item.chargeAmount" controls-position="right" :precision="2" maxlength="16" placeholder="请输入～"></el-input-number></div>
                            </div>
                        </div>
                    </template>
                </el-form-item>
                <el-form-item label="方案申请单号：" prop="budgetBillsCode">
                    <el-input v-model="ruleForm.budgetBillsCode" maxlength="16" placeholder="请输入～"></el-input>
                </el-form-item>
                <el-form-item label="添加附件：" prop="attachUrl" class="form-item-upload">
                    <!--<cst-upload :limit="1" :multiple="false" v-model:fileList="ruleForm.fileList"></cst-upload>-->
                    <el-upload
                        class="multiple"
                        action="#"
                        multiple
                        :limit="1"
                        :http-request="fileRequest"
                        :file-list="result.fileList"
                        :on-remove="handleRemove"
                    >
                        <el-button type="primary">上传</el-button>
                        <template #tip>
                            <div class="el-upload__tip">
                                只允许上传一个文件；文件名长度应为3~50之间
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                    <el-input v-model="ruleForm.remark" :rows="4" maxlength="300" show-word-limit type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">关闭</el-button>
                    <el-button type="primary" @click="submit()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { toRefs, reactive, onMounted, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElLoading } from 'element-plus'
import { getAllAccList, getAccDetail, postAccDetail, postUpload } from '@/api/marketing/marketing-cost'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const props = defineProps({
    visible: {
        type: Boolean
    }
})
const result = reactive({
    fileList: [],
    hideUpload: false,
    isLoading: false
})
const dataState = reactive({
    ruleForm: {
        acctId: '',
        acctName: '',
        acctType: '',
        deptCode: '',
        deptName: '',
        centorCode: '',
        centorName: '',
        subjectCode: '',
        subjectName: '',
        projectCode: '',
        projectName: '',
        budgetPeriods: '',
        chargeAmount: '',
        yvsuanshijianStart: '',
        yvsuanshijianCen1: '',
        yvsuanshijianCen2: '',
        yvsuanshijianEnd: '',
        budgetBillsCode: '',
        attachUrl: '',
        fileList: [],
        remark: ''
    },
    // 所以账户
    acctNameList: [],
    // 账户类型
    acctTypeStatus: [
        {
            value: 1,
            label: '公司内部'
        }
    ],
    // 预算机构
    deptStatus: [
        {
            value: 'A001',
            label: '恒生活'
        }
    ],
    // 预算中心
    centorStatus: [
        {
            value: 'A1001001',
            label: '恒生活App'
        }
    ],
    // 预算科目
    subjectStatus: [
        {
            value: 'A100100101',
            label: '营销费用'
        }
    ],
    // 预算项目
    projectStatus: [
        {
            value: 'A10010010101',
            label: '优惠卷'
        }
    ]
})
const { ruleForm, acctNameList, acctTypeStatus, deptStatus, centorStatus, subjectStatus, projectStatus } = toRefs(dataState)
const loadingInstance = ref(null)
const getMonthBT = ref([])
const ruleFormRef = ref(null)
const dialogVisible = ref(props.visible)
const emit = defineEmits(['handleClose'])
const handleClose = () => {
    emit('handleClose', props.visible)
}
const rules = reactive({
    budgetBillsCode: [
        { required: true, message: '请输入充值单据号～', trigger: 'blur' }
    ]
})
const clickdDate = (value) => {
    const startTime = value[0]
    const endTime = value[1]
    if (typeof startTime === 'string') {
        const reg = /^\d{4}-(0?[1-9]|1[0-2])$/g
        if (!reg.test(startTime)) return `开始时间：${startTime}时间格式错误`
    }
    if (typeof endTime === 'string') {
        const reg = /^\d{4}-(0?[1-9]|1[0-2])$/g
        if (!reg.test(endTime)) return `结束时间：${endTime}时间格式错误`
    }
    let start = new Date(startTime)
    const end = new Date(endTime)
    const resultTime = []
    while (start <= end) {
        // 月份需要加 1
        const getMonth = start.getMonth() + 1
        const getYear = start.getFullYear()
        const a = {}
        /**
         * 拼接时间格式
         * (getMonth >= 10 ? `${getMonth}` : `0${getMonth}`) 自动给 小于10的时间前面补0
         */
        const setTime = `${getYear}-` + (getMonth >= 10 ? `${getMonth}` : `0${getMonth}`)
        a.budgetPeriod = setTime
        a.chargeAmount = 0
        resultTime.push(a)
        /**
         * 重新设置开始时间
         * 使用 setFullYear() 方法会自动将时间累加，返回的是时间戳格式
         * 使用 new Date() 将时间重新设置为标准时间
         */
        start = new Date(start.setFullYear(getYear, getMonth))
    }
    getMonthBT.value = resultTime
}
onMounted(() => {
    getAllList()
})
// 获取所以账户
const getAllList = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001'
    }
    const res = await getAllAccList(param)
    if (res.code === '200') {
        dataState.acctNameList = res.data
    }
}
// 获取账户详情
const acctNameChange = async () => {
    const param = {
        appKey: 'A1001001',
        busiCode: 'A1001001',
        acctId: dataState.ruleForm.acctId
    }
    const res = await getAccDetail(param)
    if (res.code === '200') {
        dataState.ruleForm.acctId = res.data.acctId
        dataState.ruleForm.acctName = res.data.acctName
        dataState.ruleForm.acctType = res.data.acctType
        dataState.ruleForm.deptCode = res.data.deptCode
        dataState.ruleForm.deptName = res.data.deptName
        dataState.ruleForm.centorCode = res.data.centorCode
        dataState.ruleForm.centorName = res.data.centorName
        dataState.ruleForm.subjectCode = res.data.subjectCode
        dataState.ruleForm.subjectName = res.data.subjectName
        dataState.ruleForm.projectCode = res.data.projectCode
        dataState.ruleForm.projectName = res.data.projectName
    }
}
// 上传文件
const fileRequest = async (file) => {
    const formData = new FormData()
    formData.append('file', file.file)
    if (!props.watermark) {
        loadingInstance.value = ElLoading.service({
            lock: true,
            text: '附件上传中...',
            background: 'rgba(0, 0, 0, 0.3)'
        })
        result.isLoading = true
        const res = await postUpload(formData)
        if (res.code === '200') {
            dataState.ruleForm.attachUrl = res.data
            loadingInstance.value.close()
            result.isLoading = false
        } else {
            result.fileList = []
            dataState.ruleForm.attachUrl = ''
            loadingInstance.value.close()
            result.isLoading = false
        }
    }
}
// 删除图片
const handleRemove = () => {
    result.fileList = []
    dataState.ruleForm.attachUrl = ''
}
// 提交数据
const submit = async () => {
    if (dataState.ruleForm.attachUrl === '') {
        ElMessage({
            showClose: true,
            message: '上传附件不能为空',
            type: 'warning'
        })
        return
    }
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const params = {
                appKey: 'A1001001',
                busiCode: 'A1001001',
                acctId: dataState.ruleForm.acctId,
                acctName: dataState.ruleForm.acctName,
                acctType: dataState.ruleForm.acctType,
                budgetId: '',
                deptCode: dataState.ruleForm.deptCode,
                deptName: dataState.ruleForm.deptName,
                centorCode: dataState.ruleForm.centorCode,
                centorName: dataState.ruleForm.centorName,
                subjectCode: dataState.ruleForm.subjectCode,
                subjectName: dataState.ruleForm.subjectName,
                projectCode: dataState.ruleForm.projectCode,
                projectName: dataState.ruleForm.projectName,
                applier: userInfo.value.name,
                applierId: userInfo.value.account,
                budgetPeriods: getMonthBT.value,
                chargeAmount: dataState.ruleForm.chargeAmount,
                budgetBillsCode: dataState.ruleForm.budgetBillsCode,
                creatorId: userInfo.value.account,
                modifierId: userInfo.value.account,
                attachUrl: dataState.ruleForm.attachUrl,
                remark: dataState.ruleForm.remark
            }
            const res = await postAccDetail(params)
            if (res.code === '200') {
                ElMessage.success('调整预算成功！')
                emit('handleClose', props.visible)
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
.date-box div {
    display: inline-block;
}
.date-box-text {
    margin-left: 20px
}
.date-box-text:before {
    content: "*";
    color: var(--el-color-danger);
    margin-right: 4px;
}
.date-box-input {
    margin-left: 10px
}
.el-input-number {
    margin-bottom: 10px;
}
.form-item-upload>label:before {
    content: "*";
    color: var(--el-color-danger);
    margin-right: 4px;
}
</style>
