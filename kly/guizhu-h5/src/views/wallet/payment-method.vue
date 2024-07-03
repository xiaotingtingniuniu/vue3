<template>
    <div class="payment-method-page">
        <div class="cell-group">
            <van-radio-group v-model="checked">
                <div class="cell" v-for="(item, index) in pageData" :key="index" @click="cellClick(item)">
                    <van-image :src="imgObj[item.channel]"/>
                    <div class="content">
                        <div>{{ item.channelDesc }}<div class="label" :class="`color${item.openFlag}`">{{ item.openFlagDesc }}</div></div>
                        <div>{{ descObj[item.channel] }}</div>
                    </div>
                    <div class="cell-right">
                        <div class="button" @click="toChangeAccount()" v-if="item.channel===1&&item.openFlag===2">更换绑定</div>
                        <template v-if="item.openFlag===2">
                            <van-radio @click="radioChange(item)" v-if="$route.query.merchantSubType !== '3'" :name="item.channel" checked-color="#FE7E41"/>
                        </template>
                        <img v-else class="right-icon" src="@/assets/replenishmentImg/right@2x.png" alt="">
                    </div>
                </div>
                <div class="cell" @click="xhClick" v-if="!route.query.merchantSubId&&xhData">
                    <van-image :src="require('@/assets/xh_logo.png')"/>
                    <div class="content">
                        <div>小恒收款<div class="label" :class="`color${xhData.openFlag}`">{{ xhData.openFlagDesc }}</div></div>
                        <div>售卖款结算至小恒收款账户，可至我的收入操作提现</div>
                    </div>
                    <div class="cell-right">
                        <img class="right-icon" src="@/assets/replenishmentImg/right@2x.png" alt="">
                    </div>
                </div>
            </van-radio-group>
        </div>
    </div>
</template>
<script setup>
import { ref, onBeforeMount, computed } from 'vue'
import { getSubLedgerPaymentMethodList, queryOpenStatus, switchSubLedgerPaymentMethod } from '@/api/wallet'
import { useRoute } from 'vue-router'
import { querySubledgerPayee, queryInvite } from '@/api/collect-money-setting.js'
import { appBridge, registerhandler } from '@/utils/bridge.js'
import { newPage } from '@/utils/composables'
import wxIcon from '@/assets/wx_logo.png'
import xhIcon from '@/assets/xh_logo.png'
import { Toast, Dialog } from 'vant'
import { useStore } from 'vuex'

const store = useStore()
const imgObj = {
    1: wxIcon,
    3: xhIcon
}
const descObj = {
    1: '售卖款结算至微信余额账户',
    3: '售卖款结算至小恒收款账户，可至我的收入操作提现'
}

const checked = ref(null)
const oldChecked = ref(null)
const route = useRoute()

onBeforeMount(() => {
    if (route.query.merchantSubId) {
        getData()
    } else {
        queryOpenStatusFn()
    }
})

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        if (route.query.merchantSubId) {
            getData()
        } else {
            queryOpenStatusFn()
        }
    }
})

const xhData = ref({
    openFlag: 0,
    openFlagDesc: '未开通'
})
const queryOpenStatusFn = async () => {
    const res = await queryOpenStatus()
    if (res.code === '200' && res.data) {
        xhData.value = res.data
    }
}

// 邀请开通收款方式
const entityUserId = computed(() => store.state.userInfo.merchantId)
const invite = async (channel) => {
    const res = await queryInvite({
        entityUserId: entityUserId.value,
        channel
    })
    if (res.code === '200') {
        Toast('邀请成功')
    }
}

const radioChange = async (item) => {
    if (item.enableStatus === 1) {
        return false
    }
    checked.value = oldChecked.value
    if (item.channel === 3) {
        Dialog.confirm({
            message: `切换${item.channelDesc}模式后，无法再次使用微信收款功能，请您确认！`,
            confirmButtonColor: '#FE7E41'
        }).then(() => {
            switchPaymentMethodFn(oldChecked.value, item.channel)
        })
    } else {
        switchPaymentMethodFn(oldChecked.value, item.channel)
    }
}

// 收款模式变更
const switchPaymentMethodFn = async (channelFrom, channelTo) => {
    const res = await switchSubLedgerPaymentMethod({
        channelFrom,
        channelTo
    })
    if (res.code === '103') {
        Dialog.confirm({
            message: res.msg,
            confirmButtonColor: '#FE7E41'
        }).then(async () => {
            await invite(channelTo)
        })
        checked.value = oldChecked.value
    } else if (res.code !== '200') {
        checked.value = oldChecked.value
    } else {
        getData()
    }
}

const pageData = ref([])
const getData = async () => {
    const res = await getSubLedgerPaymentMethodList({
        subLedgerId: route.query.merchantSubId
    })
    pageData.value = res.data
    if (pageData.value) {
        pageData.value.map((item, index) => {
            if (item.enableStatus === 1) {
                checked.value = item.channel
                oldChecked.value = item.channel
            }
        })
    }
}

// 注册微信收款人
const subledgerPayee = async (item) => {
    const res = await querySubledgerPayee({
        ...item,
        functionType: 1,
        name: route.query.name,
        mobile: route.query.mobile,
        accountNo: route.query.accountNo
    })
    if (res.code === '200') {
        Toast('授权成功')
        getData()
    }
}

const cellClick = (item) => {
    if (item.channel === 1 && item.openFlag === 0) {
        if (item.type === 1) {
            const params = {
                mobile: route.query.mobile,
                mobileScret: route.query.mobileScret,
                name: route.query.name,
                accountNo: route.query.accountNo,
                merchantSubId: route.query.merchantSubId,
                merchantType: route.query.merchantType, // roleType:1柜主，2子账号,子账号身份只能是个人，柜主身份可能是个人，可能是企业；merchantType： 1企业，2个人
                showNavbar: 0,
                type: 'update',
                merchantSubType: route.query.merchantSubType
            }
            newPage(`/add-routing-person-phase?mobileScret=${params.mobileScret}&type=${params.type}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}&merchantSubType=${params.merchantSubType}`, params)
        } else {
            appBridge('startWxAuth')
            registerhandler('setWxAuthResult', res => {
                if (res.authResult === 1) {
                    item.openId = res.openid
                    item.nickname = res.nickname || ''
                    subledgerPayee(item)
                } else {
                    Toast('授权失败')
                }
            })
        }
    } else if (item.channel === 3 && item.openFlag !== 2) {
        appBridge('openAccount')
    }
}

// 更换绑定
const toChangeAccount = () => {
    const params = {
        mobile: route.query.mobile,
        mobileScret: route.query.mobileScret,
        name: route.query.name,
        accountNo: route.query.accountNo,
        merchantSubId: route.query.merchantSubId,
        merchantType: route.query.merchantType, // roleType:1柜主，2子账号,子账号身份只能是个人，柜主身份可能是个人，可能是企业；merchantType： 1企业，0个人
        merchantSubType: route.query.merchantSubType
    }
    newPage(`/change-account?mobileScret=${params.mobileScret}&mobile=${params.mobile}&name=${params.name}&accountNo=${params.accountNo}&merchantSubId=${params.merchantSubId}&merchantType=${params.merchantType}&merchantSubType=${params.merchantSubType}`, params)
}
// 小恒收款 点击
const xhClick = () => {
    if (xhData.value.openFlag === 2) {
        newPage('/property?showNavbar=0')
    } else {
        appBridge('openAccount')
    }
}

</script>
<style lang="scss" scoped>
.payment-method-page{
    padding-top: 30px;
    .cell-group{
        .cell{
            display: flex;
            align-items: center;
            padding: 30px;
            background: #FFFFFF;
            border-bottom: 1px solid #F4F5F5;
            .van-image{
                width: 80px;
                height: 80px;
            }
            .content{
                width: 0;
                flex: 1;
                margin-left: 20px;
                &>div:nth-child(1){
                    font-size: 32px;
                    font-weight: 500;
                    color: #191919;
                    display: flex;
                    align-items: center;
                    .label{
                        margin-left: 12px;
                        padding: 2px 12px;
                        font-size: 20px;
                        font-weight: 400;
                        border-radius: 17px;
                        color: #999999;
                        background: #F4F5F5;
                    }
                    .color0{
                        color: #999999;
                        background: #F4F5F5;
                    }
                    .color1{
                        color: #FE7E41;
                        background: #FFE8DD;
                    }
                    .color2{
                        color: #69925A;
                        background: #E5F7DF;
                    }
                    .color3{
                        color: #FF1E19;
                        background: #FFD9DE;
                    }
                }
                &>div:nth-child(2){
                    font-size: 20px;
                    font-weight: 400;
                    color: #999999;
                    margin-top: 16px;
                }
            }
            .cell-right{
                display: flex;
                align-items: center;
                .right-icon{
                    width: 10px;
                    height: 20px;
                }
                .button{
                    width: 120px;
                    height: 48px;
                    border-radius: 8px;
                    border: 1px solid #FE7E41;
                    font-size: 24px;
                    font-weight: 400;
                    color: #FE7E41;
                    margin-right: 40px;
                    text-align: center;
                    line-height: 48px;
                }
            }
        }
    }
}
</style>
