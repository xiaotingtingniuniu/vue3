<template>
    <div class="verification">
        <van-nav-bar fixed placeholder :title="$route.meta.title" z-index="10" left-arrow>
            <template #left>
                <div class="icon--unselect" @click="closePage" >
                    <van-image :src="require('@/assets/back-icon-order.png')"/>
                </div>
            </template>
        </van-nav-bar>
        <div class="couponcode">
            <div class="searchcode">
                <van-field v-model="voucherCode" autofocus placeholder="请输入券码" :clearable='true' :clear-icon="require('@/assets/verification/close.png')"/>
            </div>
            <div class="btn-verification">
                <div class="btn-style">
                    <van-button type="warning" @click="verification">验证</van-button>
                    <van-button type="warning" @click="codeScan()">扫码</van-button>
                </div>
            </div>
        </div>
        <div class="coupontips" v-if="isshow">
            <div class="img1"></div>
            <div class="title">券码有效，可以核销</div>
            <div class="text">确定核销前，请注意核对券信息 包括接待时间，店铺，产品等</div>
        </div>
        <div class="coupontips" v-if="fail">
            <div class="img2"></div>
            <div class="title">{{failmsg ? failmsg : ''}}</div>
            <div class="text"></div>
        </div>
        <div class="verification-list" v-if="isshow">
            <div class="verification-title">
                <van-icon :name="require('@/assets/verification/shop.png')" size="18"/>
                <div class="title--name">{{datastate.storeName}}</div>
                <div class="title--price">￥{{(datastate.specialPrice/100).toFixed(2)}}</div>
            </div>
            <div class="verification-content">
                <div class="content-image">
                    <img class="img" :src="datastate.goodsList[0].skuPictureUrl" alt=""/>
                </div>
                <div class="contnet-text" v-if="isshow">
                    <div class="text">商品名称：{{datastate.goodsList[0].skuName}}</div>
                    <div class="text">核销人：{{datastate.verifyUserName}}</div>
                    <div class="text">核销状态：{{!isverification ? '已核销' : (datastate.status === 1 ? '待核销' : '已核销')}}</div>
                    <div class="text">接待日期：{{datastate.useTimeContent.weeks.toString()}}</div>
                    <div class="text">接待时间：{{datastate.useTimeContent.timeRanges.toString()}}</div>
                </div>
            </div>
        </div>
        <div class="verificationbtn" v-if="isverification">
            <van-button type="warning" @click="scancode">确认核销</van-button>
        </div>
        <div class="disverificationbtn" v-else>
            <van-button>确认核销</van-button>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue'
import { check, userdverification } from '@/api/verification.js'
import { isApp } from '@/utils'
import { Toast } from 'vant'
import { closePage } from '@/utils/composables'
import { useStore } from 'vuex'
import { appBridge, registerhandler } from '@/utils/bridge.js'

const store = useStore()
const modifyinfo = store.state.modify
console.log(JSON.stringify(store.state.modify) + 'info打印')
const userinfo = JSON.parse(sessionStorage.getItem('managerInfo'))
console.log(userinfo + '我的')
const active = ref(0)
const voucherCode = ref('')
onActivated(async () => {
    active.value = 1
})
const datastate = ref(null)
const isshow = ref(false)
const isverification = ref(false)
const fail = ref(false)
const failmsg = ref('')
const verification = async () => {
    if (!voucherCode.value) {
        Toast({
            message: '请输入券码',
            duration: 2000
        })
        return
    }
    const params = {
        voucherCode: voucherCode.value,
        verifyUserId: modifyinfo.userId,
        verifyUserName: modifyinfo.name
    }
    const res = await check(params)
    if (res.code === '200') {
        isshow.value = true
        fail.value = false
        isverification.value = true
        datastate.value = res.data
    } else {
        fail.value = true
        isshow.value = false
        isverification.value = false
        failmsg.value = res.msg.split('：')[1]
    }
}
const scancode = async () => {
    const params = {
        voucherCode: voucherCode.value,
        verifyUserId: modifyinfo.userId,
        verifyUserName: modifyinfo.name
    }
    const res = await userdverification(params)
    if (res.code === '200') {
        Toast({
            message: '核销成功',
            duration: 2000
        })
        isverification.value = false
    } else {
        Toast({
            message: res.msg,
            duration: 2000
        })
    }
    console.log(res)
}
const codeScan = async () => {
    if (!isApp) return Toast('请在App中使用')
    registerhandler('setScanResult', (res) => {
        voucherCode.value = res
        console.log(res + 'resdatasa')
    })
    appBridge('openScan', 0)
}
</script>
<style lang="scss" scoped>
.verification{
    width: 100vw;
    background: #F4F5F5;
    display: flex;
    flex-direction: column;
    .van-nav-bar__placeholder{
        :deep(.van-nav-bar){
            padding-top: var(--van-status-bar-height);
            background-color: #fff;
            .icon--unselect{
                // width: 19px;
                // height: 31px;
                .van-image{
                    width: 19px;
                    height: 31px;
                }
            }
        }
        :deep(.van-nav-bar::after){
            content: initial;
        }
        :deep(.van-nav-bar__text){
            color: #FE7E41;
        }
    }
    :deep(.van-search__content){
        border-radius: 31px;
        background-color: #F3F5F6;
    }
    .couponcode{
        margin-top: 20px;
        background-color: #FFF;
        .searchcode{
            margin-top: 64px;
            :deep(.van-cell){
                font-size: 30px;
                width: 600px;
                height: 90px;
                color: #999999;
                background-color: #F4F5F5;
                border-radius: 8px;
                margin: 0 auto;
            }
        }
    }
    .coupontips{
        text-align: center;
        background-color: #FFF;
        .img1{
            margin: 0 auto;
            margin-top: 18px;
            width: 216px;
            height: 216px;
            background-image: url('~@/assets/verification/success.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .img2{
            margin: 0 auto;
            margin-top: 18px;
            width: 216px;
            height: 216px;
            background-image: url('~@/assets/verification/fail.png');
            background-size: 100% 100%;
            background-repeat: no-repeat;
        }
        .title{
            margin: 0 auto;
            margin-top: 16px;
            font-size: 36px;
            color: #191919;
            font-weight: bold;
        }
        .text{
            width: 365px;
            margin: 10px auto;
            margin-bottom: 52px;
            color: #696969;
            font-size: 26px;
        }
    }
    .verification-list{
        // height: 368px;
        background-color: #FFF;
        padding: 24px 30px 8px 30px;
        margin-top: 20px;
        .verification-title{
            height: 60px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding-bottom: 12px;
                border-bottom: 1px solid #F4F5F5 ;
            .title--name{
                flex: 1;
                font-size: 30px;
                padding-left: 10px;
            }
            .title--price{
                color: #FE7E41;
                font-size: 28px;
                font-weight: bold;
            }
        }
        .verification-content{
            display: flex;
            align-items: flex-start;
            justify-content: baseline;
            margin-top: 24px;
            .content-image{
                width: 134px;
                height: 134px;
                // background-color: red;
                border-radius: 8px;
                .img{
                    width: 134px;
                    height: 134px;
                    border-radius: 8px;
                }
            }
            .contnet-text{
                padding-left: 32px;
                // margin-bottom: 16px;
                font-size: 24px;
                color: #999999;
                .text{
                    padding-bottom: 16px;
                }
            }
        }
    }
}
</style>
<style lang="scss">
.btn-verification{
    padding: 60px 16px;
    border-radius: 31px;
    // text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-style{
        width: 422px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .van-button{
            width: 200px;
            height: 80px;
            // background: #FE7E41;
            background: linear-gradient(90deg, #FE7E41  0%, #FF5D0F  100%);
            border-radius: 46px;
            color: #fff;
            font-size: 28px;
        }
    }
}
.verificationbtn{
    font-size: 30px;
    position: fixed;
    bottom: 76px;
    left: 60px;
    right: 60px;
    .van-button{
        width: 630px;
        height: 92px;
        background: #FE7E41;
        border-radius: 46px;
        color: #fff;
        font-size: 30px;
    }
}
.disverificationbtn{
    font-size: 30px;
    position: fixed;
    bottom: 76px;
    left: 60px;
    right: 60px;
    .van-button{
        width: 630px;
        height: 92px;
        background: #CCCCCC ;
        border-radius: 46px;
        color: #fff;
        font-size: 30px;
    }
}
</style>
