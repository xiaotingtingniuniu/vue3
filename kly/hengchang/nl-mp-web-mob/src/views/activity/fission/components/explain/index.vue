<template>
    <div class="explain-dialog">
        <van-overlay :show="props.modelValue" :lock-scroll="false">
            <main class="explain-dialog-container" @click.stop>
                <div class="content" >
                    <header class="head">
                        <h3 class="head-title">{{ props.title }}</h3>
                        <div class="head-close" @click="onClose"></div>
                    </header>
                    <div class="text-container">
                        <p v-html="props.text"></p>
                    </div>
                </div>
            </main>
        </van-overlay>
    </div>
</template>
<script setup>
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: '邀请方活动说明'
    },
    text: {
        type: String,
        default: '暂无说明！！！'
    }
})

const emit = defineEmits(['update:modelValue'])

const onClose = () => {
    emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.explain-dialog {
    .explain-dialog-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        .content {
            width: 678px;
            max-height: 878px;
            background: #FFF8EF;
            border-radius: 30px;
            .head {
                position: relative;
                margin-top: 10px;
                height: 70px;
                line-height: 70px;
                &-title {
                    text-align: center;
                    font-size: 34px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: #7C3312;
                }
                &-close {
                    position: absolute;
                    top: 0;
                    right: 19px;
                    width: 70px;
                    height: 70px;
                    background: url('~@assets/activity/fission/close-icon.png') no-repeat;
                    background-size: 100% 100%;
                }
            }
            .text-container {
                padding: 22px 38px;
                box-sizing: border-box;
                font-size: 26px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #7F3615;
                line-height: 37px;
                max-height: 787px;
                overflow-y: scroll;
                white-space: pre-line;
            }
        }
    }
}
</style>
