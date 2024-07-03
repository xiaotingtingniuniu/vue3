<template>
    <div class="reuslt">
        <el-steps :active="4" align-center>
            <el-step title="填写认证信息"></el-step>
            <el-step title="选择经营业务"></el-step>
            <el-step title="提交申请资料"></el-step>
            <el-step title="平台审核"></el-step>
        </el-steps>
        <div class="success" v-if="props.result === 'success'">
            <div class="icon"></div>
            <p class="tit">提交成功</p>
            <p class="tips">您的申请已提交，将在x个工作日内完成审核，请您耐心等待。</p>
        </div>
        <div class="fail" v-if="props.result === 'fail'">
            <div class="icon"></div>
            <p class="tips">提交失败，请稍后重试</p>
            <el-button class="btn" @click="back">返 回</el-button>
        </div>
        <div class="detail" v-if="props.result === 'detail'">
            <div v-if="nowState.status=='4'" class="icon success"></div>
            <div v-if="nowState.status=='3'" class="icon fail"></div>
            <div v-if="nowState.status=='1'||nowState.status=='2'" class="icon wait"></div>
            <p class="tips">{{stateEm[nowState.status]}}</p>
            <p class="tips" v-if="nowState.status=='3'">
                您好，请核对并修改以下信息后，再重新提交。
            </p>
            <div v-if="nowState.status=='3'">
                <p>您提交的内容有如下错误：</p>
                <p>{{nowState.auditReason}}</p>
            </div>
            <p class="tips" v-if="nowState.status=='1'||nowState.status=='2'">
                {{`您的${nowState.busiName}业务入驻申请已于${nowState.subTime}提交，将在x个工作日内完成审核，请您耐心等待。`}}
            </p>
            <p class="tips" v-if="nowState.status=='4'">
                {{`您的${nowState.busiName}业务入驻申请已于${nowState.auditTime}通过。`}}
            </p>
            <el-button class="btn" v-if="nowState.status=='4'" @click="gotoContract">查看合同</el-button>
            <el-button class="btn" v-if="nowState.status=='4'" @click="gotoM">查看钱包账户</el-button>
            <el-button class="btn" v-if="nowState.status=='3'" @click="gotoEdit">去修改</el-button>
        </div>
    </div>
</template>
<script setup>
import { toRefs, reactive, computed, onMounted, ref } from 'vue'
import { unifiedGatewayPost, unifiedGatewayGet } from '../../../api/marketing/marketingApply.js'
import { useRouter } from 'vue-router'
const addMerchant = JSON.parse(sessionStorage.getItem('addMerchant'))
const router = useRouter()
const props = defineProps(['result'])
const stateEm = ref({
    1: '未提交', 2: '审核中', 3: '审核驳回', 4: '审核通过'
})
const businessLine = ref({
    A1001001: '到家电商/平台商家',
    A1001002: '智能货柜',
    A1001005: 'B2B商城',
    A1001009: '供应商',
    A1001003: '本地生活',
    A1001011: '推广公司'
})
const nowState = ref({})
const getStatus = async () => {
    const param = {
        body: {
            busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId,
            appKey: 'A1001000'
        },
        appKey: 'A1001000',
        busiCode: 'A1001001',
        configCode: 'UC53421775191445504',
        name: '查询商户审核状态',
        source: '商户中台'
    }
    const res = await unifiedGatewayPost(param)
    nowState.value = res.data
    // nowState.value = {
    //     id: 142,
    //     busiCode: 'A1001003',
    //     phoneMobile: '19001302222',
    //     merchantId: 'PM1671273559715JXV',
    //     busiMerchantId: '031671273563059Z07',
    //     merchantName: '韦小宝',
    //     merchantType: 2,
    //     applyType: 1,
    //     status: 3,
    //     subTime: '2022-12-17 18:56:03',
    //     auditTime: '2022-12-17 19:01:08',
    //     enterStep: 3,
    //     creatorId: 'PM1671273559715JXV',
    //     creatorName: '韦小宝',
    //     modifierId: '031671273563059Z07',
    //     modifierName: '',
    //     gmtCreate: '2022-12-17 18:39:20',
    //     gmtModify: '2022-12-17 19:01:08',
    //     auditReason: '12121',
    //     busiName: '本地生活'
    // }
    console.log(res)
}
onMounted(() => {
    getStatus()
})
// 返回
const back = () => {
    router.push({ name: 'merchant-settle-list' })
}
//  合同
const gotoContract = () => {
    router.push({ name: 'contract-master-list' })
}
// 钱包
const gotoM = () => {
    router.push({ name: 'account-select' })
}
// 修改
const gotoEdit = () => {
    router.push({ name: 'settle-apply-person', params: { busiMerchantId: addMerchant.newbusiMerchantId || addMerchant.busiMerchantId, handleType: 'editnew' } })
}
</script>
<style lang="scss" scoped>
    .reuslt{
        .fail,.success,.detail{
            width: 100%;
            margin-top: 100px;
            text-align: center;
            .icon{
                height: 100px;
                width: 100%;
                background: url('./img/success.gif') center center no-repeat;
                background-size: contain;
            }
            .tit{
                font-size: 40px;
                margin-top: 50px;
            }
            .tips{
                font-size: 20px;
                margin-top: 50px;
            }
            .btn{
                margin-top: 20px;
            }
        }
        .fail{
            .icon{
                background: url('./img/fail.gif') center center no-repeat;
                background-size: contain;
            }
        }
        .detail{
            .success{
                background: url('./img/success.gif') center center no-repeat;
                background-size: contain;
            }
            .fail{
                background: url('./img/fail.gif') center center no-repeat;
                background-size: contain;
            }
            .wait{
                background: url('./img/close.gif') center center no-repeat;
                background-size: contain;
            }
        }
    }
</style>
