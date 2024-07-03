<template>
    <!-- <h1>表单提交组件</h1> -->
    <div class="lz-dialog">
        <!-- <el-dialog v-model="dialogShow" :title="props.whoelastic === 'toexamine' ? '商品售卖范围审批' : '商品售卖范围详情'" :width="obj.dialogWidth" :before-close="close" draggable>
            <template #default>
                <el-dialog
                    v-model="innerVisible"
                    width="50%"
                    append-to-body
                >
                    <el-form ref="resetFormData" label-width="120px" class="demo-ruleForm" :model="form" :inline="true">
                        <el-form-item label="拒绝原因" prop="merchantName">
                            <el-input v-model="form.desc" type="textarea" class="twotextarea" />
                        </el-form-item><br />
                        <el-form-item class="button-box">
                            <el-button type="text" @click="innerVisible = false">取消</el-button>
                            <el-button type="primary" @click=" innerVisible = false, success()">确认</el-button>
                        </el-form-item>
                    </el-form>
                </el-dialog>
            </template> -->
        <!-- <template > -->
        <el-form ref="resetFormData" label-width="130px" class="demo-ruleForm" :model="form" >

            <el-form-item label="商户编码" prop="merchantId" >
                <el-input v-model="form.merchantId" placeholder="商户编码"  :disabled="true" class="form-action-item-50w"/>
            </el-form-item>
            <el-form-item label="商户名称" prop="merchantName" >
                <el-input v-model="form.merchantName" placeholder="商户名称" :disabled="true" class="form-action-item-50w"/>
            </el-form-item>
            <el-form-item label="基础类目范围" prop="merchantName">
                <el-row>
                    <el-col v-for="(item,index) in form.merchantAttributeJson.cates" :key="index">
                        {{item.firstCateName}}/{{item.secondCateName}}/{{item.thirdCateName}}/{{item.fourthCateName}}
                    </el-col>
                </el-row>

            </el-form-item>
            <el-form-item label="品牌范围" prop="brandCode">
                <!-- <el-checkbox-group v-model="form.type">
                    <el-checkbox v-for="item in 7" :key="item" :label="'品牌'+item" name="type" />
                </el-checkbox-group> -->
                <el-select v-model="form.brandCode" clearable placeholder="请选择" multiple value-key="brandCode" @change="brandChange" :disabled="true">
                    <el-option v-for="item in brandList" :key="item.brandCode" :label="item.brandName" :value="item" />
                </el-select>
            </el-form-item>
            <el-form-item label="选择商品售卖渠道" prop="merchantName">
                <!-- <el-input v-model="form.desc" type="textarea" class="twotextarea" /> -->
                <el-row>
                    <el-col v-for="(item,index) in form.merchantAttributeJson.channels" :key="index">
                        {{item.firstChannelName}}/{{item.secondChannelName}}
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
        <!-- <span v-if="obj.dialogIsFooter" class="dialog-footer"> -->
        <el-button class="btn-mixins-clear-default" @click="gobick" v-if="props.handleType === 'detail'">返回</el-button>
        <el-button class="btn-mixins-clear-default" @click="refuseVisable = true" v-if="props.handleType === 'applove'">拒绝</el-button>
        <el-button type="primary" class="btn-mixins dia-suc" @click="edit('success')" v-if="props.handleType === 'applove'">通过</el-button>

        <el-dialog v-model="refuseVisable"  :before-close="handleClose" title="商家售卖范围管理">
            <el-form
                ref="formRef"
                :model="ruleForm"
                :rules="rules"
                class="demo-ruleForm"
            >
                <el-form-item label="拒绝原因" prop="textarea"  :rules="rules.textarea">
                    <el-input  v-model="ruleForm.textarea"  placeholder="请输入拒绝原因！" maxlength="11" @keydown.enter="handleClose"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="primary" @click="handleClose">取消 </el-button>
                    <el-button type="primary" @click="edit('pass')">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>
<script setup>
import { reactive, ref, toRefs } from 'vue'
import SystemList from '@/composables/TablePagination/index.vue'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted } from '@vue/runtime-core'
import { getMerchantList } from '@/api/operate/index'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const store = useStore()

const userInfo = computed(() => store.state.userInfo)
const props = defineProps(['id', 'handleType', 'merchantStatus'])

// const props = defineProps({
//     dialogObject: {
//         default () {
//             return {}
//         },
//         type: Object
//     },
//     whoelastic: {
//         typeo: String,
//         default: '审核'
//     }
// })
const innerVisible = ref(false)
const dataState = reactive({
    brandList: [], // 商品品牌列表
    form: {
        brandCode: '',
        merchantAttributeJson: {
            cates: [],
            brands: [],
            channels: []
        }

    },
    ruleForm: {
        textarea: ''
    },
    refuseVisable: false

})
const { brandList, form, refuseVisable, ruleForm } = toRefs(dataState)
const rules = reactive({
    textarea: [{
        required: true,
        trigger: 'blur',
        message: '请输入拒绝原因'
    }
    ]
})
const success = () => {
    if (route.params.who === 'applove') {
        edit()
    } else {

    }
    // gobick()
}
const gobick = () => {
    router.go(-1)
}

const getPinpaiList = async () => {
    const param = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001001',
            currPage: 1,
            pageSize: 100
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC1657693014433SoKeV',
        name: '品牌查询',
        source: '商品中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const res = await getMerchantList(param)
    dataState.brandList = res.list
}
// 审核
const formRef = ref(null)
const edit = async (type) => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            merchantId: dataState.form.merchantId,
            merchantName: dataState.form.merchantName,
            id: props.id,
            modifierId: userInfo.value.account
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC1659019129441zOP5o',
        name: '审核商家属性配置申请',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    if (type === 'pass') {
        params.body.merchantStatus = 3
        params.body.reason = dataState.ruleForm.textarea
    } else {
        params.body.merchantStatus = 4
    }
    await getMerchantList(params)
    ElMessage.success('成功')
    dataState.refuseVisable = false
    router.go(-1)
}

// 详情
const details = async () => {
    const params = {
        body: {
            appKey: 'A1001000',
            busiCode: 'A1001000',
            id: props.id
        },
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC1659013682286NVRJa',
        name: '根据id查询商家属性配置申请信息',
        source: '商户中台',
        modifierId: userInfo.value.account,
        operatorId: userInfo.value.account,
        operatorName: userInfo.value.name
    }
    const data = await getMerchantList(params)
    dataState.form = data
    dataState.form.merchantAttributeJson = JSON.parse(data.merchantAttributeJson)
    dataState.form.brandCode = dataState.form.merchantAttributeJson.brands
}
onMounted(async () => {
    await getPinpaiList()
    await details()
})

const emit = defineEmits(['dialogClose', 'dialogSuccess'])
const handleClose = () => {
    dataState.refuseVisable = false
}
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
// const obj = {
//     dialogTitle: props.dialogObject.title, //  || '标题'
//     dialogWidth: props.dialogObject.width || '30%',
//     dialogCloseBtnText: props.dialogObject.closeBtnText || '取消',
//     dialogSuccessBtnText: props.dialogObject.successBtnText || '成功',
//     dialogIsFooter: props.dialogObject.isFooter || false
// }
const close = () => {
    emit('dialogClose', false, 'close')
}
</script>
<style lang="scss" scoped>
    ::v-deep(.el-form-item__content) {
        width: 500px;
    }
    .first-form {
        display: flex;
        justify-content: center;
    }
    .form-action-item-50w{
            width: 20%;
    }
</style>
