<template>
    <div class="open-steps">
        <div class="steps">
            <div v-if="statusList.length">
                <van-steps :active="active" active-color="#FE7E41">
                    <van-step v-for="step in statusList" :key="step.name">{{step.name}}</van-step>
                </van-steps>
            </div>
        </div>
        <div class="steps-main" v-show="contractStatus === '5'">
            <div class="main">
                <qrcode-vue class="qrcode" :value="qrCodeUri" level="H" />
                <div>待签约</div>
                <p>商家超级管理员，使用微信打开指定页面，核实签约</p>
            </div>
        </div>
        <div class="steps-main" v-show="['2', '6'].includes(contractStatus)">
            <div class="main">
                <img :src="inReview" alt="">
                <div>审核中</div>
                <p v-if="contractStatus === '6'">微信资料审核中，请稍后</p>
                <p v-if="contractStatus === '2'">当申请单状态为“审核中”时，3~7个工作日内完成审核，请等待审核结果。</p>
            </div>
        </div>
        <!--  v-show="['4', '7'].includes(contractStatus)" -->
        <div class="steps-refusal" v-show="['4', '7'].includes(contractStatus)">
            <div class="main">
                <!-- <van-cell title="驳回原因" value="" title-style="color:'#ccc'"/> -->
                <!-- <van-cell v-for="(item, index) in errorList" :key="index" title="" :value="item.rejectReason"></van-cell> -->
                <p>驳回原因</p>
                <p v-for="(item, index) in errorList" :key="index" title="" :value="item.rejectReason">{{item.rejectReason}}</p>
            </div>
        </div>
        <div class="footer">
            <van-button type="primary" block round color="#FE7E41" @click="closePage">返回首页</van-button>
            <p v-if="isReject" @click="toDetail">修改资料</p>
            <p v-else @click="toDetail('detail')">查看详情</p>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import inReview from '@/assets/inReview.png'
import { queryMerchantInfoStatus } from '@/api/collect-money-setting'
import { closePage } from '@/utils/composables'
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const active = ref(0)
const isReject = ref(false)
const contractStatus = ref('0')
const statusList = ref([])
// const causeList = []
const qrCodeUri = ref('')
const errorList = ref([])
// const errortext = '[{"paramName":"id_card_number","rejectReason":"1.未查询到该身份证号码，请检查身份证号码是否填写正确;2.公安接口校验不通过，建议注册个体户后再来申请入驻"},{"paramName":"id_card_copy","rejectReason":"请上传清晰的身份证人像面照片"},{"paramName":"merchant_shortname","rejectReason":"暂不支持该商户简称，请重新填写内容后提交"}]'
const init = async () => {
    const res = await queryMerchantInfoStatus()
    if (res.code === '200') {
        // errorList.value = JSON.parse(errortext)
        const list = [{ name: '资料审核中' }, { name: '待签约' }, { name: '签约审核中' }, { name: '已完成' }]
        // 进件签约状态 1-初始化 2-签约审核中 3-已完成 4-签约审核中被驳回 5-待签约 6-资料审核中 7-资料审核中被驳回
        contractStatus.value = res.data.contractStatus
        if (['7'].includes(res.data.contractStatus)) {
            statusList.value = [...list.slice(0, 1), { name: '已驳回' }]
            active.value = 1
            isReject.value = true
            errorList.value = res.data.rejectReason && JSON.parse(res.data.rejectReason)
            return
        }
        if (['4'].includes(res.data.contractStatus)) {
            statusList.value = [...list.slice(0, 3), { name: '已驳回' }]
            active.value = 3
            isReject.value = true
            errorList.value = res.data.rejectReason && JSON.parse(res.data.rejectReason)
            return
        }
        isReject.value = false
        statusList.value = list
        if (res.data.contractStatus === '2') {
            active.value = 2
        }
        if (res.data.contractStatus === '3') {
            active.value = 3
        }
        if (res.data.contractStatus === '6') {
            active.value = 0
        }
        if (res.data.contractStatus === '5') {
            qrCodeUri.value = res.data.signUrl
            active.value = 1
        }
    }
}
init()
const toDetail = (val) => {
    router.replace({ name: 'open-pay', params: { status: val } })
}
</script>
<style scoped lang="scss">
.open-steps{
    position: relative;
    padding-top: 20px;
    width: 100%;
    height: 100vh;
    background: #fff;
    padding: 20px 50px;
    box-sizing: border-box;
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 20px;
        background: #F4F5F5;
    }
    .steps{
        width: 100%;
        padding: 20px 40px;
        box-sizing: border-box;
    }
    .steps-main{
        width: 100%;
        margin-bottom: 100px;
        margin-top: 20px;
        .main{
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img{
                width: 212px;
                height: 213px;
            }
            div{
                width: 100%;
                text-align: center;
                padding: 16px;
                box-sizing: border-box;
                font-size: 36px;
                font-family: PingFangSC-Semibold, PingFang SC;
                font-weight: 600;
                color: #2E2E4D;
            }
            p{
                width: 100%;
                font-size: 24px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #494849;
                text-align: center;
                line-height: 33px;
            }
        }
    }
    .steps-refusal{
        margin-bottom: 100px;
        .main {
            p {
                margin: 26px 30px;
                font-size: 30px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #333333;
                line-height: 42px;
            }
        }
    }
    .footer{
        p{
            width: 100%;
            text-align: center;
            color: #FE7E41;
            font-size: 26px;
            margin: 20px 0;
        }
    }
    .van-cell{
    .van-cell__title{
        color: #999999;
    }
    .van-cell__value{
        color: #333333;
    }
    }
}
</style>
