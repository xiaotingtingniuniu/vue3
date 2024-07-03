<template>
    <el-form label-width="150px" >
        <el-row v-if="props.handleType!=='detail'&&props.handleType!=='edit'&&props.handleType!=='add'">
            <!-- <el-col>
                <el-form-item label-width="80px">
                    <el-button type="primary" plain @click="back">取消</el-button>
                    <el-button type="primary" @click="save">提交审核</el-button>
                </el-form-item>
            </el-col> -->
            <el-col v-if="props.handleType==='confirm'">
                <el-form-item label="审核意见" label-width="80px">
                    <el-select disabled v-model="merchantClassify" clearable placeholder="请选择"   collapse-tags collapse-tags-tooltip>
                        <el-option>
                            审核通过
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="80px">
                    <el-button type="primary" @click="merConfirm">确认</el-button>
                    <el-button type="primary" @click="back">返回</el-button>
                </el-form-item>
            </el-col>
            <el-col v-if="props.handleType!=='add' && props.handleType!=='editnew'">
                <el-form-item label="认证类型">
                    <!-- <el-radio :disabled="props.handleType==='confirm'" v-for="(item,index) of mapRole" v-model="checkedVal" :label="index" :key="item">{{item}}</el-radio> -->
                    <el-radio :disabled="props.handleType==='confirm'||approval||noCanNew" v-model="checkedVal" :label="1">企业</el-radio>
                    <el-radio :disabled="props.handleType==='confirm'||approval||noCanNew" v-model="checkedVal" :label="2">个人</el-radio>
                    <el-radio :disabled="props.handleType==='confirm'||approval||noCanNew" v-model="checkedVal" :label="3">个体商户</el-radio>
                </el-form-item>
            </el-col>
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick" v-if="props.handleType!=='add' && props.handleType!=='editnew'">
                <el-tab-pane label="基本信息" name="1"></el-tab-pane>
                <el-tab-pane label="业务信息" name="2"></el-tab-pane>
            </el-tabs>
        </el-row>
    </el-form>
</template>
<script setup>
import { toRefs, reactive, computed, onMounted, ref } from 'vue'
import CstUpload from '@/components/upload/upload.vue'
import { getMerchantList } from '@/api/operate/index'
import { unifiedGatewayPost, unifiedGatewayGet } from '@/api/marketing/marketingApply.js'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const props = defineProps(['handleType', 'cb', 'type'])
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const approval = ref(!!(addMerchant.busiMerchantStatus === 4))
const noCanNew = computed(() => props.handleType === 'detailnew' || props.handleType === 'confirm')
const activeName = ref(props.type)
const userInfo = computed(() => store.state.userInfo)
const mapRole = ref({
    1: '企业',
    2: '个人',
    3: '个体工商户'
})
const checkedVal = ref(null)
const merchantClassify = ref('审核通过')
const handleClick = (tab, event) => {
    if (props.cb) {
        props.cb()
    }
    if (tab.paneName === '1') {
        router.push({ name: 'settle-apply-person', params: { handleType: props.handleType } })
    } else if (tab.paneName === '2') {
        router.push({ name: 'business-line-information-tab', params: { handleType: props.handleType } })
    }
}
const back = () => {
    router.push({ name: 'merchant-settle-list' })
}
const personBusiness = JSON.parse(sessionStorage.getItem('personBusiness'))
const businessLine = JSON.parse(sessionStorage.getItem('businessLine'))
checkedVal.value = addMerchant.merchantType
const merConfirm = async () => {
    const param = {
        appKey: 'A1001000',
        busiCode: 'A1001000',
        configCode: 'UC53420309626130432',
        name: '商户确认',
        source: '商户中台',
        body: {
            appKey: 'A1001001',
            busiMerchantId: addMerchant.busiMerchantId,
            modifierId: userInfo.value.id
        }
    }
    const res = await unifiedGatewayPost(param)
    if (res) {
        setTimeout(() => {
            router.go(-1)
        }, 1000)
    }
}
const save = async () => {
    if (props.cb) {
        props.cb()
    }
    const personBusiness = JSON.parse(sessionStorage.getItem('personBusiness'))
    const businessLine = JSON.parse(sessionStorage.getItem('businessLine'))
    const submitApply = JSON.parse(sessionStorage.getItem('submitApply'))
    let res
    let res1
    let res2
    personBusiness && (res = await unifiedGatewayPost(personBusiness))
    if (res) {
        businessLine.body.merchantId = res.data.merchantId
        businessLine && (res1 = await unifiedGatewayPost(businessLine))
    }
    if (res1) {
        submitApply.body.busiMerchantId = res1.data.busiMerchantId
        submitApply && (res2 = await unifiedGatewayPost(submitApply))
    }
    if ((personBusiness && res) || (businessLine && res1) || (submitApply && res2)) {
        router.push({ name: 'merchant-settle-list' })
        sessionStorage.removeItem('personBusiness')
        sessionStorage.removeItem('businessLine')
        sessionStorage.removeItem('submitApply')
    }
}
</script>
