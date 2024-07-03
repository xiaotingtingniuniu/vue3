<template>
    <div class="activity-end">
        <div class="banner"></div>
        <div class="app-down">
            <p class="text">您可下载“恒生活APP”<br/>享受其他购物优惠</p>
            <div class="button" @click="onDown">立即下载</div>
        </div>
    </div>
</template>
<script setup>
const router = useRouter()

const onDown = () => {
    router.push('/guide')
}
</script>
<style lang="scss" scoped>
.activity-end {
    position: relative;
    .banner {
        height: 638px;
        background: url('~@assets/activity/fission/activity-end-banner.png') no-repeat;
        background-size: 100% 100%;
    }
    .app-down {
        margin: 14px auto 0;
        overflow: hidden;
        width: 720px;
        height: 425px;
        background: url('~@assets/activity/fission/app-down.png') no-repeat;
        background-size: 100% 100%;
        .text {
            margin: 137px auto 0;
            text-align: center;
            font-size: 34px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 48px;
        }
        .button {
            margin: 39px auto 0;
            width: 612px;
            height: 96px;
            line-height: 96px;
            font-size: 38px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            text-align: center;
            color: #FFF;
            background: url('~@assets/activity/fission/button-bg.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>
