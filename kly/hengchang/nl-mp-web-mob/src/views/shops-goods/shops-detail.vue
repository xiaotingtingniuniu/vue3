<template>
    <div class="shops-detail-page" :class="isApp ? 'status-bar-height' : ''">
        <van-nav-bar v-if="isApp" fixed left-arrow z-index="10000" :style="{'background': `rgba(255, 255, 255, ${opacity})`}" :border="false">
            <template #title>
                <div class="shop-title" :style="{'color': opacity < 0.1 ? '#FFFFFF' : '#222222'}">店铺主页</div>
            </template>
            <template #left v-if="opacity < 0.1">
                <div v-if="isApp" class="icon--unselect back" @click="pageBack">
                    <div>
                        <van-icon size="1em" :name="require('@/assets/goods/back-icon.png')" />
                    </div>
                </div>
            </template>
            <template #left v-else>
                <div v-if="isApp" class="icon--unselect back" @click="pageBack">
                    <van-icon size="1em" :name="require('@/assets/goods/back-icon2.png')" />
                </div>
            </template>
        </van-nav-bar>
        <div class="shops-info">
            <van-image radius="6" :src="storeConfig.storeLogo">
                <template v-slot:loading>
                    <van-loading type="spinner" size="20" />
                </template>
            </van-image>
            <div class="info" v-if="storeConfig">
                <div class="shops-title van-ellipsis">{{storeConfig.storeName}}</div>
                <div class="shops-item" v-if="storeConfig.contactNumber">
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/shops/phone.png')" />
                    </div>
                    <div class="text">{{storeConfig.contactNumber}} <span v-if="storeConfig.storeStatus !== 0"><a :href="`tel:${storeConfig.contactNumber}`" style="color: #E05324;">拨打</a></span></div>
                </div>
                <div class="shops-item" v-if="storeConfig.storeAddress">
                    <div class="icon--unselect">
                        <van-icon size="1em" :name="require('@/assets/shops/location.png')" />
                    </div>
                    <div class="text">{{storeConfig.storeAddress}}</div>
                </div>
            </div>
        </div>
        <div class="nodata" v-if="storeConfig.storeStatus === 0">
            <div class="nodata-bg"></div>
            <div class="nodata-tip">店铺已关闭</div>
        </div>
        <template v-else>
            <div class="brief-introduction">
                <div class="brief-introduction--title">店铺简介</div>
                <div class="brief-introduction--content">
                    {{storeConfig.storeIntroduce}}
                </div>
            </div>
            <div class="brief-introduction">
                <div class="brief-introduction--title">门店资质</div>
                <div class="brief-introduction--content" v-for="(item, index) in storeConfig.storeQualificationList" :key="index">
                    <van-image fit="contain" :src="item" @click="openImg(item)">
                        <template v-slot:loading>
                            <van-loading type="spinner" size="20" />
                        </template>
                    </van-image>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { shopDetail } from '@/api/shops-goods'
import { ImagePreview } from 'vant'
import { isApp } from '@/utils'
import { pageBack } from '@/utils/composables'
const props = defineProps(['id'])
const storeConfig = ref('')

onMounted(() => {
    shopConfig()
})

const shopConfig = async () => {
    const data = await shopDetail({ id: props.id })
    storeConfig.value = data
}
const openImg = (item) => {
    ImagePreview([item])
}

const opacity = ref(0)
window.addEventListener('scroll', function (e) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    const num = scrollTop / 200
    if (num < 0.1) return (opacity.value = 0)
    opacity.value = num
})
</script>
<style lang="scss" scoped>
.status-bar-height{
    min-height: calc(100vh - 189px - var(--van-status-bar-height)) !important;
    background-size: 101% 380px !important;
    padding-top: 189px !important;
    .shop-title{
        font-size: 34px;
        font-weight: bold;
    }
    :deep(.van-nav-bar){
        padding-top: var(--van-status-bar-height);
        background-color: #fff;
    }
    :deep(.van-nav-bar::after){
        content: initial;
    }
    .back{
        height: 100%;
        display: flex;
        justify-content: center;
        &>div{
            width: 51px;
            height: 51px;
            font-size: 28px;
            background-image: url('../../assets/goods/back-icon-bg.png');
            background-size: 100% 100%;
            .van-icon{
                width: 46px;
                height: 51px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .van-icon{
            width: 46px;
            height: 51px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
}
.shops-detail-page{
    min-height: calc(100vh - 124px);
    background-image: url('../../assets/shops/pagebg.png');
    background-size: 101% 250px;
    background-repeat: no-repeat;
    background-position-x: -1px;
    padding-top: 124px;
    background-color: #F7F7F7;
    .shops-info{
        width: 654px;
        padding: 24px;
        background: #FFFFFF;
        border-radius: 20px;
        margin: 0 auto;
        display: flex;
        .van-image{
            width: 150px;
            height: 150px;
            margin-right: 24px;
        }
        .info{
            flex: 1;
            width: 446px;
            .shops-title{
                font-size: 34px;
                font-weight: bold;
                color: #222222;
                line-height: 48px;
                margin-bottom: 28px;
            }
            .shops-item{
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                .icon--unselect{
                    font-size: 24px;
                    margin-right: 9px;
                }
                .text{
                    font-size: 24px;
                    font-weight: 400;
                    color: #555555;
                    span{
                        font-size: 22px;
                        font-weight: bold;
                        color: #E05324;
                        line-height: 22px;
                        margin-left: 19px;
                    }
                }
            }
        }
    }
    .nodata{
        .nodata-bg{
            width: 301px;
            height: 202px;
            background-image: url('../../assets/shops/nodata.png');
            background-size: 100% 100%;
            margin: 123px auto;
        }
        .nodata-tip{
            font-size: 26px;
            font-weight: bold;
            color: #222222;
            margin-top: 45px;
            text-align: center;
        }
    }
    .brief-introduction{
        padding: 24px;
        margin: 20px 24px 0;
        background-color: #fff;
        border-radius: 20px;
        .brief-introduction--title{
            font-size: 28px;
            font-weight: bold;
            color: #191919;
            line-height: 28px;
        }
        .brief-introduction--content{
            margin-top: 20px;
            font-size: 24px;
            font-weight: 400;
            color: #555555;
        }
    }
}
</style>
