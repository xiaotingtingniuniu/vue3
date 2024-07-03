<template>
    <div class="withdrawal-apply-page">
        <div class="withdrawal-apply-box">
            <div class="title">提现金额(不能低于0.5元)</div>
            <div class="input-box">
                <span>¥</span>
                <van-field v-model="transAmount" placeholder="请输入提现金额" type="number"/>
            </div>
            <div class="footer">最多可提现金额{{ Number($route.query.amount).toFixed(2) }}元</div>
        </div>
        <!-- <div class="bank-card">
            <div class="title">支持可提现到如下银行卡</div>
            <van-radio-group v-model="payType">
                <div class="cell" v-for="(item, index) in bankCardList" :key="index">
                    <van-image :src="require('@/assets/wx_logo.png')"/>
                    <div class="content">招商银行(1234)</div>
                    <van-radio name="1" checked-color="#FE7E41"/>
                </div>
                <div class="cell">
                    <van-image :src="require('@/assets/xh_logo.png')"/>
                    <div class="content">工商银行(4855)</div>
                    <van-radio name="2" checked-color="#FE7E41"/>
                </div>
            </van-radio-group>
        </div> -->
        <div class="submit-button">
            <van-button block @click="submit">提交</van-button>
        </div>
        <div class="rule">
            <div class="title">提现规则：</div>
            <!-- <div>1. 每笔提现收取0.5元手续费</div>
            <div>2. 单笔提现最低金额0.5元，对私业务单笔提现限额5万元，对公业务单笔提现限额50万元</div> -->
            <div>1. 提现申请需要审核，审核预计时间为2-3个工作日。审核通过后，预计2个小时到账</div>
            <div>2. 提现成功后资金将到账提现时选定的银行卡，请您及时关注到账信息</div>
            <div>3. 提现失败的金额会在提现状态更新为失败后，即时退回您的账户</div>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleWithdrawal } from '@/api/wallet'
import { Toast, Dialog } from 'vant'
import { newPageRedirect } from '@/utils/composables'

const route = useRoute()
const transAmount = ref('')
// const payType = ref()
const acctType = route.params.acctType
// const bankCardList = ref([])
// 获取银行卡列表
// const getBankCards = async () => {
//     const res = await queryBankCardList()
//     console.log(res)
//     if (res.code === '200') {
//         bankCardList.value = res.data
//     }
// }
// getBankCards()
// 提现提交
const submit = async () => {
    if (transAmount.value === '') {
        Toast('请输入提现金额')
        return false
    } else if (transAmount.value > Number(route.query.amount)) {
        transAmount.value = Number(route.query.amount)
        Toast(`最多可提现${Number(route.query.amount).toFixed(2)}元`)
        return false
    } else if (transAmount.value <= 0.5) {
        return Dialog.alert({
            message: '输入金额超限, 不可发起提现, 请重新输入提现金额',
            confirmButtonText: '我知道了',
            confirmButtonColor: '#FE7E41'
        }).then(() => {
            // on close
        })
    }
    const params = {
        acctType: acctType,
        transAmount: transAmount.value
    }
    const res = await handleWithdrawal(params)
    if (res.code === '200') {
        const userPhone = res.data.userPhone
        const busiUserId = res.data.busiUserId
        const withdrawNum = res.data.withdrawNum
        console.log(`${process.env.VUE_APP_WALLET}/withdrawalApply?acctType=02&bizCode=HSH&userPhone=${userPhone}&busiUserId=${busiUserId}&withdrawNum=${withdrawNum}`)
        newPageRedirect(`${process.env.VUE_APP_WALLET}/withdrawalApply?acctType=02&bizCode=HSH&userPhone=${userPhone}&busiUserId=${busiUserId}&withdrawNum=${withdrawNum}`)
    } else {
        Toast(res.msg)
    }
}
</script>
<style lang="scss" scoped>
.withdrawal-apply-page{
    .withdrawal-apply-box{
        margin: 20px 30px 0;
        background: #FFFFFF;
        border-radius: 24px;
        padding: 32px 30px;
        .title{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
        }
        .input-box{
            display: flex;
            align-items: center;
            margin-top: 38px;
            padding-bottom: 30px;
            border-bottom: 1px solid #F4F5F5;
            span{
                font-size: 40px;
            }
            .van-cell{
                padding: initial;
                margin-left: 12px;
            }
            .van-field{
                font-size: 64px;
                font-weight: 400;
                color: #B0B0B0;
            }
        }
        .footer{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            margin-top: 32px;
        }
    }
    .bank-card{
        margin: 20px 30px;
        background: #FFFFFF;
        border-radius: 24px;
        .title{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            padding: 32px 30px;
            border-bottom: 1px solid #F4F5F5;
        }
        .cell:last-child{
            border-bottom: initial;
        }
        .cell{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 38px 30px;
            border-bottom: 1px solid #F4F5F5;
            .van-image{
                width: 40px;
                height: 40px;
            }
            .content{
                width: 0;
                flex: 1;
                margin-left: 20px;
            }
        }
    }
    .submit-button{
        margin: 40px 60px 0;
        .van-button{
            height: 92px;
            background: #FE7E41;
            border-radius: 46px;
            font-size: 30px;
            font-weight: 500;
            color: #FFFFFF;
        }
    }
    .rule{
        margin: 80px 30px 0;
        .title{
            font-size: 28px;
            font-weight: 400;
            color: #696969;
            margin-bottom: 18px;
        }
        div{
            font-size: 26px;
            font-weight: 400;
            color: #696969;
        }
    }
}
</style>
