<template>
    <div class="guide">
        <div class="logo"></div>
        <div class="text">
            <p>健康预制菜</p>
            <p>简单加工即食，好吃又实在</p>
        </div>
        <div class="btns">
            <div v-if="isIos" @click="onDown('ios')">
                <span class="icon ios-icon"></span><span>iphone下载</span>
            </div>
            <div v-else @click="onDown('android')">
                <span class="icon and-icon"></span><span>Android下载</span>
            </div>
        </div>
        <div class="bottom"></div>
        <div v-if="isMask" class="mask" @click="isMask = false">
            <div class="tip"></div>
        </div>
    </div>
</template>
<script setup>
import { isWx, isIos } from '@/utils'
// import { downAndPath } from '@/api/guide'

const isMask = ref(false)
const ios = 'https://itunes.apple.com/cn/app/id1619082404'
// let android = ''
const android = 'https://hsh-native-life-1309143854.cos.ap-beijing.myqcloud.com/apk/1656656632757.apk' // 3.2

// 获取 android 地址
// const init = async () => {
//     if (!isIos) {
//         const res = await downAndPath()
//         if (res.code === 200) {
//             android = res.data.downloadPath
//         }
//     }
// }
// init()

const onDown = (type) => {
    if (isWx) {
        isMask.value = true
    } else {
        window.open(type === 'ios' ? ios : android)
    }
}
</script>
<style lang="scss" scoped>
.guide {
    position: relative;
    height: 100vh;
    .logo {
        position: absolute;
        top: 174px;
        left: 107px;
        background: url("../../assets/guide/logo.png") no-repeat;
        background-size: 100% 100%;
        width: 536px;
        height: 468px;
    }
    .text {
        position: absolute;
        top: 683px;
        width: 100%;
        height: 90px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #e64b09;
        line-height: 45px;
        text-align: center;
    }
    .btns {
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 170px;
        z-index: 9;
        width: 100%;
        height: 90px;
        div {
            width: 290px;
            line-height: 80px;
            text-align: center;
            border-radius: 10px;
            border: 2px solid #ffffff;
            cursor: pointer;
            &:first-child {
                margin-left: 73px;
            }
            &:last-child {
                margin-right: 73px;
            }
        }
        .icon {
            position: relative;
            top: 15px;
            margin-right: 17px;
            display: inline-block;
            width: 46px;
            height: 46px;
        }
        .ios-icon {
            background: url("../../assets/guide/iphone-icon.png") no-repeat;
            background-size: 100% 100%;
        }
        .and-icon {
            background: url("../../assets/guide/android-icon.png") no-repeat;
            background-size: 100% 100%;
        }
        span {
            width: 183px;
            height: 45px;
            font-size: 32px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #ffffff;
            line-height: 80px;
        }
    }
    .bottom {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 509px;
        background: url("../../assets/guide/bottom-gj.png") no-repeat;
        background-size: 100% 100%;
    }
    .mask {
        position: relative;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10;
        width: 100vw;
        height: 100vh;
        background: #000000;
        opacity: 0.5;
        .tip {
            position: absolute;
            top: 63px;
            right: 53px;
            width: 473px;
            height: 297px;
            background: url('../../assets/guide/tip.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>
