<template>
    <div class="openingResultBox">
        <div class="openingResultHeight">
            <div class="openingResultContent">
                <img src="@/assets/replenishmentImg/failed@2x.png" alt="" class="successImg">
                <div class="successComplete">
                    扫码失败
                </div>
                <van-button color="#FE7E41" class="completeBox" @click="complete">点击重试</van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const complete = () => {
    router.back()
}
</script>
<style lang="scss" scoped>
.openingResultBox{
    background: #fff;
    height: 100%;
    .openingResultHeight{
        height: 1480px;
    }
    .openingResultTitle {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 999;
        width: 750px;
        height: 128px;
        background: #ffffff;
        font-size: 34px;
        text-align: center;
        // margin-top: 56px;
        line-height: 140px;
        .equipment{
            // float: left;
            font-weight: 600;
            color: #000000;
            width: 136px;
            height: 48px;
        }
        .back{
            color: #000;
            float: left;
            margin-left:20px;
            margin-top: 50px;
        }
    }
    .openingResultContent{
        .successImg{
            width: 481px;
            height: 319px;
            margin-top: 153px;
            margin-left: 119px;
            // border: 1px solid #000;
        }
        .successComplete{
            text-align: center;
            font-size: 36px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 610;
            color: #2E2E4D;
            margin-top: 20px;
        }
        .completeBox{
            width: 630px;
            height: 92px;
            border-radius: 46px;
            margin-left: 60px;
            margin-top: 103px;
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 610;
            color: #FFFFFF;
        }
    }
}
</style>
