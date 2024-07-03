<template>
    <div class="container-detail">
        <div class="container-detail-bg">
            <img :src="require('@/assets/detail-bj.png')" alt="">
        </div>
        <div class="container-detail-content">
            <h3 class="container-detail-content-title">{{ info.productName }}</h3>
            <div class="container-detail-content-price"><span class="money"> <span>¥</span> {{ info.detailAmount }}</span></div>
            <div class="container-detail-content-box">
                <div class="container-detail-content-box-desc" v-if="info.productOverview">
                    <h3 class="title">详情</h3>
                    <div>{{ info.productOverview }}</div>
                </div>
                <div class="container-detail-content-box-video" v-if="info.productVideo">
                    <video
                        class="detail-video"
                        :src="info.productVideo"
                        controlsList="nodownload"
                        playsinline="true"
                        controls="controls"
                        width="100%"
                        x5-video-player-fullscreen="true"
                        x5-video-player-type="h5-page"
                        :class="{ 'video_android': !info.isIos }"
                    ></video>
                    <!-- x5-video-player-fullscreen="true"
                    x5-video-player-type="h5-page" -->
                </div>
                <div class="container-detail-content-box-pdf" v-if="info.productOverviewImgList && info.productOverviewImgList.length">
                    <van-image v-for="item in info.productOverviewImgList" :key="item" :src="item" width="100%"></van-image>
                </div>
                <div class="container-placeholder"></div>
            </div>
            <van-button class="bottom-btn" size="large" @click="goBuy" round color="#FE7E41" text="30">立即购买</van-button>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getDetail, checkinventory } from '@/api/container'
import { setTitle } from '@/utils/composables'
import { appBridge } from '@/utils/bridge'
import { Dialog } from 'vant'

const route = useRoute()

let info = reactive({
    productName: '',
    detailAmount: '',
    productOverview: '',
    productVideo: '',
    productOverviewImgList: [],
    isIos: ''
})

// 跳转到众包去购买
const goBuy = async () => {
    const res = await checkinventory({ productNum: route.query.productNum })
    if (res.code === '200') {
        if (res.data.flag) {
            appBridge('goBuy', { productNum: route.query.productNum })
        } else {
            Dialog.alert({
                message: res.data.msg
            })
        }
    } else {
        Dialog.alert({
            message: res.msg
        })
    }
}

const init = async () => {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        info.isIos = true
    } else if (/(Android)/i.test(navigator.userAgent)) {
        // Android终端
        // this.profileId=str
        info.isIos = false
    }
    const res = await getDetail({ productNum: route.query.productNum })
    if (res.code === '200') {
        info = Object.assign(info, res.data)
        info.detailAmount = info.detailAmount.split('￥')[1] ? info.detailAmount.split('￥')[1] : info.detailAmount
        setTitle({ title: info.productName })
    }
}

init()
</script>

<style lang="scss" scoped>

    .video_android::-webkit-media-controls-fullscreen-button {
        display: none;
    }
    .container-placeholder {
        height: 140px;
    }
    .container-detail {
        position: relative;
        box-sizing: border-box;
        height: 100vh;
        .container-detail-bg {
            position: absolute;
            top: 0;
            z-index: -1;
            width: 100%;
            height: 380px;
            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }
        &-content {
            position: relative;
            padding: 40px;
            box-sizing: border-box;
            height: 100%;
            &-title {
                height: 56px;
                font-size: 40px;
                font-weight: bold;
                color: #FFF;
                line-height: 56px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            &-price {
                margin-top: 7px;
                height: 46px;
                font-size: 26px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: bold;
                color: #FFF;
                line-height: 46px;
                .money {
                    margin-left: 6px;
                    font-size: 36px;
                    font-weight: bold;
                    span{
                        font-size:26px;
                    }
                }
            }
            &-box {
                margin-top: 45px;
                padding: 50px;
                overflow-y: scroll;
                background: #FFF;
                box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.1);
                border-radius: 20px;
                min-height: 80%;
                height: calc(100% - 260px);
                &-desc {
                    width: 100%;
                    .title {
                        position: relative;
                        font-size: 36px;
                        font-weight: bold;
                        font-family: PingFangSC-Semibold;
                        color: #333;
                        line-height: 40px;
                        padding-left: 20px;
                        margin-bottom: 10px;
                        &::before {
                            line-height: .53333rem;
                            content: "";
                            top: 50%;
                            -webkit-transform: translateY(-50%);
                            transform: translateY(-50%);
                            left: 0;
                            position: absolute;
                            width: 8px;
                            height: 36px;
                            background-color: #2a82fd;
                            border-radius: 4px;
                            display: inline-block;
                        }
                    }
                    div {
                        margin-bottom: 20px;
                        line-height: 30px;
                        width: 100%;
                        color: #666;
                        font-size: 26px;
                        line-height: 29px;
                        word-wrap:break-word;
                    }
                }
                &-video {
                    height: 320px;
                    background: #D8D8D8;
                    .detail-video {
                        width: 100%;
                        height: 320px;
                    }
                }
                &-pdf {
                    margin-top: 30px;
                    // background: #D8D8D8;
                    // border: 1px solid #979797;
                }
            }
            .bottom-btn {
                position: fixed;
                bottom: 109px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: bold;
                width: calc(100% - 180px);
            }
        }
    }
</style>
