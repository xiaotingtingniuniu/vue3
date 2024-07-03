<template>
    <div class="subaccount-list">
        <div class='submit-box'>
            <el-form  :model="ruleForm" label-position="right" label-width="150px"  ref="ruleFormRef">
                <el-form-item label="商户名称" prop="merchantName"  style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.merchantName" placeholder="请输入姓名" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item label="商户角色" prop="roleName"  style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.roleName" placeholder="请输入姓名" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item label="用户姓名" prop="merchantSubName"  style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.merchantSubName" placeholder="请输入姓名" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item label="用户类型" prop="merchantSubType"   style="width: 450px">
                    <el-select v-model="ruleForm.merchantSubType"
                               placeholder="用户类型" :disabled="nocant">
                        <el-option label="代运营柜主"
                                   :value="1"/>
                        <el-option label="补货员"
                                   :value="2" />
                        <el-option label="分账人"
                                   :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneMobile"    style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.phoneMobile" placeholder="请输入手机号" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item label="身份证号" prop="idCard"  style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.idCard" placeholder="请输入邮箱" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item v-if="[1].includes(ruleForm.merchantSubType)" label="性别" prop="sex"   style="width: 450px">
                    <el-select v-model="ruleForm.sex"
                               placeholder="性别" :disabled="nocant">
                        <el-option label="男"
                                   :value="1" />
                        <el-option label="女"
                                   :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="[1].includes(ruleForm.merchantSubType)" label="年龄" prop="age"   style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.age" placeholder="请输入邮箱" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item v-if="[1].includes(ruleForm.merchantSubType)" label="职业" prop="profession"   style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.profession" placeholder="请输入邮箱" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item v-if="[1, 2].includes(ruleForm.merchantSubType)" label="学历" prop="education"   style="width: 450px">
                    <el-input class="form-action-item-50w" v-model="ruleForm.education" placeholder="请输入邮箱" clearable :disabled="nocant"/>
                </el-form-item>
                <el-form-item v-if="[1, 2].includes(ruleForm.merchantSubType)" label="有无货柜运营经验" prop="isExperience"   style="width: 450px">
                    <el-select v-model="ruleForm.isExperience"
                               placeholder="有无货柜运营经验" :disabled="nocant">
                        <el-option label="有"
                                   :value="1" />
                        <el-option label="无"
                                   :value=0 />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="[1, 2].includes(ruleForm.merchantSubType)" label="货柜经营" prop="containerOperate"   style="width: 450px">
                    <el-select v-model="ruleForm.containerOperate"
                               placeholder="货柜经营" :disabled="nocant">
                        <el-option label="全职"
                                   :value="1" />
                        <el-option label="兼职"
                                   :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="[1].includes(ruleForm.merchantSubType)" label="授权协议照片" porp="licenseAgreementUrl">
                    <!-- <div v-for="item in ruleForm.licenseAgreementUrlList"  :key="item">
                        <img :src="item" alt=""  style="width: 100px;" @click="showimg(item)"/>
                    </div> -->
                    <div>
                        <img :src="ruleForm.licenseAgreementUrl" alt="" width="200" height="200">
                    </div>

                </el-form-item>
                <el-form-item label="审核结果" v-if="props.status==='3'||props.status==='2' ||props.type ==='approval' " >
                    <el-radio-group v-model="ruleForm.status" :disabled="props.type === 'detail'">
                        <el-radio :label="2">通过</el-radio>
                        <el-radio :label="3">驳回</el-radio>
                    </el-radio-group>
                    <el-input v-if="ruleForm.status===3" class="form-action-item-50w" type="textarea" v-model="ruleForm.remark" maxlength="200"  placeholder="请输入驳回原因" clearable :disabled="props.type === 'detail'"/>
                </el-form-item>
            </el-form>
            <div class="footer">
                <span class="dialog-footer">
                    <el-button type="primary"  v-if="props.type=== 'approval' " @click="submitForm(ruleFormRef)">
                        审核
                    </el-button>
                    <el-button type="primary" @click="goBack">
                        返回
                    </el-button>
                </span>
            </div>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title=""
            width="60%"
            :before-close="handleClose"
        >
            <img :src='srcurl' style="width:100%"/>
        </el-dialog>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getAllMerchantList, getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { ElMessageBox, ElMessage } from 'element-plus'
import { fa } from 'element-plus/es/locale'

const store = useStore()
const userInfo = computed(() => store.state.userInfo)
const nocant = computed(() => props.type === 'detail' || props.type === 'approval')
const props = defineProps(['type', 'merchantSubType', 'merchantSubId', 'busiMerchantId', 'status', 'code'])
const state = ref(props.status)
// 弹窗
onMounted(() => {
    console.log(props.code, 'prop')
    if (props.type !== 'add') {
        // 请求详情的接口
        getDetailList()
    }
})
const router = useRouter()

// 返回批次列表
const goBack = async () => {
    router.back(-1)
}
const ruleFormRef = ref('')

const ruleForm = ref({
    dictType: null,
    roleName: '', // 商户角色
    merchantSubType: '', // 用户类型
    merchantSubName: '', // 姓名&&商户名称
    phoneMobile: '', // 手机号
    idCard: '', // 身份证号
    sex: '', // 性别
    age: '', // 年龄
    profession: '', // 职业
    education: '', // 学历
    isExperience: '', // 有无货柜运营经验
    containerOperate: '', // 货柜经营
    licenseAgreementUrl: '',
    licenseAgreementUrlList: [], // 授权协议照片
    status: '', // 审核状态
    remark: '' // 原因
})

// 表单项规则
// const rules = reactive({
//     status: [{ required: true, message: '请选择审核结果', trigger: 'change' }]
// })
// 详情
const getDetailList = async () => {
    const param = {
        body: {
            appKey: 'A1001001',
            busiCode: props.code,
            merchantSubId: props.merchantSubId,
            busiMerchantId: props.busiMerchantId,
            merchantSubType: props.merchantSubType,
            modifierId: userInfo.value.account,
            operator: userInfo.value.account,
            operatorName: userInfo.value.name
        },
        appKey: 'A1001001',
        busiCode: 'A1001001',
        configCode: 'UC13259829730582528',
        name: '子账号详情',
        source: '商户中台'
    }
    const res = await getMerchantList(param)
    console.log(res)
    ruleForm.value = res
    ruleForm.value.licenseAgreementUrlList = res.licenseAgreementUrl.split(',')
    ruleForm.value.remark = ''
    console.log(ruleForm.value.licenseAgreementUrlList, res.licenseAgreementUrl)
    // Object.assign(, res)
}
// 审核
const submitForm = async (formEl) => {
    console.log(ruleForm.value.remark, ruleForm.value.status, ' ruleForm.value.status')
    if (ruleForm.value.status !== 2 && ruleForm.value.status !== 3) {
        return ElMessage.error('请选择审核结果')
    }
    if (ruleForm.value.status === 3 && ruleForm.value.remark === null) {
        return ElMessage.error('请输入驳回原因')
    }
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const param = {
                body: {
                    appKey: 'A1001000',
                    busiCode: props.code,
                    status: ruleForm.value.status,
                    remark: ruleForm.value.remark,
                    merchantSubType: props.merchantSubType,
                    merchantSubId: props.merchantSubId,
                    busiMerchantId: props.busiMerchantId,
                    operator: userInfo.value.account,
                    sceneCode: '2', // 场景编号
                    functionCode: '3' // 功能编号
                },
                appKey: 'A1001000',
                busiCode: 'A1001002',
                configCode: 'UC13259913822183424',
                name: '审核子账号',
                source: '商户中台'

            }
            const res = await getAllMerchantList(param)
            if (res.code === '200') {
                ElMessage.success('审核成功')
                router.go(-1)
            }
        }
    })
}

const dialogVisible = ref(false)
const srcurl = ref(false)
const showimg = (url) => {
    dialogVisible.value = true
    srcurl.value = url
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
