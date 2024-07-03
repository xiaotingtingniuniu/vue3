<template>
    <div class="change-account">
        <div class="content">
            <div class="head-box">
                <img src="@/assets/replenishmentImg/head-protriat.png" class="head-protriat">
            </div>
            <span class="account-info">
                {{accountName}}
            </span>
            <van-button
                type="primary"
                round
                text="更换绑定结算账户"
                color="#FE7E41"
                @click="gotoPerson"
                class="btn"
            >
            </van-button>
            <van-button
                round
                text="取消"
                class="btn"
                @click="closePage"
            >
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { newPage, closePage } from '@/utils/composables'
import { subledgerUpdate } from '@/api/collect-money-setting.js'
import { Toast } from 'vant'
import { appBridge, registerhandler } from '@/utils/bridge.js'

const route = useRoute()
const openId = ref('')
// const router = useRouter()
const accountName = route.query.name
// 跳转分账人页面
const gotoPerson = () => {
    const info = route.query
    if (info.merchantType === '0') {
        registerhandler('setWxAuthResult', res => {
            if (res.authResult === 1) {
                openId.value = res.openid
                nickname.value = res.nickname || ''
                subledgerPayee()
            } else {
                Toast('授权失败')
            }
        })
        appBridge('startWxAuth')
    } else {
        const params = {
            mobile: info.mobile,
            mobileScret: info.mobileScret,
            name: info.name,
            accountNo: info.accountNo,
            merchantSubId: info.merchantSubId,
            merchantType: info.merchantType, // roleType:1柜主，2子账号,子账号身份只能是个人，柜主身份可能是个人，可能是企业；merchantType： 1企业，2个人
            showNavbar: 0,
            type: 'update',
            merchantSubType: info.merchantSubType
        }
        newPage(`/add-routing-person-phase?mobileScret=${params.mobileScret}&type=${params.type}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}&merchantSubType=${params.merchantSubType}`, params)
    }
}

const nickname = ref('')
// 注册微信收款人
const subledgerPayee = async (values, a) => {
    const info = route.query
    const params = {
        mobile: info.mobile,
        name: info.name,
        accountNo: info.accountNo,
        subLedgerId: info.merchantSubId,
        type: info.merchantType,
        openId: openId.value,
        nickname: nickname.value
    }
    const res = await subledgerUpdate(params)
    if (res.code === '200') {
        Toast('授权成功')
        setTimeout(() => {
            closePage()
        }, 1500)
    }
}
</script>
<style lang="scss" scoped>
.change-account{
    padding: 50px;
    .content{
        background: #fff;
        background-image: url('../../../../assets/replenishmentImg/change-account-bg.png');
        background-size: 100% auto;
        background-repeat: no-repeat;
        border-radius: 25px;
        padding: 100px 70px 40px 70px;
    }
    .head-box{
        text-align: center;
        .head-protriat{
            width: 144px;
        }
    }
    .account-info{
        display: block;
        text-align: center;
        margin-top: 34px;
        margin-bottom: 120px;
        font-size: 36px;
    }
    .btn{
        width: 100%;
        margin-bottom: 40px;
        font-size: 30px;
    }
}
</style>
