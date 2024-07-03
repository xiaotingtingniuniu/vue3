<template>
    <div class="openingResultBox">
        <!-- <div class="openingResultTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">开门结果</span>
        </div> -->
        <div class="openingResultHeight">
            <div class="openingResultContent">
                <img src="@/assets/replenishmentImg/openingResult@2x.png" alt="" class="successImg">
                <div class="successComplete">
                    开门成功
                </div>
                <van-button color="#FE7E41" class="completeBox" @click="complete">完成</van-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { appBridge } from '@/utils/bridge'
// import { useRoute, useRouter } from 'vue-router'

// const route = useRoute()
// const router = useRouter()

// const key = route.query.key
// 返回上一级
// const onClickLeft = () => history.back()
const complete = () => {
    // if (key !== null) {
    //     // appBridge('goHome')
    //     router.back()
    // } else {
    //     appBridge('goHome')
    // }
    appBridge('goHome')
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
            width: 212px;
            height: 212px;
            margin-top: 253px;
            margin-left: 269px;
        }
        .successComplete{
            text-align: center;
            font-size: 36px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #2E2E4D;
            margin-top: 20px;
        }
        .completeBox{
            width: 630px;
            height: 92px;
            border-radius: 46px;
            margin-left: 60px;
            margin-top: 190px;
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #FFFFFF;
        }
    }
}
</style>
