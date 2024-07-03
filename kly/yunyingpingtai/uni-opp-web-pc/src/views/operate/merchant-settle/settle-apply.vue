<template>
    <div class="information-management">
        <div class="title">入驻流程</div>
        <el-steps :active="4" align-center>
            <el-step title="填写认证信息" description="" />
            <el-step title="选择经营业务" description="" />
            <el-step title="提交申请资料" description="" />
            <el-step title="平台审核" description="" />
        </el-steps>
        <div class="choose">请录入新增商户信息</div>

        <el-form label-width="150px" ref="formRef" :rules="rules">
            <el-col style="display: flex; justify-content: center; margin-top: 30px">
                <el-form-item label="认证类型" :rules="rules.noEmpty">
                    <el-radio v-for="(item, index) of mapRole" v-model="form.checkedVal" :label="index" :key="item">{{ item }}</el-radio>
                </el-form-item>
            </el-col>
            <el-col v-if="form.checkedVal !== '2'" style="display: flex; justify-content: center; margin-top: 30px">
                <el-form-item label="统一社会信用代码">
                    <el-input v-model="form.creditCode" />
                </el-form-item>
            </el-col>
            <el-col v-if="form.checkedVal === '2'" style="display: flex; justify-content: center; margin-top: 30px">
                <el-form-item label="身份证号码">
                    <el-input v-model="form.cdCrad" />
                </el-form-item>
            </el-col>
            <el-col style="display: flex; justify-content: center; margin-top: 30px">
                <el-form-item label="注册登录手机号">
                    <el-input v-model="form.phoneMobile" />
                </el-form-item>
            </el-col>
        </el-form>
        <div class="btn">
            <el-button type="primary" @click="apply">开始申请</el-button>
        </div>
    </div>
</template>
<script setup>
import { ElMessage } from 'element-plus'
import { ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { unifiedGatewayPost, unifiedGatewayGet } from '../../../api/marketing/marketingApply.js'
import { phoneNoValidator, idCard, regChinese, regNumber, regAccount } from '@/utils/rule.js'
const store = useStore()
const router = useRouter()
const dataState = reactive({
    form: {
        creditCode: '',
        cdCrad: '',
        phoneMobile: '',
        checkedVal: ''
    }
})
const { form } = toRefs(dataState)
const mapRole = ref({
    1: '企业',
    2: '个人',
    3: '个体工商户'
})
const apply = async () => {
    if (form.checkedVal === '') {
        ElMessage({
            showClose: true,
            message: '请先选择您的身份',
            type: 'warning'
        })
    } else {
        const params = {
            body: {
                appKey: 'A1001001',
                merchantType: dataState.form.checkedVal,
                uniqueCode: dataState.form.checkedVal === '2' ? dataState.form.cdCrad : dataState.form.creditCode,
                phoneMobile: dataState.form.phoneMobile
            },
            appKey: 'A1001001',
            busiCode: 'A1001001',
            configCode: 'UC73770533732048896',
            name: '录入新增商户信息',
            source: '商户中台'
        }

        console.log('formm===', form)
        const result = await unifiedGatewayPost(params)

        if (result.code !== '200') {
            ElMessage({
                showClose: true,
                message: '认证类型互斥',
                type: 'warning'
            })
            return false
        }

        const param = {
            body: {
                appKey: 'A1001001',
                merchantType: dataState.form.checkedVal,
                phoneMobile: dataState.form.phoneMobile
            },
            appKey: 'A1001001',
            busiCode: 'A1001001',
            configCode: 'UC53423060221333504',
            name: '查询商户入驻认证信息',
            source: '商户中台'
        }
        const res = await unifiedGatewayPost(param)
        if (res.code === '200') {
            sessionStorage.removeItem('addMerchant')
            res.data.phoneMobile = dataState.form.phoneMobile
            res.data.merchantType = dataState.form.checkedVal
            sessionStorage.setItem('addMerchant', JSON.stringify(res.data))
            router.push({ name: 'settle-apply-person' })
        }
    }
}
// 校验手机
const validphone = (rule, value, callback) => {
    if (value === '') {
        return callback(new Error('请输入正确的用户11位手机号～'))
    }
    // if (!phoneNoValidator(value)) return callback(new Error('请输入正确的用户11位手机号～'))
    if (value.length !== 11) return callback(new Error('请输入正确的用户11位手机号～'))
    callback()
}
// 表单项规则
const rules = reactive({
    noEmpty: [{ required: true, message: '请选择', trigger: 'change' }],
    phoneMobile: [{ required: true, validator: validphone, trigger: 'blur' }]
})
</script>

<style scoped lang="scss">
.information-management {
    text-align: center;
    .title {
        font-size: 40px;
        font-weight: bold;
        padding-bottom: 40px;
        text-align: left;
    }
    .choose {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        padding-top: 40px;
    }
    .opend {
        text-align: center;
        padding-top: 40px;
    }
    .wait {
        padding-top: 20px;
    }
    .role {
        text-align: center;
        padding-top: 60px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        div {
            width: 160px;
            height: 80px;
            border: 1px solid #347cb0;
            line-height: 80px;
            margin: 0px 40px;
            font-weight: bold;
        }
        .active {
            background: #347cb0;
            color: #fff;
        }
    }
    .btn {
        padding-top: 40px;
        text-align: center;
    }
}
</style>
