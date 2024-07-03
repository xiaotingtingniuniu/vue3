<template>
    <div class="openingResultBox">
        <!-- <div class="openingResultTitle">
            <van-icon name="arrow-left" class="back" @click="onClickLeft" size="20" />
            <span class="equipment">开门结果</span>
        </div> -->
        <div class="openingResultContent">
            <img src="@/assets/replenishmentImg/fail2x.png" alt="" class="successImg">
            <div class="successComplete">
                开门失败
            </div>
            <van-button color="#FE7E41" class="completeBox" @click="complete">点击重试</van-button>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
// 返回上一级
// const onClickLeft = () => history.back()
const complete = () => {
    router.push({
        push: '/open',
        name: 'open'
    })
}
</script>
<style lang="scss" scoped>
.openingResultBox{
    background: #fff;
    height: 100%;
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
            // margin-top: 253px;
            margin-left: 119px;
            margin-left: 269px;
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
            margin-top: 190px;
            font-size: 30px;
            font-family: PingFangSC-Semibold, PingFang SC;
            color: #FFFFFF;
            font-weight: 610;
        }
    }
}
</style>
