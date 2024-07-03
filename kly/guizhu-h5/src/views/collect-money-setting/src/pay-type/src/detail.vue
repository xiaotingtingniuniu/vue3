<template>
    <van-overlay :show="props.show" @click="onClose">
        <div class="wrapper" @click.stop>
            <div class="block">
                <img :src="wxPayImg" alt="">
                <van-steps :active="active">
                    <van-step>提交材料</van-step>
                    <van-step>shouliz</van-step>
                    <van-step>买家提货</van-step>
                </van-steps>
            </div>
        </div>
    </van-overlay>
</template>

<script setup>
const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:show'])

const onClose = () => {
    emit('update:show', false)
}

</script>

<style lang="scss" scoped>
.not-data {
    .img-box {
        overflow: hidden;
        img {
            display: block;
            margin: 115px auto 0;
            width: 134px;
            height: 117px;
        }
        .message {
            margin-top: 17px;
            text-align: center;
            font-size: 30px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #191919;
            line-height: 42px;
        }
    }
    .pay-button {
        display: block;
        margin: 100px auto;
        width: 630px;
        background: #FE7E41;
        border-color: #FE7E41;
        border-radius: 46px;
        text-align: center;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #FFF;
        line-height: 92px;
    }
}
</style>
